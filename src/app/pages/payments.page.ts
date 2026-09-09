import { Component } from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  IonicModule,
  AlertController,
  ToastController
} from '@ionic/angular';

import { CommonModule } from '@angular/common';

import { AppStateService } from '../services/app-state.service';


@Component({
  selector: 'app-payments',
  standalone: true,

  imports: [
    RouterModule,
    IonicModule,
    CommonModule
  ],

  styles: [`

    .payment-heading {
      margin-bottom: 14px;
    }

    .payment-heading h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 900;
    }

    .payment-heading p {
      margin: 4px 0 0;

      font-size: 11px;

      color:
        var(--ion-color-medium);
    }


    .selection-hint {
      display: flex;
      align-items: center;

      gap: 9px;

      margin-bottom: 14px;

      padding: 11px 13px;

      border-radius: 13px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      color:
        var(--ion-color-primary);

      font-size: 11px;
      font-weight: 700;
    }


    .payment-card {
      padding: 0;

      overflow: hidden;

      border:
        1px solid transparent;
    }

    .payment-card.selected {
      border-color:
        var(--ion-color-primary);
    }


    .payment-main {
      display: flex;
      align-items: center;

      gap: 13px;

      min-height: 74px;

      padding: 13px 14px;

      cursor: pointer;
    }


    .payment-icon {
      width: 48px;
      height: 48px;

      flex-shrink: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 13px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .11
        );

      color:
        var(--ion-color-primary);

      font-size: 23px;
    }


    .payment-info {
      flex: 1;
      min-width: 0;
    }


    .payment-title {
      font-size: 14px;
      font-weight: 900;
    }


    .payment-subtitle {
      margin-top: 3px;

      font-size: 11px;

      color:
        var(--ion-color-medium);
    }


    .selected-wrap {
      flex-shrink: 0;

      display: flex;
      align-items: center;

      gap: 5px;

      color:
        var(--ion-color-primary);
    }


    .selected-label {
      font-size: 9px;
      font-weight: 900;

      text-transform: uppercase;
    }


    .selected-wrap ion-icon {
      font-size: 21px;
    }


    .payment-arrow {
      font-size: 18px;

      color:
        var(--ion-color-medium);
    }


    .payment-actions {
      display: flex;
      align-items: center;

      padding:
        6px 8px;

      border-top:
        1px solid
        rgba(120,120,120,.10);
    }


    .payment-actions ion-button {
      margin: 0;

      font-size: 11px;
      font-weight: 800;
    }


    .built-in-label {
      margin-left: 8px;

      font-size: 9px;
      font-weight: 800;

      color:
        var(--ion-color-medium);
    }


    .add-payment-button {
      margin-top: 16px;

      --border-radius: 13px;

      font-weight: 800;
    }

  `],

  template: `

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        [defaultHref]="
          selectionMode
            ? '/checkout'
            : '/account'
        ">
      </ion-back-button>

    </ion-buttons>


    <ion-title>

      {{
        selectionMode
          ? 'Select Payment'
          : 'Payment Methods'
      }}

    </ion-title>


    <ion-buttons slot="end">

      <ion-button
        routerLink="/add-payment">

        <ion-icon
          name="add-outline">
        </ion-icon>

      </ion-button>

    </ion-buttons>


  </ion-toolbar>

</ion-header>



<ion-content>


<div class="page-wrap no-bottom">


  <div class="payment-heading">


    <h2>

      {{
        selectionMode
          ? 'Choose Payment Method'
          : 'Saved Payment Methods'
      }}

    </h2>


    <p>

      {{
        state.paymentMethods.length
      }}

      payment method{{
        state.paymentMethods.length === 1
          ? ''
          : 's'
      }}

    </p>


  </div>



  <div
    class="selection-hint"

    *ngIf="selectionMode">


    <ion-icon
      name="information-circle-outline">
    </ion-icon>


    Tap a payment method to use it
    for this order.


  </div>



  <div class="list-stack">


    <div

      class="app-card payment-card"

      *ngFor="
        let payment
        of state.paymentMethods;
        let index = index
      "

      [class.selected]="
        index ===
        state.selectedPaymentIndex
      ">



      <!-- MAIN CARD -->

      <div
        class="payment-main"

        (click)="select(index)">


        <div class="payment-icon">


          <ion-icon
            [name]="
              paymentIcon(payment)
            ">
          </ion-icon>


        </div>



        <div class="payment-info">


          <div class="payment-title">

            {{ payment.title }}

          </div>


          <div class="payment-subtitle">

            {{ payment.subtitle }}

          </div>


        </div>



        <div
          class="selected-wrap"

          *ngIf="
            index ===
            state.selectedPaymentIndex
          ">


          <span class="selected-label">

            Selected

          </span>


          <ion-icon
            name="checkmark-circle">
          </ion-icon>


        </div>



        <ion-icon
          class="payment-arrow"

          *ngIf="
            index !==
            state.selectedPaymentIndex
          "

          name="chevron-forward-outline">
        </ion-icon>


      </div>



      <!-- EDIT / DELETE -->

      <div
        class="payment-actions"

        *ngIf="
          !selectionMode &&
          state.canManagePayment(index)
        ">


        <ion-button
          fill="clear"
          size="small"

          (click)="
            edit(
              index,
              $event
            )
          ">


          <ion-icon
            slot="start"
            name="create-outline">
          </ion-icon>


          Edit


        </ion-button>



        <ion-button
          fill="clear"
          size="small"
          color="danger"

          (click)="
            remove(
              index,
              $event
            )
          ">


          <ion-icon
            slot="start"
            name="trash-outline">
          </ion-icon>


          Delete


        </ion-button>


      </div>



      <!-- COD -->

      <div
        class="payment-actions"

        *ngIf="
          !selectionMode &&
          !state.canManagePayment(index)
        ">


        <span class="built-in-label">

          Built-in payment method

        </span>


      </div>


    </div>


  </div>



  <ion-button

    class="add-payment-button"

    expand="block"

    fill="outline"

    routerLink="/add-payment">


    <ion-icon
      slot="start"
      name="add-outline">
    </ion-icon>


    Add Payment Method


  </ion-button>


</div>


</ion-content>

`
})


export class PaymentsPage {


  selectionMode =
    false;



  constructor(

    public state:
      AppStateService,

    private route:
      ActivatedRoute,

    private router:
      Router,

    private alerts:
      AlertController,

    private toastController:
      ToastController

  ) {


    this.updateSelectionMode();

  }



  ionViewWillEnter():
    void {


    this.updateSelectionMode();

  }



  private updateSelectionMode():
    void {


    this.selectionMode =
      this.route
        .snapshot
        .queryParamMap
        .get('select') === '1';

  }



  /* =========================
     SELECT
     ========================= */

  async select(
    index: number
  ): Promise<void> {


    const payment =
      this.state
        .paymentMethods[index];


    if (!payment) {

      return;

    }


    this.state
      .selectPayment(index);



    if (this.selectionMode) {


      const toast =
        await this.toastController
          .create({

            message:
              `${payment.title} selected.`,

            duration:
              1000,

            position:
              'bottom'

          });


      await toast.present();


      await this.router
        .navigateByUrl(
          '/checkout'
        );

    }

  }



  /* =========================
     EDIT
     ========================= */

  edit(
    index: number,
    event: Event
  ): void {


    event.stopPropagation();


    if (
      !this.state
        .canManagePayment(index)
    ) {

      return;

    }


    this.router.navigate(

      ['/add-payment'],

      {

        queryParams: {

          index

        }

      }

    );

  }



  /* =========================
     DELETE
     ========================= */

  async remove(
    index: number,
    event: Event
  ): Promise<void> {


    event.stopPropagation();


    if (
      !this.state
        .canManagePayment(index)
    ) {

      return;

    }


    const payment =
      this.state
        .paymentMethods[index];


    if (!payment) {

      return;

    }


    const alert =
      await this.alerts
        .create({


          header:
            'Delete payment method?',


          message:
            `${payment.title} will be removed.`,


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

                  void this
                    .performDelete(
                      index
                    );

                }
            }


          ]


        });


    await alert.present();

  }



  private async performDelete(
    index: number
  ): Promise<void> {


    const removed =
      this.state
        .deletePaymentMethod(
          index
        );


    if (!removed) {

      return;

    }


    const toast =
      await this.toastController
        .create({

          message:
            'Payment method deleted.',

          duration:
            1200,

          position:
            'bottom'

        });


    await toast.present();

  }



  /* =========================
     ICON
     ========================= */

  paymentIcon(
    payment: any
  ): string {


    const title =
      String(
        payment?.title || ''
      )
        .toLowerCase();


    if (
      title.includes('cash')
    ) {

      return 'wallet-outline';

    }


    if (
      title.includes('gcash')
    ) {

      return 'wallet-outline';

    }


    return 'card-outline';

  }


}