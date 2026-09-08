import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AppStateService } from '../services/app-state.service';
import { Product } from '../models/product';


@Component({
  selector:'app-product-details',
  standalone:true,
  imports:[
    RouterModule,
    IonicModule,
    CommonModule
  ],
  template:`

<ion-header>

<ion-toolbar>


<ion-buttons slot="start">

<ion-back-button defaultHref="/catalog">
</ion-back-button>

</ion-buttons>




<ion-title>
Product Details
</ion-title>





<ion-buttons slot="end" class="header-actions">



<ion-button
class="icon-btn"
(click)="state.toggleWishlist(product.id)">


<ion-icon

[name]="state.wishlist.has(product.id)?'heart':'heart-outline'">

</ion-icon>


</ion-button>





<ion-button routerLink="/cart" class="icon-btn">


<ion-icon name="cart-outline">
</ion-icon>


<ion-badge color="danger" class="header-badge" *ngIf="state.cartCount > 0">{{ state.cartCount }}</ion-badge>


</ion-button>



</ion-buttons>



</ion-toolbar>

</ion-header>






<ion-content *ngIf="product">


<div class="page-wrap no-bottom">





<div 
class="product-art"
style="min-height:280px">


<img

[src]="product.imageAsset"

style="width:190px;height:190px">


</div>






<div 
class="brand"
style="margin-top:18px">


{{product.brand}} • {{product.category}}


</div>






<h1 style="font-size:25px;margin:6px 0 8px">


{{product.name}}


</h1>






<div class="row-between">


<div 
class="price"
style="font-size:23px">


{{money(product.price)}}


</div>




<div>

★ {{product.rating}}

<span class="pill">

{{product.stock}}

</span>


</div>



</div>






<p class="muted">

{{product.description}}

</p>






<div 
class="app-card"
style="margin-top:18px">


<b>
Quantity
</b>




<div 
class="qty"
style="margin-top:10px">


<button
(click)="quantity=Math.max(1,quantity-1)">

−

</button>


<b>

{{quantity}}

</b>



<button
(click)="quantity=quantity+1">

+

</button>


</div>



</div>






<div 
class="form-grid"
style="margin-top:16px">


<ion-button

class="outline-btn"

fill="outline"

(click)="add()">


Add to Cart


</ion-button>





<ion-button

class="primary-btn"

(click)="buyNow()">


Buy Now


</ion-button>



</div>





</div>


</ion-content>

`
})
export class ProductDetailsPage implements OnInit {


product!:Product;

quantity = 1;

Math = Math;



constructor(
private route:ActivatedRoute,
public state:AppStateService,
private router:Router
){}





ngOnInit(){

this.product =
this.state.productById(
Number(
this.route.snapshot.paramMap.get('id')
)
);

this.state.loadProductsFromFirestore().then(() => {
  this.product = this.state.productById(
    Number(this.route.snapshot.paramMap.get('id'))
  );
});


}

async ionViewWillEnter() {
  this.product = this.state.productById(
    Number(this.route.snapshot.paramMap.get('id'))
  );
}




add(){

this.state.addToCart(
this.product.id,
this.quantity
);

}





buyNow(){

this.router.navigate(
['/checkout'],
{
queryParams:{
productId:this.product.id,
quantity:this.quantity
}
}
);


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