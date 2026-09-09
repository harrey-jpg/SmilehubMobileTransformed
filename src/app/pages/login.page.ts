import {
  Component
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  IonicModule,
  AlertController,
  LoadingController
} from '@ionic/angular';

import {
  FormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  AuthService
} from '../services/auth.service';

import {
  firebaseAuth
} from '../services/firebase';



@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],

  styles: [`

    .forgot-row {
      display: flex;
      justify-content: flex-end;

      margin:
        5px 4px
        14px;
    }


    .forgot-link {
      border: none;
      background: transparent;
      padding: 0;

      color:
        var(--ion-color-primary);

      font-size: 11px;
      font-weight: 800;

      cursor: pointer;
    }


    .forgot-link:disabled {
      opacity: .5;
      cursor: default;
    }


    .divider {
      display: flex;
      align-items: center;

      gap: 12px;

      margin:
        18px 2px;
    }


    .divider-line {
      flex: 1;
      height: 1px;

      background:
        rgba(
          120,
          120,
          120,
          .20
        );
    }


    .divider-text {
      font-size: 10px;
      font-weight: 800;

      color:
        var(--ion-color-medium);
    }


    .google-button {
      margin: 0;

      --border-radius: 13px;
      --border-width: 1px;
      --border-color:
        rgba(
          120,
          120,
          120,
          .28
        );

      --background:
        var(
          --ion-card-background,
          #ffffff
        );

      --color:
        var(--ion-text-color);

      font-size: 12px;
      font-weight: 800;

      text-transform: none;
    }


    .google-mark {
      width: 24px;
      height: 24px;

      margin-right: 8px;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background: #ffffff;
      color: #4285f4;

      font-size: 15px;
      font-weight: 900;

      box-shadow:
        0 1px 4px
        rgba(
          0,
          0,
          0,
          .16
        );
    }


    .signup-row {
      margin-top: 18px;

      text-align: center;

      font-size: 12px;

      color:
        var(--ion-color-medium);
    }


    .signup-link {
      margin-left: 4px;

      color:
        var(--ion-color-primary);

      font-weight: 900;

      cursor: pointer;
    }


    .signup-link.disabled {
      opacity: .5;
      pointer-events: none;
    }

  `],


  template: `

<ion-content>


  <div class="auth-shell">



    <!-- LOGO -->

    <div class="logo">

      <span class="logo-mark">
        🦷
      </span>

      <span>
        SmileHub
      </span>

    </div>



    <h1 class="hero-title">

      Welcome back

    </h1>



    <p class="muted">

      Sign in to continue shopping dental supplies.

    </p>



    <form
      (ngSubmit)="login()">



      <!-- EMAIL -->

      <ion-item
        class="input-card"
        lines="none">


        <ion-input
          label="Email"
          labelPlacement="stacked"

          type="email"

          inputmode="email"

          autocomplete="email"

          placeholder="you@example.com"

          [(ngModel)]="email"

          name="email"

          [disabled]="busy"

          required>
        </ion-input>


      </ion-item>



      <!-- PASSWORD -->

      <ion-item
        class="input-card"
        lines="none">


        <ion-input
          label="Password"
          labelPlacement="stacked"

          type="password"

          autocomplete="current-password"

          [(ngModel)]="password"

          name="password"

          [disabled]="busy"

          required>
        </ion-input>


      </ion-item>



      <!-- FORGOT PASSWORD -->

      <div class="forgot-row">


        <button
          class="forgot-link"

          type="button"

          [disabled]="busy"

          (click)="forgotPassword()">

          Forgot password?

        </button>


      </div>



      <!-- EMAIL SIGN IN -->

      <ion-button
        expand="block"

        class="primary-btn"

        type="submit"

        [disabled]="busy">


        <ion-spinner
          *ngIf="signingIn"

          slot="start"

          name="crescent">
        </ion-spinner>


        <ion-icon
          *ngIf="!signingIn"

          slot="start"

          name="log-in-outline">
        </ion-icon>


        {{
          signingIn
            ? 'Signing In...'
            : 'Sign In'
        }}


      </ion-button>


    </form>



    <!-- DIVIDER -->

    <div class="divider">


      <div class="divider-line">
      </div>


      <div class="divider-text">

        OR

      </div>


      <div class="divider-line">
      </div>


    </div>



    <!-- GOOGLE SIGN IN -->

    <ion-button
      expand="block"

      fill="outline"

      class="google-button"

      type="button"

      [disabled]="busy"

      (click)="loginWithGoogle()">


      <ion-spinner
        *ngIf="googleSigningIn"

        slot="start"

        name="crescent">
      </ion-spinner>


      <span
        *ngIf="!googleSigningIn"

        class="google-mark">

        G

      </span>


      {{
        googleSigningIn
          ? 'Connecting to Google...'
          : 'Continue with Google'
      }}


    </ion-button>



    <!-- SIGNUP -->

    <div class="signup-row">


      New to SmileHub?


      <span
        class="signup-link"

        [class.disabled]="busy"

        (click)="openSignup()">

        Create account

      </span>


    </div>


  </div>


</ion-content>

`

})


export class LoginPage {


  email =
    '';


  password =
    '';


  signingIn =
    false;


  googleSigningIn =
    false;



  constructor(

    private auth:
      AuthService,

    public router:
      Router,

    private alerts:
      AlertController,

    private loading:
      LoadingController

  ) {}



  /* =========================
     BUSY STATE
     ========================= */

  get busy():
    boolean {


    return (
      this.signingIn
      ||
      this.googleSigningIn
    );

  }



  /* =========================
     PAGE ENTER
     ========================= */

  ionViewWillEnter():
    void {


    if (
      firebaseAuth.currentUser
    ) {


      void this.router
        .navigateByUrl(

          '/home',

          {
            replaceUrl: true
          }

        );

    }

  }



  /* =========================
     EMAIL LOGIN
     ========================= */

  async login():
    Promise<void> {


    if (this.busy) {

      return;

    }


    const cleanEmail =
      this.email
        .trim()
        .toLowerCase();


    const cleanPassword =
      this.password;


    if (
      !cleanEmail
      ||
      !cleanPassword
    ) {


      await this.message(
        'Please enter your email and password.'
      );


      return;

    }


    if (
      !this.validEmail(
        cleanEmail
      )
    ) {


      await this.message(
        'Enter a valid email address.'
      );


      return;

    }


    this.signingIn =
      true;


    const loader =
      await this.loading.create({

        message:
          'Signing in...',

        spinner:
          'crescent'

      });


    await loader.present();


    try {


      await this.auth.signIn(

        cleanEmail,

        cleanPassword

      );


      this.password =
        '';


      await this.router
        .navigateByUrl(

          '/home',

          {
            replaceUrl: true
          }

        );


    } catch (
      error: any
    ) {


      console.error(
        'Email sign in error:',
        error
      );


      await this.message(

        this.authError(
          error?.code
        )

      );


    } finally {


      this.signingIn =
        false;


      try {

        await loader.dismiss();

      } catch (_) {}

    }

  }



  /* =========================
     GOOGLE LOGIN
     ========================= */

  async loginWithGoogle():
    Promise<void> {


    if (this.busy) {

      return;

    }


    this.googleSigningIn =
      true;


    const loader =
      await this.loading.create({

        message:
          'Connecting to Google...',

        spinner:
          'crescent'

      });


    await loader.present();


    try {


      await this.auth
        .signInWithGoogle();


      await this.router
        .navigateByUrl(

          '/home',

          {
            replaceUrl: true
          }

        );


    } catch (
      error: any
    ) {


      console.error(
        'Google sign in error:',
        error
      );


      /*
       * Closing the Google popup is not
       * treated as a serious app error.
       */

      if (
        error?.code ===
          'auth/popup-closed-by-user'
        ||
        error?.code ===
          'auth/cancelled-popup-request'
      ) {


        return;

      }


      await this.message(

        this.googleAuthError(
          error?.code
        )

      );


    } finally {


      this.googleSigningIn =
        false;


      try {

        await loader.dismiss();

      } catch (_) {}

    }

  }



  /* =========================
     FORGOT PASSWORD
     ========================= */

  async forgotPassword():
    Promise<void> {


    if (this.busy) {

      return;

    }


    const alert =
      await this.alerts.create({


        header:
          'Reset Password',


        message:
          'Enter the email address connected to your SmileHub account.',


        inputs: [

          {

            name:
              'email',

            type:
              'email',

            placeholder:
              'Email address',

            value:
              this.email.trim()

          }

        ],


        buttons: [


          {

            text:
              'Cancel',

            role:
              'cancel'

          },


          {

            text:
              'Send Reset Link',

            handler:
              data => {


                void this.sendResetEmail(
                  data?.email || ''
                );

              }

          }


        ]


      });


    await alert.present();

  }



  /* =========================
     SEND RESET EMAIL
     ========================= */

  private async sendResetEmail(
    email: string
  ):
    Promise<void> {


    const cleanEmail =
      String(
        email || ''
      )
        .trim()
        .toLowerCase();


    if (
      !cleanEmail
      ||
      !this.validEmail(
        cleanEmail
      )
    ) {


      await this.message(
        'Enter a valid email address.'
      );


      return;

    }


    const loader =
      await this.loading.create({

        message:
          'Sending reset email...',

        spinner:
          'crescent'

      });


    await loader.present();


    try {


      await this.auth
        .resetPassword(
          cleanEmail
        );


      this.email =
        cleanEmail;


      await this.message(
        'Password reset instructions have been sent. Please check your email.'
      );


    } catch (
      error: any
    ) {


      console.error(
        'Password reset error:',
        error
      );


      await this.message(

        this.resetError(
          error?.code
        )

      );


    } finally {


      try {

        await loader.dismiss();

      } catch (_) {}

    }

  }



  /* =========================
     OPEN SIGNUP
     ========================= */

  openSignup():
    void {


    if (this.busy) {

      return;

    }


    void this.router.navigate(
      ['/signup']
    );

  }



  /* =========================
     EMAIL VALIDATION
     ========================= */

  private validEmail(
    email: string
  ):
    boolean {


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(
        email
      );

  }



  /* =========================
     EMAIL AUTH ERRORS
     ========================= */

  private authError(
    code: string
  ):
    string {


    switch (code) {


      case 'auth/invalid-email':

        return 'Enter a valid email address.';


      case 'auth/user-disabled':

        return 'This account has been disabled.';


      case 'auth/too-many-requests':

        return 'Too many login attempts. Please try again later.';


      case 'auth/network-request-failed':

        return 'Unable to connect. Check your internet connection.';


      case 'auth/invalid-credential':

      case 'auth/wrong-password':

      case 'auth/user-not-found':

        return 'Incorrect email or password.';


      default:

        return 'Unable to sign in. Please try again.';

    }

  }



  /* =========================
     GOOGLE AUTH ERRORS
     ========================= */

  private googleAuthError(
    code: string
  ):
    string {


    switch (code) {


      case 'auth/popup-blocked':

        return 'Google sign-in popup was blocked. Please allow popups and try again.';


      case 'auth/unauthorized-domain':

        return 'This domain is not authorized for Google sign-in in Firebase.';


      case 'auth/account-exists-with-different-credential':

        return 'An account with this email already exists using another sign-in method.';


      case 'auth/network-request-failed':

        return 'Unable to connect to Google. Check your internet connection.';


      case 'auth/too-many-requests':

        return 'Too many attempts. Please try again later.';


      default:

        return 'Unable to sign in with Google. Please try again.';

    }

  }



  /* =========================
     RESET ERRORS
     ========================= */

  private resetError(
    code: string
  ):
    string {


    switch (code) {


      case 'auth/invalid-email':

        return 'Enter a valid email address.';


      case 'auth/too-many-requests':

        return 'Too many requests. Please try again later.';


      case 'auth/network-request-failed':

        return 'Unable to connect. Check your internet connection.';


      default:

        return 'Unable to send the reset email. Please try again.';

    }

  }



  /* =========================
     ALERT
     ========================= */

  private async message(
    message: string
  ):
    Promise<void> {


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
