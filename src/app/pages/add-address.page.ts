import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { AddressService } from '../services/address.service';
import { ShippingAddress } from '../models/product';


@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ],
  template: `

<ion-header>
  <ion-toolbar>

    <ion-buttons slot="start">
      <ion-back-button defaultHref="/addresses"></ion-back-button>
    </ion-buttons>

    <ion-title>
      {{id ? 'Edit Address' : 'Add Address'}}
    </ion-title>

  </ion-toolbar>
</ion-header>


<ion-content>

<div class="page-wrap no-bottom">

<form (ngSubmit)="save()">


<ion-item class="input-card" lines="none">

<ion-select
  label="Label"
  labelPlacement="stacked"
  [(ngModel)]="form.label"
  name="label">

  <ion-select-option value="Home">
    Home
  </ion-select-option>

  <ion-select-option value="Clinic">
    Clinic
  </ion-select-option>

  <ion-select-option value="Office">
    Office
  </ion-select-option>

  <ion-select-option value="Other">
    Other
  </ion-select-option>

</ion-select>

</ion-item>



<ion-item class="input-card" lines="none">

<ion-input
label="Recipient"
labelPlacement="stacked"
[(ngModel)]="form.recipient"
name="recipient"
required>
</ion-input>

</ion-item>



<ion-item class="input-card" lines="none">

<ion-input
label="Phone"
labelPlacement="stacked"
[(ngModel)]="form.phone"
name="phone"
required>
</ion-input>

</ion-item>



<ion-item class="input-card" lines="none">

<ion-input
label="Street / Building"
labelPlacement="stacked"
[(ngModel)]="form.street"
name="street"
required>
</ion-input>

</ion-item>



<div class="form-grid">


<ion-item class="input-card">

<ion-input
label="Barangay"
labelPlacement="stacked"
[(ngModel)]="form.barangay"
name="barangay"
required>
</ion-input>

</ion-item>



<ion-item class="input-card">

<ion-input
label="City"
labelPlacement="stacked"
[(ngModel)]="form.city"
name="city"
required>
</ion-input>

</ion-item>


</div>



<ion-item class="input-card" lines="none">

<ion-input
label="Postal code"
labelPlacement="stacked"
[(ngModel)]="form.postalCode"
name="postalCode"
required>
</ion-input>

</ion-item>



<ion-item class="input-card" lines="none">

<ion-toggle
[(ngModel)]="form.isDefault"
name="isDefault">

Set as default address

</ion-toggle>

</ion-item>



<ion-button
expand="block"
type="submit"
class="primary-btn">

{{id ? 'Save Changes' : 'Add Address'}}

</ion-button>


</form>

</div>

</ion-content>

`
})
export class AddAddressPage {


id = '';


form: ShippingAddress = {
  label:'Home',
  recipient:'',
  phone:'',
  city:'',
  barangay:'',
  street:'',
  postalCode:'',
  isDefault:false
};



constructor(
  private route: ActivatedRoute,
  private service: AddressService,
  private router: Router,
  private alerts: AlertController,
  private loading: LoadingController
){

this.id =
this.route.snapshot.queryParamMap.get('id') || '';

}



async ionViewWillEnter(){

if(!this.id) return;


try{

const list = await this.service.listAddresses();

const found = list.find(
a => a.addressId === this.id
);


if(found){

this.form = {
...found
};

}


}catch(_){}


}




async save(){


if(
!this.form.recipient.trim() ||
!this.form.phone.trim() ||
!this.form.street.trim() ||
!this.form.barangay.trim() ||
!this.form.city.trim() ||
!this.form.postalCode.trim()
){

return this.msg(
'Complete all required address fields.'
);

}



const l =
await this.loading.create({
message:'Saving address...'
});


await l.present();



try{


if(this.id){

await this.service.updateAddress(
this.id,
this.form
);


}else{


await this.service.addAddress(
this.form
);


}



await this.router.navigateByUrl(
'/addresses'
);



}catch(e:any){


await this.msg(
e?.message || 'Unable to save address.'
);



}finally{


await l.dismiss();


}



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