import React from 'react'
import { ChainId } from '@ape.swap/sdk'
import { Svg, icons } from '@ape.swap/uikit'
import { Chain } from 'state/statsPage/types'

const chainIcons = {
  [ChainId.TLOS]: icons.TLOS_TOKEN,
  [ChainId.BSC]: icons.BINANCE_CHAIN,
  [ChainId.MATIC]: icons.POLYGON_CHAIN,
  [ChainId.ARBITRUM]: icons.ARBITRUM_CHAIN,
}

export const ChainIcon: React.FC<{ chain: Chain; width?: number }> = ({ chain, width }) => {
  return <Svg icon={chainIcons[chain]} width={width} height={width} />
}
