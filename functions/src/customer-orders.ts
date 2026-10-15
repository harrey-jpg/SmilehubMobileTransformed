import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import { mobileTotals, normalizeItems } from './order-validation';
import { createHash } from 'node:crypto';
import { onDocumentUpdated } from 'firebase-functions/v2/firestore';

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export const mobilePlaceOrder = onCall({ region: 'us-central1' }, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Please sign in before placing an order.');
  const uid = request.auth.uid;
  const data = request.data || {};
  const requestId = text(data.requestId, 80);
  if (!/^[a-zA-Z0-9-]{16,80}$/.test(requestId)) throw new HttpsError('invalid-argument', 'Invalid order request.');
  let requested;
  try { requested = normalizeItems(data.items); } catch (error) { throw new HttpsError('invalid-argument', (error as Error).message); }
  const address = data.shippingAddress || {};
  const shippingAddress = Object.fromEntries(['label', 'recipient', 'phone', 'city', 'province', 'barangay', 'street', 'postalCode', 'fullAddress'].map(key => [key, text(address[key], key === 'fullAddress' ? 1000 : 200)]));
  if (!shippingAddress.recipient || !shippingAddress.phone || !shippingAddress.city || !shippingAddress.street || !shippingAddress.barangay || !/^\d{4}$/.test(shippingAddress.postalCode)) throw new HttpsError('invalid-argument', 'Complete your shipping address.');
  const paymentMethod = text(data.paymentMethod, 120);
  if (!paymentMethod) throw new HttpsError('invalid-argument', 'Select a payment method.');
  const fingerprint = createHash('sha256').update(JSON.stringify({ requested, shippingAddress, paymentMethod, deliveryMethod: data.deliveryMethod, couponCode: data.couponCode })).digest('hex');
  const db = getFirestore();
  const orderRef = db.collection('orders').doc(`mobile-${uid}-${requestId}`);
  return db.runTransaction(async transaction => {
    const existing = await transaction.get(orderRef);
    if (existing.exists) {
      const receipt = await transaction.get(db.collection('order_inventory').doc(orderRef.id));
      if (!receipt.exists || receipt.data()!.userId !== uid || receipt.data()!.requestFingerprint !== fingerprint) throw new HttpsError('failed-precondition', 'This request already belongs to another order. Please refresh checkout.');
      return { orderId: orderRef.id, orderNumber: existing.data()!.orderNumber };
    }
    const profile = await transaction.get(db.collection('users').doc(uid));
    if (profile.data()?.status === 'suspended') throw new HttpsError('permission-denied', 'This account cannot place orders.');
    const products = [];
    for (const item of requested) {
      const ref = db.collection('products').doc(String(item.productId));
      const snapshot = await transaction.get(ref);
      if (!snapshot.exists) throw new HttpsError('failed-precondition', 'An item is no longer available. Refresh your cart.');
      const product = snapshot.data()!;
      if (!Number.isSafeInteger(product.stock) || product.stock < item.quantity) throw new HttpsError('failed-precondition', `Not enough stock for ${text(product.name, 200)}.`);
      if (!Number.isFinite(product.price) || product.price < 0) throw new HttpsError('failed-precondition', 'Product pricing is unavailable.');
      products.push({ ref, product, item });
    }
    const items = products.map(({ product, item }) => ({ ...item, name: text(product.name, 200), brand: text(product.brand, 120), category: text(product.category, 120), price: product.price, lineTotal: Math.round(product.price * item.quantity * 100) / 100 }));
    let totals;
    try { totals = mobileTotals(items.reduce((sum, item) => sum + item.lineTotal, 0), text(data.deliveryMethod, 40), text(data.couponCode, 40)); }
    catch (error) { throw new HttpsError('invalid-argument', (error as Error).message); }
    for (const key of ['subtotal', 'shippingFee', 'discount', 'total'] as const) {
      if (!Number.isFinite(data[key]) || Math.abs(data[key] - totals[key]) > 0.011) throw new HttpsError('failed-precondition', 'Prices have changed. Refresh checkout and review the total.');
    }
    const orderNumber = `SH-${requestId.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    for (const { ref, product, item } of products) transaction.update(ref, { stock: product.stock - item.quantity, updatedAt: FieldValue.serverTimestamp() });
    transaction.set(orderRef, { orderId: orderRef.id, orderNumber, requestFingerprint: fingerprint, userId: uid, customerEmail: request.auth!.token.email || '', items, itemCount: items.reduce((sum, item) => sum + item.quantity, 0), shippingAddress, paymentMethod, paymentStatus: 'unpaid', gcashPaymentStatus: ['GCash', 'GCash (SmileHub QR)'].includes(paymentMethod) ? 'Pending Payment' : 'Not Applicable', deliveryMethod: data.deliveryMethod, ...totals, status: 'Pending', statusHistory: [{ status: 'Pending', createdAt: Timestamp.now() }], source: 'mobile', createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
    // This private server-written ledger is the proof that stock was reserved.
    // Customer-created order fields alone must never authorize a stock increase.
    transaction.set(db.collection('order_inventory').doc(orderRef.id), { userId: uid, items: requested, requestFingerprint: fingerprint, restored: false, createdAt: FieldValue.serverTimestamp() });
    transaction.set(db.collection('notifications').doc(`placed-${orderRef.id}`), { userId: uid, title: 'Order Placed', message: `Your order ${orderNumber} has been placed successfully.`, type: 'order_placed', orderId: orderRef.id, orderNumber, read: false, createdAt: FieldValue.serverTimestamp() });
    return { orderId: orderRef.id, orderNumber };
  });
});

export const mobileCancelOrder = onCall({ region: 'us-central1' }, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Please sign in first.');
  const uid = request.auth.uid;
  const orderId = text(request.data?.orderId, 250);
  if (!orderId || orderId.includes('/')) throw new HttpsError('invalid-argument', 'Invalid order.');
  const db = getFirestore(), ref = db.collection('orders').doc(orderId);
  await db.runTransaction(async transaction => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) throw new HttpsError('not-found', 'Order not found.');
    const order = snapshot.data()!;
    if (order.userId !== uid) throw new HttpsError('permission-denied', 'You cannot cancel this order.');
    if (order.status === 'Cancelled') return;
    const claim = await transaction.get(db.collection('gcash_payment_claims').doc(orderId));
    if (String(order.paymentStatus || '').toLowerCase() === 'paid' || order.gcashPaymentStatus === 'Paid' || claim.exists) {
      throw new HttpsError('failed-precondition', 'This payment needs support assistance before cancellation.');
    }
    if (!['Pending', 'Processing'].includes(order.status)) throw new HttpsError('failed-precondition', 'This order can no longer be cancelled.');
    const inventoryRef = db.collection('order_inventory').doc(orderId);
    const inventory = await transaction.get(inventoryRef);
    if (!inventory.exists || inventory.data()!.userId !== uid || inventory.data()!.restored) throw new HttpsError('failed-precondition', 'This older order needs support assistance to cancel and reconcile its stock.');
    let items;
    try { items = normalizeItems(inventory.data()!.items); } catch { throw new HttpsError('failed-precondition', 'This order needs support assistance to cancel.'); }
    const restores = [];
    for (const item of items) {
      const productRef = db.collection('products').doc(String(item.productId));
      const product = await transaction.get(productRef);
      if (!product.exists) continue;
      const stock = product.data()!.stock;
      if (!Number.isSafeInteger(stock) || stock < 0 || !Number.isSafeInteger(stock + item.quantity)) throw new HttpsError('failed-precondition', 'Inventory needs support assistance.');
      restores.push({ ref: productRef, stock: stock + item.quantity });
    }
    for (const restore of restores) transaction.update(restore.ref, { stock: restore.stock, updatedAt: FieldValue.serverTimestamp() });
    transaction.update(inventoryRef, { restored: true, restoredAt: FieldValue.serverTimestamp() });
    transaction.update(ref, { status: 'Cancelled', cancellationReason: text(request.data?.reason, 500) || 'Changed my mind', cancelledBy: uid, cancelledAt: FieldValue.serverTimestamp(), statusHistory: FieldValue.arrayUnion({ status: 'Cancelled', createdAt: Timestamp.now() }), updatedAt: FieldValue.serverTimestamp() });
    transaction.set(db.collection('notifications').doc(`cancelled-${orderId}`), { userId: uid, title: 'Order Cancelled', message: `Your order ${text(order.orderNumber, 100)} has been cancelled successfully.`, type: 'order_cancelled', orderId, orderNumber: text(order.orderNumber, 100), read: false, createdAt: FieldValue.serverTimestamp() });
  });
  return { orderId, status: 'Cancelled' };
});

// Web/admin cancellation uses existing order writes. Restore only inventory
// backed by a server receipt, and never restore again after the callable did it.
export const restoreCancelledOrderInventory = onDocumentUpdated({ document: 'orders/{orderId}', region: 'us-central1' }, async event => {
  if (event.data?.after.data().status !== 'Cancelled' || event.data?.before.data().status === 'Cancelled') return;
  const db = getFirestore(), orderId = event.params.orderId;
  await db.runTransaction(async transaction => {
    const orderRef = db.collection('orders').doc(orderId), inventoryRef = db.collection('order_inventory').doc(orderId);
    const order = await transaction.get(orderRef), inventory = await transaction.get(inventoryRef);
    if (!order.exists || order.data()!.status !== 'Cancelled' || !inventory.exists || inventory.data()!.restored || inventory.data()!.userId !== order.data()!.userId) return;
    const items = normalizeItems(inventory.data()!.items);
    const restores = [];
    for (const item of items) {
      const ref = db.collection('products').doc(String(item.productId)), snapshot = await transaction.get(ref);
      if (!snapshot.exists) continue;
      const stock = snapshot.data()!.stock;
      if (!Number.isSafeInteger(stock) || stock < 0 || !Number.isSafeInteger(stock + item.quantity)) throw new Error('Inventory requires support reconciliation.');
      restores.push({ ref, stock: stock + item.quantity });
    }
    for (const restore of restores) transaction.update(restore.ref, { stock: restore.stock, updatedAt: FieldValue.serverTimestamp() });
    transaction.update(inventoryRef, { restored: true, restoredAt: FieldValue.serverTimestamp() });
    transaction.set(db.collection('notifications').doc(`cancelled-${orderId}`), { userId: order.data()!.userId, title: 'Order Cancelled', message: `Your order ${text(order.data()!.orderNumber, 100)} has been cancelled successfully.`, type: 'order_cancelled', orderId, orderNumber: text(order.data()!.orderNumber, 100), read: false, createdAt: FieldValue.serverTimestamp() });
  });
});
