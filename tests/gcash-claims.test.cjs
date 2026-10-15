const test = require('node:test'), assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const ts = require('typescript');
function setup() {
  const records = new Map([['orders/order-1', { userId: 'alice', paymentMethod: 'GCash', paymentStatus: 'unpaid', status: 'Pending Payment' }]]);
  const auth = { currentUser: { uid: 'alice' } }, listeners = new Map();
  let writes = 0, delay, failure;
  const exports = {};
  const firestore = {
    doc: (_, name, id) => ({ path: name + '/' + id }), serverTimestamp: () => 123,
    onSnapshot(ref, _, next, error) { listeners.set(ref.path, { next, error }); return () => listeners.delete(ref.path); },
    async runTransaction(_, fn) {
      if (delay) await delay;
      if (failure) throw new Error(failure);
      const changes = [];
      await fn({
        get: async ref => ({ exists: () => records.has(ref.path), data: () => records.get(ref.path) }),
        set: (ref, value) => changes.push([ref.path, value]),
        update: (ref, value) => changes.push([ref.path, { ...records.get(ref.path), ...value }])
      });
      changes.forEach(([key, value]) => { records.set(key, value); writes++; });
    }
  };
  function load(relative, extras = {}) {
    const output = {};
    const source = fs.readFileSync(path.join(__dirname, relative), 'utf8');
    const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, experimentalDecorators: true } }).outputText;
    vm.runInNewContext(compiled, { exports: output, setTimeout, clearTimeout, require(name) {
      if (name === 'rxjs') return { Observable: class { constructor(start) { this.start = start; } subscribe(observer) { const stop = this.start(observer); return { closed:false, unsubscribe:stop }; } } };
      if (name === 'firebase/firestore') return firestore;
      if (name === './firebase') return { firebaseAuth: auth, firestore: {} };
      if (name === '@angular/core') return { Component: () => target => target, Input: () => () => {}, Injectable: () => target => target };
      return extras[name] || {};
    } });
    return output;
  }
  const service = new (load('../src/app/services/order.service.ts').OrderService)();
  const Component = load('../src/app/shared/gcash-payment.component.ts').GcashPaymentComponent;
  exports.GcashPaymentComponent = class extends Component { constructor() { super(service); } };
  exports.submitGcashReference = (...args) => service.submitGcashReference(...args);
  return { ...exports, records, auth, listeners, writes: () => writes,
    delay() { let done; delay = new Promise(resolve => { done = resolve; }); return done; },
    fail(value) { failure = value; },
    notify(value, metadata = { fromCache: false, hasPendingWrites: false }) {
      listeners.get('gcash_payment_claims/order-1').next({ exists: () => !!value, data: () => value, metadata });
    }
  };
}
test('mobile reference submission waits for acknowledgement and duplicate taps write once', async () => {
  const app = setup(), done = app.delay();
  const first = app.submitGcashReference('order-1', '12345678');
  assert.equal(app.submitGcashReference('order-1', '87654321'), first); assert.equal(app.writes(), 0);
  done(); await first; assert.equal(app.writes(), 2);
  assert.equal(app.records.get('gcash_payment_claims/order-1').status, 'For Verification');
  assert.equal(app.records.get('orders/order-1').paymentStatus, 'unpaid');
  assert.equal(app.records.get('notifications/gcash-submitted-order-1-12345678').type, 'payment_submitted');
});
test('mobile corrections preserve review history; reviewed or paid claims cannot be overwritten', async () => {
  const app = setup();
  app.records.set('gcash_payment_claims/order-1', { status: 'Rejected', reason: 'Wrong reference', reviewedBy: 'staff' });
  await app.submitGcashReference('order-1', 'ABC-1234');
  const claim = app.records.get('gcash_payment_claims/order-1');
  assert.equal(claim.reason, ''); assert.equal(claim.reviewedBy, 'staff');
  await assert.rejects(app.submitGcashReference('order-1', '12345678'));
  assert.equal(app.writes(), 2);
});
test('mobile validates ownership, method, paid/cancelled state, input and failed writes', async () => {
  for (const value of [{ userId: 'bob' }, { paymentStatus: 'paid' }, { gcashPaymentStatus: 'Paid' }, { status: 'Cancelled' }, { paymentMethod: 'Credit Card' }]) {
    const app = setup(); Object.assign(app.records.get('orders/order-1'), value);
    await assert.rejects(app.submitGcashReference('order-1', '12345678')); assert.equal(app.writes(), 0);
  }
  const app = setup(); await assert.rejects(app.submitGcashReference('order-1', '<bad>'));
  app.fail('Permission denied'); await assert.rejects(app.submitGcashReference('order-1', '12345678'));
  app.fail(''); await app.submitGcashReference('order-1', '12345678'); assert.equal(app.writes(), 2);
});
test('mobile displays live payment states, disables offline submission, and cleans up listeners', () => {
  const app = setup(), component = new app.GcashPaymentComponent();
  component.orderId = 'order-1'; component.paymentMethod = 'GCash'; component.orderStatus = 'Pending Payment';
  component.ngOnChanges(); assert.equal(component.canSubmit, false);
  app.notify(null); assert.equal(component.canSubmit, true);
  app.notify({ status: 'For Verification' }); assert.match(component.claim.status, /For Verification/); assert.equal(component.canSubmit, false);
  app.notify({ status: 'Rejected', reason: 'Wrong reference' }); assert.equal(component.canSubmit, true);
  app.notify({ status: 'Paid' }); assert.match(component.claim.status, /Paid/); assert.equal(component.canSubmit, false);
  app.notify(null, { fromCache: true, hasPendingWrites: false }); assert.equal(component.canSubmit, false);
  component.ngOnDestroy(); assert.equal(app.listeners.size, 0);
});
