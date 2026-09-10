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

.premium-banner {
  border-radius: 20px;

  padding: 18px 20px;

  background:
    linear-gradient(
      135deg,
      #0f839a,
      #25c7d9
    );

  overflow: hidden;

  min-height: 190px;
}


.hero-content {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 16px;

  min-height: 150px;
}


.hero-text {
  flex: 1;

  min-width: 0;
}


.hero-title {
  font-size: 19px;

  font-weight: 900;

  line-height: 1.25;

  color: white;
}


.hero-subtitle {
  margin:
    7px 0
    12px;

  font-size: 11px;

  line-height: 1.4;

  color: white;

  opacity: .92;
}


.hero-image {
  flex-shrink: 0;

  font-size: 58px;

  line-height: 1;
}


.premium-banner ion-button {
  min-height: 32px;

  margin: 0;

  --padding-start: 14px;
  --padding-end: 14px;

  --border-radius: 6px;

  font-size: 10px;
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
       HOME CATEGORY SVG ICONS
       ========================= */

    .category-icon {
      color: var(--ion-color-primary);

      display: flex;
      align-items: center;
      justify-content: center;
    }

    .home-category-svg {
      width: 27px;
      height: 27px;

      display: block;

      color: var(--ion-color-primary);

      fill: none !important;
      stroke: currentColor !important;

      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .home-category-svg path,
    .home-category-svg rect,
    .home-category-svg circle,
    .home-category-svg line,
    .home-category-svg polyline,
    .home-category-svg polygon {
      fill: none !important;
      stroke: currentColor !important;
      stroke-width: 1.8;
      stroke-linecap: round;
      stroke-linejoin: round;
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

  <div class="hero-banner premium-banner">

  <div class="hero-content">

    <div class="hero-text">

      <div class="hero-title">

        Professional dental supplies,
        all in one place.

      </div>


      <p class="hero-subtitle">

        Quality essentials for
        clinics and dental professionals.

      </p>


      <ion-button
        color="light"
        size="small"
        (click)="router.navigate(['/catalog'])">

        Shop Now

      </ion-button>


    </div>


    <div class="hero-image">

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

  <ng-container [ngSwitch]="c.label">

    <!-- COSMETIC: same visual meaning as sparkles-outline -->
    <svg
      *ngSwitchCase="'Cosmetic'"
      viewBox="0 0 24 24"
      class="home-category-svg">
      <path d="M12 2.8L13.5 7.2L18 8.7L13.5 10.2L12 14.7L10.5 10.2L6 8.7L10.5 7.2L12 2.8Z"></path>
      <path d="M18.5 14.5L19.3 16.7L21.5 17.5L19.3 18.3L18.5 20.5L17.7 18.3L15.5 17.5L17.7 16.7L18.5 14.5Z"></path>
      <path d="M5.5 3.5L6.1 5.1L7.7 5.7L6.1 6.3L5.5 7.9L4.9 6.3L3.3 5.7L4.9 5.1L5.5 3.5Z"></path>
    </svg>

    <!-- DISPOSABLES: same visual meaning as layers-outline -->
    <svg
      *ngSwitchCase="'Disposables'"
      viewBox="0 0 24 24"
      class="home-category-svg">
      <path d="M12 3.5L20.5 8L12 12.5L3.5 8L12 3.5Z"></path>
      <path d="M4.5 12L12 16L19.5 12"></path>
      <path d="M4.5 16L12 20L19.5 16"></path>
    </svg>

    <!-- EQUIPMENT: same visual meaning as medkit-outline -->
    <svg
      *ngSwitchCase="'Equipment'"
      viewBox="0 0 24 24"
      class="home-category-svg">
      <rect x="3" y="7" width="18" height="13" rx="2.5"></rect>
      <path d="M8 7V5.5C8 4.7 8.7 4 9.5 4H14.5C15.3 4 16 4.7 16 5.5V7"></path>
      <path d="M12 10V17"></path>
      <path d="M8.5 13.5H15.5"></path>
    </svg>

    <!-- IMPRESSION: same visual meaning as scan-outline -->
    <svg
      *ngSwitchCase="'Impression'"
      viewBox="0 0 24 24"
      class="home-category-svg">
      <path d="M8 3H5C3.9 3 3 3.9 3 5V8"></path>
      <path d="M16 3H19C20.1 3 21 3.9 21 5V8"></path>
      <path d="M3 16V19C3 20.1 3.9 21 5 21H8"></path>
      <path d="M21 16V19C21 20.1 20.1 21 19 21H16"></path>
    </svg>

    <!-- INSTRUMENTS: same visual meaning as construct-outline -->
    <svg
      *ngSwitchCase="'Instruments'"
      viewBox="0 0 24 24"
      class="home-category-svg">
      <path d="M14.5 5.5C16.1 3.9 18.3 3.4 20.3 4.1L17.2 7.2L18.8 8.8L21.9 5.7C22.6 7.7 22.1 9.9 20.5 11.5C18.9 13.1 16.6 13.6 14.6 12.8L7.2 20.2C6.4 21 5.1 21 4.3 20.2L3.8 19.7C3 18.9 3 17.6 3.8 16.8L11.2 9.4C10.4 7.4 10.9 5.1 12.5 3.5"></path>
      <path d="M13.8 13.8L20.5 20.5"></path>
      <path d="M5.2 5.2L9.5 9.5"></path>
    </svg>

    <!-- ORAL CARE: same visual meaning as brush-outline -->
    <svg
      *ngSwitchCase="'Oral Care'"
      viewBox="0 0 24 24"
      class="home-category-svg">
      <path d="M14.5 4.2C15.7 3 17.7 3 18.9 4.2L19.8 5.1C21 6.3 21 8.3 19.8 9.5L10.2 19.1"></path>
      <path d="M13.2 5.5L18.5 10.8"></path>
      <path d="M10.2 19.1C8.6 20.7 6.2 21.1 4.2 20.1C5.2 18.1 5.6 15.7 7.2 14.1L10.2 19.1Z"></path>
    </svg>

    <!-- ORTHODONTICS: same visual meaning as link-outline -->
    <svg
      *ngSwitchCase="'Orthodontics'"
      viewBox="0 0 24 24"
      class="home-category-svg">
      <path d="M10 13.8L8.2 15.6C6.5 17.3 3.8 17.3 2.2 15.6C0.6 14 0.6 11.3 2.2 9.7L5.2 6.7C6.9 5 9.6 5 11.2 6.7"></path>
      <path d="M14 10.2L15.8 8.4C17.5 6.7 20.2 6.7 21.8 8.4C23.4 10 23.4 12.7 21.8 14.3L18.8 17.3C17.1 19 14.4 19 12.8 17.3"></path>
      <path d="M8.5 12H15.5"></path>
    </svg>

    <!-- PPE: same visual meaning as shield-checkmark-outline -->
    <svg
      *ngSwitchCase="'PPE'"
      viewBox="0 0 24 24"
      class="home-category-svg">
      <path d="M12 3L20 6V11.5C20 16.2 16.9 19.4 12 21C7.1 19.4 4 16.2 4 11.5V6L12 3Z"></path>
      <path d="M8.2 12L10.8 14.6L16.2 9.2"></path>
    </svg>

    <!-- RESTORATIVE: same visual meaning as flask-outline -->
    <svg
      *ngSwitchCase="'Restorative'"
      viewBox="0 0 24 24"
      class="home-category-svg">
      <path d="M9 3H15"></path>
      <path d="M10 3V9L4.5 18.2C3.8 19.4 4.7 21 6.1 21H17.9C19.3 21 20.2 19.4 19.5 18.2L14 9V3"></path>
      <path d="M7.4 16H16.6"></path>
    </svg>

    <!-- ROTARY: same visual meaning as settings-outline -->
    <svg
      *ngSwitchCase="'Rotary'"
      viewBox="0 0 24 24"
      class="home-category-svg">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15A1.7 1.7 0 0 0 19.7 16.9L19.8 17C20.5 17.7 20.5 18.8 19.8 19.5L19.5 19.8C18.8 20.5 17.7 20.5 17 19.8L16.9 19.7A1.7 1.7 0 0 0 15 19.4A1.7 1.7 0 0 0 14 21V21.2C14 22.2 13.2 23 12.2 23H11.8C10.8 23 10 22.2 10 21.2V21A1.7 1.7 0 0 0 9 19.4A1.7 1.7 0 0 0 7.1 19.7L7 19.8C6.3 20.5 5.2 20.5 4.5 19.8L4.2 19.5C3.5 18.8 3.5 17.7 4.2 17L4.3 16.9A1.7 1.7 0 0 0 4.6 15A1.7 1.7 0 0 0 3 14H2.8C1.8 14 1 13.2 1 12.2V11.8C1 10.8 1.8 10 2.8 10H3A1.7 1.7 0 0 0 4.6 9A1.7 1.7 0 0 0 4.3 7.1L4.2 7C3.5 6.3 3.5 5.2 4.2 4.5L4.5 4.2C5.2 3.5 6.3 3.5 7 4.2L7.1 4.3A1.7 1.7 0 0 0 9 4.6A1.7 1.7 0 0 0 10 3V2.8C10 1.8 10.8 1 11.8 1H12.2C13.2 1 14 1.8 14 2.8V3A1.7 1.7 0 0 0 15 4.6A1.7 1.7 0 0 0 16.9 4.3L17 4.2C17.7 3.5 18.8 3.5 19.5 4.2L19.8 4.5C20.5 5.2 20.5 6.3 19.8 7L19.7 7.1A1.7 1.7 0 0 0 19.4 9A1.7 1.7 0 0 0 21 10H21.2C22.2 10 23 10.8 23 11.8V12.2C23 13.2 22.2 14 21.2 14H21A1.7 1.7 0 0 0 19.4 15Z"></path>
    </svg>

    <!-- FALLBACK -->
    <svg
      *ngSwitchDefault
      viewBox="0 0 24 24"
      class="home-category-svg">
      <circle cx="12" cy="12" r="8"></circle>
      <path d="M8 12H16"></path>
      <path d="M12 8V16"></path>
    </svg>

  </ng-container>

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

  return this.state
    .getCategories()

    .filter(
      category =>
        category !== 'All'
    )

  

    .map(
      label => ({
        label
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