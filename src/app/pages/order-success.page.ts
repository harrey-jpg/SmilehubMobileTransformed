import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';


@Component({
  selector:'app-order-success',
  standalone:true,
  imports:[
    RouterModule,
    IonicModule
  ],
  template:`

<ion-content>


<div 
class="auth-shell"
style="text-align:center">


<div style="font-size:86px">

✅

</div>



<h1 class="hero-title">

Order placed!

</h1>




<p class="muted">

Thank you. Your SmileHub order has been submitted successfully.

</p>





<div 
class="app-card"
style="text-align:left;margin:18px 0">


<div class="row-between">

<span>
Order
</span>


<b>
{{orderNumber || 'Confirmed'}}
</b>


</div>




<div class="row-between">

<span>
Payment
</span>


<b>
{{paymentMethod}}
</b>


</div>





<div class="row-between">

<span>
Delivery
</span>


<b>
{{deliveryMethod}}
</b>


</div>




<hr>




<div class="row-between total-row">


<span>
Total
</span>


<span>
{{money(total)}}
</span>


</div>



</div>





<ion-button

expand="block"

class="primary-btn"

routerLink="/orders">


View My Orders


</ion-button>




<ion-button

expand="block"

fill="outline"

class="outline-btn"

routerLink="/home">


Continue Shopping


</ion-button>




</div>


</ion-content>

`
})
export class OrderSuccessPage {


orderNumber = '';

paymentMethod = '';

deliveryMethod = '';

total = 0;



constructor(
route: ActivatedRoute
){

const q =
route.snapshot.queryParamMap;


this.orderNumber =
q.get('orderNumber') || '';

this.paymentMethod =
q.get('paymentMethod') || '';

this.deliveryMethod =
q.get('deliveryMethod') || '';

this.total =
Number(q.get('total') || 0);


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