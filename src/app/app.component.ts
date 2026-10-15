import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  addIcons
} from 'ionicons';

import {
  onAuthStateChanged
} from 'firebase/auth';

import {
  AppStateService
} from './services/app-state.service';

import {
  firebaseAuth
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
      position: fixed;
      inset: 0;
      z-index: 999999;

      display: flex;
      align-items: center;
      justify-content: center;

      overflow: hidden;

      background:
        radial-gradient(
          circle at 50% 42%,
          rgba(
            var(--ion-color-primary-rgb),
            .10
          ) 0%,
          rgba(
            var(--ion-color-primary-rgb),
            .035
          ) 30%,
          transparent 58%
        ),
        var(
          --ion-background-color,
          #f5f8fb
        );

      opacity: 1;
      visibility: visible;

      transition:
        opacity .62s ease,
        visibility .62s ease;
    }


    .app-splash.splash-closing {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }


    /* =========================
       DECORATIVE BACKGROUND
       ========================= */

    .splash-orb {
      position: absolute;

      border-radius: 50%;

      pointer-events: none;

      filter: blur(1px);

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .08
        );

      animation:
        splashOrbFloat
        4s
        ease-in-out
        infinite
        alternate;
    }


    .splash-orb-one {
      width: 170px;
      height: 170px;

      top: -55px;
      right: -55px;
    }


    .splash-orb-two {
      width: 130px;
      height: 130px;

      bottom: -35px;
      left: -40px;

      animation-delay: .5s;
    }


    /* =========================
       CONTENT
       ========================= */

    .splash-content {
      position: relative;
      z-index: 2;

      width: min(
        88vw,
        340px
      );

      display: flex;
      flex-direction: column;

      align-items: center;
      justify-content: center;

      text-align: center;

      transform:
        translateY(-12px);
    }


    /* =========================
       LOGO AREA
       ========================= */

    .splash-logo-stage {
      position: relative;

      width: 118px;
      height: 118px;

      display: flex;
      align-items: center;
      justify-content: center;

      animation:
        splashStageEnter
        .72s
        cubic-bezier(
          .2,
          .85,
          .25,
          1
        )
        both;
    }


    .splash-ring {
      position: absolute;

      inset: 5px;

      border-radius: 31px;

      border:
        1px solid
        rgba(
          var(--ion-color-primary-rgb),
          .18
        );

      animation:
        splashRingPulse
        1.8s
        ease-out
        .4s
        infinite;
    }


    .splash-ring-two {
      inset: -5px;

      opacity: .55;

      animation-delay: .7s;
    }


    .splash-logo {
      position: relative;

      width: 88px;
      height: 88px;

      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 26px;

      background:
        linear-gradient(
          145deg,
          #0f839a,
          #22b8c9 58%,
          #39d0dc
        );

      box-shadow:
        0 15px 38px
        rgba(
          var(--ion-color-primary-rgb),
          .24
        );

      overflow: hidden;

      animation:
        splashLogoBreath
        2.1s
        ease-in-out
        .8s
        infinite
        alternate;
    }


    .splash-logo::after {
      content: '';

      position: absolute;

      width: 42px;
      height: 145px;

      top: -28px;
      left: -55px;

      transform:
        rotate(22deg);

      background:
        linear-gradient(
          to right,
          transparent,
          rgba(255,255,255,.33),
          transparent
        );

      animation:
        splashLogoShine
        2.2s
        ease-in-out
        .8s
        infinite;
    }


    .splash-tooth {
      position: relative;
      z-index: 2;

      display: block;

      font-size: 50px;

      line-height: 1;

      filter:
        drop-shadow(
          0 3px 4px
          rgba(0,0,0,.12)
        );

      animation:
        splashToothFloat
        1.35s
        ease-in-out
        .7s
        infinite
        alternate;
    }


    /* =========================
       BRAND TEXT
       ========================= */

    .splash-brand {
      margin-top: 15px;

      color:
        var(
          --ion-text-color,
          #101828
        );

      font-size: 29px;
      line-height: 1;

      font-weight: 950;

      letter-spacing: -.7px;

      animation:
        splashTextEnter
        .58s
        ease
        .22s
        both;
    }


    .splash-brand-accent {
      color:
        var(--ion-color-primary);
    }


    .splash-tagline {
      margin-top: 8px;

      color:
        var(--ion-color-medium);

      font-size: 10px;

      font-weight: 800;

      letter-spacing: 1.15px;

      text-transform: uppercase;

      animation:
        splashTextEnter
        .58s
        ease
        .34s
        both;
    }


    /* =========================
       LOADING INDICATOR
       ========================= */

    .splash-loading {
      width: 148px;

      margin-top: 24px;

      animation:
        splashTextEnter
        .5s
        ease
        .46s
        both;
    }


    .splash-loading-track {
      width: 100%;
      height: 6px;

      overflow: hidden;

      border-radius: 999px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .12
        );
    }


    .splash-loading-bar {
      width: 42%;
      height: 100%;

      border-radius: inherit;

      background:
        linear-gradient(
          90deg,
          var(--ion-color-primary),
          #31c7d7
        );

      animation:
        splashLoadingMove
        1.4s
        ease-in-out
        infinite;
    }


    .splash-loading-text {
      margin-top: 9px;

      color:
        var(--ion-color-medium);

      font-size: 8px;

      font-weight: 700;

      letter-spacing: .3px;

      opacity: .88;
    }



    /* Three subtle progress dots complement the logo/ring animation. */
    .splash-dots {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 7px;
      margin-top: 13px;
    }
    .splash-dots span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--ion-color-primary);
      animation: splashDotBounce 1.05s ease-in-out infinite;
    }
    .splash-dots span:nth-child(2) { animation-delay: .14s; }
    .splash-dots span:nth-child(3) { animation-delay: .28s; }
    @keyframes splashDotBounce {
      0%, 80%, 100% { opacity: .35; transform: translateY(0); }
      40% { opacity: 1; transform: translateY(-7px); }
    }

    /* =========================
       ANIMATIONS
       ========================= */

    @keyframes splashStageEnter {

      0% {
        opacity: 0;

        transform:
          translateY(18px)
          scale(.74);
      }

      70% {
        opacity: 1;

        transform:
          translateY(-2px)
          scale(1.045);
      }

      100% {
        opacity: 1;

        transform:
          translateY(0)
          scale(1);
      }

    }


    @keyframes splashRingPulse {

      0% {
        opacity: .55;

        transform:
          scale(.82);
      }

      70% {
        opacity: .12;

        transform:
          scale(1.12);
      }

      100% {
        opacity: 0;

        transform:
          scale(1.18);
      }

    }


    @keyframes splashLogoBreath {

      from {
        transform:
          translateY(0)
          scale(1);
      }

      to {
        transform:
          translateY(-2px)
          scale(1.02);
      }

    }


    @keyframes splashLogoShine {

      0%,
      28% {
        left: -55px;
      }

      65%,
      100% {
        left: 110px;
      }

    }


    @keyframes splashToothFloat {

      from {
        transform:
          translateY(1px)
          rotate(-1deg)
          scale(1);
      }

      to {
        transform:
          translateY(-3px)
          rotate(1deg)
          scale(1.035);
      }

    }


    @keyframes splashTextEnter {

      from {
        opacity: 0;

        transform:
          translateY(10px);
      }

      to {
        opacity: 1;

        transform:
          translateY(0);
      }

    }


    @keyframes splashLoadingMove {

      0% {
        transform:
          translateX(-115%);
      }

      50% {
        transform:
          translateX(78%);
      }

      100% {
        transform:
          translateX(220%);
      }

    }


    @keyframes splashOrbFloat {

      from {
        transform:
          translate3d(
            0,
            0,
            0
          )
          scale(1);
      }

      to {
        transform:
          translate3d(
            10px,
            12px,
            0
          )
          scale(1.06);
      }

    }


    /* =========================
       REDUCED MOTION
       ========================= */

    @media (
      prefers-reduced-motion: reduce
    ) {

      .splash-orb,
      .splash-logo-stage,
      .splash-ring,
      .splash-logo,
      .splash-logo::after,
      .splash-tooth,
      .splash-brand,
      .splash-tagline,
      .splash-loading,
      .splash-loading-bar,
      .splash-dots span {
        animation: none !important;
      }

    }

  `],

  template: `

    <ion-app>


      <!-- =====================
           RESPONSIVE SIDE MENU
           ===================== -->

      <ion-split-pane
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

              <div class="side-menu-brand">

                <div
                  class="side-menu-logo"
                  aria-hidden="true">
                  🦷
                </div>

                <div class="side-menu-brand-copy">

                  <div class="side-menu-name">
                    SmileHub
                  </div>

                  <div class="side-menu-tagline">
                    Dental supplies made simple
                  </div>

                </div>

              </div>

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
                      *ngIf="state.cartCount > 0">
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
                    <ion-label>About the App</ion-label>
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

      <div
        class="app-splash"

        *ngIf="showSplash"

        [class.splash-closing]="
          splashClosing
        ">


        <!-- BACKGROUND ORBS -->

        <div
          class="
            splash-orb
            splash-orb-one
          ">
        </div>


        <div
          class="
            splash-orb
            splash-orb-two
          ">
        </div>



        <div class="splash-content">


          <!-- LOGO -->

          <div class="splash-logo-stage">


            <div class="splash-ring">
            </div>


            <div
              class="
                splash-ring
                splash-ring-two
              ">
            </div>


            <div class="splash-logo">

              <span class="splash-tooth">

                🦷

              </span>

            </div>


          </div>



          <!-- BRAND -->

          <div class="splash-brand">

            Smile<span
              class="splash-brand-accent">
              Hub
            </span>

          </div>



          <div class="splash-tagline">

            Dental Supplies

          </div>



          <!-- LOADING -->

          <div class="splash-loading">


            <div class="splash-loading-track">

              <div class="splash-loading-bar">
              </div>

            </div>


            <div class="splash-loading-text">

              Preparing your SmileHub experience

            </div>

            <div class="splash-dots" aria-hidden="true">
              <span></span><span></span><span></span>
            </div>


          </div>


        </div>


      </div>


    </ion-app>

  `
})


export class AppComponent
implements OnInit {


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
    1650;



  /* =========================
     CONSTRUCTOR
     ========================= */

  constructor(

    public state:
      AppStateService,

    private router:
      Router

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
        '/contact-support',
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


    onAuthStateChanged(

      firebaseAuth,

      user => {


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

    setTimeout(

      () => {

        this.finishSplash();

      },

      4000

    );


  }



  /* =========================
     FINISH SPLASH
     ========================= */

  private finishSplash():
    void {


    if (
      this.splashFinished
    ) {


      return;


    }


    this.splashFinished =
      true;


    const elapsed =
      Date.now()
      -
      this.splashStartedAt;


    const remaining =
      Math.max(

        0,

        this.minimumSplashTime
        -
        elapsed

      );


    setTimeout(

      () => {


        this.splashClosing =
          true;


        setTimeout(

          () => {


            this.showSplash =
              false;


          },

          630

        );


      },

      remaining

    );


  }


}
