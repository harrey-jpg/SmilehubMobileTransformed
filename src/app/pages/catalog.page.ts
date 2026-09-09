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
       SEARCH
       ========================= */

    .catalog-search {

      padding: 0;

      margin-bottom: 10px;

      --border-radius: 14px;

      --box-shadow: none;

    }



    /* =========================
       SEARCH INFORMATION
       ========================= */

    .search-info {

      margin: 4px 2px 14px;

      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 10px;

    }



    .search-info-text {

      min-width: 0;

    }



    .search-label {

      font-size: 12px;

      color:
        var(--ion-color-medium);

    }



    .search-term {

      margin-top: 2px;

      font-size: 14px;

      font-weight: 800;

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

      font-size: 12px;

      font-weight: 800;

      cursor: pointer;

    }



    /* =========================
       CATEGORY PILLS
       ========================= */

    .cat-scroll {

      overflow-x: auto;

      margin: 4px -2px 16px;

      padding: 2px;

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

      border:
        1px solid
        rgba(120,120,120,.18);

      border-radius: 999px;

      background:
        var(
          --ion-card-background,
          #fff
        );

      color:
        var(--ion-text-color);

      font-size: 12px;

      font-weight: 700;

      padding: 8px 13px;

      cursor: pointer;

      white-space: nowrap;

      transition:
        background .15s ease,
        color .15s ease,
        border .15s ease;

    }



    .cat-pill.active {

      background:
        var(--ion-color-primary);

      border-color:
        var(--ion-color-primary);

      color: #ffffff;

    }



    /* =========================
       RESULTS HEADER
       ========================= */

    .results-header {

      margin-bottom: 13px;

    }



    .results-title {

      margin: 0;

      font-size: 18px;

      font-weight: 900;

    }



    .results-count {

      margin: 3px 0 0;

      font-size: 12px;

      color:
        var(--ion-color-medium);

    }



    .sort-select {

      max-width: 145px;

      font-size: 12px;

      font-weight: 700;

    }



    /* =========================
       RATING LOAD
       ========================= */

    .rating-load {

      display: flex;

      align-items: center;

      gap: 7px;

      margin: -4px 2px 12px;

      font-size: 10px;

      color:
        var(--ion-color-medium);

    }



    .rating-load ion-spinner {

      width: 14px;

      height: 14px;

    }



    /* =========================
       EMPTY
       ========================= */

    .empty {

      min-height: 280px;

      display: flex;

      flex-direction: column;

      align-items: center;

      justify-content: center;

      text-align: center;

      padding: 30px 20px;

    }



    .empty .emoji {

      font-size: 48px;

      margin-bottom: 10px;

    }



    .empty h2 {

      margin:
        0 0 5px;

      font-size: 18px;

    }



    .empty p {

      margin:
        0 0 16px;

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


<div class="page-wrap no-bottom">



  <!-- =========================
       SEARCH
       ========================= -->

  <ion-searchbar
    class="catalog-search"

    [(ngModel)]="search"

    placeholder="Search dental supplies..."

    [debounce]="0"

    showClearButton="focus">

  </ion-searchbar>




  <!-- =========================
       SEARCH INFORMATION
       ========================= -->

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




  <!-- =========================
       CATEGORY FILTERS
       ========================= -->

  <div class="cat-scroll">


    <div class="cat-pills">


      <button
        type="button"

        class="cat-pill"

        *ngFor="
          let c of categories
        "

        [class.active]="
          category === c
        "

        (click)="
          selectCategory(c)
        ">

        {{ c }}

      </button>


    </div>


  </div>




  <!-- =========================
       RESULTS HEADER
       ========================= -->

  <div
    class="section-row results-header">


    <div>


      <h2 class="results-title">

        {{ resultTitle }}

      </h2>


      <p class="results-count">

        {{ filtered.length }}

        item{{
          filtered.length === 1
            ? ''
            : 's'
        }}

        found

      </p>


    </div>



    <!-- SORT -->

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




  <!-- RATING LOADING -->

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
        let p of filtered;
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


      <div class="emoji">

        🔍

      </div>


      <h2>

        No products found

      </h2>


      <p class="muted">

        We couldn't find products
        matching your search.

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

  ) {}



  /* =========================
     STARTUP
     ========================= */

  ngOnInit():
    void {


    /*
     * Products are already handled
     * centrally by AppStateService.
     */


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



    /*
     * Load actual customer
     * review summaries.
     */

    void this
      .loadProductRatings();


  }



  /* =========================
     PAGE ENTER
     ========================= */

  async ionViewWillEnter():
    Promise<void> {


    /*
     * Refresh products so stock
     * is current.
     */

    await this.state
      .loadProductsFromFirestore();



    /*
     * Refresh customer ratings.
     */

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
        [...this.state.products];



      const results =
        await Promise.all(


          products.map(

            async product => {


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
                    ) =>

                      sum
                      +
                      Number(
                        review.rating ||
                        0
                      ),

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

                  `Unable to load rating for product ${product.id}:`,

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
      summary &&
      summary.count > 0
    ) {


      return Number(
        summary.average ||
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
     RESULT TITLE
     ========================= */

  get resultTitle():
    string {


    const term =
      this.search
        .trim();



    /*
     * Search + category
     */

    if (
      term
      &&
      this.category !==
        'All'
    ) {


      return (
        `${this.category} Results`
      );


    }



    /*
     * Search only
     */

    if (
      term
    ) {


      return 'Search Results';


    }



    /*
     * Category only
     */

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


            /*
             * CATEGORY FILTER
             */

            const matchesCategory =

              this.category ===
                'All'

              ||

              product.category ===
                this.category;



            /*
             * SEARCH FILTER
             */

            const productText = `

              ${product.name || ''}

              ${product.brand || ''}

              ${product.category || ''}

              ${product.sku || ''}

            `
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
      [...products]
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



            /* =========================
               TOP RATED

               Uses actual customer
               review ratings only.
               Products with no reviews
               are treated as 0.
               ========================= */

            if (
              this.sort ===
                'rating'
            ) {


              const ratingA =
                this.ratingFor(a);



              const ratingB =
                this.ratingFor(b);



              if (
                ratingB !==
                  ratingA
              ) {


                return (
                  ratingB -
                  ratingA
                );


              }



              /*
               * Same average rating:
               * product with more reviews
               * ranks higher.
               */

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
                  countB -
                  countA
                );


              }



              /*
               * Final stable fallback.
               */

              return (
                Number(a.id)
                -
                Number(b.id)
              );


            }



            /*
             * FEATURED / DEFAULT
             */

            return (

              Number(a.id)

              -

              Number(b.id)

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
     RESET EVERYTHING
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
  ) {


    return product.id;


  }


}