'use client';
import {useState,type CSSProperties} from 'react';
import {Eye,Layers3,ScanLine,Code2,RotateCcw,LockKeyhole,Check} from 'lucide-react';

const principles=[
 {number:'01',Icon:Eye,title:'Your identity. Your boundary.',text:'Start without a wallet. Your connected wallet address is not automatically added to AI requests.',type:'identity'},
 {number:'02',Icon:Layers3,title:'Context, on your terms.',text:'Keep what matters. Select the details each request needs, and leave the rest out.',type:'context'},
 {number:'03',Icon:ScanLine,title:'See it before you send it.',text:'Read the exact request, then approve it. Change a detail and Anonyx asks you to review again.',type:'review'},
];
export function PrincipleScenes(){return <div className="pillar-grid">{principles.map(({number,Icon,title,text,type})=><article className={'pillar motion-pillar '+type} key={type}>
 <div className="pillar-top"><span>{number} / CONTROL</span><Icon size={20}/></div>
 <div className={'principle-diagram diagram-'+type} aria-hidden="true">
 {type==='identity'?<><div className="identity-node"><LockKeyhole/><span>IDENTITY</span></div><div className="identity-wall"><i/><i/><i/></div><div className="request-node"><span>REQUEST</span><b/><b/><b/></div><div className="identity-track"><i/></div></>:type==='context'?<><div className="context-slab slab-back"><span>YOUR LIBRARY</span><i/><i/><i/></div><div className="context-slab slab-mid"><span>SELECTED CONTEXT</span><Check size={16}/></div><div className="context-slab slab-front"><span>THIS REQUEST</span><i/></div></>:<><div className="review-sheet"><span>REQUEST</span><i/><i/><i/><div className="review-scanner"/></div><div className="review-check"><Check size={19}/></div></>}
 </div><h3>{title}</h3><p>{text}</p><a href="/privacy" className="text-link">Explore privacy controls</a>
 </article>)}</div>}
const layers=[
 {title:'Identity',short:'Your access',text:'Wallet connection is optional. Connected wallet fields are excluded from AI request text.',Icon:Eye},
 {title:'Context',short:'Your selection',text:'Choose the information a request needs. The rest of your context library stays out.',Icon:Layers3},
 {title:'Inference',short:'Your model',text:'Preparing a request stays local. External providers process only the request you approve and send; their data-use policies apply.',Icon:ScanLine},
 {title:'Payment',short:'Your resources',text:'The proposed usage layer separates funding and settlement from prompt content. Payment execution is not implemented, and public transactions remain observable.',Icon:LockKeyhole},
];
export function ArchitectureScene(){const[active,setActive]=useState(1);return <div className="architecture-experience">
 <div className="architecture-stage" aria-hidden="true"><div className="stage-coordinate top">ANONYX / SEPARATE BY DESIGN</div><div className="stack-perspective"><div className="layer-stack">{layers.map(({title,Icon},i)=><div className={'architecture-plane '+(i===active?'selected':'')} key={title} style={{'--plane-depth':`${(3-i)*67}px`,'--plane-order':i} as CSSProperties}><div className="plane-face"><div className="plane-title"><span>0{i+1}</span><strong>{title}</strong><Icon size={23}/></div><div className="plane-route"><i/><i/><i/><i/></div><div className="plane-edge"/></div></div>)}</div></div><div className="stage-coordinate bottom"><span>FOUR LAYERS</span><span>ONE INTENTIONAL REQUEST</span></div></div>
 <div className="architecture-selector"><p className="architecture-instruction">Explore the boundaries.</p>{layers.map(({title,short},i)=><button key={title} onClick={()=>setActive(i)} aria-pressed={active===i} className={'layer-select '+(active===i?'active':'')}><span>0{i+1}</span><strong>{title}</strong><small>{short}</small><span className="selection-mark">{active===i?'−':'+'}</span></button>)}<p className="layer-description" aria-live="polite" key={active}>{layers[active].text}</p></div>
 </div>}
const codeLines=['{','  "model": "anonyx-writing",','  "messages": [','    {"role": "system", "content": "User-selected context: concise writing"},','    {"role": "user", "content": "Write a short project brief."}','  ]','}'];
export function DeveloperScene(){const[replay,setReplay]=useState(0);return <div className="developer-experience"><div className="request-path" aria-hidden="true"><span>YOUR APP</span><div><i/></div><span>REVIEWED REQUEST</span></div><div className="code-window"><div className="code-title"><Code2 size={16}/><span>request.json</span><span className="badge">REQUEST</span></div><pre className="assembled-code" key={replay}><code>{codeLines.map((line,i)=><span className="assembly-line" style={{'--line':i} as CSSProperties} key={i}><span aria-hidden="true" className="line-number">{String(i+1).padStart(2,'0')}</span><span>{line}</span>{i<codeLines.length-1?'\n':''}</span>)}</code></pre><div className="code-foot"><span>Readable. Reviewable. Intentional.</span><button onClick={()=>setReplay(n=>n+1)} aria-label="Replay request assembly"><RotateCcw size={14}/> Replay</button></div></div><div className="developer-tags"><span><Check size={12}/> Explicit context</span><span><Check size={12}/> Consistent format</span><span><Check size={12}/> Your choice</span></div></div>}
