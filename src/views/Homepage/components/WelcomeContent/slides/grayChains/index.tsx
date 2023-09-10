import React from 'react'
import { ChainId } from '@ape.swap/sdk'
import Bnb from './bnb'
import Poly from './poly'
import Arbitrum from './Arbitrum'
import Tlos from './Tlos'

export const grayIcons = {
  [ChainId.BSC]: <Bnb />,
  [ChainId.MATIC]: <Poly />,
  [ChainId.ARBITRUM]: <Arbitrum />,
  [ChainId.TLOS]: <Tlos />,
}
