import {useState,useCallback,useEffect} from 'react'
import {STUDIONET_CONFIG} from '../config/chains'
export function useWallet(){
 const [account,setAccount]=useState('')
 const connect=useCallback(async()=>{if(!window.ethereum) throw new Error('Install a GenLayer-compatible wallet');const a=await window.ethereum.request({method:'eth_requestAccounts'});setAccount(a?.[0]||'');return a?.[0]},[])
 const ensureChain=useCallback(async()=>{if(!window.ethereum)throw new Error('Wallet unavailable');try{await window.ethereum.request({method:'wallet_switchEthereumChain',params:[{chainId:STUDIONET_CONFIG.chainId}]})}catch(e){if(e.code===4902)await window.ethereum.request({method:'wallet_addEthereumChain',params:[STUDIONET_CONFIG]});else throw e}},[])
 useEffect(()=>{if(!window.ethereum)return;window.ethereum.request({method:'eth_accounts'}).then(a=>setAccount(a?.[0]||''));const h=a=>setAccount(a?.[0]||'');window.ethereum.on?.('accountsChanged',h);return()=>window.ethereum.removeListener?.('accountsChanged',h)},[])
 return {account,connect,ensureChain}
}