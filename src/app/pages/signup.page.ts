import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController, LoadingController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    IonicModule,
    FormsModule
  ],
  template: `
  <ion-content>

    <div class="auth-shell" style="justify-content:flex-start">

      <div class="logo">
        <span class="logo-mark">🦷</span>
        <span>SmileHub</span>
      </div>


      <h1 class="hero-title">
        Create your account
      </h1>


      <p class="muted">
        Join SmileHub and keep your clinic essentials within reach.
      </p>



      <form (ngSubmit)="signup()">



        <ion-item class="input-card" lines="none">

          <ion-input
            label="Full name"
            labelPlacement="stacked"
            [(ngModel)]="fullName"
            name="fullName"
            required>
          </ion-input>

        </ion-item>




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
            label="Mobile number"
            labelPlacement="stacked"
            [(ngModel)]="mobile"
            name="mobile"
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
            (click)="showPassword=!showPassword">


            <ion-icon
              [name]="showPassword ? 'eye-off-outline' : 'eye-outline'">
            </ion-icon>


          </ion-button>


        </ion-item>





        <ion-item class="input-card" lines="none">

          <ion-input
            label="Confirm password"
            labelPlacement="stacked"
            type="password"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            required>
          </ion-input>


        </ion-item>





        <ion-button
          expand="block"
          class="primary-btn"
          type="submit">

          Create Account

        </ion-button>



      </form>




      <div style="text-align:center;margin-top:16px">

        Already have an account?

        <a
          (click)="router.navigate(['/login'])"
          style="color:#0f839a;font-weight:800;cursor:pointer">

          Sign in

        </a>


      </div>



    </div>

  </ion-content>
  `
})
export class SignupPage {


fullName = '';
email = '';
mobile = '';
password = '';
confirmPassword = '';
showPassword = false;



constructor(
  private auth: AuthService,
  public router: Router,
  private alerts: AlertController,
  private loading: LoadingController
){}



async signup(){


if(
!this.fullName.trim() ||
!this.email.trim() ||
!this.mobile.trim() ||
!this.password
){

return this.message(
'Complete all required fields.'
);

}



if(this.password.length < 6){

return this.message(
'Password must be at least 6 characters.'
);

}



if(this.password !== this.confirmPassword){

return this.message(
'Passwords do not match.'
);

}



const load =
await this.loading.create({
message:'Creating account...'
});


await load.present();




try{


await this.auth.signUp(
this.fullName,
this.email,
this.mobile,
this.password
);



await this.router.navigateByUrl(
'/home',
{
replaceUrl:true
}
);



}catch(e:any){


await this.message(
this.errorMessage(e?.code)
);



}finally{


await load.dismiss();


}



}




private errorMessage(code:string){


if(code==='auth/email-already-in-use')

return 'An account already uses this email.';



if(code==='auth/invalid-email')

return 'Enter a valid email address.';



if(code==='auth/weak-password')

return 'Please use a stronger password.';



return 'Unable to create account.';



}





private async message(message:string){


const a =
await this.alerts.create({

header:'SmileHub',

message,

buttons:['OK']

});


await a.present();


}


}