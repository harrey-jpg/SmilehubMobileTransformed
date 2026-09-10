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
  FormsModule
} from '@angular/forms';

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
    CommonModule,
    FormsModule
  ],


  styles: [`

    /* =========================
       PAGE
       ========================= */

    .orders-page {
      padding-bottom: 30px;
    }


    /* =========================
       INTRO
       ========================= */

    .orders-intro {
      margin-bottom: 15px;
    }


    .orders-kicker {
      color:
        var(--ion-color-primary);

      font-size: 9px;
      font-weight: 900;

      letter-spacing: .8px;

      text-transform: uppercase;
    }


    .orders-title {
      margin:
        4px 0 4px;

      font-size: 22px;
      line-height: 1.2;

      font-weight: 900;
    }


    .orders-subtitle {
      margin: 0;

      font-size: 11px;
      line-height: 1.5;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       SEARCH
       ========================= */

    .order-search {
      padding: 0;

      margin-bottom: 13px;

      --border-radius: 16px;

      --box-shadow: none;

      --background:
        var(--ion-card-background);
    }


    /* =========================
       FILTERS
       ========================= */

    .status-scroll {
      overflow-x: auto;
      overflow-y: hidden;

      margin:
        0 -2px 18px;

      padding:
        2px 2px 6px;

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
      min-height: 38px;

      display: inline-flex;
      align-items: center;

      gap: 6px;

      padding:
        7px 12px;

      border:
        1px solid
        rgba(
          120,
          120,
          120,
          .16
        );

      border-radius: 999px;

      background:
        var(--ion-card-background);

      color:
        var(--ion-text-color);

      font-size: 10px;
      font-weight: 800;

      white-space: nowrap;

      cursor: pointer;

      transition:
        transform .15s ease,
        border-color .15s ease,
        background .15s ease;
    }


    .status-filter:active {
      transform:
        scale(.96);
    }


    .status-filter.active {
      border-color:
        var(--ion-color-primary);

      background:
        var(--ion-color-primary);

      color: #ffffff;
    }


    .filter-count {
      min-width: 20px;

      padding:
        2px 6px;

      border-radius: 999px;

      text-align: center;

      background:
        rgba(
          255,
          255,
          255,
          .12
        );

      font-size: 8px;
      font-weight: 900;
    }


    .status-filter:not(.active)
    .filter-count {
      background:
        rgba(
          var(--ion-color-primary-rgb),
          .09
        );

      color:
        var(--ion-color-primary);
    }


    /* =========================
       SEARCH RESULT INFO
       ========================= */

    .search-info {
      margin:
        -5px 2px 14px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 10px;

      font-size: 9px;

      color:
        var(--ion-color-medium);
    }


    .search-info strong {
      color:
        var(--ion-text-color);
    }


    .clear-search {
      border: none;

      background: transparent;

      color:
        var(--ion-color-primary);

      font-size: 9px;
      font-weight: 900;

      cursor: pointer;
    }


    /* =========================
       ORDER LIST
       ========================= */

    .orders-list {
      display: flex;
      flex-direction: column;

      gap: 12px;
    }


    .order-card {
      padding: 15px;

      border-radius: 20px;

      cursor: pointer;

      transition:
        transform .15s ease;
    }


    .order-card:active {
      transform:
        scale(.99);
    }


    /* =========================
       ORDER TOP
       ========================= */

    .order-top {
      display: flex;

      align-items: flex-start;
      justify-content: space-between;

      gap: 12px;
    }


    .order-number-label {
      margin-bottom: 3px;

      font-size: 8px;

      color:
        var(--ion-color-medium);
    }


    .order-number {
      color:
        var(--ion-text-color);

      font-size: 13px;
      font-weight: 900;

      word-break: break-word;
    }


    .order-date {
      margin-top: 4px;

      font-size: 9px;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       STATUS
       ========================= */

    .order-status {
      flex-shrink: 0;

      padding:
        5px 9px;

      border-radius: 999px;

      font-size: 8px;
      font-weight: 900;

      text-transform: capitalize;
    }


    .status-pending {
      background:
        rgba(
          255,
          184,
          0,
          .15
        );

      color: #f2ac00;
    }


    .status-processing {
      background:
        rgba(
          31,
          142,
          255,
          .14
        );

      color: #469cff;
    }


    .status-shipped {
      background:
        rgba(
          112,
          84,
          255,
          .14
        );

      color: #9a87ff;
    }


    .status-delivered {
      background:
        rgba(
          0,
          206,
          117,
          .14
        );

      color: #00ce75;
    }


    .status-cancelled {
      background:
        rgba(
          235,
          68,
          90,
          .14
        );

      color:
        var(--ion-color-danger);
    }


    /* =========================
       PRODUCT PREVIEW
       ========================= */

    .order-product {
      margin-top: 13px;

      padding:
        12px 0;

      display: flex;
      align-items: center;

      gap: 12px;

      border-top:
        1px solid
        rgba(
          120,
          120,
          120,
          .10
        );

      border-bottom:
        1px solid
        rgba(
          120,
          120,
          120,
          .10
        );
    }


    .order-image-wrap {
      width: 68px;
      height: 68px;

      flex-shrink: 0;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 15px;

      overflow: hidden;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .07
        );
    }


    .order-image {
      width: 55px;
      height: 55px;

      object-fit: contain;
    }


    .order-placeholder {
      font-size: 29px;
    }


    .order-product-info {
      flex: 1;

      min-width: 0;
    }


    .order-product-brand {
      margin-bottom: 3px;

      color:
        var(--ion-color-primary);

      font-size: 8px;
      font-weight: 900;

      text-transform: uppercase;
    }


    .order-product-name {
      font-size: 11px;
      line-height: 1.35;

      font-weight: 900;

      overflow: hidden;

      display: -webkit-box;

      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }


    .order-product-meta {
      margin-top: 5px;

      font-size: 9px;

      color:
        var(--ion-color-medium);
    }


    .more-items {
      display: inline-flex;

      margin-top: 6px;

      padding:
        3px 7px;

      border-radius: 999px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .08
        );

      color:
        var(--ion-color-primary);

      font-size: 8px;
      font-weight: 900;
    }


    /* =========================
       ORDER FOOTER
       ========================= */

    .order-footer {
      padding-top: 13px;

      display: flex;

      align-items: flex-end;
      justify-content: space-between;

      gap: 14px;
    }


    .order-meta {
      flex: 1;

      min-width: 0;
    }


    .item-count {
      font-size: 10px;
      font-weight: 800;
    }


    .delivery-method {
      margin-top: 4px;

      font-size: 9px;

      color:
        var(--ion-color-medium);
    }


    .order-total {
      flex-shrink: 0;

      text-align: right;
    }


    .order-total-label {
      font-size: 8px;

      color:
        var(--ion-color-medium);
    }


    .order-total-price {
      margin-top: 2px;

      color:
        var(--ion-color-primary);

      font-size: 17px;
      font-weight: 900;
    }


    .view-order {
      margin-top: 5px;

      display: flex;

      align-items: center;
      justify-content: flex-end;

      gap: 3px;

      color:
        var(--ion-color-medium);

      font-size: 8px;
      font-weight: 800;
    }


    .view-order ion-icon {
      font-size: 13px;
    }


    /* =========================
       EMPTY STATE
       ========================= */

    .orders-empty {
      min-height: 52vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      padding: 30px 22px;
    }


    .empty-icon {
      width: 82px;
      height: 82px;

      display: flex;

      align-items: center;
      justify-content: center;

      margin-bottom: 15px;

      border-radius: 24px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      font-size: 36px;
    }


    .orders-empty h2 {
      margin:
        0 0 6px;

      font-size: 19px;
      font-weight: 900;
    }


    .orders-empty p {
      max-width: 270px;

      margin:
        0 0 17px;

      color:
        var(--ion-color-medium);

      font-size: 11px;
      line-height: 1.5;
    }


    .orders-empty ion-button {
      --border-radius: 13px;

      font-weight: 900;
    }


    /* =========================
       LOADING
       ========================= */

    .orders-loading {
      min-height: 55vh;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      gap: 10px;

      text-align: center;
    }


    .orders-loading span {
      color:
        var(--ion-color-medium);

      font-size: 10px;
    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (min-width: 720px) {

      .orders-list {
        display: grid;

        grid-template-columns:
          repeat(
            2,
            minmax(0, 1fr)
          );

        gap: 14px;
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


  <div class="page-wrap no-bottom orders-page">


    <!-- =========================
         LOADING
         ========================= -->

    <div

      class="orders-loading"

      *ngIf="loading">


      <ion-spinner
        name="crescent">
      </ion-spinner>


      <span>

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


      <div class="empty-icon">

        📦

      </div>


      <h2>

        No orders yet

      </h2>


      <p>

        Your SmileHub purchases
        will appear here after
        you place your first order.

      </p>


      <ion-button
        routerLink="/catalog">

        Shop Now

      </ion-button>


    </div>



    <!-- =========================
         ORDERS CONTENT
         ========================= -->

    <ng-container

      *ngIf="
        !loading &&
        orders.length > 0
      ">


      <!-- =========================
           INTRO
           ========================= -->

      <div class="orders-intro">


        <div class="orders-kicker">

          SmileHub Purchases

        </div>


        <h1 class="orders-title">

          Order History

        </h1>


        <p class="orders-subtitle">

          Track your current orders
          and review your previous
          SmileHub purchases.

        </p>


      </div>



      <!-- =========================
           SEARCH
           ========================= -->

      <ion-searchbar

        class="order-search"

        [(ngModel)]="search"

        placeholder="Search orders or products..."

        [debounce]="150"

        showClearButton="focus">

      </ion-searchbar>



      <!-- =========================
           STATUS FILTERS
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


            <span>

              {{ status }}

            </span>


            <span class="filter-count">

              {{ statusCount(status) }}

            </span>


          </button>


        </div>


      </div>



      <!-- =========================
           SEARCH INFO
           ========================= -->

      <div

        class="search-info"

        *ngIf="
          search.trim()
        ">


        <span>

          <strong>
            {{ filteredOrders.length }}
          </strong>

          result{{
            filteredOrders.length === 1
              ? ''
              : 's'
          }}

          for "{{ search }}"

        </span>


        <button

          type="button"

          class="clear-search"

          (click)="clearSearch()">

          Clear

        </button>


      </div>



      <!-- =========================
           EMPTY FILTER / SEARCH
           ========================= -->

      <div

        class="orders-empty"

        *ngIf="
          filteredOrders.length === 0
        ">


        <div class="empty-icon">

          🔍

        </div>


        <h2>


          {{
            search.trim()

              ? 'No matching orders'

              : selectedStatus === 'All'

                ? 'No orders found'

                : 'No '
                  +
                  selectedStatus.toLowerCase()
                  +
                  ' orders'
          }}


        </h2>


        <p>


          {{
            search.trim()

              ? 'Try another order number, product name, brand, or keyword.'

              : 'Orders with this status will appear here when available.'
          }}


        </p>


        <ion-button

          fill="outline"

          (click)="resetFilters()">

          View All Orders

        </ion-button>


      </div>



      <!-- =========================
           ORDER LIST
           ========================= -->

      <div

        class="orders-list"

        *ngIf="
          filteredOrders.length > 0
        ">


        <div

          class="
            app-card
            order-card
          "

          *ngFor="
            let order
            of filteredOrders;
            trackBy: trackOrder
          "

          [routerLink]="[
            '/order-details',
            order.id
          ]">



          <!-- =====================
               ORDER TOP
               ===================== -->

          <div class="order-top">


            <div>


              <div class="order-number-label">

                Order Number

              </div>


              <div class="order-number">

                {{
                  order.orderNumber
                  ||
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
                statusClass(
                  order.status
                )
              ">


              {{
                order.status
                ||
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
                  productImage(
                    item.productId
                  )
                  as image
                "

                class="order-image"

                [src]="image"

                [alt]="
                  item.name
                  ||
                  'Product'
                ">


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



            <!-- PRODUCT INFO -->

            <div class="order-product-info">


              <div class="order-product-brand">

                {{
                  item.brand
                  ||
                  item.category
                  ||
                  'SmileHub'
                }}

              </div>


              <div class="order-product-name">

                {{
                  item.name
                  ||
                  'Product'
                }}

              </div>


              <div class="order-product-meta">

                Qty {{ item.quantity || 1 }}


                <ng-container
                  *ngIf="
                    item.price
                  ">

                  • {{ money(item.price) }}

                </ng-container>


              </div>


              <div

                class="more-items"

                *ngIf="
                  additionalItemCount(order)
                  > 0
                ">


                +{{ additionalItemCount(order) }}

                more item{{
                  additionalItemCount(order)
                    === 1
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


            <div class="order-meta">


              <div class="item-count">

                {{ itemCount(order) }}

                item{{
                  itemCount(order) === 1
                    ? ''
                    : 's'
                }}

              </div>


              <div

                class="delivery-method"

                *ngIf="
                  order.deliveryMethod
                ">

                {{ order.deliveryMethod }}

              </div>


            </div>



            <div class="order-total">


              <div class="order-total-label">

                Order Total

              </div>


              <div class="order-total-price">

                {{
                  money(
                    order.total
                    ||
                    0
                  )
                }}

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


  orders:
    any[] =
    [];


  loading =
    true;


  selectedStatus =
    'All';


  search =
    '';


  statuses = [
    'All',
    'Pending',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];


  private sub?: {
    unsubscribe(): void
  };



  constructor(

    private service:
      OrderService,

    private state:
      AppStateService

  ) {}



  /* =========================
     PAGE ENTER
     ========================= */

  ionViewWillEnter():
    void {


    this.loading =
      true;


    this.sub
      ?.unsubscribe();


    void this.state
      .loadProductsFromFirestore();


    try {


      this.sub =
        this.service
          .watchMyOrders()
          .subscribe({


            next:
              rows => {


                this.orders =
                  rows
                  ||
                  [];


                this.loading =
                  false;


              },


            error:
              error => {


                console.error(
                  'Unable to load orders:',
                  error
                );


                this.orders =
                  [];


                this.loading =
                  false;


              }


          });


    } catch (
      error
    ) {


      console.error(
        'Unable to watch orders:',
        error
      );


      this.orders =
        [];


      this.loading =
        false;


    }


  }



  /* =========================
     PAGE LEAVE
     ========================= */

  ionViewWillLeave():
    void {


    this.sub
      ?.unsubscribe();


  }



  /* =========================
     DESTROY
     ========================= */

  ngOnDestroy():
    void {


    this.sub
      ?.unsubscribe();


  }



  /* =========================
     FILTERED ORDERS
     ========================= */

  get filteredOrders():
    any[] {


    const searchTerm =
      this.search
        .trim()
        .toLowerCase();


    const selected =
      this.selectedStatus
        .trim()
        .toLowerCase();


    return this.orders
      .filter(

        order => {


          /* =====================
             STATUS FILTER
             ===================== */

          const currentStatus =
            String(
              order.status
              ||
              'Pending'
            )
              .trim()
              .toLowerCase();


          let matchesStatus =
            true;


          if (
            selected !==
            'all'
          ) {


            if (
              selected ===
              'cancelled'
            ) {


              matchesStatus =

                currentStatus ===
                  'cancelled'

                ||

                currentStatus ===
                  'canceled';


            } else {


              matchesStatus =
                currentStatus ===
                selected;


            }


          }


          if (
            !matchesStatus
          ) {


            return false;


          }



          /* =====================
             NO SEARCH
             ===================== */

          if (
            !searchTerm
          ) {


            return true;


          }



          /* =====================
             SEARCH ORDER ITEMS
             ===================== */

          const itemText =

            Array.isArray(
              order?.items
            )

              ? order.items
                  .map(

                    (
                      item: any
                    ) => {


                      return [

                        item?.name
                        ||
                        '',

                        item?.brand
                        ||
                        '',

                        item?.category
                        ||
                        ''

                      ]
                        .join(
                          ' '
                        );


                    }

                  )
                  .join(
                    ' '
                  )

              : '';



          /* =====================
             ALL SEARCHABLE DATA
             ===================== */

          const searchableText =
            [

              order.orderNumber
              ||
              '',

              order.id
              ||
              '',

              order.status
              ||
              '',

              order.deliveryMethod
              ||
              '',

              order.paymentMethod
              ||
              '',

              itemText

            ]
              .join(
                ' '
              )
              .toLowerCase();


          return searchableText
            .includes(
              searchTerm
            );


        }

      );


  }



  /* =========================
     CLEAR SEARCH
     ========================= */

  clearSearch():
    void {


    this.search =
      '';


  }



  /* =========================
     RESET FILTERS
     ========================= */

  resetFilters():
    void {


    this.search =
      '';


    this.selectedStatus =
      'All';


  }



  /* =========================
     STATUS COUNT
     ========================= */

  statusCount(
    status: string
  ):
    number {


    if (
      status ===
      'All'
    ) {


      return this.orders.length;


    }


    const selected =
      status
        .trim()
        .toLowerCase();


    return this.orders
      .filter(

        order => {


          const current =
            String(
              order.status
              ||
              'Pending'
            )
              .trim()
              .toLowerCase();


          if (
            selected ===
            'cancelled'
          ) {


            return (

              current ===
                'cancelled'

              ||

              current ===
                'canceled'

            );


          }


          return (
            current ===
            selected
          );


        }

      )
      .length;


  }



  /* =========================
     FIRST ITEM
     ========================= */

  firstItem(
    order: any
  ):
    any | null {


    if (
      !Array.isArray(
        order?.items
      )
      ||
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
  ):
    number {


    if (
      !Array.isArray(
        order?.items
      )
    ) {


      return 0;


    }


    return Math.max(

      0,

      order.items.length
      -
      1

    );


  }



  /* =========================
     ITEM COUNT
     ========================= */

  itemCount(
    order: any
  ):
    number {


    const saved =
      Number(
        order?.itemCount
        ||
        0
      );


    if (
      Number.isFinite(
        saved
      )
      &&
      saved > 0
    ) {


      return saved;


    }


    return this
      .calculateItemCount(
        order
      );


  }



  calculateItemCount(
    order: any
  ):
    number {


    if (
      !Array.isArray(
        order?.items
      )
    ) {


      return 0;


    }


    return order.items
      .reduce(

        (
          total:
            number,

          item:
            any
        ) => {


          return (

            total

            +

            Number(
              item?.quantity
              ||
              0
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
  ):
    string | null {


    if (
      !productId
    ) {


      return null;


    }


    try {


      const product =
        this.state
          .productById(
            Number(
              productId
            )
          );


      return (

        product?.image

        ||

        product?.imageAsset

        ||

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
  ):
    string {


    const value =
      String(
        status
        ||
        'Pending'
      )
        .trim()
        .toLowerCase();


    switch (
      value
    ) {


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
     DATE
     ========================= */

  date(
    value: any
  ):
    string {


    try {


      const parsed =

        value?.toDate?.()

        ??

        (
          value instanceof Date

            ? value

            : value

              ? new Date(
                  value
                )

              : null
        );


      if (
        !parsed
        ||
        Number.isNaN(
          parsed.getTime()
        )
      ) {


        return 'Recent';


      }


      return parsed
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


      return 'Recent';


    }


  }



  /* =========================
     TRACK ORDER
     ========================= */

  trackOrder(
    index: number,
    order: any
  ):
    string | number {


    return (

      order?.id

      ||

      index

    );


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


}