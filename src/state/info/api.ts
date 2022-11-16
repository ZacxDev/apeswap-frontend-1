import {
  blocksQuery,
  graphQuery,
  nativePricesQuery,
  pairsQuery,
  tokensQuery,
  transactionsQuery,
  uniswapFactoriesQuery,
} from './queries'
import { ChainId } from '@ape.swap/sdk'
import { INFO_PAGE_CHAIN_PARAMS } from 'config/constants/chains'
import axiosRetry from 'axios-retry'
import axios from 'axios'
import { Block, DaysData, NativePrice, Pairs, Token, Transactions } from './types'
import { daysDataQuery } from 'views/Info/queries'

export const getInfoPairs = async (chainId: ChainId, amount: number): Promise<Pairs[]> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(graphAddress, JSON.stringify(pairsQuery(amount)))
    const { data } = responseData
    if (status === 500) {
      return []
    }
    return data.pairs.map((x) => ({ ...x, chain: chainId }))
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getTransactions = async (chainId: ChainId, amount: number): Promise<Transactions[]> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(graphAddress, JSON.stringify(transactionsQuery(amount)))
    const { data } = responseData
    if (status === 500) {
      return []
    }
    return data.transactions.map((x) => ({ ...x, chain: chainId }))
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getNativePrices = async (chainId: ChainId): Promise<NativePrice> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(graphAddress, JSON.stringify(nativePricesQuery))
    const { data } = responseData
    if (status === 500) {
      return null
    }
    return data.bundles.map((x) => ({ ...x, chain: chainId }))[0]
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getDaysData = async (chainId: ChainId, oneDayBack: number): Promise<DaysData[]> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(graphAddress, JSON.stringify(daysDataQuery(oneDayBack)))
    const { data } = responseData
    if (status === 500) {
      return []
    }
    return data.uniswapDayDatas
  } catch (error) {
    console.error(error)
    return []
  }
}

export const getBlocks = async (chainId: ChainId, startTimestamp: number, currentTimestamp: number): Promise<Block> => {
  const { blockGraph } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(
      blockGraph,
      JSON.stringify(blocksQuery(startTimestamp, currentTimestamp)),
    )
    const { data } = responseData
    if (status === 500) {
      return null
    }
    return data.blocks[0]
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getChartData = async (chainId: ChainId): Promise<any> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(graphAddress, JSON.stringify(graphQuery))
    const { data } = responseData
    if (status === 500) {
      return null
    }
    return data.uniswapDayDatas.map((x) => ({ ...x, chain: chainId }))
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getUniswapFactories = async (chainId: ChainId, block: string): Promise<any> => {
  const { graphAddress, id } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(
      graphAddress,
      JSON.stringify(uniswapFactoriesQuery(id, block)),
    )
    const { data } = responseData
    if (status === 500) {
      return null
    }
    return data.uniswapFactories.map((x) => ({ ...x, chain: chainId }))[0]
  } catch (error) {
    console.error(error)
    return null
  }
}

export const getTokens = async (chainId: ChainId, amount: number, block: string): Promise<Token[]> => {
  const { graphAddress } = INFO_PAGE_CHAIN_PARAMS[chainId]
  try {
    axiosRetry(axios, {
      retries: 5,
      retryCondition: () => true,
    })
    const { data: responseData, status } = await axios.post(graphAddress, JSON.stringify(tokensQuery(amount, block)))
    const { data } = responseData
    if (status === 500) {
      return []
    }
    return data.tokens.map((x) => ({ ...x, chain: chainId }))
  } catch (error) {
    console.error(error)
    return []
  }
}
