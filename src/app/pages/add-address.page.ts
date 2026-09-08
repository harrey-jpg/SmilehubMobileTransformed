import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AddressService } from '../services/address.service';
import { PhAddressService, PhPlace } from '../services/ph-address.service';
import { ShippingAddress } from '../models/product';


@Component({
  selector: 'app-add-address',
  standalone: true,
  imports: [
    IonicModule,
    FormsModule,
    CommonModule
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
type="tel"
[(ngModel)]="form.phone"
name="phone"
required>
</ion-input>

</ion-item>



<ion-item class="input-card" lines="none">

<ion-input
label="Street / Building"
labelPlacement="stacked"
placeholder="House no., street, subdivision"
[(ngModel)]="form.street"
name="street"
required>
</ion-input>

</ion-item>



<div class="form-grid" *ngIf="!manualLocation">


<ion-item class="input-card full" lines="none">

<ion-select
  label="Region"
  labelPlacement="stacked"
  [(ngModel)]="regionCode"
  name="region"
  (ionChange)="onRegionChange()"
  placeholder="Select region">

  <ion-select-option
    *ngFor="let r of regions"
    [value]="r.code">
    {{r.name}}
  </ion-select-option>

</ion-select>

</ion-item>


<ion-item class="input-card full" lines="none" *ngIf="hasProvinces">

<ion-select
  label="Province"
  labelPlacement="stacked"
  [(ngModel)]="provinceCode"
  name="province"
  [disabled]="!regionCode || loadingPlaces"
  (ionChange)="onProvinceChange()"
  placeholder="Select province">

  <ion-select-option
    *ngFor="let p of provinces"
    [value]="p.code">
    {{p.name}}
  </ion-select-option>

</ion-select>

</ion-item>


</div>



<ion-item class="input-card" lines="none" *ngIf="!manualLocation">

<ion-select
  label="City / Municipality"
  labelPlacement="stacked"
  [(ngModel)]="cityCode"
  name="citySelect"
  [disabled]="(!hasProvinces && !regionCode) || (hasProvinces && !provinceCode) || loadingPlaces"
  (ionChange)="onCityChange()"
  placeholder="Select city">

  <ion-select-option
    *ngFor="let c of cities"
    [value]="c.code">
    {{c.name}}
  </ion-select-option>

</ion-select>

</ion-item>



<ion-item class="input-card" lines="none" *ngIf="!manualLocation">

<ion-select
  label="Barangay"
  labelPlacement="stacked"
  [(ngModel)]="barangayName"
  name="barangaySelect"
  [disabled]="!cityCode || loadingPlaces"
  placeholder="Select barangay">

  <ion-select-option
    *ngFor="let b of barangays"
    [value]="b.name">
    {{b.name}}
  </ion-select-option>

</ion-select>

</ion-item>



<div class="form-grid" *ngIf="manualLocation">


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
type="tel"
maxlength="4"
[(ngModel)]="form.postalCode"
name="postalCode"
required>
</ion-input>

</ion-item>



<div style="text-align:right;margin:2px 0 8px">

<ion-button
  fill="clear"
  size="small"
  type="button"
  (click)="manualLocation = !manualLocation">

  {{manualLocation ? 'Use dropdowns instead' : 'Enter address manually instead'}}

</ion-button>

</div>



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


// Cascading Philippine address dropdowns. Only the street (plus name,
// phone and postal code) is typed — everything else is picked.
regions: PhPlace[] = [];
provinces: PhPlace[] = [];
cities: PhPlace[] = [];
barangays: PhPlace[] = [];
regionCode = '';
provinceCode = '';
cityCode = '';
barangayName = '';
hasProvinces = true;
loadingPlaces = false;
manualLocation = false;



constructor(
  private route: ActivatedRoute,
  private service: AddressService,
  private places: PhAddressService,
  private router: Router,
  private alerts: AlertController,
  private loading: LoadingController
){

this.id =
this.route.snapshot.queryParamMap.get('id') || '';

}



async ionViewWillEnter(){

this.regions = await this.places.regions();

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

await this.matchSavedLocation();

}


}catch(_){}


}



private findByName(list: PhPlace[], name: string): PhPlace | null {
  const target = (name || '').trim().toLowerCase();
  if (!target) return null;
  return list.find(p => p.name.toLowerCase() === target)
    || list.find(p => p.name.toLowerCase().includes(target))
    || null;
}

// Try to preselect dropdowns from a saved address (edit mode). Falls
// back to manual text inputs when nothing matches (e.g. offline or a
// differently-spelled place name).
private async matchSavedLocation() {
  const byRegion = this.findByName(this.regions, '');
  if (byRegion) this.regionCode = byRegion.code;
  // Without a saved region we cannot cascade; match city across regions
  // is unreliable, so stay manual only when dropdown data is missing.
  if (!this.regionCode) {
    // Guess NCR for Metro Manila cities so dropdowns still work.
    const ncr = this.regions.find(r => r.code === '130000000');
    if (ncr) this.regionCode = ncr.code;
  }
  if (!this.regionCode) { this.manualLocation = true; return; }

  await this.onRegionChange(true);

  if (this.hasProvinces && this.provinces.length) {
    // Province is not stored on the address, so keep the list ready and
    // let the city match decide; user picks province if needed.
    this.manualLocation = false;
  }

  // Try to find the saved city: NCR path first, else scan provinces.
  let city: PhPlace | null = this.findByName(this.cities, this.form.city);
  if (!city && this.hasProvinces) {
    for (const p of this.provinces) {
      const list = await this.places.cities(p.code);
      const hit = list ? this.findByName(list, this.form.city) : null;
      if (hit) {
        this.provinceCode = p.code;
        this.cities = list || [];
        city = hit;
        break;
      }
    }
  }
  if (!city) {
    // Saved city not in dropdown data (offline?) — edit as text.
    this.manualLocation = true;
    return;
  }
  this.cityCode = city.code;
  await this.onCityChange(true);
  const brgy = this.findByName(this.barangays, this.form.barangay);
  if (brgy) {
    this.barangayName = brgy.name;
    this.manualLocation = false;
  } else {
    this.manualLocation = true;
  }
}



async onRegionChange(silent = false){
  this.provinceCode = '';
  this.cityCode = '';
  this.barangayName = '';
  this.provinces = [];
  this.cities = [];
  this.barangays = [];
  this.hasProvinces = true;
  if (!this.regionCode) return;
  if (!silent) this.loadingPlaces = true;
  try {
    const provs = await this.places.provinces(this.regionCode);
    if (provs && provs.length) {
      this.provinces = provs;
      this.hasProvinces = true;
    } else {
      // NCR and similar: cities hang directly under the region.
      const list = await this.places.regionCities(this.regionCode);
      this.cities = list || [];
      this.hasProvinces = false;
    }
  } finally {
    if (!silent) this.loadingPlaces = false;
  }
}



async onProvinceChange(silent = false){
  this.cityCode = '';
  this.barangayName = '';
  this.cities = [];
  this.barangays = [];
  if (!this.provinceCode) return;
  if (!silent) this.loadingPlaces = true;
  try {
    this.cities = await this.places.cities(this.provinceCode) || [];
  } finally {
    if (!silent) this.loadingPlaces = false;
  }
}



async onCityChange(silent = false){
  this.barangayName = '';
  this.barangays = [];
  if (!this.cityCode) return;
  if (!silent) this.loadingPlaces = true;
  try {
    this.barangays = await this.places.barangays(this.cityCode) || [];
  } finally {
    if (!silent) this.loadingPlaces = false;
  }
}



private locationValid(): boolean {
  if (this.manualLocation) {
    return !!this.form.barangay.trim() && !!this.form.city.trim();
  }
  if (!this.regionCode || !this.cityCode || !this.barangayName) return false;
  if (this.hasProvinces && !this.provinceCode) return false;
  return true;
}



private applyDropdownLocation() {
  const city = this.cities.find(c => c.code === this.cityCode);
  this.form.city = city ? city.name : this.form.city;
  this.form.barangay = this.barangayName;
}



async save(){


if(
!this.form.recipient.trim() ||
!this.form.phone.trim() ||
!this.form.street.trim() ||
!this.form.postalCode.trim() ||
!this.locationValid()
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

if (!this.manualLocation) this.applyDropdownLocation();

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
