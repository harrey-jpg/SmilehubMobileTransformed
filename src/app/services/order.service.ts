import { getFunctions, httpsCallable } from 'firebase/functions';
import { firebaseApp } from './firebase';
import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';

import {
  firebaseAuth,
  firestore
} from './firebase';



@Injectable({
  providedIn: 'root'
})
export class OrderService {



  /* =========================
     PLACE ORDER
     ========================= */

  private pendingRequest?: { fingerprint: string; id: string };

  async placeOrder(payload: any): Promise<{ orderId: string; orderNumber: string }> {
    const user = firebaseAuth.currentUser;
    if (!user) throw new Error('You must log in before placing an order.');
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify({ uid: user.uid, payload })));
    const fingerprint = Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
    const storageKey = `smilehubPendingOrder:${user.uid}`;
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (saved?.fingerprint === fingerprint && typeof saved.id === 'string') this.pendingRequest = saved;
    } catch { /* A corrupt local retry record is not an order. */ }
    if (this.pendingRequest?.fingerprint !== fingerprint) this.pendingRequest = { fingerprint, id: crypto.randomUUID() };
    try { localStorage.setItem(storageKey, JSON.stringify(this.pendingRequest)); } catch { /* In-memory retry protection still applies. */ }
    if (firebaseAuth.currentUser?.uid !== user.uid) throw new Error('Your account changed. Please reopen checkout.');
    const place = httpsCallable<any, { orderId: string; orderNumber: string }>(getFunctions(firebaseApp, 'us-central1'), 'mobilePlaceOrder');
    const response = await place({ ...payload, requestId: this.pendingRequest!.id });
    this.pendingRequest = undefined;
    try { localStorage.removeItem(storageKey); } catch { /* Successful retries remain idempotent on the server. */ }
    return response.data;
  }

  async cancelOrder(orderId: string, reason = 'Changed my mind'): Promise<void> {
    if (!firebaseAuth.currentUser) throw new Error('You must log in first.');
    const cancel = httpsCallable(getFunctions(firebaseApp, 'us-central1'), 'mobileCancelOrder');
    await cancel({ orderId, reason });
  }

  canCancelStatus(
    status: string
  ):
    boolean {


    return [

      'Pending',

      'Processing'

    ]
      .includes(
        String(
          status || ''
        )
          .trim()
      );

  }



  /* =========================
     UPDATE ORDER STATUS
     ========================= */

  async updateOrderStatus(

    orderId: string,

    status: string

  ):
    Promise<void> {


    const cleanStatus =
      this.normalizeOrderStatus(
        status
      );


    if (
      ![
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
      ].includes(
        cleanStatus
      )
    ) {


      throw new Error(
        'Invalid order status.'
      );


    }


    const orderRef =
      doc(
        firestore,
        'orders',
        orderId
      );


    const before =
      await getDoc(
        orderRef
      );


    await updateDoc(

      orderRef,

      {

        status:
          cleanStatus,

        statusHistory:

          arrayUnion({

            status:
              cleanStatus,

            createdAt:
              new Date()

          }),

        updatedAt:
          serverTimestamp()

      }

    );



    /*
     * Notify customer after admin/status update.
     */

    if (
      before.exists()
    ) {


      const orderData =
        before.data();


      const userId =
        String(
          orderData['userId'] || ''
        );


      const orderNumber =
        String(
          orderData['orderNumber']
          ||
          orderId
        );


      if (
        userId
      ) {


        const notification =
          this.statusNotification(
            cleanStatus,
            orderNumber
          );


        await this.createNotificationSafe({

          userId,

          title:
            notification.title,

          message:
            notification.message,

          type:
            cleanStatus === 'Cancelled'
              ? 'order_cancelled'
              : 'order_status',

          orderId,

          orderNumber

        });

      }

    }

  }



  /* =========================
     NORMALIZE ORDER STATUS
     ========================= */

  private normalizeOrderStatus(
    status: string
  ):
    string {


    const cleanStatus =
      String(
        status || ''
      )
        .trim();


    if (
      cleanStatus === 'Packed'
      ||
      cleanStatus === 'Out for Delivery'
    ) {


      return 'Shipped';


    }


    return cleanStatus;


  }



  /* =========================
     STATUS NOTIFICATION TEXT
     ========================= */

  private statusNotification(
    status: string,
    orderNumber: string
  ):
    {
      title: string;
      message: string;
    } {


    switch (
      status
    ) {


      case 'Processing':

        return {

          title:
            'Order Processing',

          message:
            `Your order ${orderNumber} is now being processed.`

        };


      case 'Shipped':

        return {

          title:
            'Order Shipped',

          message:
            `Your order ${orderNumber} has been shipped.`

        };


      case 'Delivered':

        return {

          title:
            'Order Delivered',

          message:
            `Your order ${orderNumber} has been delivered.`

        };


      case 'Cancelled':

        return {

          title:
            'Order Cancelled',

          message:
            `Your order ${orderNumber} has been cancelled.`

        };


      default:

        return {

          title:
            'Order Updated',

          message:
            `Your order ${orderNumber} is now ${status}.`

        };

    }

  }



  /* =========================
     CREATE NOTIFICATION
     ========================= */

  private async createNotificationSafe(
    payload: {
      userId: string;
      title: string;
      message: string;
      type: string;
      orderId?: string;
      orderNumber?: string;
    }
  ):
    Promise<void> {


    try {


      const notificationRef =
        doc(
          collection(
            firestore,
            'notifications'
          )
        );


      await setDoc(

        notificationRef,

        {

          notificationId:
            notificationRef.id,

          userId:
            payload.userId,

          title:
            payload.title,

          message:
            payload.message,

          type:
            payload.type,

          orderId:
            payload.orderId || '',

          orderNumber:
            payload.orderNumber || '',

          read:
            false,

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp()

        }

      );


    } catch (
      error
    ) {


      /*
       * Notifications should not break
       * an otherwise successful order action.
       */

      console.error(
        'Unable to create notification:',
        error
      );

    }

  }



  /* =========================
     LIST MY ORDERS
     ========================= */

  async listMyOrders():
    Promise<any[]> {


    const user =
      firebaseAuth.currentUser;


    if (!user) {

      throw new Error(
        'You must log in first.'
      );

    }


    const snap =
      await getDocs(

        query(

          collection(
            firestore,
            'orders'
          ),

          where(
            'userId',
            '==',
            user.uid
          )

        )

      );


    return snap.docs

      .map(

        d => ({

          id:
            d.id,

          ...d.data()

        })

      )

      .sort(

        (
          a: any,
          b: any
        ) => {


          const at =
            a.createdAt
              ?.toMillis?.()
            ||
            0;


          const bt =
            b.createdAt
              ?.toMillis?.()
            ||
            0;


          return bt - at;

        }

      );

  }



  /* =========================
     GET ORDER
     ========================= */

  async getOrder(
    orderId: string
  ):
    Promise<any | null> {


    const snap =
      await getDoc(

        doc(
          firestore,
          'orders',
          orderId
        )

      );


    return snap.exists()

      ? {

          id:
            snap.id,

          ...snap.data()

        }

      : null;

  }



  /* =========================
     WATCH MY ORDERS
     ========================= */

  watchMyOrders():
    Observable<any[]> {


    return new Observable(

      subscriber => {


        const user =
          firebaseAuth.currentUser;


        if (!user) {


          subscriber.error(

            new Error(
              'You must log in first.'
            )

          );


          return;

        }


        const q =
          query(

            collection(
              firestore,
              'orders'
            ),

            where(
              'userId',
              '==',
              user.uid
            )

          );


        const unsub =
          onSnapshot(

            q,

            snap => {


              const orders =

                snap.docs

                  .map(

                    d => ({

                      id:
                        d.id,

                      ...d.data()

                    })

                  )

                  .sort(

                    (
                      a: any,
                      b: any
                    ) => {


                      const at =
                        a.createdAt
                          ?.toMillis?.()
                        ||
                        0;


                      const bt =
                        b.createdAt
                          ?.toMillis?.()
                        ||
                        0;


                      return bt - at;

                    }

                  );


              subscriber.next(
                orders
              );

            },


            err =>

              subscriber.error(
                err
              )

          );


        return unsub;

      }

    );

  }



  /* =========================
     WATCH ORDER
     ========================= */

  watchOrder(
    orderId: string
  ):
    Observable<any | null> {


    return new Observable(

      subscriber => {


        const unsub =

          onSnapshot(

            doc(
              firestore,
              'orders',
              orderId
            ),


            snap => {


              subscriber.next(

                snap.exists()

                  ? {

                      id:
                        snap.id,

                      ...snap.data()

                    }

                  : null

              );

            },


            err =>

              subscriber.error(
                err
              )

          );


        return unsub;

      }

    );

  }


}
