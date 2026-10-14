# Secure mobile order transactions

The mobile client now calls `mobilePlaceOrder` and `mobileCancelOrder` in `us-central1` on `smilehub-ecommerce`. These functions require Firebase Authentication. Prices and stock come from Firestore, and authenticated ownership is assigned by the server. Shipping and coupon calculations preserve the current mobile policy (Standard ₱120 below ₱3,000; Express ₱220; SMILE10 10%, capped at ₱349.90). Web pricing is not changed.

Order creation, stock deduction, a private inventory receipt, and the placement notification commit in one transaction. The client retains a hashed request identity and UUID through uncertain failures. Identical retries return the same order. Changed inputs under an existing request ID are rejected.

Cancellation requires ownership and Pending/Processing status, verifies the private reservation receipt, and restores stock once. Missing product documents are not recreated. Older orders without a server-issued inventory receipt require support reconciliation; client-created order fields cannot authorize stock increases.

## Deploy

Build the functions first, then deploy **only the two callable functions and the cancellation inventory trigger** to the existing Firebase project:

```
npm run build --prefix functions
firebase deploy --project smilehub-ecommerce --only functions:mobilePlaceOrder,functions:mobileCancelOrder,functions:restoreCancelledOrderInventory
```

Do not deploy all functions or replace the shared rules as part of this change. The checked-in web rules have no customer permissions for `order_inventory`; confirm the deployed rules also deny customer access to that collection before live use. The receipt is written only by the Admin SDK.

The updated client requires these functions to be deployed. Until then, checkout will report a backend error rather than falling back to the blocked client-side stock writes. Functions deployment may require an authenticated Firebase CLI and an eligible billing plan.

## Acceptance

Backend/mobile builds and the transaction/client regression tests must pass. The tests use an in-memory transaction harness; they do not confirm deployed IAM, rules, network access, or Firebase billing.

After deployment, use a designated test account and inventory item to place one order, retry the same request, cancel it twice, and verify one deduction/one restoration plus notifications in both apps. Verify another account cannot cancel it and a shipped order cannot be cancelled. Existing orders need a separate stock reconciliation before introducing trustworthy reservation receipts; do not invent receipts from untrusted client-created records.

The web checkout remains unchanged and does not yet share this reservation flow. The new cancellation trigger restores stock for receipt-backed mobile orders cancelled through existing web/admin status writes, with the same once-only guard. Web-created and legacy orders without receipts are not automatically reconciled. This change does not unify web/mobile checkout pricing.
