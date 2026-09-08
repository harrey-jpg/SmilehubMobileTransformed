import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AppStateService } from '../services/app-state.service';
import { ProductCardComponent } from '../shared/product-card.component';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    ProductCardComponent
  ],
  template: `
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/home"></ion-back-button>
    </ion-buttons>

    <ion-title>Wishlist</ion-title>
  </ion-toolbar>
</ion-header>


<ion-content>

  <div class="page-wrap no-bottom">

    <div class="empty" *ngIf="products.length===0">

      <div class="emoji">♡</div>

      <h2>Your wishlist is empty</h2>

      <p class="muted">
        Save products you want to buy later.
      </p>

      <ion-button routerLink="/catalog">
        Browse Products
      </ion-button>

    </div>


    <div class="product-grid" *ngIf="products.length">

      <app-product-card
        *ngFor="let p of products"
        [product]="p">
      </app-product-card>

    </div>

  </div>

</ion-content>
`
})
export class WishlistPage {

  constructor(
    public state: AppStateService
  ) {}


  get products() {
    return [...this.state.wishlist]
      .map(id => this.state.productById(id));
  }

}