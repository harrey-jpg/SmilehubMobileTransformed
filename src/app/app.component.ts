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
        opacity .42s ease,
        visibility .42s ease;
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
      width: 118px;

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
      height: 4px;

      overflow: hidden;

      border-radius: 999px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .12
        );
    }


    .splash-loading-bar {
      width: 46%;
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
        1.15s
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
      .splash-loading-bar {
        animation: none !important;
      }

    }

  `],

  template: `

    <ion-app>


      <!-- =====================
           MAIN APP
           ===================== -->

      <ion-router-outlet>
      </ion-router-outlet>



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

    private state:
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

          430

        );


      },

      remaining

    );


  }


}
