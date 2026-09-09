import {
  onDocumentUpdated
} from 'firebase-functions/v2/firestore';

import {
  initializeApp
} from 'firebase-admin/app';

import {
  FieldValue,
  getFirestore
} from 'firebase-admin/firestore';



initializeApp();



const db =
  getFirestore();



/* =========================
   ORDER STATUS NOTIFICATION
   ========================= */

export const notifyOrderStatusChange =
  onDocumentUpdated(

    'orders/{orderId}',

    async event => {


      const before =
        event.data?.before.data();


      const after =
        event.data?.after.data();


      if (
        !before
        ||
        !after
      ) {


        return;


      }



      const previousStatus =
        String(
          before['status'] || ''
        )
          .trim();


      const currentStatus =
        String(
          after['status'] || ''
        )
          .trim();



      /*
       * Ignore updates that did not
       * actually change the status.
       */

      if (
        !currentStatus
        ||
        previousStatus ===
          currentStatus
      ) {


        return;


      }



      /*
       * Order Placed and Cancelled
       * are already created by the
       * customer app, so only these
       * admin/status updates are handled
       * here to avoid duplicates.
       */

      const supportedStatuses =
        new Set([

          'Processing',

          'Packed',

          'Out for Delivery',

          'Delivered'

        ]);


      if (
        !supportedStatuses.has(
          currentStatus
        )
      ) {


        return;


      }



      const userId =
        String(
          after['userId'] || ''
        )
          .trim();


      if (!userId) {


        console.warn(
          'Order has no userId:',
          event.params.orderId
        );


        return;


      }



      const orderId =
        String(
          event.params.orderId || ''
        );


      const orderNumber =
        String(
          after['orderNumber']
          ||
          orderId
        );


      const notification =
        statusNotification(

          currentStatus,

          orderNumber

        );



      /*
       * Deterministic document ID:
       * one notification per order/status.
       * This prevents duplicates if the
       * same status is written repeatedly.
       */

      const notificationId =
        `${orderId}_${statusKey(currentStatus)}`;



      await db

        .collection(
          'notifications'
        )

        .doc(
          notificationId
        )

        .set(

          {

            notificationId,

            userId,

            title:
              notification.title,

            message:
              notification.message,

            type:
              'order_status',

            orderId,

            orderNumber,

            status:
              currentStatus,

            read:
              false,

            createdAt:
              FieldValue.serverTimestamp(),

            updatedAt:
              FieldValue.serverTimestamp()

          },

          {
            merge: true
          }

        );


      console.log(

        `Notification created for ${orderNumber}: ${currentStatus}`

      );


    }

  );



/* =========================
   STATUS NOTIFICATION TEXT
   ========================= */

function statusNotification(
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


    case 'Packed':

      return {

        title:
          'Order Packed',

        message:
          `Your order ${orderNumber} has been packed and is getting ready for delivery.`

      };


    case 'Out for Delivery':

      return {

        title:
          'Out for Delivery',

        message:
          `Your order ${orderNumber} is now out for delivery.`

      };


    case 'Delivered':

      return {

        title:
          'Order Delivered',

        message:
          `Your order ${orderNumber} has been delivered.`

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
   STATUS KEY
   ========================= */

function statusKey(
  status: string
):
  string {


  return status

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
