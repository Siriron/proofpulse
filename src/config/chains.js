export const CONTRACT_ADDRESS='0x82E952a1a3F126b30de8E0C0beFeCc3012438360'
export const EXPLORER_URL='https://explorer-studio.genlayer.com'
export const RPC_URL='https://studio.genlayer.com/api'
export const STUDIONET_CONFIG={chainId:'0xF22F',chainName:'GenLayer StudioNet',rpcUrls:[RPC_URL],nativeCurrency:{name:'GEN',symbol:'GEN',decimals:18},blockExplorerUrls:[EXPLORER_URL]}
export const explorerAddress=()=>`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}`
export const explorerTx=h=>`${EXPLORER_URL}/tx/${h}`