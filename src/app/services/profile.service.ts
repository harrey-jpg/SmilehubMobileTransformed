import { Injectable } from '@angular/core';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { firebaseAuth, firestore } from './firebase';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private requireUser() {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('No user is currently signed in.');
    return user;
  }

  async loadProfile() {
    const user = this.requireUser();
    const snap = await getDoc(doc(firestore, 'users', user.uid));
    const data = snap.data() || {};
    return {
      fullName: (data['fullName'] || user.displayName || '').toString(),
      email: (user.email || data['email'] || '').toString(),
      mobile: (data['mobile'] || '').toString(),
      clinic: (data['clinic'] || '').toString(),
      buyerType: (data['buyerType'] || 'Dental Professional').toString()
    };
  }

  async saveProfile(fullName: string, mobile: string, clinic: string, buyerType: string) {
    const user = this.requireUser();
    await setDoc(doc(firestore, 'users', user.uid), {
      uid: user.uid,
      fullName: fullName.trim(),
      email: user.email || '',
      mobile: mobile.trim(),
      clinic: clinic.trim(),
      buyerType,
      updatedAt: serverTimestamp()
    }, { merge: true });
    await updateProfile(user, { displayName: fullName.trim() });
  }
}
