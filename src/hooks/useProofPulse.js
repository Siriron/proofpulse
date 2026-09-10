import {useState,useEffect,useCallback,useMemo} from 'react'
import {createClient} from 'genlayer-js'
import {studionet} from 'genlayer-js/chains'
import {TransactionStatus} from 'genlayer-js/types'
import {CONTRACT_ADDRESS,explorerTx} from '../config/chains'
const client=createClient({chain:studionet})
const parse=v=>typeof v==='string'?JSON.parse(v):v
export function useProofPulse(account,ensureChain){
 const [services,setServices]=useState([]),[incidents,setIncidents]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[tx,setTx]=useState(null)
 const read=useCallback(async(fn,args=[])=>parse(await client.readContract({address:CONTRACT_ADDRESS,functionName:fn,args})),[])
 const refresh=useCallback(async()=>{setLoading(true);setError('');try{
   const ps=await Promise.all(Array.from({length:24},(_,i)=>read('get_service',[BigInt(i+1)]).catch(()=>null)))
   const pi=await Promise.all(Array.from({length:48},(_,i)=>read('get_incident',[BigInt(i+1)]).catch(()=>null)))
   setServices(ps.filter(x=>x&&x.endpoint));setIncidents(pi.filter(x=>x&&x.claim_text))
 }catch(e){setError(e?.message||'Unable to read ProofPulse')}finally{setLoading(false)}},[read])
 useEffect(()=>{refresh()},[refresh])
 const write=useCallback(async(functionName,args)=>{if(!account)throw new Error('Connect wallet first');await ensureChain();const c=createClient({chain:studionet,account,provider:window.ethereum});if(c.connect)await c.connect('studionet');const hash=await c.writeContract({address:CONTRACT_ADDRESS,functionName,args,value:BigInt(0)});setTx({hash,status:'PENDING',functionName});try{const receipt=await c.waitForTransactionReceipt({hash,status:TransactionStatus.ACCEPTED,retries:120,interval:4000});setTx({hash,status:'ACCEPTED',functionName});await refresh();return {hash,receipt}}catch(e){setTx({hash,status:'TIMEOUT',functionName});throw e}},[account,ensureChain,refresh])
 return useMemo(()=>({services,incidents,loading,error,tx,refresh,write,read,explorerTx}),[services,incidents,loading,error,tx,refresh,write,read])
}