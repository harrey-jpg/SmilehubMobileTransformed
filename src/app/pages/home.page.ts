import {
  Component,
  HostListener
} from '@angular/core';

import {
  Router,
  RouterModule
} from '@angular/router';

import { IonicModule, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppStateService } from '../services/app-state.service';
import { NotificationService } from '../services/notification.service';
import { ProductCardComponent } from '../shared/product-card.component';
import { BottomNavComponent } from '../shared/bottom-nav.component';


@Component({
  selector: 'app-home',
  standalone: true,

  imports: [
    RouterModule,
    IonicModule,
    CommonModule,
    FormsModule,
    ProductCardComponent,
    BottomNavComponent
  ],

  styles: [`

    /* =========================
       SEARCH
       ========================= */

    .search-shell {
      position: relative;
      z-index: 100;
      margin-bottom: 12px;
    }

    .home-search {
      --background: var(--ion-card-background, #ffffff);
      --border-radius: 14px;
      --box-shadow: none;
      padding: 0;
    }


    /* =========================
       SEARCH DROPDOWN
       ========================= */

    .search-suggestions {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;

      background: var(--ion-card-background, #ffffff);

      border-radius: 14px;

      border: 1px solid
        rgba(120, 120, 120, 0.12);

      box-shadow:
        0 12px 30px
        rgba(0, 0, 0, 0.18);

      max-height: calc(100vh - 260px);

      overflow-y: auto;
      overflow-x: hidden;

      z-index: 9999;
    }


    /* =========================
       HEADINGS
       ========================= */

    .suggestion-heading {
      padding: 11px 14px 6px;

      font-size: 11px;
      font-weight: 900;

      color: var(--ion-color-medium);

      text-transform: uppercase;
      letter-spacing: .5px;
    }

    .suggestion-heading-row {
      display: flex;
      align-items: center;
      justify-content: space-between;

      padding-right: 12px;
    }

    .suggestion-heading-row .suggestion-heading {
      flex: 1;
    }

    .history-clear {
      border: none;

      background: transparent;

      color: var(--ion-color-primary);

      font-size: 11px;
      font-weight: 800;

      cursor: pointer;

      padding: 7px 4px 3px;
    }


    /* =========================
       SEARCH KEYWORDS
       ========================= */

    .search-keyword {
      min-height: 42px;

      display: flex;
      align-items: center;

      gap: 10px;

      padding: 9px 14px;

      cursor: pointer;

      border-bottom:
        1px solid
        rgba(120, 120, 120, 0.09);

      transition: background .15s ease;
    }

    .search-keyword:hover {
      background:
        rgba(15, 131, 154, 0.07);
    }

    .search-keyword ion-icon {
      font-size: 18px;

      flex-shrink: 0;

      color: var(--ion-color-medium);
    }

    .keyword-text {
      flex: 1;

      font-size: 14px;
      font-weight: 700;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .recent-label {
      font-size: 9px;
      font-weight: 800;

      color: var(--ion-color-medium);

      text-transform: uppercase;

      opacity: .75;
    }


    /* =========================
       PRODUCT SUGGESTIONS
       ========================= */

    .product-suggestion {
      min-height: 58px;

      display: flex;
      align-items: center;

      gap: 10px;

      padding: 8px 12px;

      cursor: pointer;

      border-bottom:
        1px solid
        rgba(120, 120, 120, 0.09);

      transition: background .15s ease;
    }

    .product-suggestion:hover {
      background:
        rgba(15, 131, 154, 0.07);
    }

    .suggestion-image {
      width: 40px;
      height: 40px;

      flex-shrink: 0;

      border-radius: 9px;

      object-fit: contain;

      background: #f4f7f9;

      padding: 4px;
    }

    .suggestion-info {
      flex: 1;
      min-width: 0;
    }

    .suggestion-name {
      font-size: 13px;
      font-weight: 800;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .suggestion-meta {
      margin-top: 2px;

      font-size: 10px;

      color: var(--ion-color-medium);

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .suggestion-price {
      margin-top: 2px;

      font-size: 12px;
      font-weight: 900;

      color: var(--ion-color-primary);
    }

    .suggestion-arrow {
      flex-shrink: 0;

      font-size: 17px;

      color: var(--ion-color-medium);
    }


    /* =========================
       SEE ALL
       ========================= */

    .see-all-search {
      min-height: 43px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 10px;

      padding: 10px 14px;

      cursor: pointer;

      font-size: 12px;
      font-weight: 900;

      color: var(--ion-color-primary);
    }

    .see-all-search:hover {
      background:
        rgba(15, 131, 154, 0.07);
    }


    /* =========================
       NO RESULT
       ========================= */

    .no-search-result {
      padding: 15px 14px;

      text-align: center;
    }

    .no-search-result ion-icon {
      font-size: 26px;

      color: var(--ion-color-medium);
    }

    .no-search-result p {
      margin: 6px 0 0;

      font-size: 12px;

      color: var(--ion-color-medium);
    }


    /* =========================
       RECENTLY VIEWED
       ========================= */

    .recently-viewed-scroll {
      display: flex;
      gap: 10px;

      overflow-x: auto;
      overflow-y: hidden;

      padding: 2px 1px 8px;

      scrollbar-width: none;
    }

    .recently-viewed-scroll::-webkit-scrollbar {
      display: none;
    }

    .recently-viewed-card {
      width: 148px;
      min-width: 148px;

      padding: 11px;

      cursor: pointer;
    }

    .recently-viewed-image {
      height: 96px;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;

      margin-bottom: 8px;

      border-radius: 12px;

      background:
        rgba(120, 120, 120, .06);
    }

    .recently-viewed-image img {
      width: 78px;
      height: 78px;

      object-fit: contain;
    }

    .recently-viewed-brand {
      font-size: 9px;
      font-weight: 800;

      color:
        var(--ion-color-medium);

      text-transform: uppercase;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .recently-viewed-name {
      min-height: 34px;

      margin-top: 3px;

      font-size: 11px;
      line-height: 1.4;
      font-weight: 800;

      overflow: hidden;

      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .recently-viewed-price {
      margin-top: 6px;

      font-size: 12px;
      font-weight: 900;

      color:
        var(--ion-color-primary);
    }


    /* =========================
       DARK MODE
       ========================= */

    @media (prefers-color-scheme: dark) {

      .suggestion-image {
        background:
          rgba(255, 255, 255, 0.92);
      }

    }


    /* =========================
       AI CHAT FLOATING BUTTON
       ========================= */

    .ai-chat-fab {
      margin-bottom: 72px;
      margin-right: 8px;
      z-index: 1000;
    }

    .ai-chat-fab ion-fab-button {
      width: 54px;
      height: 54px;
    }

  `],

  template: `


<!-- ==================================
     HEADER
     ================================== -->

<ion-header>

  <ion-toolbar>

    <ion-title>

      <div class="logo">

        <span class="logo-mark">
          🦷
        </span>

        <span>
          SmileHub
        </span>

      </div>

    </ion-title>


    <ion-buttons
      slot="end"
      class="header-actions">


      <!-- NOTIFICATIONS -->

      <ion-button
        routerLink="/notifications"
        class="icon-btn">

        <ion-icon
          name="notifications-outline">
        </ion-icon>

        <ion-badge
          color="danger"
          class="header-badge"
          *ngIf="unreadNotificationCount > 0">

          {{ badgeText(unreadNotificationCount) }}

        </ion-badge>

      </ion-button>


      <!-- WISHLIST -->

      <ion-button
        routerLink="/wishlist"
        class="icon-btn">

        <ion-icon
          name="heart-outline">
        </ion-icon>

        <ion-badge
          color="danger"
          class="header-badge"
          *ngIf="state.wishlist.size > 0">

          {{ badgeText(state.wishlist.size) }}

        </ion-badge>

      </ion-button>


      <!-- CART -->

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



<!-- ==================================
     CONTENT
     ================================== -->

<ion-content>

<div class="page-wrap">


  <!-- ==================================
       SEARCH
       ================================== -->

  <div
    class="search-shell"
    (click)="$event.stopPropagation()">


    <ion-searchbar
      class="home-search"

      [(ngModel)]="searchText"

      placeholder="Search dental supplies..."

      [debounce]="0"

      (ionFocus)="openSearchSuggestions()"

      (ionInput)="onSearchInput()"

      (keyup.enter)="searchAll()">

    </ion-searchbar>



    <!-- SEARCH DROPDOWN -->

    <div
      class="search-suggestions"
      *ngIf="showSearchSuggestions">


      <!-- ==================================
           EMPTY SEARCH
           ================================== -->

      <ng-container
        *ngIf="!cleanSearch">


        <!-- RECENT SEARCHES -->

        <ng-container
          *ngIf="recentSearches.length > 0">


          <div class="suggestion-heading-row">


            <div class="suggestion-heading">

              Recent Searches

            </div>


            <button
              type="button"
              class="history-clear"

              (click)="clearRecentSearches()">

              Clear

            </button>


          </div>



          <div
            class="search-keyword"

            *ngFor="let keyword of visibleRecentSearches"

            (click)="searchRecent(keyword)">


            <ion-icon
              name="search-outline">
            </ion-icon>


            <span class="keyword-text">

              {{ keyword }}

            </span>


            <span class="recent-label">

              Recent

            </span>


          </div>


        </ng-container>



        <!-- POPULAR SEARCHES -->

        <ng-container
          *ngIf="visiblePopularSearches.length > 0">


          <div class="suggestion-heading">

            Popular Searches

          </div>



          <div
            class="search-keyword"

            *ngFor="let keyword of visiblePopularSearches"

            (click)="searchKeyword(keyword)">


            <ion-icon
              name="search-outline">
            </ion-icon>


            <span class="keyword-text">

              {{ keyword }}

            </span>


          </div>


        </ng-container>



        <!-- POPULAR PRODUCTS -->

        <div
          class="suggestion-heading"

          *ngIf="defaultSuggestions.length > 0">

          Popular Products

        </div>



        <div
          class="product-suggestion"

          *ngFor="let product of defaultSuggestions"

          (click)="openProduct(product.id)">


          <img
            class="suggestion-image"

            [src]="product.imageAsset"

            [alt]="product.name">



          <div class="suggestion-info">


            <div class="suggestion-name">

              {{ product.name }}

            </div>


            <div class="suggestion-meta">

              {{ product.brand }}
              •
              {{ product.category }}

            </div>


            <div class="suggestion-price">

              {{ money(product.price) }}

            </div>


          </div>



          <ion-icon
            class="suggestion-arrow"

            name="chevron-forward-outline">
          </ion-icon>


        </div>


      </ng-container>



      <!-- ==================================
           USER IS TYPING
           ================================== -->

      <ng-container
        *ngIf="cleanSearch">


        <div
          class="suggestion-heading"

          *ngIf="filteredSuggestions.length > 0">

          Suggested Products

        </div>



        <!-- PRODUCT RESULTS -->

        <div
          class="product-suggestion"

          *ngFor="let product of filteredSuggestions"

          (click)="openProductFromSearch(product.id)">


          <img
            class="suggestion-image"

            [src]="product.imageAsset"

            [alt]="product.name">



          <div class="suggestion-info">


            <div class="suggestion-name">

              {{ product.name }}

            </div>


            <div class="suggestion-meta">

              {{ product.brand }}
              •
              {{ product.category }}

            </div>


            <div class="suggestion-price">

              {{ money(product.price) }}

            </div>


          </div>



          <ion-icon
            class="suggestion-arrow"

            name="chevron-forward-outline">
          </ion-icon>


        </div>



        <!-- NO RESULT -->

        <div
          class="no-search-result"

          *ngIf="filteredSuggestions.length === 0">


          <ion-icon
            name="search-outline">
          </ion-icon>


          <p>

            No product suggestions for

            "<b>{{ searchText }}</b>"

          </p>


        </div>



        <!-- SEE ALL -->

        <div
          class="see-all-search"

          (click)="searchAll()">


          <span>

            See all results for
            "{{ searchText }}"

          </span>


          <ion-icon
            name="chevron-forward-outline">
          </ion-icon>


        </div>


      </ng-container>


    </div>


  </div>



  <!-- ==================================
       HERO BANNER
       ================================== -->

  <div class="hero-banner">


    <div class="row-between">


      <div>


        <div
          style="
            font-size:22px;
            font-weight:900
          ">

          Clinic essentials,
          all in one place.

        </div>


        <p style="opacity:.9">

          Reliable supplies for
          everyday dental care.

        </p>


        <ion-button
          color="light"
          size="small"

          (click)="router.navigate(['/catalog'])">

          Shop now

        </ion-button>


      </div>



      <div style="font-size:56px">

        🦷

      </div>


    </div>


  </div>



  <!-- ==================================
       CATEGORIES
       ================================== -->

  <div class="section-row">


    <h2>

      Popular Categories

    </h2>


    <ion-button
      fill="clear"
      size="small"

      routerLink="/categories">

      View all

    </ion-button>


  </div>



  <div class="category-strip">


    <div
      class="category-bubble"

      *ngFor="let c of categories"

      (click)="openCategory(c.label)">


      <div class="category-icon">

        {{ c.icon }}

      </div>


      <div
        style="
          font-size:11px;
          font-weight:800;
          margin-top:6px
        ">

        {{ c.label }}

      </div>


    </div>


  </div>



  <!-- ==================================
       FEATURED PRODUCTS
       ================================== -->

  <div class="section-row">


    <h2>

      Featured Products

    </h2>


    <ion-button
      fill="clear"
      size="small"

      routerLink="/catalog">

      See all

    </ion-button>


  </div>



  <div class="product-grid">


    <app-product-card
      *ngFor="let p of featured"

      [product]="p">

    </app-product-card>


  </div>



  <!-- ==================================
       RECENTLY VIEWED
       ================================== -->

  <ng-container
    *ngIf="recentlyViewed.length > 0">


    <div class="section-row">


      <h2>

        Recently Viewed

      </h2>


      <ion-button
        fill="clear"
        size="small"

        (click)="clearRecentlyViewed()">

        Clear

      </ion-button>


    </div>



    <div class="recently-viewed-scroll">


      <div
        class="app-card recently-viewed-card"

        *ngFor="let p of recentlyViewed"

        (click)="openProduct(p.id)">


        <div class="recently-viewed-image">


          <img
            [src]="p.imageAsset"
            [alt]="p.name">


        </div>


        <div class="recently-viewed-brand">

          {{ p.brand }}

        </div>


        <div class="recently-viewed-name">

          {{ p.name }}

        </div>


        <div class="recently-viewed-price">

          {{ money(p.price) }}

        </div>


      </div>


    </div>


  </ng-container>



  <!-- ==================================
       NEW ARRIVALS
       ================================== -->

  <div class="section-row">


    <h2>

      New Arrivals

    </h2>


    <ion-button
      fill="clear"
      size="small"

      routerLink="/catalog">

      See all

    </ion-button>


  </div>



  <div class="list-stack">


    <div
      class="app-card row card-button"

      *ngFor="let p of latest"

      (click)="openProduct(p.id)">


      <div
        class="product-art"

        style="
          min-height:76px;
          width:76px
        ">


        <img
          [src]="p.imageAsset"

          style="
            width:58px;
            height:58px
          ">


      </div>



      <div class="flex-1">


        <div class="brand">

          {{ p.brand }}

        </div>


        <div style="font-weight:800">

          {{ p.name }}

        </div>


        <div class="price">

          {{ money(p.price) }}

        </div>


      </div>



      <ion-button
        fill="clear"

        [disabled]="isOutOfStock(p)"

        (click)="addNewArrivalToCart($event, p)">


        <ion-icon
          [name]="
            newArrivalAddedId === p.id
              ? 'checkmark-circle-outline'
              : 'add-outline'
          ">
        </ion-icon>


      </ion-button>


    </div>


  </div>


</div>


<!-- ==================================
     SMILEHUB AI FLOATING BUTTON
     ================================== -->

<ion-fab
  slot="fixed"
  vertical="bottom"
  horizontal="end"
  class="ai-chat-fab">

  <ion-fab-button
    routerLink="/chatbot"
    aria-label="Open SmileHub AI Assistant">

    <ion-icon
      name="chatbubble-ellipses-outline">
    </ion-icon>

  </ion-fab-button>

</ion-fab>


</ion-content>



<!-- ==================================
     BOTTOM NAV
     ================================== -->

<ion-footer>

  <app-bottom-nav
    active="home">
  </app-bottom-nav>

</ion-footer>

`
})


export class HomePage {


  /* ==================================
     SEARCH STATE
     ================================== */

  searchText = '';

  showSearchSuggestions = false;

  newArrivalAddedId: number | null = null;

  private newArrivalAddedTimer?: ReturnType<typeof setTimeout>;


  unreadNotificationCount = 0;


  private notificationSubscription?:
    {
      unsubscribe():
        void
    };


  recentSearches: string[] = [];


  /*
    IMPORTANT:
    Dapat nasa SAME LINE ang
    "private readonly" at variable name.
  */

  private readonly maxRecentSearches = 5;

  private readonly searchHistoryKey =
    'smilehub_recent_searches';


  popularSearches = [
    'Dental gloves',
    'Dental mirror',
    'Toothbrush',
    'Composite',
    'Face mask'
  ];



  constructor(
    public state: AppStateService,
    public router: Router,
    private toastController: ToastController,
    private notificationService: NotificationService
  ) {

    this.loadRecentSearches();

  }

  ionViewWillEnter(): void {

    this.searchText = '';

    this.showSearchSuggestions =
      false;

    this.loadRecentSearches();

    this.startNotificationWatcher();

  }



  ionViewWillLeave(): void {

    this.notificationSubscription
      ?.unsubscribe();

  }



  /* ==================================
     NOTIFICATION WATCHER
     ================================== */

  private startNotificationWatcher():
    void {


    this.notificationSubscription
      ?.unsubscribe();


    this.notificationSubscription =
      this.notificationService
        .watchMyNotifications()

        .subscribe({

          next:
            notifications => {


              this.unreadNotificationCount =
                notifications
                  .filter(
                    notification =>
                      !notification.read
                  )
                  .length;


            },

          error:
            error => {


              console.error(
                'Unable to load notification badge:',
                error
              );


              this.unreadNotificationCount =
                0;


            }

        });

  }



  /* ==================================
     CLEAN SEARCH TEXT
     ================================== */

  get cleanSearch(): string {

    return this.searchText
      .trim()
      .toLowerCase();

  }



  /* ==================================
     VISIBLE RECENT SEARCHES
     ================================== */

  get visibleRecentSearches(): string[] {

    return this.recentSearches
      .slice(0, 3);

  }



  /* ==================================
     VISIBLE POPULAR SEARCHES
     ================================== */

  get visiblePopularSearches(): string[] {


    const recent =
      new Set(

        this.recentSearches.map(
          item =>
            item.toLowerCase()
        )

      );


    return this.popularSearches

      .filter(
        keyword =>
          !recent.has(
            keyword.toLowerCase()
          )
      )

      .slice(0, 3);

  }



  /* ==================================
     SEARCH PRODUCT SUGGESTIONS
     ================================== */

  get filteredSuggestions() {


    const term =
      this.cleanSearch;


    if (!term) {

      return [];

    }


    return this.state.products

      .filter(product => {


        const productText = `

          ${product.name || ''}

          ${product.brand || ''}

          ${product.category || ''}

        `.toLowerCase();


        return productText.includes(term);

      })

      .slice(0, 4);

  }



  /* ==================================
     POPULAR PRODUCTS
     ================================== */

  get defaultSuggestions() {


    return [
      ...this.state.products
    ]

      .sort(
        (a, b) =>

          Number(b.rating || 0)

          -

          Number(a.rating || 0)
      )

      .slice(0, 2);

  }



  /* ==================================
     FEATURED PRODUCTS
     ================================== */

  get featured() {


    return [
      ...this.state.products
    ]

      .sort(
        (a, b) =>

          Number(b.rating || 0)

          -

          Number(a.rating || 0)
      )

      .slice(0, 6);

  }



  /* ==================================
     NEW ARRIVALS
     ================================== */

  get latest() {


    return this.state.products
      .slice(-4)
      .reverse();

  }



  /* ==================================
     RECENTLY VIEWED
     ================================== */

  get recentlyViewed() {


    return this.state
      .recentlyViewedProducts
      .slice(0, 6);

  }



  clearRecentlyViewed(): void {


    this.state
      .clearRecentlyViewed();

  }



  /* ==================================
     CATEGORIES
     ================================== */

  get categories() {


    const icons:
      Record<string, string> = {


      'Oral Care': '🪥',

      'Instruments': '🛠️',

      'PPE': '😷',

      'Restorative': '🧪',

      'Disposables': '🧻',

      'Impression': '😁',

      'Orthodontics': '🦷',

      'Rotary': '⚙️',

      'Equipment': '⚕️',

      'Cosmetic': '✨'

    };


    return this.state

      .getCategories()

      .filter(
        category =>
          category !== 'All'
      )

      .slice(0, 8)

      .map(
        label => ({

          label,

          icon:
            icons[label] || '🦷'

        })
      );

  }



  /* ==================================
     LOAD RECENT SEARCHES
     ================================== */

  private loadRecentSearches(): void {


    try {


      if (
        typeof localStorage ===
        'undefined'
      ) {

        return;

      }


      const stored =
        localStorage.getItem(
          this.searchHistoryKey
        );


      if (!stored) {

        this.recentSearches = [];

        return;

      }


      const parsed =
        JSON.parse(stored);


      if (!Array.isArray(parsed)) {

        this.recentSearches = [];

        return;

      }


      this.recentSearches =
        parsed

          .filter(
            item =>
              typeof item === 'string'
          )

          .slice(
            0,
            this.maxRecentSearches
          );


    } catch {


      this.recentSearches = [];

    }

  }



  /* ==================================
     SAVE RECENT SEARCH
     ================================== */

  private saveRecentSearch(
    value: string
  ): void {


    const search =
      value.trim();


    if (!search) {

      return;

    }


    const withoutDuplicate =
      this.recentSearches.filter(

        item =>

          item.toLowerCase()

          !==

          search.toLowerCase()

      );


    this.recentSearches = [

      search,

      ...withoutDuplicate

    ].slice(
      0,
      this.maxRecentSearches
    );


    try {


      if (
        typeof localStorage ===
        'undefined'
      ) {

        return;

      }


      localStorage.setItem(

        this.searchHistoryKey,

        JSON.stringify(
          this.recentSearches
        )

      );


    } catch {

      // Ignore localStorage errors

    }

  }



  /* ==================================
     CLEAR RECENT SEARCHES
     ================================== */

  clearRecentSearches(): void {


    this.recentSearches = [];


    try {


      if (
        typeof localStorage ===
        'undefined'
      ) {

        return;

      }


      localStorage.removeItem(
        this.searchHistoryKey
      );


    } catch {

      // Ignore localStorage errors

    }

  }



  /* ==================================
     OPEN SEARCH
     ================================== */

  openSearchSuggestions(): void {


    this.showSearchSuggestions =
      true;

  }



  /* ==================================
     SEARCH INPUT
     ================================== */

  onSearchInput(): void {


    this.showSearchSuggestions =
      true;

  }



  /* ==================================
     CLICK RECENT SEARCH
     ================================== */

  searchRecent(
    keyword: string
  ): void {


    this.searchText =
      keyword;


    this.searchAll();

  }



  /* ==================================
     CLICK POPULAR SEARCH
     ================================== */

  searchKeyword(
    keyword: string
  ): void {


    this.searchText =
      keyword;


    this.searchAll();

  }



  /* ==================================
     SEARCH
     ================================== */

  searchAll(): void {


    const search =
      this.searchText.trim();


    if (!search) {

      return;

    }


    this.saveRecentSearch(
      search
    );


    this.showSearchSuggestions =
      false;


    this.router.navigate(

      ['/catalog'],

      {

        queryParams: {
          search
        }

      }

    );

  }



  /* ==================================
     OPEN PRODUCT FROM SEARCH
     ================================== */

  openProductFromSearch(
    productId: number
  ): void {


    const search =
      this.searchText.trim();


    if (search) {

      this.saveRecentSearch(
        search
      );

    }


    this.openProduct(
      productId
    );

  }



  /* ==================================
     OPEN PRODUCT
     ================================== */

  openProduct(
    productId: number
  ): void {


    this.showSearchSuggestions =
      false;


    this.searchText = '';


    this.router.navigate([
      '/product-details',
      productId
    ]);

  }



  /* ==================================
     CLICK OUTSIDE SEARCH
     ================================== */

  @HostListener('document:click')

  closeSearchSuggestions(): void {


    this.showSearchSuggestions =
      false;

  }



  /* ==================================
     CATEGORY
     ================================== */

  openCategory(
    category: string
  ): void {


    this.showSearchSuggestions =
      false;


    this.router.navigate(

      ['/catalog'],

      {

        queryParams: {
          category
        }

      }

    );

  }



  /* ==================================
     NEW ARRIVALS ADD TO CART
     ================================== */

  async addNewArrivalToCart(
    event: Event,
    product: any
  ): Promise<void> {

    event.stopPropagation();

    if (!product || this.isOutOfStock(product)) {
      return;
    }

    this.state.addToCart(product.id);

    this.newArrivalAddedId = product.id;

    if (this.newArrivalAddedTimer) {
      clearTimeout(this.newArrivalAddedTimer);
    }

    this.newArrivalAddedTimer = setTimeout(() => {
      this.newArrivalAddedId = null;
    }, 1200);

    const toast = await this.toastController.create({
      message: `${product.name} added to cart.`,
      duration: 1400,
      position: 'bottom'
    });

    await toast.present();

  }



  /* ==================================
     NEW ARRIVALS STOCK CHECK
     ================================== */

  isOutOfStock(product: any): boolean {

    const stock = String(
      product?.stock ?? ''
    )
      .trim()
      .toLowerCase();

    return (
      stock === '0'
      ||
      stock.includes('out of stock')
      ||
      stock.includes('sold out')
      ||
      stock.includes('unavailable')
    );

  }



  /* ==================================
     MONEY FORMAT
     ================================== */

  money(
    value: number
  ): string {


    return new Intl.NumberFormat(

      'en-PH',

      {

        style: 'currency',

        currency: 'PHP'

      }

    ).format(value);

  }



  /* ==================================
     BADGE
     ================================== */

  badgeText(
    value: number
  ): string {


    return value > 99
      ? '99+'
      : String(value);

  }


}