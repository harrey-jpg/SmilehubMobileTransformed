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

import { AppStateService } from '../services/app-state.service';


@Component({
  selector: 'app-add-payment',
  standalone: true,

  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],

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


<div class="page-wrap no-bottom">


  <div class="notice">


    <ion-icon
      name="shield-checkmark-outline">
    </ion-icon>


    Never enter a complete card number,
    CVV, PIN, or password.


  </div>



  <form
    (ngSubmit)="save()">



    <!-- PAYMENT TYPE -->

    <ion-item
      class="input-card"
      lines="none">


      <ion-select

        label="Payment Type"

        labelPlacement="stacked"

        [(ngModel)]="type"

        name="type"

        (ionChange)="onTypeChange()">


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



    <!-- GCASH -->

    <ng-container
      *ngIf="type === 'GCash'">


      <ion-item
        class="input-card"
        lines="none">


        <ion-input

          label="GCash Mobile Number"

          labelPlacement="stacked"

          type="tel"

          inputmode="numeric"

          maxlength="11"

          placeholder="
            09XXXXXXXXX
          "

          [(ngModel)]="gcashNumber"

          name="gcashNumber">

        </ion-input>


      </ion-item>



      <div
        class="muted"
        style="
          font-size:10px;
          margin:0 4px 12px
        ">


        <ng-container
          *ngIf="!editMode">

          Only the last 4 digits
          will be saved.

        </ng-container>


        <ng-container
          *ngIf="editMode">

          Leave blank to keep the
          existing GCash number,
          or enter a new mobile number.

        </ng-container>


      </div>


    </ng-container>



    <!-- CARD -->

    <ng-container
      *ngIf="type === 'Card'">


      <ion-item
        class="input-card"
        lines="none">


        <ion-select

          label="Card Type"

          labelPlacement="stacked"

          [(ngModel)]="cardBrand"

          name="cardBrand">


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



      <ion-item
        class="input-card"
        lines="none">


        <ion-input

          label="Last 4 Digits"

          labelPlacement="stacked"

          type="tel"

          inputmode="numeric"

          maxlength="4"

          placeholder="1234"

          [(ngModel)]="cardLastFour"

          name="cardLastFour">

        </ion-input>


      </ion-item>



      <ion-item
        class="input-card"
        lines="none">


        <ion-input

          label="Expiry"

          labelPlacement="stacked"

          placeholder="MM/YY"

          maxlength="5"

          [(ngModel)]="expiry"

          name="expiry">

        </ion-input>


      </ion-item>


    </ng-container>



    <!-- SAVE -->

    <ion-button

      expand="block"

      type="submit"

      class="primary-btn"

      [disabled]="saving">


      <ion-spinner
        *ngIf="saving"
        slot="start">
      </ion-spinner>


      {{
        saving

          ? 'Saving...'

          : editMode

            ? 'Save Changes'

            : 'Save Payment Method'
      }}


    </ion-button>


  </form>


</div>


</ion-content>

`
})


export class AddPaymentPage {


  editIndex:
    number | null = null;


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
    any = null;



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
      this.editIndex !== null
    );

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
        .get('index');


    if (
      rawIndex === null
    ) {

      return;

    }


    const index =
      Number(rawIndex);


    if (
      !Number.isInteger(index)

      ||

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


    this.editIndex =
      index;


    this.existingPayment =
      payment;


    this.loadExistingPayment(
      payment
    );

  }



  /* =========================
     LOAD EXISTING
     ========================= */

  private loadExistingPayment(
    payment: any
  ): void {


    const title =
      String(
        payment?.title || ''
      );


    const subtitle =
      String(
        payment?.subtitle || ''
      );


    if (
      title
        .toLowerCase()
        .includes('gcash')
    ) {


      this.type =
        'GCash';


      /*
       * Full mobile number is intentionally
       * not stored, so don't fake one.
       */

      this.gcashNumber =
        '';


      return;

    }



    this.type =
      'Card';



    /*
     * Card brand
     */

    if (
      title
        .toLowerCase()
        .includes('mastercard')
    ) {


      this.cardBrand =
        'Mastercard';


    } else if (
      title
        .toLowerCase()
        .includes('visa')
    ) {


      this.cardBrand =
        'Visa';


    } else {


      this.cardBrand =
        'Other';

    }



    /*
     * Last four
     */

    const lastFourMatch =
      title.match(
        /ending\s+(\d{4})/i
      );


    this.cardLastFour =
      lastFourMatch?.[1]
      || '';



    /*
     * Expiry
     */

    const expiryMatch =
      subtitle.match(
        /(\d{2}\/\d{2})/
      );


    this.expiry =
      expiryMatch?.[1]
      || '';

  }



  /* =========================
     RESET
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
     TYPE CHANGE
     ========================= */

  onTypeChange():
    void {


    if (
      this.type === 'GCash'
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


    if (this.saving) {

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
      this.type === 'GCash'
    ) {


      const digits =
        this.onlyDigits(
          this.gcashNumber
        );



      /*
       * Edit existing GCash and user
       * left field blank:
       * keep current masked number.
       */

      if (
        this.editMode

        &&

        this.existingPayment

        &&

        String(
          this.existingPayment.title
          || ''
        )
          .toLowerCase()
          .includes('gcash')

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
            .test(digits)
        ) {


          await this.msg(
            'Enter a valid 11-digit GCash mobile number.'
          );


          return;

        }


        title =
          'GCash';


        subtitle =
          `•••• •••• ${digits.slice(-4)}`;

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
          .test(lastFour)
      ) {


        await this.msg(
          'Enter the last 4 digits of the card.'
        );


        return;

      }


      const cleanExpiry =
        this.expiry.trim();


      if (
        cleanExpiry

        &&

        !/^(0[1-9]|1[0-2])\/\d{2}$/
          .test(cleanExpiry)
      ) {


        await this.msg(
          'Enter expiry using MM/YY format.'
        );


        return;

      }


      title =
        `${this.cardBrand} ending ${lastFour}`;


      subtitle =
        cleanExpiry

          ? `Expires ${cleanExpiry}`

          : 'Saved card';


      icon =
        'card-outline';

    }



    /* =========================
       DUPLICATE
       ========================= */

    const duplicate =
      this.state
        .paymentMethods
        .some(

          (
            payment,
            index
          ) => {


            /*
             * Ignore current item
             * while editing.
             */

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
                payment.title || ''
              )
                .toLowerCase()

              ===

              title.toLowerCase()


              &&


              String(
                payment.subtitle || ''
              )
                .toLowerCase()

              ===

              subtitle.toLowerCase()

            );

          }

        );


    if (duplicate) {


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
        this.editIndex !== null
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


        if (!updated) {


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


    } catch (error: any) {


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
     DIGITS
     ========================= */

  private onlyDigits(
    value: string
  ): string {


    return String(
      value || ''
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
  ): Promise<void> {


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