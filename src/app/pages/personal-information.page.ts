import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  IonicModule,
  AlertController,
  LoadingController
} from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ProfileService
} from '../services/profile.service';

import {
  ProfilePhotoService
} from '../services/profile-photo.service';


@Component({
  selector: 'app-personal-information',
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

    .pi-page {
      padding-bottom: 34px;
    }


    /* =========================
       INTRO
       ========================= */

    .pi-intro {
      margin-bottom: 16px;
    }

    .pi-kicker {
      color: var(--ion-color-primary);

      font-size: 9px;
      font-weight: 900;
      letter-spacing: .8px;

      text-transform: uppercase;
    }

    .pi-title {
      margin: 4px 0 5px;

      color: var(--ion-text-color);

      font-size: 22px;
      line-height: 1.2;
      font-weight: 900;
    }

    .pi-subtitle {
      max-width: 360px;

      margin: 0;

      color: var(--ion-color-medium);

      font-size: 10px;
      line-height: 1.5;
    }


    /* =========================
       PROFILE PHOTO
       ========================= */

    .pi-photo-card {
      position: relative;
      overflow: hidden;

      display: flex;
      align-items: center;

      gap: 15px;

      padding: 17px;

      border-radius: 20px;

      background:
        linear-gradient(
          135deg,
          rgba(
            var(--ion-color-primary-rgb),
            .14
          ),
          rgba(
            var(--ion-color-primary-rgb),
            .04
          )
        );

      border:
        1px solid
        rgba(
          var(--ion-color-primary-rgb),
          .11
        );
    }

    .pi-photo-card::after {
      content: '';

      position: absolute;

      width: 120px;
      height: 120px;

      right: -55px;
      top: -58px;

      border-radius: 50%;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .06
        );

      pointer-events: none;
    }

    .pi-photo-wrap {
      position: relative;
      z-index: 1;

      flex-shrink: 0;
    }

    .pi-photo {
      width: 82px;
      height: 82px;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;

      border-radius: 22px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .14
        );

      color: var(--ion-color-primary);

      border:
        2px solid
        rgba(
          var(--ion-color-primary-rgb),
          .19
        );

      font-size: 25px;
      font-weight: 900;

      text-transform: uppercase;
    }

    .pi-photo img {
      width: 100%;
      height: 100%;

      display: block;

      object-fit: cover;
    }

    .pi-photo-badge {
      position: absolute;

      right: -3px;
      bottom: -3px;

      width: 28px;
      height: 28px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background: var(--ion-color-primary);

      color: #ffffff;

      border:
        3px solid
        var(--ion-background-color);

      font-size: 13px;
    }

    .pi-photo-content {
      position: relative;
      z-index: 1;

      flex: 1;
      min-width: 0;
    }

    .pi-photo-title {
      color: var(--ion-text-color);

      font-size: 13px;
      font-weight: 900;
    }

    .pi-photo-note {
      margin-top: 4px;

      color: var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.45;
    }

    .pi-photo-actions {
      display: flex;
      flex-wrap: wrap;

      gap: 6px;

      margin-top: 10px;
    }

    .pi-photo-actions ion-button {
      min-height: 32px;

      margin: 0;

      --border-radius: 10px;

      font-size: 8px;
      font-weight: 900;
    }

    .pi-hidden-input {
      display: none;
    }


    /* =========================
       SECTION HEADER
       ========================= */

    .pi-section {
      margin-top: 20px;
    }

    .pi-section-heading {
      display: flex;
      align-items: center;

      gap: 9px;

      margin: 0 2px 9px;
    }

    .pi-section-icon {
      width: 32px;
      height: 32px;

      flex: 0 0 32px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 10px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      color: var(--ion-color-primary);
    }

    .pi-section-icon ion-icon {
      display: block !important;

      width: 18px !important;
      height: 18px !important;

      min-width: 18px;

      color: var(--ion-color-primary) !important;

      font-size: 18px !important;

      opacity: 1 !important;
      visibility: visible !important;
    }

    .pi-section-title {
      color: var(--ion-text-color);

      font-size: 12px;
      font-weight: 900;
    }

    .pi-section-subtitle {
      margin-top: 2px;

      color: var(--ion-color-medium);

      font-size: 8px;
      line-height: 1.35;
    }


    /* =========================
       FORM CARD
       ========================= */

    .pi-form-card {
      padding: 12px;

      border-radius: 18px;

      border:
        1px solid
        rgba(
          120,
          120,
          120,
          .08
        );
    }


    /* =========================
       FIELD
       ========================= */

    .pi-field {
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

      --min-height: 62px;
    }

    .pi-field:last-child {
      margin-bottom: 0;
    }

    .pi-field ion-icon[slot="start"] {
      display: block !important;

      width: 19px !important;
      height: 19px !important;

      min-width: 19px;

      margin-right: 12px;

      color: var(--ion-color-primary) !important;

      font-size: 19px !important;

      opacity: 1 !important;
      visibility: visible !important;
    }

    .pi-field ion-input,
    .pi-field ion-textarea,
    .pi-field ion-select {
      color: var(--ion-text-color);

      font-size: 11px;
    }

    .pi-readonly {
      opacity: .88;
    }

    .pi-readonly ion-icon[slot="start"] {
      color: var(--ion-color-medium) !important;
    }


    /* =========================
       FIELD NOTE
       ========================= */

    .pi-field-note {
      margin: -2px 4px 10px;

      color: var(--ion-color-medium);

      font-size: 8px;
      line-height: 1.45;
    }


    /* =========================
       PHONE
       ========================= */

    .pi-phone-status {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 10px;

      padding: 3px 3px 0;
    }

    .pi-phone-note {
      flex: 1;

      color: var(--ion-color-medium);

      font-size: 8px;
      line-height: 1.4;
    }

    .pi-verified {
      flex-shrink: 0;

      display: inline-flex;
      align-items: center;

      gap: 5px;

      padding: 6px 9px;

      border-radius: 999px;

      background:
        rgba(
          var(--ion-color-success-rgb),
          .11
        );

      color: var(--ion-color-success);

      font-size: 8px;
      font-weight: 900;
    }

    .pi-verified ion-icon {
      font-size: 14px;
    }

    .pi-verify-btn {
      flex-shrink: 0;

      min-height: 34px;

      margin: 0;

      --border-radius: 10px;

      font-size: 8px;
      font-weight: 900;
    }


    /* =========================
       INFO BOX
       ========================= */

    .pi-info-box {
      margin-top: 10px;

      display: flex;
      align-items: flex-start;

      gap: 8px;

      padding: 10px 11px;

      border-radius: 12px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .06
        );

      color: var(--ion-color-medium);

      font-size: 8px;
      line-height: 1.45;
    }

    .pi-info-box ion-icon {
      flex-shrink: 0;

      margin-top: 1px;

      color: var(--ion-color-primary);

      font-size: 14px;
    }


    /* =========================
       SAVE BUTTON
       ========================= */

    .pi-save-wrap {
      margin-top: 22px;
    }

    .pi-save-btn {
      min-height: 48px;

      margin: 0;

      --border-radius: 14px;

      font-size: 10px;
      font-weight: 900;
    }

    .pi-save-note {
      margin-top: 8px;

      color: var(--ion-color-medium);

      text-align: center;

      font-size: 8px;
      line-height: 1.4;
    }


    /* =========================
       LIGHT MODE
       ========================= */

    @media (prefers-color-scheme: light) {

      .pi-form-card {
        background: #ffffff;

        box-shadow:
          0 8px 20px
          rgba(
            32,
            57,
            78,
            .05
          );
      }

      .pi-field {
        --background: #ffffff;

        border-color:
          rgba(
            33,
            56,
            75,
            .10
          );
      }

      .pi-info-box {
        background: #f1f9fc;
      }

    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (min-width: 720px) {

      .pi-content-grid {
        display: grid;

        grid-template-columns:
          minmax(0, 1fr)
          minmax(0, 1fr);

        gap: 18px;
      }

      .pi-content-grid
      .pi-section {
        margin-top: 20px;
      }

    }


    @media (max-width: 380px) {

      .pi-photo-card {
        padding: 14px;

        gap: 11px;
      }

      .pi-photo {
        width: 72px;
        height: 72px;

        border-radius: 19px;
      }

      .pi-photo-actions ion-button {
        font-size: 7px;
      }

    }

  `],


  template: `

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        defaultHref="/account">
      </ion-back-button>

    </ion-buttons>


    <ion-title>
      Personal Information
    </ion-title>


  </ion-toolbar>

</ion-header>



<ion-content>


  <div class="page-wrap no-bottom pi-page">



    <!-- =========================
         INTRO
         ========================= -->

    <div class="pi-intro">


      <div class="pi-kicker">
        SmileHub Profile
      </div>


      <h1 class="pi-title">
        Your Information
      </h1>


      <p class="pi-subtitle">

        Keep your personal and professional
        information accurate and up to date.

      </p>


    </div>



    <!-- =========================
         PROFILE PHOTO
         ========================= -->

    <div class="pi-photo-card">


      <div class="pi-photo-wrap">


        <div class="pi-photo">


          <img
            *ngIf="profilePhoto"

            [src]="profilePhoto"

            alt="Profile photo">


          <span
            *ngIf="!profilePhoto">

            {{ photoInitials }}

          </span>


        </div>


        <div class="pi-photo-badge">

          <ion-icon
            name="create-outline">
          </ion-icon>

        </div>


      </div>



      <div class="pi-photo-content">


        <div class="pi-photo-title">
          Profile Photo
        </div>


        <div class="pi-photo-note">

          Add a clear photo to personalize
          your SmileHub account.

        </div>


        <input
          #photoInput

          class="pi-hidden-input"

          type="file"

          accept="image/*"

          (change)="
            onPhotoSelected(
              $event
            )
          ">



        <div class="pi-photo-actions">


          <ion-button
            type="button"

            size="small"

            fill="outline"

            [disabled]="changingPhoto"

            (click)="
              photoInput.click()
            ">


            <ion-spinner
              *ngIf="changingPhoto"

              slot="start"

              name="crescent">
            </ion-spinner>


            <ion-icon
              *ngIf="!changingPhoto"

              slot="start"

              name="create-outline">
            </ion-icon>


            {{
              profilePhoto
                ? 'Change Photo'
                : 'Add Photo'
            }}


          </ion-button>



          <ion-button
            *ngIf="profilePhoto"

            type="button"

            size="small"

            fill="outline"

            color="danger"

            [disabled]="changingPhoto"

            (click)="
              confirmRemovePhoto()
            ">


            <ion-icon
              slot="start"

              name="trash-outline">
            </ion-icon>


            Remove


          </ion-button>


        </div>


      </div>


    </div>



    <!-- =========================
         FORM
         ========================= -->

    <form
      (ngSubmit)="save()">



      <div class="pi-content-grid">



        <!-- =========================
             BASIC INFORMATION
             ========================= -->

        <div class="pi-section">


          <div class="pi-section-heading">


            <div class="pi-section-icon">

              <ion-icon
                name="person-outline">
              </ion-icon>

            </div>


            <div>


              <div class="pi-section-title">
                Basic Information
              </div>


              <div class="pi-section-subtitle">
                Your personal account details
              </div>


            </div>


          </div>



          <div class="app-card pi-form-card">


            <!-- FULL NAME -->

            <ion-item
              class="pi-field"

              lines="none">


              <ion-icon
                slot="start"

                name="person-outline">
              </ion-icon>


              <ion-input
                label="Full name"

                labelPlacement="stacked"

                autocomplete="name"

                [(ngModel)]="fullName"

                name="fullName"

                [disabled]="saving">
              </ion-input>


            </ion-item>



            <!-- EMAIL -->

            <ion-item
              class="
                pi-field
                pi-readonly
              "

              lines="none">


              <ion-icon
                slot="start"

                name="mail-outline">
              </ion-icon>


              <ion-input
                label="Email address"

                labelPlacement="stacked"

                type="email"

                [(ngModel)]="email"

                name="email"

                [readonly]="true">
              </ion-input>


            </ion-item>


            <div class="pi-field-note">

              Your email is connected to
              your SmileHub login account
              and cannot be changed here.

            </div>


          </div>


        </div>



        <!-- =========================
             CONTACT INFORMATION
             ========================= -->

        <div class="pi-section">


          <div class="pi-section-heading">


            <div class="pi-section-icon">

              <ion-icon
                name="call-outline">
              </ion-icon>

            </div>


            <div>


              <div class="pi-section-title">
                Contact Information
              </div>


              <div class="pi-section-subtitle">
                Mobile number and verification
              </div>


            </div>


          </div>



          <div class="app-card pi-form-card">


            <ion-item
              class="pi-field"

              lines="none">


              <ion-icon
                slot="start"

                name="phone-portrait-outline">
              </ion-icon>


              <ion-input
                label="Mobile number"

                labelPlacement="stacked"

                type="tel"

                inputmode="numeric"

                maxlength="11"

                placeholder="09XXXXXXXXX"

                [(ngModel)]="mobile"

                name="mobile"

                [disabled]="saving"

                (ionInput)="
                  onMobileChange()
                ">
              </ion-input>


            </ion-item>



            <div class="pi-phone-status">


              <div class="pi-phone-note">

                {{
                  isCurrentMobileVerified

                    ? 'This mobile number is verified.'

                    : 'Verify this number before using it for account verification.'
                }}

              </div>



              <div
                class="pi-verified"

                *ngIf="
                  isCurrentMobileVerified
                ">


                <ion-icon
                  name="checkmark-circle-outline">
                </ion-icon>


                Verified


              </div>



              <ion-button
                *ngIf="
                  !isCurrentMobileVerified
                "

                class="pi-verify-btn"

                fill="outline"

                size="small"

                type="button"

                [disabled]="saving"

                (click)="
                  verifyMobile()
                ">


                <ion-icon
                  slot="start"

                  name="shield-checkmark-outline">
                </ion-icon>


                Verify


              </ion-button>


            </div>


          </div>


        </div>



        <!-- =========================
             PERSONAL ADDRESS
             ========================= -->

        <div class="pi-section">


          <div class="pi-section-heading">


            <div class="pi-section-icon">

              <ion-icon
                name="location-outline">
              </ion-icon>

            </div>


            <div>


              <div class="pi-section-title">
                Personal Address
              </div>


              <div class="pi-section-subtitle">
                Address saved in your profile
              </div>


            </div>


          </div>



          <div class="app-card pi-form-card">


            <ion-item
              class="pi-field"

              lines="none">


              <ion-icon
                slot="start"

                name="home-outline">
              </ion-icon>


              <ion-textarea
                label="Address"

                labelPlacement="stacked"

                placeholder="House / Street / Barangay / City / Province"

                [autoGrow]="true"

                rows="3"

                maxlength="300"

                [(ngModel)]="address"

                name="address"

                [disabled]="saving">
              </ion-textarea>


            </ion-item>



            <div class="pi-info-box">


              <ion-icon
                name="information-circle-outline">
              </ion-icon>


              <span>

                This is your personal profile address.
                Shipping addresses used during checkout
                are managed separately under Addresses.

              </span>


            </div>


          </div>


        </div>



        <!-- =========================
             PROFESSIONAL INFORMATION
             ========================= -->

        <div class="pi-section">


          <div class="pi-section-heading">


            <!--
              Using card-outline because this
              icon is already rendering correctly
              elsewhere in your SmileHub app.
            -->

            <div class="pi-section-icon">

              <ion-icon
                name="card-outline">
              </ion-icon>

            </div>


            <div>


              <div class="pi-section-title">
                Professional Information
              </div>


              <div class="pi-section-subtitle">
                Optional professional details
              </div>


            </div>


          </div>



          <div class="app-card pi-form-card">


            <!-- CLINIC / ORGANIZATION -->

            <ion-item
              class="pi-field"

              lines="none">


              <ion-icon
                slot="start"

                name="location-outline">
              </ion-icon>


              <ion-input
                label="Clinic / Organization"

                labelPlacement="stacked"

                placeholder="Optional"

                [(ngModel)]="clinic"

                name="clinic"

                [disabled]="saving">
              </ion-input>


            </ion-item>



            <!-- BUYER TYPE -->

            <ion-item
              class="pi-field"

              lines="none">


              <ion-icon
                slot="start"

                name="person-outline">
              </ion-icon>


              <ion-select
                label="Buyer type"

                labelPlacement="stacked"

                interface="popover"

                [interfaceOptions]="
                  buyerTypePopoverOptions
                "

                [(ngModel)]="buyerType"

                name="buyerType"

                [disabled]="saving">


                <ion-select-option
                  value="Dental Professional">

                  Dental Professional

                </ion-select-option>


                <ion-select-option
                  value="Dental Student">

                  Dental Student

                </ion-select-option>


                <ion-select-option
                  value="Clinic / Organization">

                  Clinic / Organization

                </ion-select-option>


                <ion-select-option
                  value="Healthcare Buyer">

                  Healthcare Buyer

                </ion-select-option>


              </ion-select>


            </ion-item>


          </div>


        </div>


      </div>



      <!-- =========================
           SAVE
           ========================= -->

      <div class="pi-save-wrap">


        <ion-button
          class="pi-save-btn"

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
              ? 'Saving Changes...'
              : 'Save Changes'
          }}


        </ion-button>


        <div class="pi-save-note">

          Your updated information will be
          saved to your SmileHub profile.

        </div>


      </div>


    </form>


  </div>


</ion-content>

`
})


export class PersonalInformationPage {


  fullName =
    '';


  email =
    '';


  mobile =
    '';


  address =
    '';


  clinic =
    '';


  buyerType =
    'Dental Professional';


  /*
   * Tells the Ionic select to use
   * a small popover attached to the field
   * instead of the large bottom action sheet.
   */

  buyerTypePopoverOptions: any = {

    side:
      'bottom',

    alignment:
      'start',

    showBackdrop:
      true

  };


  phoneVerified =
    false;


  verifiedPhone =
    '';


  saving =
    false;


  changingPhoto =
    false;


  profilePhoto =
    '';



  constructor(

    private profile:
      ProfileService,

    private profilePhotos:
      ProfilePhotoService,

    private alerts:
      AlertController,

    private loading:
      LoadingController,

    private router:
      Router

  ) {}



  /* =========================
     LOAD PROFILE
     ========================= */

  async ionViewWillEnter():
    Promise<void> {


    try {


      const loadedProfile =
        await this.profile
          .loadProfile();


      const profile =
        loadedProfile
        ||
        {};


      this.fullName =
        this.cleanText(
          profile.fullName
        );


      this.email =
        this.cleanText(
          profile.email
        );


      this.mobile =
        this.cleanText(
          profile.mobile
        );


      /*
       * Handles both old string
       * and object-style addresses.
       */

      this.address =
        this.addressToText(
          profile.address
        );


      this.clinic =
        this.cleanText(
          profile.clinic
        );


      this.buyerType =
        this.cleanText(
          profile.buyerType
        )
        ||
        'Dental Professional';


      this.phoneVerified =
        !!profile.phoneVerified;


      this.verifiedPhone =
        this.cleanText(
          profile.verifiedPhone
        );


      this.profilePhoto =
        await this.profilePhotos
          .loadProfilePhoto();


    } catch (
      error
    ) {


      console.error(
        'Unable to load profile:',
        error
      );


    }


  }



  /* =========================
     CLEAN TEXT
     ========================= */

  private cleanText(
    value: any
  ):
    string {


    if (
      value === null
      ||
      value === undefined
    ) {


      return '';


    }


    if (
      typeof value ===
      'object'
    ) {


      return '';


    }


    const result =
      String(
        value
      )
        .trim();


    if (
      result ===
        '[object Object]'
      ||
      result ===
        'undefined'
      ||
      result ===
        'null'
    ) {


      return '';


    }


    return result;


  }



  /* =========================
     ADDRESS TO TEXT
     ========================= */

  private addressToText(
    value: any
  ):
    string {


    if (
      value === null
      ||
      value === undefined
    ) {


      return '';


    }


    /*
     * STRING ADDRESS
     */

    if (
      typeof value ===
      'string'
    ) {


      const cleaned =
        value.trim();


      /*
       * Older version may already have
       * saved "[object Object]" as text.
       */

      if (
        !cleaned
        ||
        cleaned ===
          '[object Object]'
        ||
        cleaned ===
          'undefined'
        ||
        cleaned ===
          'null'
      ) {


        return '';


      }


      return cleaned;


    }


    /*
     * OTHER PRIMITIVES
     */

    if (
      typeof value !==
      'object'
    ) {


      return this.cleanText(
        value
      );


    }


    /*
     * COMMON FULL ADDRESS FIELDS
     */

    const directCandidates =
      [

        value.fullAddress,
        value.formattedAddress,
        value.addressLine,
        value.addressText

      ];


    for (
      const candidate
      of directCandidates
    ) {


      const text =
        this.cleanText(
          candidate
        );


      if (
        text
      ) {


        return text;


      }


    }


    /*
     * Sometimes "address" itself
     * is another nested object/string.
     */

    if (
      value.address
      &&
      value.address !== value
    ) {


      const nested =
        this.addressToText(
          value.address
        );


      if (
        nested
      ) {


        return nested;


      }


    }


    /*
     * BUILD FROM ADDRESS PARTS
     */

    const keys =
      [

        'houseNo',
        'houseNumber',
        'unit',
        'room',
        'building',
        'street',
        'streetName',
        'subdivision',
        'village',
        'barangay',
        'district',
        'city',
        'municipality',
        'province',
        'region',
        'postalCode',
        'zipCode'

      ];


    const parts:
      string[] =
      [];


    for (
      const key
      of keys
    ) {


      const text =
        this.cleanText(
          value[key]
        );


      if (
        text
        &&
        !parts.includes(
          text
        )
      ) {


        parts.push(
          text
        );


      }


    }


    return parts.join(
      ', '
    );


  }



  /* =========================
     PHOTO INITIALS
     ========================= */

  get photoInitials():
    string {


    const fullName =
      String(
        this.fullName
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
        parts.length >=
        2
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


    return String(
      this.email
      ||
      'SH'
    )
      .substring(
        0,
        2
      )
      .toUpperCase();


  }



  /* =========================
     SELECT PROFILE PHOTO
     ========================= */

  async onPhotoSelected(
    event: Event
  ):
    Promise<void> {


    const target =
      event.target;


    if (
      !(target instanceof HTMLInputElement)
    ) {


      return;


    }


    const file =
      target.files
        ?.item(
          0
        );


    if (
      !file
    ) {


      return;


    }


    if (
      this.changingPhoto
    ) {


      target.value =
        '';


      return;


    }


    this.changingPhoto =
      true;


    const loader =
      await this.loading
        .create({

          message:
            'Updating profile photo...',

          spinner:
            'crescent'

        });


    await loader.present();


    try {


      const preparedPhoto =
        await this.profilePhotos
          .prepareProfileImage(
            file
          );


      await this.profilePhotos
        .saveProfilePhoto(
          preparedPhoto
        );


      this.profilePhoto =
        preparedPhoto;


      await this.msg(
        'Profile photo updated successfully.'
      );


    } catch (
      error: any
    ) {


      console.error(
        'Unable to update profile photo:',
        error
      );


      await this.msg(

        error?.message

        ||

        'Unable to update profile photo.'

      );


    } finally {


      this.changingPhoto =
        false;


      target.value =
        '';


      try {


        await loader.dismiss();


      } catch (_) {}


    }


  }



  /* =========================
     CONFIRM REMOVE PHOTO
     ========================= */

  async confirmRemovePhoto():
    Promise<void> {


    if (
      !this.profilePhoto
      ||
      this.changingPhoto
    ) {


      return;


    }


    const alert =
      await this.alerts
        .create({

          header:
            'Remove profile photo?',

          message:
            'Your profile will return to the default initials avatar.',

          buttons: [

            {

              text:
                'Cancel',

              role:
                'cancel'

            },


            {

              text:
                'Remove',

              role:
                'destructive',

              handler:
                () => {


                  void this
                    .removeProfilePhoto();


                }

            }

          ]

        });


    await alert.present();


  }



  /* =========================
     REMOVE PROFILE PHOTO
     ========================= */

  private async removeProfilePhoto():
    Promise<void> {


    if (
      this.changingPhoto
    ) {


      return;


    }


    this.changingPhoto =
      true;


    const loader =
      await this.loading
        .create({

          message:
            'Removing profile photo...',

          spinner:
            'crescent'

        });


    await loader.present();


    try {


      await this.profilePhotos
        .removeProfilePhoto();


      this.profilePhoto =
        '';


      await this.msg(
        'Profile photo removed.'
      );


    } catch (
      error: any
    ) {


      console.error(
        'Unable to remove profile photo:',
        error
      );


      await this.msg(

        error?.message

        ||

        'Unable to remove profile photo.'

      );


    } finally {


      this.changingPhoto =
        false;


      try {


        await loader.dismiss();


      } catch (_) {}


    }


  }



  /* =========================
     VERIFIED STATUS
     ========================= */

  get isCurrentMobileVerified():
    boolean {


    if (
      !this.phoneVerified
      ||
      !this.verifiedPhone
    ) {


      return false;


    }


    const phone =
      this.mobileToE164(
        this.mobile
      );


    return (

      !!phone

      &&

      phone ===
        this.verifiedPhone

    );


  }



  /* =========================
     MOBILE CHANGED
     ========================= */

  onMobileChange():
    void {


    /*
     * isCurrentMobileVerified
     * automatically recalculates
     * verification status.
     */


  }



  /* =========================
     VERIFY MOBILE
     ========================= */

  async verifyMobile():
    Promise<void> {


    const cleanMobile =
      this.mobile
        .replace(
          /\D/g,
          ''
        );


    if (
      !/^09\d{9}$/
        .test(
          cleanMobile
        )
    ) {


      await this.msg(
        'Enter a valid 11-digit Philippine mobile number first.'
      );


      return;


    }


    await this.router
      .navigate(

        [
          '/verify-phone'
        ],

        {

          queryParams: {

            mobile:
              cleanMobile

          }

        }

      );


  }



  /* =========================
     SAVE PROFILE
     ========================= */

  async save():
    Promise<void> {


    if (
      this.saving
    ) {


      return;


    }


    const cleanName =
      this.fullName
        .trim();


    const cleanMobile =
      this.mobile
        .replace(
          /\D/g,
          ''
        );


    const cleanAddress =
      this.address
        .trim();


    const cleanClinic =
      this.clinic
        .trim();



    if (
      !cleanName
    ) {


      await this.msg(
        'Full name is required.'
      );


      return;


    }



    if (
      cleanMobile
      &&
      !/^09\d{9}$/
        .test(
          cleanMobile
        )
    ) {


      await this.msg(
        'Enter a valid 11-digit Philippine mobile number.'
      );


      return;


    }



    if (
      !cleanAddress
    ) {


      await this.msg(
        'Personal address is required.'
      );


      return;


    }



    this.saving =
      true;


    const loader =
      await this.loading
        .create({

          message:
            'Saving profile...',

          spinner:
            'crescent'

        });


    await loader.present();



    try {


      await this.profile
        .saveProfile(

          cleanName,

          cleanMobile,

          cleanAddress,

          cleanClinic,

          this.buyerType

        );


      const profile =
        await this.profile
          .loadProfile();


      this.phoneVerified =
        !!profile.phoneVerified;


      this.verifiedPhone =
        this.cleanText(
          profile.verifiedPhone
        );


      /*
       * Normalize the returned address
       * after saving.
       */

      const returnedAddress =
        this.addressToText(
          profile.address
        );


      this.address =
        returnedAddress
        ||
        cleanAddress;


      await this.msg(
        'Profile updated successfully.'
      );


    } catch (
      error: any
    ) {


      console.error(
        'Unable to save profile:',
        error
      );


      await this.msg(

        error?.message

        ||

        'Unable to save profile.'

      );


    } finally {


      this.saving =
        false;


      try {


        await loader.dismiss();


      } catch (_) {}


    }


  }



  /* =========================
     PH MOBILE TO E.164
     ========================= */

  private mobileToE164(
    mobile: string
  ):
    string {


    const digits =
      String(
        mobile
        ||
        ''
      )
        .replace(
          /\D/g,
          ''
        );


    if (
      /^09\d{9}$/
        .test(
          digits
        )
    ) {


      return (
        '+63'
        +
        digits.substring(
          1
        )
      );


    }


    if (
      /^639\d{9}$/
        .test(
          digits
        )
    ) {


      return (
        '+'
        +
        digits
      );


    }


    return '';


  }



  /* =========================
     ALERT
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