import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppStateService } from '../services/app-state.service';
import { BottomNavComponent } from '../shared/bottom-nav.component';


@Component({
  selector:'app-cart',
  standalone:true,
  imports:[
    IonicModule,
    FormsModule,
    CommonModule,
    BottomNavComponent
  ],
  template:`

<ion-header>

<ion-toolbar>

<ion-title>
Cart
</ion-title>

</ion-toolbar>

</ion-header>



<ion-content>

<div class="page-wrap">



<div 
class="empty"
*ngIf="items.length===0">


<div class="emoji">
🛒
</div>


<h2>
Your cart is empty
</h2>


<p class="muted">
Add supplies from the catalog to continue.
</p>


<ion-button routerLink="/catalog">

Browse Products

</ion-button>


</div>





<div 
class="list-stack"
*ngIf="items.length">



<div 
class="app-card row"
*ngFor="let item of items">


<div 
class="product-art"
style="width:72px;min-height:72px">


<img 
[src]="item.product.imageAsset"
style="width:55px;height:55px">


</div>



<div class="flex-1">


<b>
{{item.product.name}}
</b>


<div class="price">

{{money(item.product.price)}}

</div>



<div 
class="qty"
style="margin-top:8px">


<button
(click)="state.setCartQuantity(item.product.id,item.qty-1)">
−
</button>


<b>
{{item.qty}}
</b>


<button
(click)="state.setCartQuantity(item.product.id,item.qty+1)">
+
</button>


</div>


</div>




<ion-button
fill="clear"
color="danger"
(click)="state.removeFromCart(item.product.id)">


<ion-icon name="trash-outline"></ion-icon>


</ion-button>



</div>







<div class="app-card">


<div class="row">


<ion-input
label="Coupon code"
labelPlacement="stacked"
[(ngModel)]="coupon"
placeholder="SMILE10">
</ion-input>


<ion-button
(click)="applyCoupon()">

Apply

</ion-button>


</div>



<div 
class="success"
*ngIf="state.couponApplied"
style="font-size:12px">


Coupon SMILE10 applied.


</div>


</div>







<div class="app-card">


<div class="row-between">

<span>
Subtotal
</span>


<b>
{{money(state.subtotal)}}
</b>

</div>




<div class="row-between">

<span>
Shipping
</span>


<b>

{{state.shippingFee===0?'Free':money(state.shippingFee)}}

</b>

</div>




<div 
class="row-between"
*ngIf="state.discount">


<span>
Discount
</span>


<b class="success">

−{{money(state.discount)}}

</b>


</div>



<hr>



<div class="row-between total-row">


<span>
Total
</span>


<span>
{{money(state.total)}}
</span>


</div>




<ion-button
expand="block"
class="primary-btn"
routerLink="/checkout">


Proceed to Checkout


</ion-button>


</div>




</div>


</div>



<app-bottom-nav active="cart"></app-bottom-nav>


</ion-content>

`
})
export class CartPage {


coupon='';


constructor(
public state:AppStateService
){}



get items(){

return [
...this.state.cart.entries()
]
.map(([id,qty])=>({

product:this.state.productById(id),

qty

}));

}



applyCoupon(){

this.state.applyCoupon(
this.coupon
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