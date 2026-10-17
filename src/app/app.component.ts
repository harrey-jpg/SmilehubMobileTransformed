import {
  Component,
  OnInit,
  OnDestroy,
  NgZone
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  addIcons
} from 'ionicons';

import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

import {
  AppStateService
} from './services/app-state.service';

import {
  firebaseAuth,
  firestore
} from './services/firebase';

import {
  homeOutline,
  gridOutline,
  cartOutline,
  personOutline,

  heart,
  heartOutline,

  searchOutline,
  medicalOutline,

  addOutline,
  addCircleOutline,
  removeOutline,

  trashOutline,

  chevronForwardOutline,

  logOutOutline,
  logInOutline,

  moonOutline,
  sunnyOutline,

  locationOutline,

  walletOutline,
  cardOutline,
  cashOutline,

  helpCircleOutline,
  headsetOutline,

  bagCheckOutline,

  arrowBackOutline,

  checkmarkOutline,
  checkmarkCircleOutline,
  checkmarkCircle,

  starOutline,

  closeOutline,

  eyeOutline,
  eyeOffOutline,

  createOutline,

  reorderFourOutline,

  shieldCheckmarkOutline,

  bicycleOutline,

  lockClosedOutline,

  callOutline,
  mailOutline,

  informationCircleOutline,

  sendOutline,

  personAddOutline,

  phonePortraitOutline,

  chatbubbleEllipsesOutline,

  receiptOutline,

  notificationsOutline
} from 'ionicons/icons';


@Component({
  selector: 'app-root',
  standalone: false,

  styles: [`


    /* =========================
       SIDE MENU
       ========================= */

    ion-split-pane {
      --side-width: 292px;
      --side-max-width: 292px;
    }

    ion-menu {
      --width: 292px;
      --min-width: 292px;
      --max-width: 292px;
    }

    .side-menu-toolbar {
      --background:
        linear-gradient(
          135deg,
          #087e95 0%,
          #0f9fb4 55%,
          #29c5d4 100%
        );

      --color: #ffffff;

      min-height: 118px;
    }

    .side-menu-brand {
      display: flex;
      align-items: center;
      gap: 12px;

      padding: 22px 18px 18px;
    }

    .side-menu-logo {
      width: 48px;
      height: 48px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 15px;

      background:
        rgba(
          255,
          255,
          255,
          .17
        );

      border:
        1px solid
        rgba(
          255,
          255,
          255,
          .19
        );

      font-size: 27px;

      box-shadow:
        0 8px 20px
        rgba(
          0,
          0,
          0,
          .09
        );
    }

    .side-menu-profile { color: #fff; text-decoration: none; }
    .side-menu-profile:focus-visible { outline: 2px solid #fff; outline-offset: -5px; }
    .side-menu-avatar {
      width: 54px; height: 54px; flex: 0 0 54px; border-radius: 50%;
      display: grid; place-items: center; overflow: hidden;
      background: rgba(255,255,255,.18); border: 2px solid rgba(255,255,255,.45);
      color: #fff; font-size: 21px; font-weight: 800;
    }
    .side-menu-avatar img { width: 100%; height: 100%; object-fit: cover; }
    .side-menu-contact { margin-top: 5px; font-size: 11px; line-height: 1.4; overflow-wrap: anywhere; }
    .side-menu-name { overflow-wrap: anywhere; }

    .side-menu-brand-copy {
      min-width: 0;
    }

    .side-menu-name {
      color: #ffffff;
      font-size: 20px;
      line-height: 1.1;
      font-weight: 950;
      letter-spacing: -.25px;
    }

    .side-menu-tagline {
      margin-top: 5px;

      color:
        rgba(
          255,
          255,
          255,
          .82
        );

      font-size: 9px;
      line-height: 1.35;
      font-weight: 700;
    }

    .side-menu-content {
      --background:
        var(
          --ion-background-color
        );
    }

    .side-menu-scroll {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      padding: 12px 0 14px;
    }

    .side-menu-section {
      margin-top: 4px;
    }

    .side-menu-section-title {
      padding: 9px 20px 6px;

      color:
        var(
          --ion-color-medium
        );

      font-size: 9px;
      line-height: 1;
      font-weight: 900;
      letter-spacing: .8px;
      text-transform: uppercase;
    }

    .side-menu-item {
      margin: 3px 10px;

      --min-height: 47px;
      --padding-start: 12px;
      --padding-end: 11px;
      --inner-padding-end: 0;
      --border-radius: 13px;
      --background: transparent;

      --color:
        var(
          --ion-text-color
        );

      font-size: 12px;
      font-weight: 800;

      transition:
        transform .16s ease;
    }

    .side-menu-item::part(native) {
      border-radius: 13px;

      transition:
        background .18s ease,
        color .18s ease,
        box-shadow .18s ease;
    }

    .side-menu-item:active {
      transform:
        scale(.985);
    }

    .side-menu-item ion-icon {
      margin-right: 12px;

      color:
        var(
          --ion-color-medium
        );

      font-size: 20px;

      transition:
        color .18s ease,
        transform .18s ease;
    }

    .side-menu-item.menu-active {
      --background:
        rgba(
          var(--ion-color-primary-rgb),
          .11
        );

      --color:
        var(
          --ion-color-primary
        );
    }

    .side-menu-item.menu-active::part(native) {
      box-shadow:
        inset
        3px
        0
        0
        var(
          --ion-color-primary
        );
    }

    .side-menu-item.menu-active ion-icon {
      color:
        var(
          --ion-color-primary
        );

      transform:
        scale(1.04);
    }

    .side-menu-divider {
      height: 1px;
      margin: 10px 18px 7px;

      background:
        rgba(
          120,
          120,
          120,
          .12
        );
    }

    .side-menu-spacer {
      flex: 1;
      min-height: 18px;
    }

    .side-menu-footer {
      padding: 12px 20px 2px;

      color:
        var(
          --ion-color-medium
        );

      font-size: 8px;
      line-height: 1.5;
      font-weight: 700;
    }

    @media (max-width: 991px) {
      ion-menu {
        --width: min(84vw, 304px);
        --min-width: 0;
        --max-width: 304px;
      }
    }


    /* =========================
       APP SPLASH
       ========================= */

    .app-splash {
      position: fixed; inset: 0; z-index: 999999;
      display: grid; place-items: center; overflow: hidden;
      background: radial-gradient(circle at 50% 42%, rgba(var(--ion-color-primary-rgb), .10), transparent 60%), var(--ion-background-color, #f5f8fb);
      opacity: 1; transition: opacity 280ms ease;
    }
    .app-splash.splash-closing { opacity: 0; pointer-events: none; }
    .splash-content { width: min(88vw, 340px); text-align: center; transform: translateY(-12px); }
    .splash-logo-stage { position: relative; width: 148px; height: 148px; margin: 0 auto; }
    .splash-halo {
      position: absolute; inset: 5px; border-radius: 50%;
      background: rgba(var(--ion-color-primary-rgb), .07);
      border: 1px solid rgba(var(--ion-color-primary-rgb), .13);
      animation: splashHalo 1.6s ease-in-out infinite;
    }
    .splash-logo {
      position: relative; width: 148px; height: 148px; display: block; object-fit: contain;
      animation: splashLogoEnter 500ms cubic-bezier(.2,.8,.25,1) both;
    }
    .splash-brand {
      margin-top: 18px; color: var(--ion-text-color); font-size: 29px;
      line-height: 1; font-weight: 950; letter-spacing: -.7px;
      animation: splashTextEnter 420ms ease 120ms both;
    }
    .splash-brand-accent { color: var(--ion-color-primary); }
    .splash-tagline {
      margin-top: 9px; color: var(--ion-color-medium); font-size: 10px;
      font-weight: 800; letter-spacing: 1.15px; text-transform: uppercase;
      animation: splashTextEnter 420ms ease 180ms both;
    }
    .splash-loading { width: 148px; margin: 24px auto 0; }
    .splash-loading-track { height: 4px; overflow: hidden; border-radius: 99px; background: rgba(var(--ion-color-primary-rgb), .12); }
    .splash-loading-bar {
      width: 45%; height: 100%; border-radius: inherit;
      background: linear-gradient(90deg, var(--ion-color-primary), #31c7d7);
      animation: splashLoadingMove 1.1s ease-in-out infinite;
    }
    .splash-loading-text { margin-top: 11px; color: var(--ion-color-medium); font-size: 11px; }
    @keyframes splashLogoEnter {
      from { opacity: 0; transform: translate3d(0, 8px, 0) scale(.92); }
      to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
    }
    @keyframes splashHalo {
      0%, 100% { transform: scale(.94); opacity: .55; }
      50% { transform: scale(1.08); opacity: 1; }
    }
    @keyframes splashTextEnter {
      from { opacity: 0; transform: translate3d(0, 6px, 0); }
      to { opacity: 1; transform: translate3d(0, 0, 0); }
    }
    @keyframes splashLoadingMove {
      0% { transform: translateX(-110%); }
      100% { transform: translateX(325%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .app-splash { transition: none; }
      .splash-logo, .splash-halo, .splash-brand, .splash-tagline, .splash-loading-bar { animation: none; }
      .splash-loading-bar { width: 100%; opacity: .6; }
    }

  `],

  template: `

    <ion-app>


      <!-- =====================
           RESPONSIVE SIDE MENU
           ===================== -->

      <ion-split-pane
        [attr.inert]="showSplash && !splashClosing ? '' : null"
        contentId="main-content"
        when="lg">


        <ion-menu
          *ngIf="menuEnabled"
          menuId="main-menu"
          contentId="main-content"
          side="start"
          type="overlay">


          <ion-header>

            <ion-toolbar class="side-menu-toolbar">

              <ion-menu-toggle [autoHide]="false">
                <a class="side-menu-brand side-menu-profile"
                   [routerLink]="menuSignedIn ? '/account' : '/login'"
                   [attr.aria-label]="menuSignedIn ? 'View your profile' : 'Sign in to SmileHub'">
                  <div class="side-menu-avatar">
                    <img *ngIf="menuPhoto && failedPhoto !== menuPhoto; else profileFallback"
                         [src]="menuPhoto" [alt]="menuName + ' profile picture'"
                         (error)="failedPhoto = menuPhoto">
                    <ng-template #profileFallback>
                      <span *ngIf="menuSignedIn; else guestIcon">{{ menuInitials }}</span>
                      <ng-template #guestIcon><ion-icon name="person-outline"></ion-icon></ng-template>
                    </ng-template>
                  </div>
                  <div class="side-menu-brand-copy">
                    <div class="side-menu-name">{{ menuName }}</div>
                    <div class="side-menu-contact" *ngIf="menuPhone">{{ menuPhone }}</div>
                    <div class="side-menu-contact" *ngIf="menuEmail">{{ menuEmail }}</div>
                    <div class="side-menu-contact" *ngIf="!menuPhone && !menuEmail">
                      {{ menuSignedIn ? 'View your profile' : 'Sign in to your account' }}
                    </div>
                  </div>
                </a>
              </ion-menu-toggle>

            </ion-toolbar>

          </ion-header>


          <ion-content class="side-menu-content">

            <div class="side-menu-scroll">


              <div class="side-menu-section">

                <div class="side-menu-section-title">
                  Modules
                </div>


                <ion-menu-toggle [autoHide]="false">
                  <ion-item
                    button
                    detail="false"
                    lines="none"
                    routerLink="/home"
                    class="side-menu-item"
                    [class.menu-active]="isMenuActive('/home')">
                    <ion-icon slot="start" name="home-outline"></ion-icon>
                    <ion-label>Home</ion-label>
                  </ion-item>
                </ion-menu-toggle>


                <ion-menu-toggle [autoHide]="false">
                  <ion-item
                    button
                    detail="false"
                    lines="none"
                    routerLink="/catalog"
                    class="side-menu-item"
                    [class.menu-active]="isMenuActive('/catalog')">
                    <ion-icon slot="start" name="search-outline"></ion-icon>
                    <ion-label>Catalog</ion-label>
                  </ion-item>
                </ion-menu-toggle>


                <ion-menu-toggle [autoHide]="false">
                  <ion-item
                    button
                    detail="false"
                    lines="none"
                    routerLink="/categories"
                    class="side-menu-item"
                    [class.menu-active]="isMenuActive('/categories')">
                    <ion-icon slot="start" name="grid-outline"></ion-icon>
                    <ion-label>Categories</ion-label>
                  </ion-item>
                </ion-menu-toggle>


                <ion-menu-toggle [autoHide]="false">
                  <ion-item
                    button
                    detail="false"
                    lines="none"
                    routerLink="/cart"
                    class="side-menu-item"
                    [class.menu-active]="isMenuActive('/cart')">
                    <ion-icon slot="start" name="cart-outline"></ion-icon>
                    <ion-label>Cart</ion-label>
                    <ion-badge
                      color="danger"
                      data-cart-badge *ngIf="state.cartCount > 0">
                      {{ menuBadgeText(state.cartCount) }}
                    </ion-badge>
                  </ion-item>
                </ion-menu-toggle>


                <ion-menu-toggle [autoHide]="false">
                  <ion-item
                    button
                    detail="false"
                    lines="none"
                    routerLink="/orders"
                    class="side-menu-item"
                    [class.menu-active]="isMenuActive('/orders')">
                    <ion-icon slot="start" name="receipt-outline"></ion-icon>
                    <ion-label>My Orders</ion-label>
                  </ion-item>
                </ion-menu-toggle>


                <ion-menu-toggle [autoHide]="false">
                  <ion-item
                    button
                    detail="false"
                    lines="none"
                    routerLink="/wishlist"
                    class="side-menu-item"
                    [class.menu-active]="isMenuActive('/wishlist')">
                    <ion-icon slot="start" name="heart-outline"></ion-icon>
                    <ion-label>Wishlist</ion-label>
                  </ion-item>
                </ion-menu-toggle>


                <ion-menu-toggle [autoHide]="false">
                  <ion-item
                    button
                    detail="false"
                    lines="none"
                    routerLink="/chatbot"
                    class="side-menu-item"
                    [class.menu-active]="isMenuActive('/chatbot')">
                    <ion-icon slot="start" name="chatbubble-ellipses-outline"></ion-icon>
                    <ion-label>AI Assistant</ion-label>
                  </ion-item>
                </ion-menu-toggle>


                <ion-menu-toggle [autoHide]="false">
                  <ion-item
                    button
                    detail="false"
                    lines="none"
                    routerLink="/account"
                    class="side-menu-item"
                    [class.menu-active]="isMenuActive('/account')">
                    <ion-icon slot="start" name="person-outline"></ion-icon>
                    <ion-label>Account</ion-label>
                  </ion-item>
                </ion-menu-toggle>

              </div>


              <div class="side-menu-divider"></div>


              <div class="side-menu-section">

                <div class="side-menu-section-title">
                  SmileHub
                </div>


                <ion-menu-toggle [autoHide]="false">
                  <ion-item
                    button
                    detail="false"
                    lines="none"
                    routerLink="/about"
                    class="side-menu-item"
                    [class.menu-active]="isMenuActive('/about')">
                    <ion-icon slot="start" name="information-circle-outline"></ion-icon>
                    <ion-label>About Us</ion-label>
                  </ion-item>
                </ion-menu-toggle>


                <ion-menu-toggle [autoHide]="false">
                  <ion-item button detail="false" lines="none" routerLink="/contact-us"
                    class="side-menu-item" [class.menu-active]="isMenuActive('/contact-us')">
                    <ion-icon slot="start" name="headset-outline"></ion-icon>
                    <ion-label>Contact Us</ion-label>
                  </ion-item>
                </ion-menu-toggle>

                <ion-menu-toggle [autoHide]="false">
                  <ion-item
                    button
                    detail="false"
                    lines="none"
                    routerLink="/developers"
                    class="side-menu-item"
                    [class.menu-active]="isMenuActive('/developers')">
                    <ion-icon slot="start" name="person-add-outline"></ion-icon>
                    <ion-label>Developers</ion-label>
                  </ion-item>
                </ion-menu-toggle>

              </div>


              <div class="side-menu-spacer"></div>


              <div class="side-menu-footer">
                SmileHub v1.0.0
                <br>
                Ionic Angular • Firebase
              </div>


            </div>

          </ion-content>


        </ion-menu>


        <ion-router-outlet id="main-content">
        </ion-router-outlet>


      </ion-split-pane>



      <!-- =====================
           ANIMATED SPLASH
           ===================== -->

      <div class="app-splash" *ngIf="showSplash" [class.splash-closing]="splashClosing"
        role="status" aria-live="polite" aria-label="Loading SmileHub">
        <div class="splash-content">
          <div class="splash-logo-stage">
            <div class="splash-halo" aria-hidden="true"></div>
            <img class="splash-logo" src="/assets/branding/smilehub-logo.png"
              alt="SmileHub logo" width="148" height="148" fetchpriority="high">
          </div>
          <div class="splash-brand">Smile<span class="splash-brand-accent">Hub</span></div>
          <div class="splash-tagline">Dental Supplies</div>
          <div class="splash-loading">
            <div class="splash-loading-track" aria-hidden="true"><div class="splash-loading-bar"></div></div>
            <div class="splash-loading-text">Getting things ready…</div>
          </div>
        </div>
      </div>

    </ion-app>

  `
})


export class AppComponent
implements OnInit, OnDestroy {


  menuSignedIn = false;
  menuName = 'Guest';
  menuEmail = '';
  menuPhone = '';
  menuPhoto = '';
  failedPhoto = '';
  private stopAuth?: () => void;
  private stopProfile?: () => void;

  get menuInitials(): string {
    return this.menuName.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase();
  }

  private watchMenuProfile(user: User | null): void {
    this.stopProfile?.();
    this.stopProfile = undefined;
    this.menuSignedIn = !!user;
    this.menuName = user?.displayName?.trim() || (user ? 'My account' : 'Guest');
    this.menuEmail = user?.email || '';
    this.menuPhone = user?.phoneNumber || '';
    this.menuPhoto = user?.photoURL || '';
    this.failedPhoto = '';
    if (!user) return;

    this.stopProfile = onSnapshot(doc(firestore, 'users', user.uid), snapshot => {
      if (firebaseAuth.currentUser?.uid !== user.uid) return;
      const data = snapshot.data() || {};
      this.zone.run(() => {
        this.menuName = String([data['firstName'], data['lastName']].filter(Boolean).join(' ')
          || data['fullName'] || data['displayName'] || user.displayName || 'My account');
        this.menuEmail = String(user.email || data['email'] || '');
        this.menuPhone = String(data['phoneLocal'] || data['mobile'] || data['phoneE164']
          || data['phone'] || user.phoneNumber || '');
        this.menuPhoto = data['photoRemoved'] ? '' : String(data['photoDataUrl']
          || data['photoURL'] || user.photoURL || '');
      });
    }, error => console.warn('Profile details could not be refreshed.', error));
  }

  ngOnDestroy(): void {
    this.stopAuth?.();
    this.stopProfile?.();
    if (this.splashFallbackTimer) clearTimeout(this.splashFallbackTimer);
    if (this.splashCloseTimer) clearTimeout(this.splashCloseTimer);
    if (this.splashRemoveTimer) clearTimeout(this.splashRemoveTimer);
  }

  /* =========================
     SPLASH STATE
     ========================= */

  showSplash =
    true;


  splashClosing =
    false;


  private splashFinished =
    false;


  private readonly splashStartedAt:
    number =
    Date.now();


  private readonly minimumSplashTime:
    number =
    900;

  private splashFallbackTimer?: ReturnType<typeof setTimeout>;
  private splashCloseTimer?: ReturnType<typeof setTimeout>;
  private splashRemoveTimer?: ReturnType<typeof setTimeout>;



  /* =========================
     CONSTRUCTOR
     ========================= */

  constructor(

    public state:
      AppStateService,

    private router:
      Router,

    private zone: NgZone

  ) {


    addIcons({

      homeOutline,

      gridOutline,

      cartOutline,

      personOutline,

      heart,

      heartOutline,

      searchOutline,

      medicalOutline,

      addOutline,

      addCircleOutline,

      removeOutline,

      trashOutline,

      chevronForwardOutline,

      logOutOutline,

      logInOutline,

      moonOutline,

      sunnyOutline,

      locationOutline,

      walletOutline,

      cardOutline,

      cashOutline,

      helpCircleOutline,

      headsetOutline,

      bagCheckOutline,

      arrowBackOutline,

      checkmarkOutline,

      checkmarkCircleOutline,

      checkmarkCircle,

      starOutline,

      closeOutline,

      eyeOutline,

      eyeOffOutline,

      createOutline,

      reorderFourOutline,

      shieldCheckmarkOutline,

      bicycleOutline,

      lockClosedOutline,

      callOutline,

      mailOutline,

      informationCircleOutline,

      sendOutline,

      personAddOutline,

      phonePortraitOutline,

      chatbubbleEllipsesOutline,

      receiptOutline,

      notificationsOutline

    });


  }



  /* =========================
     SIDE MENU HELPERS
     ========================= */

  get menuEnabled():
    boolean {


    const currentPath =

      this.router.url
        .split('?')[0];


    return (

      currentPath !== '/'

      &&

      currentPath !== '/login'

      &&

      currentPath !== '/signup'

    );


  }


  isMenuActive(
    path: string
  ):
    boolean {


    const currentPath =

      this.router.url
        .split('?')[0];


    if (path === '/contact-us') return ['/contact-us', '/contact-support'].includes(currentPath);

    if (
      path === '/catalog'
    ) {


      return (

        currentPath === '/catalog'

        ||

        currentPath.startsWith(
          '/product-details/'
        )

      );


    }


    if (
      path === '/cart'
    ) {


      return (

        currentPath === '/cart'

        ||

        currentPath === '/checkout'

        ||

        currentPath === '/order-success'

      );


    }


    if (
      path === '/orders'
    ) {


      return (

        currentPath === '/orders'

        ||

        currentPath.startsWith(
          '/order-details/'
        )

      );


    }


    if (
      path === '/account'
    ) {


      return [

        '/account',
        '/personal-information',
        '/addresses',
        '/add-address',
        '/payments',
        '/add-payment',
        '/help',
        '/notifications',
        '/verify-phone'

      ].includes(
        currentPath
      );


    }


    return (
      currentPath === path
    );


  }


  menuBadgeText(
    value: number
  ):
    string {


    return value > 99

      ? '99+'

      : String(
          value
        );


  }



  /* =========================
     APP INITIALIZATION
     ========================= */

  ngOnInit():
    void {


    /*
     * AppStateService is injected,
     * therefore its constructor
     * continues loading app data.
     *
     * Do not reload the product
     * catalog again here.
     */


    this.stopAuth = onAuthStateChanged(

      firebaseAuth,

      user => {
        this.zone.run(() => this.watchMenuProfile(user));


        if (
          user
        ) {


          const url =
            this.router.url;


          if (

            url === '/'

            ||

            url.startsWith(
              '/login'
            )

            ||

            url.startsWith(
              '/signup'
            )

          ) {


            this.router
              .navigateByUrl(

                '/home',

                {
                  replaceUrl:
                    true
                }

              )

              .then(
                () => {

                  this.finishSplash();

                }
              )

              .catch(
                () => {

                  this.finishSplash();

                }
              );


            return;


          }


        }


        this.finishSplash();


      }

    );



    /*
     * Safety fallback.
     *
     * Never leave the customer
     * stuck on the splash screen
     * if Firebase takes too long.
     */

    this.splashFallbackTimer = setTimeout(

      () => {

        this.finishSplash();

      },

      4000

    );


  }



  /* =========================
     FINISH SPLASH
     ========================= */

  private finishSplash(): void {
    if (this.splashFinished) return;
    this.splashFinished = true;
    if (this.splashFallbackTimer) clearTimeout(this.splashFallbackTimer);
    const reducedMotion = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const minimum = reducedMotion ? 0 : this.minimumSplashTime;
    const remaining = Math.max(0, minimum - (Date.now() - this.splashStartedAt));
    this.splashCloseTimer = setTimeout(() => {
      this.zone.run(() => { this.splashClosing = true; });
      this.splashRemoveTimer = setTimeout(() => {
        this.zone.run(() => { this.showSplash = false; });
      }, reducedMotion ? 0 : 300);
    }, remaining);
  }
}
