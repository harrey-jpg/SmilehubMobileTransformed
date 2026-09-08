import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { OrderService } from '../services/order.service';


@Component({
  selector:'app-orders',
  standalone:true,
  imports:[
    IonicModule,
    CommonModule
  ],
  template:`

<ion-header>

<ion-toolbar>


<ion-buttons slot="start">

<ion-back-button defaultHref="/account">
</ion-back-button>

</ion-buttons>


<ion-title>
My Orders
</ion-title>


</ion-toolbar>

</ion-header>





<ion-content>


<div class="page-wrap no-bottom">





<div
style="text-align:center;padding:30px"
*ngIf="loading">


<ion-spinner>
</ion-spinner>


</div>







<div
class="empty"
*ngIf="!loading && !orders.length">


<div class="emoji">
📦
</div>


<h2>
No orders yet
</h2>


<p class="muted">

Your placed orders will appear here.

</p>


<ion-button routerLink="/catalog">

Shop Now

</ion-button>


</div>







<div class="list-stack">


<div

class="app-card card-button"

*ngFor="let o of orders"

[routerLink]="['/order-details',o.id]">





<div class="row-between">


<div>


<b>
{{o.orderNumber || o.id}}
</b>



<div
class="muted"
style="font-size:12px">


{{date(o.createdAt)}} •
{{o.itemCount || 0}} item(s)


</div>


</div>





<span class="order-status">

{{o.status || 'Pending'}}

</span>


</div>





<hr>





<div class="row-between">


<span>

{{o.deliveryMethod || 'Delivery'}}

</span>


<b>

{{money(o.total || 0)}}

</b>


</div>



</div>



</div>



</div>


</ion-content>

`
})
export class OrdersPage {


orders:any[] = [];

loading = true;



constructor(
private service:OrderService
){}




async ionViewWillEnter(){


this.loading = true;


try{


this.orders =
await this.service.listMyOrders();


}catch(_){


this.orders = [];


}finally{


this.loading = false;


}


}




date(v:any){


try{


return v?.toDate?.()
.toLocaleDateString(
'en-PH',
{
year:'numeric',
month:'short',
day:'numeric'
}
)
||
'Recent';


}catch(_){


return 'Recent';


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