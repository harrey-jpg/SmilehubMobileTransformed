import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonicModule,
  AlertController
} from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AppStateService } from '../services/app-state.service';
import { ProductCardComponent } from '../shared/product-card.component';
import { Product } from '../models/product';


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
       HEADER INFO
       ========================= */

    .wishlist-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;

      margin-bottom: 14px;
    }

    .wishlist-heading h2 {
      margin: 0;

      font-size: 20px;
      font-weight: 900;
    }

    .wishlist-heading p {
      margin: 3px 0 0;

      font-size: 11px;

      color:
        var(--ion-color-medium);
    }

    .clear-button {
      flex-shrink: 0;

      font-size: 11px;
      font-weight: 800;
    }


    /* =========================
       EMPTY STATE
       ========================= */

    .wishlist-empty {
      min-height: 65vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      padding: 30px 20px;
    }

    .wishlist-empty-icon {
      width: 74px;
      height: 74px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      margin-bottom: 14px;

      background:
        rgba(var(--ion-color-primary-rgb), .12);

      color:
        var(--ion-color-primary);

      font-size: 34px;
    }

    .wishlist-empty h2 {
      margin: 0;

      font-size: 20px;
      font-weight: 900;
    }

    .wishlist-empty p {
      max-width: 260px;

      margin:
        7px auto
        18px;

      font-size: 12px;
      line-height: 1.5;
    }

    .browse-button {
      --border-radius: 12px;

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
      Wishlist
    </ion-title>


    <ion-buttons
      slot="end"
      *ngIf="products.length > 0">

      <ion-button
        color="danger"
        (click)="clearWishlist()">

        <ion-icon
          slot="icon-only"
          name="trash-outline">
        </ion-icon>

      </ion-button>

    </ion-buttons>


  </ion-toolbar>

</ion-header>



<ion-content>


  <div class="page-wrap no-bottom">


    <!-- =========================
         EMPTY WISHLIST
         ========================= -->

    <div
      class="wishlist-empty"
      *ngIf="products.length === 0">


      <div class="wishlist-empty-icon">

        <ion-icon
          name="heart-outline">
        </ion-icon>

      </div>


      <h2>

        Your wishlist is empty

      </h2>


      <p class="muted">

        Save dental supplies you like
        and come back to them anytime.

      </p>


      <ion-button
        class="browse-button"
        routerLink="/catalog">

        <ion-icon
          slot="start"
          name="search-outline">
        </ion-icon>

        Browse Products

      </ion-button>


    </div>



    <!-- =========================
         WISHLIST PRODUCTS
         ========================= -->

    <ng-container
      *ngIf="products.length > 0">


      <div class="wishlist-heading">


        <div>

          <h2>
            Saved Products
          </h2>

          <p>

            {{ products.length }}
            product{{
              products.length === 1
                ? ''
                : 's'
            }}

          </p>

        </div>


        <ion-button
          class="clear-button"

          fill="clear"

          color="danger"

          size="small"

          (click)="clearWishlist()">

          Clear All

        </ion-button>


      </div>



      <div class="product-grid">


        <app-product-card

          *ngFor="
            let product of products;
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

  get products(): Product[] {


    return [
      ...this.state.wishlist
    ]

      .map(
        id =>
          this.state.productById(id)
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
      this.products.length === 0
    ) {

      return;

    }


    const alert =
      await this.alerts.create({


        header:
          'Clear wishlist?',


        message:
          'All saved products will be removed from your wishlist.',


        buttons: [


          {
            text:
              'Cancel',

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


                const ids = [
                  ...this.state.wishlist
                ];


                ids.forEach(
                  id => {

                    this.state
                      .toggleWishlist(id);

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
  ): number {


    return (
      product?.id ||
      index
    );

  }


}