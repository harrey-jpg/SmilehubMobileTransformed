import {
  Injectable
} from '@angular/core';

import {
  Observable
} from 'rxjs';

import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch
} from 'firebase/firestore';

import {
  firebaseAuth,
  firestore
} from './firebase';



export interface AppNotification {

  id?: string;

  notificationId?: string;

  userId: string;

  title: string;

  message: string;

  type: string;

  orderId?: string;

  orderNumber?: string;

  status?: string;

  productId?: number;

  productName?: string;

  read: boolean;

  createdAt?: any;

  updatedAt?: any;

}



@Injectable({
  providedIn: 'root'
})
export class NotificationService {



  /* =========================
     REQUIRE USER
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
     WATCH MY NOTIFICATIONS
     ========================= */

  watchMyNotifications():
    Observable<AppNotification[]> {


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


        /*
         * Notification listener.
         *
         * We sort on the client so no
         * composite Firestore index is needed.
         */

        const notificationsQuery =
          query(

            collection(
              firestore,
              'notifications'
            ),

            where(
              'userId',
              '==',
              user.uid
            )

          );


        const unsubscribeNotifications =
          onSnapshot(

            notificationsQuery,

            snapshot => {


              const rows =
                snapshot.docs

                  .map(
                    notificationDoc => {


                      const data =
                        notificationDoc.data();


                      return {

                        id:
                          notificationDoc.id,

                        notificationId:
                          String(
                            data['notificationId']
                            ||
                            notificationDoc.id
                          ),

                        userId:
                          String(
                            data['userId'] || ''
                          ),

                        title:
                          String(
                            data['title'] || 'Notification'
                          ),

                        message:
                          String(
                            data['message'] || ''
                          ),

                        type:
                          String(
                            data['type'] || 'general'
                          ),

                        orderId:
                          String(
                            data['orderId'] || ''
                          ),

                        orderNumber:
                          String(
                            data['orderNumber'] || ''
                          ),

                        status:
                          String(
                            data['status'] || ''
                          ),

                        productId:
                          Number(
                            data['productId'] || 0
                          ) || undefined,

                        productName:
                          String(
                            data['productName'] || ''
                          ),

                        read:
                          Boolean(
                            data['read']
                          ),

                        createdAt:
                          data['createdAt'],

                        updatedAt:
                          data['updatedAt']

                      } as AppNotification;


                    }
                  )

                  .sort(
                    (
                      a,
                      b
                    ) => {


                      const aTime =
                        this.timestampMillis(
                          a.createdAt
                        );


                      const bTime =
                        this.timestampMillis(
                          b.createdAt
                        );


                      return (
                        bTime - aTime
                      );


                    }
                  );


              subscriber.next(
                rows
              );


            },

            error => {


              subscriber.error(
                error
              );


            }

          );



        /*
         * FREE / SPARK PLAN FALLBACK
         *
         * We also watch the current user's orders.
         * When an order changes to Processing,
         * Shipped, Delivered, or Cancelled,
         * the customer app creates the missing
         * in-app notification itself.
         *
         * This replaces the Cloud Function for
         * the student/demo build and does not
         * require the Blaze plan.
         */

        const ordersQuery =
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


        const unsubscribeOrders =
          onSnapshot(

            ordersQuery,

            snapshot => {


              void this
                .syncOrderStatusNotifications(
                  snapshot.docs,
                  user.uid
                );


            },

            error => {


              /*
               * Do not break the notification
               * page if order-status sync fails.
               */

              console.error(
                'Unable to sync order notifications:',
                error
              );


            }

          );



        /*
         * BACK-IN-STOCK WATCHER
         *
         * This is the free-plan / client-side fallback.
         * While SmileHub is open and a notification watcher
         * is active, product stock changes are checked against
         * the customer's saved stock-alert product IDs.
         */

        const unsubscribeProducts =
          onSnapshot(

            collection(
              firestore,
              'products'
            ),

            snapshot => {


              void this
                .syncStockAvailabilityNotifications(
                  snapshot.docs,
                  user.uid
                );


            },

            error => {


              console.error(
                'Unable to sync stock notifications:',
                error
              );


            }

          );



        return () => {


          unsubscribeNotifications();

          unsubscribeOrders();

          unsubscribeProducts();


        };

      }

    );

  }



  /* =========================
     SYNC ORDER STATUS NOTIFICATIONS
     ========================= */

  private async syncOrderStatusNotifications(
    orderDocs: any[],
    userId: string
  ):
    Promise<void> {


    try {


      /*
       * Read the user's current notifications
       * so we do not create duplicates.
       */

      const existingSnapshot =
        await getDocs(

          query(

            collection(
              firestore,
              'notifications'
            ),

            where(
              'userId',
              '==',
              userId
            )

          )

        );


      const existingKeys =
        new Set<string>();


      /*
       * If the customer previously used Clear All,
       * do not recreate old order-status notifications.
       * A later order status change updates order.updatedAt,
       * so future notifications can still appear normally.
       */

      const userSnapshot =
        await getDoc(

          doc(
            firestore,
            'users',
            userId
          )

        );


      const notificationsClearedAt =
        this.timestampMillis(

          userSnapshot.exists()
            ? userSnapshot.data()['notificationsClearedAt']
            : null

        );


      for (
        const notificationDoc
        of existingSnapshot.docs
      ) {


        const data =
          notificationDoc.data();


        const orderId =
          String(
            data['orderId'] || ''
          )
            .trim();


        const status =
          this.statusFromNotification(
            data
          );


        if (
          orderId
          &&
          status
        ) {


          existingKeys.add(
            this.notificationKey(
              orderId,
              status
            )
          );


        }


      }



      for (
        const orderDoc
        of orderDocs
      ) {


        const order =
          orderDoc.data();


        const orderUpdatedAt =
          this.timestampMillis(

            order['updatedAt']
            ||
            order['createdAt']

          );


        if (
          notificationsClearedAt > 0
          &&
          orderUpdatedAt <=
            notificationsClearedAt
        ) {


          continue;


        }


        const status =
          this.normalizeOrderStatus(
            String(
              order['status'] || ''
            )
          );


        if (
          !this.isSupportedOrderStatus(
            status
          )
        ) {


          continue;


        }


        const orderId =
          String(
            orderDoc.id || ''
          );


        const key =
          this.notificationKey(
            orderId,
            status
          );


        if (
          existingKeys.has(
            key
          )
        ) {


          continue;


        }


        const orderNumber =
          String(
            order['orderNumber']
            ||
            orderId
          );


        const notification =
          this.orderStatusText(
            status,
            orderNumber
          );


        /*
         * Deterministic document ID:
         * one notification per order/status.
         */

        const notificationId =
          `${orderId}_${this.statusKey(status)}`;


        await setDoc(

          doc(
            firestore,
            'notifications',
            notificationId
          ),

          {

            notificationId,

            userId,

            title:
              notification.title,

            message:
              notification.message,

            type:
              status === 'Cancelled'
                ? 'order_cancelled'
                : 'order_status',

            orderId,

            orderNumber,

            status,

            read:
              false,

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp()

          }

        );


        existingKeys.add(
          key
        );


      }


    } catch (
      error
    ) {


      console.error(
        'Order notification sync error:',
        error
      );


    }

  }



  /* =========================
     SUPPORTED ORDER STATUS
     ========================= */

  private isSupportedOrderStatus(
    status: string
  ):
    boolean {


    return [

      'Processing',

      'Shipped',

      'Delivered',

      'Cancelled'

    ]
      .includes(
        this.normalizeOrderStatus(
          status
        )
      );

  }



  /* =========================
     ORDER STATUS TEXT
     ========================= */

  private orderStatusText(
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
     STATUS FROM EXISTING NOTIFICATION
     ========================= */

  private statusFromNotification(
    data: any
  ):
    string {


    const storedStatus =
      String(
        data?.['status'] || ''
      )
        .trim();


    if (
      storedStatus
    ) {


      return this.normalizeOrderStatus(
        storedStatus
      );


    }


    const title =
      String(
        data?.['title'] || ''
      )
        .trim();


    switch (
      title
    ) {


      case 'Order Processing':

        return 'Processing';


      case 'Order Shipped':

        return 'Shipped';


      case 'Order Packed':

        return 'Shipped';


      case 'Out for Delivery':

        return 'Shipped';


      case 'Order Delivered':

        return 'Delivered';


      case 'Order Cancelled':

        return 'Cancelled';


      default:

        return '';


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
     NOTIFICATION KEY
     ========================= */

  private notificationKey(
    orderId: string,
    status: string
  ):
    string {


    return (
      `${orderId}|${status}`
    );

  }



  /* =========================
     STATUS KEY
     ========================= */

  private statusKey(
    status: string
  ):
    string {


    return String(
      status || ''
    )

      .trim()

      .toLowerCase()

      .replace(
        /[^a-z0-9]+/g,
        '-'
      )

      .replace(
        /^-+|-+$/g,
        ''
      );

  }



  /* =========================
     STOCK ALERT ENABLED
     ========================= */

  async isStockAlertEnabled(
    productId: number
  ):
    Promise<boolean> {


    const user =
      this.requireUser();


    const snapshot =
      await getDoc(

        doc(
          firestore,
          'users',
          user.uid
        )

      );


    if (!snapshot.exists()) {


      return false;


    }


    const ids =
      Array.isArray(
        snapshot.data()['stockAlertProductIds']
      )
        ? snapshot.data()['stockAlertProductIds']
        : [];


    return ids.some(
      (value: any) =>
        Number(value) ===
        Number(productId)
    );


  }



  /* =========================
     ENABLE STOCK ALERT
     ========================= */

  async enableStockAlert(
    productId: number
  ):
    Promise<void> {


    const user =
      this.requireUser();


    const id =
      Number(productId);


    if (
      !Number.isFinite(id)
      ||
      id <= 0
    ) {


      throw new Error(
        'Invalid product.'
      );


    }


    await setDoc(

      doc(
        firestore,
        'users',
        user.uid
      ),

      {

        stockAlertProductIds:
          arrayUnion(id),

        stockAlertsUpdatedAt:
          serverTimestamp()

      },

      {
        merge: true
      }

    );


  }



  /* =========================
     DISABLE STOCK ALERT
     ========================= */

  async disableStockAlert(
    productId: number
  ):
    Promise<void> {


    const user =
      this.requireUser();


    const id =
      Number(productId);


    if (
      !Number.isFinite(id)
      ||
      id <= 0
    ) {


      return;


    }


    await setDoc(

      doc(
        firestore,
        'users',
        user.uid
      ),

      {

        stockAlertProductIds:
          arrayRemove(id),

        stockAlertsUpdatedAt:
          serverTimestamp()

      },

      {
        merge: true
      }

    );


  }



  /* =========================
     SYNC BACK-IN-STOCK NOTIFICATIONS
     ========================= */

  private async syncStockAvailabilityNotifications(
    productDocs: any[],
    userId: string
  ):
    Promise<void> {


    try {


      const userSnapshot =
        await getDoc(

          doc(
            firestore,
            'users',
            userId
          )

        );


      if (!userSnapshot.exists()) {


        return;


      }


      const rawAlertIds =
        userSnapshot.data()['stockAlertProductIds'];


      const alertIds =
        new Set<number>(

          Array.isArray(rawAlertIds)

            ? rawAlertIds
                .map(
                  (value: any) =>
                    Number(value)
                )
                .filter(
                  (value: number) =>
                    Number.isFinite(value)
                    &&
                    value > 0
                )

            : []

        );


      if (alertIds.size === 0) {


        return;


      }


      const fulfilled:
        number[] = [];


      for (
        const productDoc
        of productDocs
      ) {


        const product =
          productDoc.data();


        const productId =
          Number(
            product['id']
            ??
            productDoc.id
          );


        if (
          !Number.isFinite(productId)
          ||
          !alertIds.has(productId)
        ) {


          continue;


        }


        const stock =
          Number(
            product['stock']
            ??
            product['stockCount']
            ??
            0
          );


        if (
          !Number.isFinite(stock)
          ||
          stock <= 0
        ) {


          continue;


        }


        const productName =
          String(
            product['name']
            ||
            'A product you saved'
          );


        const notificationId =
          `stock_${userId}_${productId}`;


        await setDoc(

          doc(
            firestore,
            'notifications',
            notificationId
          ),

          {

            notificationId,

            userId,

            title:
              'Back in Stock',

            message:
              `${productName} is available again.`,

            type:
              'back_in_stock',

            productId,

            productName,

            read:
              false,

            createdAt:
              serverTimestamp(),

            updatedAt:
              serverTimestamp()

          }

        );


        fulfilled.push(
          productId
        );


      }


      if (
        fulfilled.length > 0
      ) {


        await setDoc(

          doc(
            firestore,
            'users',
            userId
          ),

          {

            stockAlertProductIds:
              arrayRemove(
                ...fulfilled
              ),

            stockAlertsUpdatedAt:
              serverTimestamp()

          },

          {
            merge: true
          }

        );


      }


    } catch (
      error
    ) {


      console.error(
        'Back-in-stock sync error:',
        error
      );


    }


  }



  /* =========================
     GET MY NOTIFICATIONS
     ========================= */

  async getMyNotifications():
    Promise<AppNotification[]> {


    const user =
      this.requireUser();


    const snapshot =
      await getDocs(

        query(

          collection(
            firestore,
            'notifications'
          ),

          where(
            'userId',
            '==',
            user.uid
          )

        )

      );


    return snapshot.docs

      .map(
        notificationDoc => {


          const data =
            notificationDoc.data();


          return {

            id:
              notificationDoc.id,

            notificationId:
              String(
                data['notificationId']
                ||
                notificationDoc.id
              ),

            userId:
              String(
                data['userId'] || ''
              ),

            title:
              String(
                data['title'] || 'Notification'
              ),

            message:
              String(
                data['message'] || ''
              ),

            type:
              String(
                data['type'] || 'general'
              ),

            orderId:
              String(
                data['orderId'] || ''
              ),

            orderNumber:
              String(
                data['orderNumber'] || ''
              ),

            status:
              String(
                data['status'] || ''
              ),

            productId:
              Number(
                data['productId'] || 0
              ) || undefined,

            productName:
              String(
                data['productName'] || ''
              ),

            read:
              Boolean(
                data['read']
              ),

            createdAt:
              data['createdAt'],

            updatedAt:
              data['updatedAt']

          } as AppNotification;


        }
      )

      .sort(
        (
          a,
          b
        ) => {


          return (

            this.timestampMillis(
              b.createdAt
            )

            -

            this.timestampMillis(
              a.createdAt
            )

          );


        }
      );

  }



  /* =========================
     MARK ONE AS READ
     ========================= */

  async markAsRead(
    notificationId: string
  ):
    Promise<void> {


    this.requireUser();


    const cleanId =
      String(
        notificationId || ''
      )
        .trim();


    if (!cleanId) {


      return;


    }


    await updateDoc(

      doc(
        firestore,
        'notifications',
        cleanId
      ),

      {

        read:
          true,

        updatedAt:
          serverTimestamp()

      }

    );

  }



  /* =========================
     MARK ALL AS READ
     ========================= */

  async markAllAsRead():
    Promise<void> {


    const user =
      this.requireUser();


    const snapshot =
      await getDocs(

        query(

          collection(
            firestore,
            'notifications'
          ),

          where(
            'userId',
            '==',
            user.uid
          )

        )

      );


    const unread =
      snapshot.docs.filter(
        notificationDoc =>

          !Boolean(
            notificationDoc.data()['read']
          )

      );


    if (
      unread.length === 0
    ) {


      return;


    }


    const batch =
      writeBatch(
        firestore
      );


    for (
      const notificationDoc
      of unread
    ) {


      batch.update(

        notificationDoc.ref,

        {

          read:
            true,

          updatedAt:
            serverTimestamp()

        }

      );

    }


    await batch.commit();

  }



  /* =========================
     CLEAR ALL NOTIFICATIONS
     ========================= */

  async clearAllNotifications():
    Promise<void> {


    const user =
      this.requireUser();


    /*
     * Save a cutoff on the user's profile first.
     * This stops the Spark-plan order watcher from
     * recreating old status notifications after
     * the notification documents are deleted.
     */

    await setDoc(

      doc(
        firestore,
        'users',
        user.uid
      ),

      {

        notificationsClearedAt:
          serverTimestamp()

      },

      {
        merge: true
      }

    );


    const snapshot =
      await getDocs(

        query(

          collection(
            firestore,
            'notifications'
          ),

          where(
            'userId',
            '==',
            user.uid
          )

        )

      );


    if (
      snapshot.empty
    ) {


      return;


    }


    /*
     * Firestore write batches have a limit.
     * Use smaller chunks so Clear All remains
     * safe even if the list becomes large.
     */

    const rows =
      snapshot.docs;


    const batchSize =
      400;


    for (
      let start = 0;
      start < rows.length;
      start += batchSize
    ) {


      const batch =
        writeBatch(
          firestore
        );


      const chunk =
        rows.slice(
          start,
          start + batchSize
        );


      for (
        const notificationDoc
        of chunk
      ) {


        batch.delete(
          notificationDoc.ref
        );


      }


      await batch.commit();


    }


  }



  /* =========================
     DELETE NOTIFICATION
     ========================= */

  async deleteNotification(
    notificationId: string
  ):
    Promise<void> {


    this.requireUser();


    const cleanId =
      String(
        notificationId || ''
      )
        .trim();


    if (!cleanId) {


      return;


    }


    await deleteDoc(

      doc(
        firestore,
        'notifications',
        cleanId
      )

    );

  }



  /* =========================
     TIMESTAMP
     ========================= */

  private timestampMillis(
    value: any
  ):
    number {


    try {


      if (
        typeof value?.toMillis ===
        'function'
      ) {


        return Number(
          value.toMillis()
        );


      }


      if (
        value instanceof Date
      ) {


        return value.getTime();


      }


      return 0;


    } catch (_) {


      return 0;


    }

  }


}
