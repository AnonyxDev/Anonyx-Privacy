import type {RequestPayload} from './workspace';
export function matchesWorkedRequest(request:RequestPayload,expected:RequestPayload){
 return request.model===expected.model&&request.provider===expected.provider&&request.messages.length===expected.messages.length&&request.messages.every((message,index)=>message.role===expected.messages[index].role&&message.content===expected.messages[index].content);
}
export const guidedResults:Record<string,{title:string;paragraphs:string[];code?:string;checks?:string[]}>={
 'project-update':{title:'Weekly delivery update',paragraphs:[
  'Completed\nAccount settings and context export are complete.',
  'Blockers\nFinal onboarding copy is still needed. Mobile navigation remains in progress.',
  'Next\nComplete mobile navigation, then carry out the accessibility review and browser checks. Please approve the onboarding copy by Friday.',
 ]},
 'meeting-notes':{title:'Planning meeting — decisions and actions',paragraphs:[
  'Decision: the team approved a smaller onboarding flow on 7 October.',
  'Product lead — deliver revised onboarding copy. Due: 9 October.\nEngineering lead — estimate implementation. Due: 12 October.\nQA — prepare regression cases. Due: unspecified.',
  'Open decision: agree a deadline for the QA regression cases. The notes do not specify named owners beyond these roles.',
 ]},
 'code-review':{title:'Pagination — input validation review',paragraphs:[
  'The function accepts zero, negative, fractional, and non-finite inputs. Negative slice offsets can return items from the end of the array, and fractional inputs are silently coerced. Validate page and size before slicing.',
  'This version preserves the generic signature and leaves items unchanged. A page beyond the array returns an empty array. The arithmetic guard rejects offsets that cannot be represented safely.',
 ],code:`export function paginate<T>(items: T[], page: number, size: number) {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new Error('Page must be a positive safe integer.');
  }
  if (!Number.isSafeInteger(size) || size < 1) {
    throw new Error('Size must be a positive safe integer.');
  }
  const start = (page - 1) * size;
  const end = start + size;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end)) {
    throw new Error('Pagination offsets exceed the safe integer range.');
  }
  return items.slice(start, end);
}`,checks:['Page 1, size 2 on [1, 2, 3] returns [1, 2]; page 2 returns [3].','Zero, negative, fractional, NaN, and infinite inputs throw descriptive errors.','An out-of-range page and an empty source array return [].','Confirm the input array is unchanged and unsafe offset arithmetic is rejected.']},
 'research-summary':{title:'Context control — research synthesis',paragraphs:[
  'Theme 1: visibility before submission. Four of five interviewees wanted to inspect outgoing context. Product implication: make request review easy to find. Follow-up: which details do participants need to see to approve confidently?',
  'Theme 2: history should be an explicit choice. Three interviewees found automatic history inclusion confusing. Product implication: keep history excluded until selected. Follow-up: would per-message selection or a conversation summary be easier to understand?',
  'Theme 3: persistence needs an explanation. Two interviewees preferred saving context after understanding storage. Product implication: explain storage before enabling it. Follow-up: what information helps participants choose between memory-only and saved context?',
  'These observations come from five experienced AI users in exploratory interviews. The product implications are hypotheses to investigate, not representative conclusions about all users.',
 ]},
 'product-comparison':{title:'Context storage — recommendation',paragraphs:[
  'Recommend Option A for the initial release. Browser-only context fits the team’s first priority of reducing infrastructure exposure, requires less server infrastructure, and supports the accepted manual export workflow. Shared context is not required yet.',
  'Option A sacrifices cross-device sync and places recovery responsibility on the team. Option B supports cloud sync and shared access controls, but adds key-management and recovery requirements. Encryption alone does not settle those operational questions.',
  'Before adoption, validate local storage behavior, export and recovery steps, device access risks, and a security review. Revisit Option B if cross-device access becomes essential; validate its key lifecycle and access controls before migrating. Neither proposal has completed a security review.',
 ]},
 'customer-reply':{title:'Support reply — finding a saved context library',paragraphs:[
  'Thanks for reaching out. I understand how frustrating it is to open a new browser profile and find your context library missing.',
  'Saved context belongs to the browser profile and device where it was created; it does not sync through the cloud. Please open the original browser profile on the original device and check the context library there. If you exported a JSON backup, you can also check that file and import it through the context library.',
  'The missing library in your new profile does not by itself tell us whether the original data was deleted. If it is absent from the original profile and you have no export, we cannot guarantee recovery.',
 ]},
 'study-plan':{title:'Two-week TypeScript study plan',paragraphs:[
  'Week 1 — weekdays, 45 minutes each: Monday, basic types and annotations; Tuesday, unions and narrowing; Wednesday, interfaces for context items; Thursday, unknown input and type guards; Friday, revise with short validation exercises. Split each session into 10 minutes of examples, 25 minutes of practice, and 10 minutes of revision.',
  'Saturday — 90 minutes: first checkpoint. Build a function that checks the basic shape of an unknown context item, explain how narrowing works, and identify checks still missing. Use 15 minutes for review, 60 minutes for implementation, and 15 minutes for the checkpoint. Sunday off.',
  'Week 2 — weekdays, 45 minutes each: Monday, generics through small array helpers; Tuesday, safe string and array checks; Wednesday, design the validator’s result type; Thursday, implement the typed context-item validator; Friday, add invalid-input cases and revise difficult concepts. Keep the same 10/25/10-minute rhythm.',
  'Saturday — 90 minutes: final project and second checkpoint. Finish the typed context-item validator, exercise valid and invalid inputs, and explain its remaining limits. Allocate 15 minutes to revision, 60 minutes to the project, and 15 minutes to the checkpoint. Sunday off.',
 ]},
 'rewrite-text':{title:'Selective context — plain English revision',paragraphs:[
  'You choose which details to include in each AI request. This helps you share less unnecessary information. The AI provider may still keep the text you send, depending on its policies.',
  'Wording changes: “You choose” makes the user’s control explicit. “AI request” replaces technical language about payload construction. The final sentence preserves the original limitation about provider retention.',
 ]},
 'client-brief':{
  title:'Northstar portal launch — client brief',
  paragraphs:[
   'Northstar’s first portal release will replace email-based client updates with a shared space for project status, document sharing, and milestone approvals. Billing remains outside this release.',
   'The prototype review is scheduled for 14 October. Client feedback closes on 21 October, with rollout targeted for 4 November.',
   'Please confirm the milestone approval workflow so the team can finalize how approvals will be handled. The rollout date remains a target, rather than a confirmed completion date.',
  ],
 },
 'bug-diagnosis':{
  title:'Search results race — diagnosis and suggested fix',
  paragraphs:[
   'The effect starts a new fetch whenever query changes, but older requests keep running. If “context” resolves after “privacy”, the older request calls setResults last and overwrites the newer results. A pending request can also finish after the component unmounts.',
   'Cancel the previous request during cleanup and guard every state update. The active flag covers work that has already progressed past fetch, while AbortController cancels a pending fetch or response-body read. Check the HTTP status and expose genuine failures instead of treating them as successful results.',
   'The replacement below assumes the component already imports useState and useEffect and defines setResults. Render searchError near the results so network failures are visible. Clearing the error at the start gives each query its own error state.',
  ],
  code:`const [searchError, setSearchError] = useState<string | null>(null);

useEffect(() => {
  const controller = new AbortController();
  let active = true;
  setSearchError(null);

  async function load() {
    try {
      const response = await fetch(
        \`/api/search?q=\${encodeURIComponent(query)}\`,
        { signal: controller.signal }
      );
      if (!response.ok) {
        throw new Error(\`Search failed (\${response.status})\`);
      }
      const results = await response.json();
      if (active) setResults(results);
    } catch (error) {
      if (!active || controller.signal.aborted) return;
      setSearchError(
        error instanceof Error ? error.message : 'Search failed'
      );
    }
  }

  void load();
  return () => {
    active = false;
    controller.abort();
  };
}, [query]);`,
  checks:[
   'Delay the “context” response, then search for “privacy”. The final results must belong to “privacy”, even if the earlier response finishes later.',
   'Unmount while a request is pending. Cleanup should abort it and prevent subsequent result or error updates.',
   'Return HTTP 500 or a network failure. Show the error for the current query; ignore failures from cancelled older queries.',
   'Exercise development Strict Mode’s setup–cleanup–setup cycle. Only the active request should update the results.',
  ],
 },
};
