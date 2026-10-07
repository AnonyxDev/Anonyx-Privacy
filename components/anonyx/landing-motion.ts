'use client';
import {useLayoutEffect,type RefObject} from 'react';

// Small, one-time entrances keep reading stable. No scroll-scrubbed rotations.
export function useLandingMotion(root:RefObject<HTMLDivElement|null>,paused=false){
 useLayoutEffect(()=>{
  const node=root.current;if(!node)return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   entry.target.classList.toggle('is-in-view',entry.isIntersecting);
   if(entry.isIntersecting)entry.target.classList.add('has-entered');
  }),{threshold:.1});
  node.querySelectorAll('.motion-section').forEach(el=>observer.observe(el));
  let cancelled=false;let revert=()=>{};
  if(!paused&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   import('gsap').then(({gsap})=>{
    if(cancelled)return;
    const context=gsap.context(()=>{
     gsap.from('.boundary-heading',{y:15,duration:.65,ease:'power2.out',clearProps:'transform'});
    },node);revert=()=>context.revert();
   }).catch(()=>{});
  }
  return()=>{cancelled=true;observer.disconnect();revert()};
 },[root,paused]);
}
