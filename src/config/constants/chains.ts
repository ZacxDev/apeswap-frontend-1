// Network chain ids

import { ChainId, SmartRouter } from '@ape.swap/sdk'
import BigNumber from 'bignumber.js'

// Network labels
export const NETWORK_LABEL: Partial<Record<ChainId, string>> = {
  [ChainId.BSC]: 'BNB',
  [ChainId.BSC_TESTNET]: 'BNB Testnet',
  [ChainId.MATIC]: 'Polygon',
  [ChainId.MATIC_TESTNET]: 'Polygon Testnet',
  [ChainId.MAINNET]: 'Ethereum',
  [ChainId.TLOS]: 'Telos',
}

export const NETWORK_INFO_LINK: Partial<Record<ChainId, string>> = {
  [ChainId.BSC]: 'https://info.apeswap.finance',
  [ChainId.BSC_TESTNET]: 'https://info.apeswap.finance',
  [ChainId.MATIC]: 'https://polygon.info.apeswap.finance/',
  [ChainId.MATIC_TESTNET]: 'https://polygon.info.apeswap.finance/',
  [ChainId.MAINNET]: 'https://ethereum.info.apeswap.finance',
  [ChainId.TLOS]: 'https://telos.info.apeswap.finance',
}

// Network RPC nodes
export const NETWORK_RPC: Partial<Record<ChainId, string[]>> = {
  [ChainId.BSC]: [
    'https://bsc-dataseed1.ninicoin.io',
    'https://bsc-dataseed.binance.org/',
    'https://bsc-dataseed1.defibit.io',
  ],
  [ChainId.BSC_TESTNET]: ['https://data-seed-prebsc-2-s3.binance.org:8545/'],
  [ChainId.MATIC]: ['https://polygon-rpc.com/'],
  [ChainId.MATIC_TESTNET]: ['https://matic-mumbai.chainstacklabs.com'],
  [ChainId.MAINNET]: ['https://eth-mainnet.nodereal.io/v1/43f9100965104de49b580d1fa1ab28c0'],
  [ChainId.TLOS]: [
    'https://mainnet.telos.net/evm',
    'https://rpc2.eu.telos.net/evm',
    'https://rpc.telosarabia.net/evm',
    'https://evm.teloskorea.com/evm',
  ],
}

// Network block explorers
export const BLOCK_EXPLORER: Partial<Record<ChainId, string>> = {
  [ChainId.BSC]: 'https://bscscan.com',
  [ChainId.BSC_TESTNET]: 'https://testnet.bscscan.com/',
  [ChainId.MATIC]: 'https://polygonscan.com',
  [ChainId.MATIC_TESTNET]: 'https://mumbai.polygonscan.com/',
  [ChainId.MAINNET]: 'https://etherscan.io/',
  [ChainId.TLOS]: 'https://www.teloscan.io',
}

export const CHAIN_PARAMS: Partial<
  Record<
    ChainId,
    {
      chainId: string
      chainName: string
      nativeCurrency: { name: string; symbol: string; decimals: number }
      rpcUrls: string[]
      blockExplorerUrls: string[]
    }
  >
> = {
  [ChainId.BSC]: {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'bnb',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: NETWORK_RPC[ChainId.BSC],
    blockExplorerUrls: [BLOCK_EXPLORER[ChainId.BSC]],
  },
  [ChainId.BSC_TESTNET]: {
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
      name: 'bnb',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: NETWORK_RPC[ChainId.BSC_TESTNET],
    blockExplorerUrls: [BLOCK_EXPLORER[ChainId.BSC_TESTNET]],
  },
  [ChainId.MATIC]: {
    chainId: '0x89',
    chainName: 'Matic',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: NETWORK_RPC[ChainId.MATIC],
    blockExplorerUrls: [BLOCK_EXPLORER[ChainId.MATIC]],
  },
  [ChainId.MATIC_TESTNET]: {
    chainId: '0x89',
    chainName: 'Matic',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: NETWORK_RPC[ChainId.MATIC_TESTNET],
    blockExplorerUrls: [BLOCK_EXPLORER[ChainId.MATIC_TESTNET]],
  },
  [ChainId.MAINNET]: {
    chainId: '0x1',
    chainName: 'Ethereum',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: NETWORK_RPC[ChainId.MAINNET],
    blockExplorerUrls: [BLOCK_EXPLORER[ChainId.MAINNET]],
  },
  [ChainId.TLOS]: {
    chainId: '0x28',
    chainName: 'Telos',
    nativeCurrency: {
      name: 'Telos',
      symbol: 'TLOS',
      decimals: 18,
    },
    rpcUrls: NETWORK_RPC[ChainId.TLOS],
    blockExplorerUrls: [BLOCK_EXPLORER[ChainId.TLOS]],
  },
}

// Ape price impact cutoff
export const APE_PRICE_IMPACT = 15

// This sets the priority of when a router is used
// After APE router should be in order of highest liquidity
export const PRIORITY_SMART_ROUTERS: Partial<Record<ChainId, SmartRouter[]>> = {
  [ChainId.MAINNET]: [SmartRouter.APE, SmartRouter.SUSHISWAP, SmartRouter.UNISWAP],
  [ChainId.BSC]: [SmartRouter.APE, SmartRouter.PANCAKE, SmartRouter.BISWAP],
  [ChainId.MATIC]: [SmartRouter.APE, SmartRouter.QUICKSWAP],
  [ChainId.BSC_TESTNET]: [SmartRouter.APE],
  [ChainId.TLOS]: [SmartRouter.APE],
}

// Wallchain Configs
// If a router is in the priority list for a certain chain it must be added to the wallchain params
export const WALLCHAIN_PARAMS: Partial<
  Record<ChainId, Partial<Record<SmartRouter, { apiUrl: string; apiKey: string }>>>
> = {
  [ChainId.BSC]: {
    [SmartRouter.APE]: {
      apiUrl: 'https://bsc.wallchains.com/upgrade_txn/',
      apiKey: '85c578a5-ecb0-445c-8a95-4c0eba2f33b6',
    },
    [SmartRouter.PANCAKE]: {
      apiUrl: 'https://bsc.wallchains.com/upgrade_txn/',
      apiKey: 'c5f0eb9a-180b-4787-a5c0-db68292f6926',
    },
    [SmartRouter.BISWAP]: {
      apiUrl: 'https://bsc.wallchains.com/upgrade_txn/',
      apiKey: '1cdb6a88-fc95-4831-906a-9ed0e16c9c52',
    },
  },
  [ChainId.BSC_TESTNET]: {
    [SmartRouter.APE]: {
      apiUrl: 'https://bsc.wallchains.com/upgrade_txn/',
      apiKey: '85c578a5-ecb0-445c-8a95-4c0eba2f33b6',
    },
  },
  [ChainId.MATIC]: {
    [SmartRouter.APE]: {
      apiUrl: 'https://matic.wallchains.com/upgrade_txn/',
      apiKey: '5cf2b177-5fa5-477a-8cea-f2b54859af2a',
    },
    [SmartRouter.QUICKSWAP]: {
      apiUrl: 'https://matic.wallchains.com/upgrade_txn/',
      apiKey: '31f565ed-7bc1-44f4-8ca7-331897d65132',
    },
  },
  [ChainId.MAINNET]: {
    [SmartRouter.APE]: {
      apiUrl: 'https://eth.wallchains.com/upgrade_txn/',
      apiKey: '498288e3-4c04-40e9-95a7-3ceb3f75096c',
    },
    [SmartRouter.UNISWAP]: {
      apiUrl: 'https://eth.wallchains.com/upgrade_txn/',
      apiKey: 'ff1e792c-b199-4393-8385-40e533e3687a',
    },
    [SmartRouter.SUSHISWAP]: {
      apiUrl: 'https://eth.wallchains.com/upgrade_txn/',
      apiKey: 'e04868d1-c99d-4bb3-9af9-fb2336310eaa',
    },
  },
  [ChainId.TLOS]: {
    [SmartRouter.APE]: {
      apiUrl: 'https://tlos.wallchains.com/upgrade_txn/',
      apiKey: '1717a226-bb5a-42c4-ad37-6de5229f9e28',
    },
  },
}

// Dont use bonus router if the bonus is lower than the cutoff
export const BONUS_CUTOFF_AMOUNT: Partial<Record<ChainId, number>> = {
  [ChainId.BSC]: 0.5,
  [ChainId.BSC_TESTNET]: 0,
  [ChainId.MATIC]: 0,
  [ChainId.MAINNET]: 0,
  [ChainId.TLOS]: 0,
}

// To display correct prices for each liquidity pool when need to swap the contract out
// Routers in prioirty list must be in here
export const SMART_PRICE_GETTERS: Partial<Record<ChainId, Partial<Record<SmartRouter, string>>>> = {
  [ChainId.BSC]: {
    [SmartRouter.APE]: '0x5e545322b83626c745FE46144a15C00C94cBD803',
    [SmartRouter.PANCAKE]: '0xF724471B00B5fACBA78D195bD241d090350a04Bd',
    [SmartRouter.BISWAP]: '0x1828e426fF3ec9E037cff888CB13f84d5e95F4eF',
  },
  [ChainId.BSC_TESTNET]: {
    [SmartRouter.APE]: '0xd722f9A2950E35Ab3EeD1d013c214671750A638B',
  },
  [ChainId.MATIC]: {
    [SmartRouter.APE]: '0x05D6C73D7de6E02B3f57677f849843c03320681c',
    [SmartRouter.QUICKSWAP]: '0xEe57c38d678CaE0cE16168189dB47238d8fe6553',
  },
  [ChainId.MAINNET]: {
    [SmartRouter.APE]: '0x5fbFd1955EeA2F62F1AfD6d6E92223Ae859F7887',
    [SmartRouter.UNISWAP]: '0x0187D959A28B0D3B490c2D898fA1CcD054cCC3cd',
    [SmartRouter.SUSHISWAP]: '0x51FA9ed2908C76f51fDDA7fa0F6a1d57557668b2',
  },
  [ChainId.TLOS]: {
    [SmartRouter.APE]: '0x29392efed565c13a0901aeb88e32bf58eeb8a067',
  },
}

export const SMART_LP_FEES: Partial<Record<ChainId, Partial<Record<SmartRouter, number>>>> = {
  [ChainId.BSC]: {
    [SmartRouter.APE]: 20,
    [SmartRouter.PANCAKE]: 25,
    [SmartRouter.BISWAP]: 10,
  },
  [ChainId.BSC_TESTNET]: {
    [SmartRouter.APE]: 20,
  },
  [ChainId.MATIC]: {
    [SmartRouter.APE]: 20,
    [SmartRouter.QUICKSWAP]: 30,
  },
  [ChainId.MAINNET]: {
    [SmartRouter.APE]: 20,
    [SmartRouter.UNISWAP]: 30,
    [SmartRouter.SUSHISWAP]: 25,
  },
  [ChainId.TLOS]: {
    [SmartRouter.APE]: 20,
  },
}

// Block times
export const CHAIN_BLOCKS_PER_YEAR: Partial<Record<ChainId, BigNumber>> = {
  [ChainId.BSC]: new BigNumber(10512000),
  [ChainId.MATIC]: new BigNumber(13711304),
  [ChainId.MAINNET]: new BigNumber(2628000),
  [ChainId.TLOS]: new BigNumber(63072000),
}

// Chef addresses for the LP migrator
export const CHEF_ADDRESSES = {
  [ChainId.BSC]: {
    '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652': SmartRouter.PANCAKE,
    '0xDbc1A13490deeF9c3C12b44FE77b503c1B061739': SmartRouter.BISWAP,
  },
}

export const SMART_ROUTER_FULL_NAME = {
  [SmartRouter.PANCAKE]: 'PancakeSwap',
  [SmartRouter.BISWAP]: 'Biswap',
}

// Products on different chains and their available chains
export const AVAILABLE_CHAINS_ON_PRODUCTS: Record<
  'bills' | 'maximizers' | 'jungleFarms' | 'pools' | 'farms',
  ChainId[]
> = {
  bills: [ChainId.BSC, ChainId.MATIC, ChainId.TLOS],
  farms: [ChainId.BSC, ChainId.MATIC, ChainId.TLOS],
  maximizers: [ChainId.BSC],
  jungleFarms: [ChainId.BSC],
  pools: [ChainId.BSC],
}
