import {GITHUB_URL,X_URL} from '@/lib/project-links';

export function SocialLinks(){
 return <div className="navbar-social-links">
  <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="Anonyx on X (opens in a new tab)" title="Anonyx on X"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.835L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg></a>
  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" aria-label="Anonyx on GitHub (opens in a new tab)" title="Anonyx on GitHub"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297C5.37.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.61-4.043-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.838 1.237 1.838 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.323 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.042.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.769.84 1.235 1.911 1.235 3.221 0 4.611-2.805 5.628-5.479 5.925.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .319.216.694.825.576C20.565 22.092 24 17.597 24 12.297c0-6.627-5.373-12-12-12"/></svg></a>
 </div>;
}
