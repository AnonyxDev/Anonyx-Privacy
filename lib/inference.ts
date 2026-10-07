import type {RequestPayload} from './workspace';
export type LiveModel = {id:string; name:string; provider:string};
export class InferenceError extends Error {
  code?: string;
  constructor(message:string, code?:string) {super(message); this.code=code;}
}
// Same-origin requests; provider credentials exist only on the server.
export class InferenceBridge {
  private pending = new Set<AbortController>();
  open() {return this;}
  async request<T>(kind:'catalog'|'chat', payload?:RequestPayload):Promise<T> {
    const controller=new AbortController(); this.pending.add(controller);
    const timer=setTimeout(()=>controller.abort(),40000);
    try {
      const response=await fetch('/api/ai', {
        method:kind==='catalog'?'GET':'POST', credentials:'same-origin', cache:'no-store', signal:controller.signal,
        ...(kind==='chat'?{headers:{'Content-Type':'application/json'},body:JSON.stringify({payload,approved:true})}:{}),
      });
      const result=await response.json() as {error?:string;code?:string;models?:LiveModel[];text?:string};
      if(!response.ok) throw new InferenceError(result.error||'The AI request could not be completed.',result.code);
      return (kind==='catalog'?result.models:result.text) as T;
    } catch(error) {
      if(error instanceof Error && error.name==='AbortError') throw new InferenceError('The request was stopped or timed out. Your draft is preserved.','aborted');
      throw error;
    } finally {clearTimeout(timer);this.pending.delete(controller);}
  }
  close() {for(const controller of this.pending)controller.abort();this.pending.clear();}
}
