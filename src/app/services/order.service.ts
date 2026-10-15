import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  Timestamp,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';

import {
  firebaseAuth,
  firestore
} from './firebase';



@Injectable({
  providedIn: 'root'
})
export class OrderService {



  /* =========================
     PLACE ORDER
     ========================= */

  // Spark/free-plan checkout: create the same Firestore /orders documents as
  // the website. This is suitable for a school demo with manual admin review.
  // A trusted backend is REQUIRED before processing real financial orders,
  // because client-side totals and stock checks can be bypassed by a modified app.
  private pendingRequest?: { fingerprint: string; id: string };

  async placeOrder(payload: any): Promise<{ orderId: string; orderNumber: string }> {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('Please sign in before placing an order.');

    const rawItems: any[] = Array.isArray(payload?.items) ? payload.items : [];
    if (!rawItems.length || rawItems.length > 50) {
      throw new Error('Choose between 1 and 50 products before checking out.');
    }
    const requested = new Map<number, number>();
    for (const item of rawItems) {
      const id = Number(item?.productId);
      const qty = Number(item?.quantity);
      if (!Number.isSafeInteger(id) || id < 1 || !Number.isSafeInteger(qty) || qty < 1 || qty > 100) {
        throw new Error('The cart contains an invalid product or quantity.');
      }
      const next = (requested.get(id) || 0) + qty;
      if (next > 100) throw new Error('Too many units of the same product.');
      requested.set(id, next);
    }

    const payment = String(payload?.paymentMethod || '').trim();
    if (!['Cash on Delivery', 'GCash (SmileHub QR)'].includes(payment)) {
      throw new Error('Choose Cash on Delivery or GCash (SmileHub QR).');
    }
    const delivery = String(payload?.deliveryMethod || '').trim();
    if (!['Standard Delivery', 'Express Delivery'].includes(delivery)) {
      throw new Error('Please select a valid delivery method.');
    }
    const coupon = String(payload?.couponCode || '').trim();
    if (coupon && coupon !== 'SMILE10') throw new Error('Invalid discount code.');

    const rawAddress = payload?.shippingAddress || {};
    const address = {
      label: String(rawAddress.label || 'Home').slice(0, 80),
      recipient: String(rawAddress.recipient || '').trim().slice(0, 120),
      phone: String(rawAddress.phone || '').trim().slice(0, 40),
      street: String(rawAddress.street || '').trim().slice(0, 250),
      barangay: String(rawAddress.barangay || '').trim().slice(0, 120),
      city: String(rawAddress.city || '').trim().slice(0, 120),
      province: String(rawAddress.province || '').trim().slice(0, 120),
      postalCode: String(rawAddress.postalCode || '').trim().slice(0, 20),
      fullAddress: String(rawAddress.fullAddress || '').trim().slice(0, 500)
    };
    if (!address.recipient || !address.phone || !address.city || (!address.street && !address.fullAddress)) {
      throw new Error('Please complete your delivery address and contact number.');
    }

    const fingerprintBody = { uid: user.uid, products: [...requested], payment, delivery, coupon, address };
    const fingerprintBytes = await crypto.subtle.digest(
      'SHA-256', new TextEncoder().encode(JSON.stringify(fingerprintBody))
    );
    const fingerprint = [...new Uint8Array(fingerprintBytes)]
      .map(value => value.toString(16).padStart(2, '0')).join('');
    const key = `smilehubPendingOrder:${user.uid}`;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || 'null');
      if (saved?.fingerprint === fingerprint && typeof saved.id === 'string') {
        this.pendingRequest = saved;
      }
    } catch { /* No local retry record. */ }
    if (this.pendingRequest?.fingerprint !== fingerprint) {
      this.pendingRequest = { fingerprint, id: crypto.randomUUID() };
    }
    try { localStorage.setItem(key, JSON.stringify(this.pendingRequest)); } catch { /* Optional retry persistence. */ }
    if (firebaseAuth.currentUser?.uid !== user.uid) throw new Error('Please sign in again.');

    const id = this.pendingRequest!.id;
    const orderRef = doc(firestore, 'orders', id);
    const orderNumber = `SH-${id.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
    const round = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
    const response = await runTransaction(firestore, async tx => {
      // Deterministic document id prevents duplicate orders on a retry.
      const existing = await tx.get(orderRef);
      if (existing.exists()) {
        if (existing.data()['userId'] !== user.uid || existing.data()['requestFingerprint'] !== fingerprint) {
          throw new Error('Order retry conflict. Please contact SmileHub support.');
        }
        return { orderId: id, orderNumber: String(existing.data()['orderNumber'] || orderNumber) };
      }

      const items: any[] = [];
      for (const [productId, quantity] of requested) {
        const productSnap = await tx.get(doc(firestore, 'products', String(productId)));
        if (!productSnap.exists()) throw new Error('A product is no longer available. Refresh your cart.');
        const product = productSnap.data();
        const price = Number(product['price']);
        const stock = Number(product['stock']);
        if (!Number.isFinite(price) || price < 0) throw new Error('Product pricing is unavailable.');
        if (!Number.isSafeInteger(stock) || stock < quantity) {
          throw new Error(`Insufficient stock for ${String(product['name'] || 'an item')}.`);
        }
        items.push({
          productId,
          name: String(product['name'] || '').slice(0, 200),
          brand: String(product['brand'] || '').slice(0, 120),
          category: String(product['category'] || '').slice(0, 120),
          price, quantity,
          lineTotal: round(price * quantity)
        });
      }
      const subtotal = round(items.reduce((sum, item) => sum + item.lineTotal, 0));
      const shippingFee = delivery === 'Express Delivery' ? 220 : subtotal >= 3000 ? 0 : 120;
      const discount = coupon === 'SMILE10' ? round(Math.min(subtotal * 0.10, 349.9)) : 0;
      const total = round(subtotal + shippingFee - discount);
      for (const [name, correct] of Object.entries({ subtotal, shippingFee, discount, total })) {
        if (!Number.isFinite(Number(payload?.[name])) || Math.abs(Number(payload[name]) - correct) > 0.02) {
          throw new Error('Prices or delivery fees have changed. Refresh checkout and review the total.');
        }
      }

      const isGcash = payment === 'GCash (SmileHub QR)';
      const status = isGcash ? 'Pending Payment' : 'Pending';
      const customer = String(user.displayName || address.recipient).trim().slice(0, 120);
      tx.set(orderRef, {
        orderId: id,
        number: orderNumber, orderNumber,
        requestFingerprint: fingerprint,
        userId: user.uid,
        customer, customerName: customer,
        customerEmail: user.email || '', email: user.email || '',
        items,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        shippingAddress: address,
        address: address.fullAddress || [address.street, address.barangay, address.city, address.province].filter(Boolean).join(', '),
        deliveryMethod: delivery,
        paymentMethod: payment,
        payment: payment,
        paymentStatus: 'unpaid',
        gcashPaymentStatus: isGcash ? 'Pending Payment' : 'Not Applicable',
        subtotal, shippingFee, shipping: shippingFee, discount, total,
        status,
        statusHistory: [{ status, createdAt: Timestamp.now() }],
        source: 'mobile',
        createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      });
      // Intentionally does NOT alter product stock: customers cannot write
      // trusted inventory changes on Spark. Staff must confirm inventory.
      return { orderId: id, orderNumber };
    });

    this.pendingRequest = undefined;
    try { localStorage.removeItem(key); } catch { /* Ignore local-storage failures. */ }
    return response;
  }

  private pendingGcash = new Map<string, Promise<void>>();

  submitGcashReference(orderId: string, reference: string): Promise<void> {
    if (this.pendingGcash.has(orderId)) return this.pendingGcash.get(orderId)!;
    const user = firebaseAuth.currentUser;
    const clean = String(reference || '').trim().toUpperCase();
    if (!user) return Promise.reject(new Error('Please sign in first.'));
    if (!/^[A-Z0-9-]{6,40}$/.test(clean)) return Promise.reject(new Error('Enter a valid GCash reference number (6–40 letters, numbers or dashes).'));
    const claimRef = doc(firestore, 'gcash_payment_claims', orderId);
    const task = runTransaction(firestore, async tx => {
      const orderSnap = await tx.get(doc(firestore, 'orders', orderId));
      const existing = await tx.get(claimRef);
      const order = orderSnap.exists() ? orderSnap.data() : null;
      if (!order || order['userId'] !== user.uid || firebaseAuth.currentUser?.uid !== user.uid) throw new Error('Order not found for this account.');
      if (!['GCash', 'GCash (SmileHub QR)'].includes(order['paymentMethod'] || order['payment']) || String(order['paymentStatus']).toLowerCase() === 'paid' || order['gcashPaymentStatus'] === 'Paid' || order['status'] === 'Cancelled') throw new Error('This order does not accept a new GCash reference.');
      if (existing.exists()) {
        if (existing.data()['status'] !== 'Rejected') throw new Error('Your GCash reference has already been submitted. Please wait for staff verification.');
        tx.update(claimRef, { reference: clean, status: 'For Verification', reason: '', submittedAt: serverTimestamp() });
      } else tx.set(claimRef, { orderId, userId: user.uid, reference: clean, status: 'For Verification', submittedAt: serverTimestamp() });
      const number = String(order['orderNumber'] || order['number'] || orderId);
      tx.set(doc(firestore, 'notifications', 'gcash-submitted-' + orderId + '-' + clean), {
        userId: user.uid, orderId, orderNumber: number, kind: 'order', type: 'payment_submitted',
        title: 'GCash reference submitted',
        message: 'Order ' + number + ': your reference is awaiting staff verification. Payment is not confirmed yet.',
        read: false, createdAt: serverTimestamp()
      });
    });
    this.pendingGcash.set(orderId, task);
    task.then(() => this.pendingGcash.delete(orderId), () => this.pendingGcash.delete(orderId));
    return task;
  }

  watchGcashReference(orderId: string): Observable<any | null> {
    return new Observable(subscriber => {
      if (!firebaseAuth.currentUser) {
        subscriber.error(new Error('Please sign in first.'));
        return;
      }
      return onSnapshot(doc(firestore, 'gcash_payment_claims', orderId), { includeMetadataChanges: true }, snap => {
        if (snap.metadata.hasPendingWrites) return;
        subscriber.next(snap.metadata.fromCache ? { unavailable: true } : snap.exists() ? { id: snap.id, ...snap.data() } : null);
      }, error => subscriber.error(error));
    });
  }

  async cancelOrder(orderId: string, _reason = 'Changed my mind'): Promise<void> {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('Please sign in first.');
    const orderRef = doc(firestore, 'orders', orderId);
    const snap = await getDoc(orderRef);
    if (!snap.exists() || snap.data()['userId'] !== user.uid) throw new Error('Order not found.');
    if (!['Pending', 'Pending Payment'].includes(String(snap.data()['status'] || ''))) {
      throw new Error('Only pending orders can be cancelled.');
    }
    await updateDoc(orderRef, { status: 'Cancelled', updatedAt: serverTimestamp() });
  }

  canCancelStatus(
    status: string
  ):
    boolean {


    return [

      'Pending',

      'Pending Payment'

    ]
      .includes(
        String(
          status || ''
        )
          .trim()
      );

  }



  /* =========================
     UPDATE ORDER STATUS
     ========================= */

  async updateOrderStatus(

    orderId: string,

    status: string

  ):
    Promise<void> {


    const cleanStatus =
      this.normalizeOrderStatus(
        status
      );


    if (
      ![
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
      ].includes(
        cleanStatus
      )
    ) {


      throw new Error(
        'Invalid order status.'
      );


    }


    const orderRef =
      doc(
        firestore,
        'orders',
        orderId
      );


    const before =
      await getDoc(
        orderRef
      );


    await updateDoc(

      orderRef,

      {

        status:
          cleanStatus,

        statusHistory:

          arrayUnion({

            status:
              cleanStatus,

            createdAt:
              new Date()

          }),

        updatedAt:
          serverTimestamp()

      }

    );



    /*
     * Notify customer after admin/status update.
     */

    if (
      before.exists()
    ) {


      const orderData =
        before.data();


      const userId =
        String(
          orderData['userId'] || ''
        );


      const orderNumber =
        String(
          orderData['orderNumber']
          ||
          orderId
        );


      if (
        userId
      ) {


        const notification =
          this.statusNotification(
            cleanStatus,
            orderNumber
          );


        await this.createNotificationSafe({

          userId,

          title:
            notification.title,

          message:
            notification.message,

          type:
            cleanStatus === 'Cancelled'
              ? 'order_cancelled'
              : 'order_status',

          orderId,

          orderNumber

        });

      }

    }

  }



  /* =========================
     NORMALIZE ORDER STATUS
     ========================= */

  private normalizeOrderStatus(
    status: string
  ):
    string {


    const cleanStatus =
      String(
        status || ''
      )
        .trim();


    if (
      cleanStatus === 'Packed'
      ||
      cleanStatus === 'Out for Delivery'
    ) {


      return 'Shipped';


    }


    return cleanStatus;


  }



  /* =========================
     STATUS NOTIFICATION TEXT
     ========================= */

  private statusNotification(
    status: string,
    orderNumber: string
  ):
    {
      title: string;
      message: string;
    } {


    switch (
      status
    ) {


      case 'Processing':

        return {

          title:
            'Order Processing',

          message:
            `Your order ${orderNumber} is now being processed.`

        };


      case 'Shipped':

        return {

          title:
            'Order Shipped',

          message:
            `Your order ${orderNumber} has been shipped.`

        };


      case 'Delivered':

        return {

          title:
            'Order Delivered',

          message:
            `Your order ${orderNumber} has been delivered.`

        };


      case 'Cancelled':

        return {

          title:
            'Order Cancelled',

          message:
            `Your order ${orderNumber} has been cancelled.`

        };


      default:

        return {

          title:
            'Order Updated',

          message:
            `Your order ${orderNumber} is now ${status}.`

        };

    }

  }



  /* =========================
     CREATE NOTIFICATION
     ========================= */

  private async createNotificationSafe(
    payload: {
      userId: string;
      title: string;
      message: string;
      type: string;
      orderId?: string;
      orderNumber?: string;
    }
  ):
    Promise<void> {


    try {


      const notificationRef =
        doc(
          collection(
            firestore,
            'notifications'
          )
        );


      await setDoc(

        notificationRef,

        {

          notificationId:
            notificationRef.id,

          userId:
            payload.userId,

          title:
            payload.title,

          message:
            payload.message,

          type:
            payload.type,

          orderId:
            payload.orderId || '',

          orderNumber:
            payload.orderNumber || '',

          read:
            false,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp()

        }

      );


    } catch (
      error
    ) {


      /*
       * Notifications should not break
       * an otherwise successful order action.
       */

      console.error(
        'Unable to create notification:',
        error
      );

    }

  }



  /* =========================
     LIST MY ORDERS
     ========================= */

  async listMyOrders():
    Promise<any[]> {


    const user =
      firebaseAuth.currentUser;


    if (!user) {

      throw new Error(
        'You must log in first.'
      );

    }


    const snap =
      await getDocs(

        query(

          collection(
            firestore,
            'orders'
          ),

          where(
            'userId',
            '==',
            user.uid
          )

        )

      );


    return snap.docs

      .map(

        d => ({

          id:
            d.id,

          ...d.data()

        })

      )

      .sort(

        (
          a: any,
          b: any
        ) => {


          const at =
            a.createdAt
              ?.toMillis?.()
            ||
            0;


          const bt =
            b.createdAt
              ?.toMillis?.()
            ||
            0;


          return bt - at;

        }

      );

  }



  /* =========================
     GET ORDER
     ========================= */

  async getOrder(
    orderId: string
  ):
    Promise<any | null> {


    const snap =
      await getDoc(

        doc(
          firestore,
          'orders',
          orderId
        )

      );


    return snap.exists()

      ? {

          id:
            snap.id,

          ...snap.data()

        }

      : null;

  }



  /* =========================
     WATCH MY ORDERS
     ========================= */

  watchMyOrders():
    Observable<any[]> {


    return new Observable(

      subscriber => {


        const user =
          firebaseAuth.currentUser;


        if (!user) {


          subscriber.error(

            new Error(
              'You must log in first.'
            )

          );


          return;

        }


        const q =
          query(

            collection(
              firestore,
              'orders'
            ),

            where(
              'userId',
              '==',
              user.uid
            )

          );


        const unsub =
          onSnapshot(

            q,

            snap => {


              const orders =

                snap.docs

                  .map(

                    d => ({

                      id:
                        d.id,

                      ...d.data()

                    })

                  )

                  .sort(

                    (
                      a: any,
                      b: any
                    ) => {


                      const at =
                        a.createdAt
                          ?.toMillis?.()
                        ||
                        0;


                      const bt =
                        b.createdAt
                          ?.toMillis?.()
                        ||
                        0;


                      return bt - at;

                    }

                  );


              subscriber.next(
                orders
              );

            },


            err =>

              subscriber.error(
                err
              )

          );


        return unsub;

      }

    );

  }



  /* =========================
     WATCH ORDER
     ========================= */

  watchOrder(
    orderId: string
  ):
    Observable<any | null> {


    return new Observable(

      subscriber => {


        const unsub =

          onSnapshot(

            doc(
              firestore,
              'orders',
              orderId
            ),


            snap => {


              subscriber.next(

                snap.exists()

                  ? {

                      id:
                        snap.id,

                      ...snap.data()

                    }

                  : null

              );

            },


            err =>

              subscriber.error(
                err
              )

          );


        return unsub;

      }

    );

  }


}
