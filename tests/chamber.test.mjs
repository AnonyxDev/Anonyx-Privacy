import test from 'node:test';
import assert from 'node:assert/strict';
import {particleAt,sequence,CHAMBER_DURATION} from '../components/anonyx/chamber-motion.ts';

test('Animation never sends excluded context or identity through the disclosure boundary',()=>{
 for(const selected of [[false,false],[true,false],[false,true],[true,true]]){
  for(let step=0;step<=100;step++)for(let i=0;i<360;i++){
   const point=particleAt(i,3,step/100,'scanning',selected);
   assert.ok([point.x,point.y,point.z,point.alpha].every(Number.isFinite));
   if(i%3===2||!selected[i%3])assert.ok(point.x<0);
   if(point.teal)assert.ok(i%3<2&&selected[i%3]&&point.x>0);
  }
  const result=Array.from({length:360},(_,i)=>particleAt(i,3,1,'ready',selected));
  assert.equal(result.filter(p=>p.x>0).length,selected.filter(Boolean).length*120);
  assert.ok(result.filter(p=>p.lane===2).every(p=>p.alpha===0));
 }
});
test('Animation idles entirely on the private side and completes at the receipt deadline',()=>{
 for(let i=0;i<360;i++)assert.ok(particleAt(i,10,0,'idle',[true,true]).x<0);
 const input={stage:'scanning',startedAt:100,selected:[true,false],paused:false,rotation:0};
 assert.equal(sequence(input,100).p,0);
 assert.equal(sequence(input,100+CHAMBER_DURATION).p,1);
 assert.equal(sequence({...input,stage:'idle'},50000).p,0);
});
