'use client';
import '@rainbow-me/rainbowkit/styles.css';
import {useEffect,useRef,useState} from 'react';
import {WagmiProvider,createConfig,createConnector,http,useAccount,useBalance,useConnect,useConnections,useDisconnect,useSwitchAccount,useSwitchChain,type Connector} from 'wagmi';
import {injected} from 'wagmi/connectors';
import {defineChain,formatEther} from 'viem';
import {RainbowKitProvider,connectorsForWallets,darkTheme,type Wallet} from '@rainbow-me/rainbowkit';
import {injectedWallet,walletConnectWallet} from '@rainbow-me/rainbowkit/wallets';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {Check,LoaderCircle,ShieldCheck,Wallet as WalletIcon} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {detectLegacyWallet,selectWalletConnection} from '@/lib/wallet-selection';
import {Mark,Picker} from './shared';

const testnet=defineChain({id:46630,name:'Robinhood Chain Testnet',nativeCurrency:{name:'Ether',symbol:'ETH',decimals:18},rpcUrls:{default:{http:['https://rpc.testnet.chain.robinhood.com']}},blockExplorers:{default:{name:'Blockscout',url:'https://explorer.testnet.chain.robinhood.com'}},testnet:true});
const mainnet=defineChain({id:4663,name:'Robinhood Chain',nativeCurrency:{name:'Ether',symbol:'ETH',decimals:18},rpcUrls:{default:{http:['https://rpc.mainnet.chain.robinhood.com']}},blockExplorers:{default:{name:'Blockscout',url:'https://robinhoodchain.blockscout.com'}}});
const brands=[
  {id:'metaMaskWallet',name:'MetaMask',rdns:'io.metamask',flag:'isMetaMask',icon:'/metaMaskWallet.svg',download:'https://metamask.io/download/'},
  {id:'rabbyWallet',name:'Rabby',rdns:'io.rabby',flag:'isRabby',icon:'/wallets/rabbyWallet.svg',download:'https://rabby.io/'},
  {id:'coinbaseWallet',name:'Coinbase Wallet',rdns:'com.coinbase.wallet',flag:'isCoinbaseWallet',icon:'/coinbaseWallet.svg',download:'https://www.coinbase.com/wallet/downloads'},
  {id:'trustWallet',name:'Trust Wallet',rdns:'com.trustwallet.app',flag:'isTrust',icon:'/wallets/trustWallet.svg',download:'https://trustwallet.com/download'},
  {id:'okxWallet',name:'OKX Wallet',rdns:'com.okex.wallet',flag:'isOkxWallet',icon:'/wallets/okxWallet.svg',download:'https://www.okx.com/web3'},
  {id:'phantomWallet',name:'Phantom',rdns:'app.phantom',flag:'isPhantom',icon:'/wallets/phantomWallet.svg',download:'https://phantom.com/download'},
  {id:'braveWallet',name:'Brave Wallet',rdns:'com.brave.wallet',flag:'isBraveWallet',icon:'/wallets/braveWallet.svg',download:'https://brave.com/wallet/'},
];
// Keep each legacy-injected provider distinct, including wallets that also set isMetaMask.
function legacyProvider(win:any,brand:typeof brands[number]){
  return detectLegacyWallet(win,brand,brands);
}
function browserWallet(brand:typeof brands[number]){return ()=>({id:brand.id,name:brand.name,rdns:brand.rdns,iconUrl:brand.icon,iconBackground:'#ffffff',downloadUrls:{browserExtension:brand.download},createConnector:(details:any)=>createConnector(options=>({...injected({target:()=>({id:brand.id,name:brand.name,provider:(win:any)=>legacyProvider(win,brand)})})(options),...details}))})}
const wc=process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID||'';
const config=createConfig({chains:[testnet,mainnet],connectors:connectorsForWallets([{groupName:'Wallets',wallets:[...brands.map(browserWallet),injectedWallet,...(wc?[walletConnectWallet]:[])]}],{appName:'Anonyx',projectId:wc}),transports:{[testnet.id]:http(undefined,{retryCount:0}),[mainnet.id]:http(undefined,{retryCount:0})},ssr:false,storage:null});
type KitConnector=Connector&{rkDetails?:Partial<Wallet>&{isWalletConnectModalConnector?:boolean}};
type Choice={id:string;name:string;icon?:string;connector:Connector;available:boolean;download?:string};

function Control({open,onOpenChange}:{open:boolean;onOpenChange:(x:boolean)=>void}){
  const account=useAccount();
  const {connectAsync,connectors}=useConnect();
  const connections=useConnections();
  const {switchAccountAsync}=useSwitchAccount();
  const {disconnectAsync}=useDisconnect();
  const {switchChain,error:chainError,isPending:networkPending}=useSwitchChain();
  const balance=useBalance({address:account.address,chainId:account.chain?.id,query:{enabled:open&&account.isConnected&&!!account.chain,retry:false}});
  const [choices,setChoices]=useState<Choice[]>([]);
  const [detecting,setDetecting]=useState(true);
  const [pending,setPending]=useState<string|null>(null);
  const [error,setError]=useState('');
  const busy=useRef(false);
  const connectedCard=useRef<HTMLElement>(null);
  useEffect(()=>{
    if(!open)return;
    setDetecting(true);
    let cancelled=false;
    async function discover(){
      const detected=await Promise.all(connectors.map(async connector=>{
        const c=connector as KitConnector,details=c.rkDetails;
        const isWC=c.type==='walletConnect';
        const provider=isWC?null:await c.getProvider().catch(()=>undefined);
        const icon=typeof details?.iconUrl==='function'?await details.iconUrl().catch(()=>undefined):details?.iconUrl??c.icon;
        return {connector:c,provider,isWC,icon};
      }));
      const used=new Set<string>();
      const rows:Choice[]=[];
      for(const brand of brands){
        const announced=detected.find(d=>!d.connector.rkDetails&&(d.connector.id===brand.rdns||d.connector.name.toLowerCase()===brand.name.toLowerCase()));
        const legacy=detected.find(d=>d.connector.rkDetails?.id===brand.id);
        const d=announced?.provider?announced:legacy;
        if(!d)continue;
        used.add(d.connector.uid);
        // An EIP-6963 announcement and the legacy connector can point at the same wallet.
        for(const other of detected)if(other.connector.rkDetails?.id===brand.id||other.provider&&other.provider===d.provider)used.add(other.connector.uid);
        const registered=connections.find(c=>c.connector.id===d.connector.id||c.connector.uid===legacy?.connector.uid);
        rows.push({...brand,connector:registered?.connector??d.connector,available:!!d.provider||!!registered});
      }
      for(const d of detected){
        if(used.has(d.connector.uid))continue;
        if(d.isWC&&!d.connector.rkDetails?.isWalletConnectModalConnector)continue;
        if(!d.provider&&!d.isWC)continue;
        if(d.provider&&rows.some(row=>detected.find(x=>x.connector.uid===row.connector.uid)?.provider===d.provider))continue;
        used.add(d.connector.uid);
        rows.push({id:d.connector.uid,name:d.connector.rkDetails?.name??d.connector.name,icon:d.icon,connector:d.connector,available:true});
      }
      if(!cancelled){setChoices(rows);setDetecting(false);}
    }
    void discover().catch(()=>{if(!cancelled){setDetecting(false);setError('Wallet discovery could not finish. Close and reopen this dialog to retry.')}});
    return ()=>{cancelled=true};
  },[open,connectors,connections]);
  async function choose(choice:Choice){
    if(busy.current)return;
    busy.current=true;setPending(choice.id);setError('');
    const isWC=choice.connector.type==='walletConnect';
    // The WalletConnect connector's own QR dialog needs the focus trap released.
    if(isWC)onOpenChange(false);
    try{
      await selectWalletConnection({connector:choice.connector,current:account.connector,connections,connect:c=>connectAsync({connector:c}),switchAccount:c=>switchAccountAsync({connector:c})});
      if(isWC)onOpenChange(true);
      else connectedCard.current?.focus();
    }catch{
      setError(account.isConnected?'Connection was not completed. Your current wallet remains connected.':'Connection was not completed. You can try again or choose another wallet.');
      if(isWC)onOpenChange(true);
    }finally{busy.current=false;setPending(null)}
  }
  async function disconnect(){
    if(busy.current)return;
    busy.current=true;setPending('disconnect');setError('');
    try{for(const connection of connections)await disconnectAsync({connector:connection.connector});}
    catch{setError('The wallet could not be disconnected. Please try again.')}
    finally{busy.current=false;setPending(null)}
  }
  const active=choices.find(c=>c.connector.uid===account.connector?.uid);
  return <Dialog open={open} onOpenChange={value=>{if(!value&&!busy.current)setError('');onOpenChange(value)}}><DialogContent className="anonyx-wallet-dialog">
    <div className="anonyx-wallet-heading"><Mark/><div><span>ANONYX</span><DialogTitle>Connect your wallet</DialogTitle></div></div>
    <DialogDescription className="anonyx-wallet-description">{account.isConnected?'Choose another wallet or manage your connection.':'Choose a wallet to connect to Anonyx.'}</DialogDescription>
    {account.isConnected&&<section className="anonyx-wallet-account" ref={connectedCard} tabIndex={-1} aria-label="Connected wallet">
      <div className="anonyx-wallet-account-heading"><span><Check size={15}/>{active?.name??account.connector?.name??'Wallet'} connected</span><button disabled={!!pending} onClick={disconnect}>{pending==='disconnect'?'Disconnecting…':'Disconnect'}</button></div>
      <code>{account.address}</code>
      <Picker label="Network" value={String(account.chain?.id??account.chainId??'unknown')} onChange={v=>{if(!pending)switchChain({chainId:Number(v) as 4663|46630})}} options={[{value:'46630',label:'Robinhood Chain Testnet'},{value:'4663',label:'Robinhood Chain'},...(!account.chain?[{value:String(account.chainId??'unknown'),label:'Unsupported network'}]:[])]}/>
      <div className="anonyx-wallet-balance"><span>{balance.isLoading?'Reading balance…':balance.isError?'Balance unavailable. Try refreshing.':balance.data?`${Number(formatEther(balance.data.value)).toFixed(5)} ETH${account.chain?.testnet?' · Testnet':''}`:'Choose a supported network to read your balance.'}</span><button disabled={balance.isFetching||!account.chain||!!pending} onClick={()=>balance.refetch()}>Refresh</button></div>
      {chainError&&<p className="error-text">Network change was not completed. Try again in your wallet.</p>}{networkPending&&<p role="status">Confirm the network in your wallet.</p>}
    </section>}
    <div className="anonyx-wallet-list" aria-label="Wallet options" aria-busy={!!pending}>
      {choices.map(choice=>{
        const selected=choice.connector.uid===account.connector?.uid;
        const contents=<>{choice.icon?<img src={choice.icon} alt="" width={34} height={34}/>:<WalletIcon size={34}/>}<span className="anonyx-wallet-name">{choice.name}</span><span className="anonyx-wallet-row-status">{pending===choice.id?<><LoaderCircle size={15}/>Connecting…</>:selected?<><Check size={14}/>Connected</>:choice.available?account.isConnected?'Switch wallet':'Connect':'Get wallet'}</span></>;
        return choice.available?<button className="anonyx-wallet-option" key={choice.id} disabled={!!pending||networkPending} aria-pressed={selected} onClick={()=>choose(choice)}>{contents}</button>:<a className="anonyx-wallet-option" key={choice.id} href={choice.download} target="_blank" rel="noopener noreferrer" aria-label={'Get '+choice.name}>{contents}</a>;
      })}
      {detecting&&choices.length===0&&<p className="anonyx-wallet-discovery" role="status">Checking available wallets…</p>}
    </div>
    {pending&&pending!=='disconnect'&&<p className="anonyx-wallet-pending" role="status">Confirm the connection in your wallet.</p>}
    {error&&<p className="error-text" role="alert">{error}</p>}
    <div className="anonyx-wallet-boundary"><ShieldCheck size={17}/><p>Connecting does not request a signature or move funds. Wallet details are not automatically included in AI requests.</p></div>
  </DialogContent></Dialog>;
}
export default function WalletModal(props:{open:boolean;onOpenChange:(x:boolean)=>void}){const[client]=useState(()=>new QueryClient());return <WagmiProvider config={config} reconnectOnMount={false}><QueryClientProvider client={client}><RainbowKitProvider theme={darkTheme({accentColor:'#9b8cff',accentColorForeground:'#0b0d12',borderRadius:'medium',fontStack:'system'})} modalSize="compact" appInfo={{appName:'Anonyx'}}><Control {...props}/></RainbowKitProvider></QueryClientProvider></WagmiProvider>}
