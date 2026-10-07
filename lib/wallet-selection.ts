import type {Connector} from 'wagmi';

type BrowserBrand={id:string;flag:string};
export function detectLegacyWallet(win:any,brand:BrowserBrand,brands:readonly BrowserBrand[]){
  const explicit=brand.id==='phantomWallet'?win.phantom?.ethereum:brand.id==='okxWallet'?win.okxwallet:brand.id==='trustWallet'?win.trustwallet:brand.id==='coinbaseWallet'?win.coinbaseWalletExtension:undefined;
  const hasFlag=(provider:any,item:BrowserBrand)=>provider[item.flag]||(item.id==='okxWallet'&&provider.isOKExWallet)||(item.id==='trustWallet'&&provider.isTrustWallet);
  const providers=[explicit,...(win.ethereum?.providers??[]),win.ethereum].filter(Boolean);
  return providers.find(p=>hasFlag(p,brand)&&(brand.id!=='metaMaskWallet'||!brands.filter(b=>b.id!=='metaMaskWallet').some(b=>hasFlag(p,b))));
}

export async function selectWalletConnection({connector,current,connections,connect,switchAccount}:{
  connector:Connector;
  current?:Connector;
  connections:readonly {connector:Connector}[];
  connect:(connector:Connector)=>Promise<unknown>;
  switchAccount:(connector:Connector)=>Promise<unknown>;
}){
  if(current?.uid===connector.uid)return;
  if(connections.some(c=>c.connector.uid===connector.uid))await switchAccount(connector);
  else await connect(connector);
}
