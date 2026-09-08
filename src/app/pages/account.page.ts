import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { AppStateService } from '../services/app-state.service';
import { BottomNavComponent } from '../shared/bottom-nav.component';


@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    RouterModule,
    IonicModule,
    CommonModule,
    BottomNavComponent
  ],
  template: `

<ion-header>
  <ion-toolbar>
    <ion-title>Account</ion-title>
  </ion-toolbar>
</ion-header>


<ion-content>

<div class="page-wrap">


  <div class="app-card row">

    <div 
      class="category-icon"
      style="width:64px;height:64px;font-size:30px">
      👤
    </div>

    <div>
      <h2 style="margin:0">
        {{profile.fullName || 'SmileHub Customer'}}
      </h2>

      <div class="muted">
        {{profile.email}}
      </div>

    </div>

  </div>



  <div class="section-row">
    <h2>My Account</h2>
  </div>


  <div class="list-stack">


    <div 
      class="app-card row-between card-button"
      routerLink="/personal-information">

      <span>👤 Personal Information</span>

      <ion-icon name="chevron-forward-outline"></ion-icon>

    </div>



    <div 
      class="app-card row-between card-button"
      routerLink="/orders">

      <span>📦 My Orders</span>

      <ion-icon name="chevron-forward-outline"></ion-icon>

    </div>



    <div 
      class="app-card row-between card-button"
      routerLink="/addresses">

      <span>📍 Addresses</span>

      <ion-icon name="chevron-forward-outline"></ion-icon>

    </div>



    <div 
      class="app-card row-between card-button"
      routerLink="/payments">

      <span>💳 Payment Methods</span>

      <ion-icon name="chevron-forward-outline"></ion-icon>

    </div>



    <div 
      class="app-card row-between card-button"
      routerLink="/wishlist">

      <span>♡ Wishlist</span>

      <ion-icon name="chevron-forward-outline"></ion-icon>

    </div>


  </div>



  <div class="section-row">
    <h2>Settings & Support</h2>
  </div>



  <div class="list-stack">


    <div class="app-card row-between">

      <span>
        {{state.darkMode?'🌙':'☀️'}} Dark Mode
      </span>


      <ion-toggle
        [checked]="state.darkMode"
        (ionChange)="state.toggleTheme($event.detail.checked)">
      </ion-toggle>


    </div>



    <div 
      class="app-card row-between card-button"
      routerLink="/help">

      <span>❓ Help & Support</span>

      <ion-icon name="chevron-forward-outline"></ion-icon>

    </div>



    <div 
      class="app-card row-between card-button"
      routerLink="/contact-support">

      <span>🎧 Contact Support</span>

      <ion-icon name="chevron-forward-outline"></ion-icon>

    </div>


  </div>



  <ion-button
    expand="block"
    fill="outline"
    color="danger"
    class="outline-btn"
    style="margin-top:20px"
    (click)="logout()">


    <ion-icon
      name="log-out-outline"
      slot="start">
    </ion-icon>


    Sign Out


  </ion-button>



</div>


</ion-content>

<ion-footer>
<app-bottom-nav active="account"></app-bottom-nav>
</ion-footer>

`
})
export class AccountPage {


  profile:any = {};


  constructor(
    private auth: AuthService,
    private profiles: ProfileService,
    public state: AppStateService,
    private router: Router,
    private alerts: AlertController
  ){}



  async ionViewWillEnter(){

    try{

      this.profile = await this.profiles.loadProfile();

    }
    catch(_){

      this.profile = {
        email: this.auth.currentUser?.email || ''
      };

    }

  }



  async logout(){

    const a = await this.alerts.create({

      header:'Sign out?',

      message:'You can sign in again anytime.',

      buttons:[

        {
          text:'Cancel',
          role:'cancel'
        },

        {
          text:'Sign Out',
          role:'destructive',

          handler:async()=>{

            await this.auth.signOut();

            this.router.navigateByUrl(
              '/login',
              {
                replaceUrl:true
              }
            );

          }

        }

      ]

    });


    await a.present();

  }


}