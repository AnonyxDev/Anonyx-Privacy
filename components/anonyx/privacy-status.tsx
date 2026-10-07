'use client';
import {Monitor,Eye,Wallet} from 'lucide-react';
import {useWorkspace} from './store';

export function PrivacyStatus(){
  const s=useWorkspace();
  return <section className="privacy-status" aria-label="Your privacy controls">
    <div><Monitor size={19}/><span><strong>Prepared on your device</strong><small>Your draft is not sent while you type.</small></span></div>
    <div><Eye size={19}/><span><strong>You approve each request</strong><small>Only selected context and history are included.</small></span></div>
    <div><Wallet size={19}/><span><strong>Wallet connection is optional</strong><small>Your connected address is not appended to prompts.</small></span></div>
    <p>{!s.ready?'Checking context storage…':s.persist?'Device memory is on. Context is saved unencrypted in this browser until you delete it.':'Device memory is off. Your context library is kept in memory for this visit.'} <a href="/privacy">Understand your controls</a></p>
  </section>;
}
