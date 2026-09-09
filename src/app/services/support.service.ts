import { Injectable } from '@angular/core';

import {
  collection,
  doc,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';

import {
  firebaseAuth,
  firestore
} from './firebase';


export interface SupportConcernPayload {
  concern: string;
  message: string;
}


@Injectable({
  providedIn: 'root'
})
export class SupportService {

  private requireUser() {

    const user = firebaseAuth.currentUser;

    if (!user) {
      throw new Error('You must log in first.');
    }

    return user;
  }


  async submitConcern(
    payload: SupportConcernPayload
  ): Promise<{ messageId: string }> {

    const user = this.requireUser();

    const topic =
      String(payload.concern || '').trim();

    const message =
      String(payload.message || '').trim();


    if (!topic) {
      throw new Error(
        'Please select a concern.'
      );
    }


    if (!message) {
      throw new Error(
        'Please enter your message.'
      );
    }


    if (message.length < 10) {
      throw new Error(
        'Please provide more details about your concern.'
      );
    }


    const ref = doc(
      collection(
        firestore,
        'contact_messages'
      )
    );


    await setDoc(
      ref,
      {
        name:
          user.displayName ||
          'SmileHub Customer',

        email:
          user.email || '',

        topic,

        message,

        status:
          'unread',

        createdAt:
          serverTimestamp()
      }
    );


    return {
      messageId: ref.id
    };
  }
}