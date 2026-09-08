import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { productCategories, smileHubProducts } from '../data/products';
import { Product } from '../models/product';
import { ProductCardComponent } from '../shared/product-card.component';


@Component({
  selector:'app-catalog',
  standalone:true,
  imports:[
    IonicModule,
    FormsModule,
    CommonModule,
    ProductCardComponent
  ],
  template:`

<ion-header>

<ion-toolbar>


<ion-buttons slot="start">

<ion-back-button defaultHref="/home">
</ion-back-button>

</ion-buttons>



<ion-title>
Catalog
</ion-title>


</ion-toolbar>

</ion-header>




<ion-content>


<div class="page-wrap no-bottom">


<ion-searchbar
[(ngModel)]="search"
placeholder="Search products"
debounce="0">
</ion-searchbar>




<div 
class="category-strip"
style="margin:8px 0 16px">


<ion-chip
*ngFor="let c of categories"
[color]="category===c?'primary':undefined"
(click)="category=c">


<ion-label>
{{c}}
</ion-label>


</ion-chip>


</div>





<div class="section-row">


<div>

<h2>

{{category==='All'?'All Products':category}}

</h2>


<p>
{{filtered.length}} items
</p>


</div>


</div>





<div class="product-grid">


<app-product-card
*ngFor="let p of filtered"
[product]="p">
</app-product-card>


</div>



</div>


</ion-content>

`
})
export class CatalogPage implements OnInit {


categories = productCategories;

category = 'All';

search = '';



constructor(
private route: ActivatedRoute
){}




ngOnInit(){

this.route.queryParamMap.subscribe(q=>{

this.category =
q.get('category') || 'All';

});


}




get filtered(): Product[]{


const term =
this.search
.trim()
.toLowerCase();



return smileHubProducts.filter(p =>

(this.category === 'All' ||
p.category === this.category)

&&

(!term ||

`${p.name} ${p.brand} ${p.category}`
.toLowerCase()
.includes(term)

)

);


}



}