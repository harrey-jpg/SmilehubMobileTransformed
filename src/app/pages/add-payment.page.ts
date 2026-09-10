import { Component } from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  IonicModule,
  AlertController,
  ToastController
} from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  AppStateService
} from '../services/app-state.service';


@Component({
  selector: 'app-add-payment',
  standalone: true,

  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],

  styles: [`

    /* =========================
       PAGE
       ========================= */

    .pay-page {
      padding-bottom: 34px;
    }


    /* =========================
       INTRO
       ========================= */

    .pay-intro {
      margin-bottom: 18px;
    }

    .pay-kicker {
      color:
        var(--ion-color-primary);

      font-size: 10px;
      font-weight: 900;

      letter-spacing: .8px;

      text-transform: uppercase;
    }

    .pay-title {
      margin:
        4px 0 5px;

      color:
        var(--ion-text-color);

      font-size: 23px;
      line-height: 1.2;

      font-weight: 900;
    }

    .pay-subtitle {
      max-width: 370px;

      margin: 0;

      color:
        var(--ion-color-medium);

      font-size: 11px;
      line-height: 1.5;
    }


    /* =========================
       SECURITY NOTICE
       ========================= */

    .pay-security {
      display: flex;

      align-items: flex-start;

      gap: 11px;

      margin-bottom: 19px;

      padding:
        13px 14px;

      border-radius: 16px;

      background:
        rgba(
          var(--ion-color-success-rgb),
          .08
        );

      border:
        1px solid
        rgba(
          var(--ion-color-success-rgb),
          .13
        );
    }

    .pay-security-icon {
      width: 34px;
      height: 34px;

      flex: 0 0 34px;

      display: flex;

      align-items: center;
      justify-content: center;

      border-radius: 11px;

      background:
        rgba(
          var(--ion-color-success-rgb),
          .13
        );

      color:
        var(--ion-color-success);
    }

    .pay-security-icon ion-icon {
      font-size: 18px;
    }

    .pay-security-content {
      flex: 1;
    }

    .pay-security-title {
      color:
        var(--ion-text-color);

      font-size: 11px;
      font-weight: 900;
    }

    .pay-security-text {
      margin-top: 3px;

      color:
        var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.45;
    }


    /* =========================
       SECTION
       ========================= */

    .pay-section {
      margin-top: 19px;
    }

    .pay-section-heading {
      display: flex;

      align-items: center;

      gap: 9px;

      margin:
        0 2px 9px;
    }

    .pay-section-icon {
      width: 34px;
      height: 34px;

      flex: 0 0 34px;

      display: flex;

      align-items: center;
      justify-content: center;

      border-radius: 11px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      color:
        var(--ion-color-primary);
    }

    .pay-section-icon ion-icon {
      width: 18px;
      height: 18px;

      font-size: 18px;

      color:
        var(--ion-color-primary);
    }

    .pay-section-title {
      color:
        var(--ion-text-color);

      font-size: 13px;
      font-weight: 900;
    }

    .pay-section-subtitle {
      margin-top: 2px;

      color:
        var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.4;
    }


    /* =========================
       CARD
       ========================= */

    .pay-card {
      padding: 12px;

      border-radius: 19px;

      border:
        1px solid
        rgba(
          120,
          120,
          120,
          .09
        );
    }


    /* =========================
       FIELD
       ========================= */

    .pay-field {
      margin-bottom: 10px;

      border:
        1px solid
        rgba(
          120,
          120,
          120,
          .11
        );

      border-radius: 14px;

      --background:
        rgba(
          120,
          120,
          120,
          .04
        );

      --border-radius: 14px;

      --padding-start: 12px;

      --inner-padding-end: 12px;

      --min-height: 64px;
    }

    .pay-field:last-child {
      margin-bottom: 0;
    }

    .pay-field ion-icon[slot="start"] {
      width: 19px;
      height: 19px;

      min-width: 19px;

      margin-right: 12px;

      color:
        var(--ion-color-primary);

      font-size: 19px;
    }

    .pay-field ion-input,
    .pay-field ion-select {
      color:
        var(--ion-text-color);

      font-size: 12px;
    }


    /* =========================
       FIELD NOTE
       ========================= */

    .pay-note {
      display: flex;

      align-items: flex-start;

      gap: 7px;

      margin:
        9px 3px 0;

      color:
        var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.45;
    }

    .pay-note ion-icon {
      flex-shrink: 0;

      margin-top: 1px;

      color:
        var(--ion-color-primary);

      font-size: 14px;
    }


    /* =========================
       PAYMENT PREVIEW
       ========================= */

    .pay-preview {
      display: flex;

      align-items: center;

      gap: 13px;

      margin-top: 15px;

      padding:
        14px;

      border-radius: 17px;

      background:
        linear-gradient(
          135deg,
          rgba(
            var(--ion-color-primary-rgb),
            .09
          ),
          rgba(
            var(--ion-color-primary-rgb),
            .03
          )
        );

      border:
        1px solid
        rgba(
          var(--ion-color-primary-rgb),
          .09
        );
    }

    .pay-preview-icon {
      width: 45px;
      height: 45px;

      flex: 0 0 45px;

      display: flex;

      align-items: center;
      justify-content: center;

      border-radius: 14px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .12
        );

      color:
        var(--ion-color-primary);
    }

    .pay-preview-icon ion-icon {
      font-size: 23px;
    }

    .pay-preview-info {
      flex: 1;

      min-width: 0;
    }

    .pay-preview-label {
      color:
        var(--ion-color-medium);

      font-size: 8px;

      text-transform: uppercase;

      letter-spacing: .5px;

      font-weight: 800;
    }

    .pay-preview-title {
      margin-top: 3px;

      color:
        var(--ion-text-color);

      font-size: 12px;
      font-weight: 900;
    }

    .pay-preview-subtitle {
      margin-top: 3px;

      color:
        var(--ion-color-medium);

      font-size: 9px;
    }

    .pay-preview-check {
      flex-shrink: 0;

      color:
        var(--ion-color-success);

      font-size: 21px;
    }


    /* =========================
       SAVE
       ========================= */

    .pay-save-wrap {
      margin-top: 22px;
    }

    .pay-save-btn {
      min-height: 50px;

      margin: 0;

      --border-radius: 15px;

      font-size: 11px;
      font-weight: 900;

      text-transform: none;
    }

    .pay-save-note {
      margin-top: 8px;

      color:
        var(--ion-color-medium);

      text-align: center;

      font-size: 8px;
      line-height: 1.4;
    }


    /* =========================
       LIGHT MODE
       ========================= */

    @media (prefers-color-scheme: light) {

      .pay-card {
        background: #ffffff;

        box-shadow:
          0 7px 20px
          rgba(
            27,
            44,
            64,
            .05
          );
      }

      .pay-field {
        --background: #ffffff;

        border-color:
          rgba(
            40,
            60,
            80,
            .10
          );
      }

    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (min-width: 720px) {

      .pay-grid {
        display: grid;

        grid-template-columns:
          repeat(
            2,
            minmax(
              0,
              1fr
            )
          );

        gap: 18px;
      }

      .pay-full {
        grid-column:
          1 / -1;
      }

    }

  `],


  template: `

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        defaultHref="/payments">
      </ion-back-button>

    </ion-buttons>


    <ion-title>

      {{
        editMode
          ? 'Edit Payment'
          : 'Add Payment'
      }}

    </ion-title>


  </ion-toolbar>

</ion-header>



<ion-content>


  <div class="page-wrap no-bottom pay-page">



    <!-- =========================
         INTRO
         ========================= -->

    <div class="pay-intro">


      <div class="pay-kicker">

        SmileHub Payments

      </div>


      <h1 class="pay-title">

        {{
          editMode
            ? 'Edit Payment Method'
            : 'Add Payment Method'
        }}

      </h1>


      <p class="pay-subtitle">

        {{
          editMode
            ? 'Update your saved payment information.'
            : 'Add a payment option you can quickly select during checkout.'
        }}

      </p>


    </div>



    <!-- =========================
         SECURITY
         ========================= -->

    <div class="pay-security">


      <div class="pay-security-icon">

        <ion-icon
          name="shield-checkmark-outline">
        </ion-icon>

      </div>


      <div class="pay-security-content">


        <div class="pay-security-title">

          Your security matters

        </div>


        <div class="pay-security-text">

          Never enter a complete card number,
          CVV, PIN, OTP, or account password.
          SmileHub only keeps limited payment details.

        </div>


      </div>


    </div>



    <form
      (ngSubmit)="save()">



      <div class="pay-grid">



        <!-- =========================
             PAYMENT TYPE
             ========================= -->

        <div class="pay-section">


          <div class="pay-section-heading">


            <div class="pay-section-icon">

              <ion-icon
                name="wallet-outline">
              </ion-icon>

            </div>


            <div>


              <div class="pay-section-title">

                Payment Type

              </div>


              <div class="pay-section-subtitle">

                Choose how you want to pay

              </div>


            </div>


          </div>



          <div class="app-card pay-card">


            <ion-item
              class="pay-field"

              lines="none">


              <ion-icon
                slot="start"

                [name]="
                  type === 'GCash'
                    ? 'phone-portrait-outline'
                    : 'card-outline'
                ">
              </ion-icon>


              <ion-select
                label="Payment Type"

                labelPlacement="stacked"

                interface="popover"

                [interfaceOptions]="selectPopoverOptions"

                [(ngModel)]="type"

                name="type"

                [disabled]="saving"

                (ionChange)="
                  onTypeChange()
                ">


                <ion-select-option
                  value="GCash">

                  GCash

                </ion-select-option>


                <ion-select-option
                  value="Card">

                  Debit / Credit Card

                </ion-select-option>


              </ion-select>


            </ion-item>


          </div>


        </div>



        <!-- =========================
             GCASH
             ========================= -->

        <div
          class="pay-section"

          *ngIf="
            type === 'GCash'
          ">


          <div class="pay-section-heading">


            <div class="pay-section-icon">

              <ion-icon
                name="phone-portrait-outline">
              </ion-icon>

            </div>


            <div>


              <div class="pay-section-title">

                GCash Details

              </div>


              <div class="pay-section-subtitle">

                Save a mobile number securely

              </div>


            </div>


          </div>



          <div class="app-card pay-card">


            <ion-item
              class="pay-field"

              lines="none">


              <ion-icon
                slot="start"

                name="call-outline">
              </ion-icon>


              <ion-input
                label="GCash Mobile Number"

                labelPlacement="stacked"

                type="tel"

                inputmode="numeric"

                maxlength="11"

                placeholder="09XXXXXXXXX"

                [(ngModel)]="gcashNumber"

                name="gcashNumber"

                [disabled]="saving">
              </ion-input>


            </ion-item>



            <div class="pay-note">


              <ion-icon
                name="information-circle-outline">
              </ion-icon>


              <span *ngIf="!editMode">

                Only the last 4 digits of your
                GCash mobile number will be saved.

              </span>


              <span *ngIf="editMode">

                Leave this blank to keep the
                existing saved GCash number,
                or enter a new mobile number.

              </span>


            </div>


          </div>


        </div>



        <!-- =========================
             CARD
             ========================= -->

        <div
          class="pay-section"

          *ngIf="
            type === 'Card'
          ">


          <div class="pay-section-heading">


            <div class="pay-section-icon">

              <ion-icon
                name="card-outline">
              </ion-icon>

            </div>


            <div>


              <div class="pay-section-title">

                Card Details

              </div>


              <div class="pay-section-subtitle">

                Only limited card information is stored

              </div>


            </div>


          </div>



          <div class="app-card pay-card">


            <!-- CARD TYPE -->

            <ion-item
              class="pay-field"

              lines="none">


              <ion-icon
                slot="start"

                name="card-outline">
              </ion-icon>


              <ion-select
                label="Card Type"

                labelPlacement="stacked"

                interface="popover"

                [interfaceOptions]="selectPopoverOptions"

                [(ngModel)]="cardBrand"

                name="cardBrand"

                [disabled]="saving">


                <ion-select-option
                  value="Visa">

                  Visa

                </ion-select-option>


                <ion-select-option
                  value="Mastercard">

                  Mastercard

                </ion-select-option>


                <ion-select-option
                  value="Other">

                  Other Card

                </ion-select-option>


              </ion-select>


            </ion-item>



            <!-- LAST FOUR -->

            <ion-item
              class="pay-field"

              lines="none">


              <ion-icon
                slot="start"

                name="keypad-outline">
              </ion-icon>


              <ion-input
                label="Last 4 Digits"

                labelPlacement="stacked"

                type="tel"

                inputmode="numeric"

                maxlength="4"

                placeholder="1234"

                [(ngModel)]="cardLastFour"

                name="cardLastFour"

                [disabled]="saving">
              </ion-input>


            </ion-item>



            <!-- EXPIRY -->

            <ion-item
              class="pay-field"

              lines="none">


              <ion-icon
                slot="start"

                name="calendar-outline">
              </ion-icon>


              <ion-input
                label="Expiry"

                labelPlacement="stacked"

                placeholder="MM/YY"

                maxlength="5"

                [(ngModel)]="expiry"

                name="expiry"

                [disabled]="saving">
              </ion-input>


            </ion-item>



            <div class="pay-note">


              <ion-icon
                name="shield-checkmark-outline">
              </ion-icon>


              <span>

                Do not enter your complete card number
                or CVV. Only the last 4 digits are needed.

              </span>


            </div>


          </div>


        </div>



        <!-- =========================
             PREVIEW
             ========================= -->

        <div class="pay-section pay-full">


          <div class="pay-section-heading">


            <div class="pay-section-icon">

              <ion-icon
                name="eye-outline">
              </ion-icon>

            </div>


            <div>


              <div class="pay-section-title">

                Payment Preview

              </div>


              <div class="pay-section-subtitle">

                How this payment method will appear

              </div>


            </div>


          </div>



          <div class="pay-preview">


            <div class="pay-preview-icon">


              <ion-icon
                [name]="
                  type === 'GCash'
                    ? 'wallet-outline'
                    : 'card-outline'
                ">
              </ion-icon>


            </div>



            <div class="pay-preview-info">


              <div class="pay-preview-label">

                Payment Method

              </div>


              <div class="pay-preview-title">

                {{ previewTitle }}

              </div>


              <div class="pay-preview-subtitle">

                {{ previewSubtitle }}

              </div>


            </div>



            <ion-icon
              class="pay-preview-check"

              name="checkmark-circle-outline">
            </ion-icon>


          </div>


        </div>


      </div>



      <!-- =========================
           SAVE
           ========================= -->

      <div class="pay-save-wrap">


        <ion-button
          class="pay-save-btn"

          expand="block"

          type="submit"

          [disabled]="saving">


          <ion-spinner
            *ngIf="saving"

            slot="start"

            name="crescent">
          </ion-spinner>


          <ion-icon
            *ngIf="!saving"

            slot="start"

            name="checkmark-circle-outline">
          </ion-icon>


          {{
            saving

              ? 'Saving...'

              : editMode

                ? 'Save Changes'

                : 'Save Payment Method'
          }}


        </ion-button>


        <div class="pay-save-note">

          Your saved payment method can be
          selected during SmileHub checkout.

        </div>


      </div>


    </form>


  </div>


</ion-content>

`

})


export class AddPaymentPage {


  editIndex:
    number |
    null =
    null;


  type =
    'GCash';


  gcashNumber =
    '';


  cardBrand =
    'Visa';


  cardLastFour =
    '';


  expiry =
    '';


  saving =
    false;


  private existingPayment:
    any =
    null;



  selectPopoverOptions: any = {

    cssClass:
      'payment-select-popover'

  };



  constructor(

    private state:
      AppStateService,

    private route:
      ActivatedRoute,

    private router:
      Router,

    private alerts:
      AlertController,

    private toastController:
      ToastController

  ) {}



  /* =========================
     EDIT MODE
     ========================= */

  get editMode():
    boolean {


    return (
      this.editIndex !==
      null
    );


  }



  /* =========================
     PREVIEW TITLE
     ========================= */

  get previewTitle():
    string {


    if (
      this.type ===
      'GCash'
    ) {


      const digits =
        this.onlyDigits(
          this.gcashNumber
        );


      if (
        digits.length ===
        11
      ) {


        return 'GCash';


      }


      if (
        this.editMode
        &&
        this.existingPayment
      ) {


        return 'GCash';


      }


      return 'GCash';


    }


    const lastFour =
      this.onlyDigits(
        this.cardLastFour
      );


    if (
      lastFour.length ===
      4
    ) {


      return (
        this.cardBrand
        +
        ' ending '
        +
        lastFour
      );


    }


    return (
      this.cardBrand
      +
      ' Card'
    );


  }



  /* =========================
     PREVIEW SUBTITLE
     ========================= */

  get previewSubtitle():
    string {


    if (
      this.type ===
      'GCash'
    ) {


      const digits =
        this.onlyDigits(
          this.gcashNumber
        );


      if (
        digits.length ===
        11
      ) {


        return (
          '•••• •••• '
          +
          digits.slice(
            -4
          )
        );


      }


      if (
        this.editMode
        &&
        this.existingPayment
      ) {


        return (
          this.existingPayment
            .subtitle
          ||
          'Saved GCash'
        );


      }


      return 'GCash mobile number';


    }


    const cleanExpiry =
      String(
        this.expiry
        ||
        ''
      )
        .trim();


    if (
      cleanExpiry
    ) {


      return (
        'Expires '
        +
        cleanExpiry
      );


    }


    return 'Saved card';


  }



  /* =========================
     PAGE ENTER
     ========================= */

  ionViewWillEnter():
    void {


    this.resetForm();


    const rawIndex =
      this.route
        .snapshot
        .queryParamMap
        .get(
          'index'
        );


    if (
      rawIndex ===
      null
    ) {


      return;


    }


    const index =
      Number(
        rawIndex
      );


    if (
      !Number.isInteger(
        index
      )

      ||

      !this.state
        .canManagePayment(
          index
        )
    ) {


      return;


    }


    const payment =
      this.state
        .paymentMethods[
          index
        ];


    if (
      !payment
    ) {


      return;


    }


    this.editIndex =
      index;


    this.existingPayment =
      payment;


    this.loadExistingPayment(
      payment
    );


  }



  /* =========================
     LOAD EXISTING PAYMENT
     ========================= */

  private loadExistingPayment(
    payment: any
  ):
    void {


    const title =
      String(
        payment?.title
        ||
        ''
      );


    const subtitle =
      String(
        payment?.subtitle
        ||
        ''
      );


    if (
      title
        .toLowerCase()
        .includes(
          'gcash'
        )
    ) {


      this.type =
        'GCash';


      /*
       * Full number is intentionally
       * not stored.
       */

      this.gcashNumber =
        '';


      return;


    }



    this.type =
      'Card';



    /* CARD BRAND */

    if (
      title
        .toLowerCase()
        .includes(
          'mastercard'
        )
    ) {


      this.cardBrand =
        'Mastercard';


    } else if (
      title
        .toLowerCase()
        .includes(
          'visa'
        )
    ) {


      this.cardBrand =
        'Visa';


    } else {


      this.cardBrand =
        'Other';


    }



    /* LAST FOUR */

    const lastFourMatch =
      title.match(
        /ending\s+(\d{4})/i
      );


    this.cardLastFour =
      lastFourMatch?.[1]
      ||
      '';



    /* EXPIRY */

    const expiryMatch =
      subtitle.match(
        /(\d{2}\/\d{2})/
      );


    this.expiry =
      expiryMatch?.[1]
      ||
      '';


  }



  /* =========================
     RESET FORM
     ========================= */

  private resetForm():
    void {


    this.editIndex =
      null;


    this.existingPayment =
      null;


    this.type =
      'GCash';


    this.gcashNumber =
      '';


    this.cardBrand =
      'Visa';


    this.cardLastFour =
      '';


    this.expiry =
      '';


  }



  /* =========================
     PAYMENT TYPE CHANGED
     ========================= */

  onTypeChange():
    void {


    if (
      this.type ===
      'GCash'
    ) {


      this.cardLastFour =
        '';


      this.expiry =
        '';


    } else {


      this.gcashNumber =
        '';


    }


  }



  /* =========================
     SAVE
     ========================= */

  async save():
    Promise<void> {


    if (
      this.saving
    ) {


      return;


    }


    let title =
      '';


    let subtitle =
      '';


    let icon =
      '';



    /* =========================
       GCASH
       ========================= */

    if (
      this.type ===
      'GCash'
    ) {


      const digits =
        this.onlyDigits(
          this.gcashNumber
        );



      /*
       * Editing an existing GCash:
       * blank field means keep existing
       * masked number.
       */

      if (
        this.editMode

        &&

        this.existingPayment

        &&

        String(
          this.existingPayment
            .title
          ||
          ''
        )
          .toLowerCase()
          .includes(
            'gcash'
          )

        &&

        !digits
      ) {


        title =
          'GCash';


        subtitle =
          this.existingPayment
            .subtitle

          ||

          'Saved GCash';


      } else {


        if (
          !/^09\d{9}$/
            .test(
              digits
            )
        ) {


          await this.msg(
            'Enter a valid 11-digit GCash mobile number.'
          );


          return;


        }


        title =
          'GCash';


        subtitle =
          '•••• •••• '
          +
          digits.slice(
            -4
          );


      }


      icon =
        'wallet-outline';


    }



    /* =========================
       CARD
       ========================= */

    else {


      const lastFour =
        this.onlyDigits(
          this.cardLastFour
        );


      if (
        !/^\d{4}$/
          .test(
            lastFour
          )
      ) {


        await this.msg(
          'Enter the last 4 digits of the card.'
        );


        return;


      }


      const cleanExpiry =
        this.expiry
          .trim();


      if (
        cleanExpiry

        &&

        !/^(0[1-9]|1[0-2])\/\d{2}$/
          .test(
            cleanExpiry
          )
      ) {


        await this.msg(
          'Enter expiry using MM/YY format.'
        );


        return;


      }


      title =
        this.cardBrand
        +
        ' ending '
        +
        lastFour;


      subtitle =
        cleanExpiry

          ? 'Expires '
            +
            cleanExpiry

          : 'Saved card';


      icon =
        'card-outline';


    }



    /* =========================
       DUPLICATE CHECK
       ========================= */

    const duplicate =
      this.state
        .paymentMethods
        .some(

          (
            payment,
            index
          ) => {


            if (
              this.editMode

              &&

              index ===
                this.editIndex
            ) {


              return false;


            }


            return (

              String(
                payment.title
                ||
                ''
              )
                .toLowerCase()

              ===

              title.toLowerCase()


              &&


              String(
                payment.subtitle
                ||
                ''
              )
                .toLowerCase()

              ===

              subtitle.toLowerCase()

            );


          }

        );


    if (
      duplicate
    ) {


      await this.msg(
        'This payment method is already saved.'
      );


      return;


    }



    this.saving =
      true;


    try {


      if (
        this.editMode
        &&
        this.editIndex !==
          null
      ) {


        const updated =
          this.state
            .updatePaymentMethod(

              this.editIndex,

              {

                title,

                subtitle,

                icon

              }

            );


        if (
          !updated
        ) {


          throw new Error(
            'Unable to update payment method.'
          );


        }


      } else {


        this.state
          .addPaymentMethod({

            title,

            subtitle,

            icon

          });


      }



      const toast =
        await this.toastController
          .create({

            message:
              this.editMode

                ? 'Payment method updated.'

                : 'Payment method added.',

            duration:
              1200,

            position:
              'bottom'

          });


      await toast.present();



      await this.router
        .navigateByUrl(
          '/payments'
        );


    } catch (
      error: any
    ) {


      await this.msg(

        error?.message

        ||

        'Unable to save payment method.'

      );


    } finally {


      this.saving =
        false;


    }


  }



  /* =========================
     DIGITS ONLY
     ========================= */

  private onlyDigits(
    value: string
  ):
    string {


    return String(
      value
      ||
      ''
    )
      .replace(
        /\D/g,
        ''
      );


  }



  /* =========================
     MESSAGE
     ========================= */

  private async msg(
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