import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from './auth.service';
import { firebaseAuth } from './firebase';

export const mobileAccessGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const alerts = inject(AlertController);
  await firebaseAuth.authStateReady();
  const user = firebaseAuth.currentUser;
  if (!user) return true;
  try {
    await auth.requireMobileCustomer(user);
    return true;
  } catch (error: any) {
    const alert = await alerts.create({
      header: 'Mobile account access', message: error.message, buttons: ['OK']
    });
    await alert.present();
    return router.createUrlTree(['/login']);
  }
};
