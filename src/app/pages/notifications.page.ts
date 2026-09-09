import {
  Component
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  IonicModule,
  ToastController,
  AlertController
} from '@ionic/angular';

import {
  CommonModule
} from '@angular/common';

import {
  AppNotification,
  NotificationService
} from '../services/notification.service';



@Component({
  selector: 'app-notifications',

  standalone: true,

  imports: [
    IonicModule,
    CommonModule
  ],

  styles: [`

    .notification-header-actions {

      display: flex;

      align-items: center;

      gap: 6px;

    }



    .mark-all-button {

      margin: 0;

      font-size: 10px;

      font-weight: 800;

      text-transform: none;

    }



    .clear-all-button {

      margin: 0;

      --border-radius: 10px;

      font-size: 10px;

      font-weight: 800;

      text-transform: none;

    }



    .notification-card {

      position: relative;

      padding: 14px;

      display: flex;

      align-items: flex-start;

      gap: 12px;

      cursor: pointer;

    }



    .notification-card.unread {

      border:
        1px solid
        rgba(
          var(--ion-color-primary-rgb),
          .16
        );

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .04
        );

    }



    .notification-icon {

      width: 42px;

      height: 42px;

      flex-shrink: 0;

      display: flex;

      align-items: center;

      justify-content: center;

      border-radius: 13px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      font-size: 20px;

    }



    .notification-content {

      min-width: 0;

      flex: 1;

    }



    .notification-title-row {

      display: flex;

      align-items: flex-start;

      justify-content: space-between;

      gap: 10px;

    }



    .notification-title {

      font-size: 12px;

      font-weight: 900;

      line-height: 1.35;

    }



    .unread-dot {

      width: 8px;

      height: 8px;

      flex-shrink: 0;

      margin-top: 4px;

      border-radius: 50%;

      background:
        var(--ion-color-primary);

    }



    .notification-message {

      margin-top: 5px;

      font-size: 10px;

      line-height: 1.5;

      color:
        var(--ion-color-medium);

    }



    .notification-meta {

      margin-top: 8px;

      display: flex;

      align-items: center;

      justify-content: space-between;

      gap: 8px;

      font-size: 9px;

      color:
        var(--ion-color-medium);

    }



    .order-link {

      color:
        var(--ion-color-primary);

      font-weight: 800;

    }



    .empty-state {

      min-height: 330px;

      display: flex;

      flex-direction: column;

      align-items: center;

      justify-content: center;

      text-align: center;

      padding: 30px 20px;

    }



    .empty-icon {

      font-size: 48px;

      margin-bottom: 10px;

    }



    .empty-title {

      font-size: 17px;

      font-weight: 900;

    }



    .empty-text {

      max-width: 260px;

      margin-top: 5px;

      font-size: 11px;

      line-height: 1.5;

      color:
        var(--ion-color-medium);

    }



    .loading-state {

      min-height: 250px;

      display: flex;

      flex-direction: column;

      align-items: center;

      justify-content: center;

      gap: 10px;

      color:
        var(--ion-color-medium);

      font-size: 11px;

    }

  `],


  template: `

<ion-header>


  <ion-toolbar>


    <ion-buttons
      slot="start">


      <ion-back-button
        defaultHref="/account">
      </ion-back-button>


    </ion-buttons>



    <ion-title>

      Notifications

    </ion-title>



    <ion-buttons
      slot="end"

      class="notification-header-actions">


      <ion-button
        *ngIf="
          unreadCount > 0
        "

        class="mark-all-button"

        fill="clear"

        [disabled]="
          markingAllRead
        "

        (click)="
          markAllAsRead()
        ">


        {{
          markingAllRead
            ? 'Marking...'
            : 'Mark all read'
        }}


      </ion-button>


    </ion-buttons>


  </ion-toolbar>


</ion-header>



<ion-content>


  <div class="page-wrap no-bottom">



    <!-- HEADER SUMMARY -->

    <div
      class="section-row"

      *ngIf="
        !loading &&
        notifications.length > 0
      ">


      <div>


        <h2
          style="
            margin:0
          ">

          Your updates

        </h2>


        <p
          class="muted"

          style="
            margin:3px 0 0
          ">

          {{
            unreadCount === 0
              ? 'You are all caught up.'
              : unreadCount === 1
                ? '1 unread notification'
                : unreadCount + ' unread notifications'
          }}

        </p>


      </div>


      <ion-button
        class="clear-all-button"

        size="small"

        fill="clear"

        color="danger"

        [disabled]="
          clearingAll
        "

        (click)="
          confirmClearAll()
        ">


        <ion-spinner
          *ngIf="
            clearingAll
          "

          slot="start"

          name="crescent">
        </ion-spinner>


        <ion-icon
          *ngIf="
            !clearingAll
          "

          slot="start"

          name="trash-outline">
        </ion-icon>


        {{
          clearingAll
            ? 'Clearing...'
            : 'Clear all'
        }}


      </ion-button>


    </div>



    <!-- LOADING -->

    <div
      class="loading-state"

      *ngIf="
        loading
      ">


      <ion-spinner
        name="crescent">
      </ion-spinner>


      Loading notifications...


    </div>



    <!-- LIST -->

    <div
      class="list-stack"

      *ngIf="
        !loading &&
        notifications.length > 0
      ">


      <div
        class="app-card notification-card"

        *ngFor="
          let notification
          of notifications;
          trackBy: trackNotification
        "

        [class.unread]="
          !notification.read
        "

        (click)="
          openNotification(
            notification
          )
        ">


        <div class="notification-icon">

          {{
            iconFor(
              notification.type
            )
          }}

        </div>



        <div class="notification-content">


          <div class="notification-title-row">


            <div class="notification-title">

              {{ notification.title }}

            </div>


            <span
              class="unread-dot"

              *ngIf="
                !notification.read
              ">
            </span>


          </div>



          <div class="notification-message">

            {{ notification.message }}

          </div>



          <div class="notification-meta">


            <span>

              {{
                notificationDate(
                  notification.createdAt
                )
              }}

            </span>


            <span
              class="order-link"

              *ngIf="
                notification.orderId
              ">

              View order

            </span>


            <span
              class="order-link"

              *ngIf="
                !notification.orderId
                &&
                notification.productId
              ">

              View product

            </span>


          </div>


        </div>


      </div>


    </div>



    <!-- EMPTY -->

    <div
      class="empty-state"

      *ngIf="
        !loading &&
        notifications.length === 0
      ">


      <div class="empty-icon">

        🔔

      </div>


      <div class="empty-title">

        No notifications yet

      </div>


      <div class="empty-text">

        Updates about your orders,
        deliveries, cancellations,
        stock alerts, and other SmileHub activity
        will appear here.

      </div>


    </div>


  </div>


</ion-content>

`

})


export class NotificationsPage {


  notifications:
    AppNotification[] = [];


  loading =
    true;


  markingAllRead =
    false;


  clearingAll =
    false;


  private subscription?:
    {
      unsubscribe():
        void
    };



  constructor(

    private notificationsService:
      NotificationService,

    private router:
      Router,

    private toastController:
      ToastController,

    private alertController:
      AlertController

  ) {}



  /* =========================
     PAGE ENTER
     ========================= */

  ionViewWillEnter():
    void {


    this.subscription
      ?.unsubscribe();


    this.loading =
      true;


    this.subscription =
      this.notificationsService
        .watchMyNotifications()

        .subscribe({

          next:
            rows => {


              this.notifications =
                rows;


              this.loading =
                false;


            },

          error:
            async error => {


              console.error(
                'Notifications error:',
                error
              );


              this.notifications =
                [];


              this.loading =
                false;


              await this.showToast(
                'Unable to load notifications.'
              );


            }

        });

  }



  /* =========================
     PAGE LEAVE
     ========================= */

  ionViewWillLeave():
    void {


    this.subscription
      ?.unsubscribe();

  }



  /* =========================
     UNREAD COUNT
     ========================= */

  get unreadCount():
    number {


    return this.notifications
      .filter(
        notification =>
          !notification.read
      )
      .length;

  }



  /* =========================
     OPEN NOTIFICATION
     ========================= */

  async openNotification(
    notification: AppNotification
  ):
    Promise<void> {


    try {


      if (
        !notification.read
        &&
        notification.id
      ) {


        await this.notificationsService
          .markAsRead(
            notification.id
          );


      }


      if (
        notification.orderId
      ) {


        await this.router
          .navigate([
            '/order-details',
            notification.orderId
          ]);


        return;


      }


      if (
        notification.productId
      ) {


        await this.router
          .navigate([
            '/product-details',
            notification.productId
          ]);


      }


    } catch (
      error
    ) {


      console.error(
        'Open notification error:',
        error
      );


      await this.showToast(
        'Unable to open notification.'
      );


    }

  }



  /* =========================
     MARK ALL READ
     ========================= */

  async markAllAsRead():
    Promise<void> {


    if (
      this.markingAllRead
      ||
      this.unreadCount === 0
    ) {


      return;


    }


    this.markingAllRead =
      true;


    try {


      await this.notificationsService
        .markAllAsRead();


      await this.showToast(
        'All notifications marked as read.'
      );


    } catch (
      error
    ) {


      console.error(
        'Mark all notifications error:',
        error
      );


      await this.showToast(
        'Unable to update notifications.'
      );


    } finally {


      this.markingAllRead =
        false;


    }

  }



  /* =========================
     CONFIRM CLEAR ALL
     ========================= */

  async confirmClearAll():
    Promise<void> {


    if (
      this.clearingAll
      ||
      this.notifications.length === 0
    ) {


      return;


    }


    const alert =
      await this.alertController
        .create({

          header:
            'Clear all notifications?',

          message:
            'This will remove all notifications currently shown in your list.',

          buttons: [

            {

              text:
                'Cancel',

              role:
                'cancel'

            },

            {

              text:
                'Clear All',

              role:
                'destructive',

              handler:
                () => {


                  void this.clearAll();


                }

            }

          ]

        });


    await alert.present();


  }



  /* =========================
     CLEAR ALL
     ========================= */

  private async clearAll():
    Promise<void> {


    if (
      this.clearingAll
    ) {


      return;


    }


    this.clearingAll =
      true;


    try {


      await this.notificationsService
        .clearAllNotifications();


      await this.showToast(
        'Notifications cleared.'
      );


    } catch (
      error
    ) {


      console.error(
        'Clear notifications error:',
        error
      );


      await this.showToast(
        'Unable to clear notifications.'
      );


    } finally {


      this.clearingAll =
        false;


    }


  }



  /* =========================
     ICON
     ========================= */

  iconFor(
    type: string
  ):
    string {


    switch (
      String(
        type || ''
      )
    ) {


      case 'order_placed':

        return '🛒';


      case 'order_cancelled':

        return '❌';


      case 'order_status':

        return '📦';


      case 'back_in_stock':

        return '✅';


      default:

        return '🔔';


    }

  }



  /* =========================
     DATE
     ========================= */

  notificationDate(
    value: any
  ):
    string {


    try {


      const date =

        value?.toDate?.()

        ??

        (
          value instanceof Date
            ? value
            : null
        );


      if (!date) {


        return 'Just now';


      }


      return date
        .toLocaleString(
          'en-PH',
          {
            month:
              'short',
            day:
              'numeric',
            year:
              'numeric',
            hour:
              'numeric',
            minute:
              '2-digit'
          }
        );


    } catch (_) {


      return '';

    }

  }



  /* =========================
     TRACK
     ========================= */

  trackNotification(
    _index: number,
    notification: AppNotification
  ) {


    return (
      notification.id
      ||
      notification.notificationId
    );

  }



  /* =========================
     TOAST
     ========================= */

  private async showToast(
    message: string
  ):
    Promise<void> {


    const toast =
      await this.toastController
        .create({

          message,

          duration:
            1500,

          position:
            'bottom'

        });


    await toast.present();

  }


}
