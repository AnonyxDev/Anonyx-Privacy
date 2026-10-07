'use client';
import {useEffect,useRef,useState} from 'react';
import {ChevronDown} from 'lucide-react';

type ChapterLink={id:string;number:string;title:string};

export function WhitepaperContents({chapters}:{chapters:ChapterLink[]}){
  const [active,setActive]=useState('abstract');
  const mobile=useRef<HTMLDetailsElement>(null);
  const desktop=useRef<HTMLElement>(null);
  useEffect(()=>{
    const sections=chapters.map(c=>document.getElementById(c.id)).filter((el):el is HTMLElement=>!!el);
    let frame=0;
    const update=()=>{
      frame=0;
      let current=sections[0]?.id??'abstract';
      for(const section of sections){if(section.getBoundingClientRect().top<=140)current=section.id;else break;}
      if(window.scrollY+window.innerHeight>=document.documentElement.scrollHeight-8)current=sections.at(-1)?.id??current;
      setActive(current);
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update)};
    update();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);
    return ()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll)};
  },[chapters]);
  useEffect(()=>{
    const nav=desktop.current;
    const link=nav?.querySelector<HTMLAnchorElement>('a[aria-current="location"]');
    if(!nav||!link)return;
    const parent=nav.getBoundingClientRect(),child=link.getBoundingClientRect();
    if(child.top<parent.top)nav.scrollTop-=parent.top-child.top+10;
    else if(child.bottom>parent.bottom)nav.scrollTop+=child.bottom-parent.bottom+10;
  },[active]);
  const links=chapters.map(c=><a href={'#'+c.id} key={c.id} aria-current={active===c.id?'location':undefined} onClick={()=>{setActive(c.id);if(mobile.current)mobile.current.open=false}}><span>{c.number?c.number.padStart(2,'0'):'00'}</span><span>{c.title}</span></a>);
  return <aside className="whitepaper-contents">
    <div className="whitepaper-desktop-contents"><h2>Contents</h2><nav aria-label="Whitepaper chapters" ref={desktop}>{links}</nav><a className="whitepaper-privacy-link" href="/privacy">Privacy &amp; data boundaries</a></div>
    <details className="whitepaper-mobile-contents" ref={mobile}><summary><span>Contents · {chapters.filter(chapter=>chapter.number).length} chapters</span><ChevronDown size={18}/></summary><nav aria-label="Whitepaper chapters on mobile">{links}</nav></details>
  </aside>;
}
