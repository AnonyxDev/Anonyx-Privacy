import assert from 'node:assert/strict';
import {readFile,access,readdir} from 'node:fs/promises';
import {dirname,resolve} from 'node:path';
import {homeRequests} from '../lib/home-requests.ts';
import {guidedResults} from '../lib/guided-results.ts';
import {TOKEN_ADDRESS,X_URL} from '../lib/project-links.ts';
import {whitepaperChapters} from '../lib/whitepaper.ts';
const docs=['README.md','CONTRIBUTING.md','SECURITY.md','THIRD_PARTY_NOTICES.md','docs/GETTING_STARTED.md','docs/ARCHITECTURE.md','docs/PRIVACY.md','docs/VALIDATION.md','docs/Anonyx-Whitepaper-v2.md'];
let links=0;
for(const path of docs){
 const text=await readFile(path,'utf8');
 for(const match of text.matchAll(/\]\(([^)]+)\)/g)){
  const target=match[1].split('#')[0];
  if(!target||/^[a-z]+:/i.test(target))continue;
  await access(resolve(dirname(path),target));links++;
 }
}
const workflows=await readdir('.github/workflows');
assert.equal(workflows.filter(x=>x.endsWith('.yml')).length,8);
const pkg=JSON.parse(await readFile('package.json','utf8'));
for(const path of workflows){
 const text=await readFile(`.github/workflows/${path}`,'utf8');
 assert.match(text,/contents: read/);assert.match(text,/timeout-minutes:/);
 assert.match(text,/pull_request:/);assert.match(text,/workflow_dispatch:/);
 assert.match(text,/run: npm ci/);
 for(const match of text.matchAll(/run: npm run ([\w:-]+)/g))assert.ok(pkg.scripts[match[1]],`Missing script ${match[1]}`);
}
assert.equal(whitepaperChapters.length,16);
assert.equal(new Set(whitepaperChapters.map(c=>c.id)).size,16);
assert.ok(whitepaperChapters.every(c=>c.title&&c.blocks.length));
assert.equal(homeRequests.length,10);assert.deepEqual(Object.keys(guidedResults).sort(),homeRequests.map(request=>request.id).sort());
assert.equal(TOKEN_ADDRESS,'0x1eff1248358914ae08a94b159bed9d5bcc5d2ce7');assert.equal(X_URL,'https://x.com/Anonyx_AI');
for(const route of ['app/page.tsx','app/workspace/page.tsx','app/walkthrough/page.tsx','app/privacy/page.tsx','app/privacy-policy/page.tsx','app/developers/page.tsx','app/tokenomics/page.tsx','app/whitepaper/page.tsx'])await access(route);
for(const path of ['public/favicon.svg','docs/assets/anonyx-banner.svg','.env.example','package-lock.json'])await access(path);
console.log(`Repository integrity passed: ${docs.length} documents, ${links} local links, 8 workflows, 16 whitepaper entries.`);
