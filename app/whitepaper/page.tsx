import {Mark,whitepaper} from '@/components/anonyx/shared';
import {WhitepaperContents} from '@/components/anonyx/whitepaper-contents';
import {whitepaperChapters,whitepaperRevision} from '@/lib/whitepaper';

export const metadata={title:'Whitepaper',description:'Read Anonyx’s revised whitepaper: request privacy, implementation status, architecture, threat model, and infrastructure requirements.'};

export default function Whitepaper(){
  return <div className="page-wrap whitepaper-page" id="whitepaper-top">
    <header className="page-intro whitepaper-intro">
      <div className="eyebrow"><Mark className="whitepaper-mark"/>ANONYX WHITEPAPER</div>
      <h1>Private Access to<br/>Artificial Intelligence</h1>
      <p>Identity. Context. Inference. Payment.<br/>A framework for keeping them separate.</p>
    </header>
    <div className="whitepaper-layout">
      <WhitepaperContents chapters={whitepaperChapters.map(({id,number,title})=>({id,number,title}))}/>
      <article className="whitepaper-document" aria-label="Anonyx whitepaper">
        <aside className="whitepaper-reading-note"><strong>Version {whitepaperRevision.version} · {whitepaperRevision.date}</strong><p>This edition distinguishes the workspace’s current controls from proposed infrastructure, with a request walkthrough and explicit privacy assumptions. For day-to-day data handling, read <a href="/privacy">Privacy &amp; data boundaries</a>.</p></aside>
        {whitepaperChapters.map(chapter=><section className="whitepaper-chapter" key={chapter.id} id={chapter.id} aria-labelledby={chapter.id+'-title'}>
          <div className="whitepaper-chapter-label">{chapter.number?'CHAPTER '+chapter.number.padStart(2,'0'):'OVERVIEW'}</div>
          <h2 id={chapter.id+'-title'}>{chapter.title}</h2>
          <div className="whitepaper-prose">{chapter.blocks.map((block,i)=>block.type==='list'
            ?<ul key={i}>{block.items.map((text,j)=><li key={j}>{text}</li>)}</ul>
            :block.type==='table'?<div className="whitepaper-table-wrap" key={i} role="region" aria-label={block.caption} tabIndex={0}><table className="whitepaper-table"><caption>{block.caption}</caption><thead><tr>{block.columns.map((column,j)=><th scope="col" key={j}>{column}</th>)}</tr></thead><tbody>{block.rows.map((row,j)=><tr key={j}>{row.map((cell,k)=>k===0?<th scope="row" key={k}>{cell}</th>:<td key={k}>{cell}</td>)}</tr>)}</tbody></table></div>
            :block.type==='heading'?<h3 key={i}>{block.text}</h3>
            :<p key={i} className={block.text.includes(' → ')?'whitepaper-flow':undefined}>{block.text}</p>)}</div>
        </section>)}
        <footer className="whitepaper-document-footer"><p>Anonyx · Private Access to Artificial Intelligence</p><div><a href="#whitepaper-top">Back to top</a><a href={whitepaper} target="_blank" rel="noreferrer">Earlier edition</a></div></footer>
      </article>
    </div>
  </div>;
}
