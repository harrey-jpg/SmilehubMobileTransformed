import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [
    IonicModule
  ],
  template: `

<div class="bottom-nav">

  <div 
    class="nav-item"
    [class.active]="active==='home'"
    routerLink="/home">

    <ion-icon 
      class="nav-icon"
      name="home-outline">
    </ion-icon>

    <span>
      Home
    </span>

  </div>



  <div 
    class="nav-item"
    [class.active]="active==='categories'"
    routerLink="/categories">

    <ion-icon
      class="nav-icon"
      name="grid-outline">
    </ion-icon>

    <span>
      Categories
    </span>

  </div>



  <div 
    class="nav-item"
    [class.active]="active==='cart'"
    routerLink="/cart">

    <ion-icon
      class="nav-icon"
      name="cart-outline">
    </ion-icon>

    <span>
      Cart
    </span>

  </div>




  <div 
    class="nav-item"
    [class.active]="active==='account'"
    routerLink="/account">

    <ion-icon
      class="nav-icon"
      name="person-outline">
    </ion-icon>

    <span>
      Account
    </span>

  </div>


</div>

`
})
export class BottomNavComponent {

  @Input()
  active = '';

}