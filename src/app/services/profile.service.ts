import { Injectable } from '@angular/core';

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

import {
  updateProfile
} from 'firebase/auth';

import {
  firebaseAuth,
  firestore
} from './firebase';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {


  private requireUser() {

    const user =
      firebaseAuth.currentUser;


    if (!user) {

      throw new Error(
        'No user is currently signed in.'
      );

    }


    return user;

  }



  private mobileToE164(
    mobile: string
  ): string {


    const digits =
      String(
        mobile || ''
      )
        .replace(/\D/g, '');


    if (
      /^09\d{9}$/
        .test(digits)
    ) {


      return (
        '+63'
        +
        digits.substring(1)
      );

    }


    return '';

  }



  async loadProfile() {


    const user =
      this.requireUser();


    const snap =
      await getDoc(

        doc(
          firestore,
          'users',
          user.uid
        )

      );


    const data =
      snap.data() || {};


    const mobile =
      (
        data['mobile']
        ||
        ''
      ).toString();


    const verifiedPhone =
      user.phoneNumber
      ||
      (
        data['verifiedPhoneNumber']
        ||
        ''
      ).toString();


    const phoneVerified =

      !!verifiedPhone

      &&

      this.mobileToE164(mobile)
        === verifiedPhone;


    return {

      fullName:
        (
          data['fullName']
          ||
          user.displayName
          ||
          ''
        ).toString(),

      email:
        (
          user.email
          ||
          data['email']
          ||
          ''
        ).toString(),

      mobile,

      address:
        (
          data['address']
          ||
          ''
        ).toString(),

      clinic:
        (
          data['clinic']
          ||
          ''
        ).toString(),

      buyerType:
        (
          data['buyerType']
          ||
          'Dental Professional'
        ).toString(),

      phoneVerified,

      verifiedPhone

    };

  }



  async saveProfile(
    fullName: string,
    mobile: string,
    address: string,
    clinic: string,
    buyerType: string
  ) {


    const user =
      this.requireUser();


    const cleanMobile =
      mobile.trim();


    const enteredPhone =
      this.mobileToE164(
        cleanMobile
      );


    const phoneVerified =

      !!user.phoneNumber

      &&

      enteredPhone
        === user.phoneNumber;


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
          user.email || '',

        mobile:
          cleanMobile,

        address:
          address.trim(),

        clinic:
          clinic.trim(),

        buyerType,

        phoneVerified,

        updatedAt:
          serverTimestamp()

      },

      {
        merge: true
      }

    );


    await updateProfile(

      user,

      {

        displayName:
          fullName.trim()

      }

    );

  }


}