import {
  Component
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  IonicModule,
  ToastController,
  AlertController
} from '@ionic/angular';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  OrderService
} from '../services/order.service';

import {
  ReviewService,
  ProductReview
} from '../services/review.service';

import {
  AppStateService
} from '../services/app-state.service';

import {
  firebaseAuth
} from '../services/firebase';



@Component({

  selector: 'app-order-details',

  standalone: true,

  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],


  styles: [`

    /* =========================
       TIMELINE
       ========================= */

    .timeline-item {

      display: flex;

      align-items: flex-start;

      gap: 12px;

      margin-bottom: 18px;

    }



    .timeline-dot {

      width: 30px;

      height: 30px;

      border-radius: 50%;

      flex-shrink: 0;

      display: flex;

      align-items: center;

      justify-content: center;

      background: #ddd;

      color: white;

      font-size: 14px;

    }



    .timeline-dot.completed {

      background: #00ce75;

    }



    .timeline-dot.current {

      background:
        var(--ion-color-primary);

    }



    .timeline-content {

      padding-top: 4px;

    }



    .timeline-title {

      font-size: 14px;

      font-weight: 900;

    }



    .timeline-text {

      margin-top: 3px;

      font-size: 11px;

      color:
        var(--ion-color-medium);

    }



    /* =========================
       ORDER ITEM
       ========================= */

    .order-item-card {

      padding: 15px;

    }



    .item-main {

      display: flex;

      align-items: center;

      gap: 12px;

    }



    .item-price {

      flex-shrink: 0;

      font-weight: 900;

    }



    /* =========================
       REVIEW ACTION
       ========================= */

    .review-action {

      margin-top: 13px;

      padding-top: 13px;

      border-top:
        1px solid
        rgba(120, 120, 120, .10);

    }



    .reviewed-label {

      display: flex;

      align-items: center;

      gap: 6px;

      font-size: 11px;

      font-weight: 800;

      color:
        var(--ion-color-success);

    }



    .reviewed-actions {

      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 8px;

      margin-top: 10px;

    }



    .reviewed-actions ion-button {

      margin: 0;

      --border-radius: 11px;

      font-size: 10px;

      font-weight: 800;

    }



    .rate-button {

      margin: 0;

      --border-radius: 11px;

      font-size: 11px;

      font-weight: 800;

    }



    /* =========================
       REVIEW FORM
       ========================= */

    .review-form {

      margin-top: 12px;

      padding: 14px;

      border-radius: 14px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .05
        );

    }



    .review-form-title {

      font-size: 13px;

      font-weight: 900;

    }



    .review-form-subtitle {

      margin-top: 4px;

      font-size: 10px;

      color:
        var(--ion-color-medium);

    }



    .star-row {

      display: flex;

      align-items: center;

      gap: 4px;

      margin-top: 13px;

    }



    .star-button {

      padding: 0;

      border: none;

      background: transparent;

      color: #f4b400;

      font-size: 29px;

      line-height: 1;

      cursor: pointer;

    }



    .rating-label {

      margin-left: 8px;

      font-size: 11px;

      font-weight: 800;

      color:
        var(--ion-color-medium);

    }



    .review-textarea {

      margin-top: 14px;

      --background:
        rgba(
          120,
          120,
          120,
          .06
        );

      --border-radius: 12px;

      --padding-start: 12px;

      --padding-end: 12px;

      --padding-top: 11px;

      --padding-bottom: 11px;

      font-size: 12px;

    }



    .review-char-count {

      margin-top: 5px;

      text-align: right;

      font-size: 9px;

      color:
        var(--ion-color-medium);

    }



    .review-buttons {

      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 8px;

      margin-top: 12px;

    }



    .review-buttons ion-button {

      margin: 0;

      --border-radius: 11px;

      font-size: 11px;

      font-weight: 800;

    }



    /* =========================
       CANCELLATION
       ========================= */

    .cancel-order-box {

      margin-top: 15px;

      padding: 13px;

      border-radius: 13px;

      border:
        1px solid
        rgba(
          var(--ion-color-danger-rgb),
          .16
        );

      background:
        rgba(
          var(--ion-color-danger-rgb),
          .05
        );

    }



    .cancel-order-title {

      font-size: 12px;

      font-weight: 900;

    }



    .cancel-order-text {

      margin-top: 4px;

      font-size: 10px;

      line-height: 1.45;

      color:
        var(--ion-color-medium);

    }



    .cancel-order-button {

      margin:
        10px 0 0;

      --border-radius: 11px;

      font-size: 11px;

      font-weight: 800;

    }



    .cancelled-notice {

      margin-top: 15px;

      padding: 12px;

      border-radius: 12px;

      background:
        rgba(
          var(--ion-color-danger-rgb),
          .09
        );

      color:
        var(--ion-color-danger);

      font-size: 11px;

      line-height: 1.5;

      font-weight: 700;

    }



    .timeline-dot.cancelled {

      background:
        var(--ion-color-danger);

    }



    /* =========================
       BUY AGAIN
       ========================= */

    .buy-again-wrap {

      margin-top: 12px;

    }


    .buy-again-button {

      margin: 0;

      --border-radius: 11px;

      font-size: 11px;

      font-weight: 900;

    }


    .buy-again-note {

      margin-top: 6px;

      font-size: 9px;

      line-height: 1.45;

      color:
        var(--ion-color-medium);

      font-weight: 600;

    }



    /* =========================
       DELIVERED NOTICE
       ========================= */

    .delivered-notice {

      margin-top: 15px;

      padding: 12px;

      border-radius: 12px;

      background:
        rgba(
          var(--ion-color-success-rgb),
          .08
        );

      color:
        var(--ion-color-success);

      font-size: 11px;

      line-height: 1.5;

      font-weight: 700;

    }

  `],



  template: `

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        defaultHref="/orders">
      </ion-back-button>

    </ion-buttons>


    <ion-title>

      Order Details

    </ion-title>


  </ion-toolbar>

</ion-header>




<ion-content>


<div
  class="page-wrap no-bottom"

  *ngIf="
    order;
    else loadingTpl
  ">



  <!-- =========================
       ORDER HEADER
       ========================= -->

  <div class="app-card">


    <div class="row-between">


      <div>


        <div class="muted">

          Order number

        </div>


        <h2
          style="
            margin:4px 0
          ">

          {{ order.orderNumber }}

        </h2>


      </div>



      <span class="order-status">

        {{ displayOrderStatus }}

      </span>


    </div>



    <p class="muted">

      Placed
      {{ date(order.createdAt) }}

    </p>



    <div
      class="delivered-notice"

      *ngIf="
        order.status === 'Delivered'
      ">

      Your order has been delivered.
      You can now rate the products you purchased.


      <div class="buy-again-wrap">


        <ion-button
          class="buy-again-button"

          expand="block"

          size="small"

          [disabled]="
            buyingAgain
          "

          (click)="
            buyAgain()
          ">


          <ion-spinner
            *ngIf="
              buyingAgain
            "

            slot="start"

            name="crescent">
          </ion-spinner>


          <ion-icon
            *ngIf="
              !buyingAgain
            "

            slot="start"

            name="cart-outline">
          </ion-icon>


          {{
            buyingAgain
              ? 'Adding to Cart...'
              : 'Buy Again'
          }}


        </ion-button>


        <div class="buy-again-note">

          Current prices and stock availability
          will apply.

        </div>


      </div>

    </div>



    <!-- CANCEL ORDER -->

    <div
      class="cancel-order-box"

      *ngIf="
        canCancelOrder
      ">


      <div class="cancel-order-title">

        Need to cancel this order?

      </div>


      <div class="cancel-order-text">

        You may cancel while the order is
        Pending or Processing.
        Product stock will be returned automatically.

      </div>


      <ion-button
        class="cancel-order-button"

        size="small"

        fill="outline"

        color="danger"

        [disabled]="
          cancellingOrder
        "

        (click)="
          confirmCancelOrder()
        ">


        <ion-spinner
          *ngIf="
            cancellingOrder
          "

          slot="start"

          name="crescent">
        </ion-spinner>


        {{
          cancellingOrder
            ? 'Cancelling...'
            : 'Cancel Order'
        }}


      </ion-button>


    </div>



    <!-- CANCELLED NOTICE -->

    <div
      class="cancelled-notice"

      *ngIf="
        order.status === 'Cancelled'
      ">

      This order has been cancelled.
      Any reserved product stock has been returned.

      <div
        *ngIf="
          order.cancellationReason
        "

        style="
          margin-top:5px;
          font-weight:600
        ">

        Reason:
        {{ order.cancellationReason }}

      </div>

    </div>


  </div>





  <!-- =========================
       STATUS TIMELINE
       ========================= -->

  <div class="section-row">

    <h2>

      Order Status

    </h2>

  </div>



  <div class="app-card">


    <div
      class="timeline-item"

      *ngFor="
        let step of displayStatusSteps
      ">


      <div
        class="timeline-dot"

        [class.completed]="
          isCompleted(step)
        "

        [class.current]="
          isCurrent(step)
        "

        [class.cancelled]="
          step === 'Cancelled'
        ">


        <ion-icon
          *ngIf="
            isCompleted(step)
          "

          name="checkmark-outline">
        </ion-icon>


      </div>



      <div class="timeline-content">


        <div class="timeline-title">

          {{ step }}

        </div>


        <div class="timeline-text">

          {{ statusMessage(step) }}

        </div>


      </div>


    </div>


  </div>





  <!-- =========================
       ITEMS
       ========================= -->

  <div class="section-row">

    <h2>

      Items

    </h2>

  </div>



  <div class="list-stack">


    <div
      class="app-card order-item-card"

      *ngFor="
        let i of order.items || []
      ">


      <!-- ITEM -->

      <div class="item-main">


        <div
          class="category-icon"

          style="
            width:54px;
            height:54px;
          ">

          🦷

        </div>



        <div class="flex-1">


          <b>

            {{ i.name }}

          </b>


          <div class="muted">

            {{ i.brand }}
            •
            Qty {{ i.quantity }}

          </div>


        </div>



        <div class="item-price">

          {{
            money(
              i.lineTotal
              ||
              i.price *
              i.quantity
            )
          }}

        </div>


      </div>




      <!-- =========================
           REVIEW ACTIONS
           ========================= -->

      <div
        class="review-action"

        *ngIf="
          canReviewItem(i)
        ">



        <!-- ALREADY REVIEWED -->

        <ng-container
          *ngIf="
            isReviewed(i)
          ">


          <div class="reviewed-label">

            ✓

            You reviewed this product

          </div>



          <div
            class="reviewed-actions"

            *ngIf="
              reviewingProductId !==
              productId(i)
            ">


            <ion-button
              size="small"
              fill="outline"

              (click)="
                startEditReview(i)
              ">

              Edit Review

            </ion-button>



            <ion-button
              size="small"
              fill="outline"
              color="danger"

              (click)="
                confirmDeleteReview(i)
              ">

              Delete Review

            </ion-button>


          </div>


        </ng-container>



        <!-- RATE PRODUCT -->

        <ion-button
          *ngIf="
            !isReviewed(i)
            &&
            reviewingProductId !== productId(i)
          "

          class="rate-button"

          size="small"

          fill="outline"

          (click)="
            startReview(i)
          ">

          ★ Rate Product

        </ion-button>




        <!-- =========================
             REVIEW FORM
             ========================= -->

        <div
          class="review-form"

          *ngIf="
            reviewingProductId ===
            productId(i)
          ">


          <div class="review-form-title">

            {{
              editingReviewId
                ? 'Edit Review'
                : 'Rate ' + i.name
            }}

          </div>


          <div class="review-form-subtitle">

            {{
              editingReviewId
                ? 'Update your rating or comment below.'
                : 'Tell other SmileHub customers what you think about this product.'
            }}

          </div>



          <!-- STARS -->

          <div class="star-row">


            <button
              type="button"

              class="star-button"

              *ngFor="
                let star of ratingOptions
              "

              (click)="
                selectRating(star)
              ">

              {{
                selectedRating >= star
                  ? '★'
                  : '☆'
              }}

            </button>



            <span
              class="rating-label"

              *ngIf="
                selectedRating > 0
              ">

              {{ ratingText }}

            </span>


          </div>



          <!-- COMMENT -->

          <ion-textarea

            class="review-textarea"

            [(ngModel)]="
              reviewComment
            "

            placeholder="
              Write your review...
            "

            [autoGrow]="true"

            [maxlength]="500">

          </ion-textarea>



          <div class="review-char-count">

            {{
              reviewComment.length
            }}
            / 500

          </div>



          <!-- BUTTONS -->

          <div class="review-buttons">


            <ion-button
              fill="outline"

              color="medium"

              [disabled]="
                submittingReview
              "

              (click)="
                cancelReview()
              ">

              Cancel

            </ion-button>



            <ion-button
              class="primary-btn"

              [disabled]="
                submittingReview
                ||
                selectedRating === 0
                ||
                reviewComment.trim().length < 3
              "

              (click)="
                submitReview(i)
              ">


              <ion-spinner
                *ngIf="
                  submittingReview
                "

                name="crescent">
              </ion-spinner>


              <span
                *ngIf="
                  !submittingReview
                ">

                {{
                  editingReviewId
                    ? 'Save Changes'
                    : 'Submit Review'
                }}

              </span>


            </ion-button>


          </div>


        </div>


      </div>


    </div>


  </div>





  <!-- =========================
       SHIPPING
       ========================= -->

  <div class="section-row">

    <h2>

      Shipping

    </h2>

  </div>



  <div class="app-card">


    <b>

      📍
      {{
        order.shippingAddress?.label
        ||
        'Address'
      }}

    </b>



    <p>

      {{
        order.shippingAddress?.recipient
      }}

      <br>

      {{
        order.shippingAddress?.phone
      }}

    </p>



    <p class="muted">

      {{
        order.shippingAddress?.fullAddress
      }}

    </p>



    <div class="row-between">


      <span>

        Delivery method

      </span>


      <b>

        {{ order.deliveryMethod }}

      </b>


    </div>


  </div>





  <!-- =========================
       PAYMENT
       ========================= -->

  <div class="section-row">

    <h2>

      Payment & Total

    </h2>

  </div>



  <div class="app-card">


    <div class="row-between">


      <span>

        Payment

      </span>


      <b>

        {{ order.paymentMethod }}

      </b>


    </div>



    <div class="row-between">


      <span>

        Subtotal

      </span>


      <b>

        {{
          money(
            order.subtotal || 0
          )
        }}

      </b>


    </div>



    <div class="row-between">


      <span>

        Shipping

      </span>


      <b>

        {{
          order.shippingFee === 0

            ? 'Free'

            : money(
                order.shippingFee || 0
              )
        }}

      </b>


    </div>



    <div
      class="row-between"

      *ngIf="
        order.discount
      ">


      <span>

        Discount

      </span>


      <b class="success">

        −{{
          money(
            order.discount
          )
        }}

      </b>


    </div>



    <hr>



    <div class="row-between total-row">


      <span>

        Total

      </span>


      <span>

        {{
          money(
            order.total || 0
          )
        }}

      </span>


    </div>


  </div>



</div>





<!-- =========================
     LOADING
     ========================= -->

<ng-template #loadingTpl>


  <div
    style="
      text-align:center;
      padding:50px
    ">


    <ion-spinner
      *ngIf="
        loading
      ">
    </ion-spinner>



    <p
      *ngIf="
        !loading
      ">

      Order not found.

    </p>


  </div>


</ng-template>



</ion-content>

`

})


export class OrderDetailsPage {



  order:
    any = null;



  loading =
    true;



  private sub?:
    {
      unsubscribe():
        void
    };



  private currentOrderId =
    '';



  cancellingOrder =
    false;


  buyingAgain =
    false;



  /* =========================
     REVIEW STATE
     ========================= */

  ratingOptions = [
    1,
    2,
    3,
    4,
    5
  ];



  reviewingProductId:
    number | null = null;



  selectedRating =
    0;



  reviewComment =
    '';



  submittingReview =
    false;



  reviewedProductIds =
    new Set<number>();



  myReviews =
    new Map<
      number,
      ProductReview
    >();



  editingReviewId:
    string | null =
      null;



  deletingReview =
    false;



  /* =========================
     STATUS STEPS
     ========================= */

  statusSteps = [

    'Pending',

    'Processing',

    'Shipped',

    'Delivered'

  ];



  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private service:
      OrderService,

    private state:
      AppStateService,

    private reviewService:
      ReviewService,

    private toastController:
      ToastController,

    private alertController:
      AlertController

  ) {}



  /* =========================
     PAGE ENTER
     ========================= */

  async ionViewWillEnter() {


    this.loading =
      true;



    try {


      this.sub?.unsubscribe();



      const id =
        this.route
          .snapshot
          .paramMap
          .get('id')
        ||
        '';



      this.currentOrderId =
        id;



      this.sub =
        this.service
          .watchOrder(id)

          .subscribe({


            next: row => {


              this.order =
                row;


              this.loading =
                false;



              if (
                row?.status ===
                'Delivered'
              ) {


                void this
                  .loadReviewState();


              }


            },



            error: () => {


              this.order =
                null;


              this.loading =
                false;


            }


          });


    } catch (_) {


      this.order =
        null;


      this.loading =
        false;


    }


  }



  /* =========================
     PAGE LEAVE
     ========================= */

  ionViewWillLeave() {


    this.sub?.unsubscribe();



    this.cancelReview();


  }



  /* =========================
     CAN CANCEL ORDER
     ========================= */

  get canCancelOrder():
    boolean {


    if (
      !this.order
      ||
      this.cancellingOrder
    ) {


      return false;


    }


    return this.service
      .canCancelStatus(
        String(
          this.order.status || ''
        )
      );


  }



  /* =========================
     CONFIRM CANCELLATION
     ========================= */

  async confirmCancelOrder():
    Promise<void> {


    if (
      !this.canCancelOrder
    ) {


      return;


    }


    const alert =
      await this.alertController
        .create({

          header:
            'Cancel Order',

          message:
            'Are you sure you want to cancel this order? Product stock will be returned automatically.',

          inputs: [

            {

              name:
                'reason',

              type:
                'textarea',

              placeholder:
                'Reason for cancellation',

              value:
                'Changed my mind'

            }

          ],

          buttons: [

            {

              text:
                'Keep Order',

              role:
                'cancel'

            },

            {

              text:
                'Cancel Order',

              role:
                'destructive',

              handler:
                data => {


                  void this.cancelOrder(
                    data?.reason || ''
                  );

                }

            }

          ]

        });


    await alert.present();


  }



  /* =========================
     CANCEL ORDER
     ========================= */

  private async cancelOrder(
    reason: string
  ):
    Promise<void> {


    if (
      this.cancellingOrder
    ) {


      return;


    }


    if (
      !this.currentOrderId
    ) {


      await this.showToast(
        'Order not found.'
      );


      return;


    }


    this.cancellingOrder =
      true;


    try {


      await this.service
        .cancelOrder(

          this.currentOrderId,

          String(
            reason || ''
          )
            .trim()
          ||
          'Changed my mind'

        );


      this.cancelReview();


      await this.showToast(
        'Order cancelled successfully.'
      );


    } catch (
      error: any
    ) {


      console.error(
        'Cancel order error:',
        error
      );


      await this.showToast(

        error?.message
        ||
        'Unable to cancel this order.'

      );


    } finally {


      this.cancellingOrder =
        false;


    }


  }



  /* =========================
     BUY AGAIN
     ========================= */

  async buyAgain():
    Promise<void> {


    if (
      this.buyingAgain
      ||
      this.order?.status !==
        'Delivered'
    ) {


      return;


    }


    const items =
      Array.isArray(
        this.order?.items
      )
        ? this.order.items
        : [];


    if (
      items.length === 0
    ) {


      await this.showToast(
        'There are no items to reorder.'
      );


      return;


    }


    this.buyingAgain =
      true;


    try {


      /*
       * Refresh products first so Buy Again
       * uses the latest Firestore stock.
       */

      await this.state
        .loadProductsFromFirestore();


      let addedUnits =
        0;


      let addedProducts =
        0;


      const unavailable:
        string[] = [];


      const adjusted:
        string[] = [];


      for (
        const item
        of items
      ) {


        const id =
          this.productId(
            item
          );


        if (
          !Number.isFinite(
            id
          )
        ) {


          unavailable.push(
            String(
              item?.name ||
              'Unknown product'
            )
          );


          continue;


        }


        /*
         * Do not use productById() here because
         * that method has a fallback product.
         * Buy Again must match the exact product.
         */

        const product =
          this.state.products
            .find(
              row =>
                Number(
                  row.id
                ) ===
                id
            );


        if (
          !product
        ) {


          unavailable.push(
            String(
              item?.name ||
              'Product'
            )
          );


          continue;


        }


        const requested =
          Math.max(
            1,
            Math.floor(
              Number(
                item?.quantity ||
                1
              )
            )
          );


        const currentInCart =
          this.state
            .quantityFor(
              id
            );


        const stock =
          this.currentStockFor(
            product
          );


        let quantityToAdd =
          requested;


        if (
          stock !== null
        ) {


          const remaining =
            Math.max(
              0,
              stock -
              currentInCart
            );


          if (
            remaining <= 0
          ) {


            unavailable.push(
              String(
                product.name ||
                item?.name ||
                'Product'
              )
            );


            continue;


          }


          quantityToAdd =
            Math.min(
              requested,
              remaining
            );


          if (
            quantityToAdd <
            requested
          ) {


            adjusted.push(
              String(
                product.name ||
                item?.name ||
                'Product'
              )
            );


          }


        }


        if (
          quantityToAdd <= 0
        ) {


          continue;


        }


        this.state
          .addToCart(
            id,
            quantityToAdd
          );


        addedUnits +=
          quantityToAdd;


        addedProducts +=
          1;


      }


      if (
        addedProducts === 0
      ) {


        await this.showToast(
          'None of the items can be added right now. Please check current stock.'
        );


        return;


      }


      let message =
        `${addedUnits} item${addedUnits === 1 ? '' : 's'} added to cart.`;


      if (
        unavailable.length > 0
      ) {


        message +=
          ` ${unavailable.length} product${unavailable.length === 1 ? '' : 's'} unavailable.`;


      }


      if (
        adjusted.length > 0
      ) {


        message +=
          ' Some quantities were adjusted to current stock.';


      }


      await this.showToast(
        message
      );


      await this.router
        .navigateByUrl(
          '/cart'
        );


    } catch (
      error: any
    ) {


      console.error(
        'Buy Again error:',
        error
      );


      await this.showToast(

        error?.message
        ||
        'Unable to add these items to your cart.'

      );


    } finally {


      this.buyingAgain =
        false;


    }


  }



  /* =========================
     CURRENT PRODUCT STOCK
     ========================= */

  private currentStockFor(
    product: any
  ):
    number | null {


    if (
      typeof product?.stockCount ===
        'number'
      &&
      Number.isFinite(
        product.stockCount
      )
    ) {


      return Math.max(
        0,
        Math.floor(
          product.stockCount
        )
      );


    }


    const raw =
      String(
        product?.stock ?? ''
      )
        .trim();


    if (
      /^\d+$/.test(
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


    const label =
      raw.toLowerCase();


    if (
      label === '0'
      ||
      label.includes(
        'out of stock'
      )
      ||
      label.includes(
        'sold out'
      )
      ||
      label.includes(
        'unavailable'
      )
    ) {


      return 0;


    }


    /*
     * Unknown stock format:
     * allow the cart flow to continue.
     * Checkout still performs final stock validation.
     */

    return null;


  }



  /* =========================
     PRODUCT ID
     ========================= */

  productId(
    item: any
  ):
    number {


    return Number(
      item?.productId
    );


  }



  /* =========================
     CAN REVIEW
     ========================= */

  canReviewItem(
    item: any
  ):
    boolean {


    const id =
      this.productId(
        item
      );



    return (

      this.order?.status ===
        'Delivered'

      &&

      Number.isFinite(
        id
      )

    );


  }



  /* =========================
     REVIEWED
     ========================= */

  isReviewed(
    item: any
  ):
    boolean {


    const id =
      this.productId(
        item
      );



    return this.reviewedProductIds
      .has(
        id
      );


  }



  /* =========================
     LOAD REVIEW STATE
     ========================= */

  private async loadReviewState():
    Promise<void> {


    const user =
      firebaseAuth.currentUser;



    if (
      !user
      ||
      !this.order
      ||
      this.order.status !==
        'Delivered'
    ) {


      this.reviewedProductIds =
        new Set<number>();


      this.myReviews =
        new Map<
          number,
          ProductReview
        >();


      return;


    }



    const items =
      this.order.items || [];



    const ids =
      [
        ...new Set<number>(

          items

            .map(
              (item: any) =>
                Number(
                  item?.productId
                )
            )

            .filter(
              (id: number) =>
                Number.isFinite(id)
            )

        )
      ];



    const reviewed =
      new Set<number>();



    const myReviews =
      new Map<
        number,
        ProductReview
      >();



    await Promise.all(

      ids.map(

        async productId => {


          try {


            const review =
              await this.reviewService
                .getMyReview(
                  productId
                );



            if (
              review
              &&
              review.id
            ) {


              reviewed.add(
                productId
              );


              myReviews.set(
                productId,
                review
              );


            }


          } catch (error) {


            console.error(
              'Unable to check review:',
              error
            );


          }


        }

      )

    );



    this.reviewedProductIds =
      reviewed;



    this.myReviews =
      myReviews;


  }



  /* =========================
     START REVIEW
     ========================= */

  async startReview(
    item: any
  ):
    Promise<void> {


    const id =
      this.productId(
        item
      );



    if (
      !this.canReviewItem(
        item
      )
    ) {


      return;


    }



    if (
      this.reviewedProductIds
        .has(id)
    ) {


      await this.showToast(
        'You already reviewed this product.'
      );


      return;


    }



    this.reviewingProductId =
      id;



    this.editingReviewId =
      null;



    this.selectedRating =
      0;



    this.reviewComment =
      '';


  }



  /* =========================
     EDIT REVIEW
     ========================= */

  async startEditReview(
    item: any
  ):
    Promise<void> {


    const id =
      this.productId(
        item
      );



    const review =
      this.myReviews
        .get(id);



    if (
      !review
      ||
      !review.id
    ) {


      await this.showToast(
        'Review not found.'
      );


      return;


    }



    this.reviewingProductId =
      id;



    this.editingReviewId =
      review.id;



    this.selectedRating =
      Number(
        review.rating || 0
      );



    this.reviewComment =
      String(
        review.comment || ''
      );


  }



  /* =========================
     CANCEL REVIEW
     ========================= */

  cancelReview():
    void {


    this.reviewingProductId =
      null;



    this.editingReviewId =
      null;



    this.selectedRating =
      0;



    this.reviewComment =
      '';



    this.submittingReview =
      false;


  }



  /* =========================
     SELECT RATING
     ========================= */

  selectRating(
    rating: number
  ):
    void {


    if (
      rating < 1
      ||
      rating > 5
    ) {


      return;


    }



    this.selectedRating =
      rating;


  }



  /* =========================
     RATING TEXT
     ========================= */

  get ratingText():
    string {


    switch (
      this.selectedRating
    ) {


      case 1:

        return 'Poor';


      case 2:

        return 'Fair';


      case 3:

        return 'Good';


      case 4:

        return 'Very Good';


      case 5:

        return 'Excellent';


      default:

        return '';


    }


  }



  /* =========================
     SUBMIT / UPDATE REVIEW
     ========================= */

  async submitReview(
    item: any
  ):
    Promise<void> {


    if (
      this.submittingReview
    ) {


      return;


    }



    const user =
      firebaseAuth.currentUser;



    if (!user) {


      await this.showToast(
        'Please log in first.'
      );


      return;


    }



    if (
      this.order?.status !==
        'Delivered'
    ) {


      await this.showToast(
        'You can only review delivered orders.'
      );


      return;


    }



    const id =
      this.productId(
        item
      );



    if (
      !Number.isFinite(id)
    ) {


      await this.showToast(
        'Unable to identify this product.'
      );


      return;


    }



    if (
      this.selectedRating < 1
      ||
      this.selectedRating > 5
    ) {


      await this.showToast(
        'Please select a rating.'
      );


      return;


    }



    const comment =
      this.reviewComment
        .trim();



    if (
      comment.length < 3
    ) {


      await this.showToast(
        'Please write a short review.'
      );


      return;


    }



    this.submittingReview =
      true;



    try {


      if (
        this.editingReviewId
      ) {


        await this.reviewService
          .updateReview(

            this.editingReviewId,

            this.selectedRating,

            comment

          );



        await this.showToast(
          'Review updated successfully.'
        );


      } else {


        const existingReview =
          await this.reviewService
            .getMyReview(
              id
            );



        if (
          existingReview
        ) {


          this.reviewedProductIds
            .add(id);



          if (
            existingReview.id
          ) {


            this.myReviews
              .set(
                id,
                existingReview
              );


          }



          await this.showToast(
            'You already reviewed this product.'
          );



          this.cancelReview();



          return;


        }



        await this.reviewService
          .addReview(

            id,

            this.selectedRating,

            comment,

            user.displayName || '',

            this.currentOrderId

          );



        await this.showToast(
          'Review submitted successfully.'
        );


      }



      this.cancelReview();



      await this.loadReviewState();


    } catch (
      error: any
    ) {


      console.error(
        'Review error:',
        error
      );



      await this.showToast(

        error?.message
        ||
        (
          this.editingReviewId
            ? 'Unable to update review.'
            : 'Unable to submit review.'
        )

      );


    } finally {


      this.submittingReview =
        false;


    }


  }



  /* =========================
     DELETE REVIEW
     ========================= */

  async confirmDeleteReview(
    item: any
  ):
    Promise<void> {


    if (
      this.deletingReview
    ) {


      return;


    }



    const id =
      this.productId(
        item
      );



    const review =
      this.myReviews
        .get(id);



    if (
      !review
      ||
      !review.id
    ) {


      await this.showToast(
        'Review not found.'
      );


      return;


    }



    const alert =
      await this.alertController
        .create({

          header:
            'Delete Review',

          message:
            'Are you sure you want to delete your review?',

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
                    .deleteReview(
                      id,
                      review.id!
                    );

                }
            }

          ]

        });



    await alert.present();


  }



  private async deleteReview(
    productId: number,
    reviewId: string
  ):
    Promise<void> {


    if (
      this.deletingReview
    ) {


      return;


    }



    this.deletingReview =
      true;



    try {


      await this.reviewService
        .deleteReview(
          reviewId
        );



      this.reviewedProductIds
        .delete(
          productId
        );



      this.myReviews
        .delete(
          productId
        );



      if (
        this.reviewingProductId ===
          productId
      ) {


        this.cancelReview();


      }



      await this.showToast(
        'Review deleted successfully.'
      );


    } catch (
      error: any
    ) {


      console.error(
        'Delete review error:',
        error
      );



      await this.showToast(

        error?.message
        ||
        'Unable to delete review.'

      );


    } finally {


      this.deletingReview =
        false;


    }


  }



  /* =========================
     DISPLAY ORDER STATUS
     ========================= */

  get displayOrderStatus():
    string {


    return this.normalizeOrderStatus(
      String(
        this.order?.status ||
        'Pending'
      )
    );


  }



  /* =========================
     NORMALIZE ORDER STATUS
     ========================= */

  private normalizeOrderStatus(
    status: string
  ):
    string {


    const cleanStatus =
      String(
        status || ''
      )
        .trim();


    if (
      cleanStatus === 'Packed'
      ||
      cleanStatus === 'Out for Delivery'
    ) {


      return 'Shipped';


    }


    return cleanStatus;


  }



  /* =========================
     DISPLAY STATUS STEPS
     ========================= */

  get displayStatusSteps():
    string[] {


    if (
      this.order?.status !==
      'Cancelled'
    ) {


      return this.statusSteps;


    }


    const history =
      Array.isArray(
        this.order?.statusHistory
      )
        ? this.order.statusHistory
        : [];


    const completed =
      history

        .map(
          (row: any) =>
            this.normalizeOrderStatus(
              String(
                row?.status || ''
              )
            )
        )

        .filter(
          (status: string) =>
            this.statusSteps.includes(
              status
            )
        );


    const unique =
      Array.from(
        new Set<string>(
          completed
        )
      );


    if (
      unique.length === 0
    ) {


      unique.push(
        'Pending'
      );


    }


    return [
      ...unique,
      'Cancelled'
    ];


  }



  /* =========================
     STATUS COMPLETE
     ========================= */

  isCompleted(
    step: string
  ) {


    if (
      this.order?.status ===
      'Cancelled'
    ) {


      return this.displayStatusSteps
        .includes(
          step
        );


    }


    const current =
      this.normalizeOrderStatus(
        String(
          this.order?.status
          ||
          'Pending'
        )
      );



    return (

      this.statusSteps
        .indexOf(step)

      <=

      this.statusSteps
        .indexOf(current)

    );


  }



  /* =========================
     CURRENT STATUS
     ========================= */

  isCurrent(
    step: string
  ) {


    return (

      this.normalizeOrderStatus(
        String(
          this.order?.status || ''
        )
      ) ===
        step

    );


  }



  /* =========================
     STATUS MESSAGE
     ========================= */

  statusMessage(
    step: string
  ) {


    switch (
      step
    ) {


      case 'Pending':

        return 'Order has been placed.';



      case 'Processing':

        return 'Your order is being prepared.';



      case 'Shipped':

        return 'Your order has been shipped.';



      case 'Delivered':

        return 'Order completed successfully.';



      case 'Cancelled':

        return 'This order has been cancelled.';



      default:

        return '';


    }


  }



  /* =========================
     DATE
     ========================= */

  date(
    value: any
  ) {


    try {


      return value
        ?.toDate?.()
        .toLocaleString(
          'en-PH'
        )

      ||

      '';


    } catch (_) {


      return '';


    }


  }



  /* =========================
     MONEY
     ========================= */

  money(
    value: number
  ) {


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
     TOAST
     ========================= */

  private async showToast(
    message: string
  ):
    Promise<void> {


    const toast =
      await this.toastController
        .create({

          message,

          duration:
            1600,

          position:
            'bottom'

        });



    await toast.present();


  }


}