import { Injectable } from '@angular/core';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firestore } from './firebase';
import { Product, PaymentMethodItem, ShippingAddress } from '../models/product';
import { smileHubProducts } from '../data/products';

const assetByCategory: Record<string, string> = {
  'Oral Care': 'assets/products/oral-care.svg',
  'Instruments': 'assets/products/instrument.svg',
  'PPE': 'assets/products/ppe.svg',
  'Restorative': 'assets/products/restorative.svg',
  'Disposables': 'assets/products/disposable.svg',
  'Impression': 'assets/products/impression.svg',
  'Orthodontics': 'assets/products/orthodontic.svg',
  'Rotary': 'assets/products/instrument.svg',
  'Equipment': 'assets/products/equipment.svg',
  'Cosmetic': 'assets/products/restorative.svg'
};

@Injectable({ providedIn: 'root' })
export class AppStateService {
  // Live catalog. Starts with the bundled fallback and is replaced by the
  // shared Firestore catalog (same `products` collection the web admin edits).
  products: Product[] = [...smileHubProducts];
  productsLoadedFromFirestore = false;
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

  constructor() { this.restore(); this.loadProductsFromFirestore(); }

  async loadProductsFromFirestore(): Promise<void> {
    try {
      const snap = await getDocs(query(collection(firestore, 'products'), orderBy('id')));
      if (snap.empty) return;
      const loaded: Product[] = snap.docs.map(d => {
        const v = d.data() as any;
        const category = (v['category'] ?? 'General').toString();
        const stockCount = Number(v['stock'] ?? 0);
        const image = (v['image'] ?? '').toString() || assetByCategory[category] || 'assets/products/default.svg';
        return {
          id: Number(v['id'] ?? 0),
          name: (v['name'] ?? 'Unnamed product').toString(),
          brand: (v['brand'] ?? '').toString(),
          category,
          price: Number(v['price'] ?? 0),
          rating: Number(v['rating'] ?? 4.5),
          stock: stockCount === 0 ? 'Out of stock' : stockCount <= 10 ? 'Low stock' : 'In stock',
          description: (v['description'] ?? '').toString(),
          imageAsset: image,
          sku: (v['sku'] ?? '').toString(),
          stockCount,
          status: (v['status'] ?? '').toString(),
          image,
          specs: Array.isArray(v['specs']) ? v['specs'].map((s: any) => String(s)) : []
        } as Product;
      }).filter(p => p.id);
      if (loaded.length) {
        this.products = loaded;
        this.productsLoadedFromFirestore = true;
        // Drop cart/wishlist ids that no longer exist (e.g. admin deleted
        // a product) so pages never render ghost items.
        const known = new Set(loaded.map(p => p.id));
        let pruned = false;
        for (const id of [...this.cart.keys()]) {
          if (!known.has(id)) { this.cart.delete(id); pruned = true; }
        }
        for (const id of [...this.wishlist]) {
          if (!known.has(id)) { this.wishlist.delete(id); pruned = true; }
        }
        if (pruned) this.persist();
      }
    } catch (_) {
      // Offline or denied: keep the bundled fallback catalog.
    }
  }

  getCategories(): string[] {
    const seen = new Set<string>();
    for (const p of this.products) if (p.category) seen.add(p.category);
    const cats = [...seen].sort();
    return ['All', ...cats];
  }

  productById(id: number): Product { return this.products.find(p => p.id === id) || this.products[0] || smileHubProducts[0]; }
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
