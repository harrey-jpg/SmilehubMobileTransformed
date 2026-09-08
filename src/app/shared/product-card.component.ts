import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { Product } from '../models/product';
import { AppStateService } from '../services/app-state.service';


@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [
    IonicModule
  ],
  template: `

  <div class="product-card">


    <div 
      class="product-art card-button"
      (click)="open()">


      <img 
        [src]="product.imageAsset"
        [alt]="product.name">


      <ion-button

        size="small"

        fill="clear"

        style="position:absolute;right:2px;top:2px"

        (click)="$event.stopPropagation(); state.toggleWishlist(product.id)">


        <ion-icon

          [name]="state.wishlist.has(product.id) ? 'heart' : 'heart-outline'">

        </ion-icon>


      </ion-button>


    </div>




    <div class="brand">

      {{product.brand}}

    </div>




    <div 
      class="product-name card-button"
      (click)="open()">

      {{product.name}}

    </div>





    <div class="row-between">


      <span class="price">

        {{money(product.price)}}

      </span>



      <span style="font-size:11px">

        ★ {{product.rating}}

      </span>


    </div>





    <ion-button

      class="primary-btn"

      size="small"

      expand="block"

      (click)="state.addToCart(product.id)">


      Add to Cart


    </ion-button>




  </div>

  `
})
export class ProductCardComponent {


  @Input({ required: true })
  product!: Product;



  constructor(

    public state: AppStateService,

    private router: Router

  ) {}



  open(){

    this.router.navigate([
      '/product-details',
      this.product.id
    ]);

  }



  money(v:number){

    return new Intl.NumberFormat(
      'en-PH',
      {
        style:'currency',
        currency:'PHP'
      }
    ).format(v);

  }


}