import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { AppStateService } from '../services/app-state.service';


@Component({
  selector: 'app-add-payment',
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ],
  template: `

<ion-header>

  <ion-toolbar>

    <ion-buttons slot="start">

      <ion-back-button defaultHref="/payments">
      </ion-back-button>

    </ion-buttons>


    <ion-title>
      Add Payment
    </ion-title>


  </ion-toolbar>

</ion-header>



<ion-content>

<div class="page-wrap no-bottom">


<div class="notice">

This screen keeps the same demo behavior as the Flutter version.
Do not store raw card numbers in Firestore.

</div>



<form (ngSubmit)="save()">



<ion-item class="input-card">


<ion-select
label="Payment type"
labelPlacement="stacked"
[(ngModel)]="type"
name="type">


<ion-select-option value="GCash">
GCash
</ion-select-option>


<ion-select-option value="Card">
Debit/Credit Card
</ion-select-option>


</ion-select>


</ion-item>




<ion-item class="input-card">


<ion-input
label="Display name"
labelPlacement="stacked"
[(ngModel)]="title"
name="title"
placeholder="e.g. GCash or Visa ending 1234">
</ion-input>


</ion-item>




<ion-item class="input-card">


<ion-input
label="Subtitle"
labelPlacement="stacked"
[(ngModel)]="subtitle"
name="subtitle"
placeholder="e.g. •••• •••• 6789">
</ion-input>


</ion-item>




<ion-button
expand="block"
type="submit"
class="primary-btn">

Save Payment Method

</ion-button>



</form>


</div>


</ion-content>

`
})
export class AddPaymentPage {


type = 'GCash';

title = 'GCash';

subtitle = '';



constructor(
  private state: AppStateService,
  private router: Router,
  private alerts: AlertController
){}




async save(){


if(!this.title.trim()){

return this.msg(
'Enter a display name.'
);

}



this.state.addPaymentMethod({

title:this.title.trim(),

subtitle:
this.subtitle.trim() || 'Saved payment method',

icon:
this.type === 'GCash'
? 'wallet-outline'
: 'card-outline'

});



await this.router.navigateByUrl(
'/payments'
);


}




private async msg(message:string){


const a =
await this.alerts.create({

header:'SmileHub',

message,

buttons:['OK']

});


await a.present();


}



}