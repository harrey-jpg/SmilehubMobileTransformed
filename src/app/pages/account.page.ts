import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import {
  IonicModule,
  AlertController
} from '@ionic/angular';

import { CommonModule } from '@angular/common';

import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { ProfilePhotoService } from '../services/profile-photo.service';
import { AppStateService } from '../services/app-state.service';
import { BottomNavComponent } from '../shared/bottom-nav.component';


@Component({
  selector: 'app-account',
  standalone: true,

  imports: [
    RouterModule,
    IonicModule,
    CommonModule,
    BottomNavComponent
  ],

  styles: [`

    /* =========================
       PROFILE
       ========================= */

    .profile-card {
      display: flex;
      align-items: center;

      gap: 14px;

      padding: 18px;
    }


    .profile-avatar-shell {
      position: relative;

      flex-shrink: 0;

      cursor: pointer;
    }


    .profile-avatar {
      width: 68px;
      height: 68px;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;

      border-radius: 50%;

      background:
        rgba(var(--ion-color-primary-rgb), .14);

      color:
        var(--ion-color-primary);

      font-size: 23px;
      font-weight: 900;

      text-transform: uppercase;

      border:
        2px solid
        rgba(var(--ion-color-primary-rgb), .18);
    }


    .profile-avatar img {
      width: 100%;
      height: 100%;

      display: block;

      object-fit: cover;
    }


    .profile-avatar-edit {
      position: absolute;

      right: -2px;
      bottom: -1px;

      width: 24px;
      height: 24px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background:
        var(--ion-color-primary);

      color:
        var(--ion-color-primary-contrast);

      border:
        2px solid
        var(--ion-background-color);

      font-size: 13px;
    }


    .profile-info {
      flex: 1;
      min-width: 0;
    }


    .profile-name {
      margin: 0;

      font-size: 19px;
      font-weight: 900;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    .profile-email {
      margin-top: 4px;

      font-size: 12px;

      color:
        var(--ion-color-medium);

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }


    .profile-label {
      margin-top: 5px;

      font-size: 10px;
      font-weight: 800;

      color:
        var(--ion-color-primary);
    }


    /* =========================
       SECTION
       ========================= */

    .account-section-title {
      margin:
        20px 2px
        9px;

      font-size: 14px;
      font-weight: 900;
    }


    /* =========================
       MENU
       ========================= */

    .account-menu {
      overflow: hidden;

      border-radius: 16px;

      background:
        var(--ion-card-background);
    }


    .account-item {
      min-height: 58px;

      display: flex;
      align-items: center;

      gap: 12px;

      padding:
        10px 14px;

      cursor: pointer;

      border-bottom:
        1px solid
        rgba(120, 120, 120, .10);
    }


    .account-item:last-child {
      border-bottom: none;
    }


    .account-item:active {
      opacity: .8;
    }


    .account-icon {
      width: 38px;
      height: 38px;

      flex-shrink: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 11px;

      background:
        rgba(var(--ion-color-primary-rgb), .11);

      color:
        var(--ion-color-primary);

      font-size: 20px;
    }


    .account-content {
      flex: 1;
      min-width: 0;
    }


    .account-title {
      font-size: 13px;
      font-weight: 850;
    }


    .account-subtitle {
      margin-top: 2px;

      font-size: 10px;

      color:
        var(--ion-color-medium);
    }


    .account-arrow {
      flex-shrink: 0;

      color:
        var(--ion-color-medium);

      font-size: 18px;
    }


    /* =========================
       BADGE
       ========================= */

    .menu-badge {
      min-width: 22px;

      padding:
        4px 7px;

      border-radius: 999px;

      background:
        var(--ion-color-danger);

      color: white;

      text-align: center;

      font-size: 9px;
      font-weight: 900;
    }


    /* =========================
       DARK MODE
       ========================= */

    .toggle-item {
      cursor: default;
    }


    .toggle-item:active {
      opacity: 1;
    }


    /* =========================
       LOGOUT
       ========================= */

    .logout-button {
      margin-top: 22px;

      --border-radius: 13px;

      font-weight: 800;
    }


    /* =========================
       LOADING
       ========================= */

    .profile-loading {
      display: flex;
      align-items: center;

      gap: 8px;

      color:
        var(--ion-color-medium);

      font-size: 12px;
    }

  `],

  template: `

<ion-header>

  <ion-toolbar>

    <ion-title>
      Account
    </ion-title>

  </ion-toolbar>

</ion-header>



<ion-content>

<div class="page-wrap">


  <!-- =========================
       PROFILE CARD
       ========================= -->

  <div class="app-card profile-card">


    <div
      class="profile-avatar-shell"
      routerLink="/personal-information">


      <div class="profile-avatar">


        <img
          *ngIf="profilePhoto"

          [src]="profilePhoto"

          alt="Profile photo">


        <span
          *ngIf="!profilePhoto">

          {{ initials }}

        </span>


      </div>


      <div class="profile-avatar-edit">

        <ion-icon
          name="create-outline">
        </ion-icon>

      </div>


    </div>


    <div class="profile-info">


      <div
        class="profile-loading"
        *ngIf="loadingProfile">

        <ion-spinner
          name="crescent"
          style="width:16px;height:16px">
        </ion-spinner>

        Loading profile...

      </div>


      <ng-container *ngIf="!loadingProfile">


        <h2 class="profile-name">

          {{
            profile.fullName ||
            'SmileHub Customer'
          }}

        </h2>


        <div class="profile-email">

          {{
            profile.email ||
            auth.currentUser?.email ||
            'Signed in customer'
          }}

        </div>


        <div class="profile-label">

          SmileHub Member

        </div>


      </ng-container>


    </div>

<ion-button
  fill="clear"
  size="small"
  routerLink="/personal-information">

  <ion-icon
    name="chevron-forward-outline">
  </ion-icon>

</ion-button>

  </div>



  <!-- =========================
       MY ACCOUNT
       ========================= -->

  <div class="account-section-title">

    My Account

  </div>


  <div class="account-menu">


    <!-- PERSONAL INFORMATION -->

    <div
      class="account-item"
      routerLink="/personal-information">


      <div class="account-icon">

        <ion-icon
          name="person-outline">
        </ion-icon>

      </div>


      <div class="account-content">

        <div class="account-title">

          Personal Information

        </div>

        <div class="account-subtitle">

          Manage your profile details

        </div>

      </div>


      <ion-icon
        class="account-arrow"
        name="chevron-forward-outline">
      </ion-icon>


    </div>



    <!-- MY ORDERS -->

    <div
      class="account-item"
      routerLink="/orders">


      <div class="account-icon">

        <ion-icon
          name="cart-outline">
        </ion-icon>

      </div>


      <div class="account-content">

        <div class="account-title">

          My Orders

        </div>

        <div class="account-subtitle">

          Track and review your purchases

        </div>

      </div>


      <ion-icon
        class="account-arrow"
        name="chevron-forward-outline">
      </ion-icon>


    </div>



    <!-- ADDRESSES -->

    <div
      class="account-item"
      routerLink="/addresses">


      <div class="account-icon">

        <ion-icon
          name="location-outline">
        </ion-icon>

      </div>


      <div class="account-content">

        <div class="account-title">

          Addresses

        </div>

        <div class="account-subtitle">

          Manage shipping addresses

        </div>

      </div>


      <ion-icon
        class="account-arrow"
        name="chevron-forward-outline">
      </ion-icon>


    </div>



    <!-- PAYMENT METHODS -->

    <div
      class="account-item"
      routerLink="/payments">


      <div class="account-icon">

        <ion-icon
          name="card-outline">
        </ion-icon>

      </div>


      <div class="account-content">

        <div class="account-title">

          Payment Methods

        </div>

        <div class="account-subtitle">

          Manage your payment options

        </div>

      </div>


      <ion-icon
        class="account-arrow"
        name="chevron-forward-outline">
      </ion-icon>


    </div>



    <!-- WISHLIST -->

    <div
      class="account-item"
      routerLink="/wishlist">


      <div class="account-icon">

        <ion-icon
          name="heart-outline">
        </ion-icon>

      </div>


      <div class="account-content">

        <div class="account-title">

          Wishlist

        </div>

        <div class="account-subtitle">

          Your saved dental supplies

        </div>

      </div>


      <span
        class="menu-badge"
        *ngIf="state.wishlist.size > 0">

        {{ badgeText(state.wishlist.size) }}

      </span>


      <ion-icon
        class="account-arrow"
        name="chevron-forward-outline">
      </ion-icon>


    </div>


  </div>



  <!-- =========================
       SETTINGS & SUPPORT
       ========================= -->

  <div class="account-section-title">

    Settings & Support

  </div>


  <div class="account-menu">


    <!-- DARK MODE -->

    <div class="account-item toggle-item">


      <div class="account-icon">

        <ion-icon
          [name]="
            state.darkMode
              ? 'moon-outline'
              : 'sunny-outline'
          ">
        </ion-icon>

      </div>


      <div class="account-content">

        <div class="account-title">

          Dark Mode

        </div>

        <div class="account-subtitle">

          {{
            state.darkMode
              ? 'Dark theme enabled'
              : 'Light theme enabled'
          }}

        </div>

      </div>


      <ion-toggle
        [checked]="state.darkMode"

        (ionChange)="
          state.toggleTheme(
            $event.detail.checked
          )
        ">
      </ion-toggle>


    </div>



    <!-- HELP -->

    <div
      class="account-item"
      routerLink="/help">


      <div class="account-icon">

        <ion-icon
          name="help-circle-outline">
        </ion-icon>

      </div>


      <div class="account-content">

        <div class="account-title">

          Help & Support

        </div>

        <div class="account-subtitle">

          FAQs and common questions

        </div>

      </div>


      <ion-icon
        class="account-arrow"
        name="chevron-forward-outline">
      </ion-icon>


    </div>



    <!-- CONTACT SUPPORT -->

    <div
      class="account-item"
      (click)="openContactSupport()">


      <div class="account-icon">

        <ion-icon
          name="headset-outline">
        </ion-icon>

      </div>


      <div class="account-content">

        <div class="account-title">

          Contact Support

        </div>

        <div class="account-subtitle">

          Get help from SmileHub

        </div>

      </div>


      <ion-icon
        class="account-arrow"
        name="chevron-forward-outline">
      </ion-icon>


    </div>


  </div>



  <!-- =========================
       LOGOUT
       ========================= -->

  <ion-button
    class="logout-button"

    expand="block"

    fill="outline"

    color="danger"

    [disabled]="loggingOut"

    (click)="logout()">


    <ion-spinner
      *ngIf="loggingOut"
      slot="start"
      name="crescent">
    </ion-spinner>


    <ion-icon
      *ngIf="!loggingOut"
      slot="start"
      name="log-out-outline">
    </ion-icon>


    {{
      loggingOut
        ? 'Signing Out...'
        : 'Sign Out'
    }}


  </ion-button>


</div>

</ion-content>



<ion-footer>

  <app-bottom-nav
    active="account">
  </app-bottom-nav>

</ion-footer>

`
})


export class AccountPage {


  profile: any = {};


  loadingProfile = true;


  loggingOut = false;


  profilePhoto = '';



  constructor(

    public auth:
      AuthService,

    private profiles:
      ProfileService,

    private profilePhotos:
      ProfilePhotoService,

    public state:
      AppStateService,

    private router:
      Router,

    private alerts:
      AlertController

  ) {}



  /* =========================
     LOAD PROFILE
     ========================= */

  async ionViewWillEnter():
    Promise<void> {


    this.loadingProfile = true;


    try {


      this.profile =
        await this.profiles.loadProfile();


      if (!this.profile) {

        this.profile = {};

      }


      if (
        !this.profile.email
      ) {

        this.profile.email =
          this.auth.currentUser?.email || '';

      }


      this.profilePhoto =
        await this.profilePhotos
          .loadProfilePhoto();


    } catch (error) {


      console.error(
        'Unable to load profile:',
        error
      );


      this.profile = {

        email:
          this.auth.currentUser?.email || ''

      };


      this.profilePhoto = '';


    } finally {


      this.loadingProfile = false;

    }

  }



  /* =========================
     INITIALS
     ========================= */

  get initials():
    string {


    const fullName =
      String(
        this.profile?.fullName || ''
      ).trim();


    if (fullName) {


      const parts =
        fullName
          .split(/\s+/)
          .filter(Boolean);


      if (
        parts.length >= 2
      ) {


        return (
          parts[0][0] +
          parts[parts.length - 1][0]
        ).toUpperCase();

      }


      return fullName
        .substring(0, 2)
        .toUpperCase();

    }


    const email =
      String(
        this.profile?.email ||
        this.auth.currentUser?.email ||
        'SH'
      );


    return email
      .substring(0, 2)
      .toUpperCase();

  }



  /* =========================
     CONTACT SUPPORT
     ========================= */

  openContactSupport():
    void {


    this.router.navigateByUrl(
      '/contact-support'
    );

  }



  /* =========================
     LOGOUT
     ========================= */

  async logout():
    Promise<void> {


    if (this.loggingOut) {

      return;

    }


    const alert =
      await this.alerts.create({


        header:
          'Sign out?',


        message:
          'You can sign in again anytime.',


        buttons: [


          {
            text:
              'Cancel',

            role:
              'cancel'
          },


          {
            text:
              'Sign Out',

            role:
              'destructive',

            handler:
              () => {

                void this.performLogout();

              }
          }


        ]


      });


    await alert.present();

  }



  /* =========================
     PERFORM LOGOUT
     ========================= */

  private async performLogout():
    Promise<void> {


    this.loggingOut = true;


    try {


      await this.auth.signOut();


      await this.router.navigateByUrl(

        '/login',

        {
          replaceUrl: true
        }

      );


    } catch (error: any) {


      console.error(
        'Unable to sign out:',
        error
      );


      const alert =
        await this.alerts.create({


          header:
            'Unable to sign out',


          message:
            error?.message ||
            'Please try again.',


          buttons: [
            'OK'
          ]


        });


      await alert.present();


    } finally {


      this.loggingOut = false;

    }

  }



  /* =========================
     BADGE
     ========================= */

  badgeText(
    value: number
  ): string {


    return value > 99
      ? '99+'
      : String(value);

  }


}