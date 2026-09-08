import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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

  <ion-button
    fill="clear"
    class="nav-item"
    [class.active]="active==='home'"
    (click)="go('/home')">

    <span class="nav-inner">
      <ion-icon class="nav-icon" name="home-outline"></ion-icon>
      <span>Home</span>
    </span>

  </ion-button>



  <ion-button
    fill="clear"
    class="nav-item"
    [class.active]="active==='categories'"
    (click)="go('/categories')">

    <span class="nav-inner">
      <ion-icon class="nav-icon" name="grid-outline"></ion-icon>
      <span>Categories</span>
    </span>

  </ion-button>



  <ion-button
    fill="clear"
    class="nav-item nav-badge-wrap"
    [class.active]="active==='cart'"
    (click)="go('/cart')">

    <span class="nav-inner">
      <ion-icon class="nav-icon" name="cart-outline"></ion-icon>
      <span class="nav-badge" *ngIf="state.cartCount > 0">{{badgeText(state.cartCount)}}</span>
      <span>Cart</span>
    </span>

  </ion-button>




  <ion-button
    fill="clear"
    class="nav-item"
    [class.active]="active==='account'"
    (click)="go('/account')">

    <span class="nav-inner">
      <ion-icon class="nav-icon" name="person-outline"></ion-icon>
      <span>Account</span>
    </span>

  </ion-button>


</div>

`
})
export class BottomNavComponent {

  @Input()
  active = '';

  constructor(
    public state: AppStateService,
    private router: Router
  ) {}

  go(path: string) {
    if (this.router.url === path) return;
    this.router.navigateByUrl(path).catch(() => {});
  }

  badgeText(n: number): string {
    return n > 99 ? '99+' : String(n);
  }

}
