const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), vm = require('node:vm'), path = require('node:path');
const ts = require('typescript');

function harness(profileRole, accountRole, claims = {}) {
  const records = new Map();
  if (profileRole !== undefined) records.set('users/u', { role: profileRole });
  if (accountRole !== undefined) records.set('accounts/test@example.test', { role: accountRole, status: 'active' });
  const writes = [];
  let signedOut = 0, offline = false;
  const snapshot = key => ({ exists: () => records.has(key), data: () => records.get(key) });
  const read = async key => { if (offline) throw Error('offline'); return snapshot(key); };
  const exports = {};
  const user = { uid: 'u', email: 'test@example.test', displayName: 'Test Customer', getIdTokenResult: async () => ({ claims }) };
  const source = fs.readFileSync(path.join(__dirname, '../src/app/services/auth.service.ts'), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true
  } }).outputText;
  vm.runInNewContext(code, { exports, require(name) {
    if (name === '@angular/core') return { Injectable: () => value => value };
    if (name === './firebase') return { firebaseAuth: {}, firestore: {} };
    if (name === 'firebase/auth') return {
      signOut: async () => signedOut++, signInWithEmailAndPassword: async () => ({ user }),
      signInWithPopup: async () => ({ user }), GoogleAuthProvider: class { setCustomParameters() {} }
    };
    if (name === 'firebase/firestore') return {
      doc: (_, collection, id) => `${collection}/${id}`, getDoc: read, serverTimestamp: () => 1,
      setDoc: async (key, value) => { writes.push({ key, value }); records.set(key, { ...records.get(key), ...value }); },
      runTransaction: async (_, fn) => fn({ get: read, set: (key, value) => { writes.push({ key, value }); records.set(key, value); } })
    };
    throw Error(name);
  } });
  return { service: new exports.AuthService(), user, writes, records,
    signedOut: () => signedOut, offline: () => offline = true };
}

test('email sign-in allows customers and rejects management roles from either record', async () => {
  const customer = harness('customer', 'customer');
  await customer.service.signIn('test@example.test', 'unused');
  assert.equal(customer.signedOut(), 0);
  for (const role of ['staff', 'admin', 'superadmin', 'super_admin', 'super admin']) {
    for (const roles of [[role, 'customer'], ['customer', role]]) {
      const h = harness(...roles);
      await assert.rejects(h.service.signIn('test@example.test', 'unused'), { code: 'auth/mobile-customer-only' });
      assert.equal(h.signedOut(), 1);
      assert.equal(h.writes.length, 0);
    }
  }
});

test('unknown roles, privileged claims and failed verification cannot enter mobile', async () => {
  for (const h of [harness('unknown', 'customer'), harness(undefined, undefined), harness('customer', 'customer', { admin: true })]) {
    await assert.rejects(h.service.requireMobileCustomer(h.user));
    assert.equal(h.signedOut(), 1);
  }
  const h = harness('customer', 'customer'); h.offline();
  await assert.rejects(h.service.requireMobileCustomer(h.user), { code: 'auth/mobile-access-unavailable' });
  assert.equal(h.signedOut(), 1);
});

test('Google rejects management accounts before writing and preserves existing customer account records', async () => {
  const admin = harness('admin', 'admin');
  await assert.rejects(admin.service.signInWithGoogle(), { code: 'auth/mobile-customer-only' });
  assert.equal(admin.writes.length, 0);
  const existing = harness('customer', 'customer');
  await existing.service.signInWithGoogle();
  assert.equal(existing.writes.some(write => write.key.startsWith('accounts/')), false);
  const fresh = harness(undefined, undefined);
  await fresh.service.signInWithGoogle();
  assert.equal(fresh.records.get('users/u').role, 'customer');
  assert.equal(fresh.records.get('accounts/test@example.test').role, 'customer');
});
