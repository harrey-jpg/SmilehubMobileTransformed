const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const exportsMock = {};
const calls = [];
const source = fs.readFileSync(require('node:path').join(__dirname, '../src/app/app.component.ts'), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, experimentalDecorators: true
} }).outputText;
vm.runInNewContext(code, { exports: exportsMock, setTimeout, clearTimeout, console,
  require(name) {
    if (name === '@angular/core') return { Component: () => value => value, ViewChild: () => () => {} };
    if (name === '@capacitor/app') return { App: { exitApp: async () => calls.push('exit') } };
    return new Proxy({}, { get: () => () => {} });
  }
});

test('phone Back pops history, returns a direct entry to Home, and exits at Home', async () => {
  const app = Object.create(exportsMock.AppComponent.prototype);
  app.outlet = { canGoBack: () => true, pop: async () => calls.push('pop') };
  app.router = { url: '/product-details/1' };
  app.nav = { navigateRoot: async url => calls.push(url) };
  await app.handlePhoneBack();
  app.outlet.canGoBack = () => false;
  await app.handlePhoneBack();
  app.router.url = '/home?search=brush';
  await app.handlePhoneBack();
  assert.deepEqual(calls, ['pop', '/home', 'exit']);
});

test('phone Back ignores duplicate presses during navigation and recovers after failure', async () => {
  const app = Object.create(exportsMock.AppComponent.prototype);
  let finish, count = 0;
  app.outlet = { canGoBack: () => true, pop: () => { count++; return new Promise(resolve => finish = resolve); } };
  const pending = app.handlePhoneBack();
  await app.handlePhoneBack();
  assert.equal(count, 1);
  finish();
  await pending;
  app.outlet.pop = async () => { throw new Error('navigation failed'); };
  await assert.rejects(app.handlePhoneBack(), /navigation failed/);
  assert.equal(app.handlingBack, false);
});
