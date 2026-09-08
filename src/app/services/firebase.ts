import { initializeApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../../environments/environment';

export const firebaseApp = initializeApp(environment.firebase);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

// Keep the user signed in across app restarts (Capacitor WebView uses
// local storage; without this some WebViews fall back to in-memory
// persistence and the session is lost on every relaunch).
setPersistence(firebaseAuth, browserLocalPersistence).catch(() => {});
