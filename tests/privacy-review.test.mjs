import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPayload} from '../lib/workspace.ts';
import {createRequestReview,hasReviewApproval} from '../lib/request-review.ts';

test('requests need explicit approval of the current review',()=>{
  const payload=buildPayload('model','Question',[],[],[],[],'provider');
  const review=createRequestReview('current',payload);
  assert.equal(hasReviewApproval(null,'current'),false);
  assert.equal(hasReviewApproval(review,'current'),false);
  assert.equal(hasReviewApproval({...review,approved:true},'current'),true);
  assert.equal(hasReviewApproval({...review,approved:true},'changed'),false);
});

test('approved review snapshot cannot change with the live draft',()=>{
  const payload=buildPayload('model','Original',[],[],[],[]);
  const review=createRequestReview('original',payload);
  payload.messages[0].content='Edited';
  assert.equal(review.payload.messages[0].content,'Original');
  const next=createRequestReview('edited',payload);
  assert.equal(next.approved,false);
});

test('review snapshot contains only selected content, and no context inventory metadata',()=>{
  const selected={id:'a',title:'Useful detail',body:'Selected information',type:'Project',tags:['private-tag']};
  const hidden={...selected,id:'b',title:'Hidden item',body:'SECRET_DO_NOT_SEND'};
  const turns=[{id:'past',role:'user',content:'OLD_SECRET_DO_NOT_SEND',model:'model',mode:'demo'}];
  const review=createRequestReview('selection',buildPayload('model','Current question',[selected,hidden],['a'],turns,[]));
  const text=JSON.stringify(review.payload);
  assert.match(text,/Selected information/);
  assert.doesNotMatch(text,/SECRET_DO_NOT_SEND|OLD_SECRET_DO_NOT_SEND|private-tag|Hidden item/);
});


test('changing an agent invalidates approval and preserves context exclusion',async()=>{
  const {withAgent}=await import('../lib/agents.ts');
  const items=[{id:'hidden',title:'Private account',body:'NEVER_INCLUDE_THIS',type:'Personal',tags:[]}];
  const base=buildPayload('anonyx-balanced','Compare my options',items,[],[],[]);
  const first=withAgent(base,'analysis');
  const second=withAgent(base,'research');
  const review={...createRequestReview(JSON.stringify(first),first),approved:true};
  assert.equal(hasReviewApproval(review,JSON.stringify(second)),false);
  assert.equal(first.messages[0].role,'system');
  assert.match(first.messages[0].content,/Analysis Agent/);
  assert.match(second.messages[0].content,/Research Agent/);
  assert.doesNotMatch(JSON.stringify(first),/NEVER_INCLUDE_THIS|Private account/);
  assert.equal(base.messages.length,1);
});
