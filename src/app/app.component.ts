import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  addIcons
} from 'ionicons';

import {
  onAuthStateChanged
} from 'firebase/auth';

import {
  AppStateService
} from './services/app-state.service';

import {
  firebaseAuth
} from './services/firebase';


import {

  homeOutline,
  gridOutline,
  cartOutline,
  personOutline,

  heart,
  heartOutline,

  searchOutline,
  medicalOutline,

  addOutline,
  addCircleOutline,
  removeOutline,

  trashOutline,

  chevronForwardOutline,

  logOutOutline,
  logInOutline,

  moonOutline,
  sunnyOutline,

  locationOutline,

  walletOutline,
  cardOutline,
  cashOutline,

  helpCircleOutline,
  headsetOutline,

  bagCheckOutline,

  arrowBackOutline,

  checkmarkOutline,
  checkmarkCircleOutline,
  checkmarkCircle,

  starOutline,

  closeOutline,

  eyeOutline,
  eyeOffOutline,

  createOutline,

  reorderFourOutline,

  shieldCheckmarkOutline,

  bicycleOutline,

  lockClosedOutline,

  callOutline,
  mailOutline,

  informationCircleOutline,

  sendOutline,

  personAddOutline,

  phonePortraitOutline,

  chatbubbleEllipsesOutline,

  receiptOutline,

  notificationsOutline

} from 'ionicons/icons';


@Component({

  selector: 'app-root',

  standalone: false,

  template: `

    <ion-app>

      <ion-router-outlet>
      </ion-router-outlet>

    </ion-app>

  `

})
export class AppComponent implements OnInit {


  constructor(

    private state:
      AppStateService,

    private router:
      Router

  ) {


    addIcons({


      homeOutline,

      gridOutline,

      cartOutline,

      personOutline,

      heart,

      heartOutline,

      searchOutline,

      medicalOutline,

      addOutline,

      addCircleOutline,

      removeOutline,

      trashOutline,

      chevronForwardOutline,

      logOutOutline,

      logInOutline,

      moonOutline,

      sunnyOutline,

      locationOutline,

      walletOutline,

      cardOutline,

      cashOutline,

      helpCircleOutline,

      headsetOutline,

      bagCheckOutline,

      arrowBackOutline,

      checkmarkOutline,

      checkmarkCircleOutline,

      checkmarkCircle,

      starOutline,

      closeOutline,

      eyeOutline,

      eyeOffOutline,

      createOutline,

      reorderFourOutline,

      shieldCheckmarkOutline,

      bicycleOutline,

      lockClosedOutline,

      callOutline,

      mailOutline,

      informationCircleOutline,

      sendOutline,

      personAddOutline,

      phonePortraitOutline,

      chatbubbleEllipsesOutline,

      receiptOutline,

      notificationsOutline

    });


  }



  ngOnInit():
    void {


    /*
     * AppStateService is injected above,
     * so its constructor already loads
     * the Firestore product catalog.
     *
     * Do not call loadProductsFromFirestore()
     * again here.
     */


    /*
     * Restore Firebase login session.
     */

    onAuthStateChanged(

      firebaseAuth,

      user => {


        if (!user) {

          return;

        }


        const url =
          this.router.url;


        if (

          url === '/'

          ||

          url.startsWith('/login')

          ||

          url.startsWith('/signup')

        ) {


          this.router
            .navigateByUrl(

              '/home',

              {
                replaceUrl: true
              }

            )
            .catch(
              () => {}
            );

        }

      }

    );

  }


}