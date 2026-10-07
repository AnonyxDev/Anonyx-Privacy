'use client';
import {useEffect,useState} from 'react';
import {getAgent,withAgent} from '@/lib/agents';
import {AgentOptions} from './agent-options';
import {ServiceNotice} from './service-notice';
import Link from 'next/link';
import {Layers3,ScanLine,Code2,LockKeyhole,Plus,Check,Eye} from 'lucide-react';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs';
import {homeRequests,requestAgent} from '@/lib/home-requests';
import {matchesWorkedRequest} from '@/lib/guided-results';
import {WorkedOutput} from './worked-output';
import {Checkbox} from '@/components/ui/checkbox';
import {Mark} from './shared';
import {useWorkspace} from './store';
import {buildPayload,maskIdentifiers,newId} from '@/lib/workspace';

export function HomePreview(){
 const s=useWorkspace();
 const[agentId,setAgentId]=useState('writing');
 const[action,setAction]=useState<string|null>(null);
 const agent=getAgent(agentId);
 const[requestId,setRequestId]=useState(homeRequests[0].id);
 const example=homeRequests.find(request=>request.id===requestId)!;
 const examples=example.context;
 const[text,setText]=useState(homeRequests[0].prompt);
 const[selected,setSelected]=useState<string[]>([]);
 const[review,setReview]=useState(false);
 const[approvedKey,setApprovedKey]=useState<string|null>(null);const[outputKey,setOutputKey]=useState<string|null>(null);
 const[maskVersion,setMaskVersion]=useState(0);
 const[error,setError]=useState('');
 const payload=withAgent(buildPayload(agent.model,text,examples,selected,[],[]),agentId);
 const payloadKey=JSON.stringify(payload);const approved=approvedKey===payloadKey;const showOutput=outputKey===payloadKey;
 const expected=withAgent(buildPayload(example.model,example.prompt,examples,examples.slice(0,2).map(item=>item.id),[],[]),requestAgent(example));const hasOutput=matchesWorkedRequest(payload,expected);
 useEffect(()=>{setApprovedKey(null);setOutputKey(null)},[payloadKey]);
 const run=()=>{if(!approved)return;if(hasOutput)setOutputKey(payloadKey);setAction(agent.name)};
 const reset=()=>{setText(example.prompt);setSelected([]);setReview(false);setError('');setMaskVersion(0)};
 const toggle=(id:string)=>{setSelected(current=>current.includes(id)?current.filter(value=>value!==id):[...current,id]);setReview(false);setError('')};
 const chooseRequest=(id:string)=>{const next=homeRequests.find(request=>request.id===id);if(!next)return;setRequestId(id);setAgentId(requestAgent(next));setText(next.prompt);setSelected([]);setReview(false);setError('');setMaskVersion(0)};
 return <Tabs value={requestId} onValueChange={chooseRequest} className="home-request-examples" activationMode="manual"><div className="home-agent-heading"><div className="eyebrow">AI AGENTS</div><h3>A different focus for every task.</h3><p>Choose an agent, shape your request, and control its context.</p></div><AgentOptions compact value={agentId} onChange={id=>{setAgentId(id);setReview(false)}}/><div className="home-examples-heading"><h3>Choose a request</h3><span>10 practical starting points · edit any prompt</span></div><TabsList className="home-example-list" aria-label="Request examples">{homeRequests.map((request,index)=><TabsTrigger key={request.id} value={request.id} className="home-example-tab"><span className="home-example-number">{String(index+1).padStart(2,'0')}</span><span><strong>{request.title}</strong><small>{request.category}</small></span></TabsTrigger>)}</TabsList><TabsContent value={requestId} className="home-request-panel"><div className="product-preview practical-preview">
  <aside className="preview-rail"><Mark/><button aria-label="Reset the selected request" className="preview-tool active" onClick={reset}><Plus size={19}/></button><button aria-label="Choose context for this request" onClick={()=>document.getElementById('home-context-title')?.scrollIntoView({block:'nearest'})}><Layers3 size={19}/></button><Link href="/developers" aria-label="Open developer tools"><Code2 size={19}/></Link><Link href="/privacy" aria-label="Explore privacy controls"><LockKeyhole size={19}/></Link></aside>
  <div className="preview-main">
   <div className="preview-top"><span>{agent.name} / {example.title}</span><span className="badge teal"><LockKeyhole size={12}/>Prepared on your device</span></div>
   <div className="preview-greeting"><Mark/><h3>{example.title}. Your context, by choice.</h3><p>{example.description}</p></div>
   <div className="preview-composer">{maskVersion>0&&<span key={maskVersion} className="mask-sweep" aria-hidden="true"/>}<label htmlFor="home-prompt" className="preview-field-label">Your prompt</label><textarea id="home-prompt" maxLength={10000} value={text} onChange={e=>{setText(e.target.value);setReview(false);setError('')}}/><div><button className="button secondary small" onClick={()=>{setText(maskIdentifiers(text));setReview(false);setMaskVersion(v=>v+1)}} disabled={!text.trim()}><ScanLine size={14}/>Mask identifiers</button><button className="button primary small" onClick={()=>setReview(value=>!value)} disabled={!text.trim()} aria-expanded={review} aria-controls="home-payload"><Eye size={14}/>{review?'Close review':'Review payload'}</button></div><p className="preview-mask-note">Masking checks common email and phone patterns in your prompt. Inspect selected context separately.</p></div>
   {review&&<div id="home-payload" className="preview-payload"><div className="preview-payload-heading"><strong>Exact request</strong><span>{selected.length} context {selected.length===1?'item':'items'} · no history</span></div><pre className="preview-json" aria-label="Prepared request payload">{JSON.stringify(payload,null,2)}</pre><p>No request was sent. Selected titles and text are included; unselected items stay out.</p><label className="receipt-approval"><Checkbox checked={approved} onCheckedChange={value=>setApprovedKey(value===true?payloadKey:null)}/><span>I reviewed and approve only the text shown above.</span></label><button className="button primary small home-run-agent" disabled={!text.trim()||!approved} onClick={run}>Run {agent.name}</button></div>}
   {showOutput&&<WorkedOutput requestId={requestId} id="home-example-result"/>}
   <div className="preview-disclosure"><span>{selected.length} selected · {examples.length-selected.length} excluded · {agent.name}</span><Link href="/workspace" className="text-link" onClick={event=>{
    const chosen=examples.filter(item=>selected.includes(item.id)).map(item=>({...item,id:newId()}));
    const items=[...s.items,...chosen];
    if(chosen.length&&!s.saveItems(items)){event.preventDefault();setError('The selected context could not be saved. Your prompt stays here; check your library and browser storage in the workspace.');return}
    s.setPrompt(text);s.setAgent(agentId);s.setModel(agent.model);s.setSelected(chosen.map(item=>item.id));s.setSelectedTurns([]);
   }}>Use this request in workspace</Link><p>You’ll review and approve it there before sending.</p>{error&&<p role="alert" className="error-text">{error}</p>}</div>
  </div>
  <aside className="preview-context"><div className="eyebrow">CONTEXT FOR THIS REQUEST</div><h4 id="home-context-title">What does this request need?</h4><p>Everything starts excluded. Select a detail to include its title and text.</p><button className="button secondary small suggested-context" onClick={()=>{setSelected(examples.slice(0,2).map(item=>item.id));setReview(false)}}>Use suggested context</button>{examples.map(item=><button key={item.id} className={'context-example '+(selected.includes(item.id)?'':'muted')} aria-pressed={selected.includes(item.id)} onClick={()=>toggle(item.id)}>{selected.includes(item.id)?<Check size={16}/>:<Plus size={16}/>}<span>{item.title}<small>{selected.includes(item.id)?'Included':'Excluded'}</small><span className="context-example-body">{item.body}</span></span></button>)}<div className="context-bottom"><LockKeyhole size={18}/><p>Text inside your prompt is included even when its context item is excluded. Mask or remove it before sharing.</p></div></aside>
 </div></TabsContent><ServiceNotice action={action} continueLabel={showOutput?'View example result':'Keep editing'} detail={action&&!hasOutput?'A fresh answer to this request needs live AI. To explore a prepared result, use the original prompt, its matching agent, and the first two context items.':undefined} onClose={()=>{setAction(null);if(showOutput)requestAnimationFrame(()=>document.getElementById('home-example-result')?.focus())}}/></Tabs>;
}
