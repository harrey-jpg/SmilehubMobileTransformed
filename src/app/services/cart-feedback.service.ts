import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Firmness } from '../models/product';
import { AppStateService } from './app-state.service';

/** Presentation-only feedback. Cart persistence and quantity controls stay in AppStateService. */
@Injectable({ providedIn: 'root' })
export class CartFeedbackService implements OnDestroy {
  readonly feedbackDuration = 750;
  private readonly locks = new Map<number, ReturnType<typeof setTimeout>>();
  private readonly animations = new Map<Element, Animation>();
  private readonly frames = new Set<number>();
  private toast?: HTMLIonToastElement;
  private toastRevision = 0;

  constructor(
    private state: AppStateService,
    private toastController: ToastController,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {}

  isAdding(productId: number): boolean {
    return this.locks.has(productId);
  }

  /** Locks one product synchronously, including taps on another copy of its card. */
  add(productId: number, quantity = 1, firmness?: Firmness | '', event?: Event): boolean {
    if (this.isAdding(productId) || !Number.isSafeInteger(quantity) || quantity < 1) return false;
    const product = this.state.products.find(item => item.id === productId);
    if (!product) return false;

    const before = this.state.quantityFor(productId);
    this.locks.set(productId, setTimeout(() => this.locks.delete(productId), this.feedbackDuration));
    try {
      this.state.addToCart(productId, quantity, firmness);
    } catch (error) {
      this.unlock(productId);
      throw error;
    }
    if (this.state.quantityFor(productId) <= before) {
      this.unlock(productId);
      return false;
    }

    // Animation failure must never turn a successful cart update into a failed purchase action.
    try { this.animateFeedback(event?.currentTarget, before === 0); } catch { /* Optional effect. */ }
    void this.confirm();
    return true;
  }

  private unlock(productId: number): void {
    const timer = this.locks.get(productId);
    if (timer !== undefined) clearTimeout(timer);
    this.locks.delete(productId);
  }

  private animateFeedback(target: EventTarget | null | undefined, newProduct: boolean): void {
    const view = this.document.defaultView;
    if (!view || view.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    this.zone.runOutsideAngular(() => {
      const button = target as HTMLElement | null | undefined;
      if (button?.animate) {
        this.animate(button, [
          { transform: 'scale(1)' },
          { transform: 'scale(.96)', offset: .25 },
          { transform: 'scale(1.025)', offset: .65 },
          { transform: 'scale(1)' }
        ], 340);
      }
      if (!newProduct) return;
      // Wait until Angular has inserted the first badge before animating it.
      const frame = view.requestAnimationFrame(() => {
        this.frames.delete(frame);
        for (const badge of Array.from(this.document.querySelectorAll<HTMLElement>('[data-cart-badge]'))) {
          if (badge.closest('.ion-page-hidden') || !badge.getClientRects().length) continue;
          this.animate(badge, [
            { transform: 'scale(1)' },
            { transform: 'scale(1.25)', offset: .4 },
            { transform: 'scale(.96)', offset: .75 },
            { transform: 'scale(1)' }
          ], 420);
        }
      });
      this.frames.add(frame);
    });
  }

  private animate(element: HTMLElement, frames: Keyframe[], duration: number): void {
    if (!element.animate) return;
    this.animations.get(element)?.cancel();
    const animation = element.animate(frames, { duration, easing: 'cubic-bezier(.2,.8,.25,1)' });
    this.animations.set(element, animation);
    const clear = () => {
      if (this.animations.get(element) === animation) this.animations.delete(element);
    };
    animation.onfinish = clear;
    animation.oncancel = clear;
  }

  private async confirm(): Promise<void> {
    const revision = ++this.toastRevision;
    try {
      const previous = this.toast;
      this.toast = undefined;
      await previous?.dismiss();
      if (revision !== this.toastRevision) return;
      const toast = await this.toastController.create({
        message: 'Added to Cart',
        icon: 'checkmark-circle-outline',
        duration: 1100,
        position: 'top',
        positionAnchor: this.document.querySelector<HTMLElement>('ion-router-outlet > .ion-page:not(.ion-page-hidden) > ion-header') || undefined,
        animated: !this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
        cssClass: 'smilehub-cart-toast',
        htmlAttributes: { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' }
      });
      if (revision !== this.toastRevision) { toast.remove(); return; }
      this.toast = toast;
      await toast.present();
      if (revision !== this.toastRevision) await toast.dismiss();
    } catch {
      // The button's checkmark remains available even if an Ionic overlay cannot be shown.
    }
  }

  ngOnDestroy(): void {
    ++this.toastRevision;
    for (const timer of this.locks.values()) clearTimeout(timer);
    for (const frame of this.frames) this.document.defaultView?.cancelAnimationFrame(frame);
    for (const animation of this.animations.values()) animation.cancel();
    this.locks.clear();
    this.frames.clear();
    this.animations.clear();
    void this.toast?.dismiss().catch(() => {});
  }
}
