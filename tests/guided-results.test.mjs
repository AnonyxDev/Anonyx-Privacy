import test from 'node:test';
import assert from 'node:assert/strict';
import {homeRequests,requestAgent} from '../lib/home-requests.ts';
import {buildPayload} from '../lib/workspace.ts';
import {withAgent} from '../lib/agents.ts';
import {matchesWorkedRequest,guidedResults} from '../lib/guided-results.ts';

test('worked results require their exact prompt and selected context',()=>{
 assert.equal(Object.keys(guidedResults).length,homeRequests.length);
 for(const example of homeRequests){
  const id=example.id;const agent=requestAgent(example);
  const selected=example.context.slice(0,2).map(x=>x.id);
  const make=(prompt,ids)=>withAgent(buildPayload(example.model,prompt,example.context,ids,[],[]),agent);
  const expected=make(example.prompt,selected);
  assert.equal(matchesWorkedRequest(make(example.prompt,selected),expected),true);
  assert.equal(matchesWorkedRequest(make('Changed task',selected),expected),false);
  assert.equal(matchesWorkedRequest(make(example.prompt,[]),expected),false);
  assert.equal(matchesWorkedRequest(make(example.prompt,[selected[0]]),expected),false);
  assert.equal(matchesWorkedRequest(make(example.prompt,example.context.map(x=>x.id)),expected),false);
  assert.equal(matchesWorkedRequest({...expected,provider:'new-provider'},expected),false);
  assert.equal(matchesWorkedRequest({...expected,messages:[...expected.messages,{role:'user',content:'Previous confidential message'}]},expected),false);
  const output=JSON.stringify(guidedResults[id]);
  assert.ok(guidedResults[id].title&&guidedResults[id].paragraphs.length);
  assert.doesNotMatch(output,/@example\.com|NS-2048|SR-1182|CP-482|PO-621|INT-007|AC-3891|CAL-129|DOC-319|555-0198|555-0144/);
  assert.equal(matchesWorkedRequest({...expected,messages:[{role:'system',content:'Different instructions'},...expected.messages.slice(1)]},expected),false);
 }
});
