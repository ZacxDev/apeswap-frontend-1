import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { ApiResponse, Chain } from './types'
import { rawToPortfolio, PortfolioData, rawToProjected, ProjectedData } from './mappings'
import { NftInfo, rawToNfts } from './mappings/rawToNfts'
import { fetchStatsData } from './api'
import { rawToVested, Vested } from './mappings/rawToVested'

interface StatsProviderProps {
  children: ReactNode
}

interface StatsContextData {
  stats: ApiResponse
  portfolioData: PortfolioData[]
  projectedData: ProjectedData[]
  nfts: NftInfo[]
  vestedProducts: Vested[]
  selectedChain: Chain | 0
  handleChangeSelectedChain: (chain: Chain) => void
  loading: boolean
}

const StatsContext = createContext<StatsContextData>({} as StatsContextData)

export function StatsProvider({ children }: StatsProviderProps) {
  const { account } = useActiveWeb3React()
  const [stats, setStats] = useState<ApiResponse>()
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([])
  const [projectedData, setProjectedData] = useState<ProjectedData[]>([])
  const [nfts, setNfts] = useState<NftInfo[]>([])
  const [vestedProducts, setVestedProducts] = useState<Vested[]>([])
  const [selectedChain, setSelectedChain] = useState<Chain | 0>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)

      const statsData = await fetchStatsData(`${account}${selectedChain ? `?chain=${selectedChain}` : ''}`)

      setStats(statsData)
      setPortfolioData(rawToPortfolio(statsData))
      setProjectedData(rawToProjected(statsData))
      setVestedProducts(rawToVested(statsData))
      setNfts(rawToNfts(statsData))

      setLoading(false)
    }

    if (account) {
      fetchStats()
    }
  }, [account, selectedChain])

  const handleChangeSelectedChain = (chain: Chain) => {
    setSelectedChain(chain)
  }

  return (
    <StatsContext.Provider
      value={{
        stats,
        portfolioData,
        selectedChain,
        handleChangeSelectedChain,
        loading,
        projectedData,
        nfts,
        vestedProducts,
      }}
    >
      {children}
    </StatsContext.Provider>
  )
}

export function useStats() {
  const context = useContext(StatsContext)

  return context
}
