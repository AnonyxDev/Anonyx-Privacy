'use client';
import {Check,Eye,Monitor} from 'lucide-react';
import {Checkbox} from '@/components/ui/checkbox';
import type {RequestPayload} from '@/lib/workspace';

export function RequestReceipt({payload,external,contextCount,historyCount,workflowInput,sending,approved,onApproval}:{payload:RequestPayload;external:boolean;contextCount:number;historyCount:number;workflowInput:boolean;sending:boolean;approved:boolean;onApproval:(approved:boolean)=>void}){
  return <section className="privacy-receipt" aria-labelledby="request-receipt-title">
    <div className="receipt-heading"><Eye size={20}/><div><h3 id="request-receipt-title">Your sharing summary</h3><p>Review the exact text below. Nothing is sent by opening this summary.</p></div></div>
    <dl className="receipt-facts">
      <div><dt>Destination</dt><dd>{external?`Puter / ${payload.provider||'Provider not selected'}`:'Anonyx agent request'}</dd></div>
      <div><dt>{external?'Model':'Request profile'}</dt><dd>{payload.model}</dd></div>
      <div><dt>Request state</dt><dd>{sending?'Sending approved request':approved?'Approved by you':'Awaiting your approval'}</dd></div>
      <div><dt>Context included</dt><dd>{contextCount} selected {contextCount===1?'item':'items'}</dd></div>
      <div><dt>Conversation turns included</dt><dd>{historyCount} selected {historyCount===1?'turn':'turns'}{workflowInput?'. The previous workflow output is included in the prompt below.':''}</dd></div>
      <div><dt>Excluded by Anonyx</dt><dd>Unselected library items, unselected history, connected wallet address</dd></div>
    </dl>
    <div className="receipt-messages">{payload.messages.map((message,index)=><div className="receipt-message" key={index}><span>{message.role==='system'?(message.content.startsWith('Anonyx agent: ')?'AGENT INSTRUCTIONS':'SELECTED CONTEXT'):message.role==='assistant'?'SELECTED RESPONSE':index===payload.messages.length-1?'YOUR PROMPT':'SELECTED MESSAGE'}</span><pre>{message.content}</pre></div>)}</div>
    <div className="receipt-boundary"><Monitor size={18}/><p>{external?'The selected provider can read submitted text. Its retention and data-use policies apply; Anonyx cannot erase its records.':'This request is prepared on your device. Only the reviewed text is included in this request.'} Details you type or select—including names or wallet addresses—are part of the text shown above.</p></div>
    <details className="receipt-json"><summary>Inspect the complete request JSON</summary><pre className="json">{JSON.stringify(payload,null,2)}</pre></details>
    <label className="receipt-approval"><Checkbox checked={approved} disabled={sending} onCheckedChange={value=>onApproval(value===true)}/><span>I reviewed the destination and approve only the text shown above{external?' with this provider':''}.</span></label>
    <p className="receipt-review-state" role="status">{approved?<><Check size={15}/>Approved by you. Any request change requires a fresh review.</>:'Your approval is needed before Run becomes available.'}</p>
  </section>;
}
