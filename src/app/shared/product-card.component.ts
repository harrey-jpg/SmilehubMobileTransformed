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
    <div class="product-art card-button" (click)="open()">
      <img [src]="product.imageAsset" [alt]="product.name" loading="lazy">
      <span class="stock-pill" [class.low]="isLow()" [class.out]="isOut()" style="position:absolute;left:8px;top:8px">
        {{product.stock}}
      </span>
      <ion-button size="small" fill="solid" class="wish-btn" [class.wished]="state.wishlist.has(product.id)"
        (click)="$event.stopPropagation(); state.toggleWishlist(product.id)">
        <ion-icon [name]="state.wishlist.has(product.id) ? 'heart' : 'heart-outline'"></ion-icon>
      </ion-button>
    </div>
    <div class="brand">{{product.brand}}</div>
    <div class="product-name card-button" (click)="open()">{{product.name}}</div>
    <div class="row-between" style="margin-top:2px">
      <span class="price">{{money(product.price)}}</span>
      <span style="font-size:11px;font-weight:700">★ {{product.rating}}</span>
    </div>
    <ion-button class="primary-btn" size="small" expand="block" style="margin-top:10px"
      [disabled]="isOut()" (click)="state.addToCart(product.id)">
      {{isOut() ? 'Out of Stock' : 'Add to Cart'}}
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

  isOut(): boolean {
    return (this.product.stock || '').toLowerCase().includes('out');
  }

  isLow(): boolean {
    const s = (this.product.stock || '').toLowerCase();
    return s.includes('low') || s.includes('pre-order');
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
