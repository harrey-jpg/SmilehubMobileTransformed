import { Component, ViewEncapsulation } from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  IonicModule,
  AlertController,
  LoadingController
} from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  AddressService
} from '../services/address.service';

import {
  PhAddressService,
  PhPlace
} from '../services/ph-address.service';

import {
  ShippingAddress
} from '../models/product';


@Component({
  selector: 'app-add-address',
  standalone: true,
  encapsulation: ViewEncapsulation.None,

  imports: [
    IonicModule,
    FormsModule,
    CommonModule
  ],

  styles: [`

    /* =========================
       PAGE
       ========================= */

    .aa-page {
      padding-bottom: 34px;
    }


    /* =========================
       INTRO
       ========================= */

    .aa-intro {
      margin-bottom: 18px;
    }

    .aa-kicker {
      color: var(--ion-color-primary);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: .8px;
      text-transform: uppercase;
    }

    .aa-title {
      margin: 4px 0 5px;
      color: var(--ion-text-color);
      font-size: 23px;
      line-height: 1.2;
      font-weight: 900;
    }

    .aa-subtitle {
      max-width: 360px;
      margin: 0;
      color: var(--ion-color-medium);
      font-size: 11px;
      line-height: 1.5;
    }


    /* =========================
       SECTION
       ========================= */

    .aa-section {
      margin-top: 20px;
    }

    .aa-section-heading {
      display: flex;
      align-items: center;
      gap: 9px;
      margin: 0 2px 9px;
    }

    .aa-section-icon {
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

      color: var(--ion-color-primary);
    }

    .aa-section-icon ion-icon {
      width: 18px;
      height: 18px;
      font-size: 18px;
      color: var(--ion-color-primary);
    }

    .aa-section-title {
      color: var(--ion-text-color);
      font-size: 13px;
      font-weight: 900;
    }

    .aa-section-subtitle {
      margin-top: 2px;
      color: var(--ion-color-medium);
      font-size: 9px;
      line-height: 1.4;
    }


    /* =========================
       CARD
       ========================= */

    .aa-card {
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

    .aa-field {
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

    .aa-field:last-child {
      margin-bottom: 0;
    }

    .aa-field ion-icon[slot="start"] {
      width: 19px;
      height: 19px;
      min-width: 19px;

      margin-right: 12px;

      color: var(--ion-color-primary);

      font-size: 19px;
    }

    .aa-field ion-input,
    .aa-field ion-select {
      color: var(--ion-text-color);
      font-size: 12px;
    }


    /* =========================
       LOCATION LOADING
       ========================= */

    .aa-location-loading {
      display: flex;
      align-items: center;

      gap: 8px;

      margin: 4px 3px 11px;

      color: var(--ion-color-medium);

      font-size: 9px;
    }

    .aa-location-loading ion-spinner {
      width: 15px;
      height: 15px;
    }


    /* =========================
       LOCATION MODE
       ========================= */

    .aa-mode-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;

      margin-top: 10px;

      padding: 10px 2px 0;
    }

    .aa-mode-note {
      flex: 1;

      color: var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.4;
    }

    .aa-mode-button {
      flex-shrink: 0;

      min-height: 33px;

      margin: 0;

      --border-radius: 10px;

      font-size: 9px;
      font-weight: 900;

      text-transform: none;
    }


    /* =========================
       INFO BOX
       ========================= */

    .aa-info-box {
      display: flex;
      align-items: flex-start;

      gap: 9px;

      margin-top: 11px;

      padding: 10px 11px;

      border-radius: 12px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .06
        );

      color: var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.5;
    }

    .aa-info-box ion-icon {
      flex-shrink: 0;

      margin-top: 1px;

      color: var(--ion-color-primary);

      font-size: 15px;
    }


    /* =========================
       DEFAULT ADDRESS
       ========================= */

    .aa-default-card {
      display: flex;
      align-items: center;

      gap: 12px;

      padding: 14px;

      border-radius: 17px;

      border:
        1px solid
        rgba(
          120,
          120,
          120,
          .09
        );
    }

    .aa-default-icon {
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

      color: var(--ion-color-primary);
    }

    .aa-default-icon ion-icon {
      font-size: 20px;
    }

    .aa-default-info {
      flex: 1;
      min-width: 0;
    }

    .aa-default-title {
      color: var(--ion-text-color);
      font-size: 12px;
      font-weight: 900;
    }

    .aa-default-text {
      margin-top: 3px;

      color: var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.4;
    }

    .aa-default-card ion-toggle {
      flex-shrink: 0;

      transform: scale(.88);

      transform-origin: right center;
    }


    /* =========================
       SAVE
       ========================= */

    .aa-save-wrap {
      margin-top: 22px;
    }

    .aa-save-btn {
      min-height: 50px;

      margin: 0;

      --border-radius: 15px;

      font-size: 11px;
      font-weight: 900;

      text-transform: none;
    }

    .aa-save-note {
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

      .aa-card,
      .aa-default-card {
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

      .aa-field {
        --background: #ffffff;

        border-color:
          rgba(
            40,
            60,
            80,
            .10
          );
      }

      .aa-info-box {
        background: #f2f8fa;
      }

    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (min-width: 720px) {

      .aa-grid {
        display: grid;

        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );

        gap: 18px;
      }

      .aa-grid .aa-section {
        margin-top: 20px;
      }

      .aa-full {
        grid-column: 1 / -1;
      }

    }


    /* =========================
       ADDRESS SELECT POPOVERS
       ========================= */

    ion-popover.address-region-popover {
      --width: min(320px, calc(100vw - 32px));
      --max-width: calc(100vw - 32px);
      --max-height: 330px;
    }

    ion-popover.address-region-popover::part(content) {
      max-height: 330px;
      border-radius: 16px;
      overflow-y: auto !important;
    }

    ion-popover.address-region-popover ion-select-popover,
    ion-popover.address-region-popover ion-list {
      max-height: 320px;
      overflow-y: auto;
    }

    ion-popover.address-region-popover ion-item {
      --min-height: 48px;
      font-size: 14px;
    }

    ion-popover.address-select-popover {
      --width: min(320px, calc(100vw - 32px));
      --max-width: calc(100vw - 32px);
      --max-height: 340px;
    }

    ion-popover.address-select-popover::part(content) {
      max-height: 340px;
      border-radius: 16px;
      overflow-y: auto !important;
    }

    ion-popover.address-select-popover ion-select-popover,
    ion-popover.address-select-popover ion-list {
      max-height: 330px;
      overflow-y: auto;
    }

    ion-popover.address-select-popover ion-item {
      --min-height: 48px;
      font-size: 14px;
    }

    @media (max-height: 650px) {

      ion-popover.address-region-popover {
        --max-height: 280px;
      }

      ion-popover.address-region-popover::part(content) {
        max-height: 280px;
      }

      ion-popover.address-region-popover ion-select-popover,
      ion-popover.address-region-popover ion-list {
        max-height: 270px;
      }

    }

  `],


  template: `

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        defaultHref="/addresses">
      </ion-back-button>

    </ion-buttons>


    <ion-title>

      {{
        id
          ? 'Edit Address'
          : 'Add Address'
      }}

    </ion-title>


  </ion-toolbar>

</ion-header>



<ion-content>


  <div class="page-wrap no-bottom aa-page">


    <!-- =========================
         INTRO
         ========================= -->

    <div class="aa-intro">


      <div class="aa-kicker">
        SmileHub Delivery
      </div>


      <h1 class="aa-title">

        {{
          id
            ? 'Edit Address'
            : 'Add New Address'
        }}

      </h1>


      <p class="aa-subtitle">

        {{
          id
            ? 'Update the delivery information for this saved address.'
            : 'Enter the delivery details you want to use for your SmileHub orders.'
        }}

      </p>


    </div>



    <form
      (ngSubmit)="save()">



      <div class="aa-grid">



        <!-- =========================
             ADDRESS TYPE
             ========================= -->

        <div class="aa-section">


          <div class="aa-section-heading">


            <div class="aa-section-icon">

              <ion-icon
                name="home-outline">
              </ion-icon>

            </div>


            <div>

              <div class="aa-section-title">
                Address Type
              </div>

              <div class="aa-section-subtitle">
                Choose a label for this address
              </div>

            </div>


          </div>



          <div class="app-card aa-card">


            <ion-item
              class="aa-field"
              lines="none">


              <ion-icon
                slot="start"
                name="home-outline">
              </ion-icon>


              <ion-select
                label="Label"

                labelPlacement="stacked"

                interface="popover"

                [interfaceOptions]="selectPopoverOptions"

                placeholder="Select address type"

                [(ngModel)]="form.label"

                name="label"

                [disabled]="saving">


                <ion-select-option value="Home">
                  Home
                </ion-select-option>


                <ion-select-option value="Clinic">
                  Clinic
                </ion-select-option>


                <ion-select-option value="Office">
                  Office
                </ion-select-option>


                <ion-select-option value="Other">
                  Other
                </ion-select-option>


              </ion-select>


            </ion-item>


          </div>


        </div>



        <!-- =========================
             RECIPIENT
             ========================= -->

        <div class="aa-section">


          <div class="aa-section-heading">


            <div class="aa-section-icon">

              <ion-icon
                name="person-outline">
              </ion-icon>

            </div>


            <div>

              <div class="aa-section-title">
                Recipient Details
              </div>

              <div class="aa-section-subtitle">
                Who will receive the order
              </div>

            </div>


          </div>



          <div class="app-card aa-card">


            <ion-item
              class="aa-field"
              lines="none">


              <ion-icon
                slot="start"
                name="person-outline">
              </ion-icon>


              <ion-input
                label="Recipient"

                labelPlacement="stacked"

                placeholder="Full name"

                autocomplete="name"

                [(ngModel)]="form.recipient"

                name="recipient"

                [disabled]="saving"

                required>
              </ion-input>


            </ion-item>



            <ion-item
              class="aa-field"
              lines="none">


              <ion-icon
                slot="start"
                name="call-outline">
              </ion-icon>


              <ion-input
                label="Phone"

                labelPlacement="stacked"

                type="tel"

                inputmode="tel"

                maxlength="13"

                placeholder="09XXXXXXXXX"

                autocomplete="tel"

                [(ngModel)]="form.phone"

                name="phone"

                [disabled]="saving"

                required>
              </ion-input>


            </ion-item>


          </div>


        </div>



        <!-- =========================
             DELIVERY LOCATION
             ========================= -->

        <div class="aa-section aa-full">


          <div class="aa-section-heading">


            <div class="aa-section-icon">

              <ion-icon
                name="location-outline">
              </ion-icon>

            </div>


            <div>

              <div class="aa-section-title">
                Delivery Location
              </div>

              <div class="aa-section-subtitle">
                Complete Philippine address
              </div>

            </div>


          </div>



          <div class="app-card aa-card">


            <!-- STREET -->

            <ion-item
              class="aa-field"
              lines="none">


              <ion-icon
                slot="start"
                name="location-outline">
              </ion-icon>


              <ion-input
                label="Street / Building"

                labelPlacement="stacked"

                placeholder="House no., street, subdivision"

                autocomplete="street-address"

                [(ngModel)]="form.street"

                name="street"

                [disabled]="saving"

                required>
              </ion-input>


            </ion-item>



            <!-- =========================
                 DROPDOWN LOCATION
                 ========================= -->

            <ng-container
              *ngIf="!manualLocation">



              <!-- REGION -->

              <ion-item
                class="aa-field"
                lines="none">


                <ion-icon
                  slot="start"
                  name="location-outline">
                </ion-icon>


                <ion-select
                  label="Region"

                  labelPlacement="stacked"

                  interface="popover"

                  [interfaceOptions]="regionPopoverOptions"

                  placeholder="Select region"

                  [(ngModel)]="regionCode"

                  name="region"

                  [disabled]="
                    loadingPlaces ||
                    saving
                  "

                  (ionChange)="
                    onRegionChange()
                  ">


                  <ion-select-option
                    *ngFor="
                      let region
                      of regions
                    "

                    [value]="region.code">

                    {{ region.name }}

                  </ion-select-option>


                </ion-select>


              </ion-item>



              <!-- PROVINCE -->

              <ion-item
                class="aa-field"

                lines="none"

                *ngIf="hasProvinces">


                <ion-icon
                  slot="start"
                  name="location-outline">
                </ion-icon>


                <ion-select
                  label="Province"

                  labelPlacement="stacked"

                  interface="popover"

                  [interfaceOptions]="selectPopoverOptions"

                  placeholder="Select province"

                  [(ngModel)]="provinceCode"

                  name="province"

                  [disabled]="
                    !regionCode ||
                    loadingPlaces ||
                    saving
                  "

                  (ionChange)="
                    onProvinceChange()
                  ">


                  <ion-select-option
                    *ngFor="
                      let province
                      of provinces
                    "

                    [value]="province.code">

                    {{ province.name }}

                  </ion-select-option>


                </ion-select>


              </ion-item>



              <!-- CITY -->

              <ion-item
                class="aa-field"
                lines="none">


                <ion-icon
                  slot="start"
                  name="location-outline">
                </ion-icon>


                <ion-select
                  label="City / Municipality"

                  labelPlacement="stacked"

                  interface="popover"

                  [interfaceOptions]="selectPopoverOptions"

                  placeholder="Select city / municipality"

                  [(ngModel)]="cityCode"

                  name="citySelect"

                  [disabled]="
                    (
                      !hasProvinces &&
                      !regionCode
                    )
                    ||
                    (
                      hasProvinces &&
                      !provinceCode
                    )
                    ||
                    loadingPlaces
                    ||
                    saving
                  "

                  (ionChange)="
                    onCityChange()
                  ">


                  <ion-select-option
                    *ngFor="
                      let city
                      of cities
                    "

                    [value]="city.code">

                    {{ city.name }}

                  </ion-select-option>


                </ion-select>


              </ion-item>



              <!-- BARANGAY -->

              <ion-item
                class="aa-field"
                lines="none">


                <ion-icon
                  slot="start"
                  name="location-outline">
                </ion-icon>


                <ion-select
                  label="Barangay"

                  labelPlacement="stacked"

                  interface="popover"

                  [interfaceOptions]="selectPopoverOptions"

                  placeholder="Select barangay"

                  [(ngModel)]="barangayName"

                  name="barangaySelect"

                  [disabled]="
                    !cityCode ||
                    loadingPlaces ||
                    saving
                  ">


                  <ion-select-option
                    *ngFor="
                      let barangay
                      of barangays
                    "

                    [value]="barangay.name">

                    {{ barangay.name }}

                  </ion-select-option>


                </ion-select>


              </ion-item>


            </ng-container>



            <!-- =========================
                 MANUAL LOCATION
                 ========================= -->

            <ng-container
              *ngIf="manualLocation">


              <ion-item
                class="aa-field"
                lines="none">


                <ion-icon
                  slot="start"
                  name="location-outline">
                </ion-icon>


                <ion-input
                  label="Barangay"

                  labelPlacement="stacked"

                  placeholder="Barangay"

                  [(ngModel)]="form.barangay"

                  name="barangay"

                  [disabled]="saving"

                  required>
                </ion-input>


              </ion-item>



              <ion-item
                class="aa-field"
                lines="none">


                <ion-icon
                  slot="start"
                  name="location-outline">
                </ion-icon>


                <ion-input
                  label="City / Municipality"

                  labelPlacement="stacked"

                  placeholder="City or municipality"

                  [(ngModel)]="form.city"

                  name="city"

                  [disabled]="saving"

                  required>
                </ion-input>


              </ion-item>


            </ng-container>



            <!-- POSTAL CODE -->

            <ion-item
              class="aa-field"
              lines="none">


              <ion-icon
                slot="start"
                name="location-outline">
              </ion-icon>


              <ion-input
                label="Postal Code"

                labelPlacement="stacked"

                type="tel"

                inputmode="numeric"

                maxlength="4"

                placeholder="4-digit postal code"

                [(ngModel)]="form.postalCode"

                name="postalCode"

                [disabled]="saving"

                required>
              </ion-input>


            </ion-item>



            <!-- LOADING -->

            <div
              class="aa-location-loading"

              *ngIf="loadingPlaces">


              <ion-spinner
                name="crescent">
              </ion-spinner>


              Loading Philippine locations...


            </div>



            <!-- LOCATION MODE -->

            <div class="aa-mode-row">


              <div class="aa-mode-note">

                {{
                  manualLocation
                    ? 'Enter your barangay and city manually.'
                    : 'Can’t find your location in the list?'
                }}

              </div>


              <ion-button
                class="aa-mode-button"

                type="button"

                fill="clear"

                size="small"

                [disabled]="saving"

                (click)="
                  toggleLocationMode()
                ">


                <ion-icon
                  slot="start"

                  [name]="
                    manualLocation
                      ? 'location-outline'
                      : 'create-outline'
                  ">
                </ion-icon>


                {{
                  manualLocation
                    ? 'Use Dropdowns'
                    : 'Enter Manually'
                }}


              </ion-button>


            </div>



            <div class="aa-info-box">


              <ion-icon
                name="information-circle-outline">
              </ion-icon>


              <span>

                Make sure your address is complete
                so your SmileHub order can be
                delivered without delays.

              </span>


            </div>


          </div>


        </div>



        <!-- =========================
             DEFAULT ADDRESS
             ========================= -->

        <div class="aa-section aa-full">


          <div class="aa-section-heading">


            <div class="aa-section-icon">

              <ion-icon
                name="checkmark-circle-outline">
              </ion-icon>

            </div>


            <div>

              <div class="aa-section-title">
                Default Address
              </div>

              <div class="aa-section-subtitle">
                Choose your primary delivery address
              </div>

            </div>


          </div>



          <div class="app-card aa-default-card">


            <div class="aa-default-icon">

              <ion-icon
                name="home-outline">
              </ion-icon>

            </div>


            <div class="aa-default-info">


              <div class="aa-default-title">

                Set as default address

              </div>


              <div class="aa-default-text">

                SmileHub will automatically select
                this address during checkout.

              </div>


            </div>


            <ion-toggle
              [(ngModel)]="form.isDefault"

              name="isDefault"

              [disabled]="saving">
            </ion-toggle>


          </div>


        </div>


      </div>



      <!-- =========================
           SAVE
           ========================= -->

      <div class="aa-save-wrap">


        <ion-button
          class="aa-save-btn"

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
              : id
                ? 'Save Changes'
                : 'Add Address'
          }}


        </ion-button>


        <div class="aa-save-note">

          Your address will be securely saved
          to your SmileHub account.

        </div>


      </div>


    </form>


  </div>


</ion-content>

`

})


export class AddAddressPage {


  id = '';


  saving = false;



  /* =========================
     POPOVER OPTIONS
     ========================= */

  regionPopoverOptions: any = {
    cssClass:
      'address-region-popover'
  };


  selectPopoverOptions: any = {
    cssClass:
      'address-select-popover'
  };



  /* =========================
     FORM
     ========================= */

  form: ShippingAddress = {

    label:
      'Home',

    recipient:
      '',

    phone:
      '',

    city:
      '',

    barangay:
      '',

    street:
      '',

    postalCode:
      '',

    isDefault:
      false

  };



  /* =========================
     LOCATION STATE
     ========================= */

  regions: PhPlace[] = [];

  provinces: PhPlace[] = [];

  cities: PhPlace[] = [];

  barangays: PhPlace[] = [];


  regionCode = '';

  provinceCode = '';

  cityCode = '';

  barangayName = '';


  hasProvinces = true;

  loadingPlaces = false;

  manualLocation = false;



  constructor(

    private route:
      ActivatedRoute,

    private service:
      AddressService,

    private places:
      PhAddressService,

    private router:
      Router,

    private alerts:
      AlertController,

    private loading:
      LoadingController

  ) {


    this.id =
      this.route
        .snapshot
        .queryParamMap
        .get(
          'id'
        )
      ||
      '';


  }



  /* =========================
     PAGE ENTER
     ========================= */

  async ionViewWillEnter():
    Promise<void> {


    this.loadingPlaces =
      true;


    try {


      this.regions =
        await this.places
          .regions();


      if (
        !this.id
      ) {


        return;


      }


      const list =
        await this.service
          .listAddresses();


      const found =
        list.find(

          address =>
            address.addressId ===
            this.id

        );


      if (
        !found
      ) {


        await this.msg(
          'Address not found.'
        );


        await this.router
          .navigateByUrl(
            '/addresses'
          );


        return;


      }


      this.form = {
        ...found
      };


      await this
        .matchSavedLocation();


    } catch (
      error: any
    ) {


      console.error(
        'Unable to load address:',
        error
      );


      if (
        this.id
      ) {


        this.manualLocation =
          true;


      }


    } finally {


      this.loadingPlaces =
        false;


    }


  }



  /* =========================
     FIND PLACE BY NAME
     ========================= */

  private findByName(
    list: PhPlace[],
    name: string
  ):
    PhPlace |
    null {


    const target =
      String(
        name
        ||
        ''
      )
        .trim()
        .toLowerCase();


    if (
      !target
    ) {


      return null;


    }


    const exact =
      list.find(

        place =>
          String(
            place.name
            ||
            ''
          )
            .trim()
            .toLowerCase()

          ===

          target

      );


    if (
      exact
    ) {


      return exact;


    }


    return (

      list.find(

        place => {


          const placeName =
            String(
              place.name
              ||
              ''
            )
              .trim()
              .toLowerCase();


          return (

            placeName.includes(
              target
            )

            ||

            target.includes(
              placeName
            )

          );


        }

      )

      ||

      null

    );


  }



  /* =========================
     MATCH SAVED LOCATION
     ========================= */

  private async matchSavedLocation():
    Promise<void> {


    const savedCity =
      String(
        this.form.city
        ||
        ''
      )
        .trim();


    const savedBarangay =
      String(
        this.form.barangay
        ||
        ''
      )
        .trim();


    if (
      !savedCity
      ||
      this.regions.length === 0
    ) {


      this.manualLocation =
        true;


      return;


    }


    this.loadingPlaces =
      true;


    this.manualLocation =
      false;


    try {


      for (
        const region
        of this.regions
      ) {


        let provinces:
          PhPlace[] =
          [];


        try {


          provinces =
            await this.places
              .provinces(
                region.code
              )
            ||
            [];


        } catch {


          provinces =
            [];


        }



        /* =========================
           NCR / NO PROVINCES
           ========================= */

        if (
          provinces.length === 0
        ) {


          let regionCities:
            PhPlace[] =
            [];


          try {


            regionCities =
              await this.places
                .regionCities(
                  region.code
                )
              ||
              [];


          } catch {


            regionCities =
              [];


          }


          const city =
            this.findByName(
              regionCities,
              savedCity
            );


          if (
            !city
          ) {


            continue;


          }


          this.regionCode =
            region.code;


          this.provinceCode =
            '';


          this.hasProvinces =
            false;


          this.provinces =
            [];


          this.cities =
            regionCities;


          this.cityCode =
            city.code;


          try {


            this.barangays =
              await this.places
                .barangays(
                  city.code
                )
              ||
              [];


          } catch {


            this.barangays =
              [];


          }


          const barangay =
            this.findByName(
              this.barangays,
              savedBarangay
            );


          if (
            barangay
          ) {


            this.barangayName =
              barangay.name;


            this.manualLocation =
              false;


          } else {


            this.manualLocation =
              true;


          }


          return;


        }



        /* =========================
           STANDARD REGION
           ========================= */

        for (
          const province
          of provinces
        ) {


          let provinceCities:
            PhPlace[] =
            [];


          try {


            provinceCities =
              await this.places
                .cities(
                  province.code
                )
              ||
              [];


          } catch {


            provinceCities =
              [];


          }


          const city =
            this.findByName(
              provinceCities,
              savedCity
            );


          if (
            !city
          ) {


            continue;


          }


          this.regionCode =
            region.code;


          this.provinceCode =
            province.code;


          this.hasProvinces =
            true;


          this.provinces =
            provinces;


          this.cities =
            provinceCities;


          this.cityCode =
            city.code;


          try {


            this.barangays =
              await this.places
                .barangays(
                  city.code
                )
              ||
              [];


          } catch {


            this.barangays =
              [];


          }


          const barangay =
            this.findByName(
              this.barangays,
              savedBarangay
            );


          if (
            barangay
          ) {


            this.barangayName =
              barangay.name;


            this.manualLocation =
              false;


          } else {


            this.manualLocation =
              true;


          }


          return;


        }


      }


      this.manualLocation =
        true;


    } catch (
      error
    ) {


      console.error(
        'Unable to match saved location:',
        error
      );


      this.manualLocation =
        true;


    } finally {


      this.loadingPlaces =
        false;


    }


  }



  /* =========================
     REGION CHANGE
     ========================= */

  async onRegionChange(
    silent = false
  ):
    Promise<void> {


    this.provinceCode = '';

    this.cityCode = '';

    this.barangayName = '';


    this.provinces = [];

    this.cities = [];

    this.barangays = [];


    this.hasProvinces =
      true;


    if (
      !this.regionCode
    ) {


      return;


    }


    if (
      !silent
    ) {


      this.loadingPlaces =
        true;


    }


    try {


      const provinces =
        await this.places
          .provinces(
            this.regionCode
          );


      if (
        provinces
        &&
        provinces.length
      ) {


        this.provinces =
          provinces;


        this.hasProvinces =
          true;


      } else {


        this.cities =
          await this.places
            .regionCities(
              this.regionCode
            )
          ||
          [];


        this.hasProvinces =
          false;


      }


    } catch (
      error
    ) {


      console.error(
        'Unable to load region:',
        error
      );


      await this.msg(
        'Unable to load locations. You may enter the location manually.'
      );


      this.manualLocation =
        true;


    } finally {


      if (
        !silent
      ) {


        this.loadingPlaces =
          false;


      }


    }


  }



  /* =========================
     PROVINCE CHANGE
     ========================= */

  async onProvinceChange(
    silent = false
  ):
    Promise<void> {


    this.cityCode = '';

    this.barangayName = '';


    this.cities = [];

    this.barangays = [];


    if (
      !this.provinceCode
    ) {


      return;


    }


    if (
      !silent
    ) {


      this.loadingPlaces =
        true;


    }


    try {


      this.cities =
        await this.places
          .cities(
            this.provinceCode
          )
        ||
        [];


    } catch (
      error
    ) {


      console.error(
        'Unable to load cities:',
        error
      );


      await this.msg(
        'Unable to load cities.'
      );


    } finally {


      if (
        !silent
      ) {


        this.loadingPlaces =
          false;


      }


    }


  }



  /* =========================
     CITY CHANGE
     ========================= */

  async onCityChange(
    silent = false
  ):
    Promise<void> {


    this.barangayName = '';

    this.barangays = [];


    if (
      !this.cityCode
    ) {


      return;


    }


    if (
      !silent
    ) {


      this.loadingPlaces =
        true;


    }


    try {


      this.barangays =
        await this.places
          .barangays(
            this.cityCode
          )
        ||
        [];


    } catch (
      error
    ) {


      console.error(
        'Unable to load barangays:',
        error
      );


      await this.msg(
        'Unable to load barangays.'
      );


    } finally {


      if (
        !silent
      ) {


        this.loadingPlaces =
          false;


      }


    }


  }



  /* =========================
     LOCATION MODE
     ========================= */

  toggleLocationMode():
    void {


    this.manualLocation =
      !this.manualLocation;


    if (
      !this.manualLocation
    ) {


      this.regionCode = '';

      this.provinceCode = '';

      this.cityCode = '';

      this.barangayName = '';


      this.provinces = [];

      this.cities = [];

      this.barangays = [];


      this.hasProvinces =
        true;


    }


  }



  /* =========================
     LOCATION VALIDATION
     ========================= */

  private locationValid():
    boolean {


    if (
      this.manualLocation
    ) {


      return (

        !!String(
          this.form.barangay
          ||
          ''
        )
          .trim()

        &&

        !!String(
          this.form.city
          ||
          ''
        )
          .trim()

      );


    }


    if (
      !this.regionCode
      ||
      !this.cityCode
      ||
      !this.barangayName
    ) {


      return false;


    }


    if (
      this.hasProvinces
      &&
      !this.provinceCode
    ) {


      return false;


    }


    return true;


  }



  /* =========================
     APPLY DROPDOWN LOCATION
     ========================= */

  private applyDropdownLocation():
    void {


    const city =
      this.cities.find(

        item =>
          item.code ===
          this.cityCode

      );


    if (
      city
    ) {


      this.form.city =
        city.name;


    }


    this.form.barangay =
      this.barangayName;


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


    this.form.recipient =
      String(
        this.form.recipient
        ||
        ''
      )
        .trim();


    this.form.phone =
      String(
        this.form.phone
        ||
        ''
      )
        .trim();


    this.form.street =
      String(
        this.form.street
        ||
        ''
      )
        .trim();


    this.form.postalCode =
      String(
        this.form.postalCode
        ||
        ''
      )
        .trim();



    if (
      !this.form.recipient
      ||
      !this.form.phone
      ||
      !this.form.street
      ||
      !this.form.postalCode
      ||
      !this.locationValid()
    ) {


      await this.msg(
        'Complete all required address fields.'
      );


      return;


    }



    /* =========================
       PHONE VALIDATION
       ========================= */

    const cleanPhone =
      this.form.phone
        .replace(
          /[\s()-]/g,
          ''
        );


    if (
      !/^(\+63|0)9\d{9}$/
        .test(
          cleanPhone
        )
    ) {


      await this.msg(
        'Enter a valid Philippine mobile number.'
      );


      return;


    }



    /* =========================
       POSTAL CODE
       ========================= */

    if (
      !/^\d{4}$/
        .test(
          this.form.postalCode
        )
    ) {


      await this.msg(
        'Postal code must contain 4 digits.'
      );


      return;


    }



    const loader =
      await this.loading
        .create({

          message:
            this.id
              ? 'Saving changes...'
              : 'Adding address...',

          spinner:
            'crescent'

        });


    this.saving =
      true;


    await loader.present();


    try {


      if (
        !this.manualLocation
      ) {


        this.applyDropdownLocation();


      } else {


        this.form.city =
          String(
            this.form.city
            ||
            ''
          )
            .trim();


        this.form.barangay =
          String(
            this.form.barangay
            ||
            ''
          )
            .trim();


      }



      if (
        this.id
      ) {


        await this.service
          .updateAddress(

            this.id,

            this.form

          );


      } else {


        await this.service
          .addAddress(
            this.form
          );


      }


      await this.router
        .navigateByUrl(
          '/addresses'
        );


    } catch (
      error: any
    ) {


      console.error(
        'Unable to save address:',
        error
      );


      await this.msg(

        error?.message

        ||

        'Unable to save address.'

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
