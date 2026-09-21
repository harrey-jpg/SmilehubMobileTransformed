import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ],
  styles: [`

    .about-page {
      padding-bottom: 28px;
    }

    .about-hero {
      position: relative;
      overflow: hidden;
      padding: 22px;
      border-radius: 24px;

      background:
        linear-gradient(
          135deg,
          #087e95 0%,
          #0f9fb4 55%,
          #29c5d4 100%
        );

      color: #ffffff;

      box-shadow:
        0 12px 28px
        rgba(
          var(--ion-color-primary-rgb),
          .15
        );
    }

    .about-hero::after {
      content: '';
      position: absolute;
      width: 130px;
      height: 130px;
      right: -48px;
      top: -58px;
      border-radius: 50%;

      border:
        22px solid
        rgba(
          255,
          255,
          255,
          .08
        );
    }

    .about-logo {
      position: relative;
      z-index: 1;
      width: 52px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;

      background:
        rgba(
          255,
          255,
          255,
          .16
        );

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          .18
        );

      font-size: 29px;
    }

    .about-kicker {
      position: relative;
      z-index: 1;
      margin-top: 18px;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .8px;
      text-transform: uppercase;
      opacity: .86;
    }

    .about-title {
      position: relative;
      z-index: 1;
      margin: 5px 0 0;
      font-size: 25px;
      line-height: 1.15;
      font-weight: 950;
      letter-spacing: -.4px;
    }

    .about-summary {
      position: relative;
      z-index: 1;
      max-width: 570px;
      margin: 10px 0 0;

      color:
        rgba(
          255,
          255,
          255,
          .92
        );

      font-size: 11px;
      line-height: 1.6;
      font-weight: 600;
    }

    .about-section-title {
      margin: 24px 2px 10px;
      font-size: 15px;
      font-weight: 900;
    }

    .feature-grid {
      display: grid;
      grid-template-columns:
        repeat(
          2,
          minmax(
            0,
            1fr
          )
        );
      gap: 10px;
    }

    .feature-card {
      min-width: 0;
      padding: 15px;
      border-radius: 18px;

      background:
        var(
          --ion-card-background
        );

      border:
        1px solid
        rgba(
          120,
          120,
          120,
          .10
        );

      box-shadow:
        0 6px 18px
        rgba(
          0,
          0,
          0,
          .04
        );
    }

    .feature-icon {
      width: 39px;
      height: 39px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .10
        );

      color:
        var(
          --ion-color-primary
        );

      font-size: 19px;
    }

    .feature-name {
      margin-top: 10px;
      font-size: 11px;
      font-weight: 900;
    }

    .feature-copy {
      margin-top: 4px;

      color:
        var(
          --ion-color-medium
        );

      font-size: 9px;
      line-height: 1.45;
    }

    .tech-card {
      padding: 16px;
      border-radius: 18px;

      background:
        var(
          --ion-card-background
        );

      border:
        1px solid
        rgba(
          120,
          120,
          120,
          .10
        );
    }

    .tech-row {
      display: flex;
      align-items: center;
      gap: 11px;
      min-height: 45px;
      padding: 8px 0;

      border-bottom:
        1px solid
        rgba(
          120,
          120,
          120,
          .08
        );
    }

    .tech-row:last-child {
      border-bottom: none;
    }

    .tech-row ion-icon {
      width: 31px;
      flex-shrink: 0;

      color:
        var(
          --ion-color-primary
        );

      font-size: 20px;
    }

    .tech-name {
      font-size: 10px;
      font-weight: 900;
    }

    .tech-copy {
      margin-top: 2px;

      color:
        var(
          --ion-color-medium
        );

      font-size: 8.5px;
      line-height: 1.4;
    }

    @media (min-width: 720px) {
      .feature-grid {
        grid-template-columns:
          repeat(
            4,
            minmax(
              0,
              1fr
            )
          );
      }
    }

    @media (max-width: 360px) {
      .feature-grid {
        grid-template-columns: 1fr;
      }
    }

  `],
  template: `

    <ion-header>
      <ion-toolbar>

        <ion-buttons slot="start">
          <ion-menu-button
            menu="main-menu"
            aria-label="Open navigation menu">
          </ion-menu-button>
        </ion-buttons>

        <ion-title>
          About the App
        </ion-title>

      </ion-toolbar>
    </ion-header>


    <ion-content>

      <div class="page-wrap about-page">

        <section class="about-hero">

          <div class="about-logo">
            🦷
          </div>

          <div class="about-kicker">
            SmileHub
          </div>

          <h1 class="about-title">
            Dental supplies,
            easier to find and order.
          </h1>

          <p class="about-summary">
            SmileHub is an ecommerce mobile application
            designed to help dental clinics and professionals
            browse dental supplies, manage their cart and wishlist,
            place orders, track purchases, and get product assistance
            through the SmileHub AI Assistant.
          </p>

        </section>


        <h2 class="about-section-title">
          Main Features
        </h2>


        <div class="feature-grid">

          <article class="feature-card">
            <div class="feature-icon">
              <ion-icon name="search-outline"></ion-icon>
            </div>
            <div class="feature-name">
              Product Discovery
            </div>
            <div class="feature-copy">
              Search and browse dental products
              by category, brand, and product details.
            </div>
          </article>

          <article class="feature-card">
            <div class="feature-icon">
              <ion-icon name="cart-outline"></ion-icon>
            </div>
            <div class="feature-name">
              Shopping & Checkout
            </div>
            <div class="feature-copy">
              Manage cart items, select products,
              choose delivery details, and place orders.
            </div>
          </article>

          <article class="feature-card">
            <div class="feature-icon">
              <ion-icon name="receipt-outline"></ion-icon>
            </div>
            <div class="feature-name">
              Order Tracking
            </div>
            <div class="feature-copy">
              View order history, order details,
              statuses, and supported cancellation options.
            </div>
          </article>

          <article class="feature-card">
            <div class="feature-icon">
              <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
            </div>
            <div class="feature-name">
              AI Assistant
            </div>
            <div class="feature-copy">
              Get product assistance, comparisons,
              cart help, and order-related guidance.
            </div>
          </article>

        </div>


        <h2 class="about-section-title">
          Technology
        </h2>


        <div class="tech-card">

          <div class="tech-row">
            <ion-icon name="phone-portrait-outline"></ion-icon>
            <div>
              <div class="tech-name">
                Ionic Angular
              </div>
              <div class="tech-copy">
                Responsive mobile interface and navigation.
              </div>
            </div>
          </div>

          <div class="tech-row">
            <ion-icon name="shield-checkmark-outline"></ion-icon>
            <div>
              <div class="tech-name">
                Firebase
              </div>
              <div class="tech-copy">
                Authentication, Firestore data, and app services.
              </div>
            </div>
          </div>

          <div class="tech-row">
            <ion-icon name="medical-outline"></ion-icon>
            <div>
              <div class="tech-name">
                Dental Ecommerce
              </div>
              <div class="tech-copy">
                Built around the SmileHub customer purchase flow.
              </div>
            </div>
          </div>

        </div>

      </div>

    </ion-content>

  `
})
export class AboutPage {}
