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
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  IonicModule,
  AlertController,
  LoadingController
} from '@ionic/angular';

import {
  AppStateService
} from '../services/app-state.service';

import {
  AddressService
} from '../services/address.service';

import {
  OrderService
} from '../services/order.service';

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
       PAGE
       ========================= */

    .checkout-page {
      padding-bottom: 30px;
    }


    /* =========================
       CHECKOUT INTRO
       ========================= */

    .checkout-intro {
      margin-bottom: 18px;
      padding: 18px;

      border-radius: 20px;

      background:
        linear-gradient(
          135deg,
          rgba(
            var(--ion-color-primary-rgb),
            .16
          ),
          rgba(
            var(--ion-color-primary-rgb),
            .05
          )
        );

      border:
        1px solid
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );
    }


    .checkout-kicker {
      color:
        var(--ion-color-primary);

      font-size: 9px;
      font-weight: 900;

      letter-spacing: .8px;
      text-transform: uppercase;
    }


    .checkout-title {
      margin: 4px 0 5px;

      font-size: 22px;
      line-height: 1.2;

      font-weight: 900;
    }


    .checkout-subtitle {
      margin: 0;

      font-size: 11px;
      line-height: 1.5;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       PROGRESS
       ========================= */

    .checkout-steps {
      display: grid;

      grid-template-columns:
        repeat(
          3,
          minmax(0, 1fr)
        );

      gap: 8px;

      margin-top: 16px;
    }


    .checkout-step {
      min-width: 0;

      display: flex;
      align-items: center;

      gap: 6px;

      padding: 7px 8px;

      border-radius: 12px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .08
        );
    }


    .step-number {
      width: 23px;
      min-width: 23px;
      height: 23px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background:
        var(--ion-color-primary);

      color: #ffffff;

      font-size: 9px;
      font-weight: 900;
    }


    .step-label {
      min-width: 0;

      font-size: 9px;
      font-weight: 800;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    /* =========================
       SECTION HEADER
       ========================= */

    .checkout-section {
      margin-top: 20px;
    }


    .checkout-main-side
    > .checkout-section:first-child {
      margin-top: 0;
    }


    .checkout-summary-side {
      margin-top: 22px;
    }


    .section-header {
      margin: 0 2px 9px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;
    }


    .section-heading {
      margin: 0;

      font-size: 14px;
      font-weight: 900;
    }


    .section-action {
      margin: 0;

      --padding-start: 7px;
      --padding-end: 7px;

      font-size: 10px;
      font-weight: 800;
    }


    .section-count {
      font-size: 10px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       ADDRESS
       ========================= */

    .address-card {
      padding: 15px;

      border-radius: 18px;

      cursor: pointer;
    }


    .address-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;
    }


    .address-label-row {
      min-width: 0;

      display: flex;
      align-items: center;

      gap: 8px;
    }


    .address-icon {
      width: 38px;
      height: 38px;

      display: flex;
      align-items: center;
      justify-content: center;

      flex-shrink: 0;

      border-radius: 12px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      color:
        var(--ion-color-primary);
    }


    .address-icon ion-icon {
      font-size: 19px;

      color:
        var(--ion-color-primary);
    }


    .address-label {
      font-size: 12px;
      font-weight: 900;
    }


    .address-recipient {
      margin-top: 13px;

      font-size: 13px;
      font-weight: 900;
    }


    .address-phone {
      margin-top: 3px;

      font-size: 10px;

      color:
        var(--ion-color-medium);
    }


    .address-full {
      margin-top: 8px;

      font-size: 11px;
      line-height: 1.55;

      color:
        var(--ion-color-medium);
    }


    .address-empty {
      display: flex;
      align-items: center;

      gap: 12px;
    }


    .address-empty-title {
      font-size: 12px;
      font-weight: 900;
    }


    .address-empty-text {
      margin-top: 3px;

      font-size: 10px;

      color:
        var(--ion-color-medium);
    }


    .address-loading {
      min-height: 80px;

      padding: 15px;

      display: flex;
      align-items: center;

      gap: 10px;

      border-radius: 18px;

      font-size: 11px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       DELIVERY
       ========================= */

    .delivery-list {
      overflow: hidden;

      border-radius: 18px;

      background:
        var(--ion-card-background);

      border:
        1px solid
        rgba(
          120,
          120,
          120,
          .08
        );
    }


    .delivery-option {
      --background:
        var(--ion-card-background);

      --min-height: 66px;

      --padding-start: 14px;
      --inner-padding-end: 14px;

      margin: 0;

      transition:
        background .15s ease;
    }


    .delivery-option
    + .delivery-option {
      border-top:
        1px solid
        rgba(
          120,
          120,
          120,
          .10
        );
    }


    .delivery-option.selected {
      --background:
        rgba(
          var(--ion-color-primary-rgb),
          .07
        );
    }


    .delivery-label {
      margin: 8px 0;

      display: flex;
      flex-direction: column;
      justify-content: center;

      gap: 3px;
    }


    .delivery-name {
      font-size: 12px;
      font-weight: 900;
    }


    .delivery-description {
      font-size: 9px;

      color:
        var(--ion-color-medium);
    }


    .delivery-price {
      margin-top: 2px;

      color:
        var(--ion-color-primary);

      font-size: 10px;
      font-weight: 900;
    }


    .delivery-radio {
      margin-left: 10px;
    }


    /* =========================
       PAYMENT
       ========================= */

    .payment-card {
      min-height: 80px;

      padding: 14px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;

      border-radius: 18px;

      cursor: pointer;
    }


    .payment-left {
      min-width: 0;
      flex: 1;

      display: flex;
      align-items: center;

      gap: 12px;
    }


    .payment-icon {
      width: 44px;
      height: 44px;

      display: flex;
      align-items: center;
      justify-content: center;

      flex: 0 0 44px;

      border-radius: 13px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .11
        );

      color:
        var(--ion-color-primary);
    }


    .payment-icon ion-icon {
      font-size: 21px;

      color:
        var(--ion-color-primary);
    }


    .payment-info {
      min-width: 0;
      flex: 1;
    }


    .payment-name {
      font-size: 12px;
      font-weight: 900;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    .payment-description {
      margin-top: 3px;

      font-size: 10px;
      line-height: 1.4;

      color:
        var(--ion-color-medium);

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    .payment-right {
      flex-shrink: 0;

      display: flex;
      align-items: center;

      gap: 9px;
    }


    .payment-selected {
      display: inline-flex;
      align-items: center;

      gap: 4px;

      padding: 5px 8px;

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

      white-space: nowrap;
    }


    .payment-selected ion-icon {
      font-size: 12px;

      color:
        var(--ion-color-success);
    }


    .payment-arrow {
      flex-shrink: 0;

      font-size: 18px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       ORDER ITEMS
       ========================= */

    .items-card {
      padding: 3px 14px;

      border-radius: 18px;
    }


    .checkout-item {
      display: flex;
      align-items: center;

      gap: 12px;

      padding: 12px 0;

      border-bottom:
        1px solid
        rgba(
          120,
          120,
          120,
          .10
        );
    }


    .checkout-item:last-child {
      border-bottom: none;
    }


    .checkout-image-wrap {
      width: 64px;
      height: 64px;

      display: flex;
      align-items: center;
      justify-content: center;

      flex-shrink: 0;

      border-radius: 14px;

      overflow: hidden;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .07
        );
    }


    .checkout-image {
      width: 52px;
      height: 52px;

      object-fit: contain;
    }


    .checkout-item-info {
      flex: 1;
      min-width: 0;
    }


    .checkout-item-brand {
      margin-bottom: 3px;

      color:
        var(--ion-color-primary);

      font-size: 8px;
      font-weight: 900;

      text-transform: uppercase;
    }


    .checkout-item-name {
      font-size: 11px;
      line-height: 1.35;

      font-weight: 900;

      overflow: hidden;

      display: -webkit-box;

      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }


    .checkout-item-meta {
      margin-top: 5px;

      font-size: 9px;

      color:
        var(--ion-color-medium);
    }


    .checkout-item-total {
      flex-shrink: 0;

      text-align: right;

      color:
        var(--ion-color-primary);

      font-size: 11px;
      font-weight: 900;
    }


    /* =========================
       SUMMARY
       ========================= */

    .summary-card {
      padding: 16px;

      border-radius: 18px;
    }


    .summary-title {
      margin-bottom: 13px;

      font-size: 13px;
      font-weight: 900;
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


    .summary-free,
    .summary-discount {
      color:
        var(--ion-color-success);
    }


    .summary-divider {
      margin: 12px 0;

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

      gap: 12px;
    }


    .total-label {
      font-size: 14px;
      font-weight: 900;
    }


    .total-value {
      color:
        var(--ion-color-primary);

      font-size: 21px;
      font-weight: 900;
    }


    /* =========================
       READINESS
       ========================= */

    .checkout-readiness {
      margin-top: 14px;

      display: flex;
      flex-direction: column;

      gap: 6px;
    }


    .ready-row {
      display: flex;
      align-items: center;

      gap: 7px;

      font-size: 9px;

      color:
        var(--ion-color-medium);
    }


    .ready-dot {
      width: 7px;
      height: 7px;

      flex-shrink: 0;

      border-radius: 50%;

      background:
        var(--ion-color-medium);
    }


    .ready-row.ready {
      color:
        var(--ion-color-success);
    }


    .ready-row.ready
    .ready-dot {
      background:
        var(--ion-color-success);
    }


    /* =========================
       PLACE ORDER
       ========================= */

    .place-order-btn {
      min-height: 49px;

      margin: 16px 0 0;

      --border-radius: 14px;

      font-size: 12px;
      font-weight: 900;
    }


    .order-note {
      margin: 9px 4px 0;

      text-align: center;

      color:
        var(--ion-color-medium);

      font-size: 8px;
      line-height: 1.45;
    }


    /* =========================
       EMPTY CHECKOUT
       ========================= */

    .empty-checkout {
      min-height: 70vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      padding: 30px;
    }


    .empty-icon {
      width: 84px;
      height: 84px;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-bottom: 16px;

      border-radius: 25px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      color:
        var(--ion-color-primary);
    }


    .empty-icon ion-icon {
      font-size: 35px;

      color:
        var(--ion-color-primary);
    }


    .empty-checkout h2 {
      margin: 0 0 6px;

      font-size: 20px;
      font-weight: 900;
    }


    .empty-checkout p {
      max-width: 260px;

      margin: 0 0 18px;

      color:
        var(--ion-color-medium);

      font-size: 11px;
      line-height: 1.5;
    }


    .empty-checkout ion-button {
      --border-radius: 13px;

      font-weight: 900;
    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (min-width: 760px) {

      .checkout-layout {
        display: grid;

        grid-template-columns:
          minmax(0, 1.35fr)
          minmax(300px, .65fr);

        gap: 22px;

        align-items: start;
      }


      .checkout-summary-side {
        position: sticky;

        top: 16px;

        margin-top: 0;
      }


      .checkout-summary-side
      .checkout-section {
        margin-top: 0;
      }

    }


    @media (max-width: 390px) {

      .checkout-step {
        padding: 7px 5px;
      }


      .step-label {
        font-size: 8px;
      }


      .checkout-item {
        gap: 9px;
      }


      .checkout-image-wrap {
        width: 58px;
        height: 58px;
      }


      .checkout-image {
        width: 47px;
        height: 47px;
      }


      .payment-card {
        gap: 8px;

        padding:
          13px 12px;
      }


      .payment-left {
        gap: 9px;
      }


      .payment-icon {
        width: 40px;
        height: 40px;

        flex-basis: 40px;
      }


      .payment-right {
        gap: 5px;
      }


      .payment-selected {
        padding: 4px 6px;

        font-size: 7px;
      }

    }

  `],


  template: `

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



<ion-content>


  <!-- =========================
       CHECKOUT CONTENT
       ========================= -->

  <div
    class="page-wrap no-bottom checkout-page"

    *ngIf="
      checkoutItems.length > 0
    ">



    <!-- =========================
         INTRO
         ========================= -->

    <div class="checkout-intro">


      <div class="checkout-kicker">
        Secure Checkout
      </div>


      <h1 class="checkout-title">
        Almost there.
      </h1>


      <p class="checkout-subtitle">

        Review your delivery,
        payment and order details
        before placing your order.

      </p>


      <div class="checkout-steps">


        <div class="checkout-step">

          <div class="step-number">
            1
          </div>

          <div class="step-label">
            Address
          </div>

        </div>


        <div class="checkout-step">

          <div class="step-number">
            2
          </div>

          <div class="step-label">
            Delivery
          </div>

        </div>


        <div class="checkout-step">

          <div class="step-number">
            3
          </div>

          <div class="step-label">
            Payment
          </div>

        </div>


      </div>


    </div>



    <div class="checkout-layout">



      <!-- =========================
           MAIN SIDE
           ========================= -->

      <div class="checkout-main-side">



        <!-- =========================
             SHIPPING ADDRESS
             ========================= -->

        <div class="checkout-section">


          <div class="section-header">


            <h2 class="section-heading">
              Shipping Address
            </h2>


            <ion-button
              fill="clear"
              size="small"
              class="section-action"
              (click)="chooseAddress()">

              {{
                address
                  ? 'Change'
                  : 'Add'
              }}

            </ion-button>


          </div>



          <!-- ADDRESS -->

          <div
            class="
              app-card
              address-card
              card-button
            "

            *ngIf="
              !loadingAddress &&
              address
            "

            (click)="chooseAddress()">



            <div class="address-top">


              <div class="address-label-row">


                <div class="address-icon">

                  <ion-icon
                    name="location-outline">
                  </ion-icon>

                </div>


                <div class="address-label">

                  {{
                    address.label
                    ||
                    'Shipping Address'
                  }}

                </div>


              </div>


              <ion-icon
                name="chevron-forward-outline">
              </ion-icon>


            </div>



            <div class="address-recipient">
              {{ address.recipient }}
            </div>


            <div class="address-phone">
              {{ address.phone }}
            </div>


            <div class="address-full">
              {{ fullAddress(address) }}
            </div>


          </div>



          <!-- NO ADDRESS -->

          <div
            class="
              app-card
              address-card
              card-button
            "

            *ngIf="
              !loadingAddress &&
              !address
            "

            (click)="chooseAddress()">



            <div class="address-empty">


              <div class="address-icon">

                <ion-icon
                  name="add-outline">
                </ion-icon>

              </div>


              <div class="flex-1">


                <div class="address-empty-title">

                  Add a shipping address

                </div>


                <div class="address-empty-text">

                  Select where your
                  order should be delivered.

                </div>


              </div>


              <ion-icon
                name="chevron-forward-outline">
              </ion-icon>


            </div>


          </div>



          <!-- LOADING -->

          <div
            class="
              app-card
              address-loading
            "

            *ngIf="
              loadingAddress
            ">


            <ion-spinner
              name="crescent">
            </ion-spinner>


            <span>
              Loading your address...
            </span>


          </div>


        </div>



        <!-- =========================
             DELIVERY METHOD
             ========================= -->

        <div class="checkout-section">


          <div class="section-header">

            <h2 class="section-heading">
              Delivery Method
            </h2>

          </div>


          <ion-radio-group
            [(ngModel)]="delivery">


            <div class="delivery-list">


              <!-- STANDARD -->

              <ion-item
                class="delivery-option"

                [class.selected]="
                  delivery ===
                  'Standard Delivery'
                "

                lines="none">


                <ion-label class="delivery-label">


                  <div class="delivery-name">
                    Standard Delivery
                  </div>


                  <div class="delivery-description">
                    Regular delivery for your order
                  </div>


                  <div class="delivery-price">

                    {{
                      standardShipping === 0
                        ? 'Free'
                        : money(
                            standardShipping
                          )
                    }}

                  </div>


                </ion-label>


                <ion-radio
                  class="delivery-radio"

                  slot="end"

                  value="Standard Delivery">
                </ion-radio>


              </ion-item>



              <!-- EXPRESS -->

              <ion-item
                class="delivery-option"

                [class.selected]="
                  delivery ===
                  'Express Delivery'
                "

                lines="none">


                <ion-label class="delivery-label">


                  <div class="delivery-name">
                    Express Delivery
                  </div>


                  <div class="delivery-description">
                    Faster delivery option
                  </div>


                  <div class="delivery-price">

                    {{
                      money(
                        expressShipping
                      )
                    }}

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


        </div>



        <!-- =========================
             PAYMENT METHOD
             ========================= -->

        <div class="checkout-section">


          <div class="section-header">


            <h2 class="section-heading">
              Payment Method
            </h2>


            <ion-button
              fill="clear"

              size="small"

              class="section-action"

              routerLink="/payments"

              [queryParams]="{
                select: 1
              }">

              {{
                state.selectedPayment?.title
                  ? 'Change'
                  : 'Select'
              }}

            </ion-button>


          </div>



          <div
            class="
              app-card
              payment-card
              card-button
            "

            routerLink="/payments"

            [queryParams]="{
              select: 1
            }">



            <!-- LEFT -->

            <div class="payment-left">


              <div class="payment-icon">


                <ion-icon
                  [name]="
                    state.selectedPayment?.icon
                    ||
                    'wallet-outline'
                  ">
                </ion-icon>


              </div>



              <div class="payment-info">


                <div class="payment-name">

                  {{
                    state.selectedPayment?.title
                    ||
                    'Select payment method'
                  }}

                </div>


                <div class="payment-description">

                  {{
                    state.selectedPayment?.subtitle
                    ||
                    'Choose how you want to pay'
                  }}

                </div>


              </div>


            </div>



            <!-- RIGHT -->

            <div class="payment-right">


              <div
                class="payment-selected"

                *ngIf="
                  state.selectedPayment?.title
                ">


                <ion-icon
                  name="checkmark-circle-outline">
                </ion-icon>


                <span>
                  Selected
                </span>


              </div>


              <ion-icon
                class="payment-arrow"

                name="chevron-forward-outline">
              </ion-icon>


            </div>


          </div>


        </div>



        <!-- =========================
             ORDER ITEMS
             ========================= -->

        <div class="checkout-section">


          <div class="section-header">


            <h2 class="section-heading">
              Order Items
            </h2>


            <span class="section-count">

              {{ totalQuantity }}

              item{{
                totalQuantity === 1
                  ? ''
                  : 's'
              }}

            </span>


          </div>



          <div class="app-card items-card">


            <div
              class="checkout-item"

              *ngFor="
                let item
                of orderItems
              ">


              <div class="checkout-image-wrap">


                <img
                  class="checkout-image"

                  [src]="
                    productImage(
                      item.product
                    )
                  "

                  [alt]="
                    item.product.name
                  ">


              </div>



              <div class="checkout-item-info">


                <div class="checkout-item-brand">
                  {{ item.product.brand }}
                </div>


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
                    item.product.price
                    *
                    item.quantity
                  )
                }}

              </div>


            </div>


          </div>


        </div>


      </div>



      <!-- =========================
           ORDER SUMMARY
           ========================= -->

      <div class="checkout-summary-side">


        <div class="checkout-section">


          <div class="section-header">

            <h2 class="section-heading">
              Order Summary
            </h2>

          </div>



          <div class="app-card summary-card">


            <div class="summary-title">
              Payment Details
            </div>



            <div class="summary-row">


              <span class="summary-label">
                Subtotal
              </span>


              <span class="summary-value">
                {{ money(subtotal) }}
              </span>


            </div>



            <div class="summary-row">


              <span class="summary-label">
                Shipping
              </span>


              <span
                class="summary-value"

                [class.summary-free]="
                  shipping === 0
                ">

                {{
                  shipping === 0
                    ? 'Free'
                    : money(shipping)
                }}

              </span>


            </div>



            <div
              class="summary-row"

              *ngIf="
                discount > 0
              ">


              <span class="summary-label">
                Discount
              </span>


              <span
                class="
                  summary-value
                  summary-discount
                ">

                −{{ money(discount) }}

              </span>


            </div>



            <hr class="summary-divider">



            <div class="total-row">


              <span class="total-label">
                Order Total
              </span>


              <span class="total-value">
                {{ money(total) }}
              </span>


            </div>



            <!-- READINESS -->

            <div class="checkout-readiness">


              <div
                class="ready-row"

                [class.ready]="
                  !!address
                ">


                <span class="ready-dot">
                </span>


                {{
                  address
                    ? 'Shipping address ready'
                    : 'Select a shipping address'
                }}


              </div>



              <div
                class="ready-row"

                [class.ready]="
                  !!state.selectedPayment?.title
                ">


                <span class="ready-dot">
                </span>


                {{
                  state.selectedPayment?.title
                    ? 'Payment method ready'
                    : 'Select a payment method'
                }}


              </div>


            </div>



            <!-- PLACE ORDER -->

            <ion-button
              expand="block"

              class="
                primary-btn
                place-order-btn
              "

              (click)="
                confirmPlaceOrder()
              "

              [disabled]="
                !canPlaceOrder
              ">


              <ion-spinner
                *ngIf="
                  placingOrder
                "

                slot="start"

                name="crescent">
              </ion-spinner>


              {{
                placingOrder
                  ? 'Placing Order...'
                  : 'Place Order'
              }}


            </ion-button>


            <div class="order-note">

              Please review your
              order details before
              confirming your purchase.

            </div>


          </div>


        </div>


      </div>


    </div>


  </div>



  <!-- =========================
       EMPTY CHECKOUT
       ========================= -->

  <div
    class="empty-checkout"

    *ngIf="
      checkoutItems.length === 0
    ">


    <div class="empty-icon">

      <ion-icon
        name="cart-outline">
      </ion-icon>

    </div>


    <h2>
      No items to checkout
    </h2>


    <p>

      Add dental supplies to your
      cart before proceeding
      to checkout.

    </p>


    <ion-button
      routerLink="/catalog">

      Browse Products

    </ion-button>


  </div>


</ion-content>

`

})


export class CheckoutPage
implements OnInit {


  address:
    ShippingAddress |
    null =
    null;


  loadingAddress =
    true;


  placingOrder =
    false;


  delivery =
    'Standard Delivery';


  buyNowProductId:
    number |
    null =
    null;


  buyNowQuantity =
    1;


  readonly expressShipping =
    220;



  constructor(

    public state:
      AppStateService,

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
      this.route
        .snapshot
        .queryParamMap
        .get(
          'productId'
        );


    if (
      productIdParam !== null
    ) {


      const id =
        Number(
          productIdParam
        );


      if (
        Number.isFinite(id)
        &&
        id > 0
      ) {


        this.buyNowProductId =
          id;


      }


    }


    const quantity =
      Number(

        this.route
          .snapshot
          .queryParamMap
          .get(
            'quantity'
          )

        ||

        1

      );


    this.buyNowQuantity =

      Number.isFinite(
        quantity
      )

        ? Math.max(

            1,

            Math.floor(
              quantity
            )

          )

        : 1;


    await this.loadAddress();


  }



  /* =========================
     PAGE ENTER
     ========================= */

  async ionViewWillEnter():
    Promise<void> {


    await this.state
      .loadProductsFromFirestore();


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


      this.address =
        null;


    } finally {


      this.loadingAddress =
        false;


    }


  }



  /* =========================
     CHOOSE ADDRESS
     ========================= */

  chooseAddress():
    void {


    this.router.navigate(

      [
        '/addresses'
      ],

      {

        queryParams: {

          select:
            1

        }

      }

    );


  }



  /* =========================
     CHECKOUT ITEMS
     ========================= */

  get checkoutItems():
    [number, number][] {


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


    return [

      ...this.state
        .cart
        .entries()

    ];


  }



  /* =========================
     ORDER ITEMS
     ========================= */

  get orderItems() {


    return this.checkoutItems

      .map(

        (
          [
            id,
            quantity
          ]
        ) => {


          const product =
            this.state
              .productById(
                id
              );


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


    if (
      typeof product.stock
        === 'number'
      &&
      Number.isFinite(
        product.stock
      )
    ) {


      return Math.max(

        0,

        Math.floor(
          product.stock
        )

      );


    }


    const raw =
      String(
        product.stock
        ??
        ''
      )
        .trim()
        .toLowerCase();


    if (
      /^[0-9]+$/.test(
        raw
      )
    ) {


      return Math.max(

        0,

        Number(
          raw
        )

      );


    }


    if (
      raw.includes(
        'out of stock'
      )

      ||

      raw.includes(
        'sold out'
      )

      ||

      raw.includes(
        'unavailable'
      )
    ) {


      return 0;


    }


    return null;


  }



  /* =========================
     VALIDATE STOCK
     ========================= */

  async validateStock():
    Promise<boolean> {


    for (
      const item
      of this.orderItems
    ) {


      const latest =
        this.state.products
          .find(

            product =>
              product.id ===
              item.product.id

          );


      if (
        !latest
      ) {


        await this.message(

          item.product.name
          +
          ' is no longer available.'

        );


        return false;


      }


      const stock =
        this.getNumericStock(
          latest
        );


      if (
        stock !== null
        &&
        item.quantity > stock
      ) {


        await this.message(

          stock <= 0

            ? item.product.name
              +
              ' is currently out of stock.'

            : 'Only '
              +
              stock
              +
              ' '
              +
              item.product.name
              +
              ' available.'

        );


        return false;


      }


    }


    return true;


  }



  /* =========================
     TOTAL QUANTITY
     ========================= */

  get totalQuantity():
    number {


    return this.checkoutItems
      .reduce(

        (
          total,
          [
            ,
            quantity
          ]
        ) =>

          total
          +
          quantity,

        0

      );


  }



  /* =========================
     SUBTOTAL
     ========================= */

  get subtotal():
    number {


    return this.checkoutItems
      .reduce(

        (
          total,
          [
            id,
            quantity
          ]
        ) => {


          const product =
            this.state
              .productById(
                id
              );


          if (
            !product
          ) {


            return total;


          }


          return (

            total

            +

            product.price
            *
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

      this.subtotal
      *
      0.10,

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

      !!this.state
        .selectedPayment
        ?.title

    );


  }



  /* =========================
     FULL ADDRESS
     ========================= */

  fullAddress(
    address: ShippingAddress
  ):
    string {


    return (

      address.fullAddress

      ||

      [

        address.street,

        address.barangay,

        address.city,

        address.postalCode

      ]

        .filter(
          Boolean
        )

        .join(
          ', '
        )

    );


  }



  /* =========================
     CONFIRM ORDER
     ========================= */

  async confirmPlaceOrder():
    Promise<void> {


    if (
      !this.address
    ) {


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
      this.state
        .selectedPayment
        ?.title;


    if (
      !payment
    ) {


      await this.message(
        'Select a payment method first.'
      );


      return;


    }


    const alert =
      await this.alerts
        .create({


          header:
            'Place this order?',


          message:

            'Total: '
            +
            this.money(
              this.total
            )
            +
            '<br><br>Payment: '
            +
            payment
            +
            '<br>Delivery: '
            +
            this.delivery,


          buttons: [

            {

              text:
                'Cancel',

              role:
                'cancel'

            },


            {

              text:
                'Place Order',

              handler:
                () => {


                  void this
                    .placeOrder();


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


    if (
      !this.address
    ) {


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
      this.state
        .selectedPayment
        ?.title;


    if (
      !payment
    ) {


      await this.message(
        'Select a payment method first.'
      );


      return;


    }


    this.placingOrder =
      true;


    const loader =
      await this.loading
        .create({

          message:
            'Placing order...'

        });


    await loader.present();


    try {


      await this.state
        .loadProductsFromFirestore();


      const stockOkay =
        await this
          .validateStock();


      if (
        !stockOkay
      ) {


        return;


      }


      const items =
        this.orderItems
          .map(

            item => {


              return {


                productId:
                  item.product.id,


                name:
                  item.product.name,


                brand:
                  item.product.brand,


                category:
                  item.product.category,


                price:
                  item.product.price,


                quantity:
                  item.quantity,


                lineTotal:

                  item.product.price
                  *
                  item.quantity


              };


            }

          );



      const result =
        await this.orders
          .placeOrder({


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



      if (
        this.buyNowProductId === null
      ) {


        const cartIds = [

          ...this.state
            .cart
            .keys()

        ];


        for (
          const id
          of cartIds
        ) {


          this.state
            .removeFromCart(
              id
            );


        }


      }



      await this.state
        .loadProductsFromFirestore();



      await this.router
        .navigate(

          [
            '/order-success'
          ],

          {

            queryParams: {


              orderId:
                result.orderId,


              orderNumber:
                result.orderNumber


            }

          }

        );


    } catch (
      error: any
    ) {


      await this.message(

        error?.message

        ||

        'Unable to place order.'

      );


    } finally {


      this.placingOrder =
        false;


      try {


        await loader
          .dismiss();


      } catch {


        // Loader may already be dismissed.


      }


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

    )
      .format(
        Number(
          value
          ||
          0
        )
      );


  }



  /* =========================
     ALERT
     ========================= */

  private async message(
    message: string
  ):
    Promise<void> {


    const alert =
      await this.alerts
        .create({


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