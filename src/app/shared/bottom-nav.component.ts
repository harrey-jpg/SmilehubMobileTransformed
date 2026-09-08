import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AppStateService } from '../services/app-state.service';


@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [
    RouterModule,
    IonicModule,
    CommonModule
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
    class="nav-item nav-badge-wrap"
    [class.active]="active==='cart'"
    routerLink="/cart">

    <ion-icon
      class="nav-icon"
      name="cart-outline">
    </ion-icon>

    <span class="nav-badge" *ngIf="state.cartCount > 0">{{badgeText(state.cartCount)}}</span>

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

  constructor(public state: AppStateService) {}

  badgeText(n: number): string {
    return n > 99 ? '99+' : String(n);
  }

}
