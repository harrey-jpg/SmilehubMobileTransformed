import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  IonicModule
} from '@ionic/angular';

import {
  CommonModule
} from '@angular/common';

import {
  OrderService
} from '../services/order.service';


@Component({

  selector: 'app-order-success',

  standalone: true,

  imports: [
    RouterModule,
    IonicModule,
    CommonModule
  ],


  styles: [`

    /* =========================
       PAGE
       ========================= */

    .success-page {
      min-height: 100%;

      display: flex;
      align-items: center;
      justify-content: center;

      padding:
        28px 16px
        38px;
    }


    .success-container {
      width: 100%;
      max-width: 460px;
    }


    /* =========================
       SUCCESS HERO
       ========================= */

    .success-hero {
      text-align: center;

      margin-bottom: 22px;
    }


    .success-icon-wrap {
      position: relative;

      width: 96px;
      height: 96px;

      margin:
        0 auto 18px;
    }


    .success-icon-glow {
      position: absolute;

      inset: 6px;

      border-radius: 50%;

      background:
        rgba(
          var(--ion-color-success-rgb),
          .16
        );

      transform: scale(1.22);
    }


    .success-icon {
      position: relative;

      width: 96px;
      height: 96px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 28px;

      background:
        var(--ion-color-success);

      color: #ffffff;

      font-size: 48px;
      font-weight: 900;

      box-shadow:
        0 14px 32px
        rgba(
          var(--ion-color-success-rgb),
          .22
        );
    }


    .success-kicker {
      margin-bottom: 5px;

      color:
        var(--ion-color-success);

      font-size: 9px;
      font-weight: 900;

      letter-spacing: 1px;

      text-transform: uppercase;
    }


    .success-title {
      margin: 0;

      font-size: 28px;
      line-height: 1.15;

      font-weight: 900;
    }


    .success-message {
      max-width: 340px;

      margin:
        10px auto 0;

      font-size: 11px;
      line-height: 1.55;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       ORDER CARD
       ========================= */

    .order-card {
      margin-top: 20px;

      padding: 17px;

      border-radius: 20px;
    }


    .order-card-header {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 12px;

      margin-bottom: 15px;
    }


    .order-card-title {
      font-size: 13px;
      font-weight: 900;
    }


    .confirmed-badge {
      display: inline-flex;

      align-items: center;

      gap: 5px;

      padding:
        5px 8px;

      border-radius: 999px;

      background:
        rgba(
          var(--ion-color-success-rgb),
          .10
        );

      color:
        var(--ion-color-success);

      font-size: 8px;
      font-weight: 900;
    }


    .confirmed-dot {
      width: 6px;
      height: 6px;

      border-radius: 50%;

      background:
        var(--ion-color-success);
    }


    /* =========================
       ORDER NUMBER
       ========================= */

    .order-number-box {
      margin-bottom: 14px;

      padding:
        12px 13px;

      border-radius: 14px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .08
        );
    }


    .order-number-label {
      margin-bottom: 3px;

      font-size: 8px;

      color:
        var(--ion-color-medium);
    }


    .order-number {
      color:
        var(--ion-color-primary);

      font-size: 15px;
      font-weight: 900;

      word-break: break-word;
    }


    /* =========================
       ORDER ROWS
       ========================= */

    .order-row {
      min-height: 38px;

      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 16px;

      border-bottom:
        1px solid
        rgba(
          120,
          120,
          120,
          .10
        );

      font-size: 11px;
    }


    .order-row:last-of-type {
      border-bottom: none;
    }


    .order-label {
      color:
        var(--ion-color-medium);
    }


    .order-value {
      max-width: 65%;

      text-align: right;

      font-weight: 800;
    }


    /* =========================
       TOTAL
       ========================= */

    .summary-divider {
      margin:
        12px 0;

      border: none;

      border-top:
        1px solid
        rgba(
          120,
          120,
          120,
          .15
        );
    }


    .total-row {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 14px;
    }


    .total-label {
      font-size: 13px;
      font-weight: 900;
    }


    .total-price {
      color:
        var(--ion-color-primary);

      font-size: 21px;
      font-weight: 900;
    }


    /* =========================
       LOADING
       ========================= */

    .loading-order {
      min-height: 155px;

      margin-top: 20px;

      padding: 20px;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      gap: 11px;

      border-radius: 20px;

      text-align: center;
    }


    .loading-order span {
      font-size: 10px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       ERROR
       ========================= */

    .error-message {
      margin-top: 12px;

      padding:
        10px 12px;

      border-radius: 12px;

      background:
        rgba(
          var(--ion-color-danger-rgb),
          .08
        );

      color:
        var(--ion-color-danger);

      font-size: 10px;
      line-height: 1.45;

      text-align: center;
    }


    /* =========================
       NEXT STEP NOTE
       ========================= */

    .next-step {
      margin-top: 12px;

      padding:
        11px 12px;

      border-radius: 13px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .06
        );

      color:
        var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.5;

      text-align: center;
    }


    /* =========================
       ACTIONS
       ========================= */

    .success-actions {
      margin-top: 16px;

      display: flex;
      flex-direction: column;

      gap: 8px;
    }


    .success-actions ion-button {
      min-height: 47px;

      margin: 0;

      --border-radius: 14px;

      font-size: 11px;
      font-weight: 900;
    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (min-width: 700px) {

      .success-page {
        padding:
          40px 20px;
      }


      .success-container {
        max-width: 500px;
      }


      .order-card {
        padding: 20px;
      }

    }

  `],


  template: `

<ion-content>


  <div class="success-page">


    <div class="success-container">


      <!-- =========================
           SUCCESS HERO
           ========================= -->

      <div class="success-hero">


        <div class="success-icon-wrap">


          <div class="success-icon-glow">
          </div>


          <div class="success-icon">

            ✓

          </div>


        </div>


        <div class="success-kicker">

          Order Confirmed

        </div>


        <h1 class="success-title">

          Order placed!

        </h1>


        <p class="success-message">

          Thank you for shopping with SmileHub.
          Your order has been submitted successfully
          and is now being prepared for processing.

        </p>


      </div>



      <!-- =========================
           LOADING
           ========================= -->

      <div

        class="
          app-card
          loading-order
        "

        *ngIf="
          loadingOrder
        ">


        <ion-spinner
          name="crescent">
        </ion-spinner>


        <span>

          Loading your order details...

        </span>


      </div>



      <!-- =========================
           ORDER DETAILS
           ========================= -->

      <div

        class="
          app-card
          order-card
        "

        *ngIf="
          !loadingOrder
        ">


        <div class="order-card-header">


          <div class="order-card-title">

            Order Summary

          </div>


          <div class="confirmed-badge">


            <span class="confirmed-dot">
            </span>


            Confirmed


          </div>


        </div>



        <!-- ORDER NUMBER -->

        <div class="order-number-box">


          <div class="order-number-label">

            Order Number

          </div>


          <div class="order-number">

            {{
              orderNumber
              ||
              'Confirmed'
            }}

          </div>


        </div>



        <!-- PAYMENT -->

        <div class="order-row">


          <span class="order-label">

            Payment Method

          </span>


          <span class="order-value">

            {{
              paymentMethod
              ||
              '—'
            }}

          </span>


        </div>



        <!-- DELIVERY -->

        <div class="order-row">


          <span class="order-label">

            Delivery Method

          </span>


          <span class="order-value">

            {{
              deliveryMethod
              ||
              '—'
            }}

          </span>


        </div>



        <hr class="summary-divider">



        <!-- TOTAL -->

        <div class="total-row">


          <span class="total-label">

            Order Total

          </span>


          <span class="total-price">

            {{ money(total) }}

          </span>


        </div>


      </div>



      <!-- =========================
           ERROR
           ========================= -->

      <div

        class="error-message"

        *ngIf="
          loadError
        ">


        {{ loadError }}


      </div>



      <!-- =========================
           NEXT STEP
           ========================= -->

      <div

        class="next-step"

        *ngIf="
          !loadingOrder &&
          !loadError
        ">


        You can track your order status
        anytime from My Orders.

      </div>



      <!-- =========================
           ACTIONS
           ========================= -->

      <div class="success-actions">


        <ion-button

          expand="block"

          class="primary-btn"

          (click)="viewOrder()">


          <ion-icon

            slot="start"

            name="receipt-outline">

          </ion-icon>


          View My Order


        </ion-button>



        <ion-button

          expand="block"

          fill="outline"

          class="outline-btn"

          routerLink="/home">


          <ion-icon

            slot="start"

            name="bag-handle-outline">

          </ion-icon>


          Continue Shopping


        </ion-button>


      </div>


    </div>


  </div>


</ion-content>

`

})


export class OrderSuccessPage
implements OnInit {


  orderId =
    '';


  orderNumber =
    '';


  paymentMethod =
    '';


  deliveryMethod =
    '';


  total =
    0;


  loadingOrder =
    true;


  loadError =
    '';



  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private orders:
      OrderService

  ) {}



  /* =========================
     INITIALIZE
     ========================= */

  async ngOnInit():
    Promise<void> {


    const query =
      this.route
        .snapshot
        .queryParamMap;


    this.orderId =
      query.get(
        'orderId'
      )
      ||
      '';


    this.orderNumber =
      query.get(
        'orderNumber'
      )
      ||
      '';


    this.paymentMethod =
      query.get(
        'paymentMethod'
      )
      ||
      '';


    this.deliveryMethod =
      query.get(
        'deliveryMethod'
      )
      ||
      '';


    const queryTotal =
      Number(
        query.get(
          'total'
        )
        ||
        0
      );


    if (
      Number.isFinite(
        queryTotal
      )
    ) {


      this.total =
        queryTotal;


    }


    await this
      .loadOrder();


  }



  /* =========================
     LOAD ORDER
     ========================= */

  private async loadOrder():
    Promise<void> {


    if (
      !this.orderId
    ) {


      this.loadingOrder =
        false;


      this.loadError =
        'Order details could not be loaded.';


      return;


    }


    try {


      const order =
        await this.orders
          .getOrder(
            this.orderId
          );


      if (
        !order
      ) {


        this.loadError =
          'Order details could not be found.';


        return;


      }


      this.orderNumber =

        order.orderNumber

        ||

        this.orderNumber;



      this.paymentMethod =

        order.paymentMethod

        ||

        this.paymentMethod;



      this.deliveryMethod =

        order.deliveryMethod

        ||

        this.deliveryMethod;



      const savedTotal =
        Number(

          order.total

          ??

          this.total

        );


      this.total =

        Number.isFinite(
          savedTotal
        )

          ? savedTotal

          : 0;


    } catch (
      error: any
    ) {


      console.error(
        'Unable to load order:',
        error
      );


      this.loadError =

        error?.message

        ||

        'Unable to load complete order details.';


    } finally {


      this.loadingOrder =
        false;


    }


  }



  /* =========================
     VIEW ORDER
     ========================= */

  viewOrder():
    void {


    if (
      this.orderId
    ) {


      this.router.navigate(

        [

          '/order-details',

          this.orderId

        ]

      );


      return;


    }


    this.router.navigate(
      [
        '/orders'
      ]
    );


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