import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-help-support',
  standalone: true,

  imports: [
    RouterModule,
    IonicModule,
    CommonModule
  ],

  styles: [`

    /* =========================
       HERO
       ========================= */

    .help-hero {
      padding: 20px;

      text-align: center;
    }

    .help-icon {
      width: 68px;
      height: 68px;

      margin:
        0 auto
        12px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 50%;

      background:
        rgba(var(--ion-color-primary-rgb), .12);

      color:
        var(--ion-color-primary);

      font-size: 31px;
    }

    .help-hero h2 {
      margin: 0;

      font-size: 21px;
      font-weight: 900;
    }

    .help-hero p {
      max-width: 300px;

      margin:
        7px auto
        16px;

      font-size: 12px;
      line-height: 1.5;

      color:
        var(--ion-color-medium);
    }

    .contact-button {
      --border-radius: 12px;

      font-weight: 800;
    }


    /* =========================
       QUICK HELP
       ========================= */

    .section-title {
      margin:
        20px 2px
        10px;

      font-size: 15px;
      font-weight: 900;
    }

    .quick-grid {
      display: grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr));

      gap: 10px;
    }

    .quick-card {
      min-height: 100px;

      padding: 14px;

      display: flex;
      flex-direction: column;

      justify-content: space-between;

      cursor: pointer;
    }

    .quick-icon {
      width: 38px;
      height: 38px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 11px;

      background:
        rgba(var(--ion-color-primary-rgb), .11);

      color:
        var(--ion-color-primary);

      font-size: 20px;
    }

    .quick-title {
      margin-top: 10px;

      font-size: 12px;
      font-weight: 900;
    }

    .quick-subtitle {
      margin-top: 3px;

      font-size: 9px;
      line-height: 1.35;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       FAQ
       ========================= */

    .faq-group {
      overflow: hidden;

      border-radius: 15px;

      background:
        var(--ion-card-background);
    }

    .faq-group ion-accordion {
      background:
        var(--ion-card-background);
    }

    .faq-group ion-item {
      --background:
        var(--ion-card-background);

      --min-height: 58px;
    }

    .faq-question {
      font-size: 12px;
      font-weight: 800;
    }

    .faq-answer {
      padding:
        4px 16px
        16px;

      font-size: 11px;
      line-height: 1.55;

      color:
        var(--ion-color-medium);
    }


    /* =========================
       MORE HELP
       ========================= */

    .still-need-help {
      margin-top: 18px;

      padding: 17px;

      text-align: center;
    }

    .still-need-help h3 {
      margin: 0;

      font-size: 15px;
      font-weight: 900;
    }

    .still-need-help p {
      margin:
        5px 0
        12px;

      font-size: 11px;
      line-height: 1.45;

      color:
        var(--ion-color-medium);
    }

  `],

  template: `

<ion-header>

  <ion-toolbar>


    <ion-buttons slot="start">

      <ion-back-button
        defaultHref="/account">
      </ion-back-button>

    </ion-buttons>


    <ion-title>
      Help & Support
    </ion-title>


  </ion-toolbar>

</ion-header>



<ion-content>


<div class="page-wrap no-bottom">


  <!-- =========================
       HERO
       ========================= -->

  <div class="app-card help-hero">


    <div class="help-icon">

      <ion-icon
        name="help-circle-outline">
      </ion-icon>

    </div>


    <h2>

      How can we help?

    </h2>


    <p>

      Find quick answers about orders,
      delivery, payments, addresses,
      and your SmileHub account.

    </p>


    <ion-button
      class="contact-button"

      expand="block"

      routerLink="/contact-support">


      <ion-icon
        slot="start"
        name="headset-outline">
      </ion-icon>


      Contact Support


    </ion-button>


  </div>



  <!-- =========================
       QUICK HELP
       ========================= -->

  <div class="section-title">

    Quick Help

  </div>


  <div class="quick-grid">


    <!-- ORDERS -->

    <div
      class="app-card quick-card"
      routerLink="/orders">


      <div class="quick-icon">

        <ion-icon
          name="cart-outline">
        </ion-icon>

      </div>


      <div>

        <div class="quick-title">

          My Orders

        </div>


        <div class="quick-subtitle">

          Check order status
          and details

        </div>

      </div>


    </div>



    <!-- ADDRESSES -->

    <div
      class="app-card quick-card"
      routerLink="/addresses">


      <div class="quick-icon">

        <ion-icon
          name="location-outline">
        </ion-icon>

      </div>


      <div>

        <div class="quick-title">

          Addresses

        </div>


        <div class="quick-subtitle">

          Manage delivery
          locations

        </div>

      </div>


    </div>



    <!-- PAYMENTS -->

    <div
      class="app-card quick-card"
      routerLink="/payments">


      <div class="quick-icon">

        <ion-icon
          name="card-outline">
        </ion-icon>

      </div>


      <div>

        <div class="quick-title">

          Payments

        </div>


        <div class="quick-subtitle">

          Manage payment
          methods

        </div>

      </div>


    </div>



    <!-- CONTACT -->

    <div
      class="app-card quick-card"
      routerLink="/contact-support">


      <div class="quick-icon">

        <ion-icon
          name="headset-outline">
        </ion-icon>

      </div>


      <div>

        <div class="quick-title">

          Support

        </div>


        <div class="quick-subtitle">

          Get additional
          assistance

        </div>

      </div>


    </div>


  </div>



  <!-- =========================
       FAQ
       ========================= -->

  <div class="section-title">

    Frequently Asked Questions

  </div>


  <ion-accordion-group
    class="faq-group">


    <!-- FAQ 1 -->

    <ion-accordion value="orders">


      <ion-item
        slot="header"
        lines="full">


        <ion-label class="faq-question">

          How do I track my order?

        </ion-label>


      </ion-item>


      <div
        slot="content"
        class="faq-answer">

        Open <b>Account → My Orders</b>,
        then select an order to view
        its current status, products,
        delivery details, payment method,
        and order total.

      </div>


    </ion-accordion>



    <!-- FAQ 2 -->

    <ion-accordion value="shipping">


      <ion-item
        slot="header"
        lines="full">


        <ion-label class="faq-question">

          When is standard shipping free?

        </ion-label>


      </ion-item>


      <div
        slot="content"
        class="faq-answer">

        Standard shipping becomes free
        when your cart subtotal reaches
        at least <b>₱3,000</b>.

      </div>


    </ion-accordion>



    <!-- FAQ 3 -->

    <ion-accordion value="coupon">


      <ion-item
        slot="header"
        lines="full">


        <ion-label class="faq-question">

          How does the SMILE10 coupon work?

        </ion-label>


      </ion-item>


      <div
        slot="content"
        class="faq-answer">

        Enter <b>SMILE10</b> in your cart
        to receive a 10% discount.
        The discount is capped at
        <b>₱349.90</b>.

      </div>


    </ion-accordion>



    <!-- FAQ 4 -->

    <ion-accordion value="address">


      <ion-item
        slot="header"
        lines="full">


        <ion-label class="faq-question">

          Can I change my delivery address?

        </ion-label>


      </ion-item>


      <div
        slot="content"
        class="faq-answer">

        Yes. Open <b>Addresses</b> from
        your Account to add, edit, or
        delete saved addresses. You can
        also choose another saved address
        during checkout.

      </div>


    </ion-accordion>



    <!-- FAQ 5 -->

    <ion-accordion value="payment">


      <ion-item
        slot="header"
        lines="full">


        <ion-label class="faq-question">

          Can I change my payment method?

        </ion-label>


      </ion-item>


      <div
        slot="content"
        class="faq-answer">

        Yes. Open <b>Payment Methods</b>
        from your Account or choose another
        payment method during checkout.

      </div>


    </ion-accordion>



    <!-- FAQ 6 -->

    <ion-accordion value="wishlist">


      <ion-item
        slot="header"
        lines="full">


        <ion-label class="faq-question">

          How do I save products for later?

        </ion-label>


      </ion-item>


      <div
        slot="content"
        class="faq-answer">

        Tap the heart icon on a product.
        You can view all saved products
        anytime from your <b>Wishlist</b>.

      </div>


    </ion-accordion>



    <!-- FAQ 7 -->

    <ion-accordion value="cart">


      <ion-item
        slot="header"
        lines="full">


        <ion-label class="faq-question">

          How do I change product quantity?

        </ion-label>


      </ion-item>


      <div
        slot="content"
        class="faq-answer">

        Open your Cart and use the
        quantity controls beside each
        product before proceeding
        to checkout.

      </div>


    </ion-accordion>


  </ion-accordion-group>



  <!-- =========================
       CONTACT SUPPORT
       ========================= -->

  <div class="app-card still-need-help">


    <h3>

      Still need help?

    </h3>


    <p>

      Contact SmileHub Support for
      additional assistance.

    </p>


    <ion-button
      fill="outline"
      routerLink="/contact-support">


      <ion-icon
        slot="start"
        name="chatbubble-ellipses-outline">
      </ion-icon>


      Contact Support


    </ion-button>


  </div>


</div>


</ion-content>

`
})


export class HelpSupportPage {}