const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const ts = require('../node_modules/typescript');
function component(file, name, overrides = {}) {
  const exports = {};
  const source = fs.readFileSync(path.join(__dirname,'../src/app',file),'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,experimentalDecorators:true } }).outputText;
  const noOp = () => {};
  vm.runInNewContext(code,{exports,console:{error:noOp},setTimeout,clearTimeout,require(module) {
    if (overrides[module]) return overrides[module];
    if (module==='@angular/core') return {Component:()=>value=>value,Input:()=>noOp,HostListener:()=>noOp};
    return new Proxy({}, { get:()=>noOp });
  }});
  return exports[name];
}

test('guest account clears stale profile data without loading customer records', async () => {
  const Account = component('pages/account.page.ts', 'AccountPage', {
    '../services/firebase': { firebaseAuth: { authStateReady: async () => {} } }
  });
  const account = new Account({ currentUser: null }, {
    loadProfile: () => { throw new Error('Guest must not load a profile'); }
  }, {}, {}, {}, {});
  account.profile = { fullName: 'Previous customer' };
  account.profilePhoto = 'previous-photo';
  await account.ionViewWillEnter();
  assert.equal(Object.keys(account.profile).length, 0);
  assert.equal(account.profilePhoto, '');
  assert.equal(account.loadingProfile, false);
});
test('product card distinguishes loading, empty, failure, and successful retry',async()=>{
  const Card = component('shared/product-card.component.ts','ProductCardComponent');
  let finish, fail=false, results=[];
  const reviews = {getProductReviews:()=>fail ? Promise.reject(new Error('offline')) : new Promise(resolve=>finish=()=>resolve(results))};
  const card = new Card({}, {}, {}, reviews); card.product={id:1};
  const loading=card.loadReviewSummary(); assert.equal(card.loadingRating,true); finish(); await loading;
  assert.equal(card.reviewCount,0); assert.equal(card.reviewFailed,false);
  results=[{rating:4},{rating:5}]; const successful=card.loadReviewSummary();finish();await successful;
  assert.equal(card.reviewCount,2); assert.equal(card.averageRating,4.5);
  fail=true;await card.loadReviewSummary(); assert.equal(card.reviewFailed,true);assert.equal(card.reviewCount,2);assert.equal(card.averageRating,4.5);
  fail=false; const retry=card.loadReviewSummary();finish();await retry;assert.equal(card.reviewFailed,false);
  card.product={id:2};fail=true;await card.loadReviewSummary();assert.equal(card.reviewCount,0);assert.equal(card.reviewFailed,true);
});
test('product details retains existing reviews on a failed refresh',async()=>{
  const Details = component('pages/product-details.page.ts','ProductDetailsPage');
  let fail=false;
  const details=new Details({}, {}, {}, {}, {getProductReviews:async()=>{if(fail)throw new Error('offline');return [{rating:4,comment:'Helpful'}];}},{});
  details.product={id:1};await details.loadReviews();assert.equal(details.reviewCount,1);
  fail=true;await details.loadReviews();assert.equal(details.reviewsError,true);assert.equal(details.reviews.length,1);assert.equal(details.averageRating,4);
  fail=false;await details.loadReviews();assert.equal(details.reviewsError,false);assert.equal(details.loadingReviews,false);
});
test('checkout ignores repeated taps while confirmation or submission is active',async()=>{
  const Checkout=component('pages/checkout.page.ts','CheckoutPage');
  const checkout=new Checkout({}, {}, {}, {}, {}, {});
  checkout.confirmingOrder=true;await checkout.confirmPlaceOrder();
  checkout.confirmingOrder=false;checkout.placingOrder=true;await checkout.confirmPlaceOrder();await checkout.placeOrder();
});
test('checkout allows one confirmation and unlocks after dismissal',async()=>{
  const Checkout=component('pages/checkout.page.ts','CheckoutPage');let dismiss,opened=0;
  const alerts={create:async()=>{opened++;return {present:async()=>{},onDidDismiss:()=>new Promise(resolve=>dismiss=resolve)};}};
  const checkout=new Checkout({selectedPayment:{title:'Cash on Delivery'}},{},{},{},{},alerts,{});
  checkout.address={};checkout.loadingAddress=false;
  Object.defineProperty(checkout,'checkoutItems',{value:[{quantity:1}]});Object.defineProperty(checkout,'total',{value:100});
  const first=checkout.confirmPlaceOrder();await checkout.confirmPlaceOrder();
  await new Promise(resolve=>setImmediate(resolve));assert.equal(opened,1);assert.equal(checkout.canPlaceOrder,false);
  dismiss();await first;assert.equal(checkout.confirmingOrder,false);assert.equal(checkout.canPlaceOrder,true);
});
test('primary and supporting text colors meet 4.5:1 contrast',()=>{
  const css=fs.readFileSync(path.join(__dirname,'../src/theme/variables.scss'),'utf8');
  function luminance(hex){const values=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return values[0]*0.2126+values[1]*0.7152+values[2]*0.0722;}
  function ratio(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}
  const light=css.slice(0,css.indexOf('body.dark')),dark=css.slice(css.indexOf('body.dark'));
  const color=(s,key)=>s.match(new RegExp('--'+key+':\\s*(#[0-9a-f]{6})'))[1];
  assert.ok(ratio(color(light,'ion-color-primary'),'#ffffff')>=4.5);
  assert.ok(ratio(color(light,'ion-color-medium'),color(light,'ion-background-color'))>=4.5);
  assert.ok(ratio(color(dark,'ion-color-primary'),color(dark,'ion-card-background'))>=4.5);
  assert.ok(ratio(color(dark,'ion-color-medium'),color(dark,'ion-card-background'))>=4.5);
});
test('product purchasing retains stock and quantity restrictions',()=>{
  const Details=component('pages/product-details.page.ts','ProductDetailsPage');
  const details=new Details({}, {quantityFor:()=>0}, {}, {}, {}, {});
  details.product={id:1,stockCount:0,stock:'Out of Stock'};
  assert.equal(details.canAddSelectedQuantity,false);assert.equal(details.canBuySelectedQuantity,false);
  details.product={id:1,stockCount:1,stock:'In stock'};details.quantity=2;
  assert.equal(details.canAddSelectedQuantity,false);assert.equal(details.canBuySelectedQuantity,false);
  details.quantity=1;details.decreaseQuantity();assert.equal(details.quantity,1);assert.equal(details.canBuySelectedQuantity,true);
});


test('signed-in account loads identity and photo, and falls back after failure', async () => {
  const Account = component('pages/account.page.ts', 'AccountPage', {
    '../services/firebase': { firebaseAuth: { authStateReady: async () => {} } }
  });
  let fail = false;
  const user = { uid: 'alice', displayName: 'Alice Santos', email: 'alice@example.test' };
  const account = new Account({ currentUser: user }, {
    loadProfile: async () => { if (fail) throw new Error('offline'); return { fullName: 'Alice Maria Santos' }; }
  }, { loadProfilePhoto: async () => 'alice-photo' }, {}, {}, {});
  await account.ionViewWillEnter();
  assert.equal(account.profile.fullName, 'Alice Maria Santos');
  assert.equal(account.profile.email, user.email);
  assert.equal(account.profilePhoto, 'alice-photo');
  assert.equal(account.initials, 'AS');
  fail = true;
  await account.ionViewWillEnter();
  assert.equal(account.profile.fullName, user.displayName);
  assert.equal(account.profilePhoto, '');
  assert.equal(account.loadingProfile, false);
});

test('late profile response cannot replace the next account identity', async () => {
  const Account = component('pages/account.page.ts', 'AccountPage', {
    '../services/firebase': { firebaseAuth: { authStateReady: async () => {} } }
  });
  let resolveOld, markStarted;
  const started = new Promise(resolve => markStarted = resolve);
  const auth = { currentUser: { uid: 'old', email: 'old@example.test' } };
  const account = new Account(auth, {
    loadProfile: () => auth.currentUser.uid === 'old'
      ? new Promise(resolve => { resolveOld = resolve; markStarted(); })
      : Promise.resolve({ fullName: 'New Customer' })
  }, { loadProfilePhoto: async () => 'new-photo' }, {}, {}, {});
  const oldRequest = account.ionViewWillEnter();
  await started;
  auth.currentUser = { uid: 'new', email: 'new@example.test' };
  await account.ionViewWillEnter();
  resolveOld({ fullName: 'Old Customer' });
  await oldRequest;
  assert.equal(account.profile.fullName, 'New Customer');
  assert.equal(account.profile.email, 'new@example.test');
  assert.equal(account.profilePhoto, 'new-photo');
});
