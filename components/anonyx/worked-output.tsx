'use client';
import {useState} from 'react';
import {Check,Copy} from 'lucide-react';
import {guidedResults} from '@/lib/guided-results';
export function WorkedOutput({requestId,id='worked-output-title'}:{requestId:string;id?:string}){
 const [copied,setCopied]=useState(false);const [copyError,setCopyError]=useState(false);const output=guidedResults[requestId];if(!output)return null;
 const copy=async()=>{try{await navigator.clipboard.writeText([output.title,...output.paragraphs,output.code||'',...(output.checks||[])].filter(Boolean).join('\n\n'));setCopied(true);setCopyError(false)}catch{setCopyError(true)}};
 return <article className="walkthrough-worked-output" aria-labelledby={id}><div className="worked-output-top"><div className="eyebrow">EXAMPLE RESULT</div><button className="button ghost small" onClick={copy}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'Copied':'Copy result'}</button></div><h3 id={id} tabIndex={-1}>{output.title}</h3><p className="walkthrough-output-origin">Prepared for this exact example. No AI provider was called.</p>{output.paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}{output.code&&<><h4>Suggested replacement</h4><pre tabIndex={0} aria-label="Suggested code"><code>{output.code}</code></pre><h4>Verification steps</h4><ol>{output.checks?.map(check=><li key={check}>{check}</li>)}</ol><p className="walkthrough-output-origin">Suggested checks; this code has not been executed in your application.</p></>}<div className="walkthrough-output-footer"><Check size={16}/><span>Only the first two context items inform this result. The separate record stays excluded.</span></div>{copyError&&<p role="status">Copy is unavailable in this browser. Select the result text to copy it.</p>}</article>;
}
