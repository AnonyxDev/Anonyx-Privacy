'use client';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
export function Mark({className=''}:{className?:string}) {return <svg className={className} viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><path d="M20 17 32 5l12 12-7 7-5-5-5 5zM47 20l12 12-12 12-7-7 5-5-5-5zM44 47 32 59 20 47l7-7 5 5 5-5zM17 44 5 32l12-12 7 7-5 5 5 5z"/></svg>}
export function Brand(){return <a href="/" className="brand" aria-label="Anonyx home"><Mark/><span>anonyx</span></a>}
export function Picker({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:{value:string;label:string}[]}){return <div className="picker"><label>{label}</label><Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label}><SelectValue/></SelectTrigger><SelectContent>{options.map(o=><SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select></div>}
export function PageIntro({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){return <header className="page-intro"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></header>}
export const whitepaper='https://docs.google.com/document/d/1bqtbJ-Lxp1nY6GW98NlWMun1zX2J3D4fu5gfdlfHv6Y/edit?usp=sharing';
export function download(name:string,content:string){const url=URL.createObjectURL(new Blob([content],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
