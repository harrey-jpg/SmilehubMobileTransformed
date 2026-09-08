import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { firestore, firebaseAuth } from './firebase';
import { ShippingAddress } from '../models/product';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private requireUser() {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('You must log in first.');
    return user;
  }

  private addressesCollection() {
    const user = this.requireUser();
    return collection(firestore, 'users', user.uid, 'addresses');
  }

  async listAddresses(): Promise<ShippingAddress[]> {
    const snap = await getDocs(this.addressesCollection());
    return snap.docs.map(d => ({ addressId: d.id, ...(d.data() as any) } as ShippingAddress));
  }

  async addAddress(address: ShippingAddress) {
    const col = this.addressesCollection();
    const existing = await getDocs(col);
    const makeDefault = !!address.isDefault || existing.empty;
    const batch = writeBatch(firestore);
    if (makeDefault) existing.docs.forEach(d => batch.set(d.ref, { isDefault: false }, { merge: true }));
    const ref = doc(col);
    const fullAddress = `${address.street.trim()}, ${address.barangay.trim()}, ${address.city.trim()} ${address.postalCode.trim()}`;
    batch.set(ref, {
      ...address,
      addressId: ref.id,
      fullAddress,
      isDefault: makeDefault,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    await batch.commit();
  }

  async updateAddress(addressId: string, address: ShippingAddress) {
    const col = this.addressesCollection();
    const ref = doc(col, addressId);
    const current = await getDoc(ref);
    if (!current.exists()) throw new Error('Address not found.');
    const all = await getDocs(col);
    const wasDefault = current.data()['isDefault'] === true;
    const anotherDefault = all.docs.some(d => d.id !== addressId && d.data()['isDefault'] === true);
    const makeDefault = !!address.isDefault || all.docs.length === 1 || (wasDefault && !anotherDefault);
    const batch = writeBatch(firestore);
    if (makeDefault) all.docs.forEach(d => { if (d.id !== addressId) batch.set(d.ref, { isDefault: false }, { merge: true }); });
    batch.set(ref, {
      ...address,
      fullAddress: `${address.street.trim()}, ${address.barangay.trim()}, ${address.city.trim()} ${address.postalCode.trim()}`,
      isDefault: makeDefault,
      updatedAt: serverTimestamp()
    }, { merge: true });
    await batch.commit();
  }

  async deleteAddress(addressId: string) {
    const col = this.addressesCollection();
    const ref = doc(col, addressId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const wasDefault = snap.data()['isDefault'] === true;
    await deleteDoc(ref);
    if (wasDefault) {
      const remaining = await getDocs(col);
      if (!remaining.empty) await setDoc(remaining.docs[0].ref, { isDefault: true, updatedAt: serverTimestamp() }, { merge: true });
    }
  }

  async getDefaultAddress(): Promise<ShippingAddress | null> {
    const list = await this.listAddresses();
    if (!list.length) return null;
    return list.find(a => a.isDefault) || list[0];
  }
}
