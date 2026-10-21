import { Injectable } from '@angular/core';

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User,
  UserCredential
} from 'firebase/auth';

import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

import {
  firebaseAuth,
  firestore
} from './firebase';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  get currentUser(): User | null {

    return firebaseAuth.currentUser;

  }



  /* =========================
     EMAIL SIGN UP
     ========================= */

  async signUp(
    fullName: string,
    email: string,
    mobile: string,
    password: string
  ) {


    const cleanEmail =
      email.trim().toLowerCase();


    const credential =
      await createUserWithEmailAndPassword(
        firebaseAuth,
        cleanEmail,
        password
      );


    const user =
      credential.user;


    await updateProfile(
      user,
      {
        displayName:
          fullName.trim()
      }
    );


    await setDoc(
      doc(
        firestore,
        'users',
        user.uid
      ),
      {

        uid:
          user.uid,

        fullName:
          fullName.trim(),

        email:
          cleanEmail,

        mobile:
          mobile.trim(),

        role:
          'customer',

        authProvider:
          'password',

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp()

      }
    );


    try {


      await setDoc(
        doc(
          firestore,
          'accounts',
          cleanEmail
        ),
        {

          name:
            fullName.trim(),

          email:
            cleanEmail,

          role:
            'customer',

          status:
            'active',

          authProvider:
            'password'

        },
        {
          merge: true
        }
      );


    } catch (_) {

      // Non-fatal mirror.

    }


    return credential;

  }



  /* =========================
     EMAIL SIGN IN
     ========================= */

  async signIn(
    email: string,
    password: string
  ) {


    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      email.trim().toLowerCase(),
      password
    );
    await this.requireMobileCustomer(credential.user);
    return credential;
  }



  /* =========================
     GOOGLE SIGN IN
     ========================= */

  async signInWithGoogle():
    Promise<UserCredential> {


    const provider =
      new GoogleAuthProvider();


    provider.setCustomParameters({
      prompt:
        'select_account'
    });


    const credential =
      await signInWithPopup(
        firebaseAuth,
        provider
      );


    await this.requireMobileCustomer(credential.user, true);
    await this.ensureGoogleUserProfile(
      credential.user
    );


    return credential;

  }



  /* =========================
     GOOGLE USER PROFILE
     ========================= */

  private async ensureGoogleUserProfile(
    user: User
  ):
    Promise<void> {


    const cleanEmail =
      String(
        user.email || ''
      )
        .trim()
        .toLowerCase();


    const cleanName =
      String(
        user.displayName || ''
      )
        .trim()
      ||
      cleanEmail
        .split('@')[0]
      ||
      'SmileHub Customer';


    const userRef =
      doc(
        firestore,
        'users',
        user.uid
      );


    const existingUser =
      await getDoc(
        userRef
      );


    if (
      existingUser.exists()
    ) {


      await setDoc(
        userRef,
        {

          uid:
            user.uid,

          fullName:
            cleanName,

          email:
            cleanEmail,

          photoURL:
            user.photoURL || '',

          authProvider:
            'google',

          updatedAt:
            serverTimestamp()

        },
        {
          merge: true
        }
      );


    } else {


      await setDoc(
        userRef,
        {

          uid:
            user.uid,

          fullName:
            cleanName,

          email:
            cleanEmail,

          mobile:
            '',

          role:
            'customer',

          photoURL:
            user.photoURL || '',

          authProvider:
            'google',

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp()

        }
      );


    }


    // Existing account records belong to the web role-management flow.
    if (cleanEmail) {
      const accountRef = doc(firestore, 'accounts', cleanEmail);
      await runTransaction(firestore, async tx => {
        const existingAccount = await tx.get(accountRef);
        if (!existingAccount.exists()) {
          tx.set(accountRef, {
            name: cleanName, email: cleanEmail, role: 'customer',
            status: 'active', authProvider: 'google'
          });
        }
      });
    }

  }



  async requireMobileCustomer(user: User, allowNew = false): Promise<void> {
    try {
      const email = String(user.email || '').trim().toLowerCase();
      const [profile, account, token] = await Promise.all([
        getDoc(doc(firestore, 'users', user.uid)),
        email ? getDoc(doc(firestore, 'accounts', email)) : Promise.resolve(null),
        user.getIdTokenResult()
      ]);
      const roles = [profile.data()?.['role'], account?.data()?.['role'], token.claims['role']]
        .filter(value => value != null && value !== '')
        .map(value => String(value).trim().toLowerCase());
      const privileged = ['admin', 'staff', 'superadmin'].some(role => token.claims[role] === true);
      const newCustomer = allowNew && !profile.exists() && !account?.exists();
      if (privileged || roles.some(role => role !== 'customer') || (!roles.length && !newCustomer)) {
        throw Object.assign(new Error('Staff and administrators must use the SmileHub web portal.'), {
          code: 'auth/mobile-customer-only'
        });
      }
    } catch (error: any) {
      await signOut(firebaseAuth);
      if (error?.code === 'auth/mobile-customer-only') throw error;
      throw Object.assign(new Error('Unable to verify mobile access. Please try again.'), {
        code: 'auth/mobile-access-unavailable'
      });
    }
  }

  /* =========================
     RESET PASSWORD
     ========================= */

  resetPassword(
    email: string
  ) {


    return sendPasswordResetEmail(
      firebaseAuth,
      email.trim().toLowerCase()
    );

  }



  /* =========================
     SIGN OUT
     ========================= */

  signOut() {

    return signOut(
      firebaseAuth
    );

  }


}
