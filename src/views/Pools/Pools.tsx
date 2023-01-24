import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { PoolCategory } from 'config/constants/types'
import { useWeb3React } from '@web3-react/core'
import { Flex } from '@apeswapfinance/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import useBlockNumber from 'lib/hooks/useBlockNumber'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePollPools, usePoolOrderings, usePools, usePoolTags } from 'state/pools/hooks'
import ListViewLayout from 'components/layout/ListViewLayout'
import Banner from 'components/Banner'
import { Pool } from 'state/types'
import DisplayPools from './components/DisplayPools'
import { AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS, LIST_VIEW_PRODUCTS } from 'config/constants/chains'
import ListView404 from 'components/ListView404'
import ListViewMenu from '../../components/ListViewV2/ListViewMenu/ListViewMenu'
import HarvestAll from './components/Actions/HarvestAll'
import { FILTER_OPTIONS, SORT_OPTIONS } from './poolsOptions'

const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  usePollPools()
  const { chainId } = useActiveWeb3React()
  const [stakedOnly, setStakedOnly] = useState(false)
  const [filterOption, setFilterOption] = useState('allTokens')
  const [sortOption, setSortOption] = useState('all')
  const [observerIsSet, setObserverIsSet] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const { account } = useWeb3React()
  const { pathname } = useLocation()
  const allPools = usePools(account)
  const { poolTags } = usePoolTags(chainId)
  const { poolOrderings } = usePoolOrderings(chainId)
  const { t } = useTranslation()
  const currentBlock = useBlockNumber()
  const { search } = window.location
  const params = new URLSearchParams(search)
  const urlSearchedPool = parseInt(params.get('id'))
  const isActive = !pathname.includes('history')
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  useEffect(() => {
    const showMorePools = (entries) => {
      const [entry] = entries
      if (entry.isIntersecting) {
        setNumberOfPoolsVisible((poolsCurrentlyVisible) => poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE)
      }
    }

    if (!observerIsSet) {
      const loadMoreObserver = new IntersectionObserver(showMorePools, {
        rootMargin: '0px',
        threshold: 1,
      })
      loadMoreObserver.observe(loadMoreRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  const allNonAdminPools = allPools.filter((pool) => !pool.forAdmins && pool?.poolCategory !== PoolCategory.JUNGLE)
  const curPools = allNonAdminPools.map((pool) => {
    return { ...pool, isFinished: pool.sousId === 0 ? false : pool.isFinished || currentBlock > pool.endBlock }
  })

  const [finishedPools, openPools] = partition(curPools, (pool) => pool.isFinished)

  const stakedOnlyPools = openPools.filter(
    (pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0),
  )
  const stakedInactivePools = finishedPools.filter(
    (pool) => pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0),
  )
  const sousIds = [...stakedOnlyPools, ...stakedInactivePools].map((pool) => {
    return pool.sousId
  })

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case 'apr':
        return orderBy(poolsToSort, (pool: Pool) => pool.apr, 'desc')
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: Pool) => {
            if (!pool.userData || !pool.rewardToken?.price) {
              return 0
            }
            return getBalanceNumber(pool.userData.pendingReward) * pool.rewardToken?.price
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (pool: Pool) => getBalanceNumber(pool.totalStaked) * pool.stakingToken?.price,
          'desc',
        )
      case 'hot':
        return poolTags
          ? orderBy(
              poolsToSort,
              (pool: Pool) => poolTags?.find((tag) => tag.pid === pool.sousId && tag.text.toLowerCase() === 'hot'),
              'asc',
            )
          : poolsToSort
      case 'new':
        return poolTags
          ? orderBy(
              poolsToSort,
              (pool: Pool) => poolTags?.find((tag) => tag.pid === pool.sousId && tag.text.toLowerCase() === 'new'),
              'asc',
            )
          : poolsToSort
      default:
        return poolOrderings
          ? orderBy(
              poolsToSort,
              (pool: Pool) => poolOrderings?.find((ordering) => ordering.pid === pool.sousId)?.order,
              'asc',
            )
          : poolsToSort
    }
  }

  const renderPools = () => {
    let chosenPools = isActive ? openPools : finishedPools
    if (urlSearchedPool) {
      const poolCheck =
        openPools?.find((pool) => {
          return pool.sousId === urlSearchedPool
        }) !== undefined
      if (poolCheck) {
        chosenPools = [
          openPools?.find((pool) => {
            return pool.sousId === urlSearchedPool
          }),
          ...openPools?.filter((pool) => {
            return pool.sousId !== urlSearchedPool
          }),
        ]
      }
    }

    if (stakedOnly) {
      chosenPools = isActive ? stakedOnlyPools : stakedInactivePools
    }
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase()
      chosenPools = chosenPools.filter((pool) => pool.tokenName.toLowerCase().includes(lowercaseQuery))
    }
    if (filterOption !== 'allTokens') {
      chosenPools = chosenPools.filter((pool) => pool.stakingToken.symbol === filterOption.toUpperCase())
    }

    return sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  }

  return (
    <>
      <Flex
        flexDirection="column"
        justifyContent="center"
        mb="100px"
        style={{ position: 'relative', top: '30px', width: '100%' }}
      >
        <ListViewLayout>
          <Banner banner="pools" link="?modal=tutorial" title={t('Staking Pools')} listViewBreak maxWidth={1130} />
          <Flex flexDirection="column" alignSelf="center" style={{ maxWidth: '1130px', width: '100%' }}>
            <Flex style={{ marginBottom: '20px' }}>
              <ListViewMenu
                query={searchQuery}
                onHandleQueryChange={handleChangeQuery}
                setFilterOption={setFilterOption}
                filterOption={filterOption}
                setSortOption={setSortOption}
                sortOption={sortOption}
                checkboxLabel="Staked"
                showOnlyCheckbox={stakedOnly}
                setShowOnlyCheckbox={setStakedOnly}
                toogleLabels={['Active', 'Inactive']}
                filterOptions={FILTER_OPTIONS}
                sortOptions={SORT_OPTIONS}
                actionButton={<HarvestAll sousIds={sousIds} />}
              />
            </Flex>
            {!AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS.pools.includes(chainId) ? (
              <ListView404 product={LIST_VIEW_PRODUCTS.POOLS} />
            ) : (
              <DisplayPools pools={renderPools()} openId={urlSearchedPool} poolTags={poolTags} />
            )}
            <div ref={loadMoreRef} />
          </Flex>
        </ListViewLayout>
      </Flex>
    </>
  )
}

export default React.memo(Pools)
