import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  IonicModule
} from '@ionic/angular';

import {
  CommonModule
} from '@angular/common';

import {
  addIcons
} from 'ionicons';

import {
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
  chevronForwardOutline
} from 'ionicons/icons';

import {
  AppStateService
} from '../services/app-state.service';

import {
  BottomNavComponent
} from '../shared/bottom-nav.component';


@Component({

  selector: 'app-categories',

  standalone: true,

  imports: [
    IonicModule,
    CommonModule,
    BottomNavComponent
  ],


  styles: [`

    .category-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }


    .category-card {
      background:
        var(--ion-card-background);

      border-radius: 18px;

      padding: 14px 16px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      min-height: 72px;

      box-shadow:
        0 8px 20px
        rgba(0, 0, 0, .08);

      transition:
        transform .15s ease;

      cursor: pointer;
    }


    .category-card:active {
      transform: scale(.98);
    }


    .category-left {
      display: flex;
      align-items: center;
      gap: 14px;

      min-width: 0;
    }


    .category-icon {
      width: 48px;
      height: 48px;

      flex: 0 0 48px;

      border-radius: 14px;

      display: flex;
      align-items: center;
      justify-content: center;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .12
        );

      color:
        var(--ion-color-primary);
    }


    .category-icon ion-icon {
      width: 24px;
      height: 24px;

      font-size: 24px;

      color:
        var(--ion-color-primary);

      display: block;
    }


    .category-info {
      min-width: 0;
    }


    .category-name {
      color:
        var(--ion-text-color);

      font-size: 15px;

      font-weight: 900;

      line-height: 1.25;
    }


    .category-count {
      margin-top: 3px;

      font-size: 11px;

      color:
        var(--ion-color-medium);
    }


    .category-arrow {
      flex-shrink: 0;

      font-size: 20px;

      color:
        var(--ion-color-medium);
    }


    @media (prefers-color-scheme: light) {

      .category-card {
        background: #ffffff;

        box-shadow:
          0 7px 18px
          rgba(
            27,
            44,
            64,
            .06
          );
      }

    }

  `],


  template: `

<ion-header>

  <ion-toolbar>

    <ion-title>
      Categories
    </ion-title>

  </ion-toolbar>

</ion-header>



<ion-content>


  <div class="page-wrap">


    <div class="category-grid">


      <div
        class="category-card card-button"

        *ngFor="
          let c of categories
        "

        (click)="open(c)">


        <div class="category-left">


          <div class="category-icon">

            <ion-icon
              [name]="icon(c)">
            </ion-icon>

          </div>


          <div class="category-info">


            <div class="category-name">
              {{ c }}
            </div>


            <div class="category-count">

              {{ count(c) }}

              product{{
                count(c) === 1
                  ? ''
                  : 's'
              }}

            </div>


          </div>


        </div>


        <ion-icon
          class="category-arrow"
          name="chevron-forward-outline">
        </ion-icon>


      </div>


    </div>


  </div>


</ion-content>



<ion-footer>

  <app-bottom-nav
    active="categories">
  </app-bottom-nav>

</ion-footer>

`

})


export class CategoriesPage
implements OnInit {


  constructor(

    private router:
      Router,

    public state:
      AppStateService

  ) {


    /*
     * Register category icons.
     * This prevents blank icon boxes.
     */

    addIcons({

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

      chevronForwardOutline

    });


  }



  /* =========================
     CATEGORIES
     ========================= */

  get categories():
    string[] {


    return this.state
      .getCategories()
      .filter(

        category =>
          category !== 'All'

      );


  }



  /* =========================
     INIT
     ========================= */

  ngOnInit():
    void {


    this.state
      .loadProductsFromFirestore();


  }



  /* =========================
     PRODUCT COUNT
     ========================= */

  count(
    category: string
  ):
    number {


    return this.state
      .products
      .filter(

        product =>
          product.category ===
          category

      )
      .length;


  }



  /* =========================
     CATEGORY ICON
     ========================= */

  icon(
    category: string
  ):
    string {


    const icons:
      Record<string, string> = {


        'Cosmetic':
          'sparkles-outline',


        'Disposables':
          'layers-outline',


        'Equipment':
          'medkit-outline',


        'Impression':
          'scan-outline',


        'Instruments':
          'construct-outline',


        'Oral Care':
          'brush-outline',


        'Orthodontics':
          'link-outline',


        'PPE':
          'shield-checkmark-outline',


        'Restorative':
          'flask-outline',


        'Rotary':
          'settings-outline'


      };


    return (
      icons[category]
      ||
      'medical-outline'
    );


  }



  /* =========================
     OPEN CATEGORY
     ========================= */

  open(
    category: string
  ):
    void {


    this.router.navigate(

      [
        '/catalog'
      ],

      {

        queryParams: {

          category:
            category

        }

      }

    );


  }


}