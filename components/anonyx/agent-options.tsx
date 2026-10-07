 'use client';
import {Bot,Search,PenLine,Code2,ChartNoAxesCombined,ListChecks,Check} from 'lucide-react';
import {agents} from '@/lib/agents';
const icons=[Bot,Search,PenLine,Code2,ChartNoAxesCombined,ListChecks];
export function AgentOptions({value,onChange,compact=false}:{value:string;onChange:(id:string)=>void;compact?:boolean}){
 return <div className={'agent-options'+(compact?' compact':'')} role="group" aria-label="Choose an AI agent">{agents.map((agent,index)=>{const Icon=icons[index];return <button type="button" key={agent.id} aria-pressed={value===agent.id} onClick={()=>onChange(agent.id)} className="agent-option"><span className="agent-option-icon"><Icon size={20}/></span><span className="agent-option-text"><small>{agent.role}</small><strong>{agent.name}</strong>{!compact&&<span>{agent.description}</span>}</span>{value===agent.id&&<Check size={16} className="agent-selected" aria-label="Selected"/>}</button>})}</div>;
}
