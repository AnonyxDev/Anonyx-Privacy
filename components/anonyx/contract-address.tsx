'use client';
import {useState} from 'react';
import {Copy,Check} from 'lucide-react';
import {TOKEN_ADDRESS} from '@/lib/project-links';
export function ContractAddress({compact=false}:{compact?:boolean}){
 const[copied,setCopied]=useState(false);const[error,setError]=useState(false);
 const copy=async()=>{try{await navigator.clipboard.writeText(TOKEN_ADDRESS);setCopied(true);setError(false)}catch{setError(true)}};
 return <div className={'contract-address'+(compact?' compact':'')}><span className="contract-label">CA</span><code title={TOKEN_ADDRESS}>{compact&&!error?`${TOKEN_ADDRESS.slice(0,8)}…${TOKEN_ADDRESS.slice(-6)}`:TOKEN_ADDRESS}</code><button type="button" onClick={copy} aria-label={copied?'Contract address copied':'Copy Anonyx contract address'} title="Copy full contract address">{copied?<Check size={15}/>:<Copy size={15}/>}<span>{copied?'Copied':'Copy'}</span></button><span className="sr-only" role="status">{copied?'Full contract address copied.':''}</span>{error&&<span className="contract-copy-error" role="status">Select the address to copy it manually.</span>}</div>;
}
