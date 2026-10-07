'use client';
import {useEffect,useRef,useState} from 'react';
import {Check,Pause,Play} from 'lucide-react';
import {DataBoundaries} from '@/components/anonyx/data-boundaries';
import {HomePreview} from '@/components/anonyx/home-preview';
import {BoundaryHero} from '@/components/anonyx/boundary-hero';
import {PrincipleScenes,ArchitectureScene,DeveloperScene} from '@/components/anonyx/landing-scenes';
import {useLandingMotion} from '@/components/anonyx/landing-motion';
function Chapter({number,label}:{number:string;label:string}){return <div className="motion-chapter"><span>{number}</span><span>{label}</span><i className="chapter-line" aria-hidden="true"/></div>}
export default function Home(){const root=useRef<HTMLDivElement>(null);const[paused,setPaused]=useState(false);useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setPaused(media.matches);sync();media.addEventListener('change',sync);return()=>media.removeEventListener('change',sync)},[]);useLandingMotion(root,paused);return <div ref={root} className={'anonyx-landing'+(paused?' landing-motion-paused':'')}>
<button className="landing-motion-toggle" onClick={()=>setPaused(v=>!v)} aria-pressed={paused} aria-label={paused?'Resume page animations':'Pause page animations'}>{paused?<Play size={14}/>:<Pause size={14}/>}<span>{paused?'Motion paused':'Pause motion'}</span></button>
<div className="landing-progress" aria-hidden="true"/>
<BoundaryHero forcePaused={paused}/>
<section className="section motion-section workspace-section" id="workspace-preview"><Chapter number="01" label="MAKE IT YOURS"/><div className="section-heading"><div><div className="eyebrow">THE ANONYX WORKSPACE</div><h2>Useful AI.<br/>On your terms.</h2></div><p>Try a request. Choose its context.</p></div><div className="workspace-stage"><div className="workspace-orbit-label" aria-hidden="true">YOUR INPUT / YOUR BOUNDARY / YOUR REQUEST</div><HomePreview/></div><div className="home-walkthrough-entry"><div><h3>See Anonyx in practice.</h3><p>One task. Every sharing decision.</p></div><a href="/walkthrough" className="button secondary">Guided walkthrough</a></div></section>
<section className="section philosophy motion-section"><span className="section-watermark" aria-hidden="true">SELECT.</span><Chapter number="02" label="DRAW THE LINE"/><div className="eyebrow">BUILT AROUND YOUR CHOICES</div><h2 className="philosophy-title">{'Share what matters.'.split(' ').map(w=><span className="philosophy-word" key={w}>{w} </span>)}<br/>{'Keep the rest.'.split(' ').map(w=><span className="philosophy-word" key={w}>{w} </span>)}</h2><PrincipleScenes/></section>
<section className="closing section motion-section"><Chapter number="03" label="YOUR NEXT MOVE"/><div className="closing-gate" aria-hidden="true"><div className="closing-gate-left"><i/><i/><i/></div><div className="closing-gate-right"><i/><i/><i/></div></div><div className="closing-content"><div className="eyebrow">CHOOSE WHAT YOU SHARE</div><h2><span className="closing-title-line">Your next idea,</span><span className="closing-title-line">with Anonyx.</span></h2><a href="/workspace" className="button primary closing-cta">Open workspace</a><p>Start exploring. No wallet required.</p></div></section>
</div>}
