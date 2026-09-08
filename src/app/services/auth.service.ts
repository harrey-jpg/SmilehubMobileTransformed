import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, User } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseAuth, firestore } from './firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  get currentUser(): User | null { return firebaseAuth.currentUser; }

  async signUp(fullName: string, email: string, mobile: string, password: string) {
    const cleanEmail = email.trim();
    const credential = await createUserWithEmailAndPassword(firebaseAuth, cleanEmail, password);
    const user = credential.user;
    await updateProfile(user, { displayName: fullName.trim() });

    await setDoc(doc(firestore, 'users', user.uid), {
      uid: user.uid,
      fullName: fullName.trim(),
      email: cleanEmail,
      mobile: mobile.trim(),
      role: 'customer',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    try {
      await setDoc(doc(firestore, 'accounts', cleanEmail), {
        name: fullName.trim(), email: cleanEmail, role: 'customer', status: 'active'
      });
    } catch (_) {
      // Non-fatal mirror, matching the Flutter implementation.
    }
    return credential;
  }

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
  }

  signOut() { return signOut(firebaseAuth); }
}
