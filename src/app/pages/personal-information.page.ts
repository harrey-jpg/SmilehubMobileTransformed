import { Component } from '@angular/core';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { ProfileService } from '../services/profile.service';


@Component({
  selector:'app-personal-information',
  standalone:true,
  imports:[
    IonicModule,
    FormsModule
  ],
  template:`

<ion-header>

<ion-toolbar>


<ion-buttons slot="start">

<ion-back-button defaultHref="/account">
</ion-back-button>

</ion-buttons>


<ion-title>
Personal Information
</ion-title>


</ion-toolbar>

</ion-header>





<ion-content>


<div class="page-wrap no-bottom">


<form (ngSubmit)="save()">





<ion-item 
class="input-card"
lines="none">


<ion-input

label="Full name"

labelPlacement="stacked"

[(ngModel)]="fullName"

name="fullName">

</ion-input>


</ion-item>






<ion-item 
class="input-card"
lines="none">


<ion-input

label="Email"

labelPlacement="stacked"

[(ngModel)]="email"

name="email"

[readonly]="true">

</ion-input>


</ion-item>






<ion-item 
class="input-card"
lines="none">


<ion-input

label="Mobile number"

labelPlacement="stacked"

[(ngModel)]="mobile"

name="mobile">

</ion-input>


</ion-item>






<ion-item 
class="input-card"
lines="none">


<ion-input

label="Clinic / Organization"

labelPlacement="stacked"

[(ngModel)]="clinic"

name="clinic">

</ion-input>


</ion-item>






<ion-item 
class="input-card"
lines="none">


<ion-select

label="Buyer type"

labelPlacement="stacked"

[(ngModel)]="buyerType"

name="buyerType">



<ion-select-option value="Dental Professional">

Dental Professional

</ion-select-option>




<ion-select-option value="Dental Student">

Dental Student

</ion-select-option>




<ion-select-option value="Clinic / Organization">

Clinic / Organization

</ion-select-option>




<ion-select-option value="Healthcare Buyer">

Healthcare Buyer

</ion-select-option>



</ion-select>


</ion-item>






<ion-button

expand="block"

type="submit"

class="primary-btn">


Save Changes


</ion-button>




</form>


</div>


</ion-content>

`
})
export class PersonalInformationPage {


fullName='';

email='';

mobile='';

clinic='';

buyerType='Dental Professional';




constructor(
private profile:ProfileService,
private alerts:AlertController,
private loading:LoadingController
){}





async ionViewWillEnter(){

try{


const p =
await this.profile.loadProfile();


Object.assign(this,p);


}catch(_){}



}






async save(){


if(!this.fullName.trim())

return this.msg(
'Full name is required.'
);



const l =
await this.loading.create({
message:'Saving...'
});


await l.present();




try{


await this.profile.saveProfile(
this.fullName,
this.mobile,
this.clinic,
this.buyerType
);



await this.msg(
'Profile updated.'
);



}catch(e:any){


await this.msg(
e?.message || 'Unable to save profile.'
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