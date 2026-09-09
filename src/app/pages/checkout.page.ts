import { Component, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonicModule,
  AlertController,
  LoadingController
} from '@ionic/angular';

import { AppStateService } from '../services/app-state.service';
import { AddressService } from '../services/address.service';
import { OrderService } from '../services/order.service';

import {
  ShippingAddress
} from '../models/product';


@Component({
  selector: 'app-checkout',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule
  ],

  styles: [`

    /* =========================
       STEPS
       ========================= */

    .checkout-steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);

      gap: 8px;

      margin-bottom: 22px;
    }


    .checkout-step {
      border-radius: 999px;

      padding: 7px 10px;

      text-align: center;

      font-size: 11px;
      font-weight: 800;

      background:
        rgba(19, 181, 205, .13);

      color:
        var(--ion-color-primary);
    }


    .checkout-step.active {
      background:
        rgba(19, 181, 205, .32);

      color:
        var(--ion-text-color);
    }


/* =========================
   DELIVERY
   ========================= */

.delivery-list {
  overflow: hidden;
  border-radius: 16px;
  margin-bottom: 12px;
  background: var(--ion-card-background);
  border: 1px solid rgba(120, 120, 120, .08);
}

.delivery-option {
  --background: var(--ion-card-background);
  --min-height: 50px;
  --padding-start: 16px;
  --inner-padding-end: 14px;
  margin: 0;
}

.delivery-option + .delivery-option {
  border-top: 1px solid rgba(120, 120, 120, .10);
}

.delivery-label {
  margin: 6px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1px;
}

.delivery-name {
  font-size: 14px;
  font-weight: 800;
  line-height: 1.15;
}

.delivery-price {
  font-size: 11px;
  line-height: 1.15;
  color: var(--ion-color-medium);
}

.delivery-radio {
  margin-left: 10px;
}

    /* =========================
       PAYMENT
       ========================= */

    .payment-card {
      min-height: 76px;
    }


    /* =========================
       ORDER ITEMS
       ========================= */

    .checkout-item {
      display: flex;
      align-items: center;

      gap: 12px;

      padding: 11px 0;

      border-bottom:
        1px solid
        rgba(120, 120, 120, .10);
    }


    .checkout-item:last-child {
      border-bottom: none;
    }


    .checkout-image {
      width: 54px;
      height: 54px;

      border-radius: 12px;

      background:
        rgba(120, 120, 120, .08);

      object-fit: contain;

      padding: 5px;

      flex-shrink: 0;
    }


    .checkout-item-info {
      flex: 1;
      min-width: 0;
    }


    .checkout-item-name {
      font-size: 13px;
      font-weight: 800;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    .checkout-item-meta {
      margin-top: 3px;

      font-size: 11px;

      color:
        var(--ion-color-medium);
    }


    .checkout-item-total {
      font-size: 12px;
      font-weight: 900;

      color:
        var(--ion-color-primary);

      white-space: nowrap;
    }


    /* =========================
       SUMMARY
       ========================= */

    .summary-row {
      margin-bottom: 7px;
    }


    .summary-label {
      color:
        var(--ion-color-medium);
    }


    .summary-divider {
      margin: 14px 0;

      opacity: .15;
    }


    .total-row {
      font-size: 18px;
      font-weight: 900;
    }


    .place-order-btn {
      margin-top: 16px;
    }


    /* =========================
       EMPTY CHECKOUT
       ========================= */

    .empty-checkout {
      min-height: 55vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      padding: 30px;
    }


    .empty-checkout .emoji {
      font-size: 50px;

      margin-bottom: 8px;
    }

  `],

  template: `

<!-- =========================
     HEADER
     ========================= -->

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        defaultHref="/cart">
      </ion-back-button>

    </ion-buttons>


    <ion-title>
      Checkout
    </ion-title>


  </ion-toolbar>

</ion-header>



<!-- =========================
     CONTENT
     ========================= -->

<ion-content>


<div
  class="page-wrap no-bottom"
  *ngIf="checkoutItems.length > 0">


  <!-- =========================
       STEPS
       ========================= -->

  <div class="checkout-steps">


    <div class="checkout-step active">

      1 Shipping

    </div>


    <div class="checkout-step">

      2 Payment

    </div>


    <div class="checkout-step">

      3 Review

    </div>


  </div>



  <!-- =========================
       SHIPPING ADDRESS
       ========================= -->

  <div class="section-row">


    <h2>

      Shipping Address

    </h2>


    <ion-button
      fill="clear"
      size="small"

      (click)="chooseAddress()">


      {{
        address
          ? 'Change'
          : 'Add'
      }}


    </ion-button>


  </div>



  <!-- ADDRESS EXISTS -->

  <div
    class="app-card card-button"

    *ngIf="
      !loadingAddress &&
      address
    "

    (click)="chooseAddress()">


    <div class="row-between">


      <b>

        📍
        {{
          address.label ||
          'Address'
        }}

      </b>


      <ion-icon
        name="chevron-forward-outline">
      </ion-icon>


    </div>



    <p>


      <b>

        {{ address.recipient }}

      </b>


      <br>


      {{ address.phone }}


    </p>



    <p class="muted">

      {{ fullAddress(address) }}

    </p>


  </div>



  <!-- NO ADDRESS -->

  <div
    class="app-card card-button"

    *ngIf="
      !loadingAddress &&
      !address
    "

    (click)="chooseAddress()">


    <b>

      ➕ No shipping address selected

    </b>


    <p class="muted">

      Tap to add or choose an address.

    </p>


  </div>



  <!-- ADDRESS LOADING -->

  <div
    class="app-card"

    *ngIf="loadingAddress">


    <ion-spinner>
    </ion-spinner>


    <span
      style="margin-left:10px">

      Loading address...

    </span>


  </div>



  <!-- =========================
       DELIVERY METHOD
       ========================= -->

  <div class="section-row">


    <h2>

      Delivery Method

    </h2>


  </div>



<ion-radio-group
  [(ngModel)]="delivery">

  <div class="delivery-list">

    <!-- STANDARD DELIVERY -->

    <ion-item
      class="delivery-option"
      lines="none">

      <ion-label class="delivery-label">

        <div class="delivery-name">
          Standard Delivery
        </div>

        <div class="delivery-price">
          {{
            standardShipping === 0
              ? 'Free'
              : money(standardShipping)
          }}
        </div>

      </ion-label>

      <ion-radio
        class="delivery-radio"
        slot="end"
        value="Standard Delivery">
      </ion-radio>

    </ion-item>


    <!-- EXPRESS DELIVERY -->

    <ion-item
      class="delivery-option"
      lines="none">

      <ion-label class="delivery-label">

        <div class="delivery-name">
          Express Delivery
        </div>

        <div class="delivery-price">
          {{ money(expressShipping) }}
        </div>

      </ion-label>

      <ion-radio
        class="delivery-radio"
        slot="end"
        value="Express Delivery">
      </ion-radio>

    </ion-item>

  </div>

</ion-radio-group>




  <!-- =========================
       PAYMENT METHOD
       ========================= -->

  <div class="section-row">


    <h2>

      Payment Method

    </h2>


    <ion-button
      fill="clear"
      size="small"

      routerLink="/payments"

      [queryParams]="{
        select: 1
      }">


      Change


    </ion-button>


  </div>



  <div
    class="app-card row card-button payment-card"

    routerLink="/payments"

    [queryParams]="{
      select: 1
    }">


    <div class="category-icon">


      <ion-icon
        [name]="
          state.selectedPayment?.icon ||
          'wallet-outline'
        ">
      </ion-icon>


    </div>



    <div class="flex-1">


      <b>

        {{
          state.selectedPayment?.title ||
          'Select payment method'
        }}

      </b>


      <div class="muted">


        {{
          state.selectedPayment?.subtitle ||
          'Choose how you want to pay'
        }}


      </div>


    </div>



    <ion-icon
      name="chevron-forward-outline">
    </ion-icon>


  </div>



  <!-- =========================
       ORDER ITEMS
       ========================= -->

  <div class="section-row">


    <h2>

      Order Items

    </h2>


    <span class="muted">

      {{ totalQuantity }}
      item{{ totalQuantity === 1 ? '' : 's' }}

    </span>


  </div>



  <div class="app-card">


    <div
      class="checkout-item"

      *ngFor="
        let item
        of orderItems
      ">


      <img
        class="checkout-image"

        [src]="item.product.imageAsset"

        [alt]="item.product.name">



      <div class="checkout-item-info">


        <div class="checkout-item-name">

          {{ item.product.name }}

        </div>


        <div class="checkout-item-meta">

          {{
            money(
              item.product.price
            )
          }}

          ×

          {{ item.quantity }}

        </div>


      </div>



      <div class="checkout-item-total">


        {{
          money(
            item.product.price *
            item.quantity
          )
        }}


      </div>


    </div>


  </div>



  <!-- =========================
       ORDER SUMMARY
       ========================= -->

  <div class="section-row">


    <h2>

      Order Summary

    </h2>


  </div>



  <div class="app-card">


    <!-- SUBTOTAL -->

    <div
      class="row-between summary-row">


      <span class="summary-label">

        Subtotal

      </span>


      <b>

        {{ money(subtotal) }}

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
          shipping === 0
            ? 'Free'
            : money(shipping)
        }}


      </b>


    </div>



    <!-- DISCOUNT -->

    <div
      class="row-between summary-row"

      *ngIf="discount > 0">


      <span class="summary-label">

        Discount

      </span>


      <b class="success">

        −{{ money(discount) }}

      </b>


    </div>



    <hr class="summary-divider">



    <!-- TOTAL -->

    <div
      class="row-between total-row">


      <span>

        Order Total

      </span>


      <span>

        {{ money(total) }}

      </span>


    </div>



    <!-- PLACE ORDER -->

    <ion-button
      expand="block"

      class="primary-btn place-order-btn"

      (click)="confirmPlaceOrder()"

      [disabled]="
        !canPlaceOrder
      ">


      {{
        placingOrder
          ? 'Placing Order...'
          : 'Place Order'
      }}


    </ion-button>



    <p
      class="muted"

      *ngIf="!address"

      style="
        text-align:center;
        font-size:11px;
        margin-top:8px;
      ">


      Select a shipping address
      before placing your order.


    </p>


  </div>


</div>



<!-- =========================
     EMPTY CHECKOUT
     ========================= -->

<div
  class="empty-checkout"

  *ngIf="checkoutItems.length === 0">


  <div class="emoji">

    🛒

  </div>


  <h2>

    No items to checkout

  </h2>


  <p class="muted">

    Add products to your cart
    before checking out.

  </p>


  <ion-button
    routerLink="/catalog">


    Browse Products


  </ion-button>


</div>


</ion-content>

`
})


export class CheckoutPage implements OnInit {

  async validateStock(): Promise<boolean> {

  for (const item of this.orderItems) {


    const latest =
      this.state.products.find(
        p =>
          p.id === item.product.id
      );


    if (!latest) {

      await this.message(
        `${item.product.name} is no longer available.`
      );

      return false;

    }



    const stock =
      Number(
        latest.stockCount ?? 0
      );



    if (
      item.quantity > stock
    ) {

      await this.message(

        `Only ${stock} ${item.product.name} available.`

      );


      return false;

    }


  }


  return true;

}
  address:
    ShippingAddress |
    null = null;


  loadingAddress = true;


  placingOrder = false;


  delivery =
    'Standard Delivery';


  buyNowProductId:
    number |
    null = null;


  buyNowQuantity = 1;



  /*
    Existing shipping amounts
    from your original code.
  */

  readonly expressShipping = 220;



  constructor(

    public state: AppStateService,

    private addresses:
      AddressService,

    private orders:
      OrderService,

    private route:
      ActivatedRoute,

    private router:
      Router,

    private alerts:
      AlertController,

    private loading:
      LoadingController

  ) {}



  /* =========================
     INITIAL LOAD
     ========================= */

  async ngOnInit():
    Promise<void> {


    const productIdParam =
      this.route.snapshot
        .queryParamMap
        .get('productId');


    if (
      productIdParam !== null
    ) {


      const id =
        Number(productIdParam);


      if (
        Number.isFinite(id) &&
        id > 0
      ) {


        this.buyNowProductId =
          id;


      }

    }



    const quantity =
      Number(

        this.route.snapshot
          .queryParamMap
          .get('quantity')

        || 1

      );


    this.buyNowQuantity =
      Number.isFinite(quantity)

        ? Math.max(
            1,
            Math.floor(quantity)
          )

        : 1;



    await this.loadAddress();

  }



  /* =========================
     PAGE ENTER
     ========================= */

  async ionViewWillEnter():
    Promise<void> {


    if (
      this.state.checkoutAddress
    ) {


      this.address =
        this.state.checkoutAddress;


    } else if (
      !this.address
    ) {


      await this.loadAddress();


    }

  }



  /* =========================
     LOAD ADDRESS
     ========================= */

  async loadAddress():
    Promise<void> {


    this.loadingAddress =
      true;


    try {


      this.address =

        this.state.checkoutAddress

        ||

        await this.addresses
          .getDefaultAddress();


    } catch {


      this.address = null;


    } finally {


      this.loadingAddress =
        false;


    }

  }



  /* =========================
     CHOOSE ADDRESS
     ========================= */

  chooseAddress(): void {


    this.router.navigate(

      ['/addresses'],

      {

        queryParams: {
          select: 1
        }

      }

    );

  }



  /* =========================
     CHECKOUT ITEMS
     ========================= */

  get checkoutItems():
    [number, number][] {


    /*
      BUY NOW checkout
    */

    if (
      this.buyNowProductId !== null
    ) {


      return [

        [

          this.buyNowProductId,

          this.buyNowQuantity

        ]

      ];

    }


    /*
      NORMAL CART checkout
    */

    return [

      ...this.state.cart.entries()

    ];

  }



  /* =========================
     ORDER ITEM OBJECTS
     ========================= */

  get orderItems() {


    return this.checkoutItems

      .map(
        ([id, quantity]) => {


          const product =
            this.state.productById(id);


          return {

            product,

            quantity

          };


        }
      )

      .filter(
        item =>
          !!item.product
      );

  }



  /* =========================
     TOTAL QUANTITY
     ========================= */

  get totalQuantity():
    number {


    return this.checkoutItems.reduce(

      (
        total,
        [, quantity]
      ) =>

        total + quantity,

      0

    );

  }



  /* =========================
     SUBTOTAL
     ========================= */

  get subtotal():
    number {


    return this.checkoutItems.reduce(

      (
        total,
        [id, quantity]
      ) => {


        const product =
          this.state.productById(id);


        if (!product) {

          return total;

        }


        return (

          total

          +

          product.price *
          quantity

        );


      },

      0

    );

  }



  /* =========================
     STANDARD SHIPPING
     ========================= */

  get standardShipping():
    number {


    return (

      this.subtotal >= 3000

        ? 0

        : 120

    );

  }



  /* =========================
     SELECTED SHIPPING
     ========================= */

  get shipping():
    number {


    return (

      this.delivery ===
      'Express Delivery'

        ? this.expressShipping

        : this.standardShipping

    );

  }



  /* =========================
     DISCOUNT
     ========================= */

  get discount():
    number {


    if (
      !this.state.couponApplied
    ) {


      return 0;

    }


    return Math.min(

      this.subtotal * 0.10,

      349.90

    );

  }



  /* =========================
     TOTAL
     ========================= */

  get total():
    number {


    return (

      this.subtotal

      +

      this.shipping

      -

      this.discount

    );

  }



  /* =========================
     CAN PLACE ORDER
     ========================= */

  get canPlaceOrder():
    boolean {


    return (

      !this.loadingAddress

      &&

      !this.placingOrder

      &&

      !!this.address

      &&

      this.checkoutItems.length > 0

      &&

      !!this.state.selectedPayment?.title

    );

  }



  /* =========================
     FULL ADDRESS
     ========================= */

  fullAddress(
    address: ShippingAddress
  ): string {


    return (

      address.fullAddress

      ||

      [

        address.street,

        address.barangay,

        address.city,

        address.postalCode

      ]

        .filter(Boolean)

        .join(', ')

    );

  }



  /* =========================
     CONFIRM ORDER
     ========================= */

  async confirmPlaceOrder():
    Promise<void> {


    if (!this.address) {


      await this.message(
        'Select a shipping address first.'
      );


      return;

    }



    if (
      this.checkoutItems.length === 0
    ) {


      await this.message(
        'There are no items to checkout.'
      );


      return;

    }



    const payment =
      this.state.selectedPayment?.title;


    if (!payment) {


      await this.message(
        'Select a payment method first.'
      );


      return;

    }



    const alert =
      await this.alerts.create({


        header:
          'Place this order?',


        message:

          `Total: ${this.money(this.total)}
Payment: ${payment}
Delivery: ${this.delivery}`,


        buttons: [

          {

            text: 'Cancel',

            role: 'cancel'

          },

          {

            text: 'Place Order',

            handler: () => {


              void this.placeOrder();


            }

          }

        ]


      });


    await alert.present();

  }



  /* =========================
     PLACE ORDER
     ========================= */

  async placeOrder():
    Promise<void> {


    if (
      this.placingOrder
    ) {


      return;

    }



    if (!this.address) {


      await this.message(
        'Select a shipping address first.'
      );


      return;

    }



    if (
      this.checkoutItems.length === 0
    ) {


      await this.message(
        'There are no items to checkout.'
      );


      return;

    }



    const payment =
      this.state.selectedPayment?.title;


    if (!payment) {


      await this.message(
        'Select a payment method first.'
      );


      return;

    }



    this.placingOrder =
      true;



    const loader =
      await this.loading.create({


        message:
          'Placing order...'


      });



    await loader.present();



    try {
      const stockOkay =
  await this.validateStock();


if (!stockOkay) {

  return;

}

      /* =====================
         BUILD ITEMS
         ===================== */

      const items =
        this.checkoutItems.map(

          ([id, quantity]) => {


            const product =
              this.state.productById(id);


            return {


              productId:
                product.id,


              name:
                product.name,


              brand:
                product.brand,


              category:
                product.category,


              price:
                product.price,


              quantity,


              lineTotal:

                product.price *
                quantity


            };


          }

        );



      /* =====================
         SAVE ORDER
         ===================== */

      const result =
        await this.orders.placeOrder({


          items,


          shippingAddress:
            this.address,


          deliveryMethod:
            this.delivery,


          paymentMethod:
            payment,


          subtotal:
            this.subtotal,


          shippingFee:
            this.shipping,


          discount:
            this.discount,


          total:
            this.total


        });



      /* =====================
         CLEAR CART ONLY FOR
         NORMAL CART CHECKOUT
         ===================== */

      if (
        this.buyNowProductId === null
      ) {


        const cartIds = [

          ...this.state.cart.keys()

        ];


        for (
          const id
          of cartIds
        ) {


          this.state.removeFromCart(id);


        }

      }



      /* =====================
         GO TO SUCCESS PAGE
         ===================== */
      await this.state.loadProductsFromFirestore();
      await this.router.navigate(

        ['/order-success'],

        {

          queryParams: {


            orderId:
              result.orderId,


            orderNumber:
              result.orderNumber


          }

        }

      );


    } catch (error: any) {


      await this.message(

        error?.message

        ||

        'Unable to place order.'

      );


    } finally {


      this.placingOrder =
        false;


      try {


        await loader.dismiss();


      } catch {


        // Loader may already be dismissed.

      }

    }

  }



  /* =========================
     MONEY FORMAT
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



  /* =========================
     ALERT MESSAGE
     ========================= */

  private async message(
    message: string
  ): Promise<void> {


    const alert =
      await this.alerts.create({


        header:
          'SmileHub',


        message,


        buttons: [
          'OK'
        ]


      });


    await alert.present();

  }


}