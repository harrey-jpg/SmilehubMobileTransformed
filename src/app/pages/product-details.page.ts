import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  IonicModule,
  ToastController
} from '@ionic/angular';

import {
  CommonModule
} from '@angular/common';

import {
  AppStateService
} from '../services/app-state.service';

import {
  ReviewService,
  ProductReview
} from '../services/review.service';

import {
  NotificationService
} from '../services/notification.service';

import {
  Product
} from '../models/product';


@Component({

  selector: 'app-product-details',

  standalone: true,

  imports: [
    RouterModule,
    IonicModule,
    CommonModule
  ],


  styles: [`

    /* =========================
       PAGE
       ========================= */

    .product-page {
      padding-bottom: 30px;
    }


    /* =========================
       PRODUCT HERO
       ========================= */

    .product-hero {
      border-radius: 24px;

      overflow: hidden;

      background:
        var(--ion-card-background);

      padding: 14px;
    }


    .product-art {
      min-height: 265px;

      display: flex;
      align-items: center;
      justify-content: center;

      position: relative;

      border-radius: 20px;

      overflow: hidden;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .07
        );
    }


    .product-art img {
      width: 220px;
      height: 220px;

      max-width: 88%;

      object-fit: contain;

      transition:
        transform .2s ease;
    }


    .product-art:hover img {
      transform:
        scale(1.03);
    }


    /* =========================
       STOCK HERO BADGE
       ========================= */

    .hero-stock {
      position: absolute;

      left: 12px;
      top: 12px;

      display: inline-flex;
      align-items: center;

      padding: 6px 10px;

      border-radius: 999px;

      font-size: 9px;
      font-weight: 900;

      background:
        rgba(
          var(--ion-color-success-rgb),
          .15
        );

      color:
        var(--ion-color-success);
    }


    .hero-stock.low {
      background:
        rgba(
          var(--ion-color-warning-rgb),
          .16
        );

      color:
        var(--ion-color-warning);
    }


    .hero-stock.out {
      background:
        rgba(
          var(--ion-color-danger-rgb),
          .16
        );

      color:
        var(--ion-color-danger);
    }


    /* =========================
       PRODUCT INFO
       ========================= */

    .product-info {
      padding:
        18px 3px 0;
    }


    .product-brand {
      display: flex;
      align-items: center;

      gap: 7px;

      color:
        var(--ion-color-primary);

      font-size: 10px;
      font-weight: 900;

      letter-spacing: .5px;

      text-transform: uppercase;
    }


    .brand-dot {
      width: 4px;
      height: 4px;

      border-radius: 50%;

      background:
        var(--ion-color-primary);

      opacity: .6;
    }


    .product-name {
      margin:
        7px 0 10px;

      font-size: 24px;
      line-height: 1.18;

      font-weight: 900;
    }


    .price-rating-row {
      display: flex;

      align-items: flex-end;
      justify-content: space-between;

      gap: 14px;
    }


    .price {
      color:
        var(--ion-color-primary);

      font-size: 23px;
      font-weight: 900;
    }


    .rating-wrap {
      min-width: 0;

      display: flex;
      align-items: center;

      gap: 5px;

      font-size: 11px;
      font-weight: 800;

      white-space: nowrap;
    }


    .rating-star {
      color: #f4b400;
    }


    .rating-count {
      font-size: 9px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       DESCRIPTION
       ========================= */

    .description {
      margin:
        14px 0 0;

      font-size: 12px;
      line-height: 1.6;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       LOW STOCK
       ========================= */

    .stock-warning {
      margin-top: 12px;

      padding: 10px 12px;

      border-radius: 13px;

      font-size: 10px;
      font-weight: 800;

      background:
        rgba(
          var(--ion-color-warning-rgb),
          .10
        );

      color:
        var(--ion-color-warning);
    }


    /* =========================
       QUANTITY CARD
       ========================= */

    .quantity-card {
      margin-top: 18px;

      padding: 16px;

      border-radius: 18px;
    }


    .quantity-header {
      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 12px;
    }


    .quantity-title {
      font-size: 13px;
      font-weight: 900;
    }


    .quantity-stock {
      font-size: 10px;

      color:
        var(--ion-color-medium);
    }


    .qty-row {
      margin-top: 14px;

      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 14px;
    }


    .qty-controls {
      display: inline-flex;

      align-items: center;

      gap: 7px;

      padding: 5px;

      border-radius: 14px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .07
        );
    }


    .qty-controls button {
      width: 38px;
      height: 38px;

      border: none;

      border-radius: 11px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .13
        );

      color:
        var(--ion-color-primary);

      font-size: 20px;
      font-weight: 900;

      cursor: pointer;
    }


    .qty-controls button:disabled {
      opacity: .35;

      cursor: default;
    }


    .qty-value {
      width: 36px;

      text-align: center;

      font-size: 16px;
      font-weight: 900;
    }


    .qty-total-label {
      text-align: right;

      font-size: 9px;

      color:
        var(--ion-color-medium);
    }


    .qty-total {
      margin-top: 2px;

      text-align: right;

      color:
        var(--ion-color-primary);

      font-size: 16px;
      font-weight: 900;
    }


    .cart-stock-note {
      margin-top: 11px;

      font-size: 10px;
      line-height: 1.45;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       ACTIONS
       ========================= */

    .product-actions {
      margin-top: 14px;

      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 10px;
    }


    .product-actions ion-button {
      min-height: 46px;

      margin: 0;

      --border-radius: 14px;

      font-size: 12px;
      font-weight: 900;
    }


    /* =========================
       STOCK ALERT
       ========================= */

    .stock-alert-wrap {
      margin-top: 11px;
    }


    .stock-alert-button {
      margin: 0;

      --border-radius: 14px;

      font-weight: 900;
    }


    .stock-alert-note {
      margin-top: 8px;

      padding: 10px 12px;

      border-radius: 12px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .08
        );

      color:
        var(--ion-color-medium);

      font-size: 9px;
      line-height: 1.45;
    }


    /* =========================
       SECTION TITLE
       ========================= */

    .section-title {
      margin:
        24px 2px 10px;

      font-size: 15px;
      font-weight: 900;
    }


    /* =========================
       PRODUCT DETAILS
       ========================= */

    .details-card {
      padding:
        6px 15px;

      border-radius: 18px;
    }


    .detail-row {
      min-height: 45px;

      display: flex;

      align-items: center;
      justify-content: space-between;

      gap: 18px;

      border-bottom:
        1px solid
        rgba(120,120,120,.10);

      font-size: 11px;
    }


    .detail-row:last-child {
      border-bottom: none;
    }


    .detail-label {
      color:
        var(--ion-color-medium);
    }


    .detail-value {
      text-align: right;

      font-weight: 900;
    }


    /* =========================
       SPECS
       ========================= */

    .spec-card {
      padding:
        7px 15px;

      border-radius: 18px;
    }


    .spec-row {
      min-height: 42px;

      display: flex;

      align-items: center;

      gap: 10px;

      border-bottom:
        1px solid
        rgba(120,120,120,.10);

      font-size: 11px;
      line-height: 1.45;
    }


    .spec-row:last-child {
      border-bottom: none;
    }


    .spec-row ion-icon {
      flex-shrink: 0;

      color:
        var(--ion-color-primary);

      font-size: 17px;
    }


    /* =========================
       REVIEWS
       ========================= */

    .review-summary {
      padding: 18px;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      border-radius: 18px;
    }


    .review-score {
      font-size: 32px;
      font-weight: 900;

      line-height: 1;
    }


    .review-stars {
      margin-top: 7px;

      color: #f4b400;

      font-size: 16px;
      letter-spacing: 2px;
    }


    .review-count {
      margin-top: 7px;

      font-size: 10px;

      color:
        var(--ion-color-medium);
    }


    .review-card {
      margin-top: 10px;

      padding: 15px;

      border-radius: 18px;
    }


    .review-header {
      display: flex;

      align-items: flex-start;
      justify-content: space-between;

      gap: 12px;
    }


    .review-user {
      font-size: 12px;
      font-weight: 900;
    }


    .review-date {
      margin-top: 3px;

      font-size: 9px;

      color:
        var(--ion-color-medium);
    }


    .review-rating {
      color: #f4b400;

      font-size: 12px;

      letter-spacing: 1px;

      white-space: nowrap;
    }


    .review-comment {
      margin:
        11px 0 0;

      font-size: 11px;
      line-height: 1.55;
    }


    .review-state-card {
      min-height: 135px;

      padding: 20px;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      border-radius: 18px;
    }


    .review-empty-star {
      margin-bottom: 8px;

      font-size: 34px;

      line-height: 1;
    }


    .review-state-title {
      margin-top: 5px;

      font-size: 13px;
      font-weight: 900;
    }


    .review-state-text {
      margin-top: 5px;

      font-size: 10px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       RELATED PRODUCTS
       ========================= */

    .related-scroll {
      display: flex;

      gap: 10px;

      overflow-x: auto;
      overflow-y: hidden;

      padding:
        2px 1px 8px;

      scrollbar-width: none;
    }


    .related-scroll::-webkit-scrollbar {
      display: none;
    }


    .related-card {
      width: 155px;
      min-width: 155px;

      padding: 11px;

      border-radius: 17px;

      cursor: pointer;
    }


    .related-image {
      height: 112px;

      display: flex;

      align-items: center;
      justify-content: center;

      margin-bottom: 9px;

      border-radius: 13px;

      overflow: hidden;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .06
        );
    }


    .related-image img {
      width: 90px;
      height: 90px;

      object-fit: contain;
    }


    .related-brand {
      color:
        var(--ion-color-primary);

      font-size: 8px;
      font-weight: 900;

      text-transform: uppercase;
    }


    .related-name {
      min-height: 34px;

      margin-top: 4px;

      font-size: 11px;
      line-height: 1.4;

      font-weight: 800;

      overflow: hidden;

      display: -webkit-box;

      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }


    .related-price {
      margin-top: 7px;

      color:
        var(--ion-color-primary);

      font-size: 12px;
      font-weight: 900;
    }


    /* =========================
       HEADER
       ========================= */

    .header-actions {
      display: flex;
      align-items: center;
    }


    .icon-btn {
      position: relative;
    }


    .header-badge {
      position: absolute;

      top: 2px;
      right: 1px;

      min-width: 16px;
      height: 16px;

      padding: 2px 4px;

      display: flex;

      align-items: center;
      justify-content: center;

      border-radius: 999px;

      font-size: 8px;
      font-weight: 900;
    }


    /* =========================
       PRODUCT NOT FOUND
       ========================= */

    .not-found {
      min-height: 100%;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      padding: 30px;
    }


    .not-found-icon {
      width: 72px;
      height: 72px;

      display: flex;

      align-items: center;
      justify-content: center;

      margin-bottom: 12px;

      border-radius: 22px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      font-size: 34px;
    }


    .not-found h2 {
      margin:
        0 0 6px;

      font-weight: 900;
    }


    .not-found p {
      margin:
        0 0 18px;

      font-size: 11px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (min-width: 720px) {

      .product-hero {
        display: grid;

        grid-template-columns:
          1fr 1fr;

        gap: 24px;

        align-items: center;

        padding: 20px;
      }


      .product-info {
        padding: 10px;
      }


      .product-art {
        min-height: 340px;
      }


      .product-art img {
        width: 280px;
        height: 280px;
      }

    }


  `],


  template: `

<!-- =========================
     HEADER
     ========================= -->

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        defaultHref="/catalog">
      </ion-back-button>

    </ion-buttons>


    <ion-title>

      Product Details

    </ion-title>


    <ion-buttons
      slot="end"
      class="header-actions">


      <ion-button

        *ngIf="product as p"

        class="icon-btn"

        (click)="toggleWishlist()">


        <ion-icon

          [name]="
            state.wishlist.has(p.id)
              ? 'heart'
              : 'heart-outline'
          ">

        </ion-icon>


      </ion-button>


      <ion-button

        routerLink="/cart"

        class="icon-btn">


        <ion-icon
          name="cart-outline">
        </ion-icon>


        <ion-badge

          color="danger"

          class="header-badge"

          *ngIf="state.cartCount > 0">


          {{ badgeText(state.cartCount) }}


        </ion-badge>


      </ion-button>


    </ion-buttons>


  </ion-toolbar>

</ion-header>



<!-- =========================
     PRODUCT
     ========================= -->

<ion-content
  *ngIf="product as p">


  <div class="page-wrap no-bottom product-page">


    <!-- =========================
         HERO
         ========================= -->

    <div class="product-hero">


      <div class="product-art">


        <img

          [src]="productImage(p)"

          [alt]="p.name">


        <span

          class="hero-stock"

          [class.low]="isLowStock"

          [class.out]="isOutOfStock">


          {{ stockLabel }}


        </span>


      </div>



      <div class="product-info">


        <div class="product-brand">


          <span>
            {{ p.brand }}
          </span>


          <span class="brand-dot">
          </span>


          <span>
            {{ p.category }}
          </span>


        </div>



        <h1 class="product-name">

          {{ p.name }}

        </h1>



        <div class="price-rating-row">


          <div class="price">

            {{ money(p.price) }}

          </div>



          <div class="rating-wrap">


            <ng-container
              *ngIf="
                reviewCount > 0;
                else noRating
              ">


              <span class="rating-star">
                ★
              </span>


              <span>
                {{ averageRating.toFixed(1) }}
              </span>


              <span class="rating-count">

                ({{ reviewCount }})

              </span>


            </ng-container>



            <ng-template #noRating>

              <span class="rating-count">

                No reviews yet

              </span>

            </ng-template>


          </div>


        </div>



        <div

          class="stock-warning"

          *ngIf="
            isLowStock &&
            !isOutOfStock
          ">


          Only {{ availableStock }}

          item{{
            availableStock === 1
              ? ''
              : 's'
          }}

          left in stock.


        </div>



        <p class="description">

          {{ p.description }}

        </p>


      </div>


    </div>



    <!-- =========================
         QUANTITY
         ========================= -->

    <div class="app-card quantity-card">


      <div class="quantity-header">


        <div class="quantity-title">

          Select Quantity

        </div>


        <div

          class="quantity-stock"

          *ngIf="
            availableStock !== null
          ">


          {{ availableStock }}
          available


        </div>


      </div>



      <div class="qty-row">


        <div class="qty-controls">


          <button

            type="button"

            [disabled]="
              quantity <= 1
            "

            (click)="decreaseQuantity()">

            −

          </button>


          <div class="qty-value">

            {{ quantity }}

          </div>


          <button

            type="button"

            [disabled]="
              isOutOfStock ||
              reachedMaximumStock
            "

            (click)="increaseQuantity()">

            +

          </button>


        </div>



        <div>


          <div class="qty-total-label">

            Subtotal

          </div>


          <div class="qty-total">

            {{ money(p.price * quantity) }}

          </div>


        </div>


      </div>



      <div

        class="cart-stock-note"

        *ngIf="
          existingCartQuantity > 0
        ">


        You already have

        {{ existingCartQuantity }}

        item{{
          existingCartQuantity === 1
            ? ''
            : 's'
        }}

        of this product in your cart.


      </div>


    </div>



    <!-- =========================
         ACTIONS
         ========================= -->

    <div class="product-actions">


      <ion-button

        fill="outline"

        [disabled]="
          isOutOfStock ||
          !canAddSelectedQuantity
        "

        (click)="add()">


        <ion-icon

          *ngIf="addedToCart"

          slot="start"

          name="checkmark-circle-outline">

        </ion-icon>


        {{
          addedToCart
            ? 'Added!'
            : 'Add to Cart'
        }}


      </ion-button>



      <ion-button

        class="primary-btn"

        [disabled]="
          isOutOfStock ||
          !canBuySelectedQuantity
        "

        (click)="buyNow()">


        {{
          isOutOfStock
            ? 'Out of Stock'
            : 'Buy Now'
        }}


      </ion-button>


    </div>



    <!-- =========================
         BACK IN STOCK
         ========================= -->

    <div

      class="stock-alert-wrap"

      *ngIf="isOutOfStock">


      <ion-button

        class="stock-alert-button"

        expand="block"

        [fill]="
          stockAlertEnabled
            ? 'outline'
            : 'solid'
        "

        [disabled]="
          stockAlertBusy
        "

        (click)="toggleStockAlert()">


        <ion-spinner

          *ngIf="stockAlertBusy"

          slot="start"

          name="crescent">

        </ion-spinner>


        <ion-icon

          *ngIf="!stockAlertBusy"

          slot="start"

          name="notifications-outline">

        </ion-icon>


        {{
          stockAlertBusy
            ? 'Updating...'
            : stockAlertEnabled
              ? 'Cancel Stock Alert'
              : 'Notify Me When Available'
        }}


      </ion-button>



      <div

        class="stock-alert-note"

        *ngIf="stockAlertEnabled">


        Stock alert is on.
        SmileHub will notify you
        when this product becomes
        available again while
        the app is active.


      </div>


    </div>



    <!-- =========================
         PRODUCT INFORMATION
         ========================= -->

    <div class="section-title">

      Product Information

    </div>


    <div class="app-card details-card">


      <div class="detail-row">

        <span class="detail-label">
          Brand
        </span>

        <span class="detail-value">
          {{ p.brand || '—' }}
        </span>

      </div>



      <div class="detail-row">

        <span class="detail-label">
          Category
        </span>

        <span class="detail-value">
          {{ p.category || '—' }}
        </span>

      </div>



      <div
        class="detail-row"
        *ngIf="p.sku">

        <span class="detail-label">
          SKU
        </span>

        <span class="detail-value">
          {{ p.sku }}
        </span>

      </div>



      <div class="detail-row">

        <span class="detail-label">
          Availability
        </span>

        <span class="detail-value">
          {{ stockLabel }}
        </span>

      </div>


    </div>



    <!-- =========================
         SPECIFICATIONS
         ========================= -->

    <ng-container

      *ngIf="
        p.specs &&
        p.specs.length > 0
      ">


      <div class="section-title">

        Specifications

      </div>


      <div class="app-card spec-card">


        <div

          class="spec-row"

          *ngFor="
            let spec of p.specs
          ">


          <ion-icon
            name="checkmark-circle-outline">
          </ion-icon>


          <span>

            {{ spec }}

          </span>


        </div>


      </div>


    </ng-container>



    <!-- =========================
         CUSTOMER REVIEWS
         ========================= -->

    <div class="section-title">

      Customer Reviews

    </div>



    <ng-container

      *ngIf="
        !loadingReviews &&
        reviewCount > 0
      ">


      <div class="app-card review-summary">


        <div class="review-score">

          {{ averageRating.toFixed(1) }}

        </div>


        <div class="review-stars">

          {{ starsForAverage() }}

        </div>


        <div class="review-count">

          {{
            reviewCount === 1
              ? '1 customer review'
              : reviewCount + ' customer reviews'
          }}

        </div>


      </div>



      <div

        class="app-card review-card"

        *ngFor="
          let review of reviews
        ">


        <div class="review-header">


          <div>


            <div class="review-user">

              {{
                review.userName ||
                'SmileHub Customer'
              }}

            </div>


            <div class="review-date">

              {{
                reviewDate(
                  review.createdAt
                )
              }}

            </div>


          </div>



          <div class="review-rating">

            {{
              stars(
                review.rating
              )
            }}

          </div>


        </div>



        <p class="review-comment">

          {{ review.comment }}

        </p>


      </div>


    </ng-container>



    <!-- =========================
         REVIEW LOADING
         ========================= -->

    <div

      class="app-card review-state-card"

      *ngIf="
        loadingReviews
      ">


      <ion-spinner
        name="crescent">
      </ion-spinner>


      <div class="review-state-title">

        Loading reviews...

      </div>


    </div>



    <!-- =========================
         NO REVIEWS
         ========================= -->

    <div

      class="app-card review-state-card"

      *ngIf="
        !loadingReviews &&
        reviewCount === 0
      ">


      <div class="review-empty-star">

        ☆

      </div>


      <div class="review-state-title">

        No reviews yet

      </div>


      <div class="review-state-text">

        Customer reviews will appear here.

      </div>


    </div>



    <!-- =========================
         RELATED PRODUCTS
         ========================= -->

    <ng-container

      *ngIf="
        relatedProducts.length > 0
      ">


      <div class="section-title">

        You May Also Like

      </div>


      <div class="related-scroll">


        <div

          class="app-card related-card"

          *ngFor="
            let related
            of relatedProducts
          "

          (click)="openProduct(related)">


          <div class="related-image">


            <img

              [src]="productImage(related)"

              [alt]="related.name">


          </div>



          <div class="related-brand">

            {{ related.brand }}

          </div>


          <div class="related-name">

            {{ related.name }}

          </div>


          <div class="related-price">

            {{ money(related.price) }}

          </div>


        </div>


      </div>


    </ng-container>


  </div>


</ion-content>



<!-- =========================
     PRODUCT NOT FOUND
     ========================= -->

<ion-content
  *ngIf="!product">


  <div class="not-found">


    <div class="not-found-icon">

      🔍

    </div>


    <h2>

      Product not found

    </h2>


    <p>

      This product may no longer be available.

    </p>


    <ion-button

      routerLink="/catalog"

      fill="outline">

      Back to Catalog

    </ion-button>


  </div>


</ion-content>

`

})


export class ProductDetailsPage
implements OnInit, OnDestroy {


  product?:
    Product;


  quantity =
    1;


  addedToCart =
    false;


  stockAlertEnabled =
    false;


  stockAlertBusy =
    false;


  reviews:
    ProductReview[] = [];


  loadingReviews =
    false;


  averageRating =
    0;


  reviewCount =
    0;


  private addedTimer?:
    ReturnType<typeof setTimeout>;



  constructor(

    private route:
      ActivatedRoute,

    public state:
      AppStateService,

    private router:
      Router,

    private toastController:
      ToastController,

    private reviewService:
      ReviewService,

    private notificationService:
      NotificationService

  ) {}



  /* =========================
     INITIAL LOAD
     ========================= */

  ngOnInit():
    void {


    this.refreshProduct();


    void this
      .loadReviews();


    void this
      .loadStockAlertState();


  }



  /* =========================
     PAGE ENTER
     ========================= */

  async ionViewWillEnter():
    Promise<void> {


    await this.state
      .loadProductsFromFirestore();


    this.refreshProduct();


    await this
      .loadReviews();


    await this
      .loadStockAlertState();


  }



  /* =========================
     REFRESH PRODUCT
     ========================= */

  private refreshProduct():
    void {


    const id =
      Number(
        this.route
          .snapshot
          .paramMap
          .get('id')
      );


    if (
      !Number.isFinite(id)
    ) {


      this.product =
        undefined;


      return;


    }


    const found =
      this.state.products
        .find(
          product =>
            product.id === id
        );


    if (
      !found
    ) {


      this.product =
        undefined;


      return;


    }


    this.product =
      found;


    this.state
      .markProductViewed(
        found.id
      );


    if (
      this.availableStock !== null
      &&
      this.availableStock > 0
      &&
      this.quantity >
        this.availableStock
    ) {


      this.quantity =
        this.availableStock;


    }


    if (
      this.quantity < 1
    ) {


      this.quantity =
        1;


    }


  }



  /* =========================
     PRODUCT IMAGE
     ========================= */

  productImage(
    product: Product
  ):
    string {


    return (

      product.image

      ||

      product.imageAsset

      ||

      'assets/products/default.svg'

    );


  }



  /* =========================
     AVAILABLE STOCK
     ========================= */

  get availableStock():
    number | null {


    if (
      !this.product
    ) {

      return null;

    }


    if (
      typeof this.product.stockCount
        === 'number'
      &&
      Number.isFinite(
        this.product.stockCount
      )
    ) {


      return Math.max(

        0,

        Math.floor(
          this.product.stockCount
        )

      );


    }


    const stockText =
      String(
        this.product.stock
        ??
        ''
      )
        .trim();


    if (
      /^[0-9]+$/.test(
        stockText
      )
    ) {


      return Math.max(

        0,

        Number(
          stockText
        )

      );


    }


    return null;


  }



  /* =========================
     OUT OF STOCK
     ========================= */

  get isOutOfStock():
    boolean {


    if (
      !this.product
    ) {

      return true;

    }


    if (
      this.availableStock !== null
    ) {


      return (
        this.availableStock <= 0
      );


    }


    const stock =
      String(
        this.product.stock
        ||
        ''
      )
        .trim()
        .toLowerCase();


    return (

      stock ===
        'out of stock'

      ||

      stock ===
        'sold out'

      ||

      stock ===
        'unavailable'

      ||

      stock ===
        '0'

    );


  }



  /* =========================
     LOW STOCK
     ========================= */

  get isLowStock():
    boolean {


    return (

      this.availableStock !== null

      &&

      this.availableStock > 0

      &&

      this.availableStock <= 10

    );


  }



  /* =========================
     STOCK LABEL
     ========================= */

  get stockLabel():
    string {


    if (
      this.isOutOfStock
    ) {


      return 'Out of Stock';


    }


    if (
      this.availableStock !== null
    ) {


      if (
        this.availableStock <= 10
      ) {


        return (
          'Only '
          +
          this.availableStock
          +
          ' left'
        );


      }


      return (
        this.availableStock
        +
        ' in stock'
      );


    }


    return (

      this.product?.stock

      ||

      'Available'

    );


  }



  /* =========================
     EXISTING CART QUANTITY
     ========================= */

  get existingCartQuantity():
    number {


    if (
      !this.product
    ) {

      return 0;

    }


    return this.state
      .quantityFor(
        this.product.id
      );


  }



  /* =========================
     REMAINING STOCK
     ========================= */

  get remainingStockForCart():
    number | null {


    if (
      this.availableStock === null
    ) {

      return null;

    }


    return Math.max(

      0,

      this.availableStock
      -
      this.existingCartQuantity

    );


  }



  /* =========================
     MAXIMUM STOCK
     ========================= */

  get reachedMaximumStock():
    boolean {


    if (
      this.availableStock === null
    ) {

      return false;

    }


    return (

      this.quantity >=
      this.availableStock

    );


  }



  /* =========================
     CAN ADD TO CART
     ========================= */

  get canAddSelectedQuantity():
    boolean {


    if (
      this.isOutOfStock
    ) {

      return false;

    }


    if (
      this.remainingStockForCart ===
        null
    ) {

      return true;

    }


    return (

      this.quantity <=
      this.remainingStockForCart

    );


  }



  /* =========================
     CAN BUY
     ========================= */

  get canBuySelectedQuantity():
    boolean {


    if (
      this.isOutOfStock
    ) {

      return false;

    }


    if (
      this.availableStock ===
        null
    ) {

      return true;

    }


    return (

      this.quantity <=
      this.availableStock

    );


  }



  /* =========================
     QUANTITY
     ========================= */

  decreaseQuantity():
    void {


    if (
      this.quantity > 1
    ) {


      this.quantity--;


    }


  }



  async increaseQuantity():
    Promise<void> {


    if (
      this.isOutOfStock
    ) {

      return;

    }


    if (
      this.availableStock !== null
      &&
      this.quantity >=
        this.availableStock
    ) {


      await this.showToast(

        this.availableStock === 1

          ? 'Only 1 item is available.'

          : 'Only '
            +
            this.availableStock
            +
            ' items are available.'

      );


      return;


    }


    this.quantity++;


  }



  /* =========================
     LOAD STOCK ALERT
     ========================= */

  private async loadStockAlertState():
    Promise<void> {


    if (
      !this.product
    ) {


      this.stockAlertEnabled =
        false;


      return;


    }


    try {


      this.stockAlertEnabled =
        await this
          .notificationService
          .isStockAlertEnabled(
            this.product.id
          );


    } catch {


      this.stockAlertEnabled =
        false;


    }


  }



  /* =========================
     TOGGLE STOCK ALERT
     ========================= */

  async toggleStockAlert():
    Promise<void> {


    if (
      !this.product
      ||
      this.stockAlertBusy
    ) {

      return;

    }


    if (
      !this.isOutOfStock
      &&
      !this.stockAlertEnabled
    ) {


      await this.showToast(
        'This product is currently available.'
      );


      return;


    }


    this.stockAlertBusy =
      true;


    try {


      if (
        this.stockAlertEnabled
      ) {


        await this
          .notificationService
          .disableStockAlert(
            this.product.id
          );


        this.stockAlertEnabled =
          false;


        await this.showToast(
          'Stock alert cancelled.'
        );


      } else {


        await this
          .notificationService
          .enableStockAlert(
            this.product.id
          );


        this.stockAlertEnabled =
          true;


        await this.showToast(

          'We will notify you when '
          +
          this.product.name
          +
          ' is available again.'

        );


      }


    } catch (
      error: any
    ) {


      console.error(
        'Stock alert error:',
        error
      );


      await this.showToast(

        error?.message
        ||
        'Unable to update stock alert.'

      );


    } finally {


      this.stockAlertBusy =
        false;


    }


  }



  /* =========================
     WISHLIST
     ========================= */

  async toggleWishlist():
    Promise<void> {


    if (
      !this.product
    ) {

      return;

    }


    const wasSaved =
      this.state.wishlist
        .has(
          this.product.id
        );


    this.state
      .toggleWishlist(
        this.product.id
      );


    await this.showToast(

      wasSaved
        ? 'Removed from wishlist.'
        : 'Saved to wishlist.'

    );


  }



  /* =========================
     ADD TO CART
     ========================= */

  async add():
    Promise<void> {


    if (
      !this.product
      ||
      this.isOutOfStock
    ) {

      return;

    }


    if (
      !this.canAddSelectedQuantity
    ) {


      const remaining =
        this.remainingStockForCart;


      if (
        remaining !== null
      ) {


        if (
          remaining <= 0
        ) {


          await this.showToast(
            'All available stock is already in your cart.'
          );


        } else {


          await this.showToast(

            remaining === 1

              ? 'You can only add 1 more item.'

              : 'You can only add '
                +
                remaining
                +
                ' more items.'

          );


        }


      }


      return;


    }


    this.state
      .addToCart(

        this.product.id,

        this.quantity

      );


    this.addedToCart =
      true;


    if (
      this.addedTimer
    ) {


      clearTimeout(
        this.addedTimer
      );


    }


    this.addedTimer =
      setTimeout(

        () => {

          this.addedToCart =
            false;

        },

        1300

      );


    await this.showToast(

      this.quantity === 1

        ? this.product.name
          +
          ' added to cart.'

        : this.quantity
          +
          ' × '
          +
          this.product.name
          +
          ' added to cart.'

    );


  }



  /* =========================
     BUY NOW
     ========================= */

  async buyNow():
    Promise<void> {


    if (
      !this.product
    ) {

      return;

    }


    if (
      this.isOutOfStock
    ) {


      await this.showToast(
        'This product is currently out of stock.'
      );


      return;


    }


    if (
      !this.canBuySelectedQuantity
    ) {


      await this.showToast(
        'Selected quantity exceeds the available stock.'
      );


      return;


    }


    await this.router
      .navigate(

        [
          '/checkout'
        ],

        {

          queryParams: {

            productId:
              this.product.id,

            quantity:
              this.quantity

          }

        }

      );


  }



  /* =========================
     LOAD REVIEWS
     ========================= */

  async loadReviews():
    Promise<void> {


    if (
      !this.product
    ) {


      this.reviews = [];

      this.averageRating = 0;

      this.reviewCount = 0;


      return;


    }


    this.loadingReviews =
      true;


    try {


      const reviews =
        await this
          .reviewService
          .getProductReviews(
            this.product.id
          );


      this.reviews =
        reviews;


      this.reviewCount =
        reviews.length;


      if (
        reviews.length === 0
      ) {


        this.averageRating =
          0;


      } else {


        const total =
          reviews.reduce(

            (
              sum,
              review
            ) => {

              return (

                sum
                +
                Number(
                  review.rating
                  ||
                  0
                )

              );

            },

            0

          );


        this.averageRating =
          total /
          reviews.length;


      }


    } catch (
      error
    ) {


      console.error(
        'Unable to load reviews:',
        error
      );


      this.reviews =
        [];


      this.averageRating =
        0;


      this.reviewCount =
        0;


    } finally {


      this.loadingReviews =
        false;


    }


  }



  /* =========================
     DISPLAY RATING
     ========================= */

  get displayRating():
    string {


    if (
      this.reviewCount > 0
    ) {


      return this
        .averageRating
        .toFixed(1);


    }


    return 'No reviews yet';


  }



  /* =========================
     STAR DISPLAY
     ========================= */

  stars(
    rating: number
  ):
    string {


    const safeRating =
      Math.max(

        0,

        Math.min(

          5,

          Math.round(
            Number(
              rating
              ||
              0
            )
          )

        )

      );


    return (

      '★'.repeat(
        safeRating
      )

      +

      '☆'.repeat(
        5 - safeRating
      )

    );


  }



  starsForAverage():
    string {


    return this.stars(
      this.averageRating
    );


  }



  /* =========================
     REVIEW DATE
     ========================= */

  reviewDate(
    value: any
  ):
    string {


    try {


      const date =

        value?.toDate?.()

        ??

        (
          value instanceof Date

            ? value

            : null
        );


      if (
        !date
      ) {

        return '';

      }


      return date
        .toLocaleDateString(

          'en-PH',

          {

            year:
              'numeric',

            month:
              'short',

            day:
              'numeric'

          }

        );


    } catch {


      return '';


    }


  }



  /* =========================
     RELATED PRODUCTS
     ========================= */

  get relatedProducts():
    Product[] {


    if (
      !this.product
    ) {

      return [];

    }


    return this.state.products

      .filter(

        item =>

          item.id !==
            this.product!.id

          &&

          item.category ===
            this.product!.category

      )

      .slice(
        0,
        4
      );


  }



  openProduct(
    product: Product
  ):
    void {


    this.quantity =
      1;


    this.addedToCart =
      false;


    this.reviews =
      [];


    this.reviewCount =
      0;


    this.averageRating =
      0;


    void this.router
      .navigate(

        [
          '/product-details',
          product.id
        ]

      )
      .then(

        async () => {


          await this.state
            .loadProductsFromFirestore();


          this.refreshProduct();


          await this
            .loadReviews();


          await this
            .loadStockAlertState();


        }

      );


  }



  /* =========================
     TOAST
     ========================= */

  private async showToast(
    message: string
  ):
    Promise<void> {


    const toast =
      await this
        .toastController
        .create({

          message,

          duration:
            1400,

          position:
            'bottom'

        });


    await toast.present();


  }



  /* =========================
     MONEY
     ========================= */

  money(
    value: number
  ):
    string {


    return new Intl.NumberFormat(

      'en-PH',

      {

        style:
          'currency',

        currency:
          'PHP'

      }

    )
      .format(
        Number(
          value
          ||
          0
        )
      );


  }



  /* =========================
     CART BADGE
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



  /* =========================
     CLEANUP
     ========================= */

  ngOnDestroy():
    void {


    if (
      this.addedTimer
    ) {


      clearTimeout(
        this.addedTimer
      );


    }


  }


}