'use client';
import {useLayoutEffect,type RefObject} from 'react';

// Transform-only timelines: never pin, wrap, or reparent React-owned nodes.
export function useLandingMotion(root:RefObject<HTMLDivElement|null>,paused=false){
 useLayoutEffect(()=>{
  const node=root.current;if(!node)return;
  let cancelled=false;let revert=()=>{};
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   entry.target.classList.toggle('is-in-view',entry.isIntersecting);
   if(entry.isIntersecting)entry.target.classList.add('has-entered');
  }),{threshold:.12});
  node.querySelectorAll('.motion-section').forEach(el=>observer.observe(el));
  if(paused)return()=>observer.disconnect();
  Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([{gsap},{ScrollTrigger}])=>{
   if(cancelled)return;
   gsap.registerPlugin(ScrollTrigger);const mm=gsap.matchMedia();
   mm.add({motion:'(prefers-reduced-motion: no-preference)',desktop:'(min-width: 801px)'},(media)=>{
    if(!media.conditions?.motion)return;
    const desktop=media.conditions.desktop;
    const context=gsap.context(()=>{
     gsap.from('.boundary-heading h1',{y:36,rotateX:6,duration:1.2,ease:'power3.out',clearProps:'transform'});
     gsap.from('.boundary-intro',{y:28,duration:1.4,ease:'power3.out',clearProps:'transform'});
     gsap.utils.toArray<HTMLElement>('.motion-section').forEach(section=>{
      gsap.from(section.querySelectorAll('.section-heading h2,.chapter-title'),{y:60,rotateX:10,duration:1.15,ease:'power3.out',scrollTrigger:{trigger:section,start:'top 85%',once:true},clearProps:'transform'});
      const line=section.querySelector('.chapter-line');if(line)gsap.fromTo(line,{scaleX:.03},{scaleX:1,ease:'none',scrollTrigger:{trigger:section,start:'top 88%',end:'top 25%',scrub:.6}});
      const watermark=section.querySelector('.section-watermark');if(watermark)gsap.fromTo(watermark,{xPercent:8},{xPercent:-12,ease:'none',scrollTrigger:{trigger:section,start:'top bottom',end:'bottom top',scrub:1.2}});
     });
     gsap.fromTo('.workspace-stage',{rotateX:desktop?14:3,y:desktop?100:35,scale:desktop?.90:.97},{rotateX:0,y:0,scale:1,ease:'none',scrollTrigger:{trigger:'#workspace-preview',start:'top 90%',end:'top 5%',scrub:.7}});
     gsap.fromTo('.workspace-orbit-label',{x:-25},{x:25,ease:'none',scrollTrigger:{trigger:'#workspace-preview',start:'top bottom',end:'bottom top',scrub:.8}});
     gsap.fromTo('.philosophy-word',{color:'#666173',y:12},{color:'#f2efff',y:0,stagger:.14,ease:'none',scrollTrigger:{trigger:'.philosophy-title',start:'top 85%',end:'top 25%',scrub:.5}});
     gsap.utils.toArray<HTMLElement>('.motion-pillar').forEach((el,i)=>{
      gsap.fromTo(el,{y:desktop?95+i*45:35,rotateZ:desktop?(i-1)*3:0},{y:0,rotateZ:0,ease:'none',scrollTrigger:{trigger:desktop?'.pillar-grid':el,start:'top 95%',end:'top 35%',scrub:.6}});
     });
     gsap.fromTo('.architecture-stage',{'--spread':.03},{'--spread':1,ease:'none',scrollTrigger:{trigger:'.architecture-experience',start:'top 95%',end:'top 10%',scrub:.8}});
     gsap.fromTo('.stack-perspective',{rotateY:-20,rotateZ:-8,scale:.86},{rotateY:16,rotateZ:5,scale:1,ease:'none',scrollTrigger:{trigger:'.architecture-experience',start:'top bottom',end:'bottom top',scrub:1}});
     gsap.fromTo('.developer-experience',{y:75,rotateY:desktop?-13:0},{y:0,rotateY:0,ease:'none',scrollTrigger:{trigger:'.developer-strip',start:'top 90%',end:'top 20%',scrub:.7}});
     gsap.fromTo('.closing-gate-left',{xPercent:5,rotateY:0},{xPercent:-85,rotateY:-35,ease:'none',scrollTrigger:{trigger:'.closing',start:'top 95%',end:'top 5%',scrub:.8}});
     gsap.fromTo('.closing-gate-right',{xPercent:-5,rotateY:0},{xPercent:85,rotateY:35,ease:'none',scrollTrigger:{trigger:'.closing',start:'top 95%',end:'top 5%',scrub:.8}});
     gsap.fromTo('.closing-title-line',{y:55,scale:.93},{y:0,scale:1,stagger:.14,ease:'none',scrollTrigger:{trigger:'.closing',start:'top 80%',end:'top 20%',scrub:.6}});
     gsap.fromTo('.landing-progress',{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:node,start:'top top',end:'bottom bottom',scrub:true}});
    },node);
    return()=>context.revert();
   });
   revert=()=>mm.revert();
  }).catch(()=>{/* Content stays readable if the motion module cannot load. */});
  return()=>{cancelled=true;observer.disconnect();revert()};
 },[root,paused]);
}
