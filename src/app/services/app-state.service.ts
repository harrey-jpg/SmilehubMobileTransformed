import { Injectable } from '@angular/core';
import { Product, PaymentMethodItem, ShippingAddress } from '../models/product';
import { smileHubProducts } from '../data/products';

@Injectable({ providedIn: 'root' })
export class AppStateService {
  wishlist = new Set<number>();
  cart = new Map<number, number>();
  couponApplied = false;
  selectedPaymentIndex = 0;
  checkoutAddress: ShippingAddress | null = null;
  darkMode = false;

  paymentMethods: PaymentMethodItem[] = [
    { title: 'Cash on Delivery', subtitle: 'Pay when your order arrives', icon: 'cash-outline', isDefault: true },
    { title: 'GCash', subtitle: '•••• •••• 6789', icon: 'wallet-outline' },
    { title: 'Visa ending 1234', subtitle: 'Expires 08/29', icon: 'card-outline' }
  ];

  constructor() { this.restore(); }

  productById(id: number): Product { return smileHubProducts.find(p => p.id === id) || smileHubProducts[0]; }
  quantityFor(id: number) { return this.cart.get(id) || 0; }
  get cartCount() { return Array.from(this.cart.values()).reduce((a,b) => a+b, 0); }
  get subtotal() { return Array.from(this.cart.entries()).reduce((sum,[id,q]) => sum + this.productById(id).price*q, 0); }
  get shippingFee() { return this.subtotal >= 3000 || this.cart.size === 0 ? 0 : 120; }
  get discount() { return this.couponApplied ? Math.min(this.subtotal * 0.10, 349.90) : 0; }
  get total() { return this.subtotal + this.shippingFee - this.discount; }
  get selectedPayment() { return this.paymentMethods[this.selectedPaymentIndex] || this.paymentMethods[0]; }

  toggleWishlist(id: number) { this.wishlist.has(id) ? this.wishlist.delete(id) : this.wishlist.add(id); this.persist(); }
  addToCart(id: number, quantity = 1) { this.cart.set(id, this.quantityFor(id) + quantity); this.persist(); }
  setCartQuantity(id: number, quantity: number) { quantity <= 0 ? this.cart.delete(id) : this.cart.set(id, quantity); this.persist(); }
  removeFromCart(id: number) { this.cart.delete(id); this.persist(); }
  applyCoupon(code: string) { this.couponApplied = code.trim().toUpperCase() === 'SMILE10'; this.persist(); return this.couponApplied; }
  selectPayment(index: number) { this.selectedPaymentIndex = index; this.persist(); }
  addPaymentMethod(method: PaymentMethodItem) { this.paymentMethods.push(method); this.selectedPaymentIndex = this.paymentMethods.length - 1; this.persist(); }
  clearCartAfterOrder() { this.cart.clear(); this.couponApplied = false; this.persist(); }
  toggleTheme(enabled?: boolean) { this.darkMode = enabled ?? !this.darkMode; document.body.classList.toggle('dark', this.darkMode); this.persist(); }

  private persist() {
    localStorage.setItem('smilehubState', JSON.stringify({
      wishlist: [...this.wishlist], cart: [...this.cart.entries()], couponApplied: this.couponApplied,
      selectedPaymentIndex: this.selectedPaymentIndex, paymentMethods: this.paymentMethods, darkMode: this.darkMode
    }));
  }
  private restore() {
    try {
      const raw = localStorage.getItem('smilehubState'); if (!raw) return;
      const v = JSON.parse(raw);
      this.wishlist = new Set<number>(v.wishlist || []);
      this.cart = new Map<number, number>(v.cart || []);
      this.couponApplied = !!v.couponApplied;
      this.selectedPaymentIndex = Number(v.selectedPaymentIndex || 0);
      if (Array.isArray(v.paymentMethods) && v.paymentMethods.length) this.paymentMethods = v.paymentMethods;
      this.darkMode = !!v.darkMode; document.body.classList.toggle('dark', this.darkMode);
    } catch (_) {}
  }
}
