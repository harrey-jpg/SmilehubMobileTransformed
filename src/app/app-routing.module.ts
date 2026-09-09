import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

const routes: Routes = [
  { path: '', component: OnboardingPage },
  { path: 'login', component: LoginPage },
  { path: 'signup', component: SignupPage },
  { path: 'home', component: HomePage },
  { path: 'categories', component: CategoriesPage },
  { path: 'catalog', component: CatalogPage },
  { path: 'product-details/:id', component: ProductDetailsPage },
  { path: 'wishlist', component: WishlistPage },
  { path: 'cart', component: CartPage },
  { path: 'checkout', component: CheckoutPage },
  { path: 'order-success', component: OrderSuccessPage },
  { path: 'orders', component: OrdersPage },
  { path: 'order-details/:id', component: OrderDetailsPage },
  { path: 'account', component: AccountPage },
  { path: 'personal-information', component: PersonalInformationPage },
  { path: 'addresses', component: AddressesPage },
  { path: 'add-address', component: AddAddressPage },
  { path: 'payments', component: PaymentsPage },
  { path: 'add-payment', component: AddPaymentPage },
  { path: 'help', component: HelpSupportPage },
  { path: 'contact-support', component: ContactSupportPage },
  { path: 'verify-phone', component: VerifyPhonePage },
  { path: 'notifications', component: NotificationsPage },
  { path: 'chatbot', component: ChatbotPage },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
