import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'app-gcash-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
  styles: [`
    .gcash-panel { padding:20px; margin:16px 0; border:1px solid rgba(5,130,153,.16);
      background:var(--ion-card-background, #fff); border-radius:18px; text-align:center; }
    .gcash-panel h2 { margin:0 0 6px; color:var(--ion-color-primary,#087c94); font-size:20px; font-weight:850; }
    .gcash-panel p { font-size:13px; line-height:1.6; color:var(--ion-text-color,#172437); }
    .gcash-qr { max-width:280px; background:white; padding:12px; border-radius:16px;
      margin:16px auto; box-shadow:0 5px 22px rgba(0,0,0,.06); }
    .gcash-qr img { display:block; width:100%; height:auto; }
    .gcash-total { font-size:26px; font-weight:900; color:var(--ion-color-primary,#087c94); }
    .gcash-ref-label { display:block; margin:18px 0 7px; font-weight:800; font-size:13px; text-align:left; }
    .gcash-input { width:100%; min-height:46px; padding:12px 14px; background:var(--ion-background-color,#fff);
      color:var(--ion-text-color,#172437); border:1px solid #b8cdd6; border-radius:12px; box-sizing:border-box; font-size:16px; }
    .gcash-input:focus { border-color:#087c94; box-shadow:0 0 0 3px rgba(8,124,148,.12); }
    .gcash-button { width:100%; margin-top:13px; min-height:46px; border:0; border-radius:12px;
      background:var(--ion-color-primary,#087c94); color:var(--ion-color-primary-contrast,white); font-weight:800; font-size:14px; }
    .gcash-button:disabled { opacity:.6; }
    .gcash-save { display:inline-block; font-weight:750; font-size:13px; margin-top:7px; color:var(--ion-color-primary,#087c94); }
    .gcash-state { padding:12px; border-radius:12px; background:rgba(8,124,148,.08);
      margin:14px 0; line-height:1.6; font-size:13px; text-align:left; }
    .gcash-state strong { display:block; font-size:15px; margin-bottom:4px; }
    .gcash-help { font-size:12px!important; color:var(--ion-color-medium,#657482)!important; }
    .gcash-error { margin-top:10px; color:var(--ion-color-danger,#c53030)!important; }
    .gcash-success { color:var(--ion-text-color,#172437); }
    .gcash-button:focus-visible, .gcash-save:focus-visible { outline:2px solid var(--ion-color-primary,#087c94); outline-offset:3px; }
    @media(prefers-reduced-motion:no-preference) { .gcash-panel { animation:gcashIn .35s ease both; }
      @keyframes gcashIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } } }
  `],
  template: `
    <section class="gcash-panel" *ngIf="isGcash" aria-label="GCash payment">
      <h2>GCash Payment</h2>
      <p>Order number: <strong>{{ orderNumber || orderId }}</strong></p>

      <div *ngIf="isPaid" class="gcash-state" role="status">
        <strong class="gcash-success">✓ Payment verified</strong>
        Your GCash payment was verified by SmileHub. Thank you!
      </div>

      <div *ngIf="orderStatus === 'Cancelled'" class="gcash-state" role="status">
        <strong>Order cancelled</strong>
        This order can no longer be paid.
      </div>

      <p *ngIf="!loaded && !unavailable" role="status">Loading payment status…</p>
      <p *ngIf="unavailable" role="status">Payment status is unavailable. Check your connection.</p>
      <ion-button *ngIf="unavailable" fill="outline" (click)="watch()">Retry payment status</ion-button>
      <p *ngIf="progress" role="status" aria-live="polite">{{ progress }}</p>
      <ng-container *ngIf="loaded && !unavailable && !isPaid && orderStatus !== 'Cancelled'">
        <div *ngIf="claim?.status === 'For Verification'" class="gcash-state" role="status">
          <strong>For Verification</strong>
          We received your reference <b>{{ claim.reference }}</b>.
          SmileHub staff must check the real GCash transfer before marking this order Paid.
        </div>
        <div *ngIf="claim?.status === 'Rejected'" class="gcash-state" role="status">
          <strong>Payment needs correction</strong>
          {{ claim.reason || 'The submitted reference could not be verified.' }}
          Please check the payment and submit the correct reference.
        </div>
        <div *ngIf="!claim || claim.status === 'Rejected'">
          <p>Scan the SmileHub GCash QR using your GCash app. Double-check the recipient before sending money.</p>
          <div class="gcash-qr">
            <img src="assets/payments/gcash-qr.png" alt="SmileHub GCash InstaPay QR code">
          </div>
          <div>Exact amount to pay</div>
          <div class="gcash-total">{{ total | currency:'PHP':'symbol':'1.2-2' }}</div>
          <a class="gcash-save" href="assets/payments/gcash-qr.png" download="SmileHub-GCash-QR.png">
            Save QR image
          </a>
          <label class="gcash-ref-label" for="gcash-reference-{{ orderId }}">GCash transaction reference number</label>
          <input class="gcash-input" [id]="'gcash-reference-' + orderId"
            [(ngModel)]="reference" maxlength="40" autocomplete="off"
            placeholder="Enter reference from your GCash receipt">
          <button class="gcash-button" type="button" [disabled]="submitting || !reference.trim()"
            (click)="submitReference()">
            {{ submitting ? 'Submitting...' : 'Submit Payment Reference' }}
          </button>
          <p class="gcash-help">Submit only after making the transfer. Keep your receipt or screenshot.
            Sending a reference does not automatically mark your order Paid.</p>
        </div>
      </ng-container>
      <p *ngIf="error" class="gcash-error" role="alert">{{ error }}</p>
    </section>
  `
})
export class GcashPaymentComponent implements OnChanges, OnDestroy {
  @Input() orderId = '';
  @Input() orderNumber = '';
  @Input() paymentMethod = '';
  @Input() total = 0;
  @Input() paymentStatus = 'unpaid';
  @Input() orderStatus = '';

  claim: any = null;
  reference = '';
  error = '';
  submitting = false;
  private subscription?: Subscription;
  loaded = false;
  unavailable = false;
  progress = '';
  private timer?: ReturnType<typeof setTimeout>;
  private watchedOrderId = '';
  get canSubmit(): boolean { return this.loaded && !this.unavailable && !this.isPaid && this.orderStatus !== 'Cancelled' && (!this.claim || this.claim.status === 'Rejected'); }

  constructor(private orders: OrderService) {}

  get isGcash(): boolean { return ['GCash', 'GCash (SmileHub QR)'].includes(this.paymentMethod); }
  get isPaid(): boolean { return String(this.paymentStatus).toLowerCase() === 'paid' || this.claim?.status === 'Paid'; }

  ngOnChanges(): void {
    if (this.watchedOrderId === this.orderId && this.subscription && !this.subscription.closed) return;
    this.watch();
  }

  watch(): void {
    this.watchedOrderId = this.orderId;
    this.loaded = false; this.unavailable = false;
    this.subscription?.unsubscribe();
    this.claim = null;
    this.error = '';
    if (!this.orderId || !this.isGcash) return;
    this.subscription = this.orders.watchGcashReference(this.orderId).subscribe({
      next: claim => { this.unavailable = !!claim?.unavailable; if (!this.unavailable) { this.claim = claim; this.loaded = true; } },
      error: err => {
        console.error('Unable to read payment verification status:', err);
        this.unavailable = true; this.error = 'Payment status could not be loaded. Check your connection and retry.';
      }
    });
  }

  async submitReference(): Promise<void> {
    if (this.submitting || !this.orderId || !this.canSubmit) return;
    this.submitting = true;
    this.progress = 'Saving reference…';
    this.timer = setTimeout(() => { this.progress = 'Still saving—check your connection. Do not submit again.'; }, 10000);
    this.error = '';
    try {
      await this.orders.submitGcashReference(this.orderId, this.reference);
      this.reference = '';
    } catch (err: any) {
      console.error('GCash reference submission failed:', err);
      this.error = err?.code === 'permission-denied'
        ? 'Could not save this reference. Check your account and connection, then retry. Your entry is kept.'
        : String(err?.message || 'Could not submit the reference.');
    } finally {
      clearTimeout(this.timer); this.progress = '';
      this.submitting = false;
    }
  }

  ngOnDestroy(): void { this.subscription?.unsubscribe(); clearTimeout(this.timer); }
}
