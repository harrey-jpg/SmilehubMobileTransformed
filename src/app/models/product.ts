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
}

export interface ShippingAddress {
  addressId?: string;
  label: string;
  recipient: string;
  phone: string;
  city: string;
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
