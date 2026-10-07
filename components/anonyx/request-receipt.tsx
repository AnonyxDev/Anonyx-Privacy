'use client';
import {Checkbox} from '@/components/ui/checkbox';
import type {RequestPayload} from '@/lib/workspace';

export function RequestReceipt({payload,external,contextCount,historyCount,workflowInput,sending,approved,onApproval}:{payload:RequestPayload;external:boolean;contextCount:number;historyCount:number;workflowInput:boolean;sending:boolean;approved:boolean;onApproval:(approved:boolean)=>void}){
 return <section className="privacy-receipt" aria-label="Exact request review">
  <div className="receipt-compact-summary"><span>{contextCount} context {contextCount===1?'item':'items'}</span><span>{historyCount} history turns</span><span>{external?payload.provider:'Prepared on your device'}</span></div>
  <div className="receipt-messages">{payload.messages.map((message,index)=>{
   const instructions=message.role==='system'&&message.content.startsWith('Anonyx agent: ');
   const label=instructions?'Agent instructions':message.role==='system'?'Selected context':message.role==='assistant'?'Selected response':index===payload.messages.length-1?'Your prompt':'Selected message';
   return instructions?<details className="receipt-message" key={index}><summary>{label}</summary><pre>{message.content}</pre></details>:<div className="receipt-message" key={index}><span>{label}</span><pre>{message.content}</pre></div>;
  })}</div>
  {workflowInput&&<p className="workspace-dialog-intro">The previous workflow output is included in this prompt.</p>}
  <p className="receipt-short-boundary">Unselected context, unselected history and your connected wallet address stay out.{external?' Anonyx’s server forwards the approved text to the provider; its data policies apply.':''}</p>
  <details className="receipt-json"><summary>Request JSON · {payload.model}</summary><pre className="json">{JSON.stringify(payload,null,2)}</pre></details>
  <label className="receipt-approval"><Checkbox checked={approved} disabled={sending} onCheckedChange={value=>onApproval(value===true)}/><span>I reviewed and approve this exact request.</span></label>
 </section>;
}
