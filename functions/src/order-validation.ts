export function normalizeItems(value: unknown): Array<{ productId: number; quantity: number }> {
  if (!Array.isArray(value) || value.length === 0 || value.length > 100) throw new Error('Choose between 1 and 100 order items.');
  const merged = new Map<number, number>();
  for (const item of value) {
    const id = item?.productId;
    const quantity = item?.quantity;
    if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(quantity) || quantity <= 0) throw new Error('Invalid product or quantity.');
    const total = (merged.get(id) || 0) + quantity;
    if (!Number.isSafeInteger(total)) throw new Error('Quantity is too large.');
    merged.set(id, total);
  }
  return [...merged].map(([productId, quantity]) => ({ productId, quantity }));
}

export function mobileTotals(subtotal: number, delivery: string, coupon: string) {
  if (!Number.isFinite(subtotal) || subtotal < 0) throw new Error('Invalid product prices.');
  if (!['Standard Delivery', 'Express Delivery'].includes(delivery)) throw new Error('Select a valid delivery method.');
  if (coupon && coupon !== 'SMILE10') throw new Error('Invalid coupon.');
  const rounded = Math.round(subtotal * 100) / 100;
  const shippingFee = delivery === 'Express Delivery' ? 220 : rounded >= 3000 ? 0 : 120;
  const discount = coupon === 'SMILE10' ? Math.round(Math.min(rounded * 0.1, 349.9) * 100) / 100 : 0;
  return { subtotal: rounded, shippingFee, discount, total: Math.round((rounded + shippingFee - discount) * 100) / 100 };
}
