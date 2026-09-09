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
  AlertController,
  LoadingController
} from '@ionic/angular';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  PhoneAuthService
} from '../services/phone-auth.service';


@Component({
  selector: 'app-verify-phone',

  standalone: true,

  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],

  styles: [`

    .verify-card {
      padding: 20px;
      text-align: center;
    }

    .verify-icon {
      width: 68px;
      height: 68px;

      margin:
        0 auto
        14px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .12
        );

      color:
        var(--ion-color-primary);

      font-size: 31px;
    }

    .verify-card h2 {
      margin: 0;

      font-size: 20px;
      font-weight: 900;
    }

    .verify-card p {
      margin:
        7px auto
        16px;

      max-width: 310px;

      font-size: 11px;
      line-height: 1.5;

      color:
        var(--ion-color-medium);
    }

    .phone-display {
      margin-bottom: 15px;

      padding: 13px;

      border-radius: 13px;

      background:
        rgba(120,120,120,.08);

      font-size: 16px;
      font-weight: 900;
    }

    .otp-input {
      margin-top: 12px;
    }

    .verify-button {
      margin-top: 15px;

      --border-radius: 13px;

      font-weight: 800;
    }

    .resend-button {
      margin-top: 7px;

      font-size: 11px;
      font-weight: 800;
    }

    .otp-help {
      margin-top: 10px;

      font-size: 10px;
      line-height: 1.45;

      color:
        var(--ion-color-medium);
    }

    #recaptcha-container {
      min-height: 1px;
    }

  `],

  template: `

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        defaultHref="/personal-information">
      </ion-back-button>

    </ion-buttons>


    <ion-title>
      Verify Mobile
    </ion-title>


  </ion-toolbar>

</ion-header>



<ion-content>


<div class="page-wrap no-bottom">


  <div class="app-card verify-card">


    <div class="verify-icon">

      <ion-icon
        name="shield-checkmark-outline">
      </ion-icon>

    </div>


    <h2>
      Verify your number
    </h2>


    <p>

      We'll send a 6-digit verification
      code to confirm that this mobile
      number belongs to you.

    </p>



    <div class="phone-display">

      {{ mobile }}

    </div>



    <!-- RECAPTCHA -->

    <div id="recaptcha-container">
    </div>



    <!-- BEFORE OTP -->

    <ng-container
      *ngIf="!codeSent">


      <ion-button
        class="verify-button"

        expand="block"

        type="button"

        [disabled]="sending"

        (click)="sendOtp()">


        <ion-spinner
          *ngIf="sending"

          slot="start"

          name="crescent">
        </ion-spinner>


        {{
          sending
            ? 'Sending Code...'
            : 'Send OTP'
        }}


      </ion-button>


    </ng-container>



    <!-- AFTER OTP -->

    <ng-container
      *ngIf="codeSent">


      <ion-item
        class="input-card otp-input"
        lines="none">


        <ion-input

          label="Verification code"

          labelPlacement="stacked"

          placeholder="123456"

          type="tel"

          inputmode="numeric"

          maxlength="6"

          [(ngModel)]="otp"

          name="otp"

          [disabled]="verifying">

        </ion-input>


      </ion-item>



      <div class="otp-help">

        Enter the 6-digit code sent
        to {{ mobile }}.

      </div>



      <ion-button
        class="verify-button"

        expand="block"

        type="button"

        [disabled]="verifying"

        (click)="verifyOtp()">


        <ion-spinner
          *ngIf="verifying"

          slot="start"

          name="crescent">
        </ion-spinner>


        <ion-icon
          *ngIf="!verifying"

          slot="start"

          name="checkmark-circle-outline">
        </ion-icon>


        {{
          verifying
            ? 'Verifying...'
            : 'Verify Number'
        }}


      </ion-button>



      <ion-button
        class="resend-button"

        fill="clear"

        type="button"

        [disabled]="sending || verifying"

        (click)="sendOtp()">

        Resend Code

      </ion-button>


    </ng-container>


  </div>


</div>


</ion-content>

`
})


export class VerifyPhonePage
implements OnDestroy {


  mobile =
    '';


  otp =
    '';


  codeSent =
    false;


  sending =
    false;


  verifying =
    false;



  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private phoneAuth:
      PhoneAuthService,

    private alerts:
      AlertController,

    private loading:
      LoadingController

  ) {}



  ionViewWillEnter():
    void {


    this.mobile =
      this.route
        .snapshot
        .queryParamMap
        .get('mobile')
      || '';


    if (!this.mobile) {


      void this.router
        .navigateByUrl(
          '/personal-information'
        );

    }

  }



  async sendOtp():
    Promise<void> {


    if (this.sending) {

      return;

    }


    this.sending =
      true;


    try {


      const result =
        await this.phoneAuth
          .sendOtp(
            this.mobile
          );


      if (
        result.alreadyVerified
      ) {


        await this.message(

          'Mobile Verified',

          'This mobile number is already verified.'

        );


        await this.router
          .navigateByUrl(
            '/personal-information'
          );


        return;

      }


      this.codeSent =
        true;


      this.otp =
        '';


      await this.message(

        'OTP Sent',

        'Enter the 6-digit verification code.'

      );


    } catch (error: any) {


      console.error(
        'Unable to send OTP:',
        error
      );


      await this.message(

        'Unable to Send OTP',

        this.errorMessage(
          error
        )

      );


    } finally {


      this.sending =
        false;

    }

  }



  async verifyOtp():
    Promise<void> {


    const code =
      this.otp
        .replace(/\D/g, '');


    if (
      !/^\d{6}$/
        .test(code)
    ) {


      await this.message(

        'SmileHub',

        'Enter the 6-digit verification code.'

      );


      return;

    }


    if (this.verifying) {

      return;

    }


    this.verifying =
      true;


    const loader =
      await this.loading
        .create({

          message:
            'Verifying number...',

          spinner:
            'crescent'

        });


    await loader.present();



    try {


      await this.phoneAuth
        .verifyOtp(
          code
        );


      await this.message(

        'Mobile Verified',

        'Your mobile number has been verified successfully.'

      );


      await this.router
        .navigateByUrl(
          '/personal-information'
        );


    } catch (error: any) {


      console.error(
        'Unable to verify OTP:',
        error
      );


      await this.message(

        'Verification Failed',

        this.errorMessage(
          error
        )

      );


    } finally {


      this.verifying =
        false;


      try {

        await loader.dismiss();

      } catch {}

    }

  }



  private errorMessage(
    error: any
  ): string {


    const code =
      String(
        error?.code || ''
      );


    switch (code) {


      case 'auth/invalid-verification-code':

        return 'The verification code is incorrect.';


      case 'auth/code-expired':

        return 'The verification code has expired. Request a new code.';


      case 'auth/too-many-requests':

        return 'Too many attempts. Please try again later.';


      case 'auth/invalid-phone-number':

        return 'Enter a valid mobile number.';


      case 'auth/credential-already-in-use':

        return 'This mobile number is already connected to another account.';


      case 'auth/requires-recent-login':

        return 'Please sign out and sign in again before changing your verified number.';


      case 'auth/network-request-failed':

        return 'Check your internet connection and try again.';


      case 'auth/unauthorized-domain':

        return 'This development domain is not authorized for Firebase Phone Authentication.';


      default:

        return (
          error?.message
          ||
          'Unable to complete phone verification.'
        );

    }

  }



  private async message(
    header: string,
    message: string
  ):
    Promise<void> {


    const alert =
      await this.alerts
        .create({

          header,

          message,

          buttons: [
            'OK'
          ]

        });


    await alert.present();

  }



  ngOnDestroy():
    void {


    this.phoneAuth.reset();

  }


}