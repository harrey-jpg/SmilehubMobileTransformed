import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { firebaseAuth } from '../services/firebase';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ],
  template: `
  <ion-content>
    <div class="auth-shell">

      <div class="logo">
        <span class="logo-mark">🦷</span>
        <span>SmileHub</span>
      </div>

      <h1 class="hero-title">Welcome back</h1>

      <p class="muted">
        Sign in to continue shopping dental supplies.
      </p>

      <form (ngSubmit)="login()">

        <ion-item class="input-card" lines="none">
          <ion-input
            label="Email"
            labelPlacement="stacked"
            type="email"
            [(ngModel)]="email"
            name="email"
            required>
          </ion-input>
        </ion-item>


        <ion-item class="input-card" lines="none">

          <ion-input
            label="Password"
            labelPlacement="stacked"
            [type]="showPassword ? 'text' : 'password'"
            [(ngModel)]="password"
            name="password"
            required>
          </ion-input>

          <ion-button
            slot="end"
            fill="clear"
            type="button"
            (click)="showPassword = !showPassword">

            <ion-icon
              [name]="showPassword ? 'eye-off-outline' : 'eye-outline'">
            </ion-icon>

          </ion-button>

        </ion-item>


        <ion-button
          expand="block"
          class="primary-btn"
          type="submit">

          Sign In

        </ion-button>


      </form>


      <div style="text-align:center;margin-top:16px">

        New to SmileHub?

        <a
          (click)="router.navigate(['/signup'])"
          style="color:#0f839a;font-weight:800;cursor:pointer">

          Create account

        </a>

      </div>


    </div>
  </ion-content>
  `
})
export class LoginPage {

  email = '';
  password = '';
  showPassword = false;


  constructor(
    private auth: AuthService,
    public router: Router,
    private alerts: AlertController,
    private loading: LoadingController
  ) {}


  ionViewWillEnter() {
    // Already signed in (restored session) — skip login.
    if (firebaseAuth.currentUser) {
      this.router.navigateByUrl('/home', { replaceUrl: true }).catch(() => {});
    }
  }


  async login() {

    if (!this.email || !this.password) {
      return this.message(
        'Please enter your email and password.'
      );
    }


    const load = await this.loading.create({
      message: 'Signing in...'
    });


    await load.present();


    try {

      await this.auth.signIn(
        this.email,
        this.password
      );


      await this.router.navigateByUrl(
        '/home',
        {
          replaceUrl: true
        }
      );


    } catch (e:any) {

      await this.message(
        this.authError(e?.code)
      );


    } finally {

      await load.dismiss();

    }

  }



  private authError(code:string) {

    if (code === 'auth/invalid-email')
      return 'Enter a valid email address.';


    if (code === 'auth/user-disabled')
      return 'This account has been disabled.';


    if (code === 'auth/too-many-requests')
      return 'Too many attempts. Please try again later.';


    return 'Incorrect email or password.';

  }



  private async message(message:string) {

    const a = await this.alerts.create({

      header: 'SmileHub',

      message,

      buttons: ['OK']

    });


    await a.present();

  }

}