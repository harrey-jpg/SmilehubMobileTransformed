import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { 
  IonicModule,
  AlertController,
  LoadingController
} from '@ionic/angular';

import { AppStateService } from '../services/app-state.service';
import { AddressService } from '../services/address.service';
import { OrderService } from '../services/order.service';
import { ShippingAddress } from '../models/product';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule
  ],
  template: `

<ion-header>
  <ion-toolbar>

    <ion-buttons slot="start">
      <ion-back-button defaultHref="/cart"></ion-back-button>
    </ion-buttons>

    <ion-title>
      Checkout
    </ion-title>

  </ion-toolbar>
</ion-header>


<ion-content>

<div class="page-wrap no-bottom">


<div class="form-grid">

<div class="pill">
1 Shipping
</div>

<div class="pill" style="opacity:.65">
2 Payment
</div>

<div class="pill" style="opacity:.65">
3 Review
</div>

</div>




<div class="section-row">

<h2>
Shipping Address
</h2>

<ion-button
fill="clear"
size="small"
(click)="chooseAddress()">

{{address ? 'Change' : 'Add'}}

</ion-button>

</div>




<div 
class="app-card card-button"
(click)="chooseAddress()"
*ngIf="!loadingAddress && address">


<div class="row-between">

<b>
📍 {{address.label || 'Address'}}
</b>


<ion-icon name="chevron-forward-outline"></ion-icon>


</div>


<p>

<b>
{{address.recipient}}
</b>

<br>

{{address.phone}}

</p>


<p class="muted">
{{fullAddress(address)}}
</p>


</div>





<div 
class="app-card card-button"
(click)="chooseAddress()"
*ngIf="!loadingAddress && !address">


<b>
➕ No shipping address selected
</b>

<p class="muted">
Tap to add or choose an address.
</p>


</div>





<div 
class="app-card"
*ngIf="loadingAddress">

<ion-spinner></ion-spinner>

</div>





<div class="section-row">

<h2>
Delivery Method
</h2>

</div>




<ion-radio-group [(ngModel)]="delivery">


<ion-item>

<ion-radio value="Standard Delivery">

Standard Delivery

</ion-radio>

</ion-item>




<ion-item>

<ion-radio value="Express Delivery">

Express Delivery

</ion-radio>

</ion-item>


</ion-radio-group>







<div class="section-row">

<h2>
Payment Method
</h2>


<ion-button
fill="clear"
size="small"
routerLink="/payments"
[queryParams]="{select:1}">

Change

</ion-button>

</div>





<div 
class="app-card row card-button"
routerLink="/payments"
[queryParams]="{select:1}">


<div class="category-icon">

<ion-icon
[name]="state.selectedPayment.icon">
</ion-icon>

</div>


<div class="flex-1">

<b>
{{state.selectedPayment.title}}
</b>


<div class="muted">

{{state.selectedPayment.subtitle}}

</div>

</div>


<ion-icon name="chevron-forward-outline"></ion-icon>


</div>






<div class="section-row">

<h2>
Order Summary
</h2>

</div>





<div class="app-card">


<div class="row-between">

<span>
Subtotal
</span>


<b>
{{money(subtotal)}}
</b>


</div>




<div class="row-between">

<span>
Shipping
</span>


<b>
{{shipping===0 ? 'Free' : money(shipping)}}
</b>


</div>




<div 
class="row-between"
*ngIf="discount">


<span>
Discount
</span>


<b class="success">

-{{money(discount)}}

</b>


</div>



<hr>



<div class="row-between total-row">

<span>
Order Total
</span>


<span>
{{money(total)}}
</span>


</div>




<ion-button

expand="block"

class="primary-btn"

(click)="placeOrder()"

[disabled]="loadingAddress">

Place Order

</ion-button>



</div>


</div>

</ion-content>

`
})
export class CheckoutPage implements OnInit {


address: ShippingAddress | null = null;

loadingAddress = true;

delivery = 'Standard Delivery';

buyNowProductId:number|null = null;

buyNowQuantity = 1;



constructor(
public state: AppStateService,
private addresses: AddressService,
private orders: OrderService,
private route: ActivatedRoute,
private router: Router,
private alerts: AlertController,
private loading: LoadingController
){}



async ngOnInit(){

const id =
Number(
this.route.snapshot.queryParamMap.get('productId')
);


if(id){

this.buyNowProductId = id;

}


this.buyNowQuantity =
Math.max(
1,
Number(
this.route.snapshot.queryParamMap.get('quantity') || 1
)
);


await this.loadAddress();

}



async ionViewWillEnter(){

if(this.state.checkoutAddress){

this.address =
this.state.checkoutAddress;

}

}



async loadAddress(){

try{

this.address =
this.state.checkoutAddress ||
await this.addresses.getDefaultAddress();

}
catch(_){}

finally{

this.loadingAddress = false;

}

}



chooseAddress(){

this.router.navigate(
['/addresses'],
{
queryParams:{
select:1
}
}
);

}



get checkoutItems(): [number, number][] {

  if (this.buyNowProductId !== null) {

    return [
      [
        this.buyNowProductId,
        this.buyNowQuantity
      ]
    ];

  }

  return [
    ...this.state.cart.entries()
  ];

}



get subtotal(){

return this.checkoutItems.reduce(

(sum,[id,q]) =>

sum +
this.state.productById(id).price*q,

0

);

}



get standardShipping(){

return this.subtotal >= 3000

?

0

:

120;

}



get shipping(){

return this.delivery === 'Express Delivery'

?

220

:

this.standardShipping;

}



get discount(){

return this.state.couponApplied

?

Math.min(
this.subtotal * .10,
349.90
)

:

0;

}



get total(){

return (
this.subtotal +
this.shipping -
this.discount
);

}




fullAddress(a:ShippingAddress){

return (

a.fullAddress ||

[
a.street,
a.barangay,
a.city,
a.postalCode
]
.filter(Boolean)
.join(', ')

);

}




async placeOrder(){

if(!this.address){

return this.message(
'Select a shipping address first.'
);

}


const load =
await this.loading.create({
message:'Placing order...'
});


await load.present();


try{


const items =
this.checkoutItems.map(([id,q])=>{

const p =
this.state.productById(id);


return {

productId:p.id,

name:p.name,

brand:p.brand,

category:p.category,

price:p.price,

quantity:q,

lineTotal:p.price*q

};


});



const result =
await this.orders.placeOrder({

items,

shippingAddress:this.address,

deliveryMethod:this.delivery,

paymentMethod:
this.state.selectedPayment.title,

subtotal:this.subtotal,

shippingFee:this.shipping,

discount:this.discount,

total:this.total

});



this.router.navigate(
['/order-success'],
{
queryParams:{
orderId:result.orderId,
orderNumber:result.orderNumber
}
}
);



}
catch(e:any){

await this.message(
e?.message || 'Unable to place order.'
);

}
finally{

await load.dismiss();

}


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





private async message(message:string){

const a =
await this.alerts.create({

header:'SmileHub',

message,

buttons:['OK']

});


await a.present();

}


}