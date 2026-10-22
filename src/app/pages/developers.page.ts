import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

interface DeveloperInfo {
  name: string;
  role: string;
  email: string;
  initials: string;
  photo: string;
  photoFailed?: boolean;
}

@Component({
  selector: 'app-developers',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ],
  styles: [`

    .developers-page {
      padding-bottom: 28px;
    }

    .dev-intro {
      margin-bottom: 18px;
    }



    .dev-title {
      margin: 4px 0 0;
      font-size: 24px;
      line-height: 1.15;
      font-weight: 700;
      letter-spacing: -.35px;
    }

    .dev-subtitle {
      max-width: 560px;
      margin: 8px 0 0;

      color:
        var(
          --ion-color-medium
        );

      font-size: 16px;
      line-height: 1.55;
    }

    .developer-grid {
      display: grid;
      gap: 12px;
    }

    .developer-card {
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 17px;
      border-radius: 20px;

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
        0 7px 20px
        rgba(
          0,
          0,
          0,
          .045
        );
    }

    .developer-card::after {
      content: '';
      position: absolute;
      width: 92px;
      height: 92px;
      right: -48px;
      top: -48px;
      border-radius: 50%;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .045
        );
    }

    .developer-avatar {
      position: relative;
      z-index: 1;
      width: 58px;
      height: 58px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 18px;
      overflow: hidden;

      background:
        linear-gradient(
          145deg,
          rgba(
            var(--ion-color-primary-rgb),
            .19
          ),
          rgba(
            var(--ion-color-primary-rgb),
            .07
          )
        );

      color:
        var(
          --ion-color-primary
        );

      font-size: 18px;
      font-weight: 700;
    }

    .developer-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 25%;
    }

    .developer-info {
      position: relative;
      z-index: 1;
      min-width: 0;
      flex: 1;
    }

    .developer-name {
      margin: 0;
      font-size: 16px;
      line-height: 1.4;
      font-weight: 700;
    }

    .developer-role {
      margin-top: 4px;

      color:
        var(
          --ion-color-primary
        );

      font-size: 14px;
      line-height: 1.5;
      font-weight: 600;
    }

    .developer-contact {
      min-height: 44px;
      min-width: 44px;
      padding-block: 6px;
      line-height: 1.5;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      max-width: 100%;
      margin-top: 8px;

      color:
        var(
          --ion-color-medium
        );

      font-size: 14px;
      text-decoration: none;
    }

    .developer-contact ion-icon {
      flex-shrink: 0;
      font-size: 14px;
    }

    .developer-contact span {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .developer-contact:focus-visible {
      outline: 2px solid var(--ion-color-primary);
      outline-offset: 3px;
      border-radius: 4px;
    }

    .team-note {
      margin-top: 18px;
      padding: 14px 15px;
      border-radius: 16px;

      background:
        rgba(
          var(--ion-color-primary-rgb),
          .07
        );

      color:
        var(
          --ion-color-medium
        );

      font-size: 14px;
      line-height: 1.5;
    }

    .team-note strong {
      color:
        var(
          --ion-text-color
        );
    }

    @media (min-width: 720px) {
      .developer-grid {
        grid-template-columns:
          repeat(
            2,
            minmax(
              0,
              1fr
            )
          );
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
          Developers
        </ion-title>

      </ion-toolbar>
    </ion-header>


    <ion-content>

      <div class="page-wrap developers-page">

        <div class="dev-intro">



          <h1 class="dev-title">
            Meet the Developers
          </h1>

          <p class="dev-subtitle">
            The team members who contributed to
            building and improving the SmileHub
            Ionic Angular mobile application.
          </p>

        </div>


        <div class="developer-grid">

          <article
            class="developer-card"
            *ngFor="let developer of developers">

            <div class="developer-avatar">
              <img *ngIf="!developer.photoFailed; else initials"
                [src]="developer.photo" [alt]="developer.name + ' portrait'"
                width="58" height="58" loading="lazy"
                (error)="developer.photoFailed = true">
              <ng-template #initials>{{ developer.initials }}</ng-template>
            </div>

            <div class="developer-info">

              <h2 class="developer-name">
                {{ developer.name }}
              </h2>

              <div class="developer-role">
                {{ developer.role }}
              </div>

              <a
                class="developer-contact"
                [href]="'mailto:' + developer.email"
                [attr.aria-label]="'Email ' + developer.name">

                <ion-icon name="mail-outline"></ion-icon>

                <span>
                  {{ developer.email }}
                </span>

              </a>

            </div>

          </article>

        </div>


        <div class="team-note">
          <strong>Developer information:</strong>
          The contact emails shown here are based on
          the Git commit author information contained
          in the project repository.
        </div>

      </div>

    </ion-content>

  `
})
export class DevelopersPage {

developers:
  DeveloperInfo[] = [
    {
      name: 'Harry Barasona',
      role: 'Developer',
      email: 'qhbarasona@tip.edu.ph',
      initials: 'HB',
      photo: 'assets/developers/Harry.jpg'
    },
    {
      name: 'Yuan Fordlynx Coyyao',
      role: 'Developer',
      email: 'qyfwcoyyao@tip.edu.ph',
      initials: 'YC',
      photo: 'assets/developers/Yuan.png'
    },
    {
      name: 'Giann Ed Louise Garcia',
      role: 'Developer',
      email: 'qgelgarcia@tip.edu.ph',
      initials: 'GG',
      photo: 'assets/developers/Giann.png'
    },
    {
      name: 'Nikko Pensocas',
      role: 'Developer',
      email: 'qnppensocas@tip.edu.ph',
      initials: 'NP',
      photo: 'assets/developers/Nikko.png'
    },
    {
      name: 'Marck Jarrel Queling',
      role: 'Developer',
      email: 'qmjrqueling@tip.edu.ph',
      initials: 'MQ',
      photo: 'assets/developers/Jarrel.png'
    }
  ];

}
