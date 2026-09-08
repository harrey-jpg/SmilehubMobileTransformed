# SmileHub - Ionic Angular Conversion

This folder is an Ionic Angular rebuild of the supplied Flutter SmileHub app.
It reuses the same Firebase project (`smilehub-ecommerce`) and preserves the main customer flow.

## Converted features

- Onboarding
- Firebase email/password Login and Signup
- Firestore `users` and `accounts` profile creation
- Home, categories, catalog, search, product details
- Wishlist and cart with local persistence
- Coupon `SMILE10`
- Checkout and Buy Now
- Firestore shipping addresses under `users/{uid}/addresses`
- Payment method selection (demo/local state, matching the source app behavior)
- Firestore order placement in `orders`
- My Orders and Order Details
- Account and Personal Information
- Dark mode
- Help and Contact Support UI
- Original product SVG assets
- Capacitor configuration for Android

## Run it

Open this folder in VS Code, then run:

```bash
npm install
npx ionic serve
```

If you have Ionic CLI installed globally, this also works:

```bash
ionic serve
```

## Android

After the web app runs successfully:

```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

If the `android` folder already exists, skip `npx cap add android`.

## Firebase

The Firebase Web configuration was copied from the Flutter project's `lib/firebase_options.dart` into:

`src/environments/environment.ts`

The app uses the same Firebase project and these collections:

- `users/{uid}`
- `accounts/{email}`
- `users/{uid}/addresses/{addressId}`
- `orders/{orderId}`

Make sure **Email/Password** sign-in is enabled in Firebase Authentication.
For web deployment, add your deployed domain under Firebase Authentication > Settings > Authorized domains when required.

## Important production note

The payment screen only stores display labels such as `GCash` or `Visa ending 1234` in local app state. Do not store raw card numbers, CVVs, or sensitive payment credentials in Firestore.

## Main Flutter -> Ionic mapping

| Flutter | Ionic Angular |
|---|---|
| `MaterialApp` / routes | Angular Router + Ionic `ion-router-outlet` |
| `StatefulWidget` | Angular component class/state |
| `ChangeNotifier` AppController | `AppStateService` |
| `Navigator.pushNamed` | Angular `Router.navigate` / `routerLink` |
| `FirebaseAuth` | Firebase JS Auth SDK |
| `cloud_firestore` | Firebase JS Firestore SDK |
| Flutter `Screen` widgets | Ionic pages using `ion-content`, `ion-toolbar`, `ion-item`, `ion-button` |
| `assets/products/*.svg` | `src/assets/products/*.svg` |

## Notes

This is a source-level rebuild, not an automatic Dart-to-TypeScript conversion. The data model, routes, Firebase collections, and customer flows are preserved while the UI is implemented using Ionic Angular components.
