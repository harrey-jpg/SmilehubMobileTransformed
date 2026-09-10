import {
  Component
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  IonicModule,
  AlertController,
  ToastController
} from '@ionic/angular';

import {
  FormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  AppStateService
} from '../services/app-state.service';

import {
  BottomNavComponent
} from '../shared/bottom-nav.component';


@Component({

  selector: 'app-cart',

  standalone: true,

  imports: [
    RouterModule,
    IonicModule,
    FormsModule,
    CommonModule,
    BottomNavComponent
  ],


  styles: [`

    /* =========================
       PAGE
       ========================= */

    .cart-page {
      padding-bottom: 24px;
    }


    /* =========================
       CART HEADING
       ========================= */

    .cart-heading {
      margin-bottom: 14px;

      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      gap: 12px;
    }


    .cart-kicker {
      color:
        var(--ion-color-primary);

      font-size: 9px;
      font-weight: 900;

      letter-spacing: .8px;

      text-transform: uppercase;
    }


    .cart-title {
      margin: 3px 0 0;

      font-size: 22px;
      font-weight: 900;
    }


    .cart-count {
      margin-top: 3px;

      font-size: 11px;

      color:
        var(--ion-color-medium);
    }


    .clear-cart {
      --padding-start: 8px;
      --padding-end: 8px;

      font-size: 11px;
      font-weight: 800;
    }


    /* =========================
       CART ITEMS
       ========================= */

    .cart-list {
      display: flex;
      flex-direction: column;

      gap: 11px;
    }


    .cart-item {
      position: relative;

      display: flex;

      align-items: flex-start;

      gap: 13px;

      padding: 13px;

      border-radius: 18px;
    }


    .cart-image {
      width: 92px;
      min-width: 92px;

      height: 92px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 15px;

      overflow: hidden;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .07
        );
    }


    .cart-image img {
      width: 76px;
      height: 76px;

      object-fit: contain;
    }


    .cart-item-info {
      min-width: 0;

      flex: 1;
    }


    .cart-brand {
      margin-bottom: 3px;

      color:
        var(--ion-color-primary);

      font-size: 8px;
      font-weight: 900;

      letter-spacing: .4px;

      text-transform: uppercase;
    }


    .cart-product-name {
      padding-right: 28px;

      font-size: 12px;
      line-height: 1.35;

      font-weight: 900;
    }


    .cart-product-price {
      margin-top: 5px;

      color:
        var(--ion-color-primary);

      font-size: 14px;
      font-weight: 900;
    }


    .remove-btn {
      position: absolute;

      right: 4px;
      top: 4px;

      margin: 0;

      --padding-start: 8px;
      --padding-end: 8px;

      font-size: 17px;
    }


    /* =========================
       QUANTITY AREA
       ========================= */

    .item-bottom {
      margin-top: 11px;

      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      gap: 10px;
    }


    .qty {
      display: inline-flex;

      align-items: center;

      gap: 5px;

      padding: 4px;

      border-radius: 12px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .07
        );
    }


    .qty button {
      width: 30px;
      height: 30px;

      border: none;

      border-radius: 9px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .13
        );

      color:
        var(--ion-color-primary);

      font-size: 17px;
      font-weight: 900;

      cursor: pointer;
    }


    .qty button:disabled {
      opacity: .35;

      cursor: not-allowed;
    }


    .qty-value {
      width: 27px;

      text-align: center;

      font-size: 12px;
      font-weight: 900;
    }


    .item-total {
      text-align: right;
    }


    .item-total-label {
      font-size: 8px;

      color:
        var(--ion-color-medium);
    }


    .item-total-value {
      margin-top: 2px;

      color:
        var(--ion-color-primary);

      font-size: 12px;
      font-weight: 900;
    }


    .stock-text {
      margin-top: 7px;

      font-size: 9px;

      color:
        var(--ion-color-medium);
    }


    .stock-limit {
      color:
        var(--ion-color-warning);
    }


    /* =========================
       COUPON
       ========================= */

    .section-title {
      margin:
        22px 2px 9px;

      font-size: 14px;
      font-weight: 900;
    }


    .coupon-card {
      padding: 14px;

      border-radius: 18px;
    }


    .coupon-heading {
      margin-bottom: 11px;

      display: flex;
      align-items: center;

      gap: 8px;

      font-size: 12px;
      font-weight: 900;
    }


    .coupon-heading ion-icon {
      color:
        var(--ion-color-primary);

      font-size: 18px;
    }


    .coupon-row {
      display: flex;

      align-items: flex-end;

      gap: 9px;
    }


    .coupon-input {
      min-width: 0;

      flex: 1;

      --padding-start: 11px;
      --padding-end: 11px;

      border:
        1px solid
        rgba(120,120,120,.15);

      border-radius: 13px;
    }


    .coupon-row ion-button {
      margin: 0;

      --border-radius: 12px;

      font-weight: 900;
    }


    .coupon-success {
      margin-top: 10px;

      padding: 9px 10px;

      border-radius: 11px;

      background:
        rgba(
          var(--ion-color-success-rgb),
          .09
        );

      color:
        var(--ion-color-success);

      font-size: 10px;
      font-weight: 800;
    }


    /* =========================
       ORDER SUMMARY
       ========================= */

    .summary-card {
      padding: 16px;

      border-radius: 18px;
    }


    .summary-heading {
      margin-bottom: 14px;

      display: flex;
      align-items: center;

      gap: 8px;

      font-size: 13px;
      font-weight: 900;
    }


    .summary-heading ion-icon {
      color:
        var(--ion-color-primary);

      font-size: 18px;
    }


    .summary-row {
      min-height: 31px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;

      font-size: 11px;
    }


    .summary-label {
      color:
        var(--ion-color-medium);
    }


    .summary-value {
      font-weight: 800;
    }


    .discount-value {
      color:
        var(--ion-color-success);
    }


    .free-shipping {
      color:
        var(--ion-color-success);
    }


    .total-divider {
      margin: 12px 0;

      border: none;

      border-top:
        1px solid
        rgba(120,120,120,.15);
    }


    .total-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;
    }


    .total-label {
      font-size: 14px;
      font-weight: 900;
    }


    .total-value {
      color:
        var(--ion-color-primary);

      font-size: 20px;
      font-weight: 900;
    }


    .checkout-btn {
      min-height: 48px;

      margin:
        16px 0 0;

      --border-radius: 14px;

      font-size: 12px;
      font-weight: 900;
    }


    .checkout-note {
      margin-top: 9px;

      text-align: center;

      font-size: 9px;
      line-height: 1.4;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       EMPTY CART
       ========================= */

    .empty-cart {
      min-height: 68vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      padding: 30px 24px;
    }


    .empty-icon {
      width: 86px;
      height: 86px;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-bottom: 17px;

      border-radius: 26px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      font-size: 40px;
    }


    .empty-cart h2 {
      margin:
        0 0 6px;

      font-size: 20px;
      font-weight: 900;
    }


    .empty-cart p {
      max-width: 260px;

      margin:
        0 0 18px;

      font-size: 11px;
      line-height: 1.5;

      color:
        var(--ion-color-medium);
    }


    .empty-cart ion-button {
      --border-radius: 13px;

      font-weight: 900;
    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (max-width: 380px) {

      .cart-image {
        width: 82px;
        min-width: 82px;

        height: 82px;
      }

      .cart-image img {
        width: 67px;
        height: 67px;
      }

      .cart-item {
        gap: 10px;

        padding: 11px;
      }

    }


    @media (min-width: 720px) {

      .cart-layout {
        display: grid;

        grid-template-columns:
          minmax(0, 1.4fr)
          minmax(280px, .6fr);

        gap: 20px;

        align-items: start;
      }

      .cart-side {
        position: sticky;

        top: 16px;
      }

      .section-title.first-side-title {
        margin-top: 0;
      }

    }

  `],


  template: `

<!-- =========================
     HEADER
     ========================= -->

<ion-header>

  <ion-toolbar>


    <ion-title>

      Cart

    </ion-title>


    <ion-buttons
      slot="end"
      *ngIf="items.length > 0">


      <ion-button

        fill="clear"

        color="danger"

        class="clear-cart"

        (click)="confirmClearCart()">

        Clear All

      </ion-button>


    </ion-buttons>


  </ion-toolbar>

</ion-header>



<!-- =========================
     CONTENT
     ========================= -->

<ion-content>


  <div class="page-wrap cart-page">


    <!-- =========================
         EMPTY CART
         ========================= -->

    <div

      class="empty-cart"

      *ngIf="
        items.length === 0
      ">


      <div class="empty-icon">

        🛒

      </div>


      <h2>

        Your cart is empty

      </h2>


      <p>

        Looks like you haven't added
        any dental supplies yet.
        Browse the catalog and find
        what your clinic needs.

      </p>


      <ion-button
        routerLink="/catalog">

        Browse Products

      </ion-button>


    </div>



    <!-- =========================
         CART CONTENT
         ========================= -->

    <ng-container
      *ngIf="
        items.length > 0
      ">


      <div class="cart-heading">


        <div>


          <div class="cart-kicker">

            SmileHub Cart

          </div>


          <h1 class="cart-title">

            Your Cart

          </h1>


          <div class="cart-count">

            {{ state.cartCount }}

            item{{
              state.cartCount === 1
                ? ''
                : 's'
            }}

            ready for checkout

          </div>


        </div>


      </div>



      <div class="cart-layout">


        <!-- =========================
             LEFT SIDE
             ========================= -->

        <div>


          <div class="cart-list">


            <div

              class="app-card cart-item"

              *ngFor="
                let item of items;
                trackBy: trackItem
              ">


              <!-- REMOVE -->

              <ion-button

                class="remove-btn"

                fill="clear"

                color="danger"

                aria-label="Remove item"

                (click)="confirmRemove(item)">


                <ion-icon
                  name="trash-outline">
                </ion-icon>


              </ion-button>



              <!-- IMAGE -->

              <div class="cart-image">


                <img

                  [src]="productImage(item.product)"

                  [alt]="item.product.name">


              </div>



              <!-- DETAILS -->

              <div class="cart-item-info">


                <div class="cart-brand">

                  {{ item.product.brand }}

                </div>


                <div class="cart-product-name">

                  {{ item.product.name }}

                </div>


                <div class="cart-product-price">

                  {{ money(item.product.price) }}

                </div>



                <div

                  class="stock-text"

                  *ngIf="
                    getNumericStock(item.product)
                      !== null
                  "

                  [class.stock-limit]="
                    reachedStockLimit(item)
                  ">


                  {{
                    getNumericStock(
                      item.product
                    )
                  }}

                  available

                </div>



                <div class="item-bottom">


                  <!-- QUANTITY -->

                  <div class="qty">


                    <button

                      type="button"

                      aria-label="Decrease quantity"

                      [disabled]="
                        item.qty <= 1
                      "

                      (click)="
                        decreaseQuantity(item)
                      ">

                      −

                    </button>


                    <span class="qty-value">

                      {{ item.qty }}

                    </span>


                    <button

                      type="button"

                      aria-label="Increase quantity"

                      [disabled]="
                        reachedStockLimit(item)
                      "

                      (click)="
                        increaseQuantity(item)
                      ">

                      +

                    </button>


                  </div>



                  <!-- ITEM TOTAL -->

                  <div class="item-total">


                    <div class="item-total-label">

                      Item total

                    </div>


                    <div class="item-total-value">

                      {{
                        money(
                          item.product.price
                          *
                          item.qty
                        )
                      }}

                    </div>


                  </div>


                </div>


              </div>


            </div>


          </div>


        </div>



        <!-- =========================
             RIGHT / BOTTOM SIDE
             ========================= -->

        <div class="cart-side">


          <!-- =========================
               COUPON
               ========================= -->

          <div class="section-title first-side-title">

            Promo Code

          </div>


          <div class="app-card coupon-card">


            <div class="coupon-heading">


              <ion-icon
                name="pricetag-outline">
              </ion-icon>


              Have a coupon?

            </div>



            <div class="coupon-row">


              <ion-input

                class="coupon-input"

                [(ngModel)]="coupon"

                placeholder="Enter coupon code"

                [disabled]="
                  state.couponApplied
                ">

              </ion-input>


              <ion-button

                size="small"

                (click)="applyCoupon()"

                [disabled]="
                  !coupon.trim()
                  ||
                  state.couponApplied
                ">


                {{
                  state.couponApplied
                    ? 'Applied'
                    : 'Apply'
                }}


              </ion-button>


            </div>



            <div

              class="coupon-success"

              *ngIf="
                state.couponApplied
              ">

              ✓ SMILE10 applied successfully.

            </div>


          </div>



          <!-- =========================
               ORDER SUMMARY
               ========================= -->

          <div class="section-title">

            Order Summary

          </div>


          <div class="app-card summary-card">


            <div class="summary-heading">


              <ion-icon
                name="receipt-outline">
              </ion-icon>


              Payment Details

            </div>



            <!-- SUBTOTAL -->

            <div class="summary-row">


              <span class="summary-label">

                Subtotal

              </span>


              <span class="summary-value">

                {{ money(state.subtotal) }}

              </span>


            </div>



            <!-- DISCOUNT -->

            <div

              class="summary-row"

              *ngIf="
                state.discount > 0
              ">


              <span class="summary-label">

                Discount

              </span>


              <span
                class="
                  summary-value
                  discount-value
                ">

                −{{ money(state.discount) }}

              </span>


            </div>



            <!-- SHIPPING -->

            <div class="summary-row">


              <span class="summary-label">

                Shipping

              </span>


              <span

                class="summary-value"

                [class.free-shipping]="
                  state.shippingFee === 0
                ">


                {{
                  state.shippingFee === 0
                    ? 'Free'
                    : money(
                        state.shippingFee
                      )
                }}


              </span>


            </div>



            <hr class="total-divider">



            <!-- TOTAL -->

            <div class="total-row">


              <span class="total-label">

                Total

              </span>


              <span class="total-value">

                {{ money(state.total) }}

              </span>


            </div>



            <!-- CHECKOUT -->

            <ion-button

              expand="block"

              class="
                primary-btn
                checkout-btn
              "

              routerLink="/checkout">


              Proceed to Checkout


            </ion-button>


            <div class="checkout-note">

              Review your delivery and
              payment details on the
              next step.

            </div>


          </div>


        </div>


      </div>


    </ng-container>


  </div>


</ion-content>



<!-- =========================
     BOTTOM NAVIGATION
     ========================= -->

<ion-footer>


  <app-bottom-nav
    active="cart">
  </app-bottom-nav>


</ion-footer>

`

})


export class CartPage {


  coupon =
    '';


  constructor(

    public state:
      AppStateService,

    private alertController:
      AlertController,

    private toastController:
      ToastController

  ) {}



  /* =========================
     CART ITEMS
     ========================= */

  get items() {


    const known =
      new Set(

        this.state.products.map(
          product =>
            product.id
        )

      );


    return [

      ...this.state.cart.entries()

    ]

      .filter(

        ([id]) =>
          known.has(id)

      )

      .map(

        ([id, qty]) => ({

          product:
            this.state.productById(id),

          qty

        })

      );


  }



  /* =========================
     PRODUCT IMAGE
     ========================= */

  productImage(
    product: any
  ):
    string {


    return (

      product?.image

      ||

      product?.imageAsset

      ||

      'assets/products/default.svg'

    );


  }



  /* =========================
     TRACK ITEM
     ========================= */

  trackItem(
    index: number,
    item: any
  ) {


    return (

      item?.product?.id

      ??

      index

    );


  }



  /* =========================
     NUMERIC STOCK
     ========================= */

  getNumericStock(
    product: any
  ):
    number | null {


    if (
      !product
    ) {

      return null;

    }


    /*
     * Prefer stockCount
     * if available.
     */

    if (
      typeof product.stockCount
        === 'number'
      &&
      Number.isFinite(
        product.stockCount
      )
    ) {


      return Math.max(

        0,

        Math.floor(
          product.stockCount
        )

      );


    }


    const stock =
      product.stock;


    /*
     * Numeric stock
     */

    if (
      typeof stock === 'number'
      &&
      Number.isFinite(stock)
    ) {


      return Math.max(

        0,

        Math.floor(stock)

      );


    }


    /*
     * Numeric string
     */

    const value =
      String(
        stock
        ??
        ''
      )
        .trim();


    if (
      /^[0-9]+$/.test(value)
    ) {


      return Number(value);


    }


    return null;


  }



  /* =========================
     STOCK LIMIT
     ========================= */

  reachedStockLimit(
    item: any
  ):
    boolean {


    const stock =
      this.getNumericStock(
        item.product
      );


    if (
      stock === null
    ) {

      return false;

    }


    return (
      item.qty >= stock
    );


  }



  /* =========================
     DECREASE QUANTITY
     ========================= */

  decreaseQuantity(
    item: any
  ):
    void {


    if (
      item.qty <= 1
    ) {

      return;

    }


    this.state
      .setCartQuantity(

        item.product.id,

        item.qty - 1

      );


  }



  /* =========================
     INCREASE QUANTITY
     ========================= */

  async increaseQuantity(
    item: any
  ):
    Promise<void> {


    const stock =
      this.getNumericStock(
        item.product
      );


    if (
      stock !== null
      &&
      item.qty >= stock
    ) {


      await this.showToast(

        stock === 1

          ? 'Only 1 item is available.'

          : 'Only '
            +
            stock
            +
            ' items are available.'

      );


      return;


    }


    this.state
      .setCartQuantity(

        item.product.id,

        item.qty + 1

      );


  }



  /* =========================
     REMOVE ITEM
     ========================= */

  async confirmRemove(
    item: any
  ):
    Promise<void> {


    const alert =
      await this
        .alertController
        .create({


          header:
            'Remove item?',


          message:

            'Remove '
            +
            item.product.name
            +
            ' from your cart?',


          buttons: [

            {

              text:
                'Cancel',

              role:
                'cancel'

            },


            {

              text:
                'Remove',

              role:
                'destructive',

              handler: () => {


                this.state
                  .removeFromCart(
                    item.product.id
                  );


                void this.showToast(
                  'Item removed from cart.'
                );


              }

            }

          ]


        });


    await alert.present();


  }



  /* =========================
     CLEAR CART
     ========================= */

  async confirmClearCart():
    Promise<void> {


    if (
      this.items.length === 0
    ) {

      return;

    }


    const alert =
      await this
        .alertController
        .create({


          header:
            'Clear cart?',


          message:

            'This will remove all items '
            +
            'from your cart.',


          buttons: [

            {

              text:
                'Cancel',

              role:
                'cancel'

            },


            {

              text:
                'Clear Cart',

              role:
                'destructive',

              handler: () => {


                const ids = [

                  ...this.state.cart.keys()

                ];


                for (
                  const id
                  of ids
                ) {


                  this.state
                    .removeFromCart(id);


                }


                void this.showToast(
                  'Cart cleared.'
                );


              }

            }

          ]


        });


    await alert.present();


  }



  /* =========================
     COUPON
     ========================= */

  async applyCoupon():
    Promise<void> {


    const code =
      this.coupon
        .trim();


    if (
      !code
    ) {


      await this.showToast(
        'Enter a coupon code.'
      );


      return;


    }


    this.state
      .applyCoupon(
        code
      );


    if (
      this.state.couponApplied
    ) {


      this.coupon =
        code.toUpperCase();


      await this.showToast(
        'Coupon applied successfully.'
      );


    } else {


      await this.showToast(
        'Invalid coupon code.'
      );


    }


  }



  /* =========================
     TOAST
     ========================= */

  private async showToast(
    message: string
  ):
    Promise<void> {


    const toast =
      await this
        .toastController
        .create({


          message,

          duration:
            1400,

          position:
            'bottom'


        });


    await toast.present();


  }



  /* =========================
     MONEY
     ========================= */

  money(
    value: number
  ):
    string {


    return new Intl.NumberFormat(

      'en-PH',

      {

        style:
          'currency',

        currency:
          'PHP'

      }

    )
      .format(
        Number(
          value
          ||
          0
        )
      );


  }


}