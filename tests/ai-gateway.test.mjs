import test from 'node:test';
import assert from 'node:assert/strict';
import {aiChat,aiCatalog} from '../lib/ai-gateway.ts';
const config={AI_ENABLED:'true',AI_API_KEY:'TEST_SERVER_SECRET',AI_MODEL:'approved-model',AI_ALLOWED_USER_IDS:'allowed',AI_PROVIDER_NAME:'Test provider'};
const payload={model:'approved-model',messages:[{role:'system',content:'Selected context only'},{role:'user',content:'Write a short brief'}]};
const req=(body={approved:true,payload},origin='https://anonyx.test')=>new Request('https://anonyx.test/api/ai',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
const never=async()=>{assert.fail('Unauthorized or invalid requests must not contact the provider')};
test('catalog exposes only the configured provider/model, never secrets or allowlist',async()=>{
 const result=await aiCatalog(config).json();assert.deepEqual(result,{models:[{id:'approved-model',name:'approved-model',provider:'Test provider'}]});assert.doesNotMatch(JSON.stringify(result),/TEST_SERVER_SECRET|allowed/);
 assert.deepEqual(await aiCatalog({...config,AI_ENABLED:'false'}).json(),{models:[]});
 assert.deepEqual(await aiCatalog({...config,AI_ALLOWED_USER_IDS:''}).json(),{models:[]});
});
test('missing configuration, anonymous and disallowed users never invoke AI',async()=>{
 assert.equal((await aiChat(req(),{},null,never)).status,503);
 assert.equal((await aiChat(req(),config,null,never)).status,401);
 assert.equal((await aiChat(req(),config,'other',never)).status,403);
});
test('cross-origin, unapproved, wrong-model and malformed messages are rejected',async()=>{
 assert.equal((await aiChat(req(undefined,'https://other.test'),config,'allowed',never)).status,403);
 for(const body of [{approved:false,payload},{approved:true,payload:{...payload,model:'expensive-model'}},{approved:true,payload:{...payload,messages:[{role:'tool',content:'Invalid'}]}},{approved:true,payload:{...payload,messages:[{role:'user',content:'x'.repeat(20001)}]}},null]) assert.equal((await aiChat(req(body),config,'allowed',never)).status,400);
});
test('body and cumulative content bounds protect the provider',async()=>{
 assert.equal((await aiChat(req({approved:true,payload,padding:'x'.repeat(200001)}),config,'allowed',never)).status,413);
 const p={...payload,messages:[{role:'system',content:'x'.repeat(20000)},{role:'user',content:'y'.repeat(20000)},{role:'user',content:'z'}]};
 assert.equal((await aiChat(req({approved:true,payload:p}),config,'allowed',never)).status,400);
});
test('gateway forwards exact reviewed messages, strips extras, pins credentials and returns text',async()=>{
 let called=0;
 const upstream=async(url,options)=>{called++;assert.equal(url,'https://api.openai.com/v1/chat/completions');assert.equal(options.headers.Authorization,'Bearer TEST_SERVER_SECRET');assert.equal(options.redirect,'error');assert.deepEqual(JSON.parse(options.body),{model:'approved-model',messages:payload.messages,stream:false,store:false,max_completion_tokens:1200});return Response.json({choices:[{message:{content:'A useful client brief'}}],private:'NEVER_RETURN'});};
 const result=await aiChat(req({approved:true,payload:{...payload,baseURL:'https://attacker.test',wallet:'SECRET_WALLET',apiKey:'CLIENT_KEY'}}),{...config,AI_ALLOWED_USER_IDS:'success'},'success',upstream);
 assert.equal(result.status,200);assert.deepEqual(await result.json(),{text:'A useful client brief',model:'approved-model'});assert.equal(called,1);assert.match(result.headers.get('Cache-Control'),/no-store/);
});
test('provider errors and empty answers are sanitized without retrying',async()=>{
 let called=0;
 const result=await aiChat(req(),{...config,AI_ALLOWED_USER_IDS:'errors'},'errors',async()=>{called++;return Response.json({error:'TEST_SERVER_SECRET provider internals'}, {status:401})});
 assert.equal(result.status,502);assert.doesNotMatch(JSON.stringify(await result.json()),/TEST_SERVER_SECRET|internals/);assert.equal(called,1);
 assert.equal((await aiChat(req(),{...config,AI_ALLOWED_USER_IDS:'empty'},'empty',async()=>Response.json({choices:[]}))).status,502);
});
test('burst guard rejects a fifth request without a provider call',async()=>{
 const env={...config,AI_ALLOWED_USER_IDS:'limited'};
 for(let i=0;i<4;i++)assert.equal((await aiChat(req(),env,'limited',async()=>Response.json({choices:[{message:{content:'OK'}}]}))).status,200);
 const result=await aiChat(req(),env,'limited',never);assert.equal(result.status,429);assert.equal(result.headers.get('Retry-After'),'60');
});
test('cancellation reaches upstream and preserves a recoverable error',async()=>{
 const controller=new AbortController();const original=req();const request=new Request(original,{signal:controller.signal});
 const promise=aiChat(request,{...config,AI_ALLOWED_USER_IDS:'cancel'},'cancel',async(_url,options)=>new Promise((_resolve,reject)=>{options.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true});controller.abort();}));
 const response=await promise;assert.equal(response.status,502);assert.match((await response.json()).error,/stopped or timed out/);
});
test('server timeout aborts upstream without returning provider data',async(t)=>{
 t.mock.timers.enable({apis:['setTimeout']});
 let started;const ready=new Promise(resolve=>{started=resolve});
 const result=aiChat(req(),{...config,AI_ALLOWED_USER_IDS:'timeout'},'timeout',async(_url,options)=>new Promise((_resolve,reject)=>{options.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true});started();}));
 await ready;t.mock.timers.tick(30000);
 const response=await result;assert.equal(response.status,502);assert.match((await response.json()).error,/timed out/);
 t.mock.timers.reset();
});
