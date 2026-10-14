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



  private toLocal(value: string): string {
    const digits = String(value).replace(/\D/g, '');
    return /^639\d{9}$/.test(digits) ? '0' + digits.slice(2) : /^9\d{9}$/.test(digits) ? '0' + digits : digits;
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
        this.toLocal(data['phoneE164'] || data['phone'] || data['mobile'] || '')
      ).toString();


    const verifiedPhone =
      user.phoneNumber
      ||
      (
        data['verifiedPhoneNumber'] || (data['phoneVerified'] ? data['phoneE164'] || data['phone'] : '') || ''
      ).toString();


    const phoneVerified =

      !!verifiedPhone

      &&

      this.mobileToE164(mobile)
        === verifiedPhone;


    return {

      fullName:
        (
          ([data['firstName'], data['lastName']].filter(Boolean).join(' ') || data['fullName'] || data['displayName'])
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
        (data['addressText'] || (typeof data['address'] === 'string' ? data['address'] : [data['address']?.street, data['address']?.barangay, data['address']?.city, data['address']?.province, data['address']?.postal].filter(Boolean).join(', '))),

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


    const existing = (await getDoc(doc(firestore, 'users', user.uid))).data() || {};
    const verifiedPhone = user.phoneNumber || (existing['phoneVerified'] ? existing['phoneE164'] || existing['verifiedPhoneNumber'] : '');
    const phoneVerified = !!verifiedPhone && enteredPhone === verifiedPhone;


    await setDoc(

      doc(
        firestore,
        'users',
        user.uid
      ),

      {

        uid:
          user.uid,

        fullName: fullName.trim(),
        displayName: fullName.trim(),
        firstName: fullName.trim().split(/\s+/)[0] || '',
        lastName: fullName.trim().split(/\s+/).slice(1).join(' '),
        phone: enteredPhone,
        phoneE164: enteredPhone,
        phoneLocal: cleanMobile,

        email:
          user.email || '',

        mobile:
          cleanMobile,

        addressText: address.trim(),

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