import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  IonicModule,
  AlertController
} from '@ionic/angular';

import { CommonModule } from '@angular/common';

import {
  AppStateService
} from '../services/app-state.service';

import {
  ProductCardComponent
} from '../shared/product-card.component';

import {
  Product
} from '../models/product';


@Component({
  selector: 'app-wishlist',
  standalone: true,

  imports: [
    RouterModule,
    IonicModule,
    CommonModule,
    ProductCardComponent
  ],

  styles: [`

    /* =========================
       PAGE
       ========================= */

    .wl-page {
      padding-bottom: 34px;
    }


    /* =========================
       INTRO
       ========================= */

    .wl-intro {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      gap: 14px;

      margin-bottom: 18px;
    }

    .wl-kicker {
      color:
        var(--ion-color-primary);

      font-size: 10px;
      font-weight: 900;

      letter-spacing: .8px;

      text-transform: uppercase;
    }

    .wl-title {
      margin:
        4px 0 4px;

      color:
        var(--ion-text-color);

      font-size: 23px;
      line-height: 1.2;

      font-weight: 900;
    }

    .wl-subtitle {
      margin: 0;

      color:
        var(--ion-color-medium);

      font-size: 11px;
      line-height: 1.45;
    }


    /* =========================
       CLEAR BUTTON
       ========================= */

    .wl-clear {
      flex-shrink: 0;

      min-height: 34px;

      margin: 0;

      --border-radius: 10px;

      font-size: 9px;
      font-weight: 900;

      text-transform: none;
    }


    /* =========================
       SUMMARY CARD
       ========================= */

    .wl-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;

      margin-bottom: 15px;

      padding: 13px 14px;

      border-radius: 17px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .06
        );

      border:
        1px solid
        rgba(
          var(--ion-color-primary-rgb),
          .08
        );
    }

    .wl-summary-left {
      display: flex;
      align-items: center;

      gap: 11px;

      min-width: 0;
    }

    .wl-summary-icon {
      width: 38px;
      height: 38px;

      flex: 0 0 38px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 12px;

      background:
        rgba(
          var(--ion-color-danger-rgb),
          .10
        );

      color:
        var(--ion-color-danger);
    }

    .wl-summary-icon ion-icon {
      font-size: 19px;
    }

    .wl-summary-title {
      color:
        var(--ion-text-color);

      font-size: 11px;
      font-weight: 900;
    }

    .wl-summary-text {
      margin-top: 2px;

      color:
        var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.4;
    }

    .wl-count {
      flex-shrink: 0;

      display: inline-flex;
      align-items: center;
      justify-content: center;

      min-width: 30px;
      height: 30px;

      padding:
        0 9px;

      border-radius: 999px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .11
        );

      color:
        var(--ion-color-primary);

      font-size: 10px;
      font-weight: 900;
    }


    /* =========================
       PRODUCT GRID
       ========================= */

    .wl-grid {
      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 12px;
    }


    /* =========================
       EMPTY STATE
       ========================= */

    .wl-empty {
      min-height: 67vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      padding:
        30px 20px;

      text-align: center;
    }

    .wl-empty-icon {
      width: 82px;
      height: 82px;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-bottom: 16px;

      border-radius: 24px;

      background:
        rgba(
          var(--ion-color-danger-rgb),
          .09
        );

      color:
        var(--ion-color-danger);
    }

    .wl-empty-icon ion-icon {
      font-size: 38px;
    }

    .wl-empty-kicker {
      margin-bottom: 5px;

      color:
        var(--ion-color-primary);

      font-size: 9px;
      font-weight: 900;

      letter-spacing: .7px;

      text-transform: uppercase;
    }

    .wl-empty h2 {
      margin: 0;

      color:
        var(--ion-text-color);

      font-size: 21px;
      font-weight: 900;
    }

    .wl-empty p {
      max-width: 275px;

      margin:
        8px auto
        18px;

      color:
        var(--ion-color-medium);

      font-size: 11px;
      line-height: 1.55;
    }

    .wl-browse {
      min-height: 44px;

      margin: 0;

      --border-radius: 13px;

      font-size: 10px;
      font-weight: 900;

      text-transform: none;
    }


    /* =========================
       LIGHT MODE
       ========================= */

    @media (prefers-color-scheme: light) {

      .wl-summary {
        background: #ffffff;

        border-color:
          rgba(
            40,
            60,
            80,
            .08
          );

        box-shadow:
          0 7px 18px
          rgba(
            27,
            44,
            64,
            .04
          );
      }

    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (min-width: 720px) {

      .wl-grid {
        grid-template-columns:
          repeat(
            3,
            minmax(0, 1fr)
          );

        gap: 14px;
      }

    }


    @media (min-width: 1050px) {

      .wl-grid {
        grid-template-columns:
          repeat(
            4,
            minmax(0, 1fr)
          );
      }

    }


    @media (max-width: 370px) {

      .wl-intro {
        align-items: flex-start;

        flex-direction: column;
      }

      .wl-clear {
        align-self: flex-end;
      }

      .wl-grid {
        gap: 9px;
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
      Wishlist
    </ion-title>



  </ion-toolbar>

</ion-header>



<ion-content>


  <div class="page-wrap no-bottom wl-page">



    <!-- =========================
         EMPTY
         ========================= -->

    <div
      class="wl-empty"

      *ngIf="
        products.length === 0
      ">


      <div class="wl-empty-icon">

        <ion-icon
          name="heart-outline">
        </ion-icon>

      </div>


      <div class="wl-empty-kicker">

        SmileHub Wishlist

      </div>


      <h2>

        Your wishlist is empty

      </h2>


      <p>

        Save dental supplies you're
        interested in so you can easily
        find them again later.

      </p>


      <ion-button
        class="wl-browse"

        routerLink="/catalog">


        <ion-icon
          slot="start"

          name="search-outline">
        </ion-icon>


        Browse Products


      </ion-button>


    </div>



    <!-- =========================
         CONTENT
         ========================= -->

    <ng-container
      *ngIf="
        products.length > 0
      ">



      <!-- INTRO -->

      <div class="wl-intro">


        <div>


          <div class="wl-kicker">

            SmileHub Wishlist

          </div>


          <h1 class="wl-title">

            Saved Products

          </h1>


          <p class="wl-subtitle">

            Keep track of dental supplies
            you may want to order later.

          </p>


        </div>



        <ion-button
          class="wl-clear"

          fill="clear"

          color="danger"

          size="small"

          (click)="
            clearWishlist()
          ">


          <ion-icon
            slot="start"

            name="trash-outline">
          </ion-icon>


          Clear All


        </ion-button>


      </div>



      <!-- =========================
           SUMMARY
           ========================= -->

      <div class="wl-summary">


        <div class="wl-summary-left">


          <div class="wl-summary-icon">

            <ion-icon
              name="heart-outline">
            </ion-icon>

          </div>


          <div>


            <div class="wl-summary-title">

              Your saved items

            </div>


            <div class="wl-summary-text">

              Tap a product to view
              details or add it to cart.

            </div>


          </div>


        </div>


        <div class="wl-count">

          {{ products.length }}

        </div>


      </div>



      <!-- =========================
           PRODUCTS
           ========================= -->

      <div class="wl-grid">


        <app-product-card

          *ngFor="
            let product
            of products;
            trackBy: trackProduct
          "

          [product]="product">

        </app-product-card>


      </div>


    </ng-container>


  </div>


</ion-content>

`

})


export class WishlistPage {


  constructor(

    public state:
      AppStateService,

    private alerts:
      AlertController

  ) {}



  /* =========================
     WISHLIST PRODUCTS
     ========================= */

  get products():
    Product[] {


    return [
      ...this.state.wishlist
    ]

      .map(

        id =>
          this.state
            .productById(
              id
            )

      )

      .filter(

        (
          product
        ): product is Product =>
          !!product

      );


  }



  /* =========================
     CLEAR WISHLIST
     ========================= */

  async clearWishlist():
    Promise<void> {


    if (
      this.products.length ===
      0
    ) {


      return;


    }


    const alert =
      await this.alerts
        .create({


          header:
            'Clear wishlist?',


          message:
            'All saved products will be removed from your wishlist.',


          buttons: [


            {

              text:
                'Keep Items',

              role:
                'cancel'

            },


            {

              text:
                'Clear All',

              role:
                'destructive',

              handler:
                () => {


                  const ids =
                    [
                      ...this.state.wishlist
                    ];


                  ids.forEach(

                    id => {


                      this.state
                        .toggleWishlist(
                          id
                        );


                    }

                  );


                }

            }


          ]


        });


    await alert.present();


  }



  /* =========================
     TRACK PRODUCT
     ========================= */

  trackProduct(
    index: number,
    product: Product
  ):
    number {


    return (
      product?.id
      ||
      index
    );


  }


}