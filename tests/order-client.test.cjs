const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('../node_modules/typescript');
test('an uncertain order response keeps its request ID across app instances',async()=>{
 const cache=new Map(),calls=[],records=new Map([['products/1',{name:'Toothbrush',price:100,stock:5}]]);let fail=true;const exports={};const user={uid:'alice',email:'alice@example.test'};
 const code=ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/app/services/order.service.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,experimentalDecorators:true}}).outputText;
 const productModels={};
 const modelCode=ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/app/models/product.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
 vm.runInNewContext(modelCode,{exports:productModels});
 const firestore={doc:(_,collection,id)=>({path:collection+'/'+id}),serverTimestamp:()=>1,Timestamp:{now:()=>1},async runTransaction(_,fn){const changes=[];const result=await fn({get:async ref=>{if(ref.path.startsWith('orders/'))calls.push(ref.path);return {exists:()=>records.has(ref.path),data:()=>records.get(ref.path)};},set:(ref,data)=>changes.push([ref.path,data])});changes.forEach(([key,data])=>records.set(key,data));if(fail)throw new Error('Response lost');return result;}};
 vm.runInNewContext(code,{exports,crypto:require('node:crypto').webcrypto,TextEncoder,localStorage:{getItem:key=>cache.get(key)||null,setItem:(key,value)=>cache.set(key,value),removeItem:key=>cache.delete(key)},require(module){if(module==='@angular/core')return {Injectable:()=>value=>value};if(module==='./firebase')return {firebaseAuth:{currentUser:user},firestore:{}};if(module==='firebase/firestore')return firestore;if(module==='../models/product')return productModels;return {};}});
 const payload={items:[{productId:1,quantity:1}],paymentMethod:'GCash (SmileHub QR)',deliveryMethod:'Standard Delivery',shippingAddress:{recipient:'Alice',phone:'09171234567',city:'Manila',street:'Main'},subtotal:100,shippingFee:120,discount:0,total:220};
 const first=new exports.OrderService();await assert.rejects(first.placeOrder(payload),/Response lost/);
 assert.equal(cache.size,1);assert.ok(![...cache.values()][0].includes('items'));
 fail=false;const second=new exports.OrderService();await second.placeOrder(payload);assert.equal(calls[0],calls[1]);assert.equal(cache.size,0);
 await second.placeOrder(payload);assert.notEqual(calls[1],calls[2]);
 assert.equal([...records.keys()].filter(key=>key.startsWith('orders/')).length,2);
 assert.equal(records.get(calls[0]).paymentStatus,'unpaid');assert.equal(records.get(calls[0]).gcashPaymentStatus,'Pending Payment');
 assert.equal(records.get('products/1').stock,5);
});
