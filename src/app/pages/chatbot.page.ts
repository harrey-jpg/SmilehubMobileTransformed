import {
  Component,
  ViewChild,
  OnDestroy
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  IonicModule,
  IonContent,
  AlertController,
  ToastController
} from '@ionic/angular';

import {
  AppStateService
} from '../services/app-state.service';

import {
  OrderService
} from '../services/order.service';

import {
  Subscription
} from 'rxjs';

import {
  ChatbotService,
  ChatMessage,
  ChatDisplayMode,
  ChatbotCartAction
} from '../services/chatbot.service';

interface UiChatMessage extends ChatMessage {
  time: Date;
  productIds?: Array<number | string>;
  displayMode?: ChatDisplayMode;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,

  imports: [
    IonicModule,
    CommonModule,
    FormsModule
  ],

  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .chat-header ion-toolbar {
      --min-height: 58px;
      --border-width: 0 0 1px 0;
      --border-color: rgba(120, 120, 120, .10);
      --background: var(
        --ion-toolbar-background,
        var(--ion-background-color)
      );
    }

    .chat-title-wrap {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .chat-title {
      font-size: 19px;
      font-weight: 900;
      line-height: 1;
    }

    .online-dot {
      width: 8px;
      height: 8px;
      flex-shrink: 0;
      border-radius: 999px;
      background: var(--ion-color-success);
      box-shadow:
        0 0 0 3px
        rgba(var(--ion-color-success-rgb), .14);
    }

    .clear-chat-button {
      --padding-start: 7px;
      --padding-end: 7px;
      font-size: 11px;
      font-weight: 800;
      text-transform: none;
    }

    .chat-cart-button {
      position: relative;
      --padding-start: 7px;
      --padding-end: 7px;
    }

    .chat-cart-badge {
      position: absolute;
      top: 2px;
      right: 1px;
      min-width: 16px;
      height: 16px;
      padding: 2px 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      font-size: 8px;
      font-weight: 900;
    }

    .chat-content {
      --background: var(--ion-background-color);
    }

    .chat-shell {
      width: 100%;
      max-width: 760px;
      margin: 0 auto;
      padding: 14px 12px 120px;
    }

    .welcome-card {
      padding: 16px;
      border-radius: 20px;
      border:
        1px solid
        rgba(var(--ion-color-primary-rgb), .16);
      background:
        linear-gradient(
          135deg,
          rgba(var(--ion-color-primary-rgb), .10),
          rgba(var(--ion-color-primary-rgb), .035)
        );
    }

    .welcome-top {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bot-avatar {
      width: 42px;
      height: 42px;
      flex-shrink: 0;
      display: grid;
      place-items: center;
      border-radius: 14px;
      font-size: 22px;
      background:
        rgba(var(--ion-color-primary-rgb), .12);
      border:
        1px solid
        rgba(var(--ion-color-primary-rgb), .15);
    }

    .welcome-name {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 15px;
      font-weight: 900;
    }

    .welcome-status {
      margin-top: 3px;
      font-size: 10px;
      font-weight: 700;
      color: var(--ion-color-medium);
    }

    .welcome-copy {
      margin: 13px 0 0;
      font-size: 12px;
      line-height: 1.55;
      color: var(--ion-color-medium);
    }

    .quick-label {
      margin-top: 14px;
      font-size: 9px;
      font-weight: 900;
      letter-spacing: .7px;
      text-transform: uppercase;
      color: var(--ion-color-medium);
    }

    .quick-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      overflow-x: auto;
      padding-bottom: 2px;
      scrollbar-width: none;
    }

    .quick-actions::-webkit-scrollbar {
      display: none;
    }

    .quick-chip {
      min-height: 34px;
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 11px;
      border-radius: 999px;
      border:
        1px solid
        rgba(var(--ion-color-primary-rgb), .22);
      background:
        var(--ion-card-background, transparent);
      color: var(--ion-color-primary);
      font-size: 10px;
      font-weight: 850;
      cursor: pointer;
    }

    .messages {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message-row {
      display: flex;
      align-items: flex-start;
      gap: 7px;
    }

    .message-row.user {
      justify-content: flex-end;
      align-items: flex-end;
    }

    .message-row.assistant .message-avatar {
      margin-top: 4px;
    }

    .message-avatar {
      width: 28px;
      height: 28px;
      flex-shrink: 0;
      display: grid;
      place-items: center;
      border-radius: 10px;
      font-size: 15px;
      background:
        rgba(var(--ion-color-primary-rgb), .10);
      border:
        1px solid
        rgba(var(--ion-color-primary-rgb), .12);
    }

    .message-stack {
      max-width: min(84%, 580px);
    }

    .message-row.user .message-stack {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .message-bubble {
      padding: 11px 13px;
      border-radius: 17px;
      font-size: 12.5px;
      line-height: 1.52;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .message-row.user .message-bubble {
      border-bottom-right-radius: 6px;
      background: var(--ion-color-primary);
      color: var(--ion-color-primary-contrast);
    }

    .message-row.assistant .message-bubble {
      border-bottom-left-radius: 6px;
      background:
        var(--ion-card-background, #ffffff);
      color: var(--ion-text-color);
      border:
        1px solid
        rgba(120, 120, 120, .12);
    }

    .message-time {
      margin-top: 4px;
      padding: 0 3px;
      font-size: 8.5px;
      font-weight: 650;
      color: var(--ion-color-medium);
    }

    .message-row.user .message-time {
      text-align: right;
    }

    .typing-bubble {
      min-width: 128px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--ion-color-medium);
    }

    .typing-bubble ion-spinner {
      width: 18px;
      height: 18px;
    }

    /* AI PRODUCT CARDS */

    .ai-products {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 9px;
      margin-top: 9px;
    }

    .ai-product-card {
      min-width: 0;
      overflow: hidden;
      border-radius: 15px;
      border:
        1px solid
        rgba(120, 120, 120, .13);
      background:
        var(--ion-card-background, #ffffff);
      cursor: pointer;
    }

    .ai-product-image-wrap {
      height: 108px;
      display: grid;
      place-items: center;
      background: rgba(120, 120, 120, .055);
    }

    .ai-product-image {
      width: 88px;
      height: 88px;
      object-fit: contain;
    }

    .ai-product-body {
      padding: 9px;
    }

    .ai-product-brand {
      font-size: 8px;
      font-weight: 900;
      color: var(--ion-color-medium);
      text-transform: uppercase;
      letter-spacing: .45px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ai-product-name {
      margin-top: 3px;
      min-height: 32px;
      font-size: 11px;
      font-weight: 900;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .ai-product-price {
      margin-top: 5px;
      font-size: 13px;
      font-weight: 950;
      color: var(--ion-color-primary);
    }

    .ai-product-meta {
      min-height: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 5px;
      margin-top: 4px;
      font-size: 8.5px;
      color: var(--ion-color-medium);
    }

    .stock-ok {
      color: var(--ion-color-success);
      font-weight: 800;
    }

    .stock-out {
      color: var(--ion-color-danger);
      font-weight: 800;
    }

    .ai-product-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
      margin-top: 7px;
    }

    .ai-product-actions ion-button {
      min-height: 30px;
      margin: 0;
      font-size: 8.5px;
      font-weight: 850;
      --border-radius: 9px;
    }

    /* AI COMPARISON */

    .ai-comparison {
      margin-top: 9px;
      padding: 10px;
      border-radius: 15px;
      border:
        1px solid
        rgba(var(--ion-color-primary-rgb), .16);
      background:
        rgba(var(--ion-color-primary-rgb), .035);
    }

    .compare-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 10px;
      font-weight: 900;
      color: var(--ion-color-primary);
    }

    .compare-scroll {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 3px;
      scrollbar-width: none;
    }

    .compare-scroll::-webkit-scrollbar {
      display: none;
    }

    .compare-card {
      width: 168px;
      min-width: 168px;
      overflow: hidden;
      border-radius: 13px;
      border:
        1px solid
        rgba(120, 120, 120, .13);
      background:
        var(--ion-card-background, #ffffff);
    }

    .compare-image-wrap {
      height: 88px;
      display: grid;
      place-items: center;
      background:
        rgba(120, 120, 120, .055);
    }

    .compare-image {
      width: 72px;
      height: 72px;
      object-fit: contain;
    }

    .compare-body {
      padding: 9px;
    }

    .compare-brand {
      font-size: 8px;
      font-weight: 900;
      color: var(--ion-color-medium);
      text-transform: uppercase;
      letter-spacing: .4px;
    }

    .compare-name {
      min-height: 34px;
      margin-top: 3px;
      font-size: 10.5px;
      font-weight: 900;
      line-height: 1.35;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .compare-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
      padding: 6px 0;
      border-bottom:
        1px solid
        rgba(120, 120, 120, .08);
      font-size: 8.5px;
    }

    .compare-row:last-of-type {
      border-bottom: none;
    }

    .compare-row span:first-child {
      color: var(--ion-color-medium);
    }

    .compare-row strong {
      max-width: 92px;
      text-align: right;
      font-weight: 900;
    }

    .compare-specs {
      min-height: 31px;
      margin-top: 6px;
      font-size: 8px;
      line-height: 1.4;
      color: var(--ion-color-medium);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .compare-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
      margin-top: 8px;
    }

    .compare-actions ion-button {
      min-height: 29px;
      margin: 0;
      --border-radius: 9px;
      font-size: 8px;
      font-weight: 850;
    }

    .result-quick-actions {
      display: flex;
      gap: 6px;
      margin-top: 7px;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .result-quick-actions::-webkit-scrollbar {
      display: none;
    }

    .result-chip {
      flex-shrink: 0;
      min-height: 30px;
      padding: 6px 9px;
      border-radius: 999px;
      border:
        1px solid
        rgba(var(--ion-color-primary-rgb), .18);
      background:
        transparent;
      color: var(--ion-color-primary);
      font-size: 8.5px;
      font-weight: 850;
      cursor: pointer;
    }


    /* COMPOSER */

    .composer-shell {
      position: fixed;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 100%;
      max-width: 760px;
      z-index: 1000;
      padding:
        10px 12px
        calc(8px + env(safe-area-inset-bottom));
      background: var(--ion-background-color);
      border-top:
        1px solid
        rgba(120, 120, 120, .09);
    }

    .composer {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      padding: 7px 7px 7px 12px;
      border-radius: 19px;
      border:
        1px solid
        rgba(120, 120, 120, .15);
      background:
        var(--ion-card-background, #ffffff);
      box-shadow:
        0 8px 24px
        rgba(0, 0, 0, .06);
    }

    .chat-input {
      flex: 1;
      --background: transparent;
      --padding-start: 0;
      --padding-end: 4px;
      --padding-top: 9px;
      --padding-bottom: 8px;
      --placeholder-color: var(--ion-color-medium);
      font-size: 12.5px;
    }

    .send-button {
      width: 43px;
      height: 43px;
      flex-shrink: 0;
      margin: 0;
      --border-radius: 14px;
      --box-shadow: none;
    }

    .footer-note {
      margin-top: 6px;
      text-align: center;
      font-size: 8.5px;
      line-height: 1.35;
      color: var(--ion-color-medium);
      opacity: .86;
    }

    @media (max-width: 360px) {
      .ai-products {
        grid-template-columns: 1fr;
      }
    }
  `],

  template: `
<ion-header class="chat-header">
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/home">
      </ion-back-button>
    </ion-buttons>

    <ion-title>
      <div class="chat-title-wrap">
        <span class="chat-title">
          SmileHub AI
        </span>
        <span
          class="online-dot"
          aria-label="Online">
        </span>
      </div>
    </ion-title>

    <ion-buttons slot="end">

      <ion-button
        class="chat-cart-button"
        fill="clear"
        aria-label="Open cart"
        (click)="viewCart()">

        <ion-icon
          name="cart-outline">
        </ion-icon>

        <ion-badge
          class="chat-cart-badge"
          color="danger"
          *ngIf="state.cartCount > 0">

          {{ badgeText(state.cartCount) }}

        </ion-badge>

      </ion-button>

      <ion-button
        class="clear-chat-button"
        fill="clear"
        [disabled]="messages.length === 0"
        (click)="clearChat()">
        Clear
      </ion-button>

    </ion-buttons>
  </ion-toolbar>
</ion-header>

<ion-content
  #chatContent
  class="chat-content">

  <div class="chat-shell">

    <div
      class="welcome-card"
      *ngIf="messages.length === 0">

      <div class="welcome-top">
        <div class="bot-avatar">
          🤖
        </div>

        <div>
          <div class="welcome-name">
            SmileHub AI Assistant
            <span class="online-dot"></span>
          </div>

          <div class="welcome-status">
            Online • Ready to help
          </div>
        </div>
      </div>

      <p class="welcome-copy">
        Ask about SmileHub products,
        prices, stock, comparisons,
        shopping, cart actions,
        order tracking, cancellation,
        and other available store
        information.
      </p>

      <div class="quick-label">
        Try asking
      </div>

      <div class="quick-actions">

        <button
          class="quick-chip"
          type="button"
          (click)="askQuick(
            'Find in-stock toothbrushes under ₱500.'
          )">
          🪥 Under ₱500
        </button>

        <button
          class="quick-chip"
          type="button"
          (click)="askQuick(
            'Show me up to 4 products that are currently in stock.'
          )">
          ✅ In-stock products
        </button>

        <button
          class="quick-chip"
          type="button"
          (click)="askQuick(
            'Compare 2 to 3 in-stock toothbrushes by price, stock, rating, and key specs.'
          )">
          ⚖️ Compare
        </button>

        <button
          class="quick-chip"
          type="button"
          (click)="askQuick(
            'What products do you recommend?'
          )">
          ✨ Recommend
        </button>

        <button
          class="quick-chip"
          type="button"
          (click)="askQuick(
            'What is in my cart and what is my current total?'
          )">
          🛒 My cart
        </button>

        <button
          class="quick-chip"
          type="button"
          (click)="askQuick(
            'What is the status of my latest order?'
          )">
          📦 Latest order
        </button>

        <button
          class="quick-chip"
          type="button"
          (click)="askQuick(
            'How can I cancel my order?'
          )">
          ↩️ Cancellation
        </button>

      </div>
    </div>

    <div class="messages">
      <div
        class="message-row"
        *ngFor="let message of messages"
        [class.user]="message.role === 'user'"
        [class.assistant]="message.role === 'assistant'">

        <div
          class="message-avatar"
          *ngIf="message.role === 'assistant'">
          🤖
        </div>

        <div class="message-stack">
          <div class="message-bubble">
            {{ message.content }}
          </div>

          <div
            class="ai-products"
            *ngIf="
              message.role === 'assistant'
              &&
              message.displayMode !== 'compare'
              &&
              recommendedProducts(message).length > 0
            ">

            <div
              class="ai-product-card"
              *ngFor="
                let product
                of recommendedProducts(message)
              "
              (click)="viewProduct(product.id)">

              <div class="ai-product-image-wrap">
                <img
                  class="ai-product-image"
                  [src]="product.imageAsset"
                  [alt]="product.name">
              </div>

              <div class="ai-product-body">
                <div class="ai-product-brand">
                  {{ product.brand }}
                </div>

                <div class="ai-product-name">
                  {{ product.name }}
                </div>

                <div class="ai-product-price">
                  {{ money(product.price) }}
                </div>

                <div class="ai-product-meta">
                  <span
                    [class.stock-ok]="!isOutOfStock(product)"
                    [class.stock-out]="isOutOfStock(product)">
                    {{ stockText(product) }}
                  </span>

                  <span *ngIf="Number(product.rating || 0) > 0">
                    ★ {{ Number(product.rating).toFixed(1) }}
                  </span>
                </div>

                <div class="ai-product-actions">
                  <ion-button
                    size="small"
                    fill="outline"
                    (click)="
                      viewProductFromCard(
                        $event,
                        product.id
                      )
                    ">
                    View
                  </ion-button>

                  <ion-button
                    size="small"
                    [disabled]="isOutOfStock(product)"
                    (click)="
                      addRecommendedToCart(
                        $event,
                        product
                      )
                    ">
                    Add
                  </ion-button>
                </div>
              </div>
            </div>
          </div>

          <!-- AI PRODUCT COMPARISON -->

          <div
            class="ai-comparison"
            *ngIf="
              message.role === 'assistant'
              &&
              message.displayMode === 'compare'
              &&
              recommendedProducts(message).length >= 2
            ">

            <div class="compare-heading">
              <span>
                ⚖️ Product comparison
              </span>

              <span>
                {{
                  recommendedProducts(message).length
                }}
                products
              </span>
            </div>

            <div class="compare-scroll">

              <div
                class="compare-card"
                *ngFor="
                  let product
                  of recommendedProducts(message)
                "
                (click)="viewProduct(product.id)">

                <div class="compare-image-wrap">

                  <img
                    class="compare-image"
                    [src]="product.imageAsset"
                    [alt]="product.name">

                </div>

                <div class="compare-body">

                  <div class="compare-brand">
                    {{ product.brand }}
                  </div>

                  <div class="compare-name">
                    {{ product.name }}
                  </div>

                  <div class="compare-row">
                    <span>Price</span>
                    <strong>
                      {{ money(product.price) }}
                    </strong>
                  </div>

                  <div class="compare-row">
                    <span>Stock</span>
                    <strong
                      [class.stock-ok]="!isOutOfStock(product)"
                      [class.stock-out]="isOutOfStock(product)">
                      {{ stockText(product) }}
                    </strong>
                  </div>

                  <div class="compare-row">
                    <span>Rating</span>
                    <strong>
                      {{
                        Number(product.rating || 0) > 0
                          ? '★ ' + Number(product.rating).toFixed(1)
                          : 'No rating'
                      }}
                    </strong>
                  </div>

                  <div
                    class="compare-specs"
                    *ngIf="comparisonSpecs(product)">

                    {{ comparisonSpecs(product) }}

                  </div>

                  <div class="compare-actions">

                    <ion-button
                      size="small"
                      fill="outline"
                      (click)="
                        viewProductFromCard(
                          $event,
                          product.id
                        )
                      ">
                      View
                    </ion-button>

                    <ion-button
                      size="small"
                      [disabled]="isOutOfStock(product)"
                      (click)="
                        addRecommendedToCart(
                          $event,
                          product
                        )
                      ">
                      Add
                    </ion-button>

                  </div>

                </div>

              </div>

            </div>

          </div>


          <!-- CONTEXTUAL AI ACTIONS -->

          <div
            class="result-quick-actions"
            *ngIf="
              message.role === 'assistant'
              &&
              recommendedProducts(message).length >= 2
            ">

            <button
              *ngIf="
                message.displayMode !== 'compare'
              "
              class="result-chip"
              type="button"
              (click)="askQuick(
                'Compare the products you just showed me by price, stock, rating, and key differences.'
              )">
              ⚖️ Compare these
            </button>

            <button
              *ngIf="
                message.displayMode === 'compare'
              "
              class="result-chip"
              type="button"
              (click)="askQuick(
                'Which of the products you just compared is the cheapest option that is currently in stock?'
              )">
              💸 Cheapest available
            </button>

            <button
              class="result-chip"
              type="button"
              (click)="askQuick(
                'From the products you just showed me, which ones are currently in stock?'
              )">
              ✅ In stock only
            </button>

          </div>


          <div class="message-time">
            {{ message.time | date:'shortTime' }}
          </div>
        </div>
      </div>

      <div
        class="message-row assistant"
        *ngIf="sending">

        <div class="message-avatar">
          🤖
        </div>

        <div class="message-stack">
          <div
            class="message-bubble typing-bubble">
            <ion-spinner name="dots">
            </ion-spinner>
            Thinking...
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="composer-shell">
    <div class="composer">
      <ion-textarea
        class="chat-input"
        [(ngModel)]="input"
        placeholder="Message SmileHub AI..."
        [autoGrow]="true"
        [rows]="1"
        [maxlength]="600"
        [disabled]="sending"
        (keydown.enter)="handleEnter($event)">
      </ion-textarea>

      <ion-button
        class="send-button"
        [disabled]="sending || !input.trim()"
        (click)="send()">

        <ion-icon
          *ngIf="!sending"
          name="send-outline">
        </ion-icon>

        <ion-spinner
          *ngIf="sending"
          name="crescent">
        </ion-spinner>
      </ion-button>
    </div>

    <div class="footer-note">
      SmileHub AI uses store
      information supplied by the app.
    </div>
  </div>
</ion-content>
`
})
export class ChatbotPage implements OnDestroy {
  @ViewChild('chatContent')
  chatContent?: IonContent;

  input = '';
  sending = false;

  messages: UiChatMessage[] = [];

  private orders: any[] = [];
  private ordersSubscription?: Subscription;

  private readonly chatStorageKey =
    'smilehub_ai_chat_history';

  readonly Number = Number;

  constructor(
    private chatbot: ChatbotService,
    public state: AppStateService,
    private orderService: OrderService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.loadChatHistory();

    this.ordersSubscription =
      this.orderService
        .watchMyOrders()
        .subscribe({
          next: orders => {
            this.orders =
              Array.isArray(orders)
                ? orders
                : [];
          },
          error: error => {
            console.warn(
              'Unable to load orders for AI context:',
              error
            );

            this.orders = [];
          }
        });
  }

  ngOnDestroy(): void {
    this.ordersSubscription
      ?.unsubscribe();
  }

  askQuick(
    question: string
  ): void {
    if (this.sending) {
      return;
    }

    this.input = question;
    void this.send();
  }

  handleEnter(
    event: KeyboardEvent
  ): void {
    if (event.shiftKey) {
      return;
    }

    event.preventDefault();
    void this.send();
  }

  async send(): Promise<void> {
    if (this.sending) {
      return;
    }

    const message =
      this.input.trim();

    if (!message) {
      return;
    }

    const previousHistory:
      ChatMessage[] =
      this.messages
        .slice(-10)
        .map(row => ({
          role: row.role,
          content: row.content
        }));

    this.messages.push({
      role: 'user',
      content: message,
      time: new Date()
    });

    this.saveChatHistory();

    this.input = '';
    this.sending = true;
    this.scrollToBottom();

    try {
      const response =
        await this.chatbot
          .sendMessage(
            message,
            this.buildContext(),
            previousHistory
          );

      let assistantText =
        this.cleanAiText(
          response.reply
        );


      if (
        response.cartAction
      ) {


        const cartResult =
          await this.executeCartAction(

            response.cartAction,

            message

          );


        if (
          cartResult
        ) {


          assistantText =
            `${assistantText}\n\n${cartResult}`;


        }


      }


      this.messages.push({

        role:
          'assistant',

        content:
          assistantText,

        productIds:
          this.normalizeProductIds(
            response.productIds
          ),

        displayMode:
          response.displayMode,

        time:
          new Date()

      });


      this.saveChatHistory();
    } catch (error: any) {
      console.error(
        'Chatbot error:',
        error
      );

      this.messages.push({
        role: 'assistant',
        content:
          this.chatErrorMessage(
            error
          ),
        productIds: [],
        displayMode: 'products',
        time: new Date()
      });

      this.saveChatHistory();
    } finally {
      this.sending = false;
      this.scrollToBottom();
    }
  }

  recommendedProducts(
    message: UiChatMessage
  ): any[] {
    const ids =
      Array.isArray(message.productIds)
        ? message.productIds
        : [];

    if (!ids.length) {
      return [];
    }

    return ids
      .map(id =>
        this.state.products.find(
          product =>
            String(product.id) ===
            String(id)
        )
      )
      .filter(Boolean)
      .slice(0, 4);
  }

  viewProduct(
    productId: number | string
  ): void {
    this.router.navigate([
      '/product-details',
      productId
    ]);
  }

  viewProductFromCard(
    event: Event,
    productId: number | string
  ): void {
    event.stopPropagation();
    this.viewProduct(productId);
  }

  async addRecommendedToCart(
    event: Event,
    product: any
  ): Promise<void> {
    event.stopPropagation();

    if (
      !product ||
      this.isOutOfStock(product)
    ) {
      return;
    }

    this.state.addToCart(
      product.id
    );

    const toast =
      await this.toastController
        .create({
          message:
            `${product.name} added to cart.`,
          duration: 1400,
          position: 'bottom'
        });

    await toast.present();
  }

  viewCart():
    void {


    void this.router
      .navigateByUrl(
        '/cart'
      );


  }



  badgeText(
    value: number
  ):
    string {


    return value > 99
      ? '99+'
      : String(
          value
        );


  }



  comparisonSpecs(
    product: any
  ):
    string {


    const specs =
      Array.isArray(
        product?.specs
      )
        ? product.specs
        : [];


    return specs
      .slice(
        0,
        2
      )
      .map(
        (item: any) =>
          String(
            item || ''
          )
            .trim()
      )
      .filter(
        Boolean
      )
      .join(
        ' • '
      );


  }



  private latestShownProductIds():
    Array<number | string> {


    for (
      let index =
        this.messages.length - 1;

      index >= 0;

      index--
    ) {


      const message =
        this.messages[index];


      if (
        message.role ===
          'assistant'
        &&
        Array.isArray(
          message.productIds
        )
        &&
        message.productIds.length > 0
      ) {


        return this
          .normalizeProductIds(
            message.productIds
          )
          .slice(
            0,
            4
          );


      }


    }


    return [];


  }



  private availableStockFor(
    product: any
  ):
    number | null {


    const count =
      Number(
        product?.stockCount
      );


    if (
      Number.isFinite(
        count
      )
    ) {


      return Math.max(
        0,
        Math.floor(
          count
        )
      );


    }


    const raw =
      String(
        product?.stock ?? ''
      )
        .trim();


    if (
      /^\d+$/.test(
        raw
      )
    ) {


      return Math.max(
        0,
        Number(
          raw
        )
      );


    }


    const stock =
      raw.toLowerCase();


    if (
      stock === '0'
      ||
      stock.includes(
        'out of stock'
      )
      ||
      stock.includes(
        'sold out'
      )
      ||
      stock.includes(
        'unavailable'
      )
    ) {


      return 0;


    }


    return null;


  }



  private async executeCartAction(
    action: ChatbotCartAction,
    originalMessage: string
  ):
    Promise<string> {

    const filipino =
      this.prefersFilipino(
        originalMessage
      );

    const actionType =
      action?.action ||
      'add';

    if (
      actionType === 'clear'
    ) {

      if (
        this.state.cartCount <= 0
      ) {
        return filipino
          ? 'Wala nang laman ang cart mo.'
          : 'Your cart is already empty.';
      }

      this.state
        .clearCartAfterOrder();

      const toast =
        await this.toastController
          .create({
            message:
              'Cart cleared.',
            duration:
              1500,
            position:
              'bottom'
          });

      await toast.present();

      return filipino
        ? '✅ Na-clear na ang cart mo.'
        : '✅ Your cart has been cleared.';
    }

    const product =
      this.state.products
        .find(
          item =>
            String(
              item.id
            )
            ===
            String(
              action.productId
            )
        );

    if (!product) {
      return filipino
        ? 'Hindi ko ma-update ang cart dahil hindi ko mahanap ang exact product.'
        : 'I could not update the cart because the exact product could not be found.';
    }

    const existing =
      this.state
        .quantityFor(
          product.id
        );

    if (
      actionType === 'remove'
    ) {

      if (
        existing <= 0
      ) {
        return filipino
          ? `Wala sa cart mo ang ${product.name}.`
          : `${product.name} is not currently in your cart.`;
      }

      this.state
        .removeFromCart(
          product.id
        );

      const toast =
        await this.toastController
          .create({
            message:
              `${product.name} removed from cart.`,
            duration:
              1500,
            position:
              'bottom'
          });

      await toast.present();

      return filipino
        ? `✅ Tinanggal na ang ${product.name} sa cart mo.`
        : `✅ Removed ${product.name} from your cart.`;
    }

    const stock =
      this.availableStockFor(
        product
      );

    if (
      actionType === 'set'
    ) {

      const requested =
        Math.max(
          0,
          Math.min(
            20,
            Math.floor(
              Number(
                action.quantity ?? 1
              )
            )
          )
        );

      if (
        requested <= 0
      ) {
        this.state
          .removeFromCart(
            product.id
          );

        return filipino
          ? `✅ Tinanggal na ang ${product.name} sa cart mo.`
          : `✅ Removed ${product.name} from your cart.`;
      }

      if (
        stock !== null
        &&
        stock <= 0
      ) {
        return filipino
          ? `Hindi ma-set ang quantity ng ${product.name} dahil out of stock ito.`
          : `The quantity for ${product.name} cannot be changed because it is out of stock.`;
      }

      const finalQuantity =
        stock !== null
          ? Math.min(
              requested,
              stock
            )
          : requested;

      this.state
        .setCartQuantity(
          product.id,
          finalQuantity
        );

      const toast =
        await this.toastController
          .create({
            message:
              `${product.name} quantity set to ${finalQuantity}.`,
            duration:
              1500,
            position:
              'bottom'
          });

      await toast.present();

      if (
        finalQuantity < requested
      ) {
        return filipino
          ? `✅ Ginawang ${finalQuantity} ang quantity ng ${product.name}. In-adjust ito ayon sa available stock.`
          : `✅ Set ${product.name} quantity to ${finalQuantity}. It was adjusted to the available stock.`;
      }

      return filipino
        ? `✅ Ginawang ${finalQuantity} ang quantity ng ${product.name} sa cart mo.`
        : `✅ Set ${product.name} quantity to ${finalQuantity}.`;
    }

    if (
      stock !== null
      &&
      stock <= 0
    ) {
      return filipino
        ? `Hindi na-add ang ${product.name} dahil out of stock ito.`
        : `${product.name} was not added because it is out of stock.`;
    }

    const requested =
      Math.max(
        1,
        Math.min(
          20,
          Math.floor(
            Number(
              action.quantity || 1
            )
          )
        )
      );

    let quantityToAdd =
      requested;

    if (
      stock !== null
    ) {

      const remaining =
        Math.max(
          0,
          stock - existing
        );

      if (
        remaining <= 0
      ) {
        return filipino
          ? `Hindi na-add ang ${product.name}. Nasa cart mo na ang lahat ng available stock.`
          : `${product.name} was not added because all available stock is already in your cart.`;
      }

      quantityToAdd =
        Math.min(
          requested,
          remaining
        );
    }

    this.state
      .addToCart(
        product.id,
        quantityToAdd
      );

    const toast =
      await this.toastController
        .create({
          message:
            `${quantityToAdd} × ${product.name} added to cart.`,
          duration:
            1500,
          position:
            'bottom'
        });

    await toast.present();

    if (
      quantityToAdd <
      requested
    ) {
      return filipino
        ? `✅ Na-add sa cart mo ang ${quantityToAdd} × ${product.name}. In-adjust ang quantity ayon sa current stock.`
        : `✅ Added ${quantityToAdd} × ${product.name} to your cart. The quantity was adjusted to current stock.`;
    }

    return filipino
      ? `✅ Na-add sa cart mo ang ${quantityToAdd} × ${product.name}.`
      : `✅ Added ${quantityToAdd} × ${product.name} to your cart.`;
  }


  private prefersFilipino(
    value: string
  ):
    boolean {


    const text =
      String(
        value || ''
      )
        .toLowerCase();


    return [
      'ang ',
      'mga ',
      'sa ',
      'ko ',
      'mo ',
      'ng ',
      'may ',
      'paki',
      'pakilagay',
      'ilagay',
      'idagdag',
      'dagdag',
      'gusto',
      'pwede',
      'puwede'
    ]
      .some(
        token =>
          text.includes(
            token
          )
      );


  }



  isOutOfStock(
    product: any
  ): boolean {


    const stock =
      this.availableStockFor(
        product
      );


    if (
      stock !== null
    ) {


      return stock <= 0;


    }


    return false;


  }



  stockText(
    product: any
  ): string {


    const stock =
      this.availableStockFor(
        product
      );


    if (
      stock !== null
    ) {


      if (
        stock <= 0
      ) {


        return 'Out of stock';


      }


      return `${stock} in stock`;


    }


    return 'In stock';


  }



  money(
    value: number
  ): string {
    return new Intl.NumberFormat(
      'en-PH',
      {
        style: 'currency',
        currency: 'PHP'
      }
    ).format(
      Number(value || 0)
    );
  }

  private normalizeProductIds(
    ids: Array<number | string>
  ): Array<number | string> {
    if (!Array.isArray(ids)) {
      return [];
    }

    const result:
      Array<number | string> = [];

    for (const id of ids) {
      if (
        this.state.products.some(
          product =>
            String(product.id) ===
            String(id)
        )
        &&
        !result.some(
          existing =>
            String(existing) ===
            String(id)
        )
      ) {
        result.push(id);
      }

      if (
        result.length >= 4
      ) {
        break;
      }
    }

    return result;
  }

  private normalizeOrderStatusForAi(
    status: any
  ): string {
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

  private orderDateIso(
    value: any
  ): string {
    try {
      if (
        value
        &&
        typeof value.toDate ===
          'function'
      ) {
        return value
          .toDate()
          .toISOString();
      }

      if (
        value instanceof Date
      ) {
        return value
          .toISOString();
      }

      if (value) {
        const parsed =
          new Date(value);

        if (
          !Number.isNaN(
            parsed.getTime()
          )
        ) {
          return parsed
            .toISOString();
        }
      }
    } catch {
      // Leave unknown dates blank.
    }

    return '';
  }

  private buildContext() {
    const products =
      this.state.products.map(
        (product: any) => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price:
            Number(
              product.price || 0
            ),
          stockCount:
            Number(
              product.stockCount ?? 0
            ),
          stockStatus:
            product.stock,
          rating:
            Number(
              product.rating || 0
            ),
          reviewCount:
            Number(
              product.reviewCount || 0
            ),
          description:
            product.description || '',
          sku:
            product.sku || '',
          specs:
            product.specs || []
        })
      );

    const cart =
      Array.from(
        this.state.cart.entries()
      )
        .map(
          (
            [
              productId,
              quantity
            ]
          ) => {


            const product =
              this.state.products
                .find(
                  item =>
                    item.id ===
                    productId
                );


            const unitPrice =
              Number(
                product?.price || 0
              );

            return {

              productId,

              name:
                product?.name || '',

              quantity,

              unitPrice,

              lineTotal:
                unitPrice * quantity

            };


          }
        );


    const orders =
      this.orders
        .slice(0, 10)
        .map(
          (order: any) => {
            const status =
              this.normalizeOrderStatusForAi(
                order?.status
              );

            const items =
              Array.isArray(
                order?.items
              )
                ? order.items
                    .map(
                      (item: any) => ({
                        productId:
                          item?.productId,
                        name:
                          String(
                            item?.name || ''
                          ),
                        quantity:
                          Number(
                            item?.quantity || 0
                          ),
                        unitPrice:
                          Number(
                            item?.price || 0
                          ),
                        lineTotal:
                          Number(
                            item?.lineTotal
                            ??
                            (
                              Number(
                                item?.price || 0
                              )
                              *
                              Number(
                                item?.quantity || 0
                              )
                            )
                          )
                      })
                    )
                    .filter(
                      (item: any) =>
                        item.quantity > 0
                    )
                : [];

            const calculatedItemCount =
              items.reduce(
                (
                  total: number,
                  item: any
                ) =>
                  total
                  +
                  Number(
                    item.quantity || 0
                  ),
                0
              );

            return {
              orderId:
                String(
                  order?.orderId
                  ||
                  order?.id
                  ||
                  ''
                ),
              orderNumber:
                String(
                  order?.orderNumber
                  ||
                  order?.id
                  ||
                  ''
                ),
              status,
              canCancel:
                [
                  'Pending',
                  'Processing'
                ].includes(status),
              itemCount:
                Number(
                  order?.itemCount
                  ??
                  calculatedItemCount
                ),
              items,
              subtotal:
                Number(
                  order?.subtotal || 0
                ),
              shippingFee:
                Number(
                  order?.shippingFee || 0
                ),
              discount:
                Number(
                  order?.discount || 0
                ),
              total:
                Number(
                  order?.total || 0
                ),
              paymentMethod:
                String(
                  order?.paymentMethod || ''
                ),
              deliveryMethod:
                String(
                  order?.deliveryMethod || ''
                ),
              createdAt:
                this.orderDateIso(
                  order?.createdAt
                )
            };
          }
        );

    return {

      store: {
        name:
          'SmileHub',

        business:
          'Dental supplies ecommerce store'
      },

      products,

      cart,

      cartSummary: {

        itemCount:
          this.state.cartCount,

        subtotal:
          this.state.subtotal,

        shippingFee:
          this.state.shippingFee,

        discount:
          this.state.discount,

        total:
          this.state.total

      },

      orders,

      orderSummary: {
        totalOrders:
          orders.length,
        latestOrderId:
          orders[0]?.orderId || '',
        latestOrderNumber:
          orders[0]?.orderNumber || '',
        latestStatus:
          orders[0]?.status || ''
      },

      chatState: {

        lastShownProductIds:
          this.latestShownProductIds()

      },

      policies: {
        cancellation:
          'Customers may cancel an order only while its status is Pending or Processing. Once the order is Shipped, Delivered, or already Cancelled, it can no longer be cancelled through the customer cancellation flow.',

        reviews:
          'Customers can rate and review products after the order has been Delivered.',

        stock:
          'Product stock shown in the context is the current stock loaded by the SmileHub app.'
      },

      assistantRules: {
        language:
          'Reply in the same language style used by the customer: English, Tagalog, or Taglish.',

        accuracy:
          'Do not invent SmileHub products, prices, stock, or policies.'
      }
    };
  }

  private loadChatHistory(): void {
    try {
      if (
        typeof localStorage ===
        'undefined'
      ) {
        return;
      }

      const stored =
        localStorage.getItem(
          this.chatStorageKey
        );

      if (!stored) {
        return;
      }

      const parsed =
        JSON.parse(stored);

      if (
        !Array.isArray(parsed)
      ) {
        return;
      }

      this.messages =
        parsed
          .filter(
            (item: any) =>
              item
              &&
              (
                item.role === 'user'
                ||
                item.role === 'assistant'
              )
              &&
              typeof item.content ===
                'string'
          )
          .slice(-50)
          .map(
            (item: any) => ({
              role:
                item.role,
              content:
                item.content,
              productIds:
                Array.isArray(
                  item.productIds
                )
                  ? item.productIds
                  : [],

              displayMode:
                item.displayMode ===
                  'compare'
                  ? 'compare'
                  : 'products',

              time:
                item.time
                  ? new Date(
                      item.time
                    )
                  : new Date()
            })
          );
    } catch (error) {
      console.error(
        'Unable to restore AI chat history:',
        error
      );

      this.messages = [];
    }
  }

  private saveChatHistory(): void {
    try {
      if (
        typeof localStorage ===
        'undefined'
      ) {
        return;
      }

      const history =
        this.messages
          .slice(-50)
          .map(item => ({
            role:
              item.role,
            content:
              item.content,
            productIds:
              item.productIds || [],

            displayMode:
              item.displayMode || 'products',

            time:
              item.time.toISOString()
          }));

      localStorage.setItem(
        this.chatStorageKey,
        JSON.stringify(
          history
        )
      );
    } catch (error) {
      console.error(
        'Unable to save AI chat history:',
        error
      );
    }
  }

  async clearChat(): Promise<void> {
    if (
      this.messages.length === 0
    ) {
      return;
    }

    const alert =
      await this.alertController
        .create({
          header:
            'Clear chat?',

          message:
            'This will permanently clear your current SmileHub AI conversation on this device.',

          buttons: [
            {
              text:
                'Cancel',
              role:
                'cancel'
            },
            {
              text:
                'Clear',
              role:
                'destructive',
              handler:
                () => {
                  this.messages = [];
                  this.input = '';

                  try {
                    if (
                      typeof localStorage !==
                      'undefined'
                    ) {
                      localStorage.removeItem(
                        this.chatStorageKey
                      );
                    }
                  } catch (error) {
                    console.error(
                      'Unable to clear AI chat history:',
                      error
                    );
                  }
                }
            }
          ]
        });

    await alert.present();
  }

  private scrollToBottom(): void {
    setTimeout(
      () => {
        this.chatContent
          ?.scrollToBottom(
            280
          );
      },
      80
    );
  }

  private cleanAiText(
    value: string
  ): string {
    return String(
      value || ''
    )
      .replace(
        /\*\*(.*?)\*\*/g,
        '$1'
      )
      .replace(
        /__(.*?)__/g,
        '$1'
      )
      .replace(
        /`([^`]+)`/g,
        '$1'
      )
      .replace(
        /^#{1,6}\s+/gm,
        ''
      )
      .trim();
  }

  private chatErrorMessage(
    error: any
  ): string {
    if (
      error?.status === 0
    ) {
      return 'I cannot connect to the SmileHub AI server right now. Please make sure the chatbot server is running.';
    }

    if (
      error?.status === 429
    ) {
      return 'The AI assistant is busy right now. Please try again in a moment.';
    }

    return (
      error?.error?.error
      ||
      'Sorry, I could not answer that right now. Please try again.'
    );
  }
}
