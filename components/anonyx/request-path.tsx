'use client';
import {Check} from 'lucide-react';
export function RequestPath({hasPrompt,reviewed,approved,contextCount,historyCount,destination,sending,onWrite,onSelect,onReview}:{hasPrompt:boolean;reviewed:boolean;approved:boolean;contextCount:number;historyCount:number;destination:string;sending:boolean;onWrite:()=>void;onSelect:()=>void;onReview:()=>void}){
 const current=approved?3:reviewed?2:hasPrompt?1:0;
 const steps=[
  {title:'Write',detail:hasPrompt?'Draft ready':'Start with a prompt',action:onWrite,disabled:sending},
  {title:'Select',detail:`${contextCount} context · ${historyCount} history`,action:onSelect,disabled:sending},
  {title:'Review',detail:reviewed?'Snapshot ready':'Inspect exact text',action:onReview,disabled:!hasPrompt||sending},
  {title:'Approve',detail:approved?'Approved by you':'Confirm in review',action:onReview,disabled:!reviewed||sending},
 ];
 return <section className="request-path-panel" aria-label="Your request steps"><ol className="request-steps">{steps.map(({title,detail,action,disabled},index)=><li key={title}><button onClick={action} disabled={disabled} aria-current={index===current?'step':undefined}><span className="request-step-number">{index<current?<Check size={14}/>:String(index+1).padStart(2,'0')}</span><span><strong>{title}</strong><small>{detail}</small></span></button></li>)}</ol><div className="request-destination"><span>Destination <strong>{destination}</strong></span><span>{sending?'Approved request in progress':approved?'Current request approved':reviewed?'Awaiting your approval':'Preparation stays on your device'}</span></div></section>;
}
