'use client';
import {Component,lazy,Suspense,useEffect,useState,useCallback,ReactNode} from 'react';
import {ChamberCanvas} from './chamber-canvas';
import type {ChamberProps} from './chamber-motion';
const Scene=lazy(()=>import('./scene'));
class SceneBoundary extends Component<{children:ReactNode;onError:()=>void},{error:boolean}>{state={error:false};static getDerivedStateFromError(){return{error:true}}componentDidCatch(){this.props.onError()}render(){return this.state.error?null:this.props.children}}
export function HeroScene(props:ChamberProps){
 const[enabled,setEnabled]=useState(false);const[ready,setReady]=useState(false);const[failed,setFailed]=useState(false);const[slow,setSlow]=useState(false);const[attempt,setAttempt]=useState(0);
 useEffect(()=>{try{const canvas=document.createElement('canvas');const gl=canvas.getContext('webgl2');if(gl){gl.getExtension('WEBGL_lose_context')?.loseContext();setEnabled(true)}else setFailed(true)}catch{setFailed(true)}},[attempt]);
 // Slow connections can finish loading; a timer never replaces the real scene.
 useEffect(()=>{if(ready||failed)return;const t=setTimeout(()=>setSlow(true),10000);return()=>clearTimeout(t)},[ready,failed,attempt]);
 const fail=useCallback(()=>{setFailed(true);setEnabled(false)},[]);const markReady=useCallback(()=>setReady(true),[]);
 const retry=()=>{setReady(false);setFailed(false);setSlow(false);setEnabled(false);setAttempt(n=>n+1)};
 return <div className="disclosure-scene" aria-busy={!ready&&!failed}>
 {!ready&&!failed&&<div className="scene-load-status" role="status">{slow?'Still loading the 3D scene…':'Loading 3D scene…'}</div>}
 {failed&&<div className="chamber-flat-scene" role="img" aria-label="Disclosure chamber showing selected context crossing the boundary"><ChamberCanvas {...props}/></div>}
 {enabled&&!failed&&<div className="chamber-webgl" style={{opacity:ready?1:0}} role="img" aria-label="3D disclosure chamber: approved context passes through the gate; personal identity stays on your side."><SceneBoundary key={attempt} onError={fail}><Suspense fallback={null}><Scene {...props} onReady={markReady} onError={fail}/></Suspense></SceneBoundary></div>}
 </div>;
}
