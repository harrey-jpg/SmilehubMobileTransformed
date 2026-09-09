import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  IonicModule,
  AlertController,
  ToastController
} from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppStateService } from '../services/app-state.service';
import { BottomNavComponent } from '../shared/bottom-nav.component';


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

    .cart-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .cart-count {
      font-size: 12px;
      color: var(--ion-color-medium);
      margin-top: 3px;
    }

    .clear-cart {
      --padding-start: 8px;
      --padding-end: 8px;
      font-size: 12px;
    }


    /* =========================
       CART ITEM
       ========================= */

    .cart-item {
      align-items: flex-start;
      gap: 12px;
    }

    .cart-product-name {
      font-weight: 800;
      line-height: 1.2;
    }

    .cart-product-price {
      margin-top: 3px;
    }

    .item-total {
      margin-top: 8px;
      font-size: 11px;
      color: var(--ion-color-medium);
    }

    .item-total strong {
      color: var(--ion-color-primary);
      font-size: 12px;
    }

    .stock-text {
      margin-top: 5px;
      font-size: 10px;
      color: var(--ion-color-medium);
    }


    /* =========================
       QUANTITY
       ========================= */

    .qty button:disabled {
      opacity: .35;
      cursor: not-allowed;
    }


    /* =========================
       COUPON
       ========================= */

    .coupon-row {
      display: flex;
      align-items: flex-end;
      gap: 10px;
    }

    .coupon-input {
      flex: 1;
      min-width: 0;
    }

    .coupon-success {
      margin-top: 10px;
      font-size: 12px;
    }


    /* =========================
       ORDER SUMMARY
       ========================= */

    .summary-label {
      color: var(--ion-color-medium);
    }

    .summary-row {
      margin-bottom: 7px;
    }

    .total-divider {
      margin: 13px 0;
      opacity: .15;
    }

    .total-row {
      font-size: 18px;
      font-weight: 900;
    }

    .checkout-btn {
      margin-top: 16px;
    }


    /* =========================
       EMPTY CART
       ========================= */

    .empty-cart {
      min-height: 55vh;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      text-align: center;

      padding: 25px;
    }

    .empty-cart .emoji {
      font-size: 52px;
      margin-bottom: 8px;
    }

    .empty-cart h2 {
      margin-bottom: 4px;
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

        Clear

      </ion-button>


    </ion-buttons>


  </ion-toolbar>

</ion-header>



<!-- =========================
     CONTENT
     ========================= -->

<ion-content>


<div class="page-wrap">


  <!-- =========================
       EMPTY CART
       ========================= -->

  <div
    class="empty empty-cart"
    *ngIf="items.length === 0">


    <div class="emoji">
      🛒
    </div>


    <h2>
      Your cart is empty
    </h2>


    <p class="muted">

      Add dental supplies from the
      catalog to continue.

    </p>


    <ion-button
      routerLink="/catalog">

      Browse Products

    </ion-button>


  </div>



  <!-- =========================
       CART CONTENT
       ========================= -->

  <div
    class="list-stack"
    *ngIf="items.length > 0">


    <!-- CART HEADING -->

    <div class="cart-heading">


      <div>


        <h2 style="margin:0">

          Your Cart

        </h2>


        <div class="cart-count">

          {{ state.cartCount }}
          item{{ state.cartCount === 1 ? '' : 's' }}

        </div>


      </div>


    </div>



    <!-- =========================
         CART ITEMS
         ========================= -->

    <div
      class="app-card row cart-item"

      *ngFor="
        let item of items;
        trackBy: trackItem
      ">


      <!-- PRODUCT IMAGE -->

      <div
        class="product-art"

        style="
          width:72px;
          min-width:72px;
          min-height:72px;
        ">


        <img
          [src]="item.product.imageAsset"

          [alt]="item.product.name"

          style="
            width:55px;
            height:55px;
            object-fit:contain;
          ">


      </div>



      <!-- PRODUCT DETAILS -->

      <div class="flex-1">


        <div class="cart-product-name">

          {{ item.product.name }}

        </div>


        <div
          class="price cart-product-price">

          {{ money(item.product.price) }}

        </div>



        <!-- QUANTITY -->

        <div
          class="qty"
          style="margin-top:8px">


          <!-- MINUS -->

          <button
            [disabled]="item.qty <= 1"

            (click)="
              decreaseQuantity(item)
            ">

            −

          </button>



          <b>

            {{ item.qty }}

          </b>



          <!-- PLUS -->

          <button
            [disabled]="
              reachedStockLimit(item)
            "

            (click)="
              increaseQuantity(item)
            ">

            +

          </button>


        </div>



        <!-- STOCK -->

        <div
          class="stock-text"

          *ngIf="
            getNumericStock(item.product) !== null
          ">


          {{ getNumericStock(item.product) }}
          available


        </div>



        <!-- ITEM SUBTOTAL -->

        <div class="item-total">


          Item total:

          <strong>

            {{
              money(
                item.product.price *
                item.qty
              )
            }}

          </strong>


        </div>


      </div>



      <!-- REMOVE -->

      <ion-button
        fill="clear"
        color="danger"

        (click)="
          confirmRemove(item)
        ">


        <ion-icon
          name="trash-outline">
        </ion-icon>


      </ion-button>


    </div>



    <!-- =========================
         COUPON
         ========================= -->

    <div class="app-card">


      <div class="coupon-row">


        <ion-input
          class="coupon-input"

          label="Coupon code"

          labelPlacement="stacked"

          [(ngModel)]="coupon"

          placeholder="SMILE10"

          [disabled]="state.couponApplied">

        </ion-input>



        <ion-button
          (click)="applyCoupon()"

          [disabled]="
            !coupon.trim() ||
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
        class="success coupon-success"

        *ngIf="state.couponApplied">


        ✓ Coupon SMILE10 applied successfully.


      </div>


    </div>



    <!-- =========================
         ORDER SUMMARY
         ========================= -->

    <div class="app-card">


      <!-- SUBTOTAL -->

      <div
        class="row-between summary-row">


        <span class="summary-label">

          Subtotal

        </span>


        <b>

          {{ money(state.subtotal) }}

        </b>


      </div>



      <!-- DISCOUNT -->

      <div
        class="row-between summary-row"

        *ngIf="state.discount > 0">


        <span class="summary-label">

          Discount

        </span>


        <b class="success">

          −{{ money(state.discount) }}

        </b>


      </div>



      <!-- SHIPPING -->

      <div
        class="row-between summary-row">


        <span class="summary-label">

          Shipping

        </span>


        <b>


          {{
            state.shippingFee === 0
              ? 'Free'
              : money(state.shippingFee)
          }}


        </b>


      </div>



      <hr class="total-divider">



      <!-- TOTAL -->

      <div
        class="row-between total-row">


        <span>

          Total

        </span>


        <span>

          {{ money(state.total) }}

        </span>


      </div>



      <!-- CHECKOUT -->

      <ion-button
        expand="block"

        class="primary-btn checkout-btn"

        routerLink="/checkout">


        Proceed to Checkout


      </ion-button>


    </div>


  </div>


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


  coupon = '';


  constructor(

    public state: AppStateService,

    private alertController: AlertController,

    private toastController: ToastController

  ) {}



  /* =========================
     CART ITEMS
     ========================= */

  get items() {


    const known =
      new Set(

        this.state.products.map(
          product => product.id
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
     TRACK ITEM
     ========================= */

  trackItem(
    index: number,
    item: any
  ) {


    return (
      item?.product?.id
      ?? index
    );

  }



  /* =========================
     NUMERIC STOCK
     ========================= */

  getNumericStock(
    product: any
  ): number | null {


    if (!product) {

      return null;

    }


    const stock =
      product.stock;


    /*
      Actual numeric stock
    */

    if (
      typeof stock === 'number' &&
      Number.isFinite(stock)
    ) {

      return Math.max(
        0,
        Math.floor(stock)
      );

    }



    /*
      Numeric string e.g. "12"
    */

    const value =
      String(stock ?? '')
        .trim();


    if (
      /^[0-9]+$/.test(value)
    ) {

      return Number(value);

    }



    /*
      "In stock" doesn't provide
      an exact quantity.
    */

    return null;

  }



  /* =========================
     STOCK LIMIT
     ========================= */

  reachedStockLimit(
    item: any
  ): boolean {


    const stock =
      this.getNumericStock(
        item.product
      );


    if (stock === null) {

      return false;

    }


    return (
      item.qty >= stock
    );

  }



  /* =========================
     MINUS QUANTITY
     ========================= */

  decreaseQuantity(
    item: any
  ): void {


    if (
      item.qty <= 1
    ) {

      return;

    }


    this.state.setCartQuantity(

      item.product.id,

      item.qty - 1

    );

  }



  /* =========================
     PLUS QUANTITY
     ========================= */

  async increaseQuantity(
    item: any
  ): Promise<void> {


    const stock =
      this.getNumericStock(
        item.product
      );


    if (
      stock !== null &&
      item.qty >= stock
    ) {


      await this.showToast(

        stock === 1

          ? 'Only 1 item is available.'

          : `Only ${stock} items are available.`

      );


      return;

    }



    this.state.setCartQuantity(

      item.product.id,

      item.qty + 1

    );

  }



  /* =========================
     REMOVE ITEM
     ========================= */

  async confirmRemove(
    item: any
  ): Promise<void> {


    const alert =
      await this.alertController.create({


        header: 'Remove item?',


        message:

          `Remove ${item.product.name} from your cart?`,


        buttons: [

          {
            text: 'Cancel',
            role: 'cancel'
          },

          {

            text: 'Remove',

            role: 'destructive',

            handler: () => {


              this.state.removeFromCart(
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
      await this.alertController.create({


        header: 'Clear cart?',


        message:

          'This will remove all items from your cart.',


        buttons: [

          {

            text: 'Cancel',

            role: 'cancel'

          },

          {

            text: 'Clear Cart',

            role: 'destructive',

            handler: () => {


              const ids = [

                ...this.state.cart.keys()

              ];


              for (
                const id of ids
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


    if (!code) {


      await this.showToast(
        'Enter a coupon code.'
      );


      return;

    }



    this.state.applyCoupon(
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
  ): Promise<void> {


    const toast =
      await this.toastController.create({


        message,

        duration: 1400,

        position: 'bottom'


      });


    await toast.present();

  }



  /* =========================
     MONEY
     ========================= */

  money(
    value: number
  ): string {


    return new Intl.NumberFormat(

      'en-PH',

      {

        style: 'currency',

        currency: 'PHP'

      }

    ).format(value);

  }


}