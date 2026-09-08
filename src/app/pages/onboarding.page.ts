import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { firebaseAuth } from '../services/firebase';


@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [
    IonicModule
  ],
  template: `
  <ion-content [fullscreen]="true">

    <div 
      class="auth-shell" 
      style="justify-content:flex-start;text-align:center">


      <div style="display:flex;justify-content:center;margin-top:12px">

        <div class="logo">

          <span class="logo-mark">
          🦷
          </span>

          <span>
          SmileHub
          </span>

        </div>

      </div>



      <div 
      style="
      flex:1;
      min-height:300px;
      background:#eaf0ff;
      border-radius:26px;
      margin:28px 0 22px;
      display:grid;
      place-items:center">

        <div 
        style="
        width:158px;
        height:158px;
        border-radius:50%;
        background:#ddf5fb;
        display:grid;
        place-items:center;
        font-size:76px">

          🦷

        </div>

      </div>



      <h1 class="hero-title">

        Better supplies for<br>
        brighter smiles.

      </h1>



      <p class="muted">

        Shop trusted dental essentials for clinics, dentists, students, and healthcare teams.

      </p>




      <ion-button

        expand="block"

        class="primary-btn"

        (click)="router.navigate(['/login'])">

        Get Started

      </ion-button>




      <p 
      class="muted" 
      style="font-size:12px">

        Quality checked • Local delivery • Secure checkout

      </p>


    </div>

  </ion-content>
  `
})
export class OnboardingPage {


constructor(
  public router: Router
){}


ionViewWillEnter(){
  // Restored session — skip onboarding entirely.
  if (firebaseAuth.currentUser) {
    this.router.navigateByUrl('/home', { replaceUrl: true }).catch(() => {});
  }
}


}