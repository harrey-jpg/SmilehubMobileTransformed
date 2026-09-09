import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonicModule,
  AlertController,
  LoadingController
} from '@ionic/angular';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AddressService } from '../services/address.service';
import {
  PhAddressService,
  PhPlace
} from '../services/ph-address.service';

import { ShippingAddress } from '../models/product';


@Component({
  selector: 'app-add-address',
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


<div class="page-wrap no-bottom">


<form (ngSubmit)="save()">



  <!-- =========================
       LABEL
       ========================= -->

  <ion-item
    class="input-card"
    lines="none">


    <ion-select

      label="Label"

      labelPlacement="stacked"

      [(ngModel)]="form.label"

      name="label">


      <ion-select-option
        value="Home">

        Home

      </ion-select-option>


      <ion-select-option
        value="Clinic">

        Clinic

      </ion-select-option>


      <ion-select-option
        value="Office">

        Office

      </ion-select-option>


      <ion-select-option
        value="Other">

        Other

      </ion-select-option>


    </ion-select>


  </ion-item>



  <!-- =========================
       RECIPIENT
       ========================= -->

  <ion-item
    class="input-card"
    lines="none">


    <ion-input

      label="Recipient"

      labelPlacement="stacked"

      placeholder="Full name"

      [(ngModel)]="form.recipient"

      name="recipient"

      required>

    </ion-input>


  </ion-item>



  <!-- =========================
       PHONE
       ========================= -->

  <ion-item
    class="input-card"
    lines="none">


    <ion-input

      label="Phone"

      labelPlacement="stacked"

      type="tel"

      placeholder="09XXXXXXXXX"

      [(ngModel)]="form.phone"

      name="phone"

      required>

    </ion-input>


  </ion-item>



  <!-- =========================
       STREET
       ========================= -->

  <ion-item
    class="input-card"
    lines="none">


    <ion-input

      label="Street / Building"

      labelPlacement="stacked"

      placeholder="House no., street, subdivision"

      [(ngModel)]="form.street"

      name="street"

      required>

    </ion-input>


  </ion-item>



  <!-- =========================
       DROPDOWN LOCATION
       ========================= -->

  <ng-container *ngIf="!manualLocation">


    <!-- REGION -->

    <ion-item
      class="input-card"
      lines="none">


      <ion-select

        label="Region"

        labelPlacement="stacked"

        [(ngModel)]="regionCode"

        name="region"

        [disabled]="loadingPlaces"

        (ionChange)="onRegionChange()"

        placeholder="Select region">


        <ion-select-option

          *ngFor="let region of regions"

          [value]="region.code">


          {{ region.name }}


        </ion-select-option>


      </ion-select>


    </ion-item>



    <!-- PROVINCE -->

    <ion-item

      class="input-card"

      lines="none"

      *ngIf="hasProvinces">


      <ion-select

        label="Province"

        labelPlacement="stacked"

        [(ngModel)]="provinceCode"

        name="province"

        [disabled]="
          !regionCode ||
          loadingPlaces
        "

        (ionChange)="onProvinceChange()"

        placeholder="Select province">


        <ion-select-option

          *ngFor="let province of provinces"

          [value]="province.code">


          {{ province.name }}


        </ion-select-option>


      </ion-select>


    </ion-item>



    <!-- CITY -->

    <ion-item
      class="input-card"
      lines="none">


      <ion-select

        label="City / Municipality"

        labelPlacement="stacked"

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
        "

        (ionChange)="onCityChange()"

        placeholder="Select city / municipality">


        <ion-select-option

          *ngFor="let city of cities"

          [value]="city.code">


          {{ city.name }}


        </ion-select-option>


      </ion-select>


    </ion-item>



    <!-- BARANGAY -->

    <ion-item
      class="input-card"
      lines="none">


      <ion-select

        label="Barangay"

        labelPlacement="stacked"

        [(ngModel)]="barangayName"

        name="barangaySelect"

        [disabled]="
          !cityCode ||
          loadingPlaces
        "

        placeholder="Select barangay">


        <ion-select-option

          *ngFor="let barangay of barangays"

          [value]="barangay.name">


          {{ barangay.name }}


        </ion-select-option>


      </ion-select>


    </ion-item>


  </ng-container>



  <!-- =========================
       MANUAL LOCATION
       ========================= -->

  <ng-container *ngIf="manualLocation">


    <ion-item
      class="input-card"
      lines="none">


      <ion-input

        label="Barangay"

        labelPlacement="stacked"

        placeholder="Barangay"

        [(ngModel)]="form.barangay"

        name="barangay"

        required>

      </ion-input>


    </ion-item>



    <ion-item
      class="input-card"
      lines="none">


      <ion-input

        label="City / Municipality"

        labelPlacement="stacked"

        placeholder="City or municipality"

        [(ngModel)]="form.city"

        name="city"

        required>

      </ion-input>


    </ion-item>


  </ng-container>



  <!-- =========================
       POSTAL CODE
       ========================= -->

  <ion-item
    class="input-card"
    lines="none">


    <ion-input

      label="Postal Code"

      labelPlacement="stacked"

      type="tel"

      inputmode="numeric"

      maxlength="4"

      placeholder="4-digit postal code"

      [(ngModel)]="form.postalCode"

      name="postalCode"

      required>

    </ion-input>


  </ion-item>



  <!-- =========================
       LOCATION MODE
       ========================= -->

  <div
    style="
      text-align:right;
      margin:2px 0 8px
    ">


    <ion-button

      fill="clear"

      size="small"

      type="button"

      (click)="toggleLocationMode()">


      {{
        manualLocation
          ? 'Select location from dropdowns'
          : 'Enter location manually'
      }}


    </ion-button>


  </div>



  <!-- =========================
       DEFAULT ADDRESS
       ========================= -->

  <ion-item
    class="input-card"
    lines="none">


    <ion-toggle

      [(ngModel)]="form.isDefault"

      name="isDefault">


      Set as default address


    </ion-toggle>


  </ion-item>



  <!-- =========================
       SAVE
       ========================= -->

  <ion-button

    expand="block"

    type="submit"

    class="primary-btn"

    [disabled]="saving">


    <ion-spinner

      *ngIf="saving"

      slot="start"

      name="crescent">

    </ion-spinner>


    {{
      saving
        ? 'Saving...'
        : id
          ? 'Save Changes'
          : 'Add Address'
    }}


  </ion-button>


</form>


</div>


</ion-content>

`
})


export class AddAddressPage {


  id = '';


  saving = false;


  form: ShippingAddress = {

    label: 'Home',

    recipient: '',

    phone: '',

    city: '',

    barangay: '',

    street: '',

    postalCode: '',

    isDefault: false

  };


  /*
   * Philippine address dropdown state
   */

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
        .get('id') || '';

  }



  /* =========================
     PAGE ENTER
     ========================= */

  async ionViewWillEnter():
    Promise<void> {


    this.loadingPlaces = true;


    try {


      this.regions =
        await this.places.regions();


      if (!this.id) {

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


      if (!found) {


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


      await this.matchSavedLocation();


    } catch (error: any) {


      console.error(
        'Unable to load address:',
        error
      );


      /*
       * We can still let the user edit
       * the saved address manually.
       */

      if (this.id) {

        this.manualLocation = true;

      }


    } finally {


      this.loadingPlaces = false;

    }

  }



  /* =========================
     FIND PLACE BY NAME
     ========================= */

  private findByName(
    list: PhPlace[],
    name: string
  ): PhPlace | null {


    const target =
      String(name || '')
        .trim()
        .toLowerCase();


    if (!target) {

      return null;

    }


    const exact =
      list.find(
        place =>
          String(place.name || '')
            .trim()
            .toLowerCase()
          === target
      );


    if (exact) {

      return exact;

    }


    return (

      list.find(
        place => {


          const placeName =
            String(
              place.name || ''
            )
              .trim()
              .toLowerCase();


          return (
            placeName.includes(target)
            ||
            target.includes(placeName)
          );

        }
      )

      ||

      null

    );

  }



  /* =========================
     MATCH OLD SAVED LOCATION
     ========================= */

  private async matchSavedLocation():
    Promise<void> {


    const savedCity =
      String(
        this.form.city || ''
      ).trim();


    const savedBarangay =
      String(
        this.form.barangay || ''
      ).trim();


    /*
     * Older addresses only saved city
     * and barangay, not region/province.
     */

    if (
      !savedCity ||
      this.regions.length === 0
    ) {


      this.manualLocation = true;

      return;

    }


    this.loadingPlaces = true;

    this.manualLocation = false;


    try {


      /*
       * Search every region until
       * the saved city is found.
       */

      for (
        const region
        of this.regions
      ) {


        let provinces:
          PhPlace[] = [];


        try {


          provinces =
            await this.places
              .provinces(
                region.code
              )
            || [];


        } catch {


          provinces = [];

        }



        /*
         * Regions such as NCR may have
         * cities directly under region.
         */

        if (
          provinces.length === 0
        ) {


          let regionCities:
            PhPlace[] = [];


          try {


            regionCities =
              await this.places
                .regionCities(
                  region.code
                )
              || [];


          } catch {


            regionCities = [];

          }


          const city =
            this.findByName(
              regionCities,
              savedCity
            );


          if (!city) {

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
              || [];


          } catch {


            this.barangays = [];

          }


          const barangay =
            this.findByName(
              this.barangays,
              savedBarangay
            );


          if (barangay) {


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



        /*
         * Standard:
         * Region -> Province -> City
         */

        for (
          const province
          of provinces
        ) {


          let provinceCities:
            PhPlace[] = [];


          try {


            provinceCities =
              await this.places
                .cities(
                  province.code
                )
              || [];


          } catch {


            provinceCities = [];

          }


          const city =
            this.findByName(
              provinceCities,
              savedCity
            );


          if (!city) {

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
              || [];


          } catch {


            this.barangays = [];

          }


          const barangay =
            this.findByName(
              this.barangays,
              savedBarangay
            );


          if (barangay) {


            this.barangayName =
              barangay.name;


            this.manualLocation =
              false;


          } else {


            /*
             * City found but barangay
             * could not be matched.
             */

            this.manualLocation =
              true;

          }


          return;

        }

      }



      /*
       * No dropdown match.
       * Keep old values editable.
       */

      this.manualLocation = true;


    } catch (error) {


      console.error(
        'Unable to match saved location:',
        error
      );


      this.manualLocation = true;


    } finally {


      this.loadingPlaces = false;

    }

  }



  /* =========================
     REGION CHANGE
     ========================= */

  async onRegionChange(
    silent = false
  ): Promise<void> {


    this.provinceCode = '';

    this.cityCode = '';

    this.barangayName = '';


    this.provinces = [];

    this.cities = [];

    this.barangays = [];


    this.hasProvinces = true;


    if (!this.regionCode) {

      return;

    }


    if (!silent) {

      this.loadingPlaces = true;

    }


    try {


      const provinces =
        await this.places
          .provinces(
            this.regionCode
          );


      if (
        provinces &&
        provinces.length
      ) {


        this.provinces =
          provinces;


        this.hasProvinces =
          true;


      } else {


        /*
         * NCR and similar regions:
         * cities directly under region.
         */

        this.cities =
          await this.places
            .regionCities(
              this.regionCode
            )
          || [];


        this.hasProvinces =
          false;

      }


    } catch (error) {


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


      if (!silent) {

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
  ): Promise<void> {


    this.cityCode = '';

    this.barangayName = '';


    this.cities = [];

    this.barangays = [];


    if (!this.provinceCode) {

      return;

    }


    if (!silent) {

      this.loadingPlaces = true;

    }


    try {


      this.cities =
        await this.places
          .cities(
            this.provinceCode
          )
        || [];


    } catch (error) {


      console.error(
        'Unable to load cities:',
        error
      );


      await this.msg(
        'Unable to load cities.'
      );


    } finally {


      if (!silent) {

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
  ): Promise<void> {


    this.barangayName = '';

    this.barangays = [];


    if (!this.cityCode) {

      return;

    }


    if (!silent) {

      this.loadingPlaces = true;

    }


    try {


      this.barangays =
        await this.places
          .barangays(
            this.cityCode
          )
        || [];


    } catch (error) {


      console.error(
        'Unable to load barangays:',
        error
      );


      await this.msg(
        'Unable to load barangays.'
      );


    } finally {


      if (!silent) {

        this.loadingPlaces =
          false;

      }

    }

  }



  /* =========================
     TOGGLE LOCATION MODE
     ========================= */

  toggleLocationMode(): void {


    this.manualLocation =
      !this.manualLocation;


    /*
     * When going back to dropdown mode,
     * clear dropdown selection so user
     * can select a valid location.
     */

    if (!this.manualLocation) {


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


    if (this.manualLocation) {


      return (

        !!String(
          this.form.barangay || ''
        ).trim()

        &&

        !!String(
          this.form.city || ''
        ).trim()

      );

    }


    if (
      !this.regionCode ||
      !this.cityCode ||
      !this.barangayName
    ) {

      return false;

    }


    if (
      this.hasProvinces &&
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


    if (city) {

      this.form.city =
        city.name;

    }


    this.form.barangay =
      this.barangayName;

  }



  /* =========================
     SAVE ADDRESS
     ========================= */

  async save():
    Promise<void> {


    if (this.saving) {

      return;

    }


    /*
     * Trim fields
     */

    this.form.recipient =
      String(
        this.form.recipient || ''
      ).trim();


    this.form.phone =
      String(
        this.form.phone || ''
      ).trim();


    this.form.street =
      String(
        this.form.street || ''
      ).trim();


    this.form.postalCode =
      String(
        this.form.postalCode || ''
      ).trim();



    if (
      !this.form.recipient ||
      !this.form.phone ||
      !this.form.street ||
      !this.form.postalCode ||
      !this.locationValid()
    ) {


      await this.msg(
        'Complete all required address fields.'
      );


      return;

    }



    /*
     * Basic Philippine phone validation
     */

    const cleanPhone =
      this.form.phone
        .replace(
          /[\s()-]/g,
          ''
        );


    if (
      !/^(\+63|0)9\d{9}$/
        .test(cleanPhone)
    ) {


      await this.msg(
        'Enter a valid Philippine mobile number.'
      );


      return;

    }



    /*
     * Postal codes are 4 digits.
     */

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
      await this.loading.create({

        message:
          this.id
            ? 'Saving changes...'
            : 'Adding address...'

      });


    this.saving = true;


    await loader.present();


    try {


      if (!this.manualLocation) {


        this.applyDropdownLocation();

      } else {


        this.form.city =
          String(
            this.form.city || ''
          ).trim();


        this.form.barangay =
          String(
            this.form.barangay || ''
          ).trim();

      }



      if (this.id) {


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


    } catch (error: any) {


      console.error(
        'Unable to save address:',
        error
      );


      await this.msg(

        error?.message ||

        'Unable to save address.'

      );


    } finally {


      this.saving = false;


      await loader.dismiss();

    }

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