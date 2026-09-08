import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { firebaseAuth, firestore } from './firebase';

@Injectable({ providedIn: 'root' })
export class OrderService {
  async placeOrder(payload: any) {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('You must log in before placing an order.');
    if (!payload.items?.length) throw new Error('Your cart is empty.');
    const ref = doc(collection(firestore, 'orders'));
    const orderNumber = `SH-${ref.id.substring(0, 8).toUpperCase()}`;
    await setDoc(ref, {
      orderId: ref.id,
      orderNumber,
      userId: user.uid,
      customerEmail: user.email || '',
      ...payload,
      itemCount: payload.items.reduce((sum: number, item: any) => sum + Number(item.quantity || 0), 0),
      status: 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { orderId: ref.id, orderNumber };
  }

  async listMyOrders(): Promise<any[]> {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('You must log in first.');
    const snap = await getDocs(query(collection(firestore, 'orders'), where('userId', '==', user.uid)));
    return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => {
      const at = a.createdAt?.toMillis?.() || 0; const bt = b.createdAt?.toMillis?.() || 0; return bt - at;
    });
  }

  async getOrder(orderId: string): Promise<any | null> {
    const snap = await getDoc(doc(firestore, 'orders', orderId));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }

  watchMyOrders(): Observable<any[]> {
    return new Observable(subscriber => {
      const user = firebaseAuth.currentUser;
      if (!user) {
        subscriber.error(new Error('You must log in first.'));
        return;
      }
      const q = query(collection(firestore, 'orders'), where('userId', '==', user.uid));
      const unsub = onSnapshot(q,
        snap => {
          const orders = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => {
            const at = a.createdAt?.toMillis?.() || 0; const bt = b.createdAt?.toMillis?.() || 0; return bt - at;
          });
          subscriber.next(orders);
        },
        err => subscriber.error(err));
      return unsub;
    });
  }

  watchOrder(orderId: string): Observable<any | null> {
    return new Observable(subscriber => {
      const unsub = onSnapshot(doc(firestore, 'orders', orderId),
        snap => subscriber.next(snap.exists() ? { id: snap.id, ...snap.data() } : null),
        err => subscriber.error(err));
      return unsub;
    });
  }
}
