import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import {
  IonicModule,
  AlertController
} from '@ionic/angular';

import { CommonModule } from '@angular/common';

import { firebaseAuth } from '../services/firebase';
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
       PAGE
       ========================= */

    .ac-page {
      padding-bottom: 26px;
    }


    /* =========================
       INTRO
       ========================= */

    .ac-intro {
      margin-bottom: 13px;
    }

    .ac-kicker {
      color: var(--ion-color-primary);
      font-size:14px;
      font-weight: 600;
      letter-spacing: .8px;
      text-transform: uppercase;
    }

    .ac-title {
      margin: 4px 0 0;
      font-size: 22px;
      font-weight: 600;
      line-height: 1.2;
    }


    /* =========================
       PROFILE HERO
       ========================= */

    .ac-profile {
      position: relative;
      overflow: hidden;

      display: flex;
      align-items: center;

      gap: 14px;

      padding: 18px;

      border-radius: 22px;

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

    .ac-profile::after {
      content: '';

      position: absolute;

      width: 130px;
      height: 130px;

      right: -60px;
      top: -65px;

      border-radius: 50%;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .06
        );

      pointer-events: none;
    }


    /* =========================
       AVATAR
       ========================= */

    .ac-avatar-shell {
      position: relative;
      z-index: 1;

      flex-shrink: 0;

      cursor: pointer;
    }

    .ac-avatar {
      width: 76px;
      height: 76px;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;

      border-radius: 22px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .15
        );

      color:
        var(--ion-color-primary);

      border:
        2px solid
        rgba(
          var(--ion-color-primary-rgb),
          .20
        );

      font-size: 24px;
      font-weight: 600;

      text-transform: uppercase;
    }

    .ac-avatar img {
      width: 100%;
      height: 100%;

      display: block;

      object-fit: cover;
    }

    .ac-avatar-edit {
      position: absolute;

      right: -3px;
      bottom: -3px;

      width: 27px;
      height: 27px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background:
        var(--ion-color-primary);

      color:
        var(--ion-color-primary-contrast);

      border:
        3px solid
        var(--ion-background-color);

      font-size:14px;
    }


    /* =========================
       PROFILE INFO
       ========================= */

    .ac-profile-info {
      position: relative;
      z-index: 1;

      flex: 1;
      min-width: 0;
    }

    .ac-profile-name {
      margin: 0;

      color:
        var(--ion-text-color);

      font-size: 18px;
      line-height: 1.25;

      font-weight: 600;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ac-profile-email {
      margin-top: 4px;

      color:
        var(--ion-color-medium);

      font-size:14px;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ac-member-chip {
      width: fit-content;

      display: inline-flex;
      align-items: center;

      gap: 5px;

      margin-top: 7px;

      padding:
        5px 8px;

      border-radius: 999px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      color:
        var(--ion-color-primary);

      font-size:14px;
      font-weight: 600;
    }

    .ac-member-dot {
      width: 5px;
      height: 5px;

      border-radius: 50%;

      background:
        var(--ion-color-primary);
    }

    .ac-profile-arrow {
      position: relative;
      z-index: 1;

      flex-shrink: 0;

      color:
        var(--ion-color-medium);

      font-size: 19px;
    }

    .ac-profile-loading {
      display: flex;
      align-items: center;

      gap: 8px;

      color:
        var(--ion-color-medium);

      font-size:14px;
    }


    /* =========================
       SECTION
       ========================= */

    .ac-section-title {
      margin:
        22px 2px
        9px;

      color:
        var(--ion-text-color);

      font-size:14px;
      font-weight: 600;
    }


    /* =========================
       MENU CARD
       ========================= */

    .ac-menu {
      overflow: hidden;

      border-radius: 18px;

      background:
        var(--ion-card-background);

      box-shadow:
        0 8px 22px
        rgba(
          0,
          0,
          0,
          .05
        );
    }

    .ac-item {
      position: relative;

      min-height: 64px;

      display: flex;
      align-items: center;

      gap: 12px;

      padding:
        11px 14px;

      border-bottom:
        1px solid
        rgba(
          120,
          120,
          120,
          .09
        );

      cursor: pointer;

      transition:
        background .15s ease,
        transform .15s ease;
    }

    .ac-item:last-child {
      border-bottom: none;
    }

    .ac-item:active {
      transform:
        scale(.99);

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .04
        );
    }


    /* =========================
       ICON
       ========================= */

    .ac-icon {
      width: 42px;
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

      color:
        var(--ion-color-primary);

      font-size: 20px;
    }

    /* =========================
       MENU CONTENT
       ========================= */

    .ac-item-content {
      flex: 1;
      min-width: 0;
    }

    .ac-item-title {
      color:
        var(--ion-text-color);

      font-size:14px;
      font-weight: 600;
    }

    .ac-item-subtitle {
      margin-top: 3px;

      color:
        var(--ion-color-medium);

      font-size:14px;
      font-weight: 400;
      line-height: 1.5;
    }

    .ac-arrow {
      flex-shrink: 0;

      color:
        var(--ion-color-medium);

      font-size: 18px;
    }


    /* =========================
       BADGE
       ========================= */

    .ac-badge {
      min-width: 22px;

      padding:
        4px 7px;

      border-radius: 999px;

      background:
        var(--ion-color-danger);

      color: #ffffff;

      text-align: center;

      font-size:14px;
      font-weight: 600;
    }


    /* =========================
       TOGGLE
       ========================= */

    .ac-toggle-item {
      cursor: default;
    }

    .ac-toggle-item:active {
      transform: none;
      background: transparent;
    }

    .ac-toggle-item ion-toggle {
      flex-shrink: 0;

      transform:
        scale(.88);

      transform-origin:
        right center;
    }


    /* =========================
       SIGN OUT
       ========================= */

    .ac-signout {
      margin-top: 22px;
    }

    .ac-signout ion-button {
      min-height: 46px;

      margin: 0;

      --border-radius: 14px;

      font-size:14px;
      font-weight: 600;
    }

    .ac-version {
      margin-top: 14px;

      text-align: center;

      color:
        var(--ion-color-medium);

      font-size:14px;
    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (min-width: 720px) {

      .ac-layout {
        display: grid;

        grid-template-columns:
          minmax(
            0,
            1fr
          )
          minmax(
            0,
            1fr
          );

        gap: 18px;
      }

      .ac-layout
      .ac-section-title {
        margin-top: 22px;
      }

    }


    @media (max-width: 380px) {

      .ac-profile {
        padding: 15px;
        gap: 11px;
      }

      .ac-avatar {
        width: 67px;
        height: 67px;

        border-radius: 19px;
      }

      .ac-profile-name {
        font-size: 16px;
      }

    }


.ac-page { max-width: 820px; }
    a.ac-profile { text-decoration: none; color: inherit; }
    .ac-profile-name, .ac-profile-email { overflow-wrap: anywhere; }
    .ac-profile:focus-visible, .ac-item:focus-visible { outline: 2px solid var(--ion-color-primary); outline-offset: 4px; }
    .ac-signout { display: flex; justify-content: center; }
    .ac-guest-actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
button.ac-item { width:100%; text-align:left; font:inherit; color:var(--ion-text-color); background:transparent; border:0; min-height:44px; }
`],


  template: `

<ion-header>

  <ion-toolbar>

    <ion-buttons slot="start">

      <ion-menu-button
        menu="main-menu"
        aria-label="Open navigation menu">
      </ion-menu-button>

    </ion-buttons>

    <ion-title>
      Account
    </ion-title>

  </ion-toolbar>

</ion-header>



<ion-content>


  <div class="page-wrap ac-page">


    <!-- =========================
         INTRO
         ========================= -->

    <div class="ac-intro">





      <h1 class="ac-title">

        Your Account

      </h1>


    </div>



    <!-- =========================
         PROFILE
         ========================= -->

    <a
      class="ac-profile"
      [routerLink]="auth.currentUser ? '/personal-information' : '/login'"
      [attr.aria-label]="auth.currentUser ? 'Edit your profile' : 'Sign in to SmileHub'">


      <div class="ac-avatar-shell">


        <div class="ac-avatar">


          <img
            *ngIf="profilePhoto"
            [src]="profilePhoto"
            alt="Profile photo">


          <span
            *ngIf="!profilePhoto">

            {{ initials }}

          </span>


        </div>


        <div class="ac-avatar-edit">

          <ion-icon
            name="create-outline">
          </ion-icon>

        </div>


      </div>



      <div class="ac-profile-info">


        <div
          class="ac-profile-loading"
          *ngIf="loadingProfile">


          <ion-spinner
            name="crescent"
            style="
              width:16px;
              height:16px
            ">
          </ion-spinner>


          Loading profile...


        </div>



        <ng-container
          *ngIf="!loadingProfile">


          <h2 class="ac-profile-name">

            {{
              profile.fullName
              ||
              auth.currentUser?.displayName || (auth.currentUser ? 'SmileHub Customer' : 'Guest')
            }}

          </h2>


          <div class="ac-profile-email">

            {{
              profile.email
              ||
              auth.currentUser?.email
              ||
              (auth.currentUser ? 'View your profile' : 'Sign in to manage your account')
            }}

          </div>


          <div class="ac-member-chip" *ngIf="auth.currentUser">


            <span class="ac-member-dot">
            </span>


            SmileHub Member


          </div>


        </ng-container>


      </div>



      <ion-icon
        class="ac-profile-arrow"
        name="chevron-forward-outline">
      </ion-icon>


    </a>



    <!-- =========================
         ACCOUNT LAYOUT
         ========================= -->

    <div class="ac-layout">


      <!-- =========================
           MY ACCOUNT
           ========================= -->

      <div>


        <div class="ac-section-title">

          My Account

        </div>


        <div class="ac-menu">


          <!-- PERSONAL INFO -->

          <a
            class="ac-item"
            routerLink="/personal-information">


            <div class="ac-icon">

              <ion-icon
                name="person-outline">
              </ion-icon>

            </div>


            <div class="ac-item-content">


              <div class="ac-item-title">

                Personal Information

              </div>


              <div class="ac-item-subtitle">

                Manage your profile details

              </div>


            </div>


            <ion-icon
              class="ac-arrow"
              name="chevron-forward-outline">
            </ion-icon>


          </a>



          <!-- ORDERS -->





          <!-- ADDRESSES -->

          <a
            class="ac-item"
            routerLink="/addresses">


            <div class="ac-icon address">

              <ion-icon
                name="location-outline">
              </ion-icon>

            </div>


            <div class="ac-item-content">


              <div class="ac-item-title">

                Addresses

              </div>


              <div class="ac-item-subtitle">

                Manage your shipping addresses

              </div>


            </div>


            <ion-icon
              class="ac-arrow"
              name="chevron-forward-outline">
            </ion-icon>


          </a>



          <!-- PAYMENT -->

          <a
            class="ac-item"
            routerLink="/payments">


            <div class="ac-icon payment">

              <ion-icon
                name="card-outline">
              </ion-icon>

            </div>


            <div class="ac-item-content">


              <div class="ac-item-title">

                Payment Methods

              </div>


              <div class="ac-item-subtitle">

                Manage your payment options

              </div>


            </div>


            <ion-icon
              class="ac-arrow"
              name="chevron-forward-outline">
            </ion-icon>


          </a>



          <!-- WISHLIST -->

</div>
<h2 class="ac-section-title">Shopping</h2>
<div class="ac-menu">
          <a
            class="ac-item"
            routerLink="/orders">


            <div class="ac-icon orders">

              <ion-icon
                name="receipt-outline">
              </ion-icon>

            </div>


            <div class="ac-item-content">


              <div class="ac-item-title">

                My Orders

              </div>


              <div class="ac-item-subtitle">

                Track and review your purchases

              </div>


            </div>


            <ion-icon
              class="ac-arrow"
              name="chevron-forward-outline">
            </ion-icon>


          </a>
          <a
            class="ac-item"
            routerLink="/wishlist">


            <div class="ac-icon wishlist">

              <ion-icon
                name="heart-outline">
              </ion-icon>

            </div>


            <div class="ac-item-content">


              <div class="ac-item-title">

                Wishlist

              </div>


              <div class="ac-item-subtitle">

                Your saved dental supplies

              </div>


            </div>


            <span
              class="ac-badge"
              *ngIf="
                state.wishlist.size > 0
              ">

              {{
                badgeText(
                  state.wishlist.size
                )
              }}

            </span>


            <ion-icon
              class="ac-arrow"
              name="chevron-forward-outline">
            </ion-icon>


          </a>


        </div>


      </div>



      <!-- =========================
           SETTINGS
           ========================= -->

      <div>


        <div class="ac-section-title">

          Settings & Support

        </div>


        <div class="ac-menu">


          <!-- DARK MODE -->

          <div
            class="
              ac-item
              ac-toggle-item
            ">


            <div class="ac-icon">


              <ion-icon
                [name]="
                  state.darkMode
                    ? 'moon-outline'
                    : 'sunny-outline'
                ">
              </ion-icon>


            </div>


            <div class="ac-item-content">


              <div class="ac-item-title">

                Dark Mode

              </div>


              <div class="ac-item-subtitle">

                {{
                  state.darkMode
                    ? 'Dark theme enabled'
                    : 'Light theme enabled'
                }}

              </div>


            </div>


            <ion-toggle aria-label="Dark mode"
              [checked]="state.darkMode"
              (ionChange)="
                state.toggleTheme(
                  $event.detail.checked
                )
              ">
            </ion-toggle>


          </div>



          <!-- HELP -->

          <a
            class="ac-item"
            routerLink="/help">


            <div class="ac-icon support">

              <ion-icon
                name="help-circle-outline">
              </ion-icon>

            </div>


            <div class="ac-item-content">


              <div class="ac-item-title">

                Help & Support

              </div>


              <div class="ac-item-subtitle">

                FAQs and common questions

              </div>


            </div>


            <ion-icon
              class="ac-arrow"
              name="chevron-forward-outline">
            </ion-icon>


          </a>



          <!-- CONTACT -->

          <button type="button"
            class="ac-item"
            (click)="openContactSupport()">


            <div class="ac-icon support">

              <ion-icon
                name="headset-outline">
              </ion-icon>

            </div>


            <div class="ac-item-content">


              <div class="ac-item-title">

                Contact Support

              </div>


              <div class="ac-item-subtitle">

                Get help from the SmileHub team

              </div>


            </div>


            <ion-icon
              class="ac-arrow"
              name="chevron-forward-outline">
            </ion-icon>


          </button>


        </div>


      </div>


    </div>



    <!-- =========================
         SIGN OUT
         ========================= -->

    <div class="ac-signout" *ngIf="auth.currentUser; else guestActions">


      <ion-button
        expand="block"
        fill="clear"
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

    <ng-template #guestActions>
      <div class="ac-guest-actions">
        <ion-button routerLink="/login">Sign In</ion-button>
        <ion-button fill="outline" routerLink="/signup">Create Account</ion-button>
      </div>
    </ng-template>


    <div class="ac-version">

      SmileHub • Dental Supplies Marketplace

    </div>


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


  profile:
    any =
    {};


  loadingProfile =
    true;


  loggingOut =
    false;


  profilePhoto =
    '';



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

  private profileRequest = 0;

  async ionViewWillEnter(): Promise<void> {
    const request = ++this.profileRequest;
    this.loadingProfile = true;
    this.profile = {};
    this.profilePhoto = '';
    await firebaseAuth.authStateReady();
    const user = this.auth.currentUser;
    const isCurrent = () => request === this.profileRequest
      && this.auth.currentUser?.uid === user?.uid;
    try {
      if (!user) return;
      const profile = await this.profiles.loadProfile();
      if (!isCurrent()) return;
      this.profile = {
        ...profile,
        fullName: profile?.fullName || user.displayName || '',
        email: user.email || profile?.email || ''
      };
      const photo = await this.profilePhotos.loadProfilePhoto();
      if (isCurrent()) this.profilePhoto = photo || '';
    } catch (error) {
      console.error('Unable to load profile:', error);
      if (isCurrent()) {
        this.profile = { fullName: user?.displayName || '', email: user?.email || '' };
        this.profilePhoto = '';
      }
    } finally {
      if (request === this.profileRequest) this.loadingProfile = false;
    }
  }

  /* =========================
     INITIALS
     ========================= */

  get initials():
    string {


    const fullName =
      String(
        this.profile
          ?.fullName
        ||
        ''
      )
        .trim();


    if (
      fullName
    ) {


      const parts =
        fullName
          .split(
            /\s+/
          )
          .filter(
            Boolean
          );


      if (
        parts.length >= 2
      ) {


        return (

          parts[0][0]

          +

          parts[
            parts.length - 1
          ][0]

        )
          .toUpperCase();


      }


      return fullName
        .substring(
          0,
          2
        )
        .toUpperCase();


    }


    const email =
      String(

        this.profile
          ?.email

        ||

        this.auth.currentUser
          ?.email

        ||

        'SH'

      );


    return email
      .substring(
        0,
        2
      )
      .toUpperCase();


  }



  /* =========================
     CONTACT SUPPORT
     ========================= */

  openContactSupport():
    void {


    void this.router
      .navigateByUrl(
        '/contact-support'
      );


  }



  /* =========================
     LOGOUT
     ========================= */

  async logout():
    Promise<void> {


    if (
      this.loggingOut
    ) {


      return;


    }


    const alert =
      await this.alerts
        .create({


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


                  void this
                    .performLogout();


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


    this.loggingOut =
      true;


    try {


      await this.auth
        .signOut();


      await this.router
        .navigateByUrl(

          '/login',

          {
            replaceUrl: true
          }

        );


    } catch (
      error: any
    ) {


      console.error(
        'Unable to sign out:',
        error
      );


      const alert =
        await this.alerts
          .create({


            header:
              'Unable to sign out',


            message:
              error?.message
              ||
              'Please try again.',


            buttons: [
              'OK'
            ]


          });


      await alert.present();


    } finally {


      this.loggingOut =
        false;


    }


  }



  /* =========================
     BADGE
     ========================= */

  badgeText(
    value: number
  ):
    string {


    return value > 99
      ? '99+'
      : String(
          value
        );


  }


}
