// Set this to the exact production Anonyx origin before hosting this adapter
// on a DIFFERENT static HTTPS origin. Empty configuration fails closed.
const ALLOWED_PARENT_ORIGIN = '';
const status = document.getElementById('status');
const connect = document.getElementById('connect');
const configured = ALLOWED_PARENT_ORIGIN.startsWith('https://') && ALLOWED_PARENT_ORIGIN !== location.origin;
let ready = false;
let catalog = [];
const seen = new Set();
connect.disabled = !configured;
if (configured) status.textContent = 'Connect only after reviewing the provider disclosure in Anonyx.';
connect.addEventListener('click', async () => {
  connect.disabled = true;
  try {
    if (!window.puter) await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='https://js.puter.com/v2/';s.onload=resolve;s.onerror=()=>reject(Error('Provider SDK failed to load.'));document.head.append(s)});
    await window.puter.auth.signIn();
    ready = true;
    status.textContent = 'Connected. Review and send requests from Anonyx.';
    window.opener?.postMessage({channel:'anonyx-v1',type:'ready'},ALLOWED_PARENT_ORIGIN);
  } catch {status.textContent='Authentication was cancelled or failed. Try again when ready.';connect.disabled=false}
});
window.addEventListener('message',async e=>{
  if(!configured||e.origin!==ALLOWED_PARENT_ORIGIN||e.source!==window.opener||!e.data||e.data.channel!=='anonyx-v1')return;
  const reply=value=>e.source.postMessage({channel:'anonyx-v1',...value},ALLOWED_PARENT_ORIGIN);
  if(e.data.type==='ping'){if(ready)reply({type:'ready'});return}
  const {id,kind,payload}=e.data;
  if(!ready||typeof id!=='string'||id.length>100||seen.has(id))return;
  seen.add(id);if(seen.size>500)seen.delete(seen.values().next().value);
  try{
    let result;
    if(kind==='catalog'){
      const raw=await window.puter.ai.listModels();
      if(!Array.isArray(raw))throw Error('Unsupported model catalog response.');
      catalog=raw.filter(m=>typeof m.id==='string'&&typeof m.provider==='string').map(m=>({id:m.id,name:m.name||m.id,provider:m.provider}));
      result=catalog;
    }else if(kind==='chat'){
      if(!payload||!catalog.some(m=>m.id===payload.model&&m.provider===payload.provider)||!Array.isArray(payload.messages)||payload.messages.length>201||payload.messages.some(m=>!['system','assistant','user'].includes(m.role)||typeof m.content!=='string')||JSON.stringify(payload).length>1500000)throw Error('Invalid or unverified request payload.');
      const response=await window.puter.ai.chat(payload.messages,{model:payload.model,provider:payload.provider,normalize:true,stream:false});
      if(typeof response?.message?.content!=='string')throw Error('Provider returned an unsupported response.');
      result=response.message.content;
    }else throw Error('Unsupported operation.');
    reply({id,type:'result',result});
  }catch{reply({id,type:'result',error:'The provider request failed. Check authentication, quota, or network access. No automatic retry was made.'})}
});
