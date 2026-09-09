import { Injectable } from '@angular/core';

import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  linkWithCredential,
  updatePhoneNumber
} from 'firebase/auth';

import {
  doc,
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
export class PhoneAuthService {


  private recaptchaVerifier:
    RecaptchaVerifier | null = null;


  private verificationId:
    string | null = null;


  private pendingPhone:
    string | null = null;



  /* =========================
     CURRENT USER
     ========================= */

  private requireUser() {

    const user =
      firebaseAuth.currentUser;


    if (!user) {

      throw new Error(
        'You must log in first.'
      );

    }


    return user;

  }



  /* =========================
     PH NUMBER → E.164
     ========================= */

  toE164(
    mobile: string
  ): string {


    const digits =
      String(
        mobile || ''
      )
        .replace(/\D/g, '');


    /*
     * 09939609554
     */

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


    /*
     * 639939609554
     */

    if (
      /^639\d{9}$/
        .test(digits)
    ) {


      return (
        '+'
        +
        digits
      );

    }


    throw new Error(
      'Enter a valid Philippine mobile number.'
    );

  }



  /* =========================
     E.164 → LOCAL
     ========================= */

  toLocal(
    phone: string
  ): string {


    if (
      phone.startsWith('+63')
    ) {


      return (
        '0'
        +
        phone.substring(3)
      );

    }


    return phone;

  }



  /* =========================
     SEND OTP
     ========================= */

  async sendOtp(
    mobile: string
  ):
    Promise<{
      alreadyVerified: boolean;
      phone: string;
    }> {


    const user =
      this.requireUser();


    const phone =
      this.toE164(mobile);



    /*
     * Already linked to the same
     * Firebase account.
     */

    if (
      user.phoneNumber === phone
    ) {


      await this.saveVerifiedPhone(
        phone
      );


      return {

        alreadyVerified:
          true,

        phone

      };

    }



    this.clearVerifier();



    const container =
      document.getElementById(
        'recaptcha-container'
      );


    if (!container) {

      throw new Error(
        'Phone verification is not ready. Please try again.'
      );

    }



    /*
     * IMPORTANT:
     * Keep Firebase app verification enabled.
     *
     * For local fictional-number testing only,
     * Firebase also supports:
     *
     * firebaseAuth.settings
     *   .appVerificationDisabledForTesting = true;
     *
     * Do NOT enable that in production.
     */


    this.recaptchaVerifier =
      new RecaptchaVerifier(

        firebaseAuth,

        'recaptcha-container',

        {

          size:
            'invisible'

        }

      );



    await this.recaptchaVerifier
      .render();



    const provider =
      new PhoneAuthProvider(
        firebaseAuth
      );



    try {


      this.verificationId =
        await provider
          .verifyPhoneNumber(

            phone,

            this.recaptchaVerifier

          );


      this.pendingPhone =
        phone;


      return {

        alreadyVerified:
          false,

        phone

      };


    } catch (error) {


      this.clearVerifier();


      throw error;

    }

  }



  /* =========================
     VERIFY OTP
     ========================= */

  async verifyOtp(
    code: string
  ): Promise<void> {


    const user =
      this.requireUser();


    const cleanCode =
      String(
        code || ''
      )
        .replace(/\D/g, '');


    if (
      !/^\d{6}$/
        .test(cleanCode)
    ) {


      throw new Error(
        'Enter the 6-digit verification code.'
      );

    }


    if (
      !this.verificationId
      ||
      !this.pendingPhone
    ) {


      throw new Error(
        'Send a verification code first.'
      );

    }



    const credential =
      PhoneAuthProvider
        .credential(

          this.verificationId,

          cleanCode

        );



    /*
     * User already has a different
     * linked phone → update it.
     *
     * No phone yet → link phone
     * credential to existing
     * email/password account.
     */

    if (user.phoneNumber) {


      await updatePhoneNumber(
        user,
        credential
      );


    } else {


      await linkWithCredential(
        user,
        credential
      );

    }



    await this.saveVerifiedPhone(
      this.pendingPhone
    );


    this.clearVerifier();

  }



  /* =========================
     FIRESTORE
     ========================= */

  private async saveVerifiedPhone(
    phone: string
  ): Promise<void> {


    const user =
      this.requireUser();


    await setDoc(

      doc(
        firestore,
        'users',
        user.uid
      ),

      {

        mobile:
          this.toLocal(phone),

        phoneVerified:
          true,

        verifiedPhoneNumber:
          phone,

        phoneVerifiedAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp()

      },

      {
        merge: true
      }

    );

  }



  /* =========================
     CHECK
     ========================= */

  isVerified(
    mobile: string
  ): boolean {


    try {


      const user =
        firebaseAuth.currentUser;


      if (!user?.phoneNumber) {

        return false;

      }


      return (
        user.phoneNumber
        ===
        this.toE164(mobile)
      );


    } catch {


      return false;

    }

  }



  /* =========================
     CLEANUP
     ========================= */

  reset():
    void {


    this.verificationId =
      null;


    this.pendingPhone =
      null;


    this.clearVerifier();

  }



  private clearVerifier():
    void {


    if (
      this.recaptchaVerifier
    ) {


      try {

        this.recaptchaVerifier
          .clear();

      } catch {}


      this.recaptchaVerifier =
        null;

    }



    const container =
      document.getElementById(
        'recaptcha-container'
      );


    if (container) {

      container.innerHTML =
        '';

    }

  }


}