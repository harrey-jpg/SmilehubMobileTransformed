import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { onAuthStateChanged } from 'firebase/auth';
import { AppStateService } from './services/app-state.service';
import { firebaseAuth } from './services/firebase';

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
  removeOutline,
  trashOutline,
  chevronForwardOutline,
  logOutOutline,
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
  checkmarkCircleOutline,
  starOutline,
  closeOutline,
  eyeOutline,
  eyeOffOutline,
  createOutline,
  addCircleOutline,
  reorderFourOutline,
  shieldCheckmarkOutline,
  bicycleOutline,
  lockClosedOutline,
  callOutline,
  mailOutline,
  informationCircleOutline
} from 'ionicons/icons';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonicModule
  ],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `
})
export class AppComponent implements OnInit {

  constructor(
    private state: AppStateService,
    private router: Router
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
      removeOutline,
      trashOutline,
      chevronForwardOutline,
      logOutOutline,
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
      checkmarkCircleOutline,
      starOutline,
      closeOutline,
      eyeOutline,
      eyeOffOutline,
      createOutline,
      addCircleOutline,
      reorderFourOutline,
      shieldCheckmarkOutline,
      bicycleOutline,
      lockClosedOutline,
      callOutline,
      mailOutline,
      informationCircleOutline

    });

  }

  ngOnInit() {
    // Pull the shared catalog from Firestore (falls back to bundled data).
    this.state.loadProductsFromFirestore();
    // Stay logged in: when Firebase restores a session, skip the
    // onboarding/login screens and go straight to the shop.
    onAuthStateChanged(firebaseAuth, user => {
      if (!user) return;
      const url = this.router.url;
      if (url === '/' || url.startsWith('/login') || url.startsWith('/signup')) {
        this.router.navigateByUrl('/home', { replaceUrl: true }).catch(() => {});
      }
    });
  }

}