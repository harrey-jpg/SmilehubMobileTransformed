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

  signIn(
    email: string,
    password: string
  ) {


    return signInWithEmailAndPassword(
      firebaseAuth,
      email.trim().toLowerCase(),
      password
    );

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


    if (
      cleanEmail
    ) {


      try {


        await setDoc(
          doc(
            firestore,
            'accounts',
            cleanEmail
          ),
          {

            name:
              cleanName,

            email:
              cleanEmail,

            role:
              'customer',

            status:
              'active',

            authProvider:
              'google'

          },
          {
            merge: true
          }
        );


      } catch (_) {

        // Non-fatal mirror.

      }


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
