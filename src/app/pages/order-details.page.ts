import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { OrderService } from '../services/order.service';


@Component({
  selector:'app-order-details',
  standalone:true,
  imports:[
    IonicModule,
    CommonModule
  ],
  template:`

<ion-header>

<ion-toolbar>


<ion-buttons slot="start">

<ion-back-button defaultHref="/orders">
</ion-back-button>

</ion-buttons>


<ion-title>
Order Details
</ion-title>


</ion-toolbar>

</ion-header>




<ion-content>


<div 
class="page-wrap no-bottom"
*ngIf="order; else loadingTpl">



<div class="app-card">


<div class="row-between">


<div>

<div class="muted">
Order number
</div>


<h2 style="margin:4px 0">

{{order.orderNumber}}

</h2>


</div>



<span class="order-status">

{{order.status}}

</span>



</div>



<p class="muted">

Placed {{date(order.createdAt)}}

</p>



</div>






<div class="section-row">

<h2>
Items
</h2>

</div>




<div class="list-stack">


<div 
class="app-card row"
*ngFor="let i of order.items || []">


<div 
class="category-icon"
style="width:54px;height:54px">

🦷

</div>



<div class="flex-1">


<b>
{{i.name}}
</b>


<div class="muted">

{{i.brand}} • Qty {{i.quantity}}

</div>


</div>



<b>

{{money(i.lineTotal || i.price*i.quantity)}}

</b>



</div>


</div>







<div class="section-row">

<h2>
Shipping
</h2>

</div>




<div class="app-card">


<b>
📍 {{order.shippingAddress?.label || 'Address'}}
</b>


<p>

{{order.shippingAddress?.recipient}}

<br>

{{order.shippingAddress?.phone}}

</p>



<p class="muted">

{{order.shippingAddress?.fullAddress}}

</p>



<div class="row-between">

<span>
Delivery method
</span>


<b>
{{order.deliveryMethod}}
</b>


</div>



</div>







<div class="section-row">

<h2>
Payment & Total
</h2>


</div>





<div class="app-card">


<div class="row-between">

<span>
Payment
</span>

<b>
{{order.paymentMethod}}
</b>

</div>




<div class="row-between">

<span>
Subtotal
</span>

<b>
{{money(order.subtotal || 0)}}
</b>

</div>




<div class="row-between">

<span>
Shipping
</span>


<b>

{{order.shippingFee===0?'Free':money(order.shippingFee || 0)}}

</b>


</div>




<div 
class="row-between"
*ngIf="order.discount">


<span>
Discount
</span>


<b class="success">

−{{money(order.discount)}}

</b>


</div>




<hr>



<div class="row-between total-row">

<span>
Total
</span>


<span>

{{money(order.total || 0)}}

</span>


</div>



</div>




</div>






<ng-template #loadingTpl>


<div style="text-align:center;padding:50px">


<ion-spinner *ngIf="loading">
</ion-spinner>


<p *ngIf="!loading">

Order not found.

</p>


</div>


</ng-template>



</ion-content>

`
})
export class OrderDetailsPage {


order:any = null;

loading = true;



constructor(
private route: ActivatedRoute,
private service: OrderService
){}




async ionViewWillEnter(){


this.loading = true;


try{


this.order =
await this.service.getOrder(
this.route.snapshot.paramMap.get('id') || ''
);


}catch(_){


this.order = null;


}finally{


this.loading = false;


}


}





date(v:any){


try{


return v?.toDate?.()
.toLocaleString('en-PH') || '';


}catch(_){


return '';

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


}