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

    .profile-heading {
      margin-bottom: 16px;
    }


    .profile-heading h2 {
      margin: 0;

      font-size: 20px;
      font-weight: 900;
    }


    .profile-heading p {
      margin: 5px 0 0;

      font-size: 11px;
      line-height: 1.5;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       PROFILE PHOTO
       ========================= */

    .profile-photo-card {
      display: flex;
      align-items: center;

      gap: 15px;

      margin-bottom: 18px;

      padding: 15px;

      border-radius: 16px;

      background:
        var(--ion-card-background);

      border:
        1px solid
        rgba(120, 120, 120, .10);
    }


    .profile-photo-preview {
      width: 82px;
      height: 82px;

      flex-shrink: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;

      border-radius: 50%;

      background:
        rgba(var(--ion-color-primary-rgb), .13);

      color:
        var(--ion-color-primary);

      border:
        2px solid
        rgba(var(--ion-color-primary-rgb), .18);

      font-size: 25px;
      font-weight: 900;

      text-transform: uppercase;
    }


    .profile-photo-preview img {
      width: 100%;
      height: 100%;

      display: block;

      object-fit: cover;
    }


    .profile-photo-content {
      flex: 1;
      min-width: 0;
    }


    .profile-photo-title {
      font-size: 13px;
      font-weight: 900;
    }


    .profile-photo-note {
      margin-top: 4px;

      font-size: 9px;
      line-height: 1.45;

      color:
        var(--ion-color-medium);
    }


    .profile-photo-actions {
      display: flex;
      flex-wrap: wrap;

      gap: 7px;

      margin-top: 10px;
    }


    .profile-photo-actions ion-button {
      min-height: 32px;

      margin: 0;

      --border-radius: 10px;

      font-size: 9px;
      font-weight: 800;
    }


    .hidden-photo-input {
      display: none;
    }


    .section-label {
      margin:
        18px 3px
        8px;

      font-size: 12px;
      font-weight: 900;

      color:
        var(--ion-color-medium);
    }


    .field-note {
      margin:
        -3px 4px
        12px;

      font-size: 9px;
      line-height: 1.4;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       PHONE VERIFICATION
       ========================= */

    .phone-status-row {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      min-height: 36px;

      margin:
        -3px 2px
        10px;
    }


    .verified-badge {
      display: flex;
      align-items: center;

      gap: 5px;

      padding:
        6px 10px;

      border-radius: 999px;

      background:
        rgba(
          var(--ion-color-success-rgb),
          .12
        );

      color:
        var(--ion-color-success);

      font-size: 10px;
      font-weight: 900;
    }


    .verified-badge ion-icon {
      font-size: 16px;
    }


    .verify-button {
      --border-radius: 10px;

      font-size: 10px;
      font-weight: 800;
    }


    .save-button {
      margin-top: 18px;

      --border-radius: 13px;

      font-weight: 800;
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


<div class="page-wrap no-bottom">


  <div class="profile-heading">


    <h2>
      Your Profile
    </h2>


    <p>
      Keep your personal and professional
      information up to date.
    </p>


  </div>



  <!-- =========================
       PROFILE PHOTO
       ========================= -->

  <div class="profile-photo-card">


    <div class="profile-photo-preview">


      <img
        *ngIf="profilePhoto"

        [src]="profilePhoto"

        alt="Profile photo">


      <span
        *ngIf="!profilePhoto">

        {{ photoInitials }}

      </span>


    </div>


    <div class="profile-photo-content">


      <div class="profile-photo-title">

        Profile Photo

      </div>


      <div class="profile-photo-note">

        Choose a clear photo.
        SmileHub automatically crops and compresses it.

      </div>


      <input
        #photoInput

        class="hidden-photo-input"

        type="file"

        accept="image/*"

        (change)="
          onPhotoSelected(
            $event
          )
        ">


      <div class="profile-photo-actions">


        <ion-button
          type="button"

          size="small"

          fill="outline"

          [disabled]="
            changingPhoto
          "

          (click)="
            photoInput.click()
          ">


          <ion-spinner
            *ngIf="
              changingPhoto
            "

            slot="start"

            name="crescent">
          </ion-spinner>


          <ion-icon
            *ngIf="
              !changingPhoto
            "

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
          *ngIf="
            profilePhoto
          "

          type="button"

          size="small"

          fill="outline"

          color="danger"

          [disabled]="
            changingPhoto
          "

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



  <form
    (ngSubmit)="save()">



    <!-- =========================
         FULL NAME
         ========================= -->

    <ion-item
      class="input-card"
      lines="none">


      <ion-input

        label="Full name"

        labelPlacement="stacked"

        autocomplete="name"

        [(ngModel)]="fullName"

        name="fullName"

        [disabled]="saving">

      </ion-input>


    </ion-item>



    <!-- =========================
         EMAIL
         ========================= -->

    <ion-item
      class="input-card"
      lines="none">


      <ion-input

        label="Email"

        labelPlacement="stacked"

        type="email"

        [(ngModel)]="email"

        name="email"

        [readonly]="true">

      </ion-input>


    </ion-item>


    <div class="field-note">

      Your email is connected to your
      SmileHub login account.

    </div>



    <!-- =========================
         MOBILE NUMBER
         ========================= -->

    <ion-item
      class="input-card"
      lines="none">


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

        (ionInput)="onMobileChange()">

      </ion-input>


    </ion-item>



    <!-- PHONE STATUS -->

    <div class="phone-status-row">


      <!-- VERIFIED -->

      <div
        class="verified-badge"

        *ngIf="isCurrentMobileVerified">


        <ion-icon
          name="checkmark-circle-outline">
        </ion-icon>


        Verified Number


      </div>



      <!-- NOT VERIFIED -->

      <ion-button

        *ngIf="!isCurrentMobileVerified"

        class="verify-button"

        fill="outline"

        size="small"

        type="button"

        [disabled]="saving"

        (click)="verifyMobile()">


        <ion-icon
          slot="start"

          name="shield-checkmark-outline">
        </ion-icon>


        Verify Number


      </ion-button>


    </div>



    <div
      class="field-note"
      *ngIf="!isCurrentMobileVerified">

      Verify your mobile number using
      the OTP sent through Firebase Phone Authentication.

    </div>



    <div
      class="field-note"
      *ngIf="isCurrentMobileVerified">

      Your mobile number has been verified.

    </div>



    <!-- =========================
         PERSONAL ADDRESS
         ========================= -->

    <div class="section-label">

      Personal Address

    </div>


    <ion-item
      class="input-card"
      lines="none">


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


    <div class="field-note">

      This is your personal profile address.
      Shipping addresses are managed separately
      under Addresses.

    </div>



    <!-- =========================
         PROFESSIONAL INFORMATION
         ========================= -->

    <div class="section-label">

      Professional Information

    </div>



    <!-- CLINIC -->

    <ion-item
      class="input-card"
      lines="none">


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
      class="input-card"
      lines="none">


      <ion-select

        label="Buyer type"

        labelPlacement="stacked"

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



    <!-- =========================
         SAVE
         ========================= -->

    <ion-button

      class="save-button"

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
          : 'Save Changes'
      }}


    </ion-button>


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


      const profile =
        await this.profile
          .loadProfile();


      this.fullName =
        profile.fullName;


      this.email =
        profile.email;


      this.mobile =
        profile.mobile;


      this.address =
        profile.address;


      this.clinic =
        profile.clinic;


      this.buyerType =
        profile.buyerType;


      this.phoneVerified =
        !!profile.phoneVerified;


      this.verifiedPhone =
        profile.verifiedPhone || '';


      this.profilePhoto =
        await this.profilePhotos
          .loadProfilePhoto();


    } catch (error) {


      console.error(
        'Unable to load profile:',
        error
      );

    }

  }





  /* =========================
     PHOTO INITIALS
     ========================= */

  get photoInitials():
    string {


    const fullName =
      String(
        this.fullName || ''
      )
        .trim();


    if (
      fullName
    ) {


      const parts =
        fullName
          .split(/\s+/)
          .filter(Boolean);


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


    return String(
      this.email || 'SH'
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
      target.files?.item(0);


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
     * Getter automatically detects
     * whether the edited number still
     * matches the verified phone.
     */

  }



  /* =========================
     VERIFY MOBILE
     ========================= */

  async verifyMobile():
    Promise<void> {


    const cleanMobile =
      this.mobile
        .replace(/\D/g, '');


    if (
      !/^09\d{9}$/
        .test(cleanMobile)
    ) {


      await this.msg(
        'Enter a valid 11-digit Philippine mobile number first.'
      );


      return;

    }


    await this.router.navigate(

      ['/verify-phone'],

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


    if (this.saving) {

      return;

    }



    const cleanName =
      this.fullName.trim();


    const cleanMobile =
      this.mobile
        .replace(/\D/g, '');


    const cleanAddress =
      this.address.trim();



    if (!cleanName) {


      await this.msg(
        'Full name is required.'
      );


      return;

    }



    if (
      cleanMobile
      &&
      !/^09\d{9}$/
        .test(cleanMobile)
    ) {


      await this.msg(
        'Enter a valid 11-digit Philippine mobile number.'
      );


      return;

    }



    if (!cleanAddress) {


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

          this.clinic,

          this.buyerType

        );


      /*
       * Reload profile so verified state
       * stays synced with Firebase.
       */

      const profile =
        await this.profile
          .loadProfile();


      this.phoneVerified =
        !!profile.phoneVerified;


      this.verifiedPhone =
        profile.verifiedPhone || '';


      await this.msg(
        'Profile updated successfully.'
      );


    } catch (error: any) {


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
     PH MOBILE → E.164
     ========================= */

  private mobileToE164(
    mobile: string
  ):
    string {


    const digits =
      String(
        mobile || ''
      )
        .replace(/\D/g, '');


    if (
      /^09\d{9}$/
        .test(digits)
    ) {


      return (
        '+63'
        +
        digits.substring(1)
      );

    }


    if (
      /^639\d{9}$/
        .test(digits)
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