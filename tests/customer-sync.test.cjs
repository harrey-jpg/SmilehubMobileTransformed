const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('../node_modules/typescript');

function setup() {
  const records = new Map(), listeners = new Map(), authListeners = [];
  const auth = { currentUser: null, onAuthStateChanged(fn) { authListeners.push(fn); } };
  const snapshot = key => ({ exists: records.has(key), data: () => records.get(key) });
  function subscribe(key, fn) {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(fn); queueMicrotask(() => fn(snapshot(key)));
    return () => listeners.get(key).delete(fn);
  }
  function write(key, value) {
    records.set(key, { ...records.get(key), ...value });
    for (const fn of listeners.get(key) || []) fn(snapshot(key));
  }
  const ref = key => ({ key, onSnapshot: fn => subscribe(key, fn) });
  const db = {
    collection(name) { return { doc: id => ref(name + '/' + id) }; },
    async runTransaction(fn) {
      const writes = [];
      await fn({ get: async target => snapshot(target.key), set: (target, data) => writes.push([target.key, data]) });
      writes.forEach(([key, data]) => write(key, data));
    }
  };
  const storage = new Map();
  const window = { SmileHubStorage: { get: (key, fallback) => storage.get(key) || fallback, set: (key, value) => storage.set(key, value) }, showToast() {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../smilehub-ecommerce/js/firebase-sync.js'), 'utf8'), {
    window, firebase: { auth: () => auth, firestore: Object.assign(() => db, { FieldValue: { serverTimestamp: () => 1 } }) },
    document: { dispatchEvent() {} }, CustomEvent: function() {}, console
  });
  const exports = {};
  const compiled = ts.transpileModule(fs.readFileSync(path.join(__dirname, '../src/app/services/customer-sync.service.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true }
  }).outputText;
  vm.runInNewContext(compiled, { exports, console, require(name) {
    if (name === '@angular/core') return { Injectable: () => value => value };
    if (name === '@ionic/angular') return {};
    if (name === 'firebase/auth') return { onAuthStateChanged: (_, fn) => auth.onAuthStateChanged(fn) };
    if (name === './firebase') return { firebaseAuth: auth, firestore: db };
    if (name === 'firebase/firestore') return {
      doc: (_, col, id) => ref(col + '/' + id), serverTimestamp: () => 1,
      onSnapshot: (target, fn) => subscribe(target.key, value => fn({ data: value.data })),
      runTransaction: (_, fn) => db.runTransaction(fn), setDoc: async (target, data) => write(target.key, data)
    };
    throw new Error(name);
  } });
  const mobile = new exports.CustomerSyncService({ create: async () => ({ present() {} }) });
  const received = {};
  mobile.connect((name, items) => received[name] = items, () => {});
  return { mobile, web: window.SmileHubFirebaseSync, storage, records, received, write,
    login(uid) { auth.currentUser = uid ? { uid } : null; authListeners.forEach(fn => fn(auth.currentUser)); } };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('web and mobile share additions, quantities, deletions, and clear operations', async () => {
  const app = setup(); app.login('alice'); await settle();
  app.mobile.change('carts', items => [...items, { id: 1, name: 'Item', price: 100, quantity: 2 }]);
  await settle();
  assert.equal(app.storage.get('smilehub_simple_cart')[0].quantity, 2);
  const previous = app.storage.get('smilehub_simple_cart');
  const next = [{ ...previous[0], quantity: 4 }];
  app.web.trackRemovals('smilehub_simple_cart', previous, next);
  await app.web.saveList('smilehub_simple_cart', next); await settle();
  assert.equal(app.received.carts[0].quantity, 4);
  // A stale web list changes product 1 while mobile has added product 2.
  app.mobile.change('carts', items => [...items, { id: 2, quantity: 1 }]); await settle();
  app.web.trackRemovals('smilehub_simple_cart', next, [{ ...next[0], quantity: 5 }]);
  await app.web.saveList('smilehub_simple_cart', [{ ...next[0], quantity: 5 }]); await settle();
  assert.equal(app.received.carts.length, 2);
  app.web.trackRemovals('smilehub_simple_cart', app.storage.get('smilehub_simple_cart'), []);
  await app.web.saveList('smilehub_simple_cart', []); await settle();
  assert.equal(app.received.carts.length, 0);
  app.mobile.change('wishlists', () => [{ id: 3 }]); await settle();
  assert.equal(app.storage.get('smilehub_simple_wishlist')[0].id, 3);
  await app.web.clearList('smilehub_simple_wishlist'); await settle();
  assert.equal(app.received.wishlists.length, 0);
  app.mobile.savePaymentMethods([{ title: 'Cash on Delivery', subtitle: 'Cash', icon: 'cash', isDefault: true }, { title: 'Visa ending 1234', subtitle: 'Saved card', icon: 'card', cardNumber: 'should not be stored' }]);
  assert.equal(app.records.get('users/alice').savedPaymentMethods.length, 1);
  assert.equal(app.records.get('users/alice').savedPaymentMethods[0].cardNumber, undefined);
});

test('cloud data wins over stale local data and stays isolated by account', async () => {
  const app = setup();
  app.storage.set('smilehub_simple_cart', [{ id: 99, quantity: 10 }]);
  app.write('carts/alice', { items: [{ id: 1, quantity: 2 }] });
  app.login('alice'); await settle();
  assert.equal(app.storage.get('smilehub_simple_cart')[0].id, 1);
  app.mobile.change('carts', () => [{ id: 55, quantity: 1 }]);
  app.login('bob'); await settle();
  assert.equal(app.received.carts.length, 0);
  assert.equal(app.records.has('carts/bob'), false);
  assert.equal(app.records.get('carts/alice').items[0].id, 1);
  app.login(null); await settle();
  assert.equal(app.storage.get('smilehub_simple_cart').length, 0);
});

test('shared web adapter reads mobile profile, addresses, and review fields', async () => {
  let reviewListener;
  const query = { get: async () => ({ docs: [{ id: 'mobile-address', data: () => ({ recipient: 'Ana Santos', street: 'Main St', city: 'Manila', barangay: 'One', postalCode: '1000', isDefault: true }) }] }),
    onSnapshot(fn) { reviewListener = fn; return () => {}; }, where() { return this; }, doc() { return { collection: () => query }; } };
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../../smilehub-ecommerce/js/shared-data.js'), 'utf8'), {
    window, document: { getElementById() { return null; } }, console,
    firebase: { auth: () => ({ onAuthStateChanged() {}, currentUser: null }), firestore: Object.assign(() => ({ collection: () => query }), { FieldValue: { serverTimestamp: () => 1 } }) }
  });
  const api = window.SmileHubSharedData;
  const profile = api.normalizeProfile({ fullName: 'Ana Santos', mobile: '09171234567' });
  assert.equal(profile.firstName, 'Ana'); assert.equal(profile.lastName, 'Santos'); assert.equal(profile.phoneE164, '+639171234567');
  const shared = await api.withAddress({ uid: 'alice' }, profile);
  assert.equal(shared.address.postal, '1000'); assert.equal(shared.address.street, 'Main St');
  api.watchReviews(12, () => {});
  reviewListener({ docs: [{ id: 'review-one', data: () => ({ productId: 12, comment: 'Good product', userName: 'Ana', rating: 4 }) }] });
  assert.equal(api.reviewsFor(12)[0].text, 'Good product');
  await assert.rejects(api.addReview(12, 4, 'Good product'), /sign in/);
});
