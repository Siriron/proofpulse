export const CONTRACT_ADDRESS='0x431607C901544dd33631aA7aC2eA966b29326089'
export const EXPLORER_URL='https://explorer-studio.genlayer.com'
export const RPC_URL='https://studio.genlayer.com/api'
export const STUDIONET_CONFIG={chainId:'0xF22F',chainName:'GenLayer StudioNet',rpcUrls:[RPC_URL],nativeCurrency:{name:'GEN',symbol:'GEN',decimals:18},blockExplorerUrls:[EXPLORER_URL]}
export const explorerAddress=()=>`${EXPLORER_URL}/address/${CONTRACT_ADDRESS}`
export const explorerTx=h=>`${EXPLORER_URL}/tx/${h}`