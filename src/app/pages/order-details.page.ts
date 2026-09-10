import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  IonicModule,
  ToastController,
  AlertController
} from '@ionic/angular';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  OrderService
} from '../services/order.service';

import {
  ReviewService,
  ProductReview
} from '../services/review.service';

import {
  AppStateService
} from '../services/app-state.service';

import {
  firebaseAuth
} from '../services/firebase';


@Component({
  selector: 'app-order-details',
  standalone: true,

  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],

  styles: [`

    /* =========================
       PAGE
       ========================= */

    .od-page {
      padding-bottom: 34px;
    }


    /* =========================
       ORDER HERO
       ========================= */

    .od-hero {
      padding: 17px;

      border-radius: 20px;

      background:
        linear-gradient(
          135deg,
          rgba(
            var(--ion-color-primary-rgb),
            .14
          ),
          rgba(
            var(--ion-color-primary-rgb),
            .04
          )
        );

      border:
        1px solid
        rgba(
          var(--ion-color-primary-rgb),
          .12
        );
    }


    .od-hero-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      gap: 12px;
    }


    .od-order-label {
      display: block;

      color:
        var(--ion-color-medium);

      font-size: 8px;
      font-weight: 900;

      letter-spacing: .6px;

      text-transform: uppercase;

      opacity: 1;
      visibility: visible;
    }


    .od-order-number {
      display: block;

      margin-top: 4px;

      color:
        var(--ion-text-color);

      font-size: 18px;
      line-height: 1.25;

      font-weight: 900;

      word-break: break-word;

      opacity: 1;
      visibility: visible;
    }


    .od-order-date {
      display: block;

      margin-top: 6px;

      color:
        var(--ion-color-medium);

      font-size: 9px;

      opacity: 1;
      visibility: visible;
    }


    /* =========================
       STATUS BADGE
       ========================= */

    .od-status {
      display: inline-flex;

      align-items: center;
      justify-content: center;

      flex-shrink: 0;

      min-height: 26px;

      padding:
        5px 10px;

      border-radius: 999px;

      font-size: 9px;
      font-weight: 900;

      opacity: 1;
      visibility: visible;
    }


    .od-status-pending {
      background:
        rgba(
          255,
          184,
          0,
          .18
        );

      color: #f2ac00;
    }


    .od-status-processing {
      background:
        rgba(
          31,
          142,
          255,
          .16
        );

      color: #469cff;
    }


    .od-status-shipped {
      background:
        rgba(
          112,
          84,
          255,
          .16
        );

      color: #9a87ff;
    }


    .od-status-delivered {
      background:
        rgba(
          0,
          206,
          117,
          .15
        );

      color:
        var(--ion-color-success);
    }


    .od-status-cancelled {
      background:
        rgba(
          var(--ion-color-danger-rgb),
          .14
        );

      color:
        var(--ion-color-danger);
    }


    /* =========================
       DELIVERED
       ========================= */

    .od-delivered-box {
      margin-top: 14px;

      padding: 12px;

      border-radius: 13px;

      background:
        rgba(
          var(--ion-color-success-rgb),
          .08
        );

      color:
        var(--ion-color-success);

      font-size: 10px;
      line-height: 1.5;

      font-weight: 700;
    }


    .od-buy-again-wrap {
      margin-top: 11px;
    }


    .od-buy-again-btn {
      width: 100%;

      min-height: 42px;

      margin: 0;

      --border-radius: 12px;

      font-size: 10px !important;
      font-weight: 900;
    }


    .od-buy-note {
      margin-top: 6px;

      color:
        var(--ion-color-medium);

      font-size: 8px;
      line-height: 1.45;
    }


    /* =========================
       CANCEL ORDER
       ========================= */

    .od-cancel-box {
      margin-top: 14px;

      padding: 12px;

      border-radius: 13px;

      border:
        1px solid
        rgba(
          var(--ion-color-danger-rgb),
          .18
        );

      background:
        rgba(
          var(--ion-color-danger-rgb),
          .05
        );
    }


    .od-cancel-title {
      display: block;

      color:
        var(--ion-text-color);

      font-size: 11px;
      font-weight: 900;

      opacity: 1;
      visibility: visible;
    }


    .od-cancel-text {
      display: block;

      margin-top: 4px;

      color:
        var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.5;

      opacity: 1;
      visibility: visible;
    }


    .od-cancel-btn {
      display: block;

      width: 100%;

      min-height: 40px;

      margin:
        11px 0 0;

      --border-radius: 11px;

      --color:
        var(--ion-color-danger);

      --border-color:
        var(--ion-color-danger);

      --background: transparent;

      font-size: 10px !important;
      font-weight: 900 !important;

      opacity: 1 !important;
      visibility: visible !important;
    }


    .od-button-label {
      display: inline !important;

      font-size: 10px !important;
      font-weight: 900 !important;

      opacity: 1 !important;
      visibility: visible !important;
    }


    .od-cancelled-box {
      margin-top: 14px;

      padding: 12px;

      border-radius: 13px;

      background:
        rgba(
          var(--ion-color-danger-rgb),
          .08
        );

      color:
        var(--ion-color-danger);

      font-size: 10px;
      line-height: 1.5;

      font-weight: 700;
    }


    .od-cancellation-reason {
      margin-top: 6px;

      color:
        var(--ion-text-color);

      font-weight: 700;
    }


    /* =========================
       SECTION TITLE
       ========================= */

    .od-section-title {
      margin:
        23px 2px 10px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;
    }


    .od-section-title h2 {
      display: block;

      margin: 0;

      color:
        var(--ion-text-color);

      font-size: 14px;
      font-weight: 900;

      opacity: 1;
      visibility: visible;
    }


    .od-section-meta {
      display: block;

      color:
        var(--ion-color-medium);

      font-size: 9px;

      opacity: 1;
      visibility: visible;
    }


    /* =========================
       TIMELINE
       ========================= */

    .od-timeline-card {
      padding:
        17px 15px;

      border-radius: 18px;
    }


    .od-timeline-item {
      position: relative;

      display: flex !important;

      align-items: flex-start;

      width: 100%;

      gap: 12px;

      padding-bottom: 20px;

      opacity: 1 !important;
      visibility: visible !important;
    }


    .od-timeline-item:last-child {
      padding-bottom: 0;
    }


    .od-timeline-item:not(:last-child)::before {
      content: '';

      position: absolute;

      left: 14px;
      top: 31px;

      width: 2px;

      height:
        calc(
          100% - 27px
        );

      background:
        rgba(
          120,
          120,
          120,
          .18
        );
    }


    .od-timeline-item.od-completed:not(:last-child)::before {
      background:
        rgba(
          var(--ion-color-success-rgb),
          .42
        );
    }


    .od-timeline-dot {
      position: relative;

      z-index: 2;

      width: 30px;
      min-width: 30px;

      height: 30px;

      flex: 0 0 30px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background:
        rgba(
          120,
          120,
          120,
          .23
        );

      color: #ffffff;

      font-size: 14px;
    }


    .od-timeline-dot.od-completed {
      background:
        var(--ion-color-success);
    }


    .od-timeline-dot.od-current {
      background:
        var(--ion-color-primary);

      box-shadow:
        0 0 0 5px
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );
    }


    .od-timeline-dot.od-cancelled {
      background:
        var(--ion-color-danger);
    }


    .od-timeline-content {
      display: block !important;

      flex: 1 1 auto;

      min-width: 0;

      width: auto;

      padding-top: 3px;

      color:
        var(--ion-text-color) !important;

      opacity: 1 !important;
      visibility: visible !important;
    }


    .od-timeline-title {
      display: block !important;

      color:
        var(--ion-text-color) !important;

      font-size: 12px !important;
      line-height: 1.25;

      font-weight: 900 !important;

      opacity: 1 !important;
      visibility: visible !important;
    }


    .od-timeline-text {
      display: block !important;

      margin-top: 3px;

      color:
        var(--ion-color-medium) !important;

      font-size: 9px !important;
      line-height: 1.45;

      opacity: 1 !important;
      visibility: visible !important;
    }


    /* =========================
       ITEMS
       ========================= */

    .od-items-list {
      display: flex;
      flex-direction: column;

      gap: 10px;
    }


    .od-item-card {
      display: block;

      padding: 13px;

      border-radius: 18px;

      opacity: 1;
      visibility: visible;
    }


    .od-item-main {
      display: flex !important;

      align-items: center;

      width: 100%;

      gap: 12px;

      opacity: 1 !important;
      visibility: visible !important;
    }


    .od-item-image-wrap {
      width: 72px;
      min-width: 72px;

      height: 72px;

      flex: 0 0 72px;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;

      border-radius: 15px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .08
        );
    }


    .od-item-image {
      display: block;

      width: 58px;
      height: 58px;

      object-fit: contain;

      opacity: 1;
      visibility: visible;
    }


    .od-item-info {
      display: block !important;

      flex: 1 1 auto;

      min-width: 0;

      width: auto;

      color:
        var(--ion-text-color) !important;

      opacity: 1 !important;
      visibility: visible !important;
    }


    .od-item-brand {
      display: block !important;

      margin-bottom: 3px;

      color:
        var(--ion-color-primary) !important;

      font-size: 8px !important;
      font-weight: 900 !important;

      text-transform: uppercase;

      opacity: 1 !important;
      visibility: visible !important;
    }


    .od-item-name {
      display: block !important;

      color:
        var(--ion-text-color) !important;

      font-size: 11px !important;
      line-height: 1.35;

      font-weight: 900 !important;

      overflow: hidden;

      opacity: 1 !important;
      visibility: visible !important;
    }


    .od-item-meta {
      display: block !important;

      margin-top: 5px;

      color:
        var(--ion-color-medium) !important;

      font-size: 9px !important;
      line-height: 1.4;

      opacity: 1 !important;
      visibility: visible !important;
    }


    .od-item-total {
      display: block !important;

      flex: 0 0 auto;

      margin-left: auto;

      text-align: right;

      color:
        var(--ion-color-primary) !important;

      font-size: 12px !important;
      font-weight: 900 !important;

      white-space: nowrap;

      opacity: 1 !important;
      visibility: visible !important;
    }


    /* =========================
       REVIEWS
       ========================= */

    .od-review-action {
      margin-top: 13px;

      padding-top: 12px;

      border-top:
        1px solid
        rgba(
          120,
          120,
          120,
          .10
        );
    }


    .od-reviewed-label {
      display: flex;

      align-items: center;

      gap: 6px;

      color:
        var(--ion-color-success);

      font-size: 10px;
      font-weight: 900;
    }


    .od-reviewed-actions {
      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 8px;

      margin-top: 9px;
    }


    .od-reviewed-actions ion-button {
      min-height: 37px;

      margin: 0;

      --border-radius: 11px;

      font-size: 9px !important;
      font-weight: 800;
    }


    .od-rate-btn {
      min-height: 38px;

      margin: 0;

      --border-radius: 11px;

      font-size: 10px !important;
      font-weight: 900;
    }


    /* =========================
       REVIEW FORM
       ========================= */

    .od-review-form {
      margin-top: 11px;

      padding: 13px;

      border-radius: 14px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .05
        );
    }


    .od-review-title {
      color:
        var(--ion-text-color);

      font-size: 12px;
      font-weight: 900;
    }


    .od-review-subtitle {
      margin-top: 3px;

      color:
        var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.45;
    }


    .od-star-row {
      margin-top: 12px;

      display: flex;
      align-items: center;

      gap: 3px;

      flex-wrap: wrap;
    }


    .od-star-btn {
      padding: 0;

      border: none;

      background: transparent;

      color: #f4b400;

      font-size: 28px;
      line-height: 1;

      cursor: pointer;
    }


    .od-rating-label {
      margin-left: 6px;

      color:
        var(--ion-color-medium);

      font-size: 9px;
      font-weight: 800;
    }


    .od-review-textarea {
      margin-top: 13px;

      --background:
        rgba(
          120,
          120,
          120,
          .06
        );

      --color:
        var(--ion-text-color);

      --placeholder-color:
        var(--ion-color-medium);

      --border-radius: 12px;

      --padding-start: 11px;
      --padding-end: 11px;
      --padding-top: 10px;
      --padding-bottom: 10px;

      font-size: 11px;
    }


    .od-char-count {
      margin-top: 4px;

      text-align: right;

      color:
        var(--ion-color-medium);

      font-size: 8px;
    }


    .od-review-buttons {
      margin-top: 11px;

      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 8px;
    }


    .od-review-buttons ion-button {
      min-height: 39px;

      margin: 0;

      --border-radius: 11px;

      font-size: 9px !important;
      font-weight: 900;
    }


    /* =========================
       SHIPPING
       ========================= */

    .od-shipping-card {
      padding: 15px;

      border-radius: 18px;
    }


    .od-shipping-top {
      display: flex;

      align-items: center;

      gap: 11px;
    }


    .od-shipping-icon {
      width: 42px;
      min-width: 42px;

      height: 42px;

      flex: 0 0 42px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 13px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      font-size: 20px;
    }


    .od-shipping-info {
      flex: 1;

      min-width: 0;
    }


    .od-shipping-label {
      display: block;

      color:
        var(--ion-text-color) !important;

      font-size: 11px;
      font-weight: 900;

      opacity: 1;
    }


    .od-shipping-recipient {
      display: block;

      margin-top: 3px;

      color:
        var(--ion-color-medium) !important;

      font-size: 9px;

      opacity: 1;
    }


    .od-shipping-address {
      display: block;

      margin-top: 12px;

      padding:
        10px 11px;

      border-radius: 12px;

      background:
        rgba(
          120,
          120,
          120,
          .05
        );

      color:
        var(--ion-color-medium) !important;

      font-size: 10px;
      line-height: 1.5;

      opacity: 1;
    }


    .od-shipping-method {
      margin-top: 13px;

      padding-top: 12px;

      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 12px;

      border-top:
        1px solid
        rgba(
          120,
          120,
          120,
          .10
        );

      font-size: 10px;
    }


    .od-shipping-method-label {
      color:
        var(--ion-color-medium) !important;
    }


    .od-shipping-method-value {
      color:
        var(--ion-text-color) !important;

      text-align: right;

      font-weight: 900;
    }


    /* =========================
       PAYMENT
       ========================= */

    .od-payment-card {
      padding: 15px;

      border-radius: 18px;
    }


    .od-payment-row {
      min-height: 34px;

      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 14px;

      font-size: 10px;

      opacity: 1;
      visibility: visible;
    }


    .od-payment-label {
      color:
        var(--ion-color-medium) !important;
    }


    .od-payment-value {
      color:
        var(--ion-text-color) !important;

      text-align: right;

      font-weight: 800;

      opacity: 1;
    }


    .od-discount {
      color:
        var(--ion-color-success) !important;
    }


    .od-summary-divider {
      margin:
        10px 0;

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


    .od-total-row {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 14px;
    }


    .od-total-label {
      color:
        var(--ion-text-color) !important;

      font-size: 13px;
      font-weight: 900;
    }


    .od-total-value {
      color:
        var(--ion-color-primary) !important;

      font-size: 20px;
      font-weight: 900;
    }


    /* =========================
       LOADING
       ========================= */

    .od-state {
      min-height: 70vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      gap: 10px;

      padding: 30px;

      text-align: center;
    }


    .od-state-icon {
      width: 76px;
      height: 76px;

      display: flex;

      align-items: center;
      justify-content: center;

      margin-bottom: 4px;

      border-radius: 22px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      font-size: 34px;
    }


    .od-state h2 {
      margin: 0;

      color:
        var(--ion-text-color);

      font-size: 18px;
      font-weight: 900;
    }


    .od-state p {
      max-width: 260px;

      margin: 0;

      color:
        var(--ion-color-medium);

      font-size: 10px;
      line-height: 1.5;
    }


    /* =========================
       DESKTOP
       ========================= */

    @media (min-width: 760px) {

      .od-layout {
        display: grid;

        grid-template-columns:
          minmax(0, 1.3fr)
          minmax(290px, .7fr);

        gap: 20px;

        align-items: start;
      }


      .od-side {
        position: sticky;

        top: 16px;
      }


      .od-side
      .od-section-title:first-child {
        margin-top: 0;
      }

    }


    @media (max-width: 390px) {

      .od-item-image-wrap {
        width: 62px;
        min-width: 62px;

        height: 62px;

        flex-basis: 62px;
      }


      .od-item-image {
        width: 50px;
        height: 50px;
      }


      .od-item-main {
        gap: 9px;
      }


      .od-item-total {
        font-size: 10px !important;
      }

    }

  `],


  template: `

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        defaultHref="/orders">
      </ion-back-button>

    </ion-buttons>


    <ion-title>
      Order Details
    </ion-title>


  </ion-toolbar>

</ion-header>



<ion-content>


  <!-- =========================
       ORDER
       ========================= -->

  <div

    class="page-wrap no-bottom od-page"

    *ngIf="
      order;
      else loadingTpl
    ">



    <!-- =========================
         HERO
         ========================= -->

    <div class="od-hero">


      <div class="od-hero-top">


        <div>


          <span class="od-order-label">

            Order Number

          </span>


          <span class="od-order-number">

            {{
              order.orderNumber
              ||
              order.id
              ||
              currentOrderId
            }}

          </span>


          <span class="od-order-date">

            Placed {{ date(order.createdAt) }}

          </span>


        </div>



        <span

          class="od-status"

          [ngClass]="
            statusClass(
              displayOrderStatus
            )
          ">

          {{ displayOrderStatus }}

        </span>


      </div>



      <!-- DELIVERED -->

      <div

        class="od-delivered-box"

        *ngIf="
          isDelivered
        ">

        ✓ Your order has been delivered.
        You can now rate the products you purchased.


        <div class="od-buy-again-wrap">


          <ion-button

            class="od-buy-again-btn"

            expand="block"

            size="small"

            [disabled]="
              buyingAgain
            "

            (click)="
              buyAgain()
            ">


            <ion-spinner

              *ngIf="
                buyingAgain
              "

              slot="start"

              name="crescent">

            </ion-spinner>


            <ion-icon

              *ngIf="
                !buyingAgain
              "

              slot="start"

              name="cart-outline">

            </ion-icon>


            <span class="od-button-label">

              {{
                buyingAgain
                  ? 'Adding to Cart...'
                  : 'Buy Again'
              }}

            </span>


          </ion-button>


          <div class="od-buy-note">

            Current prices and
            stock availability will apply.

          </div>


        </div>


      </div>



      <!-- CANCEL -->

      <div

        class="od-cancel-box"

        *ngIf="
          canCancelOrder
        ">


        <span class="od-cancel-title">

          Need to cancel this order?

        </span>


        <span class="od-cancel-text">

          Orders can only be cancelled
          while Pending or Processing.
          Reserved stock will be returned
          automatically.

        </span>


        <ion-button

          class="od-cancel-btn"

          expand="block"

          fill="outline"

          color="danger"

          [disabled]="
            cancellingOrder
          "

          (click)="
            confirmCancelOrder()
          ">


          <ion-spinner

            *ngIf="
              cancellingOrder
            "

            slot="start"

            name="crescent">

          </ion-spinner>


          <span class="od-button-label">

            {{
              cancellingOrder
                ? 'Cancelling...'
                : 'Cancel Order'
            }}

          </span>


        </ion-button>


      </div>



      <!-- CANCELLED -->

      <div

        class="od-cancelled-box"

        *ngIf="
          isCancelled
        ">

        This order has been cancelled.
        Any reserved product stock
        has been returned.


        <div

          class="od-cancellation-reason"

          *ngIf="
            order.cancellationReason
          ">

          Reason:
          {{ order.cancellationReason }}

        </div>


      </div>


    </div>



    <!-- =========================
         MAIN LAYOUT
         ========================= -->

    <div class="od-layout">


      <!-- LEFT -->

      <div class="od-main">


        <!-- =========================
             STATUS
             ========================= -->

        <div class="od-section-title">

          <h2>
            Order Status
          </h2>

        </div>


        <div class="app-card od-timeline-card">


          <div

            class="od-timeline-item"

            *ngFor="
              let step
              of displayStatusSteps
            "

            [class.od-completed]="
              isCompleted(step)
            "

            [class.od-current]="
              isCurrent(step)
            ">


            <div

              class="od-timeline-dot"

              [class.od-completed]="
                isCompleted(step)
              "

              [class.od-current]="
                isCurrent(step)
              "

              [class.od-cancelled]="
                step === 'Cancelled'
              ">


              <ion-icon

                *ngIf="
                  isCompleted(step)
                "

                [name]="
                  step === 'Cancelled'
                    ? 'close-outline'
                    : 'checkmark-outline'
                ">

              </ion-icon>


            </div>



            <div class="od-timeline-content">


              <span class="od-timeline-title">

                {{ step }}

              </span>


              <span class="od-timeline-text">

                {{ statusMessage(step) }}

              </span>


            </div>


          </div>


        </div>



        <!-- =========================
             ITEMS
             ========================= -->

        <div class="od-section-title">


          <h2>
            Items
          </h2>


          <span class="od-section-meta">

            {{ itemCount }}

            item{{
              itemCount === 1
                ? ''
                : 's'
            }}

          </span>


        </div>



        <div class="od-items-list">


          <div

            class="app-card od-item-card"

            *ngFor="
              let item
              of order.items || []
            ">


            <div class="od-item-main">


              <!-- IMAGE -->

              <div class="od-item-image-wrap">


                <img

                  class="od-item-image"

                  [src]="
                    itemImage(item)
                  "

                  [alt]="
                    item.name
                    ||
                    'Product'
                  "

                  (error)="
                    onProductImageError($event)
                  ">


              </div>



              <!-- INFO -->

              <div class="od-item-info">


                <span class="od-item-brand">

                  {{
                    item.brand
                    ||
                    item.category
                    ||
                    'SmileHub'
                  }}

                </span>


                <span class="od-item-name">

                  {{
                    item.name
                    ||
                    'Product'
                  }}

                </span>


                <span class="od-item-meta">

                  Qty {{ item.quantity || 1 }}

                  •

                  {{
                    money(
                      item.price
                      ||
                      0
                    )
                  }}

                  each

                </span>


              </div>



              <!-- TOTAL -->

              <span class="od-item-total">

                {{
                  money(
                    item.lineTotal
                    ||
                    (
                      NumberValue(
                        item.price
                      )
                      *
                      NumberValue(
                        item.quantity
                      )
                    )
                  )
                }}

              </span>


            </div>



            <!-- =========================
                 REVIEW
                 ========================= -->

            <div

              class="od-review-action"

              *ngIf="
                canReviewItem(item)
              ">



              <!-- ALREADY REVIEWED -->

              <ng-container

                *ngIf="
                  isReviewed(item)
                ">


                <div class="od-reviewed-label">

                  ✓ You reviewed this product

                </div>


                <div

                  class="od-reviewed-actions"

                  *ngIf="
                    reviewingProductId !==
                    productId(item)
                  ">


                  <ion-button

                    size="small"

                    fill="outline"

                    (click)="
                      startEditReview(item)
                    ">

                    Edit Review

                  </ion-button>


                  <ion-button

                    size="small"

                    fill="outline"

                    color="danger"

                    [disabled]="
                      deletingReview
                    "

                    (click)="
                      confirmDeleteReview(item)
                    ">

                    Delete Review

                  </ion-button>


                </div>


              </ng-container>



              <!-- RATE -->

              <ion-button

                *ngIf="
                  !isReviewed(item)
                  &&
                  reviewingProductId !==
                  productId(item)
                "

                class="od-rate-btn"

                size="small"

                fill="outline"

                (click)="
                  startReview(item)
                ">

                ★ Rate Product

              </ion-button>



              <!-- REVIEW FORM -->

              <div

                class="od-review-form"

                *ngIf="
                  reviewingProductId ===
                  productId(item)
                ">


                <div class="od-review-title">

                  {{
                    editingReviewId
                      ? 'Edit Review'
                      : 'Rate '
                        +
                        (
                          item.name
                          ||
                          'Product'
                        )
                  }}

                </div>


                <div class="od-review-subtitle">

                  {{
                    editingReviewId
                      ? 'Update your rating or comment below.'
                      : 'Tell other SmileHub customers what you think about this product.'
                  }}

                </div>



                <div class="od-star-row">


                  <button

                    type="button"

                    class="od-star-btn"

                    *ngFor="
                      let star
                      of ratingOptions
                    "

                    (click)="
                      selectRating(star)
                    ">

                    {{
                      selectedRating >= star
                        ? '★'
                        : '☆'
                    }}

                  </button>


                  <span

                    class="od-rating-label"

                    *ngIf="
                      selectedRating > 0
                    ">

                    {{ ratingText }}

                  </span>


                </div>



                <ion-textarea

                  class="od-review-textarea"

                  [(ngModel)]="
                    reviewComment
                  "

                  placeholder="Write your review..."

                  [autoGrow]="true"

                  [maxlength]="500">

                </ion-textarea>


                <div class="od-char-count">

                  {{ reviewComment.length }}
                  / 500

                </div>



                <div class="od-review-buttons">


                  <ion-button

                    fill="outline"

                    color="medium"

                    [disabled]="
                      submittingReview
                    "

                    (click)="
                      cancelReview()
                    ">

                    Cancel

                  </ion-button>


                  <ion-button

                    [disabled]="
                      submittingReview
                      ||
                      selectedRating === 0
                      ||
                      reviewComment.trim().length < 3
                    "

                    (click)="
                      submitReview(item)
                    ">


                    <ion-spinner

                      *ngIf="
                        submittingReview
                      "

                      name="crescent">

                    </ion-spinner>


                    <span

                      *ngIf="
                        !submittingReview
                      ">

                      {{
                        editingReviewId
                          ? 'Save Changes'
                          : 'Submit Review'
                      }}

                    </span>


                  </ion-button>


                </div>


              </div>


            </div>


          </div>


        </div>


      </div>



      <!-- =========================
           RIGHT SIDE
           ========================= -->

      <div class="od-side">


        <!-- SHIPPING -->

        <div class="od-section-title">

          <h2>
            Shipping
          </h2>

        </div>


        <div class="app-card od-shipping-card">


          <div class="od-shipping-top">


            <div class="od-shipping-icon">

              📍

            </div>


            <div class="od-shipping-info">


              <span class="od-shipping-label">

                {{
                  order.shippingAddress?.label
                  ||
                  'Shipping Address'
                }}

              </span>


              <span class="od-shipping-recipient">

                {{
                  order.shippingAddress?.recipient
                  ||
                  '—'
                }}

                <ng-container
                  *ngIf="
                    order.shippingAddress?.phone
                  ">

                  • {{ order.shippingAddress.phone }}

                </ng-container>

              </span>


            </div>


          </div>



          <div class="od-shipping-address">

            {{ shippingAddressText }}

          </div>



          <div class="od-shipping-method">


            <span class="od-shipping-method-label">

              Delivery Method

            </span>


            <span class="od-shipping-method-value">

              {{
                order.deliveryMethod
                ||
                '—'
              }}

            </span>


          </div>


        </div>



        <!-- =========================
             PAYMENT
             ========================= -->

        <div class="od-section-title">

          <h2>
            Payment & Total
          </h2>

        </div>


        <div class="app-card od-payment-card">


          <div class="od-payment-row">


            <span class="od-payment-label">

              Payment

            </span>


            <span class="od-payment-value">

              {{
                order.paymentMethod
                ||
                '—'
              }}

            </span>


          </div>



          <div class="od-payment-row">


            <span class="od-payment-label">

              Subtotal

            </span>


            <span class="od-payment-value">

              {{
                money(
                  order.subtotal
                  ||
                  0
                )
              }}

            </span>


          </div>



          <div class="od-payment-row">


            <span class="od-payment-label">

              Shipping

            </span>


            <span class="od-payment-value">

              {{
                NumberValue(
                  order.shippingFee
                ) === 0

                  ? 'Free'

                  : money(
                      order.shippingFee
                      ||
                      0
                    )
              }}

            </span>


          </div>



          <div

            class="od-payment-row"

            *ngIf="
              hasDiscount
            ">


            <span class="od-payment-label">

              Discount

            </span>


            <span class="od-payment-value od-discount">

              −{{
                money(
                  order.discount
                  ||
                  0
                )
              }}

            </span>


          </div>



          <hr class="od-summary-divider">



          <div class="od-total-row">


            <span class="od-total-label">

              Order Total

            </span>


            <span class="od-total-value">

              {{
                money(
                  order.total
                  ||
                  0
                )
              }}

            </span>


          </div>


        </div>


      </div>


    </div>


  </div>



  <!-- =========================
       LOADING / NOT FOUND
       ========================= -->

  <ng-template #loadingTpl>


    <div class="od-state">


      <ng-container
        *ngIf="
          loading;
          else notFoundTpl
        ">


        <ion-spinner
          name="crescent">
        </ion-spinner>


        <p>

          Loading order details...

        </p>


      </ng-container>



      <ng-template #notFoundTpl>


        <div class="od-state-icon">

          📦

        </div>


        <h2>

          Order not found

        </h2>


        <p>

          This order could not be loaded
          or may no longer be available.

        </p>


        <ion-button

          fill="outline"

          (click)="
            backToOrders()
          ">

          Back to My Orders

        </ion-button>


      </ng-template>


    </div>


  </ng-template>


</ion-content>

`

})


export class OrderDetailsPage
implements OnDestroy {


  order:
    any =
    null;


  loading =
    true;


  private sub?: {
    unsubscribe(): void
  };


  currentOrderId =
    '';


  cancellingOrder =
    false;


  buyingAgain =
    false;



  /* =========================
     REVIEW
     ========================= */

  ratingOptions = [
    1,
    2,
    3,
    4,
    5
  ];


  reviewingProductId:
    number |
    null =
    null;


  selectedRating =
    0;


  reviewComment =
    '';


  submittingReview =
    false;


  reviewedProductIds =
    new Set<number>();


  myReviews =
    new Map<
      number,
      ProductReview
    >();


  editingReviewId:
    string |
    null =
    null;


  deletingReview =
    false;



  /* =========================
     STATUS STEPS
     ========================= */

  statusSteps = [
    'Pending',
    'Processing',
    'Shipped',
    'Delivered'
  ];



  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private service:
      OrderService,

    private state:
      AppStateService,

    private reviewService:
      ReviewService,

    private toastController:
      ToastController,

    private alertController:
      AlertController

  ) {}



  /* =========================
     PAGE ENTER
     ========================= */

  async ionViewWillEnter():
    Promise<void> {


    this.loading =
      true;


    this.sub
      ?.unsubscribe();


    try {


      this.currentOrderId =
        this.route
          .snapshot
          .paramMap
          .get(
            'id'
          )
        ||
        '';


      if (
        !this.currentOrderId
      ) {


        this.order =
          null;


        this.loading =
          false;


        return;


      }


      /*
       * Load product catalog first
       * for current product images.
       */

      try {


        await this.state
          .loadProductsFromFirestore();


      } catch (
        error
      ) {


        console.error(
          'Unable to refresh products:',
          error
        );


      }


      this.sub =
        this.service
          .watchOrder(
            this.currentOrderId
          )
          .subscribe({


            next:
              row => {


                this.order =
                  row;


                this.loading =
                  false;


                if (
                  this.isDelivered
                ) {


                  void this
                    .loadReviewState();


                } else {


                  this.reviewedProductIds =
                    new Set<number>();


                  this.myReviews =
                    new Map<
                      number,
                      ProductReview
                    >();


                  this.cancelReview();


                }


              },


            error:
              error => {


                console.error(
                  'Unable to load order:',
                  error
                );


                this.order =
                  null;


                this.loading =
                  false;


              }


          });


    } catch (
      error
    ) {


      console.error(
        'Order details error:',
        error
      );


      this.order =
        null;


      this.loading =
        false;


    }


  }



  /* =========================
     LEAVE
     ========================= */

  ionViewWillLeave():
    void {


    this.sub
      ?.unsubscribe();


    this.cancelReview();


  }



  ngOnDestroy():
    void {


    this.sub
      ?.unsubscribe();


  }



  /* =========================
     BACK
     ========================= */

  backToOrders():
    void {


    void this.router
      .navigateByUrl(
        '/orders'
      );


  }



  /* =========================
     NUMBER HELPER
     ========================= */

  NumberValue(
    value: any
  ):
    number {


    const parsed =
      Number(
        value
        ||
        0
      );


    return Number.isFinite(
      parsed
    )
      ? parsed
      : 0;


  }



  /* =========================
     STATUS
     ========================= */

  get isDelivered():
    boolean {


    return (

      this.normalizeOrderStatus(
        String(
          this.order?.status
          ||
          ''
        )
      )

      ===

      'Delivered'

    );


  }



  get isCancelled():
    boolean {


    const value =
      String(
        this.order?.status
        ||
        ''
      )
        .trim()
        .toLowerCase();


    return (

      value ===
        'cancelled'

      ||

      value ===
        'canceled'

    );


  }



  get displayOrderStatus():
    string {


    if (
      this.isCancelled
    ) {


      return 'Cancelled';


    }


    return this.normalizeOrderStatus(

      String(
        this.order?.status
        ||
        'Pending'
      )

    );


  }



  statusClass(
    status: string
  ):
    string {


    const value =
      String(
        status
        ||
        'Pending'
      )
        .trim()
        .toLowerCase();


    switch (
      value
    ) {


      case 'processing':

        return 'od-status-processing';


      case 'shipped':

        return 'od-status-shipped';


      case 'delivered':

        return 'od-status-delivered';


      case 'cancelled':

      case 'canceled':

        return 'od-status-cancelled';


      default:

        return 'od-status-pending';


    }


  }



  private normalizeOrderStatus(
    status: string
  ):
    string {


    const clean =
      String(
        status
        ||
        ''
      )
        .trim();


    const lower =
      clean
        .toLowerCase();


    if (
      lower === 'packed'
      ||
      lower === 'out for delivery'
    ) {


      return 'Shipped';


    }


    if (
      lower === 'pending'
    ) {


      return 'Pending';


    }


    if (
      lower === 'processing'
    ) {


      return 'Processing';


    }


    if (
      lower === 'shipped'
    ) {


      return 'Shipped';


    }


    if (
      lower === 'delivered'
    ) {


      return 'Delivered';


    }


    if (
      lower === 'cancelled'
      ||
      lower === 'canceled'
    ) {


      return 'Cancelled';


    }


    return clean
      ||
      'Pending';


  }



  /* =========================
     CANCEL
     ========================= */

  get canCancelOrder():
    boolean {


    if (
      !this.order
      ||
      this.cancellingOrder
    ) {


      return false;


    }


    return this.service
      .canCancelStatus(

        String(
          this.order.status
          ||
          ''
        )

      );


  }



 async confirmCancelOrder():
  Promise<void> {


  if (
    !this.canCancelOrder
  ) {

    return;

  }


  const alert =
    await this.alertController
      .create({

        header:
          'Cancel Order',

        message:
          'Please select your reason for cancelling this order.',

        inputs: [

          {
            type: 'radio',
            label: 'Changed my mind',
            value: 'Changed my mind'
          },

          {
            type: 'radio',
            label: 'Ordered by mistake',
            value: 'Ordered by mistake'
          },

          {
            type: 'radio',
            label: 'Need to change items or quantity',
            value: 'Need to change items or quantity'
          },

          {
            type: 'radio',
            label: 'Need to change shipping address',
            value: 'Need to change shipping address'
          },

          {
            type: 'radio',
            label: 'Payment issue',
            value: 'Payment issue'
          },

          {
            type: 'radio',
            label: 'No longer need the order',
            value: 'No longer need the order'
          },

          {
            type: 'radio',
            label: 'Other',
            value: 'Other'
          }

        ],

        buttons: [

          {
            text:
              'Keep Order',

            role:
              'cancel'
          },

          {
            text:
              'Continue',

            handler:
              reason => {


                if (
                  !reason
                ) {


                  void this.showToast(
                    'Please select a cancellation reason.'
                  );


                  return false;

                }


                if (
                  reason === 'Other'
                ) {


                  void this
                    .showOtherReasonPrompt();


                  return true;

                }


                void this.cancelOrder(
                  reason
                );


                return true;


              }

          }

        ]

      });


  await alert.present();


}
private async showOtherReasonPrompt():
  Promise<void> {


  const alert =
    await this.alertController
      .create({

        header:
          'Other Reason',

        message:
          'Please briefly explain why you want to cancel this order.',

        inputs: [

          {
            name:
              'reason',

            type:
              'textarea',

            placeholder:
              'Enter your reason here...'
          }

        ],

        buttons: [

          {
            text:
              'Back',

            role:
              'cancel',

            handler:
              () => {


                void this
                  .confirmCancelOrder();


              }
          },

          {
            text:
              'Cancel Order',

            role:
              'destructive',

            handler:
              data => {


                const reason =
                  String(
                    data?.reason
                    ||
                    ''
                  )
                    .trim();


                if (
                  reason.length < 3
                ) {


                  void this.showToast(
                    'Please enter a cancellation reason.'
                  );


                  return false;

                }


                void this.cancelOrder(
                  'Other: ' + reason
                );


                return true;


              }

          }

        ]

      });


  await alert.present();


}



  private async cancelOrder(
    reason: string
  ):
    Promise<void> {


    if (
      this.cancellingOrder
      ||
      !this.currentOrderId
    ) {


      return;


    }


    this.cancellingOrder =
      true;


    try {


      await this.service
        .cancelOrder(

          this.currentOrderId,

          String(
            reason
            ||
            ''
          )
            .trim()

          ||

          'Changed my mind'

        );


      this.cancelReview();


      await this.showToast(
        'Order cancelled successfully.'
      );


    } catch (
      error: any
    ) {


      console.error(
        'Cancel order error:',
        error
      );


      await this.showToast(

        error?.message

        ||

        'Unable to cancel this order.'

      );


    } finally {


      this.cancellingOrder =
        false;


    }


  }



  /* =========================
     BUY AGAIN
     ========================= */

  async buyAgain():
    Promise<void> {


    if (
      this.buyingAgain
      ||
      !this.isDelivered
    ) {


      return;


    }


    const items =

      Array.isArray(
        this.order?.items
      )

        ? this.order.items

        : [];


    if (
      items.length === 0
    ) {


      await this.showToast(
        'There are no items to reorder.'
      );


      return;


    }


    this.buyingAgain =
      true;


    try {


      await this.state
        .loadProductsFromFirestore();


      let addedUnits =
        0;


      let addedProducts =
        0;


      const unavailable:
        string[] =
        [];


      const adjusted:
        string[] =
        [];


      for (
        const item
        of items
      ) {


        const id =
          this.productId(
            item
          );


        if (
          !Number.isFinite(id)
        ) {


          unavailable.push(
            String(
              item?.name
              ||
              'Unknown product'
            )
          );


          continue;


        }


        const product =
          this.state.products
            .find(

              row =>
                Number(
                  row.id
                ) === id

            );


        if (
          !product
        ) {


          unavailable.push(
            String(
              item?.name
              ||
              'Product'
            )
          );


          continue;


        }


        const requested =
          Math.max(

            1,

            Math.floor(
              Number(
                item?.quantity
                ||
                1
              )
            )

          );


        const currentInCart =
          this.state
            .quantityFor(
              id
            );


        const stock =
          this.currentStockFor(
            product
          );


        let quantityToAdd =
          requested;


        if (
          stock !== null
        ) {


          const remaining =
            Math.max(

              0,

              stock
              -
              currentInCart

            );


          if (
            remaining <= 0
          ) {


            unavailable.push(
              String(
                product.name
                ||
                item?.name
                ||
                'Product'
              )
            );


            continue;


          }


          quantityToAdd =
            Math.min(
              requested,
              remaining
            );


          if (
            quantityToAdd <
            requested
          ) {


            adjusted.push(
              String(
                product.name
                ||
                item?.name
                ||
                'Product'
              )
            );


          }


        }


        if (
          quantityToAdd <= 0
        ) {


          continue;


        }


        this.state
          .addToCart(
            id,
            quantityToAdd
          );


        addedUnits +=
          quantityToAdd;


        addedProducts +=
          1;


      }


      if (
        addedProducts === 0
      ) {


        await this.showToast(
          'None of the items can be added right now. Please check current stock.'
        );


        return;


      }


      let message =
        String(
          addedUnits
        )
        +
        ' item'
        +
        (
          addedUnits === 1
            ? ''
            : 's'
        )
        +
        ' added to cart.';


      if (
        unavailable.length > 0
      ) {


        message +=
          ' '
          +
          unavailable.length
          +
          ' product'
          +
          (
            unavailable.length === 1
              ? ''
              : 's'
          )
          +
          ' unavailable.';


      }


      if (
        adjusted.length > 0
      ) {


        message +=
          ' Some quantities were adjusted to current stock.';


      }


      await this.showToast(
        message
      );


      await this.router
        .navigateByUrl(
          '/cart'
        );


    } catch (
      error: any
    ) {


      console.error(
        'Buy Again error:',
        error
      );


      await this.showToast(

        error?.message

        ||

        'Unable to add these items to your cart.'

      );


    } finally {


      this.buyingAgain =
        false;


    }


  }



  /* =========================
     STOCK
     ========================= */

  private currentStockFor(
    product: any
  ):
    number | null {


    if (
      typeof product?.stockCount ===
        'number'
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


    const raw =
      String(
        product?.stock
        ??
        ''
      )
        .trim();


    if (
      /^[0-9]+$/.test(
        raw
      )
    ) {


      return Math.max(
        0,
        Number(raw)
      );


    }


    const label =
      raw.toLowerCase();


    if (
      label === '0'
      ||
      label.includes('out of stock')
      ||
      label.includes('sold out')
      ||
      label.includes('unavailable')
    ) {


      return 0;


    }


    return null;


  }



  /* =========================
     PRODUCT
     ========================= */

  productId(
    item: any
  ):
    number {


    return Number(
      item?.productId
    );


  }



  itemImage(
    item: any
  ):
    string {


    const id =
      this.productId(
        item
      );


    if (
      Number.isFinite(id)
    ) {


      const product =
        this.state.products
          .find(

            row =>
              Number(
                row.id
              ) === id

          );


      if (
        product?.image
      ) {


        return String(
          product.image
        );


      }


      if (
        product?.imageAsset
      ) {


        return String(
          product.imageAsset
        );


      }


    }


    if (
      item?.image
    ) {


      return String(
        item.image
      );


    }


    if (
      item?.imageAsset
    ) {


      return String(
        item.imageAsset
      );


    }


    return 'assets/products/default.svg';


  }



onProductImageError(
  event: Event
): void {

  const target =
    event.target;

  if (
    !(target instanceof HTMLImageElement)
  ) {

    return;

  }

  if (
    target.dataset['fallbackApplied'] ===
    '1'
  ) {

    return;

  }

  target.dataset['fallbackApplied'] =
    '1';

  target.src =
    'assets/products/default.svg';

}

   



  /* =========================
     ITEM COUNT
     ========================= */

  get itemCount():
    number {


    const items =

      Array.isArray(
        this.order?.items
      )

        ? this.order.items

        : [];


    return items.reduce(

      (
        total:
          number,

        item:
          any
      ) => {

        return (

          total

          +

          Number(
            item?.quantity
            ||
            0
          )

        );

      },

      0

    );


  }



  /* =========================
     ADDRESS
     ========================= */

  get shippingAddressText():
    string {


    const address =
      this.order
        ?.shippingAddress;


    if (
      !address
    ) {


      return '—';


    }


    return (

      address.fullAddress

      ||

      [

        address.street,

        address.barangay,

        address.city,

        address.province,

        address.postalCode

      ]
        .filter(
          Boolean
        )
        .join(
          ', '
        )

      ||

      '—'

    );


  }



  get hasDiscount():
    boolean {


    return (

      Number(
        this.order?.discount
        ||
        0
      )
      >
      0

    );


  }



  /* =========================
     REVIEWS
     ========================= */

  canReviewItem(
    item: any
  ):
    boolean {


    const id =
      this.productId(
        item
      );


    return (

      this.isDelivered

      &&

      Number.isFinite(
        id
      )

    );


  }



  isReviewed(
    item: any
  ):
    boolean {


    return this
      .reviewedProductIds
      .has(
        this.productId(
          item
        )
      );


  }



  private async loadReviewState():
    Promise<void> {


    const user =
      firebaseAuth
        .currentUser;


    if (
      !user
      ||
      !this.order
      ||
      !this.isDelivered
    ) {


      this.reviewedProductIds =
        new Set<number>();


      this.myReviews =
        new Map<
          number,
          ProductReview
        >();


      return;


    }


    const items =
      this.order.items
      ||
      [];


    const ids =
      [

        ...new Set<number>(

          items

            .map(

              (
                item:
                  any
              ) =>

                Number(
                  item?.productId
                )

            )

            .filter(

              (
                id:
                  number
              ) =>

                Number.isFinite(
                  id
                )

            )

        )

      ];


    const reviewed =
      new Set<number>();


    const reviews =
      new Map<
        number,
        ProductReview
      >();


    await Promise.all(

      ids.map(

        async id => {


          try {


            const review =
              await this.reviewService
                .getMyReview(
                  id
                );


            if (
              review
              &&
              review.id
            ) {


              reviewed.add(
                id
              );


              reviews.set(
                id,
                review
              );


            }


          } catch (
            error
          ) {


            console.error(
              'Unable to check review:',
              error
            );


          }


        }

      )

    );


    this.reviewedProductIds =
      reviewed;


    this.myReviews =
      reviews;


  }



  async startReview(
    item: any
  ):
    Promise<void> {


    const id =
      this.productId(
        item
      );


    if (
      !this.canReviewItem(
        item
      )
    ) {


      return;


    }


    if (
      this.reviewedProductIds.has(
        id
      )
    ) {


      await this.showToast(
        'You already reviewed this product.'
      );


      return;


    }


    this.reviewingProductId =
      id;


    this.editingReviewId =
      null;


    this.selectedRating =
      0;


    this.reviewComment =
      '';


  }



  async startEditReview(
    item: any
  ):
    Promise<void> {


    const id =
      this.productId(
        item
      );


    const review =
      this.myReviews.get(
        id
      );


    if (
      !review
      ||
      !review.id
    ) {


      await this.showToast(
        'Review not found.'
      );


      return;


    }


    this.reviewingProductId =
      id;


    this.editingReviewId =
      review.id;


    this.selectedRating =
      Number(
        review.rating
        ||
        0
      );


    this.reviewComment =
      String(
        review.comment
        ||
        ''
      );


  }



  cancelReview():
    void {


    this.reviewingProductId =
      null;


    this.editingReviewId =
      null;


    this.selectedRating =
      0;


    this.reviewComment =
      '';


    this.submittingReview =
      false;


  }



  selectRating(
    rating: number
  ):
    void {


    if (
      rating < 1
      ||
      rating > 5
    ) {


      return;


    }


    this.selectedRating =
      rating;


  }



  get ratingText():
    string {


    switch (
      this.selectedRating
    ) {


      case 1:
        return 'Poor';


      case 2:
        return 'Fair';


      case 3:
        return 'Good';


      case 4:
        return 'Very Good';


      case 5:
        return 'Excellent';


      default:
        return '';


    }


  }



  async submitReview(
    item: any
  ):
    Promise<void> {


    if (
      this.submittingReview
    ) {


      return;


    }


    const user =
      firebaseAuth
        .currentUser;


    if (
      !user
    ) {


      await this.showToast(
        'Please log in first.'
      );


      return;


    }


    if (
      !this.isDelivered
    ) {


      await this.showToast(
        'You can only review delivered orders.'
      );


      return;


    }


    const id =
      this.productId(
        item
      );


    if (
      !Number.isFinite(id)
    ) {


      await this.showToast(
        'Unable to identify this product.'
      );


      return;


    }


    if (
      this.selectedRating < 1
      ||
      this.selectedRating > 5
    ) {


      await this.showToast(
        'Please select a rating.'
      );


      return;


    }


    const comment =
      this.reviewComment
        .trim();


    if (
      comment.length < 3
    ) {


      await this.showToast(
        'Please write a short review.'
      );


      return;


    }


    this.submittingReview =
      true;


    const wasEditing =
      !!this.editingReviewId;


    try {


      if (
        this.editingReviewId
      ) {


        await this.reviewService
          .updateReview(

            this.editingReviewId,

            this.selectedRating,

            comment

          );


        await this.showToast(
          'Review updated successfully.'
        );


      } else {


        const existing =
          await this.reviewService
            .getMyReview(
              id
            );


        if (
          existing
        ) {


          this.reviewedProductIds.add(
            id
          );


          if (
            existing.id
          ) {


            this.myReviews.set(
              id,
              existing
            );


          }


          await this.showToast(
            'You already reviewed this product.'
          );


          this.cancelReview();


          return;


        }


        await this.reviewService
          .addReview(

            id,

            this.selectedRating,

            comment,

            user.displayName
            ||
            '',

            this.currentOrderId

          );


        await this.showToast(
          'Review submitted successfully.'
        );


      }


      this.cancelReview();


      await this.loadReviewState();


    } catch (
      error: any
    ) {


      console.error(
        'Review error:',
        error
      );


      await this.showToast(

        error?.message

        ||

        (
          wasEditing
            ? 'Unable to update review.'
            : 'Unable to submit review.'
        )

      );


    } finally {


      this.submittingReview =
        false;


    }


  }



  async confirmDeleteReview(
    item: any
  ):
    Promise<void> {


    if (
      this.deletingReview
    ) {


      return;


    }


    const id =
      this.productId(
        item
      );


    const review =
      this.myReviews.get(
        id
      );


    if (
      !review
      ||
      !review.id
    ) {


      await this.showToast(
        'Review not found.'
      );


      return;


    }


    const alert =
      await this.alertController
        .create({


          header:
            'Delete Review',


          message:
            'Are you sure you want to delete your review?',


          buttons: [

            {

              text:
                'Cancel',

              role:
                'cancel'

            },


            {

              text:
                'Delete',

              role:
                'destructive',

              handler:
                () => {


                  void this.deleteReview(
                    id,
                    review.id!
                  );


                }

            }

          ]


        });


    await alert.present();


  }



  private async deleteReview(
    productId: number,
    reviewId: string
  ):
    Promise<void> {


    if (
      this.deletingReview
    ) {


      return;


    }


    this.deletingReview =
      true;


    try {


      await this.reviewService
        .deleteReview(
          reviewId
        );


      this.reviewedProductIds.delete(
        productId
      );


      this.myReviews.delete(
        productId
      );


      if (
        this.reviewingProductId ===
        productId
      ) {


        this.cancelReview();


      }


      await this.showToast(
        'Review deleted successfully.'
      );


    } catch (
      error: any
    ) {


      console.error(
        'Delete review error:',
        error
      );


      await this.showToast(

        error?.message

        ||

        'Unable to delete review.'

      );


    } finally {


      this.deletingReview =
        false;


    }


  }



  /* =========================
     TIMELINE
     ========================= */

  get displayStatusSteps():
    string[] {


    if (
      !this.isCancelled
    ) {


      return this.statusSteps;


    }


    const history =

      Array.isArray(
        this.order?.statusHistory
      )

        ? this.order.statusHistory

        : [];


    const completed =
      history

        .map(

          (
            row:
              any
          ) =>

            this.normalizeOrderStatus(
              String(
                row?.status
                ||
                ''
              )
            )

        )

        .filter(

          (
            status:
              string
          ) =>

            this.statusSteps
              .includes(
                status
              )

        );


    const unique =
      Array.from(
        new Set<string>(
          completed
        )
      );


    if (
      unique.length === 0
    ) {


      unique.push(
        'Pending'
      );


    }


    return [
      ...unique,
      'Cancelled'
    ];


  }



  isCompleted(
    step: string
  ):
    boolean {


    if (
      this.isCancelled
    ) {


      return this
        .displayStatusSteps
        .includes(
          step
        );


    }


    const current =
      this.normalizeOrderStatus(

        String(
          this.order?.status
          ||
          'Pending'
        )

      );


    const stepIndex =
      this.statusSteps
        .indexOf(
          step
        );


    const currentIndex =
      this.statusSteps
        .indexOf(
          current
        );


    return (

      stepIndex >= 0

      &&

      currentIndex >= 0

      &&

      stepIndex <= currentIndex

    );


  }



  isCurrent(
    step: string
  ):
    boolean {


    if (
      this.isCancelled
    ) {


      return (
        step === 'Cancelled'
      );


    }


    return (

      this.normalizeOrderStatus(

        String(
          this.order?.status
          ||
          ''
        )

      )

      ===

      step

    );


  }



  statusMessage(
    step: string
  ):
    string {


    switch (
      step
    ) {


      case 'Pending':

        return 'Your order has been placed successfully.';


      case 'Processing':

        return 'Your order is being prepared.';


      case 'Shipped':

        return 'Your order is on the way.';


      case 'Delivered':

        return 'Your order was delivered successfully.';


      case 'Cancelled':

        return 'This order has been cancelled.';


      default:

        return '';


    }


  }



  /* =========================
     DATE
     ========================= */

  date(
    value: any
  ):
    string {


    try {


      const parsed =

        value?.toDate?.()

        ??

        (
          value instanceof Date

            ? value

            : value

              ? new Date(
                  value
                )

              : null
        );


      if (
        !parsed
        ||
        Number.isNaN(
          parsed.getTime()
        )
      ) {


        return 'Recent';


      }


      return parsed.toLocaleString(

        'en-PH',

        {

          year:
            'numeric',

          month:
            'short',

          day:
            'numeric',

          hour:
            'numeric',

          minute:
            '2-digit'

        }

      );


    } catch {


      return 'Recent';


    }


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

    ).format(

      Number(
        value
        ||
        0
      )

    );


  }



  /* =========================
     TOAST
     ========================= */

  private async showToast(
    message: string
  ):
    Promise<void> {


    const toast =
      await this.toastController
        .create({

          message,

          duration:
            1600,

          position:
            'bottom'

        });


    await toast.present();


  }


}