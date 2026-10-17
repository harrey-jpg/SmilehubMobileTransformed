export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  rating: number;
  stock: string;
  description: string;
  imageAsset: string;
  // Shared Firestore catalog fields (web/admin). Optional so the bundled
  // fallback catalog keeps working offline.
  sku?: string;
  stockCount?: number;
  status?: string;
  image?: string;
  specs?: string[];
  firmnessOptions?: Firmness[];
}

export interface ShippingAddress {
  addressId?: string;
  label: string;
  recipient: string;
  phone: string;
  city: string;
  province?: string;
  barangay: string;
  street: string;
  postalCode: string;
  fullAddress?: string;
  isDefault?: boolean;
}

export interface PaymentMethodItem {
  title: string;
  subtitle: string;
  icon: string;
  isDefault?: boolean;
}

// Optional variants retain the existing numeric product IDs used by the shared catalog.
export type Firmness = 'Soft' | 'Medium' | 'Hard';
export interface CartVariant { firmness: Firmness | ''; quantity: number; }
export const FIRMNESS_OPTIONS: readonly Firmness[] = ['Soft', 'Medium', 'Hard'];

export function isFirmness(value: unknown): value is Firmness {
  return typeof value === 'string' && FIRMNESS_OPTIONS.includes(value as Firmness);
}

export function firmnessOptionsFor(product?: { name?: string; firmnessOptions?: unknown } | null): Firmness[] {
  if (!product) return [];
  if (Array.isArray(product.firmnessOptions)) {
    return [...new Set(product.firmnessOptions.filter(isFirmness))];
  }
  return /tooth\s*brush/i.test(String(product.name || '')) ? [...FIRMNESS_OPTIONS] : [];
}

/** Reconcile older carts and a quantity edited by the existing web storefront. */
export function normalizeCartVariants(
  item: { quantity?: number; variants?: CartVariant[] },
  defaultFirmness: Firmness | '' = ''
): CartVariant[] {
  const total = Number(item.quantity);
  if (!Number.isSafeInteger(total) || total <= 0) return [];
  const result: CartVariant[] = [];
  let remaining = total;
  for (const variant of Array.isArray(item.variants) ? item.variants : []) {
    if (!variant || !(variant.firmness === '' || isFirmness(variant.firmness))) continue;
    const quantity = Number(variant.quantity);
    if (!Number.isSafeInteger(quantity) || quantity <= 0) continue;
    const accepted = Math.min(quantity, remaining);
    if (!accepted) break;
    const firmness = variant.firmness || defaultFirmness;
    const existing = result.find(row => row.firmness === firmness);
    if (existing) existing.quantity += accepted;
    else result.push({ firmness, quantity: accepted });
    remaining -= accepted;
  }
  if (remaining) {
    const firmness = result[0]?.firmness || defaultFirmness;
    const existing = result.find(row => row.firmness === firmness);
    if (existing) existing.quantity += remaining;
    else result.push({ firmness, quantity: remaining });
  }
  return result;
}
