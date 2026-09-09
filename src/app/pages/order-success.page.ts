import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { OrderService } from '../services/order.service';


@Component({
  selector: 'app-order-success',
  standalone: true,

  imports: [
    RouterModule,
    IonicModule,
    CommonModule
  ],

  styles: [`

    .success-shell {
      min-height: 100%;

      display: flex;
      flex-direction: column;

      justify-content: center;

      padding: 24px 16px 34px;

      text-align: center;
    }


    .success-icon {
      width: 86px;
      height: 86px;

      margin: 0 auto 18px;

      border-radius: 18px;

      display: flex;
      align-items: center;
      justify-content: center;

      background: #00ce75;

      color: white;

      font-size: 55px;
      font-weight: 900;
    }


    .success-title {
      margin: 0;

      font-size: 28px;
      font-weight: 900;
    }


    .success-message {
      margin: 16px auto 20px;

      max-width: 350px;

      line-height: 1.5;
    }


    .order-card {
      text-align: left;

      margin: 16px 0 20px;
    }


    .order-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      gap: 16px;

      margin-bottom: 8px;
    }


    .order-row:last-child {
      margin-bottom: 0;
    }


    .order-label {
      color: var(--ion-color-medium);
    }


    .order-value {
      max-width: 62%;

      text-align: right;

      font-weight: 800;
    }


    .order-number {
      color: var(--ion-color-primary);
    }


    .summary-divider {
      margin: 14px 0;

      opacity: .15;
    }


    .total-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      font-size: 18px;
      font-weight: 900;
    }


    .total-price {
      color: var(--ion-color-primary);
    }


    .success-actions {
      display: flex;
      flex-direction: column;

      gap: 8px;
    }


    .loading-order {
      min-height: 120px;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      gap: 10px;
    }


    .error-message {
      margin: 10px 0 16px;

      font-size: 12px;

      color: var(--ion-color-danger);
    }

  `],

  template: `

<ion-content>


<div class="success-shell">


  <!-- =========================
       SUCCESS ICON
       ========================= -->

  <div class="success-icon">

    ✓

  </div>



  <h1 class="success-title">

    Order placed!

  </h1>



  <p class="muted success-message">

    Thank you. Your SmileHub order
    has been submitted successfully.

  </p>



  <!-- =========================
       LOADING ORDER
       ========================= -->

  <div
    class="app-card loading-order"
    *ngIf="loadingOrder">


    <ion-spinner>
    </ion-spinner>


    <span class="muted">

      Loading order details...

    </span>


  </div>



  <!-- =========================
       ORDER INFORMATION
       ========================= -->

  <div
    class="app-card order-card"
    *ngIf="!loadingOrder">


    <!-- ORDER NUMBER -->

    <div class="order-row">


      <span class="order-label">

        Order

      </span>


      <span
        class="order-value order-number">

        {{
          orderNumber ||
          'Confirmed'
        }}

      </span>


    </div>



    <!-- PAYMENT -->

    <div class="order-row">


      <span class="order-label">

        Payment

      </span>


      <span class="order-value">

        {{
          paymentMethod ||
          '—'
        }}

      </span>


    </div>



    <!-- DELIVERY -->

    <div class="order-row">


      <span class="order-label">

        Delivery

      </span>


      <span class="order-value">

        {{
          deliveryMethod ||
          '—'
        }}

      </span>


    </div>



    <hr class="summary-divider">



    <!-- TOTAL -->

    <div class="total-row">


      <span>

        Total

      </span>


      <span class="total-price">

        {{ money(total) }}

      </span>


    </div>


  </div>



  <!-- ERROR -->

  <div
    class="error-message"
    *ngIf="loadError">

    {{ loadError }}

  </div>



  <!-- =========================
       ACTIONS
       ========================= -->

  <div class="success-actions">


    <ion-button
      expand="block"
      class="primary-btn"

      (click)="viewOrder()">


      View My Order


    </ion-button>



    <ion-button
      expand="block"

      fill="outline"

      class="outline-btn"

      routerLink="/home">


      Continue Shopping


    </ion-button>


  </div>


</div>


</ion-content>

`
})


export class OrderSuccessPage
implements OnInit {


  orderId = '';


  orderNumber = '';


  paymentMethod = '';


  deliveryMethod = '';


  total = 0;


  loadingOrder = true;


  loadError = '';



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
      this.route.snapshot
        .queryParamMap;



    /*
      Checkout already sends:
      orderId
      orderNumber
    */

    this.orderId =
      query.get('orderId') || '';


    this.orderNumber =
      query.get('orderNumber') || '';



    /*
      Fallback support in case
      these are ever passed
      directly in the URL.
    */

    this.paymentMethod =
      query.get('paymentMethod') || '';


    this.deliveryMethod =
      query.get('deliveryMethod') || '';


    const queryTotal =
      Number(
        query.get('total') || 0
      );


    if (
      Number.isFinite(queryTotal)
    ) {

      this.total =
        queryTotal;

    }



    /*
      Get the ACTUAL order
      from Firestore.
    */

    await this.loadOrder();

  }



  /* =========================
     LOAD ORDER FROM FIRESTORE
     ========================= */

  private async loadOrder():
    Promise<void> {


    /*
      If no ID exists, use whatever
      information came from URL.
    */

    if (!this.orderId) {


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



      if (!order) {


        this.loadError =
          'Order details could not be found.';


        return;

      }



      /*
        Populate success page
        using saved Firestore data.
      */

      this.orderNumber =
        order.orderNumber
        || this.orderNumber;



      this.paymentMethod =
        order.paymentMethod
        || this.paymentMethod;



      this.deliveryMethod =
        order.deliveryMethod
        || this.deliveryMethod;



      const savedTotal =
        Number(
          order.total ?? this.total
        );


      this.total =
        Number.isFinite(savedTotal)

          ? savedTotal

          : 0;


    } catch (error: any) {


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
     VIEW SPECIFIC ORDER
     ========================= */

  viewOrder(): void {


    /*
      If order ID is available,
      diretso sa specific
      Order Details page.
    */

    if (this.orderId) {


      this.router.navigate([

        '/order-details',

        this.orderId

      ]);


      return;

    }



    /*
      Fallback
    */

    this.router.navigate([
      '/orders'
    ]);

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