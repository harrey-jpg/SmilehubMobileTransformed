import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AppStateService } from '../services/app-state.service';
import { BottomNavComponent } from '../shared/bottom-nav.component';


@Component({
  selector:'app-categories',
  standalone:true,
  imports:[
    IonicModule,
    CommonModule,
    BottomNavComponent
  ],
  template:`

<ion-header>

<ion-toolbar>

<ion-title>
Categories
</ion-title>

</ion-toolbar>

</ion-header>



<ion-content>


<div class="page-wrap">


<div class="list-stack">


<div
class="app-card row-between card-button"
*ngFor="let c of categories"
(click)="open(c)">



<div class="row">


<div
class="category-icon"
style="width:50px;height:50px">

{{icon(c)}}

</div>



<div>

<b>
{{c}}
</b>


<div
class="muted"
style="font-size:12px">

{{count(c)}} products

</div>


</div>


</div>




<ion-icon
name="chevron-forward-outline">
</ion-icon>



</div>


</div>


</div>



</ion-content>

<ion-footer>
<app-bottom-nav active="categories">
</app-bottom-nav>
</ion-footer>

`
})
export class CategoriesPage implements OnInit {


get categories(): string[] {
return this.state.getCategories().filter(c => c !== 'All');
}



constructor(
private router: Router,
public state: AppStateService
){}




ngOnInit(){
this.state.loadProductsFromFirestore();
}




count(c:string){

return this.state.products.filter(
p => p.category === c
).length;

}




icon(c:string){

return ({

'Oral Care':'🪥',

'Instruments':'🛠️',

'PPE':'😷',

'Restorative':'🧪',

'Disposables':'🧻',

'Impression':'😁',

'Orthodontics':'🦷',

'Rotary':'⚙️',

'Cosmetic':'✨',

'Equipment':'⚕️'


} as any)[c] || '🦷';


}





open(c:string){

this.router.navigate(
['/catalog'],
{
queryParams:{
category:c
}
}
);

}



}