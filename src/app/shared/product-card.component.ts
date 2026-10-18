import { CartFeedbackService } from '../services/cart-feedback.service';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import {
  Router, RouterModule
} from '@angular/router';

import {
  IonicModule,
  ToastController
} from '@ionic/angular';

import {
  CommonModule
} from '@angular/common';

import {
  Product
} from '../models/product';

import {
  AppStateService
} from '../services/app-state.service';

import {
  ReviewService
} from '../services/review.service';



@Component({

  selector: 'app-product-card',

  standalone: true,

  imports: [RouterModule,
    IonicModule,
    CommonModule
  ],

  styles: [`
    :host { display:block; height:100%; min-width:0; }
    .product-card {
      position:relative; height:100%; min-width:0; padding:12px;
      display:flex; flex-direction:column; gap:6px;
      border-radius:20px; overflow:hidden;
    }
    .product-art {
      position:relative; display:grid; place-items:center;
      height:clamp(112px,32vw,144px); min-height:0; flex-shrink:0;
      padding:8px; margin:0; border-radius:16px; overflow:hidden;
      background:var(--ion-background-color);
    }
    .product-image-link { display:grid; place-items:center; width:100%; height:100%; min-height:0; }
    .product-art img { width:100%; height:100%; min-height:0; object-fit:contain; filter:none; }
    .brand {
      margin:0; min-height:1.4em; font-size:12px; line-height:1.4;
      font-weight:600; text-transform:uppercase; color:var(--ion-color-primary);
      overflow-wrap:anywhere;
    }
    a.product-name {
      display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:3;
      min-height:2.7em; max-height:4.05em; overflow:hidden;
      margin:0; font-size:14px; line-height:1.35; font-weight:700;
      color:var(--ion-text-color); text-decoration:none; overflow-wrap:anywhere;
    }
    .row-between {
      display:flex; flex-direction:column; align-items:flex-start;
      gap:4px!important; margin:0!important;
    }
    .row-between > .price { font-size:16px; line-height:1.3; font-weight:800; color:var(--ion-color-primary); }
    .review-summary { font-size:12px; line-height:1.4; font-weight:400; white-space:normal; }
    .review-count { font-size:12px; }
    .stock-pill { border-radius:999px; padding:4px 8px; font-size:11px; font-weight:600; }
    ion-button { --border-radius:14px; font-weight:600; }
    .wish-btn { width:44px; height:44px; min-height:44px; margin:0; --border-radius:50%; }
    .rating-feedback { font-size:12px; line-height:1.4; font-weight:400; }
    .rating-feedback button {
      min-width:44px; min-height:44px; padding:8px; margin:0;
      color:var(--ion-color-primary); border:0; background:transparent; text-decoration:underline;
    }
    .product-card > ion-button.primary-btn {
      flex-shrink:0; width:100%; min-height:44px; margin:0!important;
      margin-top:auto!important; font-size:14px; font-weight:600;
    }
    .cart-fly {
      position:absolute; right:16px; bottom:65px; z-index:3;
      display:inline-flex; align-items:center; gap:5px; padding:7px 12px;
      border-radius:999px; background:#0b7891; color:white;
      box-shadow:0 7px 22px rgba(11,120,145,.27); font-size:12px;
      font-weight:700; pointer-events:none; animation:cartFly .85s ease-out both;
    }
    @keyframes cartFly {
      0% { opacity:0; transform:translateY(14px) scale(.8); }
      30% { opacity:1; transform:translateY(0) scale(1.08); }
      100% { opacity:0; transform:translateY(-30px) scale(1); }
    }
    @media(prefers-reduced-motion:reduce) { .cart-fly { animation:none; } }
  `],

  template: `

  <div class="product-card">


    <!-- =========================
         PRODUCT IMAGE
         ========================= -->

    <div
      class="product-art">


      <a class="product-image-link" [routerLink]="['/product-details', product.id]" [attr.aria-label]="'View ' + product.name"><img
        [src]="productImage"
        [alt]="product.name"

        loading="lazy"></a>



      <!-- STOCK STATUS -->

      <span
        class="stock-pill"

        [class.low]="isLow()"
        [class.out]="isOut()"

        style="
          position:absolute;
          left:8px;
          top:8px
        ">

        {{ stockLabel }}

      </span>



      <!-- WISHLIST -->

      <ion-button
        size="small"

        fill="solid"

        class="wish-btn"
        [attr.aria-label]="(state.wishlist.has(product.id) ? 'Remove ' : 'Save ') + product.name + (state.wishlist.has(product.id) ? ' from wishlist' : ' to wishlist')"
        [attr.aria-pressed]="state.wishlist.has(product.id)"

        [class.wished]="
          state.wishlist.has(
            product.id
          )
        "

        (click)="
          toggleWishlist(
            $event
          )
        ">


        <ion-icon
          [name]="
            state.wishlist.has(
              product.id
            )
              ? 'heart'
              : 'heart-outline'
          ">
        </ion-icon>


      </ion-button>


    </div>



    <!-- =========================
         BRAND
         ========================= -->

    <div class="brand">

      {{ product.brand }}

    </div>



    <!-- =========================
         PRODUCT NAME
         ========================= -->

    <a [routerLink]="['/product-details', product.id]"
      class="product-name card-button" [attr.aria-label]="product.name" [attr.title]="product.name"

      (click)="open()">

      {{ product.name }}

    </a>



    <!-- =========================
         PRICE + RATING
         ========================= -->

    <div
      class="row-between"

      style="
        margin-top:2px;
        gap:8px
      ">


      <span class="price">

        {{
          money(
            product.price
          )
        }}

      </span>



      <span class="review-summary" *ngIf="reviewCount > 0 || (!loadingRating && !reviewFailed)">


        <ng-container
          *ngIf="
            reviewCount > 0
          ">

          ★ {{ averageRating.toFixed(1) }}

          <span class="review-count">

            ({{ reviewCount }})

          </span>

        </ng-container>


        <ng-container
          *ngIf="
            !loadingRating && !reviewFailed && reviewCount === 0">

          No reviews yet

        </ng-container>


      </span>


    </div>



<div *ngIf="loadingRating || reviewFailed" class="rating-feedback" aria-live="polite">
      <span *ngIf="loadingRating">Loading reviews…</span>
      <span *ngIf="reviewFailed">Reviews unavailable</span>
      <button type="button" *ngIf="reviewFailed" (click)="loadReviewSummary()" [disabled]="loadingRating" [attr.aria-label]="'Retry reviews for ' + product.name">Retry</button>
    </div>
    <!-- =========================
         ADD TO CART
         ========================= -->

    <ion-button
      class="primary-btn cart-add-button"

      size="small"

      expand="block"

      style="margin-top:10px"

      [disabled]="
        isOut()
        ||
        addingToCart || cartFeedback.isAdding(product.id)
      "

      (click)="
        addToCart(
          $event
        )
      ">


      <ion-icon
        *ngIf="
          addedToCart
        "

        name="checkmark-circle-outline"

        slot="start">
      </ion-icon>



      {{
        isOut()

          ? 'Out of Stock'

          : addedToCart

            ? 'Added!'

            : 'Add to Cart'
      }}


    </ion-button>

    <div *ngIf="addedToCart" class="cart-fly" aria-hidden="true">
      <ion-icon name="checkmark-circle-outline"></ion-icon>
      Added to Cart
    </div>

  </div>

  `

})


export class ProductCardComponent
implements OnChanges, OnDestroy {



  /* =========================
     PRODUCT
     ========================= */

  @Input({
    required: true
  })

  product!:
    Product;



  /* =========================
     CART STATE
     ========================= */

  addedToCart =
    false;



  addingToCart =
    false;



  private addedTimer?:
    ReturnType<typeof setTimeout>;



  /* =========================
     REVIEW STATE
     ========================= */

  averageRating =
    0;



  reviewCount =
    0;



  reviewFailed = false;
  private summaryProductId = 0;

  loadingRating =
    false;



  private reviewLoadId =
    0;



  private destroyed =
    false;



  constructor(

    public state:
      AppStateService,

    private router:
      Router,

    private toastController:
      ToastController,

    private reviewService:
      ReviewService,
    public cartFeedback: CartFeedbackService

  ) {}



  /* =========================
     PRODUCT CHANGES
     ========================= */

  ngOnChanges(
    changes: SimpleChanges
  ):
    void {


    if (
      changes['product']
      &&
      this.product?.id
    ) {


      void this
        .loadReviewSummary();


    }


  }



  /* =========================
     PRODUCT IMAGE
     ========================= */

  get productImage():
    string {


    return (

      this.product?.image

      ||

      this.product?.imageAsset

      ||

      'assets/products/default.svg'

    );


  }



  /* =========================
     LOAD REVIEWS
     ========================= */

  async loadReviewSummary():
    Promise<void> {


    if (
      !this.product?.id
    ) {


      return;


    }



    const productId = this.product.id;
    if (this.summaryProductId !== productId) { this.reviewCount = 0; this.averageRating = 0; this.summaryProductId = productId; }
    this.reviewFailed = false;



    const currentLoad =
      ++this.reviewLoadId;



    this.loadingRating =
      true;



    try {


      const reviews =
        await this.reviewService
          .getProductReviews(
            productId
          );



      /*
       * Ignore old async result
       * if product changed.
       */

      if (
        this.destroyed
        ||
        currentLoad !==
          this.reviewLoadId
      ) {


        return;


      }



      this.reviewCount =
        reviews.length;



      if (
        reviews.length === 0
      ) {


        this.averageRating =
          0;



        return;


      }



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
                review.rating || 0
              )

            );

          },

          0

        );



      this.averageRating =
        total /
        reviews.length;


    } catch (
      error
    ) {


      console.error(
        'Unable to load product rating:',
        error
      );



      if (
        currentLoad ===
          this.reviewLoadId
      ) {


        this.reviewFailed = true;
      }


    } finally {


      if (
        currentLoad ===
          this.reviewLoadId
      ) {


        this.loadingRating =
          false;


      }


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
     STOCK LABEL
     ========================= */

  get stockLabel():
    string {


    const count =
      this.numericStock;



    if (
      count !== null
    ) {


      if (
        count <= 0
      ) {


        return 'Out of Stock';


      }



      if (
        count <= 10
      ) {


        return `Only ${count} left`;


      }



      return `${count} in stock`;


    }



    return (

      this.product?.stock

      ||

      'Available'

    );


  }



  /* =========================
     NUMERIC STOCK
     ========================= */

  get numericStock():
    number | null {


    if (
      typeof this.product?.stockCount
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



    const raw =
      String(
        this.product?.stock ?? ''
      )
        .trim();



    if (
      /^\\d+$/.test(
        raw
      )
    ) {


      return Math.max(

        0,

        Number(
          raw
        )

      );


    }



    return null;


  }



  /* =========================
     OPEN PRODUCT
     ========================= */

  open():
    void {


    this.router.navigate([

      '/product-details',

      this.product.id

    ]);


  }



  /* =========================
     WISHLIST
     ========================= */

  toggleWishlist(
    event: Event
  ):
    void {


    event.stopPropagation();



    this.state
      .toggleWishlist(
        this.product.id
      );


  }



  /* =========================
     ADD TO CART
     ========================= */

  async addToCart(event: Event): Promise<void> {
    event.stopPropagation();
    if (this.isOut() || this.addingToCart || this.cartFeedback.isAdding(this.product.id)) return;
    const currentInCart = this.state.quantityFor(this.product.id);
    if (this.numericStock !== null && currentInCart >= this.numericStock) {
      const toast = await this.toastController.create({
        message: 'All available stock is already in your cart.', duration: 1400, position: 'bottom'
      });
      await toast.present();
      return;
    }
    if (!this.cartFeedback.add(this.product.id, 1, undefined, event)) return;
    this.addingToCart = true;
    this.addedToCart = true;
    if (this.addedTimer) clearTimeout(this.addedTimer);
    this.addedTimer = setTimeout(() => {
      this.addedToCart = false;
      this.addingToCart = false;
    }, this.cartFeedback.feedbackDuration);
  }

  /* =========================
     OUT OF STOCK
     ========================= */

  isOut():
    boolean {


    if (
      this.numericStock !== null
    ) {


      return (
        this.numericStock <= 0
      );


    }



    const stock =
      String(
        this.product?.stock ?? ''
      )
        .trim()
        .toLowerCase();



    return (

      stock === '0'

      ||

      stock.includes(
        'out of stock'
      )

      ||

      stock.includes(
        'sold out'
      )

      ||

      stock.includes(
        'unavailable'
      )

    );


  }



  /* =========================
     LOW STOCK
     ========================= */

  isLow():
    boolean {


    if (
      this.numericStock !== null
    ) {


      return (

        this.numericStock > 0

        &&

        this.numericStock <= 10

      );


    }



    const stock =
      String(
        this.product?.stock ?? ''
      )
        .trim()
        .toLowerCase();



    return (

      stock.includes(
        'low'
      )

      ||

      stock.includes(
        'pre-order'
      )

    );


  }



  /* =========================
     MONEY FORMAT
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
          value || 0
        )
      );


  }



  /* =========================
     CLEANUP
     ========================= */

  ngOnDestroy():
    void {


    this.destroyed =
      true;



    this.reviewLoadId++;



    if (
      this.addedTimer
    ) {


      clearTimeout(
        this.addedTimer
      );


    }


  }


}