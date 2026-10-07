'use client';
import {useEffect,useRef} from 'react';
import {ChamberProps,particleAt,sequence} from './chamber-motion';

// Perspective canvas diagram: it preserves the disclosure story without WebGL.
export function ChamberCanvas(props:ChamberProps){
 const canvas=useRef<HTMLCanvasElement>(null);const latest=useRef(props);latest.current=props;
 useEffect(()=>{
  const el=canvas.current;if(!el)return;const context=el.getContext('2d');if(!context)return;const ctx:CanvasRenderingContext2D=context;
  let width=0,height=0,raf=0,time=0,last=performance.now(),visible=true;
  let pointerX=0,pointerY=0;let rendered:ChamberProps|undefined;let renderedWidth=0,renderedHeight=0;
  const resize=()=>{const rect=el.getBoundingClientRect();width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,1.5);el.width=Math.round(width*dpr);el.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};
  const ro=new ResizeObserver(resize);ro.observe(el);
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting},{rootMargin:'100px'});io.observe(el);
  const move=(e:PointerEvent)=>{const r=el.getBoundingClientRect();pointerX=(e.clientX-r.left)/r.width-.5;pointerY=(e.clientY-r.top)/r.height-.5};
  const leave=()=>{pointerX=0;pointerY=0};el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);
  type P=[number,number,number];
  function draw(now:number){
   raf=requestAnimationFrame(draw);const dt=Math.min((now-last)/1000,.05);last=now;
   if(!visible||document.hidden||!width||!height)return;
   const s=latest.current;if(s.paused&&s===rendered&&width===renderedWidth&&height===renderedHeight)return;rendered=s;renderedWidth=width;renderedHeight=height;if(!s.paused)time+=dt;
   const {p,open,push}=sequence(s,now);const scale=Math.min(width/10.6,height/5.5)*(1+push*.15);
   const tilt=Math.sin(s.rotation)*.22+(s.paused?0:pointerX*.08);
   const project=([x,y,z]:P):[number,number]=>[width*.51+(x*(.92-tilt)+z*(.60+tilt))*scale,height*.50+(-y+z*.24-x*.10+(s.paused?0:pointerY*.05))*scale];
   const path=(points:P[],color:string,line=1,fill?:string)=>{ctx.beginPath();points.forEach((v,i)=>{const q=project(v);if(i===0)ctx.moveTo(...q);else ctx.lineTo(...q)});if(fill){ctx.closePath();ctx.fillStyle=fill;ctx.fill()}ctx.strokeStyle=color;ctx.lineWidth=line;ctx.stroke()};
   ctx.clearRect(0,0,width,height);
   // A quiet pool of light grounds the chamber in depth.
   const glow=ctx.createRadialGradient(width*.51,height*.53,4,width*.51,height*.53,width*.38);glow.addColorStop(0,`rgba(127,94,219,${.13+open*.08})`);glow.addColorStop(1,'rgba(9,11,17,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
   for(let z=-2.4;z<=2.5;z+=.6)path([[-4.8,-1.7,z],[4.8,-1.7,z]],'rgba(166,145,221,.055)');
   for(let x=-4.8;x<=4.8;x+=.6)path([[x,-1.7,-2.4],[x,-1.7,2.4]],'rgba(166,145,221,.055)');
   // Three transparent depth planes establish the passage.
   for(const depth of [-.5,0,.5]){
    const rect:P[]=[[depth,-1.65,-1.12],[depth,1.65,-1.12],[depth,1.65,1.12],[depth,-1.65,1.12],[depth,-1.65,-1.12]];
    path(rect,depth===0?'rgba(194,170,255,.9)':'rgba(155,140,255,.19)',depth===0?1.7:.8,`rgba(134,104,209,${depth===0?.075:.023})`);
   }
   for(const y of [-1.65,1.65])for(const z of [-1.12,1.12])path([[-.5,y,z],[.5,y,z]],'rgba(183,156,255,.35)',1);
   // The two shutter leaves move apart as selected context approaches.
   for(const side of [-1,1]){
    const offset=side*open*.82;
    const leaf:P[]=[[.01,-1.50,offset],[.01,1.50,offset],[.01,1.50,side*1.02+offset],[.01,-1.50,side*1.02+offset]];
    path(leaf,'rgba(162,138,234,.45)',1,'rgba(110,82,174,.09)');
    for(let j=0;j<5;j++){const z=side*(.10+j*.19)+offset;path([[.02,-1.43,z],[.02,1.43,z]],`rgba(181,163,240,${.13+j*.025})`,1)}
   }
   // Scanner traverses the gate; pausing fixes its position.
   const scanY=Math.sin(time*.85)*1.4;
   path([[.07,scanY,-1.10],[.07,scanY,1.10]],`rgba(142,228,213,${.35+open*.5})`,1.8);
   if(open>.05){ctx.shadowColor='#74e8d0';ctx.shadowBlur=16;path([[.06,-1.52,-open*.72],[.06,1.52,-open*.72]],`rgba(123,241,213,${open})`,2);path([[.06,-1.52,open*.72],[.06,1.52,open*.72]],`rgba(123,241,213,${open})`,2);ctx.shadowBlur=0;}
   // Each lane is derived from its exact selection; identity never crosses.
   for(let i=0;i<270;i++){
    const a=particleAt(i,time,p,s.stage,s.selected);if(a.alpha<.015)continue;
    const [x,y]=project([a.x,a.y,a.z]);const radius=Math.max(.6,a.size*scale);
    ctx.fillStyle=a.teal?`rgba(108,239,213,${a.alpha})`:`rgba(179,153,247,${a.alpha})`;
    ctx.fillRect(x,y,radius*1.9,radius*.9);
    if(i%7===0){ctx.strokeStyle=a.teal?`rgba(100,226,206,${a.alpha*.26})`:`rgba(174,146,239,${a.alpha*.2})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x-radius*8,y+1);ctx.lineTo(x,y);ctx.stroke();}
   }
   // A wave on the private side shows that excluded fragments hit a boundary.
   if(s.stage==='scanning'&&p>.43&&p<.87){const r=(p-.43)/.44;ctx.globalAlpha=Math.sin(r*Math.PI)*.65;for(let i=0;i<3;i++){const spread=r*.8+i*.18;path([[-.62,-1.3,-spread],[-.62,1.3,-spread]],'#aa85de',.8)}ctx.globalAlpha=1;}
   const caption=(txt:string,pos:P,color:string)=>{const [x,y]=project(pos);ctx.fillStyle=color;ctx.font=`${Math.max(10,Math.min(12,width/48))}px monospace`;ctx.textAlign='center';ctx.fillText(txt,x,y)};
   caption('PRIVATE CONTEXT',[-3.1,1.35,0],'#a794d0');caption(s.stage==='ready'?'REQUEST ASSEMBLED':'SELECTED ONLY',[3.1,1.35,0],'#80c9b9');
  }
  resize();raf=requestAnimationFrame(draw);
  return()=>{cancelAnimationFrame(raf);ro.disconnect();io.disconnect();el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave)};
 },[]);
 return <canvas ref={canvas} className="chamber-canvas" aria-hidden="true"/>;
}
