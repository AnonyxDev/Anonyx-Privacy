import test from 'node:test';
import assert from 'node:assert/strict';
import {InferenceBridge,InferenceError} from '../lib/inference.ts';
test('catalog check carries no prompt, context, credentials or wallet fields',async(t)=>{
 t.mock.method(globalThis,'fetch',async(url,options)=>{assert.equal(url,'/api/ai');assert.equal(options.method,'GET');assert.equal(options.credentials,'same-origin');assert.equal(options.cache,'no-store');assert.equal(options.body,undefined);return Response.json({models:[]});});
 assert.deepEqual(await new InferenceBridge().open().request('catalog'),[]);
});
test('approved chat snapshot reaches only the same-origin endpoint',async(t)=>{
 const payload={model:'configured-model',messages:[{role:'user',content:'A reviewed prompt'}]};
 t.mock.method(globalThis,'fetch',async(url,options)=>{assert.equal(url,'/api/ai');assert.equal(options.method,'POST');assert.deepEqual(JSON.parse(options.body),{payload,approved:true});return Response.json({text:'A real provider response'});});
 assert.equal(await new InferenceBridge().request('chat',payload),'A real provider response');
});
test('provider access failures remain failures, never fabricated answers',async(t)=>{
 t.mock.method(globalThis,'fetch',async()=>Response.json({error:'Sign in to continue',code:'sign_in_required'},{status:401}));
 await assert.rejects(new InferenceBridge().request('chat',{}),error=>error instanceof InferenceError&&error.code==='sign_in_required');
});
test('Stop aborts pending client requests',async(t)=>{
 t.mock.method(globalThis,'fetch',async(_url,options)=>new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true})));
 const bridge=new InferenceBridge();const pending=bridge.request('chat',{});bridge.close();
 await assert.rejects(pending,error=>error.code==='aborted');
});
