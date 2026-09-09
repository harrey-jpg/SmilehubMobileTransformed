import { Component } from '@angular/core';
import {
  ActivatedRoute,
  RouterModule
} from '@angular/router';

import {
  IonicModule,
  AlertController,
  ToastController
} from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  SupportService
} from '../services/support.service';


@Component({
  selector: 'app-contact-support',

  standalone: true,

  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    RouterModule
  ],

  template: `

<ion-header>

  <ion-toolbar>

    <ion-buttons slot="start">

      <ion-back-button
        defaultHref="/account">
      </ion-back-button>

    </ion-buttons>


    <ion-title>
      Contact Support
    </ion-title>

  </ion-toolbar>

</ion-header>



<ion-content>

<div class="page-wrap no-bottom">


  <!-- CONTACT FORM -->

  <div class="app-card">


    <h2>
      Send us a message
    </h2>


    <p class="muted">
      Tell us what you need help with and
      the SmileHub team can review it.
    </p>



    <form
      (ngSubmit)="send()">



      <!-- CONCERN -->

      <ion-item
        class="input-card">


        <ion-select
          label="Concern"
          labelPlacement="stacked"

          [(ngModel)]="concern"

          name="concern"

          [disabled]="submitting">


          <ion-select-option
            value="Order concern">

            Order concern

          </ion-select-option>


          <ion-select-option
            value="Delivery concern">

            Delivery concern

          </ion-select-option>


          <ion-select-option
            value="Product inquiry">

            Product inquiry

          </ion-select-option>


          <ion-select-option
            value="Payment concern">

            Payment concern

          </ion-select-option>


          <ion-select-option
            value="Account concern">

            Account concern

          </ion-select-option>


          <ion-select-option
            value="Technical Support">

            Technical Support

          </ion-select-option>


          <ion-select-option
            value="Other">

            Other

          </ion-select-option>


        </ion-select>


      </ion-item>



      <!-- MESSAGE -->

      <ion-item
        class="input-card">


        <ion-textarea
          label="Message"
          labelPlacement="stacked"

          placeholder="Describe your concern..."

          [autoGrow]="true"

          [(ngModel)]="message"

          name="message"

          rows="6"

          maxlength="1000"

          [disabled]="submitting">
        </ion-textarea>


      </ion-item>



      <!-- CHARACTER INFO -->

      <div
        class="muted"

        style="
          display:flex;
          justify-content:space-between;
          font-size:10px;
          margin:0 4px 12px;
        ">


        <span>
          Minimum 10 characters
        </span>


        <span>
          {{ message.length }}/1000
        </span>


      </div>



      <!-- SUBMIT -->

      <ion-button
        expand="block"

        type="submit"

        class="primary-btn"

        [disabled]="submitting">


        <ion-spinner
          *ngIf="submitting"

          slot="start"

          name="crescent">
        </ion-spinner>


        <ion-icon
          *ngIf="!submitting"

          slot="start"

          name="send-outline">
        </ion-icon>


        {{
          submitting
            ? 'Submitting...'
            : 'Submit Concern'
        }}


      </ion-button>


    </form>


  </div>



  <!-- QUICK HELP -->

  <div class="section-row">

    <h2>
      Need quick help?
    </h2>

  </div>



  <div class="list-stack">


    <!-- MY ORDERS -->

    <div
      class="app-card"

      routerLink="/orders"

      style="
        display:flex;
        align-items:center;
        gap:12px;
        cursor:pointer;
      ">


      <ion-icon
        name="cart-outline"

        style="
          font-size:22px;
        ">
      </ion-icon>


      <div>


        <b>
          My Orders
        </b>


        <div class="muted">

          Check order status and details

        </div>


      </div>


    </div>



    <!-- HELP -->

    <div
      class="app-card"

      routerLink="/help"

      style="
        display:flex;
        align-items:center;
        gap:12px;
        cursor:pointer;
      ">


      <ion-icon
        name="help-circle-outline"

        style="
          font-size:22px;
        ">
      </ion-icon>


      <div>


        <b>
          Help & FAQs
        </b>


        <div class="muted">

          View common questions

        </div>


      </div>


    </div>


  </div>


</div>

</ion-content>

`
})


export class ContactSupportPage {


  concern =
    'Order concern';


  message =
    '';


  submitting =
    false;



  constructor(

    private route:
      ActivatedRoute,

    private support:
      SupportService,

    private alerts:
      AlertController,

    private toastController:
      ToastController

  ) {


    const queryConcern =
      this.route
        .snapshot
        .queryParamMap
        .get('concern');


    if (queryConcern) {

      this.concern =
        queryConcern;

    }

  }



  /* =========================
     SUBMIT CONCERN
     ========================= */

  async send():
    Promise<void> {


    if (this.submitting) {

      return;

    }


    const cleanMessage =
      this.message.trim();



    /* EMPTY MESSAGE */

    if (!cleanMessage) {


      await this.showMessage(
        'Please enter your message.'
      );


      return;

    }



    /* MINIMUM LENGTH */

    if (
      cleanMessage.length < 10
    ) {


      await this.showMessage(
        'Please provide more details about your concern.'
      );


      return;

    }



    this.submitting =
      true;


    try {


      /* SAVE TO FIREBASE */

      await this.support
        .submitConcern({

          concern:
            this.concern,

          message:
            cleanMessage

        });



      /* SUCCESS TOAST */

      const toast =
        await this.toastController
          .create({

            message:
              'Concern submitted successfully.',

            duration:
              1500,

            position:
              'bottom'

          });


      await toast.present();



      /* SUCCESS ALERT */

      const alert =
        await this.alerts
          .create({

            header:
              'Concern Submitted',

            message:
              'Your concern has been submitted successfully to SmileHub Support.',

            buttons: [
              'OK'
            ]

          });


      await alert.present();



      /* CLEAR MESSAGE */

      this.message =
        '';


    } catch (error: any) {


      console.error(
        'Unable to submit concern:',
        error
      );


      await this.showMessage(

        error?.message
        ||
        'Unable to submit your concern.'

      );


    } finally {


      this.submitting =
        false;

    }

  }



  /* =========================
     ALERT
     ========================= */

  private async showMessage(
    message: string
  ): Promise<void> {


    const alert =
      await this.alerts
        .create({

          header:
            'SmileHub Support',

          message,

          buttons: [
            'OK'
          ]

        });


    await alert.present();

  }


}