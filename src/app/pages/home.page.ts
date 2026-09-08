import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AppStateService } from '../services/app-state.service';

import { ProductCardComponent } from '../shared/product-card.component';
import { BottomNavComponent } from '../shared/bottom-nav.component';


@Component({
  selector:'app-home',
  standalone:true,
  imports:[
    RouterModule,
    IonicModule,
    CommonModule,
    ProductCardComponent,
    BottomNavComponent
  ],
  template:`

<ion-header>

<ion-toolbar>


<ion-title>

<div class="logo">

<span class="logo-mark">
🦷
</span>

<span>
SmileHub
</span>

</div>

</ion-title>



<ion-buttons slot="end" class="header-actions">


<ion-button routerLink="/wishlist" class="icon-btn">

<ion-icon name="heart-outline"></ion-icon>

<ion-badge color="danger" class="header-badge" *ngIf="state.wishlist.size > 0">{{badgeText(state.wishlist.size)}}</ion-badge>

</ion-button>



<ion-button routerLink="/cart" class="icon-btn">

<ion-icon name="cart-outline"></ion-icon>

<ion-badge color="danger" class="header-badge" *ngIf="state.cartCount > 0">{{badgeText(state.cartCount)}}</ion-badge>

</ion-button>


</ion-buttons>


</ion-toolbar>

</ion-header>





<ion-content>


<div class="page-wrap">



<ion-item
class="input-card"
lines="none"
button
routerLink="/catalog">


<ion-icon
name="search-outline"
slot="start">
</ion-icon>


<ion-label color="medium">

Search dental products...

</ion-label>


</ion-item>






<div
class="hero-banner">


<div class="row-between">


<div>


<div style="font-size:22px;font-weight:900">

Clinic essentials, all in one place.

</div>


<p style="opacity:.9">

Reliable supplies for everyday dental care.

</p>


<ion-button
color="light"
size="small"
(click)="router.navigate(['/catalog'])">

Shop now

</ion-button>


</div>


<div style="font-size:56px">

🦷

</div>


</div>


</div>






<div class="section-row">

<h2>
Popular Categories
</h2>


<ion-button
fill="clear"
size="small"
routerLink="/categories">

View all

</ion-button>


</div>





<div class="category-strip">


<div
class="category-bubble"
*ngFor="let c of categories"
(click)="openCategory(c.label)">


<div class="category-icon">

{{c.icon}}

</div>


<div style="font-size:11px;font-weight:800;margin-top:6px">

{{c.label}}

</div>


</div>


</div>






<div class="section-row">

<h2>
Featured Products
</h2>


<ion-button
fill="clear"
size="small"
routerLink="/catalog">

See all

</ion-button>


</div>




<div class="product-grid">


<app-product-card
*ngFor="let p of featured"
[product]="p">

</app-product-card>


</div>






<div class="list-stack">


<div
class="app-card row card-button"
*ngFor="let p of latest"
(click)="router.navigate(['/product-details',p.id])">


<div class="product-art"
style="min-height:76px;width:76px">


<img
[src]="p.imageAsset"
style="width:58px;height:58px">


</div>



<div class="flex-1">


<div class="brand">

{{p.brand}}

</div>


<div style="font-weight:800">

{{p.name}}

</div>


<div class="price">

{{money(p.price)}}

</div>


</div>



<ion-button
fill="clear"
(click)="$event.stopPropagation();state.addToCart(p.id)">


<ion-icon
name="add-outline">
</ion-icon>


</ion-button>


</div>


</div>




</div>



</ion-content>

<ion-footer>
<app-bottom-nav active="home">
</app-bottom-nav>
</ion-footer>

`
})
export class HomePage implements OnInit {


get featured() {
  return this.state.products.slice(0, 6);
}


get latest() {
  return this.state.products.slice(-4);
}



get categories() {
  const icons: Record<string, string> = {
    'Oral Care': '🪥',
    'Instruments': '🛠️',
    'PPE': '😷',
    'Restorative': '🧪',
    'Disposables': '🧻',
    'Impression': '😁',
    'Orthodontics': '🦷',
    'Rotary': '⚙️',
    'Equipment': '⚕️',
    'Cosmetic': '✨'
  };
  return this.state.getCategories()
    .filter(c => c !== 'All')
    .slice(0, 8)
    .map(label => ({ label, icon: icons[label] || '🦷' }));
}



constructor(
public state:AppStateService,
public router:Router
){}



ngOnInit() {
  this.state.loadProductsFromFirestore();
}



openCategory(category:string){

this.router.navigate(
['/catalog'],
{
queryParams:{
category
}
}
);

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


badgeText(n:number){
  return n > 99 ? '99+' : String(n);
}


}