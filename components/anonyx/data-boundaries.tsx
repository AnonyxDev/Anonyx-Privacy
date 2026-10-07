import {Monitor,Server,BrainCircuit,Wallet} from 'lucide-react';
const boundaries=[
 {title:'Your device',Icon:Monitor,summary:'Draft and context preparation',detail:'Your draft and library stay in browser memory while you prepare a request. Remembered context is an explicit choice and uses unencrypted browser storage.',short:'Prepare locally. Saving context on this device is optional.'},
 {title:'Website hosting',Icon:Server,summary:'Page delivery and network metadata',detail:'Hosting receives the IP address and request metadata needed to deliver the website. Anonyx adds no advertising trackers, product analytics, or prompt logging.',short:'Hosting sees page-request metadata, including your IP address.'},
 {title:'Chosen AI provider',Icon:BrainCircuit,summary:'Text you approve and send',detail:'With a connected provider, your approved prompt, selected context and selected history are shared. The provider can read that text; its retention and data-use terms apply.',short:'A connected provider receives approved text under its own policies.'},
 {title:'Wallet and RPC services',Icon:Wallet,summary:'Account connection and chain reads',detail:'Optional wallet connections and RPC reads have their own data practices. Your connected address is not automatically appended to AI requests. Public blockchain activity remains observable.',short:'Wallet access is optional and separate from AI request text.'},
];
export function DataBoundaries({compact=false}:{compact?:boolean}){
 return <div className={'data-boundaries'+(compact?' compact':'')} aria-label="Who can see your data">{boundaries.map(({title,Icon,summary,detail,short})=><article key={title}><div className="data-boundary-heading"><Icon size={20}/><h3>{title}</h3></div>{!compact&&<strong>{summary}</strong>}<p>{compact?short:detail}</p></article>)}</div>;
}
