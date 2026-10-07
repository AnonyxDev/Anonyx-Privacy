export const CHAMBER_DURATION = 4600;
export type ChamberProps = {
  stage: 'idle' | 'scanning' | 'ready';
  startedAt: number;
  selected: readonly boolean[];
  paused: boolean;
  rotation: number;
};
export const clamp = (n:number) => Math.max(0,Math.min(1,n));
export const smooth = (a:number,b:number,n:number) => {const t=clamp((n-a)/(b-a));return t*t*(3-2*t)};
export const seed = (n:number) => {const f=Math.sin(n*127.1+311.7)*43758.5453;return f-Math.floor(f)};
export function sequence(props:ChamberProps,now:number){
 const p=props.stage==='ready'?1:props.stage==='idle'?0:clamp((now-props.startedAt)/CHAMBER_DURATION);
 return {p,open:smooth(.13,.38,p)*(1-smooth(.84,1,p)),push:smooth(.36,.73,p)*(1-smooth(.83,1,p))};
}
export function particleAt(i:number,time:number,p:number,stage:ChamberProps['stage'],selected:readonly boolean[]){
 const lane=i%3,eligible=lane<2&&selected[lane]===true;
 const a=seed(i+1),b=seed(i+109),c=seed(i+409);
 const travel=smooth(.12+a*.15,.76+a*.15,p);
 const drift=(a+time*.095)%1;
 let x=stage==='idle'?-4.7+drift*3.55:-4.4+a*.6+travel*(eligible?8.2:3.82);
 let y=(lane-1)*.62+Math.sin(time*.65+a*15)*.17+(b-.5)*.42;
 let z=(c-.5)*1.75*(stage==='idle'?1:1-.25*Math.sin(travel*Math.PI));
 let alpha=.45+Math.sin(a*7+time)*.18;
 if(stage!=='idle'){
  if(eligible){const pack=smooth(.78,1,p);y=y*(1-pack)+((i%9)-4)*.075*pack;z=z*(1-pack)+((Math.floor(i/9)%7)-3)*.08*pack;alpha=.85;}
  else {const dissolve=smooth(.57,.9,p);x-=dissolve*a*.45;y+=(b-.5)*dissolve*2;z+=(c-.5)*dissolve*1.5;alpha=(1-dissolve)*.68;}
 }
 return {x,y,z,alpha,teal:eligible&&x>0,size:.018+a*.022,lane};
}
