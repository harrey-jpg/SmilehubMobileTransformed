import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';

import {
  Router
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

  imports: [
    IonicModule,
    CommonModule
  ],

  template: `

  <div class="product-card">


    <!-- =========================
         PRODUCT IMAGE
         ========================= -->

    <div
      class="product-art card-button"

      (click)="open()">


      <img
        [src]="productImage"
        [alt]="product.name"

        loading="lazy">



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

    <div
      class="product-name card-button"

      (click)="open()">

      {{ product.name }}

    </div>



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



      <span
        style="
          font-size:11px;
          font-weight:700;
          white-space:nowrap
        ">


        <ng-container
          *ngIf="
            reviewCount > 0
          ">

          ★ {{ averageRating.toFixed(1) }}

          <span
            style="
              font-size:9px;
              opacity:.7
            ">

            ({{ reviewCount }})

          </span>

        </ng-container>


        <ng-container
          *ngIf="
            reviewCount === 0
          ">

          No reviews yet

        </ng-container>


      </span>


    </div>



    <!-- =========================
         ADD TO CART
         ========================= -->

    <ion-button
      class="primary-btn"

      size="small"

      expand="block"

      style="margin-top:10px"

      [disabled]="
        isOut()
        ||
        addingToCart
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
      ReviewService

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

  private async loadReviewSummary():
    Promise<void> {


    if (
      !this.product?.id
    ) {


      return;


    }



    const productId =
      this.product.id;



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


        this.reviewCount =
          0;



        this.averageRating =
          0;


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

  async addToCart(
    event: Event
  ):
    Promise<void> {


    event.stopPropagation();



    if (
      this.isOut()
      ||
      this.addingToCart
    ) {


      return;


    }



    /*
     * Extra stock protection.
     */

    const currentInCart =
      this.state
        .quantityFor(
          this.product.id
        );



    if (
      this.numericStock !== null

      &&

      currentInCart >=
        this.numericStock
    ) {


      const toast =
        await this
          .toastController
          .create({


            message:
              'All available stock is already in your cart.',


            duration:
              1400,


            position:
              'bottom'


          });



      await toast.present();



      return;


    }



    this.addingToCart =
      true;



    try {


      this.state
        .addToCart(
          this.product.id
        );



      /*
       * Temporary Added state
       */

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

          1200

        );



      /*
       * Toast notification
       */

      const toast =
        await this
          .toastController
          .create({


            message:
              `${this.product.name} added to cart.`,


            duration:
              1400,


            position:
              'bottom'


          });



      await toast.present();


    } finally {


      this.addingToCart =
        false;


    }


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