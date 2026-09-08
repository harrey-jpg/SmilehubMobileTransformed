import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Product } from '../models/product';
import { AppStateService } from '../services/app-state.service';
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
class="cat-pills"
style="margin:8px 0 16px">


<button
class="cat-pill"
*ngFor="let c of categories"
[class.active]="category===c"
(click)="category=c">


{{c}}


</button>


</div>





<div class="section-row">


<div>

<h2>

{{category==='All'?'All Products':category}}

</h2>


<p>
{{filtered.length}} item{{filtered.length===1?'':'s'}}
</p>


</div>


<ion-select
[(ngModel)]="sort"
interface="popover"
placeholder="Sort"
class="sort-select">

<ion-select-option value="featured">Featured</ion-select-option>
<ion-select-option value="low">Price: Low to High</ion-select-option>
<ion-select-option value="high">Price: High to Low</ion-select-option>
<ion-select-option value="rating">Top Rated</ion-select-option>

</ion-select>


</div>





<div class="product-grid" *ngIf="filtered.length; else emptyTpl">


<app-product-card
*ngFor="let p of filtered; trackBy: trackProduct"
[product]="p">
</app-product-card>


</div>


<ng-template #emptyTpl>

<div class="empty">

<div class="emoji">🔍</div>

<h2>No products found</h2>

<p class="muted">Try a different search or category.</p>

</div>

</ng-template>



</div>


</ion-content>

`
})
export class CatalogPage implements OnInit {


get categories(): string[] {
return this.state.getCategories();
}

category = 'All';

search = '';

sort: 'featured' | 'low' | 'high' | 'rating' = 'featured';



constructor(
private route: ActivatedRoute,
public state: AppStateService
){}




ngOnInit(){

this.state.loadProductsFromFirestore();
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



return this.state.products.filter(p =>

(this.category === 'All' ||
p.category === this.category)

&&

(!term ||

`${p.name} ${p.brand} ${p.category}`
.toLowerCase()
.includes(term)

)

).sort((a, b) => {
  if (this.sort === 'low') return a.price - b.price;
  if (this.sort === 'high') return b.price - a.price;
  if (this.sort === 'rating') return b.rating - a.rating;
  return a.id - b.id;
});


}



trackProduct(_index: number, p: Product) {
  return p.id;
}



}