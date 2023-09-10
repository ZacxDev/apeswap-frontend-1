import { ChainId } from '@ape.swap/sdk'

export * from './rawToPortfolio'
export * from './rawToProjected'

export const supportedChains = [ChainId.TLOS, ChainId.BSC, ChainId.MATIC, ChainId.ARBITRUM] as const

export const CHAIN_NAME = {
  [ChainId.TLOS]: 'Telos',
  [ChainId.BSC]: 'BNB Chain',
  [ChainId.MATIC]: 'Polygon',
  [ChainId.ARBITRUM]: 'Arbitrum',
}

export const initialStatsData = {
  userHoldings: {
    nfts: [],
    banana: '0',
  },
  userStats: [],
  bananaPrice: 0,
  analytics: {
    tvl: {
      pools: {
        id: 'pools',
        name: 'Pools',
        value: '0',
      },
      farms: {
        id: 'farms',
        name: 'Farms',
        value: '0',
      },
      jungleFarms: {
        id: 'jungleFarms',
        name: 'Jungle Farms',
        value: '0',
      },
      maximizers: {
        id: 'maximizer',
        name: 'Maximizers',
        value: '0',
      },
      lending: {
        id: 'lending',
        name: 'Lending',
        value: '0',
      },
      total: '0',
    },
    assets: {
      breakdown: [],
      totalWalletHoldings: 0,
    },
  },
}
