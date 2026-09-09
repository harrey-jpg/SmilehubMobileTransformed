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
  runTransaction,
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

  async placeOrder(
    payload: any
  ) {


    const user =
      firebaseAuth.currentUser;


    if (!user) {

      throw new Error(
        'You must log in before placing an order.'
      );

    }


    if (
      !payload.items?.length
    ) {

      throw new Error(
        'Your cart is empty.'
      );

    }



    const orderRef =
      doc(
        collection(
          firestore,
          'orders'
        )
      );


    const orderNumber =
      `SH-${orderRef.id.substring(0, 8).toUpperCase()}`;



    /*
     * IMPORTANT:
     * All product reads are transaction reads
     * before any stock/order writes.
     */

    await runTransaction(

      firestore,

      async transaction => {


        const stockUpdates:
          Array<{
            ref: any;
            newStock: number;
          }> = [];


        for (
          const item of payload.items
        ) {


          const productId =
            Number(
              item?.productId
            );


          const requested =
            Number(
              item?.quantity || 0
            );


          if (
            !Number.isFinite(productId)
            ||
            requested <= 0
          ) {

            throw new Error(
              'Invalid product or quantity.'
            );

          }


          /*
           * Product document IDs in SmileHub
           * match the numeric product IDs.
           */

          const productRef =
            doc(
              firestore,
              'products',
              String(productId)
            );


          const productSnapshot =
            await transaction.get(
              productRef
            );


          if (
            !productSnapshot.exists()
          ) {

            throw new Error(
              `${item.name} is no longer available.`
            );

          }


          const productData =
            productSnapshot.data();


          const currentStock =
            Number(
              productData['stock'] ?? 0
            );


          if (
            currentStock < requested
          ) {

            throw new Error(
              `Only ${currentStock} ${item.name} available.`
            );

          }


          stockUpdates.push({

            ref:
              productRef,

            newStock:
              currentStock - requested

          });

        }



        /*
         * UPDATE PRODUCT STOCK
         */

        for (
          const update of stockUpdates
        ) {


          transaction.update(

            update.ref,

            {

              stock:
                update.newStock,

              updatedAt:
                serverTimestamp()

            }

          );

        }



        /*
         * CREATE ORDER
         */

        transaction.set(

          orderRef,

          {

            orderId:
              orderRef.id,

            orderNumber,

            userId:
              user.uid,

            customerEmail:
              user.email || '',

            ...payload,

            itemCount:

              payload.items.reduce(

                (
                  sum: number,
                  item: any
                ) =>

                  sum
                  +
                  Number(
                    item.quantity || 0
                  ),

                0

              ),

            status:
              'Pending',

            statusHistory: [

              {

                status:
                  'Pending',

                createdAt:
                  new Date()

              }

            ],

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp()

          }

        );

      }

    );



    /*
     * Notification is non-fatal.
     * The order remains valid even if notification
     * creation is temporarily unavailable.
     */

    await this.createNotificationSafe({

      userId:
        user.uid,

      title:
        'Order Placed',

      message:
        `Your order ${orderNumber} has been placed successfully.`,

      type:
        'order_placed',

      orderId:
        orderRef.id,

      orderNumber

    });



    return {

      orderId:
        orderRef.id,

      orderNumber

    };

  }



  /* =========================
     CANCEL ORDER
     ========================= */

  async cancelOrder(
    orderId: string,
    reason = 'Changed my mind'
  ):
    Promise<void> {


    const user =
      firebaseAuth.currentUser;


    if (!user) {

      throw new Error(
        'You must log in first.'
      );

    }


    const cleanOrderId =
      String(
        orderId || ''
      )
        .trim();


    if (!cleanOrderId) {

      throw new Error(
        'Order not found.'
      );

    }


    const cleanReason =
      String(
        reason || ''
      )
        .trim()
      ||
      'Changed my mind';


    const orderRef =
      doc(
        firestore,
        'orders',
        cleanOrderId
      );


    let orderNumber =
      '';


    await runTransaction(

      firestore,

      async transaction => {


        /*
         * READ ORDER
         */

        const orderSnapshot =
          await transaction.get(
            orderRef
          );


        if (
          !orderSnapshot.exists()
        ) {

          throw new Error(
            'Order not found.'
          );

        }


        const orderData =
          orderSnapshot.data();


        if (
          orderData['userId'] !==
          user.uid
        ) {

          throw new Error(
            'You cannot cancel this order.'
          );

        }


        const currentStatus =
          String(
            orderData['status'] || ''
          )
            .trim();


        if (
          !this.canCancelStatus(
            currentStatus
          )
        ) {

          throw new Error(
            'This order can no longer be cancelled.'
          );

        }


        orderNumber =
          String(
            orderData['orderNumber']
            ||
            cleanOrderId
          );


        const items =
          Array.isArray(
            orderData['items']
          )
            ? orderData['items']
            : [];


        /*
         * Aggregate quantities by product.
         * This prevents incorrect stock restoration
         * if the same product appears more than once.
         */

        const quantities =
          new Map<
            number,
            {
              quantity: number;
              name: string;
            }
          >();


        for (
          const item of items
        ) {


          const productId =
            Number(
              item?.productId
            );


          const quantity =
            Number(
              item?.quantity || 0
            );


          if (
            !Number.isFinite(productId)
            ||
            quantity <= 0
          ) {

            continue;

          }


          const existing =
            quantities.get(
              productId
            );


          quantities.set(

            productId,

            {

              quantity:
                (
                  existing?.quantity
                  ||
                  0
                )
                +
                quantity,

              name:
                String(
                  item?.name
                  ||
                  existing?.name
                  ||
                  'Product'
                )

            }

          );

        }



        /*
         * READ ALL PRODUCT STOCK FIRST
         */

        const stockRestores:
          Array<{
            ref: any;
            restoredStock: number;
          }> = [];


        for (
          const [
            productId,
            row
          ] of quantities
        ) {


          const productRef =
            doc(
              firestore,
              'products',
              String(productId)
            );


          const productSnapshot =
            await transaction.get(
              productRef
            );


          /*
           * If a product document was removed,
           * cancellation should still continue.
           */

          if (
            !productSnapshot.exists()
          ) {

            continue;

          }


          const currentStock =
            Number(
              productSnapshot.data()['stock']
              ??
              0
            );


          stockRestores.push({

            ref:
              productRef,

            restoredStock:
              currentStock
              +
              row.quantity

          });

        }



        /*
         * RESTORE STOCK
         */

        for (
          const restore of stockRestores
        ) {


          transaction.update(

            restore.ref,

            {

              stock:
                restore.restoredStock,

              updatedAt:
                serverTimestamp()

            }

          );

        }



        /*
         * CANCEL ORDER
         */

        transaction.update(

          orderRef,

          {

            status:
              'Cancelled',

            cancellationReason:
              cleanReason,

            cancelledAt:
              serverTimestamp(),

            cancelledBy:
              user.uid,

            statusHistory:
              arrayUnion({

                status:
                  'Cancelled',

                createdAt:
                  new Date()

              }),

            updatedAt:
              serverTimestamp()

          }

        );

      }

    );



    /*
     * CREATE CANCELLATION NOTIFICATION
     */

    await this.createNotificationSafe({

      userId:
        user.uid,

      title:
        'Order Cancelled',

      message:
        `Your order ${orderNumber} has been cancelled successfully.`,

      type:
        'order_cancelled',

      orderId:
        cleanOrderId,

      orderNumber

    });

  }



  /* =========================
     CANCELLATION STATUS CHECK
     ========================= */

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
