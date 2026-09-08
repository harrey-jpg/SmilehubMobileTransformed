import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AppStateService } from '../services/app-state.service';


@Component({
  selector:'app-payments',
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

<ion-back-button
[defaultHref]="selectionMode?'/checkout':'/account'">

</ion-back-button>

</ion-buttons>



<ion-title>

{{selectionMode?'Select Payment':'Payment Methods'}}

</ion-title>




<ion-buttons slot="end">


<ion-button routerLink="/add-payment">

<ion-icon name="add-outline">
</ion-icon>

</ion-button>


</ion-buttons>


</ion-toolbar>

</ion-header>





<ion-content>


<div class="page-wrap no-bottom">


<div class="list-stack">



<div

class="app-card row card-button"

*ngFor="let p of state.paymentMethods; let i=index"

(click)="select(i)">





<div

class="category-icon"

style="width:48px;height:48px">


<ion-icon
[name]="p.icon">
</ion-icon>


</div>





<div class="flex-1">


<b>

{{p.title}}

</b>



<div class="muted">

{{p.subtitle}}

</div>



</div>





<ion-icon

name="checkmark-circle-outline"

color="primary"

*ngIf="i===state.selectedPaymentIndex">

</ion-icon>



</div>


</div>






<ion-button

expand="block"

fill="outline"

class="outline-btn"

routerLink="/add-payment"

style="margin-top:16px">


Add Payment Method


</ion-button>




</div>


</ion-content>

`
})
export class PaymentsPage {


selectionMode = false;



constructor(
public state:AppStateService,
route:ActivatedRoute,
private router:Router
){


this.selectionMode =
route.snapshot.queryParamMap.get('select') === '1';


}




select(i:number){


this.state.selectPayment(i);



if(this.selectionMode){

this.router.navigateByUrl('/checkout');

}


}



}