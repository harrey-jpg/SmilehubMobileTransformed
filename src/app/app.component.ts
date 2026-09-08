import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';

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
export class AppComponent {

  constructor() {

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

}