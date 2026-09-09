import { Component } from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  IonicModule,
  AlertController,
  ToastController
} from '@ionic/angular';

import { CommonModule } from '@angular/common';

import { AddressService } from '../services/address.service';
import { AppStateService } from '../services/app-state.service';
import { ShippingAddress } from '../models/product';


@Component({
  selector: 'app-addresses',
  standalone: true,

  imports: [
    RouterModule,
    IonicModule,
    CommonModule
  ],

  styles: [`

    /* =========================
       PAGE HEADER INFO
       ========================= */

    .address-heading {
      margin-bottom: 14px;
    }

    .address-heading h2 {
      margin: 0;

      font-size: 20px;
      font-weight: 900;
    }

    .address-heading p {
      margin: 4px 0 0;

      color: var(--ion-color-medium);

      font-size: 11px;
      line-height: 1.4;
    }


    /* =========================
       ADDRESS CARD
       ========================= */

    .address-card {
      position: relative;

      padding: 16px;

      cursor: pointer;

      border:
        1px solid
        transparent;

      transition:
        border-color .15s ease,
        transform .15s ease;
    }

    .address-card:active {
      transform: scale(.99);
    }

    .address-card.selected {
      border-color:
        var(--ion-color-primary);
    }


    /* =========================
       TOP
       ========================= */

    .address-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      gap: 10px;

      margin-bottom: 12px;
    }

    .address-label {
      display: flex;
      align-items: center;

      gap: 8px;

      font-size: 14px;
      font-weight: 900;
    }

    .address-label ion-icon {
      color:
        var(--ion-color-primary);

      font-size: 18px;
    }

    .address-badges {
      display: flex;
      align-items: center;

      gap: 6px;

      flex-shrink: 0;
    }

    .default-badge {
      padding:
        4px 8px;

      border-radius: 999px;

      background:
        rgba(var(--ion-color-primary-rgb), .14);

      color:
        var(--ion-color-primary);

      font-size: 9px;
      font-weight: 900;
    }

    .selected-icon {
      color:
        var(--ion-color-primary);

      font-size: 20px;
    }


    /* =========================
       RECIPIENT
       ========================= */

    .recipient-name {
      font-size: 14px;
      font-weight: 900;
    }

    .recipient-phone {
      margin-top: 2px;

      font-size: 12px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       ADDRESS
       ========================= */

    .full-address {
      margin-top: 10px;

      font-size: 12px;
      line-height: 1.5;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       ACTIONS
       ========================= */

    .address-actions {
      display: flex;
      align-items: center;

      gap: 4px;

      margin-top: 12px;
      padding-top: 10px;

      border-top:
        1px solid
        rgba(120, 120, 120, .10);
    }

    .address-actions ion-button {
      margin: 0;

      font-size: 11px;
      font-weight: 800;
    }


    /* =========================
       SELECT MODE
       ========================= */

    .select-hint {
      display: flex;
      align-items: center;

      gap: 8px;

      margin:
        0 0 14px;

      padding: 11px 13px;

      border-radius: 12px;

      background:
        rgba(var(--ion-color-primary-rgb), .10);

      color:
        var(--ion-color-primary);

      font-size: 11px;
      font-weight: 700;
    }

    .select-hint ion-icon {
      flex-shrink: 0;

      font-size: 18px;
    }

    .use-address {
      display: flex;
      align-items: center;
      justify-content: space-between;

      margin-top: 12px;
      padding-top: 10px;

      border-top:
        1px solid
        rgba(120, 120, 120, .10);

      color:
        var(--ion-color-primary);

      font-size: 11px;
      font-weight: 900;
    }


    /* =========================
       EMPTY / ERROR
       ========================= */

    .address-empty {
      min-height: 58vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      padding: 30px 20px;
    }

    .empty-icon {
      width: 74px;
      height: 74px;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-bottom: 14px;

      border-radius: 50%;

      background:
        rgba(var(--ion-color-primary-rgb), .12);

      color:
        var(--ion-color-primary);

      font-size: 34px;
    }

    .address-empty h2 {
      margin: 0;

      font-size: 20px;
      font-weight: 900;
    }

    .address-empty p {
      max-width: 260px;

      margin:
        7px auto
        17px;

      font-size: 12px;
      line-height: 1.5;
    }


    /* =========================
       LOADING
       ========================= */

    .address-loading {
      min-height: 45vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      gap: 10px;

      font-size: 12px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       ADD BUTTON
       ========================= */

    .add-address-btn {
      margin-top: 16px;

      --border-radius: 13px;

      font-weight: 800;
    }

  `],

  template: `

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        [defaultHref]="
          selectionMode
            ? '/checkout'
            : '/account'
        ">
      </ion-back-button>

    </ion-buttons>


    <ion-title>

      {{
        selectionMode
          ? 'Select Address'
          : 'Addresses'
      }}

    </ion-title>


    <ion-buttons slot="end">

      <ion-button
        routerLink="/add-address">

        <ion-icon
          slot="icon-only"
          name="add-outline">
        </ion-icon>

      </ion-button>

    </ion-buttons>


  </ion-toolbar>

</ion-header>



<ion-content>


<div class="page-wrap no-bottom">


  <!-- =========================
       LOADING
       ========================= -->

  <div
    class="address-loading"
    *ngIf="loading">

    <ion-spinner>
    </ion-spinner>

    Loading addresses...

  </div>



  <!-- =========================
       LOAD ERROR
       ========================= -->

  <div
    class="address-empty"
    *ngIf="
      !loading &&
      loadError
    ">


    <div class="empty-icon">

      <ion-icon
        name="alert-circle-outline">
      </ion-icon>

    </div>


    <h2>

      Unable to load addresses

    </h2>


    <p class="muted">

      {{ loadError }}

    </p>


    <ion-button
      fill="outline"
      (click)="loadAddresses()">

      Retry

    </ion-button>


  </div>



  <!-- =========================
       NO ADDRESSES
       ========================= -->

  <div
    class="address-empty"

    *ngIf="
      !loading &&
      !loadError &&
      addresses.length === 0
    ">


    <div class="empty-icon">

      <ion-icon
        name="location-outline">
      </ion-icon>

    </div>


    <h2>

      No saved addresses

    </h2>


    <p class="muted">

      Add a delivery address
      so you're ready for checkout.

    </p>


    <ion-button
      routerLink="/add-address">

      <ion-icon
        slot="start"
        name="add-outline">
      </ion-icon>

      Add Address

    </ion-button>


  </div>



  <!-- =========================
       ADDRESS LIST
       ========================= -->

  <ng-container
    *ngIf="
      !loading &&
      !loadError &&
      addresses.length > 0
    ">


    <div class="address-heading">


      <h2>

        {{
          selectionMode
            ? 'Choose Delivery Address'
            : 'Saved Addresses'
        }}

      </h2>


      <p *ngIf="!selectionMode">

        {{
          addresses.length
        }}
        saved address{{
          addresses.length === 1
            ? ''
            : 'es'
        }}

      </p>


    </div>



    <!-- CHECKOUT SELECT MODE INFO -->

    <div
      class="select-hint"
      *ngIf="selectionMode">

      <ion-icon
        name="information-circle-outline">
      </ion-icon>

      Tap an address below to use it
      for this order.

    </div>



    <div class="list-stack">


      <div
        class="app-card address-card"

        *ngFor="
          let address of addresses;
          trackBy: trackAddress
        "

        [class.selected]="
          isSelected(address)
        "

        (click)="select(address)">


        <!-- TOP -->

        <div class="address-top">


          <div class="address-label">

            <ion-icon
              name="location-outline">
            </ion-icon>

            {{
              address.label ||
              'Address'
            }}

          </div>



          <div class="address-badges">


            <span
              class="default-badge"
              *ngIf="address.isDefault">

              Default

            </span>


            <ion-icon
              class="selected-icon"

              *ngIf="
                selectionMode &&
                isSelected(address)
              "

              name="checkmark-circle">
            </ion-icon>


          </div>


        </div>



        <!-- RECIPIENT -->

        <div class="recipient-name">

          {{
            address.recipient ||
            'Recipient'
          }}

        </div>


        <div
          class="recipient-phone"
          *ngIf="address.phone">

          {{ address.phone }}

        </div>



        <!-- FULL ADDRESS -->

        <div class="full-address">

          {{
            address.fullAddress ||
            fullAddress(address)
          }}

        </div>



        <!-- NORMAL MODE ACTIONS -->

        <div
          class="address-actions"

          *ngIf="!selectionMode">


          <ion-button
            size="small"
            fill="clear"

            (click)="
              $event.stopPropagation();
              edit(address)
            ">

            <ion-icon
              slot="start"
              name="create-outline">
            </ion-icon>

            Edit

          </ion-button>



          <ion-button
            size="small"

            fill="clear"

            color="danger"

            [disabled]="
              deletingId ===
              address.addressId
            "

            (click)="
              $event.stopPropagation();
              remove(address)
            ">


            <ion-spinner
              *ngIf="
                deletingId ===
                address.addressId
              "

              slot="start"

              name="crescent">
            </ion-spinner>


            <ion-icon
              *ngIf="
                deletingId !==
                address.addressId
              "

              slot="start"

              name="trash-outline">
            </ion-icon>


            Delete

          </ion-button>


        </div>



        <!-- SELECT MODE -->

        <div
          class="use-address"
          *ngIf="selectionMode">

          <span>

            {{
              isSelected(address)
                ? 'Currently selected'
                : 'Use this address'
            }}

          </span>


          <ion-icon
            [name]="
              isSelected(address)
                ? 'checkmark-circle-outline'
                : 'chevron-forward-outline'
            ">
          </ion-icon>

        </div>


      </div>


    </div>



    <!-- ADD NEW ADDRESS -->

    <ion-button

      class="add-address-btn"

      expand="block"

      fill="outline"

      routerLink="/add-address">


      <ion-icon
        slot="start"
        name="add-outline">
      </ion-icon>


      Add New Address


    </ion-button>


  </ng-container>


</div>


</ion-content>

`
})


export class AddressesPage {


  addresses:
    ShippingAddress[] = [];


  loading = true;


  selectionMode = false;


  loadError = '';


  deletingId:
    string | null = null;



  constructor(

    private service:
      AddressService,

    private state:
      AppStateService,

    private route:
      ActivatedRoute,

    private router:
      Router,

    private alerts:
      AlertController,

    private toastController:
      ToastController

  ) {


    this.selectionMode =
      this.route
        .snapshot
        .queryParamMap
        .get('select') === '1';

  }



  /* =========================
     PAGE ENTER
     ========================= */

  async ionViewWillEnter():
    Promise<void> {


    this.selectionMode =
      this.route
        .snapshot
        .queryParamMap
        .get('select') === '1';


    await this.loadAddresses();

  }



  /* =========================
     LOAD ADDRESSES
     ========================= */

  async loadAddresses():
    Promise<void> {


    this.loading = true;

    this.loadError = '';


    try {


      const rows =
        await this.service
          .listAddresses();


      this.addresses = [
        ...rows
      ].sort(
        (a, b) => {

          if (
            a.isDefault ===
            b.isDefault
          ) {

            return 0;

          }


          return a.isDefault
            ? -1
            : 1;

        }
      );


    } catch (error: any) {


      console.error(
        'Unable to load addresses:',
        error
      );


      this.addresses = [];


      this.loadError =
        error?.message ||
        'Please try again.';


    } finally {


      this.loading = false;

    }

  }



  /* =========================
     FULL ADDRESS
     ========================= */

  fullAddress(
    address: ShippingAddress
  ): string {


    const locality = [

      address.barangay,

      address.city

    ]
      .filter(Boolean)
      .join(', ');


    const postal =
      address.postalCode
        ? ` ${address.postalCode}`
        : '';


    return [

      address.street,

      locality
        ? `${locality}${postal}`
        : postal.trim()

    ]

      .filter(Boolean)

      .join(', ');

  }



  /* =========================
     SELECT ADDRESS
     ========================= */

  async select(
    address: ShippingAddress
  ): Promise<void> {


    if (!this.selectionMode) {

      return;

    }


    this.state.checkoutAddress =
      address;


    const toast =
      await this.toastController
        .create({

          message:
            `${address.label || 'Address'} selected.`,

          duration:
            1000,

          position:
            'bottom'

        });


    await toast.present();


    await this.router
      .navigateByUrl(
        '/checkout'
      );

  }



  /* =========================
     SELECTED ADDRESS
     ========================= */

  isSelected(
    address: ShippingAddress
  ): boolean {


    if (
      !address?.addressId ||
      !this.state.checkoutAddress
    ) {

      return false;

    }


    return (
      this.state
        .checkoutAddress
        .addressId
      ===
      address.addressId
    );

  }



  /* =========================
     EDIT
     ========================= */

  edit(
    address: ShippingAddress
  ): void {


    if (!address.addressId) {

      return;

    }


    this.router.navigate(

      ['/add-address'],

      {

        queryParams: {

          id:
            address.addressId

        }

      }

    );

  }



  /* =========================
     DELETE
     ========================= */

  async remove(
    address: ShippingAddress
  ): Promise<void> {


    if (
      !address.addressId ||
      this.deletingId
    ) {

      return;

    }


    const alert =
      await this.alerts
        .create({


          header:
            'Delete address?',


          message:
            address.isDefault

              ? 'This is your default address. Another saved address will become the default.'

              : 'This saved address will be removed.',


          buttons: [


            {
              text:
                'Cancel',

              role:
                'cancel'
            },


            {
              text:
                'Delete',

              role:
                'destructive',

              handler:
                () => {

                  void this
                    .performDelete(
                      address
                    );

                }
            }


          ]


        });


    await alert.present();

  }



  /* =========================
     PERFORM DELETE
     ========================= */

  private async performDelete(
    address: ShippingAddress
  ): Promise<void> {


    if (!address.addressId) {

      return;

    }


    this.deletingId =
      address.addressId;


    try {


      await this.service
        .deleteAddress(
          address.addressId
        );


      if (
        this.state
          .checkoutAddress
          ?.addressId
        ===
        address.addressId
      ) {

        this.state.checkoutAddress =
          null;

      }


      const toast =
        await this.toastController
          .create({

            message:
              'Address deleted.',

            duration:
              1200,

            position:
              'bottom'

          });


      await toast.present();


      await this.loadAddresses();


    } catch (error: any) {


      console.error(
        'Unable to delete address:',
        error
      );


      const alert =
        await this.alerts
          .create({

            header:
              'Unable to delete address',

            message:
              error?.message ||
              'Please try again.',

            buttons: [
              'OK'
            ]

          });


      await alert.present();


    } finally {


      this.deletingId =
        null;

    }

  }



  /* =========================
     TRACK ADDRESS
     ========================= */

  trackAddress(
    index: number,
    address: ShippingAddress
  ): string | number {


    return (
      address.addressId ||
      index
    );

  }


}