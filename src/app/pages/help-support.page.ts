import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector:'app-help-support',
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
Help & Support
</ion-title>


</ion-toolbar>

</ion-header>




<ion-content>


<div class="page-wrap no-bottom">



<div class="app-card">


<h2>
How can we help?
</h2>


<p class="muted">

Find quick answers about orders, delivery, payments, and your account.

</p>



<ion-button

expand="block"

routerLink="/contact-support">

Contact Support

</ion-button>



</div>





<div class="section-row">

<h2>
Frequently Asked Questions
</h2>

</div>





<ion-accordion-group>



<ion-accordion value="1">


<ion-item slot="header">

<ion-label>
How do I track my order?
</ion-label>

</ion-item>


<div 
slot="content"
style="padding:16px">

Open My Orders from your Account and choose an order to view its current status.

</div>


</ion-accordion>





<ion-accordion value="2">


<ion-item slot="header">

<ion-label>
When is shipping free?
</ion-label>

</ion-item>


<div 
slot="content"
style="padding:16px">

Standard shipping is free when the cart subtotal is at least ₱3,000.

</div>


</ion-accordion>





<ion-accordion value="3">


<ion-item slot="header">

<ion-label>
How does SMILE10 work?
</ion-label>

</ion-item>


<div 
slot="content"
style="padding:16px">

Enter SMILE10 in the cart to apply 10% off, capped at ₱349.90.

</div>


</ion-accordion>





<ion-accordion value="4">


<ion-item slot="header">

<ion-label>
Can I change my delivery address?
</ion-label>

</ion-item>


<div 
slot="content"
style="padding:16px">

Yes. Open Addresses from your Account or choose Change during checkout.

</div>


</ion-accordion>



</ion-accordion-group>



</div>


</ion-content>

`
})
export class HelpSupportPage {}