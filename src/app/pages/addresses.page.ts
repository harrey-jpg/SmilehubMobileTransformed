import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AddressService } from '../services/address.service';
import { AppStateService } from '../services/app-state.service';
import { ShippingAddress } from '../models/product';


@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [
    RouterModule,
    IonicModule,
    CommonModule
  ],
  template: `

<ion-header>

<ion-toolbar>


<ion-buttons slot="start">

<ion-back-button
[defaultHref]="selectionMode?'/checkout':'/account'">
</ion-back-button>

</ion-buttons>



<ion-title>

{{selectionMode?'Select Address':'Addresses'}}

</ion-title>



<ion-buttons slot="end">

<ion-button routerLink="/add-address">

<ion-icon name="add-outline"></ion-icon>

</ion-button>

</ion-buttons>


</ion-toolbar>

</ion-header>



<ion-content>


<div class="page-wrap no-bottom">



<div 
style="text-align:center;padding:24px"
*ngIf="loading">

<ion-spinner></ion-spinner>

</div>




<div 
class="empty"
*ngIf="!loading&&!addresses.length">


<div class="emoji">
📍
</div>


<h2>
No saved addresses
</h2>


<p class="muted">
Add a delivery address for checkout.
</p>


<ion-button routerLink="/add-address">

Add Address

</ion-button>


</div>





<div class="list-stack">


<div 
class="app-card card-button"
*ngFor="let a of addresses"
(click)="select(a)">



<div class="row-between">

<b>
📍 {{a.label}}
</b>


<span 
class="pill"
*ngIf="a.isDefault">

Default

</span>


</div>




<p>

<b>
{{a.recipient}}
</b>

<br>

{{a.phone}}

</p>



<p class="muted">

{{a.fullAddress || fullAddress(a)}}

</p>




<div 
class="row"
*ngIf="!selectionMode">



<ion-button
size="small"
fill="outline"
(click)="$event.stopPropagation();edit(a)">

Edit

</ion-button>



<ion-button
size="small"
fill="clear"
color="danger"
(click)="$event.stopPropagation();remove(a)">

Delete

</ion-button>


</div>



</div>


</div>





<ion-button

expand="block"

fill="outline"

class="outline-btn"

routerLink="/add-address"

style="margin-top:16px">

Add New Address

</ion-button>



</div>


</ion-content>

`
})
export class AddressesPage {


addresses: ShippingAddress[] = [];

loading = true;

selectionMode = false;



constructor(
private service: AddressService,
private state: AppStateService,
private route: ActivatedRoute,
private router: Router,
private alerts: AlertController
){


this.selectionMode =
route.snapshot.queryParamMap.get('select') === '1';


}




async ionViewWillEnter(){


this.loading = true;


try{


this.addresses =
await this.service.listAddresses();


}catch(_){


this.addresses = [];


}finally{


this.loading = false;


}


}





fullAddress(a: ShippingAddress){


return [
a.street,
a.barangay,
a.city,
a.postalCode
]
.filter(Boolean)
.join(', ');


}




select(a: ShippingAddress){


if(!this.selectionMode)
return;


this.state.checkoutAddress = a;


this.router.navigateByUrl('/checkout');


}





edit(a: ShippingAddress){


this.router.navigate(
['/add-address'],
{
queryParams:{
id:a.addressId
}
}
);


}





async remove(a: ShippingAddress){


if(!a.addressId)
return;



const alert =
await this.alerts.create({

header:'Delete address?',

message:'This saved address will be removed.',


buttons:[

{
text:'Cancel',
role:'cancel'
},

{

text:'Delete',

role:'destructive',

handler:async()=>{

await this.service.deleteAddress(
a.addressId!
);

await this.ionViewWillEnter();

}

}

]

});



await alert.present();


}


}