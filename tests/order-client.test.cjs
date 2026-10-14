const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('../node_modules/typescript');
test('an uncertain order response keeps its request ID across app instances',async()=>{
 const cache=new Map(),calls=[];let fail=true;const exports={};const user={uid:'alice'};
 const code=ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/app/services/order.service.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,experimentalDecorators:true}}).outputText;
 vm.runInNewContext(code,{exports,crypto:require('node:crypto').webcrypto,TextEncoder,localStorage:{getItem:key=>cache.get(key)||null,setItem:(key,value)=>cache.set(key,value),removeItem:key=>cache.delete(key)},require(module){if(module==='@angular/core')return {Injectable:()=>value=>value};if(module==='./firebase')return {firebaseAuth:{currentUser:user},firebaseApp:{}};if(module==='firebase/functions')return {getFunctions:()=>({}),httpsCallable:()=>async payload=>{calls.push(payload);if(fail)throw new Error('Response lost');return {data:{orderId:'one',orderNumber:'SH-ONE'}};}};return {};}});
 const first=new exports.OrderService();await assert.rejects(first.placeOrder({items:[{productId:1,quantity:1}]}));
 assert.equal(cache.size,1);assert.ok(![...cache.values()][0].includes('items'));
 fail=false;const second=new exports.OrderService();await second.placeOrder({items:[{productId:1,quantity:1}]});assert.equal(calls[0].requestId,calls[1].requestId);assert.equal(cache.size,0);
 await second.placeOrder({items:[{productId:1,quantity:1}]});assert.notEqual(calls[1].requestId,calls[2].requestId);
});
