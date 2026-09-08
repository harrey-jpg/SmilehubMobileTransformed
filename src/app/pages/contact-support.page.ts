import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';


@Component({
  selector:'app-contact-support',
  standalone:true,
  imports:[
    IonicModule,
    FormsModule
  ],
  template:`

<ion-header>

<ion-toolbar>

<ion-buttons slot="start">

<ion-back-button defaultHref="/help">
</ion-back-button>

</ion-buttons>


<ion-title>
Contact Support
</ion-title>


</ion-toolbar>

</ion-header>




<ion-content>


<div class="page-wrap no-bottom">


<div class="app-card">


<h2>
Send us a message
</h2>


<p class="muted">

Tell us what you need help with and the SmileHub team can review it.

</p>




<form (ngSubmit)="send()">



<ion-item class="input-card">


<ion-select

label="Concern"

labelPlacement="stacked"

[(ngModel)]="concern"

name="concern">


<ion-select-option value="Order concern">
Order concern
</ion-select-option>


<ion-select-option value="Delivery concern">
Delivery concern
</ion-select-option>


<ion-select-option value="Product inquiry">
Product inquiry
</ion-select-option>


<ion-select-option value="Payment concern">
Payment concern
</ion-select-option>


<ion-select-option value="Account concern">
Account concern
</ion-select-option>


<ion-select-option value="Other">
Other
</ion-select-option>


</ion-select>


</ion-item>





<ion-item class="input-card">


<ion-textarea

label="Message"

labelPlacement="stacked"

[autoGrow]="true"

[(ngModel)]="message"

name="message"

rows="6">

</ion-textarea>


</ion-item>





<ion-button

expand="block"

type="submit"

class="primary-btn">


Submit Concern


</ion-button>



</form>


</div>





<div class="section-row">

<h2>
Support channels
</h2>

</div>




<div class="list-stack">


<div class="app-card">

📧 Email support

</div>



<div class="app-card">

📞 Order assistance

</div>


</div>




</div>


</ion-content>

`
})
export class ContactSupportPage {


concern = 'Order concern';

message = '';



constructor(
route: ActivatedRoute,
private alerts: AlertController
){

this.concern =
route.snapshot.queryParamMap.get('concern')
||
'Order concern';

}




async send(){


const text =
this.message.trim()

?

'Your concern has been recorded in this app demo. Connect this form to your real support backend/email service for production.'

:

'Please enter your message.';



const a =
await this.alerts.create({

header:'SmileHub Support',

message:text,

buttons:['OK']

});


await a.present();



if(this.message.trim()){

this.message='';

}


}



}