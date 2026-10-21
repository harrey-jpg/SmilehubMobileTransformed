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

    .about-copy { margin: 0; max-width: 65ch; font-size: 16px; font-weight: 400; line-height: 1.6; }
    .about-copy + .about-copy { margin-top: 16px; }
    .product-guide { display: grid; gap: 12px; }
    .product-guide h3 { margin: 0 0 8px; font-size: 18px; font-weight: 600; line-height: 1.35; }
    .product-guide p { margin: 0; max-width: 65ch; font-size: 16px; font-weight: 400; line-height: 1.6; }

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
      font-size: 24px;
      line-height: 1.15;
      font-weight: 700;
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

      font-size: 16px;
      line-height: 1.6;
      font-weight: 400;
    }

    .about-section-title {
      margin: 24px 2px 10px;
      font-size: 20px;
      font-weight: 600;
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
      font-size: 14px;
      font-weight: 600;
    }

    .feature-copy {
      margin-top: 4px;

      color:
        var(
          --ion-color-medium
        );

      font-size: 14px;
      line-height: 1.6;
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
      font-size: 14px;
      font-weight: 600;
    }

    .tech-copy {
      margin-top: 2px;

      color:
        var(
          --ion-color-medium
        );

      font-size: 14px;
      line-height: 1.6;
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
          About Us
        </ion-title>

      </ion-toolbar>
    </ion-header>


    <ion-content>

      <div class="page-wrap about-page">

        <section class="about-hero">

          <div class="about-logo">
            <img src="assets/branding/smilehub-logo.png" alt="SmileHub logo" width="52" height="52" style="object-fit:contain">
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


        <h2 class="about-section-title">Company History</h2>
        <section class="tech-card" aria-label="Company history">
          <p class="about-copy">SmileHub is a startup company specializing in the online
            distribution of dental supplies and oral healthcare products throughout the
            Philippines. The company provides quality dental products including toothbrushes,
            toothpaste, mouthwash, dental instruments, orthodontic products, sterilization
            materials, and clinic consumables.</p>
          <p class="about-copy">SmileHub is committed to making dental supplies more
            accessible by offering a secure, convenient, and affordable online shopping
            experience. Through modern technology and excellent customer service, the
            company aims to become one of the country's trusted suppliers of dental products.</p>
        </section>

        <h2 class="about-section-title">About Our Products</h2>
        <div class="product-guide">
          <article class="tech-card">
            <h3>Oral Care</h3>
            <p>Browse toothbrushes, floss picks, toothpaste, and mouthwash. Toothbrush product
              details include selectable Soft, Medium, and Hard bristle options. Review the
              product description, brand, pack information, and available stock before ordering.</p>
          </article>
          <article class="tech-card">
            <h3>Instruments &amp; Equipment</h3>
            <p>Explore dental mirrors, probes, tweezers, scaler sets, curing lights, and other
              clinic equipment. Check each listing's specifications and manufacturer instructions
              for materials, intended use, cleaning, and compatibility.</p>
          </article>
          <article class="tech-card">
            <h3>Protective &amp; Disposable Supplies</h3>
            <p>Find gloves, masks, face shields, gowns, bibs, cotton rolls, and applicators.
              Sizes, quantities, and product specifications depend on the individual listing;
              review them when preparing clinic or patient-care supplies.</p>
          </article>
          <article class="tech-card">
            <h3>Restorative, Impression &amp; Orthodontic Supplies</h3>
            <p>Browse composites, bonding agents, impression materials, trays, and orthodontic
              accessories. Confirm the required shade, material, pack size, and compatibility
              in the product information before purchase.</p>
          </article>
          <article class="tech-card">
            <h3>Choosing Your Product</h3>
            <p>Open a product to view its description, price, brand, category, SKU when available,
              stock, specifications, and customer reviews. Select an available option and quantity
              before adding it to your cart or using Buy Now.</p>
            <ion-button fill="outline" routerLink="/catalog">Browse Products</ion-button>
            <ion-button fill="clear" routerLink="/contact-us"
              [queryParams]="{concern: 'Product inquiry'}">Ask About a Product</ion-button>
          </article>
        </div>

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



      </div>

    </ion-content>

  `
})
export class AboutPage {}
