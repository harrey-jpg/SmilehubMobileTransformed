import {
  Component,
  OnDestroy
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  IonicModule
} from '@ionic/angular';

import {
  CommonModule
} from '@angular/common';

import {
  OrderService
} from '../services/order.service';

import {
  AppStateService
} from '../services/app-state.service';


@Component({
  selector: 'app-orders',
  standalone: true,

  imports: [
    RouterModule,
    IonicModule,
    CommonModule
  ],

  styles: [`

    /* =========================
       PAGE HEADER
       ========================= */

    .orders-heading {
      margin-bottom: 14px;
    }

    .orders-heading h2 {
      margin: 0;

      font-size: 22px;
      font-weight: 900;
    }

    .orders-heading p {
      margin: 4px 0 0;

      font-size: 12px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       FILTERS
       ========================= */

    .status-scroll {
      overflow-x: auto;

      margin:
        0 -4px
        16px;

      padding:
        2px 4px;

      scrollbar-width: none;
    }

    .status-scroll::-webkit-scrollbar {
      display: none;
    }

    .status-filters {
      display: flex;

      gap: 8px;

      width: max-content;
    }

    .status-filter {
      border:
        1px solid
        rgba(120, 120, 120, .16);

      border-radius: 999px;

      background:
        var(--ion-card-background);

      color:
        var(--ion-text-color);

      padding:
        8px 14px;

      font-size: 12px;
      font-weight: 800;

      white-space: nowrap;

      cursor: pointer;
    }

    .status-filter.active {
      border-color:
        var(--ion-color-primary);

      background:
        var(--ion-color-primary);

      color: #ffffff;
    }


    /* =========================
       ORDER CARD
       ========================= */

    .order-card {
      padding: 16px;

      cursor: pointer;
    }

    .order-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      gap: 12px;
    }

    .order-number {
      font-size: 14px;
      font-weight: 900;

      color:
        var(--ion-text-color);
    }

    .order-date {
      margin-top: 4px;

      font-size: 11px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       STATUS BADGES
       ========================= */

    .order-status {
      flex-shrink: 0;

      padding:
        5px 9px;

      border-radius: 999px;

      font-size: 10px;
      font-weight: 900;

      text-transform: capitalize;
    }

    .status-pending {
      background:
        rgba(255, 184, 0, .17);

      color: #f2ac00;
    }

    .status-processing {
      background:
        rgba(31, 142, 255, .16);

      color: #469cff;
    }

    .status-shipped {
      background:
        rgba(112, 84, 255, .16);

      color: #9a87ff;
    }

    .status-delivered {
      background:
        rgba(0, 206, 117, .16);

      color: #00ce75;
    }

    .status-cancelled {
      background:
        rgba(235, 68, 90, .16);

      color:
        var(--ion-color-danger);
    }


    /* =========================
       PRODUCT PREVIEW
       ========================= */

    .order-product {
      display: flex;
      align-items: center;

      gap: 12px;

      margin-top: 14px;

      padding:
        12px 0;

      border-top:
        1px solid
        rgba(120, 120, 120, .10);

      border-bottom:
        1px solid
        rgba(120, 120, 120, .10);
    }

    .order-image-wrap {
      width: 58px;
      height: 58px;

      flex-shrink: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 12px;

      background:
        rgba(120, 120, 120, .08);
    }

    .order-image {
      width: 46px;
      height: 46px;

      object-fit: contain;
    }

    .order-placeholder {
      font-size: 28px;
    }

    .order-product-info {
      flex: 1;

      min-width: 0;
    }

    .order-product-name {
      font-size: 13px;
      font-weight: 900;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .order-product-meta {
      margin-top: 3px;

      font-size: 11px;

      color:
        var(--ion-color-medium);
    }

    .more-items {
      margin-top: 4px;

      font-size: 10px;

      color:
        var(--ion-color-primary);

      font-weight: 800;
    }


    /* =========================
       ORDER FOOTER
       ========================= */

    .order-footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;

      gap: 14px;

      padding-top: 13px;
    }

    .item-count {
      font-size: 11px;

      color:
        var(--ion-color-medium);
    }

    .order-total {
      text-align: right;
    }

    .order-total-label {
      font-size: 10px;

      color:
        var(--ion-color-medium);
    }

    .order-total-price {
      margin-top: 2px;

      font-size: 17px;
      font-weight: 900;

      color:
        var(--ion-color-primary);
    }

    .view-order {
      margin-top: 4px;

      display: flex;
      align-items: center;
      justify-content: flex-end;

      gap: 3px;

      font-size: 10px;
      font-weight: 800;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       EMPTY
       ========================= */

    .orders-empty {
      min-height: 55vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      padding: 30px 20px;
    }

    .orders-empty .emoji {
      font-size: 52px;

      margin-bottom: 8px;
    }

    .orders-empty h2 {
      margin:
        0 0 5px;
    }

    .orders-empty p {
      margin:
        0 0 16px;
    }


    /* =========================
       LOADING
       ========================= */

    .orders-loading {
      min-height: 45vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      gap: 10px;
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
        defaultHref="/account">
      </ion-back-button>

    </ion-buttons>


    <ion-title>

      My Orders

    </ion-title>


  </ion-toolbar>

</ion-header>



<!-- =========================
     CONTENT
     ========================= -->

<ion-content>


<div class="page-wrap no-bottom">


  <!-- =========================
       LOADING
       ========================= -->

  <div
    class="orders-loading"

    *ngIf="loading">


    <ion-spinner>
    </ion-spinner>


    <span class="muted">

      Loading your orders...

    </span>


  </div>



  <!-- =========================
       NO ORDERS AT ALL
       ========================= -->

  <div
    class="orders-empty"

    *ngIf="
      !loading &&
      orders.length === 0
    ">


    <div class="emoji">

      📦

    </div>


    <h2>

      No orders yet

    </h2>


    <p class="muted">

      Your placed orders
      will appear here.

    </p>


    <ion-button
      routerLink="/catalog">

      Shop Now

    </ion-button>


  </div>



  <!-- =========================
       ORDERS
       ========================= -->

  <ng-container
    *ngIf="
      !loading &&
      orders.length > 0
    ">


    <!-- HEADING -->

    <div class="orders-heading">


      <h2>

        Order History

      </h2>


      <p>

        {{ orders.length }}
        order{{ orders.length === 1 ? '' : 's' }}

      </p>


    </div>



    <!-- =========================
         STATUS FILTER
         ========================= -->

    <div class="status-scroll">


      <div class="status-filters">


        <button
          type="button"

          class="status-filter"

          *ngFor="
            let status
            of statuses
          "

          [class.active]="
            selectedStatus === status
          "

          (click)="
            selectedStatus = status
          ">


          {{ status }}


        </button>


      </div>


    </div>



    <!-- =========================
         EMPTY FILTER RESULT
         ========================= -->

    <div
      class="orders-empty"

      *ngIf="
        filteredOrders.length === 0
      ">


      <div class="emoji">

        📦

      </div>


      <h2>

        No {{ selectedStatus.toLowerCase() }}
        orders

      </h2>


      <p class="muted">

        Orders with this status
        will appear here.

      </p>


      <ion-button
        fill="outline"

        (click)="selectedStatus = 'All'">

        View All Orders

      </ion-button>


    </div>



    <!-- =========================
         ORDER LIST
         ========================= -->

    <div
      class="list-stack"

      *ngIf="
        filteredOrders.length > 0
      ">


      <div
        class="app-card order-card"

        *ngFor="
          let order of filteredOrders;
          trackBy: trackOrder
        "

        [routerLink]="[
          '/order-details',
          order.id
        ]">


        <!-- TOP -->

        <div class="order-top">


          <div>


            <div class="order-number">

              {{
                order.orderNumber ||
                order.id
              }}

            </div>


            <div class="order-date">

              {{ date(order.createdAt) }}

            </div>


          </div>



          <span
            class="order-status"

            [ngClass]="
              statusClass(order.status)
            ">


            {{
              order.status ||
              'Pending'
            }}


          </span>


        </div>



        <!-- =====================
             FIRST PRODUCT
             ===================== -->

        <div
          class="order-product"
          *ngIf="
            firstItem(order)
            as item
          ">


          <!-- IMAGE -->

          <div class="order-image-wrap">


            <img
              *ngIf="
                productImage(item.productId)
                as image
              "

              class="order-image"

              [src]="image"

              [alt]="item.name">


            <span
              class="order-placeholder"

              *ngIf="
                !productImage(
                  item.productId
                )
              ">

              🦷

            </span>


          </div>



          <!-- INFO -->

          <div class="order-product-info">


            <div class="order-product-name">

              {{
                item.name ||
                'Product'
              }}

            </div>


            <div class="order-product-meta">

              {{
                item.brand ||
                item.category ||
                'SmileHub'
              }}

              •

              Qty {{ item.quantity || 1 }}

            </div>


            <div
              class="more-items"

              *ngIf="
                additionalItemCount(order) > 0
              ">


              +{{ additionalItemCount(order) }}
              more item{{
                additionalItemCount(order) === 1
                  ? ''
                  : 's'
              }}


            </div>


          </div>


        </div>



        <!-- =====================
             FOOTER
             ===================== -->

        <div class="order-footer">


          <div class="item-count">


            {{
              order.itemCount ||
              calculateItemCount(order)
            }}

            item{{
              (
                order.itemCount ||
                calculateItemCount(order)
              ) === 1
                ? ''
                : 's'
            }}


            <div
              *ngIf="order.deliveryMethod">

              {{ order.deliveryMethod }}

            </div>


          </div>



          <div class="order-total">


            <div class="order-total-label">

              Order Total

            </div>


            <div class="order-total-price">

              {{ money(order.total || 0) }}

            </div>


            <div class="view-order">

              View Details

              <ion-icon
                name="chevron-forward-outline">
              </ion-icon>

            </div>


          </div>


        </div>


      </div>


    </div>


  </ng-container>


</div>


</ion-content>

`
})


export class OrdersPage
implements OnDestroy {


  orders: any[] = [];


  loading = true;


  selectedStatus = 'All';


  statuses = [
    'All',
    'Pending',
    'Processing',
    'Shipped',
    'Delivered'
  ];


  private sub?: {
    unsubscribe(): void
  };



  constructor(

    private service: OrderService,

    private state: AppStateService

  ) {}



  /* =========================
     PAGE ENTER
     ========================= */

  ionViewWillEnter(): void {


    this.loading = true;


    this.sub?.unsubscribe();


    try {


      this.sub =
        this.service
          .watchMyOrders()
          .subscribe({


            next: rows => {


              this.orders =
                rows || [];


              this.loading =
                false;


            },


            error: error => {


              console.error(
                'Unable to load orders:',
                error
              );


              this.orders = [];


              this.loading =
                false;


            }


          });


    } catch (error) {


      console.error(
        'Unable to watch orders:',
        error
      );


      this.orders = [];


      this.loading =
        false;


    }

  }



  /* =========================
     PAGE LEAVE
     ========================= */

  ionViewWillLeave(): void {


    this.sub?.unsubscribe();

  }



  /* =========================
     DESTROY
     ========================= */

  ngOnDestroy(): void {


    this.sub?.unsubscribe();

  }



  /* =========================
     FILTERED ORDERS
     ========================= */

  get filteredOrders(): any[] {


    if (
      this.selectedStatus === 'All'
    ) {


      return this.orders;

    }


    const selected =
      this.selectedStatus
        .trim()
        .toLowerCase();


    return this.orders.filter(
      order => {


        const status =
          String(
            order.status ||
            'Pending'
          )
            .trim()
            .toLowerCase();


        return (
          status === selected
        );

      }
    );

  }



  /* =========================
     FIRST ORDER ITEM
     ========================= */

  firstItem(
    order: any
  ): any | null {


    if (
      !Array.isArray(order?.items) ||
      order.items.length === 0
    ) {


      return null;

    }


    return order.items[0];

  }



  /* =========================
     ADDITIONAL ITEMS
     ========================= */

  additionalItemCount(
    order: any
  ): number {


    if (
      !Array.isArray(order?.items)
    ) {


      return 0;

    }


    return Math.max(
      0,
      order.items.length - 1
    );

  }



  /* =========================
     CALCULATE ITEM COUNT
     ========================= */

  calculateItemCount(
    order: any
  ): number {


    if (
      !Array.isArray(order?.items)
    ) {


      return 0;

    }


    return order.items.reduce(

      (
        total: number,
        item: any
      ) => {


        return (

          total

          +

          Number(
            item?.quantity || 0
          )

        );


      },

      0

    );

  }



  /* =========================
     PRODUCT IMAGE
     ========================= */

  productImage(
    productId: number
  ): string | null {


    if (!productId) {


      return null;

    }


    try {


      const product =
        this.state
          .productById(
            Number(productId)
          );


      return (
        product?.imageAsset ||
        null
      );


    } catch {


      return null;

    }

  }



  /* =========================
     STATUS CLASS
     ========================= */

  statusClass(
    status: string
  ): string {


    const value =
      String(
        status ||
        'Pending'
      )
        .trim()
        .toLowerCase();


    switch (value) {


      case 'processing':

        return 'status-processing';


      case 'shipped':

        return 'status-shipped';


      case 'delivered':

        return 'status-delivered';


      case 'cancelled':

      case 'canceled':

        return 'status-cancelled';


      default:

        return 'status-pending';

    }

  }



  /* =========================
     ORDER DATE
     ========================= */

  date(
    value: any
  ): string {


    try {


      const date =
        value?.toDate?.();


      if (!date) {


        return 'Recent';

      }


      return date
        .toLocaleDateString(

          'en-PH',

          {

            year: 'numeric',

            month: 'short',

            day: 'numeric'

          }

        );


    } catch {


      return 'Recent';

    }

  }



  /* =========================
     TRACK ORDER
     ========================= */

  trackOrder(
    index: number,
    order: any
  ): string | number {


    return (
      order?.id ||
      index
    );

  }



  /* =========================
     MONEY
     ========================= */

  money(
    value: number
  ): string {


    return new Intl.NumberFormat(

      'en-PH',

      {

        style: 'currency',

        currency: 'PHP'

      }

    ).format(
      Number(value || 0)
    );

  }


}