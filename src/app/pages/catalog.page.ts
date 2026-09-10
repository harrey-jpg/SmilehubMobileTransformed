import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  IonicModule
} from '@ionic/angular';

import {
  FormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  addIcons
} from 'ionicons';

import {
  gridOutline,
  brushOutline,
  constructOutline,
  shieldCheckmarkOutline,
  flaskOutline,
  layersOutline,
  scanOutline,
  linkOutline,
  settingsOutline,
  sparklesOutline,
  medkitOutline,
  medicalOutline,
  searchOutline,
  swapVerticalOutline
} from 'ionicons/icons';

import {
  Product
} from '../models/product';

import {
  AppStateService
} from '../services/app-state.service';

import {
  ProductCardComponent
} from '../shared/product-card.component';

import {
  ReviewService
} from '../services/review.service';


interface ProductRatingSummary {
  average: number;
  count: number;
}


@Component({
  selector: 'app-catalog',
  standalone: true,

  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    ProductCardComponent
  ],

  styles: [`

    /* =========================
       PAGE
       ========================= */

    .catalog-page {
      padding-bottom: 24px;
    }


    /* =========================
       INTRO
       ========================= */

    .catalog-intro {
      margin-bottom: 14px;
    }

    .catalog-kicker {
      color: var(--ion-color-primary);

      font-size: 10px;
      font-weight: 900;

      letter-spacing: .8px;
      text-transform: uppercase;
    }

    .catalog-heading {
      margin: 4px 0 3px;

      font-size: 22px;
      line-height: 1.2;
      font-weight: 900;
    }

    .catalog-subtitle {
      margin: 0;

      font-size: 12px;
      line-height: 1.45;

      color: var(--ion-color-medium);
    }


    /* =========================
       SEARCH
       ========================= */

    .search-wrap {
      margin-bottom: 14px;
    }

    .catalog-search {
      padding: 0;

      --border-radius: 16px;
      --box-shadow: none;

      --background:
        var(--ion-card-background);
    }


    /* =========================
       SEARCH INFO
       ========================= */

    .search-info {
      margin-top: 9px;

      padding: 11px 13px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;

      border-radius: 14px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .08
        );
    }

    .search-info-text {
      min-width: 0;
    }

    .search-label {
      font-size: 10px;

      color:
        var(--ion-color-medium);
    }

    .search-term {
      margin-top: 2px;

      font-size: 13px;
      font-weight: 900;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .clear-filter {
      flex-shrink: 0;

      border: none;
      outline: none;

      background: transparent;

      color:
        var(--ion-color-primary);

      font-size: 11px;
      font-weight: 900;

      cursor: pointer;
    }


    /* =========================
       CATEGORY FILTER
       ========================= */

    .filter-section {
      margin-bottom: 18px;
    }

    .filter-label {
      margin-bottom: 9px;

      font-size: 12px;
      font-weight: 900;
    }

    .cat-scroll {
      overflow-x: auto;
      overflow-y: hidden;

      margin: 0 -2px;

      padding: 2px 2px 6px;

      scrollbar-width: none;
    }

    .cat-scroll::-webkit-scrollbar {
      display: none;
    }

    .cat-pills {
      display: flex;

      gap: 8px;

      width: max-content;
    }

    .cat-pill {
      min-height: 38px;

      display: flex;
      align-items: center;

      gap: 7px;

      padding: 7px 12px;

      border:
        1px solid
        rgba(
          120,
          120,
          120,
          .18
        );

      border-radius: 999px;

      background:
        var(
          --ion-card-background,
          #ffffff
        );

      color:
        var(--ion-text-color);

      font-size: 11px;
      font-weight: 800;

      white-space: nowrap;

      cursor: pointer;

      transition:
        background .15s ease,
        color .15s ease,
        border-color .15s ease,
        transform .15s ease;
    }

    .cat-pill:active {
      transform: scale(.96);
    }

    .cat-pill.active {
      background:
        var(--ion-color-primary);

      border-color:
        var(--ion-color-primary);

      color: #ffffff;
    }

    .cat-pill-icon {
      width: 17px;
      height: 17px;

      flex: 0 0 17px;

      font-size: 17px;

      color:
        var(--ion-color-primary);
    }

    .cat-pill.active
    .cat-pill-icon {
      color: #ffffff;
    }


    /* =========================
       RESULTS TOOLBAR
       ========================= */

    .results-toolbar {
      margin-bottom: 14px;

      padding: 13px 14px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      gap: 12px;

      border-radius: 16px;

      background:
        var(--ion-card-background);
    }

    .results-text {
      min-width: 0;
    }

    .results-title {
      margin: 0;

      font-size: 17px;
      line-height: 1.25;

      font-weight: 900;
    }

    .results-count {
      margin: 3px 0 0;

      font-size: 10px;

      color:
        var(--ion-color-medium);
    }

    .sort-wrap {
      min-width: 116px;

      display: flex;
      align-items: center;

      border:
        1px solid
        rgba(
          120,
          120,
          120,
          .14
        );

      border-radius: 12px;

      padding: 0 4px;
    }

    .sort-wrap ion-icon {
      margin-left: 7px;

      font-size: 15px;

      color:
        var(--ion-color-primary);
    }

    .sort-select {
      min-height: 38px;

      width: 100%;
      max-width: 145px;

      font-size: 11px;
      font-weight: 800;
    }


    /* =========================
       RATING LOADING
       ========================= */

    .rating-load {
      margin: -4px 2px 12px;

      display: flex;
      align-items: center;

      gap: 7px;

      font-size: 10px;

      color:
        var(--ion-color-medium);
    }

    .rating-load ion-spinner {
      width: 14px;
      height: 14px;
    }


    /* =========================
       PRODUCT GRID
       ========================= */

    .product-grid {
      display: grid;

      grid-template-columns:
        repeat(
          2,
          minmax(0, 1fr)
        );

      gap: 12px;

      align-items: stretch;
    }

    app-product-card {
      display: block;

      min-width: 0;
    }


    /* =========================
       EMPTY STATE
       ========================= */

    .empty {
      min-height: 310px;

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      padding: 35px 24px;
    }

    .empty-icon {
      width: 74px;
      height: 74px;

      display: flex;
      align-items: center;
      justify-content: center;

      margin-bottom: 14px;

      border-radius: 22px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      color:
        var(--ion-color-primary);
    }

    .empty-icon ion-icon {
      width: 34px;
      height: 34px;

      font-size: 34px;

      color:
        var(--ion-color-primary);
    }

    .empty h2 {
      margin: 0 0 6px;

      font-size: 18px;
      font-weight: 900;
    }

    .empty p {
      max-width: 260px;

      margin: 0 0 17px;

      font-size: 11px;
      line-height: 1.5;

      color:
        var(--ion-color-medium);
    }

    .empty ion-button {
      --border-radius: 13px;

      font-weight: 800;
    }


    /* =========================
       LIGHT MODE
       ========================= */

    @media (prefers-color-scheme: light) {

      .results-toolbar {
        background: #ffffff;

        box-shadow:
          0 6px 18px
          rgba(
            27,
            44,
            64,
            .04
          );
      }

      .cat-pill {
        background: #ffffff;
      }

      .cat-pill.active {
        background:
          var(--ion-color-primary);
      }

    }


    /* =========================
       RESPONSIVE
       ========================= */

    @media (min-width: 720px) {

      .product-grid {
        grid-template-columns:
          repeat(
            3,
            minmax(0, 1fr)
          );

        gap: 16px;
      }

    }


    @media (min-width: 1050px) {

      .product-grid {
        grid-template-columns:
          repeat(
            4,
            minmax(0, 1fr)
          );
      }

    }


    @media (max-width: 380px) {

      .results-toolbar {
        align-items: flex-start;
      }

      .sort-wrap {
        min-width: 105px;
      }

      .product-grid {
        gap: 9px;
      }

    }

  `],


  template: `

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        defaultHref="/home">
      </ion-back-button>

    </ion-buttons>


    <ion-title>
      Catalog
    </ion-title>


  </ion-toolbar>

</ion-header>



<ion-content>


  <div class="page-wrap no-bottom catalog-page">



    <!-- =========================
         INTRO
         ========================= -->

    <div class="catalog-intro">


      <div class="catalog-kicker">

        SmileHub Store

      </div>


      <h1 class="catalog-heading">

        Find what you need.

      </h1>


      <p class="catalog-subtitle">

        Browse reliable dental supplies
        for clinics and professionals.

      </p>


    </div>



    <!-- =========================
         SEARCH
         ========================= -->

    <div class="search-wrap">


      <ion-searchbar
        class="catalog-search"

        [(ngModel)]="search"

        placeholder="Search products, brands or categories..."

        [debounce]="0"

        showClearButton="focus">
      </ion-searchbar>



      <div
        class="search-info"

        *ngIf="
          search.trim()
        ">


        <div class="search-info-text">


          <div class="search-label">

            Showing results for

          </div>


          <div class="search-term">

            "{{ search }}"

          </div>


        </div>


        <button
          type="button"

          class="clear-filter"

          (click)="
            clearSearch()
          ">

          Clear

        </button>


      </div>


    </div>



    <!-- =========================
         CATEGORY FILTER
         ========================= -->

    <div class="filter-section">


      <div class="filter-label">

        Browse by Category

      </div>


      <div class="cat-scroll">


        <div class="cat-pills">


          <button
            type="button"

            class="cat-pill"

            *ngFor="
              let c
              of categories
            "

            [class.active]="
              category === c
            "

            (click)="
              selectCategory(c)
            ">


            <ion-icon
              class="cat-pill-icon"

              [name]="
                categoryIcon(c)
              ">
            </ion-icon>


            <span>

              {{ c }}

            </span>


          </button>


        </div>


      </div>


    </div>



    <!-- =========================
         RESULTS TOOLBAR
         ========================= -->

    <div class="results-toolbar">


      <div class="results-text">


        <h2 class="results-title">

          {{ resultTitle }}

        </h2>


        <p class="results-count">

          {{ filtered.length }}

          product{{
            filtered.length === 1
              ? ''
              : 's'
          }}

          found

        </p>


      </div>



      <div class="sort-wrap">


        <ion-icon
          name="swap-vertical-outline">
        </ion-icon>


        <ion-select
          [(ngModel)]="sort"

          interface="popover"

          placeholder="Sort"

          class="sort-select">


          <ion-select-option
            value="featured">

            Featured

          </ion-select-option>


          <ion-select-option
            value="low">

            Price: Low to High

          </ion-select-option>


          <ion-select-option
            value="high">

            Price: High to Low

          </ion-select-option>


          <ion-select-option
            value="rating">

            Top Rated

          </ion-select-option>


        </ion-select>


      </div>


    </div>



    <!-- =========================
         RATING LOADING
         ========================= -->

    <div
      class="rating-load"

      *ngIf="
        loadingRatings &&
        sort === 'rating'
      ">


      <ion-spinner
        name="crescent">
      </ion-spinner>


      Loading latest customer ratings...


    </div>



    <!-- =========================
         PRODUCTS
         ========================= -->

    <div
      class="product-grid"

      *ngIf="
        filtered.length;
        else emptyTpl
      ">


      <app-product-card
        *ngFor="
          let p
          of filtered;
          trackBy: trackProduct
        "

        [product]="p">
      </app-product-card>


    </div>



    <!-- =========================
         EMPTY STATE
         ========================= -->

    <ng-template #emptyTpl>


      <div class="empty">


        <div class="empty-icon">


          <ion-icon
            name="search-outline">
          </ion-icon>


        </div>


        <h2>

          No products found

        </h2>


        <p>

          We couldn't find any products
          matching your current search
          or category.

        </p>


        <ion-button
          fill="outline"

          (click)="
            resetFilters()
          ">

          View All Products

        </ion-button>


      </div>


    </ng-template>


  </div>


</ion-content>

`

})


export class CatalogPage
implements OnInit {


  /* =========================
     FILTER STATE
     ========================= */

  category =
    'All';


  search =
    '';


  sort:
    'featured'
    |
    'low'
    |
    'high'
    |
    'rating'
    =
    'featured';



  /* =========================
     REVIEW RATINGS
     ========================= */

  productRatings =
    new Map<
      number,
      ProductRatingSummary
    >();


  loadingRatings =
    false;


  private ratingsLoaded =
    false;



  constructor(

    private route:
      ActivatedRoute,

    public state:
      AppStateService,

    private reviewService:
      ReviewService

  ) {


    /*
     * Register all icons used by
     * this page so the category
     * pills do not appear blank.
     */

    addIcons({

      gridOutline,

      brushOutline,

      constructOutline,

      shieldCheckmarkOutline,

      flaskOutline,

      layersOutline,

      scanOutline,

      linkOutline,

      settingsOutline,

      sparklesOutline,

      medkitOutline,

      medicalOutline,

      searchOutline,

      swapVerticalOutline

    });


  }



  /* =========================
     STARTUP
     ========================= */

  ngOnInit():
    void {


    this.route
      .queryParamMap
      .subscribe(

        params => {


          this.category =
            params.get(
              'category'
            )
            ||
            'All';


          this.search =
            params.get(
              'search'
            )
            ||
            '';


        }

      );


    void this
      .loadProductRatings();


  }



  /* =========================
     PAGE ENTER
     ========================= */

  async ionViewWillEnter():
    Promise<void> {


    await this.state
      .loadProductsFromFirestore();


    await this
      .loadProductRatings(
        true
      );


  }



  /* =========================
     LOAD PRODUCT RATINGS
     ========================= */

  private async loadProductRatings(
    force = false
  ):
    Promise<void> {


    if (
      this.loadingRatings
    ) {


      return;


    }


    if (
      this.ratingsLoaded
      &&
      !force
    ) {


      return;


    }


    this.loadingRatings =
      true;


    try {


      const products =
        [
          ...this.state.products
        ];


      const results =
        await Promise.all(


          products.map(

            async (
              product
            ) => {


              try {


                const reviews =
                  await this
                    .reviewService
                    .getProductReviews(
                      product.id
                    );


                if (
                  reviews.length === 0
                ) {


                  return {

                    productId:
                      product.id,

                    average:
                      0,

                    count:
                      0

                  };


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
                          review.rating
                          ||
                          0
                        )

                      );


                    },

                    0

                  );


                return {

                  productId:
                    product.id,

                  average:
                    total /
                    reviews.length,

                  count:
                    reviews.length

                };


              } catch (
                error
              ) {


                console.error(

                  'Unable to load rating for product '
                  +
                  product.id
                  +
                  ':',

                  error

                );


                return {

                  productId:
                    product.id,

                  average:
                    0,

                  count:
                    0

                };


              }


            }

          )


        );


      const nextMap =
        new Map<
          number,
          ProductRatingSummary
        >();


      for (
        const result
        of results
      ) {


        nextMap.set(

          result.productId,

          {

            average:
              result.average,

            count:
              result.count

          }

        );


      }


      this.productRatings =
        nextMap;


      this.ratingsLoaded =
        true;


    } catch (
      error
    ) {


      console.error(
        'Unable to load product ratings:',
        error
      );


    } finally {


      this.loadingRatings =
        false;


    }


  }



  /* =========================
     PRODUCT RATING
     ========================= */

  ratingFor(
    product: Product
  ):
    number {


    const summary =
      this.productRatings
        .get(
          product.id
        );


    if (
      summary
      &&
      summary.count > 0
    ) {


      return Number(
        summary.average
        ||
        0
      );


    }


    return 0;


  }



  /* =========================
     REVIEW COUNT
     ========================= */

  reviewCountFor(
    product: Product
  ):
    number {


    return (

      this.productRatings
        .get(
          product.id
        )
        ?.count

      ||

      0

    );


  }



  /* =========================
     CATEGORIES
     ========================= */

  get categories():
    string[] {


    return this.state
      .getCategories();


  }



  /* =========================
     CATEGORY ICON
     ========================= */

  categoryIcon(
    category: string
  ):
    string {


    const icons:
      Record<string, string> = {


        'All':
          'grid-outline',


        'Oral Care':
          'brush-outline',


        'Instruments':
          'construct-outline',


        'PPE':
          'shield-checkmark-outline',


        'Restorative':
          'flask-outline',


        'Disposables':
          'layers-outline',


        'Impression':
          'scan-outline',


        'Orthodontics':
          'link-outline',


        'Rotary':
          'settings-outline',


        'Cosmetic':
          'sparkles-outline',


        'Equipment':
          'medkit-outline'


      };


    return (
      icons[category]
      ||
      'medical-outline'
    );


  }



  /* =========================
     RESULT TITLE
     ========================= */

  get resultTitle():
    string {


    const term =
      this.search
        .trim();


    if (
      term
      &&
      this.category !==
        'All'
    ) {


      return (
        this.category
        +
        ' Results'
      );


    }


    if (
      term
    ) {


      return 'Search Results';


    }


    if (
      this.category !==
        'All'
    ) {


      return this.category;


    }


    return 'All Products';


  }



  /* =========================
     FILTERED PRODUCTS
     ========================= */

  get filtered():
    Product[] {


    const term =
      this.search
        .trim()
        .toLowerCase();


    let products =
      this.state.products
        .filter(

          product => {


            const matchesCategory =

              this.category ===
                'All'

              ||

              product.category ===
                this.category;


            const productText =
              [

                product.name
                ||
                '',

                product.brand
                ||
                '',

                product.category
                ||
                '',

                product.sku
                ||
                ''

              ]
                .join(
                  ' '
                )
                .toLowerCase();


            const matchesSearch =

              !term

              ||

              productText
                .includes(
                  term
                );


            return (

              matchesCategory

              &&

              matchesSearch

            );


          }

        );



    /* =========================
       SORT RESULTS
       ========================= */

    products =
      [
        ...products
      ]
        .sort(

          (
            a,
            b
          ) => {


            /* PRICE LOW */

            if (
              this.sort ===
                'low'
            ) {


              return (

                Number(
                  a.price
                )

                -

                Number(
                  b.price
                )

              );


            }



            /* PRICE HIGH */

            if (
              this.sort ===
                'high'
            ) {


              return (

                Number(
                  b.price
                )

                -

                Number(
                  a.price
                )

              );


            }



            /* TOP RATED */

            if (
              this.sort ===
                'rating'
            ) {


              const ratingA =
                this.ratingFor(
                  a
                );


              const ratingB =
                this.ratingFor(
                  b
                );


              if (
                ratingB !==
                  ratingA
              ) {


                return (
                  ratingB
                  -
                  ratingA
                );


              }


              const countA =
                this.reviewCountFor(
                  a
                );


              const countB =
                this.reviewCountFor(
                  b
                );


              if (
                countB !==
                  countA
              ) {


                return (
                  countB
                  -
                  countA
                );


              }


              return (

                Number(
                  a.id
                )

                -

                Number(
                  b.id
                )

              );


            }



            /* FEATURED */

            return (

              Number(
                a.id
              )

              -

              Number(
                b.id
              )

            );


          }

        );


    return products;


  }



  /* =========================
     CATEGORY CLICK
     ========================= */

  selectCategory(
    category: string
  ):
    void {


    this.category =
      category;


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


    this.category =
      'All';


    this.sort =
      'featured';


  }



  /* =========================
     TRACK BY
     ========================= */

  trackProduct(
    _index: number,
    product: Product
  ):
    number {


    return product.id;


  }


}