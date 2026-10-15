import { Injectable } from '@angular/core';
import { CustomerSyncService, SharedListItem } from './customer-sync.service';
import { onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore';

import {
  collection,
  getDocs,
  orderBy,
  query
} from 'firebase/firestore';

import { firestore } from './firebase';

import {
  Product,
  PaymentMethodItem,
  ShippingAddress
} from '../models/product';

import { smileHubProducts } from '../data/products';


const assetByCategory:
  Record<string, string> = {

  'Oral Care':
    'assets/products/oral-care.svg',

  'Instruments':
    'assets/products/instrument.svg',

  'PPE':
    'assets/products/ppe.svg',

  'Restorative':
    'assets/products/restorative.svg',

  'Disposables':
    'assets/products/disposable.svg',

  'Impression':
    'assets/products/impression.svg',

  'Orthodontics':
    'assets/products/orthodontic.svg',

  'Rotary':
    'assets/products/instrument.svg',

  'Equipment':
    'assets/products/equipment.svg',

  'Cosmetic':
    'assets/products/restorative.svg'

};


const BUILT_IN_PAYMENT_METHODS: PaymentMethodItem[] = [
  {
    title: 'Cash on Delivery',
    subtitle: 'Pay when your order arrives',
    icon: 'cash-outline',
    isDefault: true
  },
  {
    title: 'GCash (SmileHub QR)',
    subtitle: 'Scan the SmileHub QR after placing your order',
    icon: 'qr-code-outline',
    isDefault: true
  }
];

@Injectable({
  providedIn: 'root'
})
export class AppStateService {


  products:
    Product[] = [
      ...smileHubProducts
    ];


  productsLoadedFromFirestore =
    false;


  wishlist =
    new Set<number>();


  cart =
    new Map<number, number>();


  couponApplied =
    false;


  selectedPaymentIndex =
    0;


  checkoutAddress:
    ShippingAddress | null = null;


  darkMode =
    false;


  recentlyViewedIds:
    number[] = [];


  private readonly maxRecentlyViewed = 6;



  /* =========================
     PAYMENT METHODS
     ========================= */

  paymentMethods: PaymentMethodItem[] =
    BUILT_IN_PAYMENT_METHODS.map(method => ({ ...method }));


  constructor(public customerSync: CustomerSyncService) {


    this.restore();
    // Keep an unattributed legacy cache for recovery; never upload it to an arbitrary account.
    try {
      const legacy = localStorage.getItem('smilehubState');
      if (legacy && !JSON.parse(legacy).syncVersion && !localStorage.getItem('smilehubStateBeforeSync')) localStorage.setItem('smilehubStateBeforeSync', legacy);
    } catch (error) { console.warn('Could not back up the legacy shopping cache', error); }
    this.customerSync.connect((name, items) => {
      const valid = items.filter(item => Number.isInteger(Number(item.id)) && Number(item.id) > 0);
      if (name === 'carts') this.cart = new Map(valid.filter(item => Number.isInteger(Number(item.quantity)) && Number(item.quantity) > 0).map(item => [Number(item.id), Number(item.quantity)]));
      else this.wishlist = new Set(valid.map(item => Number(item.id)));
      this.persist();
    }, methods => {
      const selectedTitle = this.selectedPayment?.title;
      this.paymentMethods = [
        ...BUILT_IN_PAYMENT_METHODS.map(method => ({ ...method })),
        ...methods.filter(method =>
          !method.isDefault &&
          !BUILT_IN_PAYMENT_METHODS.some(builtIn => builtIn.title === method.title)
        )
      ];
      this.selectedPaymentIndex = Math.max(0, this.paymentMethods.findIndex(method => method.title === selectedTitle));
      this.persist();
    });
    onSnapshot(query(collection(firestore, 'products'), orderBy('id')), snapshot => { void this.loadProductsFromFirestore(snapshot); }, error => console.warn('Catalog sync unavailable', error));



  }



  /* =========================
     LOAD PRODUCTS
     ========================= */

  async loadProductsFromFirestore(snapshot?: QuerySnapshot<DocumentData>):
    Promise<void> {


    try {


      const snap =
        snapshot ?? await getDocs(

          query(

            collection(
              firestore,
              'products'
            ),

            orderBy('id')

          )

        );




      const loaded:
        Product[] = snap.docs

          .map(document => {


            const value =
              document.data() as any;


            const category =
              (
                value['category']
                ?? 'General'
              ).toString();


            const stockCount =
              Number(
                value['stock'] ?? 0
              );


            const image =
              (
                value['image'] ?? ''
              ).toString()

              ||

              assetByCategory[
                category
              ]

              ||

              'assets/products/default.svg';


            return {


              id:
                Number(
                  value['id'] ?? 0
                ),


              name:
                (
                  value['name']
                  ?? 'Unnamed product'
                ).toString(),


              brand:
                (
                  value['brand']
                  ?? ''
                ).toString(),


              category,


              price:
                Number(
                  value['price'] ?? 0
                ),


              rating:
                Number(
                  value['rating'] ?? 4.5
                ),


              stock:
                stockCount === 0

                  ? 'Out of stock'

                  : stockCount <= 10

                    ? 'Low stock'

                    : 'In stock',


              description:
                (
                  value['description']
                  ?? ''
                ).toString(),


              imageAsset:
                image,


              sku:
                (
                  value['sku']
                  ?? ''
                ).toString(),


              stockCount,


              status:
                (
                  value['status']
                  ?? ''
                ).toString(),


              image,


              specs:
                Array.isArray(
                  value['specs']
                )

                  ? value['specs']
                      .map(
                        (item: any) =>
                          String(item)
                      )

                  : []


            } as Product;


          })

          .filter(
            product =>
              product.id
          );




      this.products =
        loaded;


      this.productsLoadedFromFirestore =
        true;



      /*
       * Remove cart/wishlist products
       * deleted from Firestore.
       */

      const known =
        new Set(
          loaded.map(
            product =>
              product.id
          )
        );


      let pruned =
        false;


      for (
        const id
        of [...this.cart.keys()]
      ) {


        if (!known.has(id)) {


          this.cart.delete(id);

          pruned = true;

        }

      }


      for (
        const id
        of [...this.wishlist]
      ) {


        if (!known.has(id)) {


          this.wishlist.delete(id);

          pruned = true;

        }

      }


      const recentBefore =
        this.recentlyViewedIds.length;


      this.recentlyViewedIds =
        this.recentlyViewedIds

          .filter(
            id =>
              known.has(id)
          )

          .slice(
            0,
            this.maxRecentlyViewed
          );


      if (
        this.recentlyViewedIds.length !==
        recentBefore
      ) {


        pruned = true;

      }


      if (pruned) {

        this.persist();

      }


    } catch {


      /*
       * Offline / denied:
       * keep bundled catalog.
       */

    }

  }



  /* =========================
     CATEGORIES
     ========================= */

  getCategories():
    string[] {


    const seen =
      new Set<string>();


    for (
      const product
      of this.products
    ) {


      if (product.category) {

        seen.add(
          product.category
        );

      }

    }


    const categories =
      [...seen].sort();


    return [
      'All',
      ...categories
    ];

  }



  /* =========================
     PRODUCT
     ========================= */

  productById(
    id: number
  ): Product {


    return (

      this.products.find(
        product =>
          product.id === id
      )

      ||

      this.products[0]

      ||

      smileHubProducts[0]

    );

  }



  /* =========================
     RECENTLY VIEWED
     ========================= */

  markProductViewed(
    id: number
  ): void {


    const cleanId =
      Number(id);


    if (
      !Number.isFinite(
        cleanId
      )
      ||
      cleanId <= 0
    ) {


      return;

    }


    const exists =
      this.products.some(
        product =>
          product.id ===
          cleanId
      );


    if (!exists) {


      return;

    }


    this.recentlyViewedIds = [

      cleanId,

      ...this.recentlyViewedIds
        .filter(
          productId =>
            productId !==
            cleanId
        )

    ].slice(
      0,
      this.maxRecentlyViewed
    );


    this.persist();

  }



  get recentlyViewedProducts():
    Product[] {


    return this.recentlyViewedIds

      .map(
        id =>
          this.products.find(
            product =>
              product.id === id
          )
      )

      .filter(
        (product): product is Product =>
          Boolean(product)
      );

  }



  clearRecentlyViewed():
    void {


    this.recentlyViewedIds =
      [];


    this.persist();

  }



  /* =========================
     CART
     ========================= */

  quantityFor(
    id: number
  ): number {


    return (
      this.cart.get(id) || 0
    );

  }



  get cartCount():
    number {


    return Array
      .from(
        this.cart.values()
      )
      .reduce(
        (total, quantity) =>
          total + quantity,
        0
      );

  }



  get subtotal():
    number {


    return Array
      .from(
        this.cart.entries()
      )
      .reduce(

        (
          sum,
          [id, quantity]
        ) =>

          sum
          +
          this.productById(id)
            .price
          *
          quantity,

        0

      );

  }



  get shippingFee():
    number {


    return (

      this.subtotal >= 3000

      ||

      this.cart.size === 0

    )

      ? 0

      : 120;

  }



  get discount():
    number {


    return this.couponApplied

      ? Math.min(
          this.subtotal * 0.10,
          349.90
        )

      : 0;

  }



  get total():
    number {


    return (

      this.subtotal
      +
      this.shippingFee
      -
      this.discount

    );

  }



  /* =========================
     SELECTED PAYMENT
     ========================= */

  get selectedPayment():
    PaymentMethodItem {


    return (

      this.paymentMethods[
        this.selectedPaymentIndex
      ]

      ||

      this.paymentMethods[0]

    );

  }



  /* =========================
     WISHLIST
     ========================= */

  toggleWishlist(id: number): void {
    const remove = this.wishlist.has(id);
    const item = this.sharedItem(id);
    this.customerSync.change('wishlists', items => remove ? items.filter(value => Number(value.id) !== id) : [...items.filter(value => Number(value.id) !== id), item]);


    if (
      this.wishlist.has(id)
    ) {


      this.wishlist.delete(id);


    } else {


      this.wishlist.add(id);

    }


    this.persist();

  }



  /* =========================
     ADD TO CART
     ========================= */

  addToCart(id: number, quantity = 1): void {
    if (!Number.isInteger(quantity) || quantity <= 0 || !this.products.some(product => product.id === id)) return;
    const item = this.sharedItem(id);
    this.customerSync.change('carts', items => {
      const existing = items.find(value => Number(value.id) === id);
      return [...items.filter(value => Number(value.id) !== id), { ...item, quantity: Number(existing?.quantity || 0) + quantity }];
    });


    this.cart.set(

      id,

      this.quantityFor(id)
      +
      quantity

    );


    this.persist();

  }



  setCartQuantity(id: number, quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 0) return;
    const item = this.sharedItem(id);
    this.customerSync.change('carts', items => [...items.filter(value => Number(value.id) !== id), ...(quantity ? [{ ...item, quantity }] : [])]);


    if (quantity <= 0) {


      this.cart.delete(id);


    } else {


      this.cart.set(
        id,
        quantity
      );

    }


    this.persist();

  }



  removeFromCart(id: number): void {
    this.customerSync.change('carts', items => items.filter(value => Number(value.id) !== id));


    this.cart.delete(id);


    this.persist();

  }



  /* =========================
     COUPON
     ========================= */

  applyCoupon(
    code: string
  ): boolean {


    this.couponApplied =
      code
        .trim()
        .toUpperCase()
      ===
      'SMILE10';


    this.persist();


    return this.couponApplied;

  }



  /* =========================
     SELECT PAYMENT
     ========================= */

  selectPayment(
    index: number
  ): void {


    if (
      index < 0
      ||
      index >=
        this.paymentMethods.length
    ) {

      return;

    }


    this.selectedPaymentIndex =
      index;


    this.persist();

  }



  /* =========================
     ADD PAYMENT
     ========================= */

  addPaymentMethod(
    method: PaymentMethodItem
  ): void {


    this.paymentMethods.push(
      method
    );


    /*
     * Newly added payment becomes
     * selected automatically.
     */

    this.selectedPaymentIndex =
      this.paymentMethods.length - 1;

    this.customerSync.savePaymentMethods(this.paymentMethods);


    this.persist();

  }



  /* =========================
     UPDATE PAYMENT
     ========================= */

  updatePaymentMethod(
    index: number,
    method: PaymentMethodItem
  ): boolean {


    /*
     * Index 0 = Cash on Delivery.
     * Keep it protected.
     */

    if (!this.canManagePayment(index)) {
      return false;
    }


    this.paymentMethods[index] = {

      ...this.paymentMethods[index],

      ...method,

      isDefault:
        false

    };

    this.customerSync.savePaymentMethods(this.paymentMethods);


    this.persist();


    return true;

  }



  /* =========================
     DELETE PAYMENT
     ========================= */

  deletePaymentMethod(
    index: number
  ): boolean {


    /*
     * Do not delete
     * Cash on Delivery.
     */

    if (!this.canManagePayment(index)) {
      return false;
    }


    this.paymentMethods.splice(
      index,
      1
    );

    this.customerSync.savePaymentMethods(this.paymentMethods);



    /*
     * If deleted payment was selected,
     * return selection to COD.
     */

    if (
      this.selectedPaymentIndex ===
      index
    ) {


      this.selectedPaymentIndex =
        0;


    } else if (
      this.selectedPaymentIndex >
      index
    ) {


      /*
       * Array shifted left.
       */

      this.selectedPaymentIndex--;

    }



    if (
      this.selectedPaymentIndex >=
      this.paymentMethods.length
    ) {


      this.selectedPaymentIndex =
        0;

    }


    this.persist();


    return true;

  }



  /* =========================
     CAN EDIT / DELETE
     ========================= */

  canManagePayment(index: number): boolean {
    return index >= 0 &&
      index < this.paymentMethods.length &&
      !this.paymentMethods[index].isDefault;
  }


  /* =========================
     CLEAR CART
     ========================= */

  clearCartAfterOrder(): void {
    this.customerSync.change('carts', () => []);


    this.cart.clear();


    this.couponApplied =
      false;


    this.persist();

  }



  /* =========================
     THEME
     ========================= */

  toggleTheme(
    enabled?: boolean
  ): void {


    this.darkMode =
      enabled
      ??
      !this.darkMode;


    document.body
      .classList
      .toggle(
        'dark',
        this.darkMode
      );


    this.persist();

  }



  /* =========================
     PERSIST
     ========================= */

  private sharedItem(id: number): SharedListItem {
    const product = this.productById(id);
    return { id, name: product.name, price: product.price, image: product.image || product.imageAsset };
  }

  private persist():
    void {


    localStorage.setItem(

      'smilehubState',

      JSON.stringify({
        syncVersion: 1,


        wishlist:
          [...this.wishlist],


        cart:
          [...this.cart.entries()],


        couponApplied:
          this.couponApplied,


        selectedPaymentIndex:
          this.selectedPaymentIndex,


        paymentMethods:
          this.paymentMethods,


        recentlyViewedIds:
          this.recentlyViewedIds,


        darkMode:
          this.darkMode


      })

    );

  }



  /* =========================
     RESTORE
     ========================= */

  private restore():
    void {


    try {


      const raw =
        localStorage.getItem(
          'smilehubState'
        );


      if (!raw) {

        return;

      }


      const value =
        JSON.parse(raw);



      this.wishlist =
        new Set<number>(
          value.wishlist || []
        );


      this.cart =
        new Map<number, number>(
          value.cart || []
        );


      this.recentlyViewedIds =
        Array.isArray(
          value.recentlyViewedIds
        )

          ? value.recentlyViewedIds
              .map(
                (id: any) =>
                  Number(id)
              )
              .filter(
                (id: number) =>
                  Number.isFinite(id)
                  &&
                  id > 0
              )
              .slice(
                0,
                this.maxRecentlyViewed
              )

          : [];


      this.couponApplied =
        !!value.couponApplied;



      // Restore selection by title, not index, because store payment options changed.
      const rememberedMethods: PaymentMethodItem[] =
        Array.isArray(value.paymentMethods) ? value.paymentMethods : [];
      const rememberedIndex = Number(value.selectedPaymentIndex || 0);
      const selectedTitle = rememberedMethods[rememberedIndex]?.title ||
        BUILT_IN_PAYMENT_METHODS[0].title;
      const savedCustomMethods = rememberedMethods.filter(method =>
        method &&
        typeof method.title === 'string' &&
        typeof method.subtitle === 'string' &&
        typeof method.icon === 'string' &&
        !method.isDefault &&
        !BUILT_IN_PAYMENT_METHODS.some(builtIn => builtIn.title === method.title) &&
        !(method.title === 'GCash' && method.subtitle === '•••• •••• 6789') &&
        !(method.title === 'Visa ending 1234' && method.subtitle === 'Expires 08/29')
      );
      this.paymentMethods = [
        ...BUILT_IN_PAYMENT_METHODS.map(method => ({ ...method })),
        ...savedCustomMethods
      ];
      this.selectedPaymentIndex = Math.max(
        0,
        this.paymentMethods.findIndex(method => method.title === selectedTitle)
      );

      this.darkMode =
        !!value.darkMode;


      document.body
        .classList
        .toggle(
          'dark',
          this.darkMode
        );


    } catch {


      /*
       * Invalid old localStorage data:
       * keep defaults.
       */

    }

  }


}
