import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';

import {
  IonicModule,
  IonicRouteStrategy
} from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BottomNavComponent } from './shared/bottom-nav.component';
import { ProductCardComponent } from './shared/product-card.component';

import { OnboardingPage } from './pages/onboarding.page';
import { LoginPage } from './pages/login.page';
import { SignupPage } from './pages/signup.page';
import { HomePage } from './pages/home.page';
import { CategoriesPage } from './pages/categories.page';
import { CatalogPage } from './pages/catalog.page';
import { ProductDetailsPage } from './pages/product-details.page';
import { WishlistPage } from './pages/wishlist.page';
import { CartPage } from './pages/cart.page';
import { CheckoutPage } from './pages/checkout.page';
import { OrderSuccessPage } from './pages/order-success.page';
import { OrdersPage } from './pages/orders.page';
import { OrderDetailsPage } from './pages/order-details.page';
import { AccountPage } from './pages/account.page';
import { PersonalInformationPage } from './pages/personal-information.page';
import { AddressesPage } from './pages/addresses.page';
import { AddAddressPage } from './pages/add-address.page';
import { PaymentsPage } from './pages/payments.page';
import { AddPaymentPage } from './pages/add-payment.page';
import { HelpSupportPage } from './pages/help-support.page';
import { ContactSupportPage } from './pages/contact-support.page';
import { VerifyPhonePage } from './pages/verify-phone.page';
import { NotificationsPage } from './pages/notifications.page';
import { ChatbotPage } from './pages/chatbot.page';

@NgModule({
  declarations: [
    AppComponent
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,

    IonicModule.forRoot({
      mode: 'md'
    }),

    AppRoutingModule,

    BottomNavComponent,
    ProductCardComponent,

    OnboardingPage,
    LoginPage,
    SignupPage,
    HomePage,
    CategoriesPage,
    CatalogPage,
    ProductDetailsPage,
    WishlistPage,
    CartPage,
    CheckoutPage,
    OrderSuccessPage,
    OrdersPage,
    OrderDetailsPage,
    AccountPage,
    PersonalInformationPage,
    AddressesPage,
    AddAddressPage,
    PaymentsPage,
    AddPaymentPage,
    HelpSupportPage,
    ContactSupportPage,
    VerifyPhonePage,
    NotificationsPage,
    ChatbotPage
  ],

  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
