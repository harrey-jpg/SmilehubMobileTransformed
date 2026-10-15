const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function setup(stock=5){
 const records=new Map([['products/1',{name:'Toothbrush',price:100,stock}],['users/alice',{status:'active'}]]);let queue=Promise.resolve();
 const db={collection:name=>({doc:id=>({id,path:name+'/'+id})}),runTransaction(fn){const result=queue.then(async()=>{let writing=false;const writes=[];const value=await fn({get:async ref=>{assert.equal(writing,false,'reads precede writes');return {exists:records.has(ref.path),data:()=>records.get(ref.path)};},set:(ref,data)=>{writing=true;writes.push([ref.path,data,false]);},update:(ref,data)=>{writing=true;writes.push([ref.path,data,true]);}});for(const [key,data,merge]of writes)records.set(key,merge?{...records.get(key),...data}:data);return value;});queue=result.catch(()=>{});return result;}};
 const exports={};class HttpsError extends Error{constructor(code,message){super(message);this.code=code;}}
 vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../functions/lib/customer-orders.js'),'utf8'),{exports,require(module){if(module==='node:crypto')return require(module);if(module==='firebase-functions/v2/firestore')return {onDocumentUpdated:(_,fn)=>fn};if(module==='firebase-functions/v2/https')return {onCall:(_,fn)=>fn,HttpsError};if(module==='firebase-admin/firestore')return {getFirestore:()=>db,Timestamp:{now:()=>1},FieldValue:{serverTimestamp:()=>1,arrayUnion:value=>({arrayUnion:value})}};return require(path.join(__dirname,'../functions/lib',module));}});
 const request=(overrides={},uid='alice')=>({auth:{uid,token:{email:uid+'@example.test'}},data:{requestId:'12345678-1234-1234-1234-123456789012',items:[{productId:1,quantity:2}],shippingAddress:{recipient:'Customer',phone:'09171234567',city:'Manila',barangay:'One',street:'Main',postalCode:'1000'},deliveryMethod:'Standard Delivery',paymentMethod:'Cash on Delivery',couponCode:'',subtotal:200,shippingFee:120,discount:0,total:320,...overrides}});
 return {...exports,records,request};
}
test('order placement reserves stock once, ignores forged ownership, and reuses retry IDs',async()=>{
 const app=setup();const request=app.request({userId:'bob',status:'Delivered'});
 const first=await app.mobilePlaceOrder(request);const retry=await app.mobilePlaceOrder(request);
 assert.equal(first.orderId,retry.orderId);assert.equal(app.records.get('products/1').stock,3);
 const order=app.records.get('orders/'+first.orderId);assert.equal(order.userId,'alice');assert.equal(order.status,'Pending');
 assert.equal([...app.records.keys()].filter(key=>key.startsWith('orders/')).length,1);
});
test('invalid orders do not change inventory or create records',async()=>{
 for(const override of [{items:[{productId:1,quantity:1.5}]},{total:1},{items:[{productId:1,quantity:6}]},{shippingAddress:{}},{couponCode:'FAKE'},{deliveryMethod:'Unknown'}]){
  const app=setup();await assert.rejects(app.mobilePlaceOrder(app.request(override)));assert.equal(app.records.get('products/1').stock,5);assert.equal([...app.records.keys()].some(key=>key.startsWith('orders/')),false);
 }
 const app=setup();await assert.rejects(app.mobilePlaceOrder({auth:null,data:{}}),error=>error.code==='unauthenticated');
 app.records.set('users/alice',{status:'suspended'});await assert.rejects(app.mobilePlaceOrder(app.request()),error=>error.code==='permission-denied');
});
test('duplicate product lines aggregate stock and concurrent buyers cannot oversell',async()=>{
 const app=setup(3);await app.mobilePlaceOrder(app.request({items:[{productId:1,quantity:1},{productId:1,quantity:1}]}));assert.equal(app.records.get('products/1').stock,1);
 const request=app.request({requestId:'abcdefgh-1234-1234-1234-123456789012'});await assert.rejects(app.mobilePlaceOrder(request));assert.equal(app.records.get('products/1').stock,1);
 const race=setup(2);const results=await Promise.allSettled([race.mobilePlaceOrder(race.request()),race.mobilePlaceOrder(race.request({requestId:'abcdefgh-1234-1234-1234-123456789012'}))]);
 assert.equal(results.filter(value=>value.status==='fulfilled').length,1);assert.equal(race.records.get('products/1').stock,0);
});
test('cancellation checks ownership and restores stock exactly once',async()=>{
 const app=setup();const order=await app.mobilePlaceOrder(app.request());
 await assert.rejects(app.mobileCancelOrder({auth:{uid:'bob'},data:{orderId:order.orderId}}),error=>error.code==='permission-denied');
 const request={auth:{uid:'alice'},data:{orderId:order.orderId,reason:'Changed my mind'}};
 await app.mobileCancelOrder(request);await app.mobileCancelOrder(request);assert.equal(app.records.get('products/1').stock,5);assert.equal(app.records.get('orders/'+order.orderId).status,'Cancelled');
 const second=await app.mobilePlaceOrder(app.request({requestId:'abcdefgh-1234-1234-1234-123456789012'}));app.records.get('orders/'+second.orderId).status='Shipped';
 await assert.rejects(app.mobileCancelOrder({auth:{uid:'alice'},data:{orderId:second.orderId}}),error=>error.code==='failed-precondition');assert.equal(app.records.get('products/1').stock,3);
});
test('client-created orders cannot authorize inventory increases',async()=>{
 const app=setup();app.records.set('orders/forged',{userId:'alice',status:'Pending',items:[{productId:1,quantity:1000}],inventoryReserved:true});
 await assert.rejects(app.mobileCancelOrder({auth:{uid:'alice'},data:{orderId:'forged'}}),error=>error.code==='failed-precondition');assert.equal(app.records.get('products/1').stock,5);
 const first=await app.mobilePlaceOrder(app.request());
 await assert.rejects(app.mobilePlaceOrder(app.request({shippingAddress:{recipient:'Other',phone:'09171234567',city:'Manila',barangay:'One',street:'Main',postalCode:'1000'}})),error=>error.code==='failed-precondition');
 assert.equal(app.records.get('orders/'+first.orderId).shippingAddress.recipient,'Customer');
});
test('web/admin cancellation events restore reserved mobile inventory once',async()=>{
 const app=setup();const order=await app.mobilePlaceOrder(app.request());
 app.records.get('orders/'+order.orderId).status='Cancelled';
 const event={params:{orderId:order.orderId},data:{before:{data:()=>({status:'Pending'})},after:{data:()=>({status:'Cancelled'})}}};
 await app.restoreCancelledOrderInventory(event);await app.restoreCancelledOrderInventory(event);assert.equal(app.records.get('products/1').stock,5);
 const other=setup();const cancelled=await other.mobilePlaceOrder(other.request());await other.mobileCancelOrder({auth:{uid:'alice'},data:{orderId:cancelled.orderId}});
 await other.restoreCancelledOrderInventory({...event,params:{orderId:cancelled.orderId}});assert.equal(other.records.get('products/1').stock,5);
});
test('server totals preserve the mobile shipping and coupon policy',()=>{
 const {mobileTotals}=require('../functions/lib/order-validation');
 assert.deepEqual(mobileTotals(100,'Standard Delivery','SMILE10'),{subtotal:100,shippingFee:120,discount:10,total:210});
 assert.deepEqual(mobileTotals(3000,'Standard Delivery','SMILE10'),{subtotal:3000,shippingFee:0,discount:300,total:2700});
 assert.deepEqual(mobileTotals(5000,'Express Delivery','SMILE10'),{subtotal:5000,shippingFee:220,discount:349.9,total:4870.1});
});

test('paid orders and GCash claims cannot be cancelled or release inventory', async()=>{
 for(const state of ['paid','gcash-paid','For Verification','Paid','Rejected']) {
  const app=setup();const placed=await app.mobilePlaceOrder(app.request());
  const order=app.records.get('orders/'+placed.orderId);
  if(state==='paid') {order.paymentStatus='paid';order.status='Processing';}
  else if(state==='gcash-paid') order.gcashPaymentStatus='Paid';
  else app.records.set('gcash_payment_claims/'+placed.orderId,{status:state});
  await assert.rejects(app.mobileCancelOrder({auth:{uid:'alice'},data:{orderId:placed.orderId}}),error=>error.code==='failed-precondition');
  assert.notEqual(order.status,'Cancelled');assert.equal(app.records.get('products/1').stock,3);
  assert.equal(app.records.get('order_inventory/'+placed.orderId).restored,false);
 }
});