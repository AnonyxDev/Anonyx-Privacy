'use client';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
export function ServiceNotice({action,onClose,continueLabel='Continue exploring',detail}:{action:string|null;onClose:()=>void;continueLabel?:string;detail?:string}){
 return <Dialog open={action!==null} onOpenChange={open=>{if(!open)onClose()}}><DialogContent><DialogTitle>{action} — under construction</DialogTitle><DialogDescription>This feature is still under construction. You’re exploring the Anonyx demo; live execution is coming soon.</DialogDescription><div className="notice">No AI request or transaction was submitted, no wallet signature was requested, and no funds or credits were deducted. Your draft and selections are preserved.</div>{detail&&<p className="workspace-dialog-intro">{detail}</p>}<button className="button primary" onClick={onClose}>{continueLabel}</button></DialogContent></Dialog>;
}
