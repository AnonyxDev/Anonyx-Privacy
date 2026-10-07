import test from 'node:test';
import assert from 'node:assert/strict';
import {createConfig,createConnector,connect,switchAccount,disconnect,http} from '@wagmi/core';
import {detectLegacyWallet,selectWalletConnection} from '../lib/wallet-selection.ts';

const chain={id:4663,name:'Robinhood Chain',nativeCurrency:{name:'Ether',symbol:'ETH',decimals:18},rpcUrls:{default:{http:['http://127.0.0.1:1']}}};
test('wallet detection keeps MetaMask and other branded providers distinct',()=>{
  const brands=[{id:'metaMaskWallet',flag:'isMetaMask'},{id:'rabbyWallet',flag:'isRabby'},{id:'trustWallet',flag:'isTrust'},{id:'okxWallet',flag:'isOkxWallet'}];
  const meta={isMetaMask:true},rabby={isMetaMask:true,isRabby:true},trust={isMetaMask:true,isTrustWallet:true},okx={isMetaMask:true,isOKExWallet:true};
  const win={ethereum:{providers:[rabby,trust,okx,meta]}};
  assert.equal(detectLegacyWallet(win,brands[0],brands),meta);
  assert.equal(detectLegacyWallet(win,brands[1],brands),rabby);
  assert.equal(detectLegacyWallet(win,brands[2],brands),trust);
  assert.equal(detectLegacyWallet(win,brands[3],brands),okx);
  assert.equal(detectLegacyWallet({ethereum:rabby},brands[0],brands),undefined);
});
function setup(){
  const counts={a:0,b:0,rejected:0};
  const factory=(id,address,reject=false)=>createConnector(()=>({id,name:id,type:'injected',async connect(){counts[id]++;if(reject)throw new Error('User declined');return {accounts:[address],chainId:4663}},async disconnect(){},async getAccounts(){return [address]},async getChainId(){return 4663},async getProvider(){return {}},async isAuthorized(){return false},onAccountsChanged(){},onChainChanged(){},onDisconnect(){}}));
  const config=createConfig({chains:[chain],connectors:[factory('a','0x0000000000000000000000000000000000000001'),factory('b','0x0000000000000000000000000000000000000002'),factory('rejected','0x0000000000000000000000000000000000000003',true)],transports:{4663:http()},storage:null});
  const select=connector=>selectWalletConnection({connector,current:config.state.connections.get(config.state.current)?.connector,connections:[...config.state.connections.values()],connect:c=>connect(config,{connector:c}),switchAccount:c=>switchAccount(config,{connector:c})});
  return {config,counts,select};
}

test('choosing another wallet while connected changes the active account',async()=>{
  const {config,counts,select}=setup();const [a,b]=config.connectors;
  await select(a);await select(b);
  assert.equal(config.state.current,b.uid);
  assert.deepEqual(config.state.connections.get(b.uid).accounts,['0x0000000000000000000000000000000000000002']);
  assert.equal(counts.a,1);assert.equal(counts.b,1);
  await select(a);
  assert.equal(config.state.current,a.uid);
  assert.equal(counts.a,1,'switching back reuses the approved connection');
});
test('clicking the active wallet succeeds without requesting a second connection',async()=>{
  const {config,counts,select}=setup();const [a]=config.connectors;
  await select(a);await select(a);
  assert.equal(config.state.current,a.uid);assert.equal(counts.a,1);
});
test('declining a replacement wallet keeps the current account connected',async()=>{
  const {config,select}=setup();const [a,,rejected]=config.connectors;
  await select(a);await assert.rejects(select(rejected),/User declined/);
  assert.equal(config.state.current,a.uid);assert.equal(config.state.status,'connected');
  assert.equal(config.state.connections.size,1);
});
test('disconnecting all wallet connections returns the chooser to disconnected state',async()=>{
  const {config,select}=setup();const [a,b]=config.connectors;
  await select(a);await select(b);
  for(const {connector} of [...config.state.connections.values()])await disconnect(config,{connector});
  assert.equal(config.state.current,null);assert.equal(config.state.status,'disconnected');assert.equal(config.state.connections.size,0);
});
