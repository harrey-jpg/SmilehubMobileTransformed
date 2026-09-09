import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonicModule,
  AlertController,
  LoadingController
} from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../services/auth.service';
import { firebaseAuth } from '../services/firebase';


@Component({
  selector: 'app-signup',
  standalone: true,

  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],

  styles: [`

    .auth-note {
      margin:
        -3px 4px
        12px;

      font-size: 10px;
      line-height: 1.4;

      color:
        var(--ion-color-medium);
    }

    .signin-row {
      margin-top: 18px;

      text-align: center;

      font-size: 12px;

      color:
        var(--ion-color-medium);
    }

    .signin-link {
      margin-left: 4px;

      color:
        var(--ion-color-primary);

      font-weight: 900;

      cursor: pointer;
    }


    .password-rules {
      margin:
        -3px 4px
        12px;

      display: grid;
      gap: 4px;

      font-size: 10px;
      line-height: 1.35;
    }

    .password-rule {
      display: flex;
      align-items: center;
      gap: 6px;

      color:
        var(--ion-color-medium);
    }

    .password-rule.valid {
      color:
        var(--ion-color-success);
    }

    .password-rule.invalid {
      color:
        var(--ion-color-danger);
    }

    .password-rule.neutral {
      color:
        var(--ion-color-medium);
    }

    .password-rule-icon {
      width: 14px;
      text-align: center;
      font-weight: 900;
    }


    .password-match {
      margin:
        -3px 4px
        12px;

      font-size: 10px;
      line-height: 1.35;

      color:
        var(--ion-color-medium);
    }

    .password-match.valid {
      color:
        var(--ion-color-success);
    }

    .password-match.invalid {
      color:
        var(--ion-color-danger);
    }

  `],

  template: `

<ion-content>


  <div
    class="auth-shell"
    style="justify-content:flex-start">


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
      Create your account
    </h1>


    <p class="muted">
      Join SmileHub and keep your
      clinic essentials within reach.
    </p>



    <form
      (ngSubmit)="signup()">



      <!-- FULL NAME -->

      <ion-item
        class="input-card"
        lines="none">


        <ion-input
          label="Full name"
          labelPlacement="stacked"

          autocomplete="name"

          placeholder="Juan Dela Cruz"

          [(ngModel)]="fullName"

          name="fullName"

          [disabled]="creatingAccount"

          required>
        </ion-input>


      </ion-item>



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

          [disabled]="creatingAccount"

          required>
        </ion-input>


      </ion-item>



      <!-- MOBILE -->

      <ion-item
        class="input-card"
        lines="none">


        <ion-input
          label="Mobile number"
          labelPlacement="stacked"

          type="tel"

          inputmode="numeric"

          autocomplete="tel"

          maxlength="11"

          placeholder="09XXXXXXXXX"

          [(ngModel)]="mobile"

          name="mobile"

          [disabled]="creatingAccount"

          required>
        </ion-input>


      </ion-item>


      <div class="auth-note">

        Enter a valid Philippine mobile
        number such as 09123456789.

      </div>



      <!-- PASSWORD -->

      <ion-item
        class="input-card"
        lines="none">


        <ion-input
          label="Password"
          labelPlacement="stacked"

          type="password"

          autocomplete="new-password"

          [(ngModel)]="password"

          name="password"

          [disabled]="creatingAccount"

          required>
        </ion-input>


      </ion-item>


      <div class="password-rules">


        <div
          class="password-rule"

          [class.valid]="
            password.length >= 8
          "

          [class.invalid]="
            password.length > 0 &&
            password.length < 8
          "

          [class.neutral]="
            password.length === 0
          ">

          <span class="password-rule-icon">

            {{
              password.length >= 8
                ? '✓'
                : '•'
            }}

          </span>

          At least 8 characters

        </div>



        <div
          class="password-rule"

          [class.valid]="hasUppercase"

          [class.invalid]="
            password.length > 0 &&
            !hasUppercase
          "

          [class.neutral]="
            password.length === 0
          ">

          <span class="password-rule-icon">

            {{
              hasUppercase
                ? '✓'
                : '•'
            }}

          </span>

          At least 1 uppercase letter

        </div>



        <div
          class="password-rule"

          [class.valid]="hasLowercase"

          [class.invalid]="
            password.length > 0 &&
            !hasLowercase
          "

          [class.neutral]="
            password.length === 0
          ">

          <span class="password-rule-icon">

            {{
              hasLowercase
                ? '✓'
                : '•'
            }}

          </span>

          At least 1 lowercase letter

        </div>



        <div
          class="password-rule"

          [class.valid]="hasNumber"

          [class.invalid]="
            password.length > 0 &&
            !hasNumber
          "

          [class.neutral]="
            password.length === 0
          ">

          <span class="password-rule-icon">

            {{
              hasNumber
                ? '✓'
                : '•'
            }}

          </span>

          At least 1 number

        </div>


      </div>



      <!-- CONFIRM PASSWORD -->

      <ion-item
        class="input-card"
        lines="none">


        <ion-input
          label="Confirm password"
          labelPlacement="stacked"

          type="password"

          autocomplete="new-password"

          [(ngModel)]="confirmPassword"

          name="confirmPassword"

          [disabled]="creatingAccount"

          required>
        </ion-input>


      </ion-item>


      <div
        class="password-match"

        *ngIf="
          confirmPassword.length > 0
        "

        [class.valid]="
          passwordsMatch
        "

        [class.invalid]="
          !passwordsMatch
        ">

        {{
          passwordsMatch
            ? '✓ Passwords match.'
            : 'Passwords do not match.'
        }}

      </div>



      <!-- CREATE ACCOUNT -->

      <ion-button
        expand="block"

        class="primary-btn"

        type="submit"

        [disabled]="
          creatingAccount ||
          !canSubmit
        ">


        <ion-spinner
          *ngIf="creatingAccount"

          slot="start"

          name="crescent">
        </ion-spinner>


        <ion-icon
          *ngIf="!creatingAccount"

          slot="start"

          name="person-add-outline">
        </ion-icon>


        {{
          creatingAccount
            ? 'Creating Account...'
            : 'Create Account'
        }}


      </ion-button>


    </form>



    <!-- LOGIN -->

    <div class="signin-row">

      Already have an account?

      <span
        class="signin-link"

        (click)="openLogin()">

        Sign in

      </span>

    </div>


  </div>


</ion-content>

`
})


export class SignupPage {


  fullName =
    '';


  email =
    '';


  mobile =
    '';


  password =
    '';


  confirmPassword =
    '';


  creatingAccount =
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
     SIGN UP
     ========================= */

  async signup():
    Promise<void> {


    if (this.creatingAccount) {

      return;

    }


    const cleanName =
      this.fullName.trim();


    const cleanEmail =
      this.email
        .trim()
        .toLowerCase();


    const cleanMobile =
      this.mobile
        .replace(/\D/g, '');


    const cleanPassword =
      this.password;



    /* REQUIRED FIELDS */

    if (
      !cleanName
      ||
      !cleanEmail
      ||
      !cleanMobile
      ||
      !cleanPassword
      ||
      !this.confirmPassword
    ) {


      await this.message(
        'Complete all required fields.'
      );


      return;

    }



    /* NAME */

    if (
      cleanName.length < 2
    ) {


      await this.message(
        'Enter your full name.'
      );


      return;

    }



    /* EMAIL */

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



    /* MOBILE */

    if (
      !/^09\d{9}$/
        .test(cleanMobile)
    ) {


      await this.message(
        'Enter a valid 11-digit Philippine mobile number.'
      );


      return;

    }



    /* PASSWORD */

    if (
      !this.validPassword(
        cleanPassword
      )
    ) {


      await this.message(
        'Password must be at least 8 characters and include an uppercase letter, lowercase letter, and number.'
      );


      return;

    }



    /* CONFIRM PASSWORD */

    if (
      cleanPassword !==
      this.confirmPassword
    ) {


      await this.message(
        'Passwords do not match.'
      );


      return;

    }



    this.creatingAccount =
      true;


    const loader =
      await this.loading
        .create({

          message:
            'Creating account...',

          spinner:
            'crescent'

        });


    await loader.present();



    try {


      await this.auth.signUp(

        cleanName,

        cleanEmail,

        cleanMobile,

        cleanPassword

      );


      this.password =
        '';


      this.confirmPassword =
        '';


      await this.router
        .navigateByUrl(

          '/home',

          {
            replaceUrl: true
          }

        );


    } catch (error: any) {


      console.error(
        'Unable to create account:',
        error
      );


      await this.message(

        this.errorMessage(
          error?.code
        )

      );


    } finally {


      this.creatingAccount =
        false;


      try {

        await loader.dismiss();

      } catch (_) {}

    }

  }



  /* =========================
     LOGIN
     ========================= */

  openLogin():
    void {


    void this.router
      .navigate(
        ['/login']
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
      .test(email);

  }



  /* =========================
     PASSWORD VALIDATION
     ========================= */

  get hasUppercase():
    boolean {


    return /[A-Z]/
      .test(
        this.password
      );

  }



  get hasLowercase():
    boolean {


    return /[a-z]/
      .test(
        this.password
      );

  }



  get hasNumber():
    boolean {


    return /\d/
      .test(
        this.password
      );

  }



  get passwordsMatch():
    boolean {


    return (
      this.password.length > 0
      &&
      this.password ===
        this.confirmPassword
    );

  }



  get passwordValid():
    boolean {


    return this.validPassword(
      this.password
    );

  }



  get canSubmit():
    boolean {


    const cleanName =
      this.fullName
        .trim();


    const cleanEmail =
      this.email
        .trim()
        .toLowerCase();


    const cleanMobile =
      this.mobile
        .replace(
          /\D/g,
          ''
        );


    return (

      cleanName.length >= 2

      &&

      this.validEmail(
        cleanEmail
      )

      &&

      /^09\d{9}$/
        .test(
          cleanMobile
        )

      &&

      this.passwordValid

      &&

      this.passwordsMatch

    );

  }



  private validPassword(
    password: string
  ):
    boolean {


    return (

      password.length >= 8

      &&

      /[A-Z]/
        .test(
          password
        )

      &&

      /[a-z]/
        .test(
          password
        )

      &&

      /\d/
        .test(
          password
        )

    );

  }



  /* =========================
     FIREBASE ERRORS
     ========================= */

  private errorMessage(
    code: string
  ):
    string {


    switch (code) {


      case 'auth/email-already-in-use':

        return 'An account already uses this email.';


      case 'auth/invalid-email':

        return 'Enter a valid email address.';


      case 'auth/weak-password':

        return 'Please use a stronger password.';


      case 'auth/operation-not-allowed':

        return 'Email and password registration is currently unavailable.';


      case 'auth/network-request-failed':

        return 'Unable to connect. Check your internet connection.';


      case 'auth/too-many-requests':

        return 'Too many attempts. Please try again later.';


      default:

        return 'Unable to create account. Please try again.';

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