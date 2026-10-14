# Web and mobile customer data synchronization

Both source projects use the existing Firebase project `smilehub-ecommerce`. No database migration, deployment, or live customer-data write was performed during this change.

## Shared data

- Signed-in carts and wishlists use `carts/{uid}` and `wishlists/{uid}` with `userId`, `items`, and `updatedAt`. Both apps listen for changes. Transactions apply edits against the current shared list, preserving unrelated items. Clears and removals propagate. Switching accounts cancels listeners and clears the previous customer's displayed state.
- Mobile product data listens for changes to the shared `products` collection, including an empty catalog. Offline bundled products remain available when the database cannot be read.
- Profiles use compatible name and phone fields under `users/{uid}`. Mobile understands web structured addresses and web understands older mobile name/phone fields. Profile-photo removal uses the same flag.
- Mobile default addresses also update the profile's structured default address. Web profile and checkout read `users/{uid}/addresses`; saving an address on the web updates that collection. The web currently exposes the default address, rather than an editor for every saved mobile address. Manual mobile addresses without a province may require completing the province at web checkout.
- Web product-detail reviews read and write the same `reviews` records as mobile. Reviews are displayed with the author's name. Existing browser-only reviews are not automatically attributed or uploaded to an account. Mobile sorts the fetched reviews without requiring a new composite index.
- Web reads the shared `notifications` collection and writes its generated signed-in notifications there. Read state is shared. Notifications already stored only in a browser are not migrated.
- Saved payment display labels use `users/{uid}.savedPaymentMethods`. Mobile can manage them; web profile displays them. Only title, subtitle, and icon are written. This does not integrate a payment gateway or save card credentials.
- Orders and support messages continue using their existing shared collections. These paths were not rewritten.

## Verification

The mobile production build and JavaScript syntax checks pass. `tests/customer-sync.test.cjs` executes the web and mobile list adapters against the same simulated database and checks additions, quantities, removals, clears, stale-cache protection, account isolation, payment metadata, and profile/address/review compatibility. Existing web regression checks also pass.

For live acceptance, use the same Firebase account in both apps:

1. Add a cart item on mobile; check web. Change its quantity on web; check mobile. Remove it and confirm it stays removed after reopening.
2. Repeat with wishlist additions and removals. Sign out and sign in as a different customer; confirm no previous customer's lists appear.
3. Save profile information and a default address on each platform. Reopen the other platform's profile/checkout and check name, phone, address, and postal code. Check photo upload/removal.
4. Submit one product review and open that product on the other platform. Check author, comment, rating, and duplicate-review handling.
5. Read a notification on web; check its read state on mobile. Save a payment label on mobile and check the web profile.
6. Verify order placement, status changes, cancellation, and stock using a test account and test inventory before any production transaction.

## Remaining live dependencies

- The apps must be rebuilt/deployed to make these source changes available to installed mobile apps or the hosted website. A signed-in, two-client test has not been performed against the live database.
- Local-only carts created before synchronization have no trustworthy account owner. Shared account records are authoritative; legacy mobile state is preserved as `smilehubStateBeforeSync` for recovery rather than uploaded to an arbitrary account. Device preferences and search history remain local.
- Mobile order placement and cancellation now use authenticated backend functions with server-side stock transactions and private reservation receipts. These functions and the web/admin cancellation restoration trigger must be deployed before the updated client can transact. Older orders without receipts require stock reconciliation. See `functions/ORDER-DEPLOYMENT.md`; live-rule verification remains pending and customer stock-write permissions were not loosened.
- Web and mobile currently calculate some checkout charges differently. Shared order records do not by themselves make tax, coupon, and shipping policies identical. That behavior needs a separate agreed pricing policy.
