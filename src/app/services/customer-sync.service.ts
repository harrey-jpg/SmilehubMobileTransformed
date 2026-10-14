import { Injectable } from '@angular/core';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { PaymentMethodItem } from '../models/product';
import { ToastController } from '@ionic/angular';
import { firebaseAuth, firestore } from './firebase';

export interface SharedListItem {
  id: number;
  name?: string;
  price?: number;
  image?: string;
  quantity?: number;
}
type ListName = 'carts' | 'wishlists';

/** Both storefronts use { userId, items, updatedAt } at collection/{uid}. */
@Injectable({ providedIn: 'root' })
export class CustomerSyncService {
  error = '';
  private uid: string | null = null;
  private generation = 0;
  private stops: Array<() => void> = [];
  private pending: Record<ListName, number> = { carts: 0, wishlists: 0 };
  private latest: Record<ListName, SharedListItem[]> = { carts: [], wishlists: [] };
  private queue: Promise<void> = Promise.resolve();
  constructor(private toast: ToastController) {}

  private failed(message: string, error: any) {
    this.error = message;
    console.warn(message, error);
    void this.toast.create({ message, duration: 4000, color: 'warning' }).then(toast => toast.present());
  }

  connect(receive: (name: ListName, items: SharedListItem[]) => void, receivePayments: (items: PaymentMethodItem[]) => void) {
    onAuthStateChanged(firebaseAuth, user => {
      this.generation++;
      this.stops.forEach(stop => stop());
      this.stops = [];
      this.uid = user?.uid || null;
      this.pending = { carts: 0, wishlists: 0 };
      this.latest = { carts: [], wishlists: [] };
      this.error = '';
      // Never carry a previous customer's local cache into another account.
      receive('carts', []);
      receive('wishlists', []);
      receivePayments([]);
      if (!user) return;
      const uid = user.uid;
      for (const name of ['carts', 'wishlists'] as ListName[]) {
        this.stops.push(onSnapshot(doc(firestore, name, uid), snapshot => {
          if (this.uid !== uid) return;
          this.latest[name] = Array.isArray(snapshot.data()?.['items']) ? snapshot.data()!['items'] : [];
          if (!this.pending[name]) receive(name, this.latest[name]);
        }, error => { this.failed('Unable to sync your shopping lists. Please try again.', error); }));
      }
      this.stops.push(onSnapshot(doc(firestore, 'users', uid), snapshot => {
        if (this.uid !== uid) return;
        const methods = snapshot.data()?.['savedPaymentMethods'];
        receivePayments(Array.isArray(methods) ? methods.filter(method => typeof method.title === 'string' && typeof method.subtitle === 'string' && typeof method.icon === 'string') : []);
      }, error => this.failed('Unable to load saved payment methods.', error)));
    });
    this.receive = receive;
  }

  private receive: (name: ListName, items: SharedListItem[]) => void = () => {};

  change(name: ListName, edit: (items: SharedListItem[]) => SharedListItem[]) {
    const uid = this.uid;
    const generation = this.generation;
    if (!uid) return;
    this.pending[name]++;
    this.queue = this.queue.then(async () => {
      if (this.uid !== uid || this.generation !== generation) return;
      const ref = doc(firestore, name, uid);
      await runTransaction(firestore, async transaction => {
        const snapshot = await transaction.get(ref);
        const items = Array.isArray(snapshot.data()?.['items']) ? snapshot.data()!['items'] : [];
        transaction.set(ref, { userId: uid, items: edit(items), updatedAt: serverTimestamp() }, { merge: true });
      });
      this.error = '';
    }).catch(error => {
      if (this.uid === uid && this.generation === generation) this.failed('Shopping list changes could not be saved. Please try again.', error);
    }).finally(() => {
      if (this.uid !== uid || this.generation !== generation) return;
      this.pending[name]--;
      if (!this.pending[name]) this.receive(name, this.latest[name]);
    });
  }

  savePaymentMethods(methods: PaymentMethodItem[]) {
    const uid = this.uid;
    if (!uid) return;
    const safe = methods.filter(method => !method.isDefault).map(method => ({ title: method.title, subtitle: method.subtitle, icon: method.icon }));
    void setDoc(doc(firestore, 'users', uid), { savedPaymentMethods: safe, updatedAt: serverTimestamp() }, { merge: true })
      .catch(error => this.failed('Payment methods could not be saved.', error));
  }
}
