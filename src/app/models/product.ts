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
