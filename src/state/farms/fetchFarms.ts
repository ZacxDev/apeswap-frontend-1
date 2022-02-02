import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import multicallABI from 'config/abi/Multicall.json'
import { getMulticallAddress, getMasterChefAddress } from 'utils/addressHelper'
import { getContract } from 'utils/web3'
import masterchefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import labelledGroupMulticall from 'utils/LabelledGroupMulticall'

const fetchFarms = async (chainId: number) => {
  const multicallContractAddress = getMulticallAddress(chainId)
  const multicallContract = getContract(multicallABI, multicallContractAddress, chainId)
  const masterChefAddress = getMasterChefAddress(chainId)
  const calls = farmsConfig.map(farmConfig => {
    const lpAdress = farmConfig.lpAddresses[chainId]
    return {
      label: farmConfig.pid.toString(),
      calls: [
        // Balance of token in the LP contract
        {
          address: farmConfig.tokenAddresses[chainId],
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of quote token on LP contract
        {
          address: farmConfig.quoteTokenAdresses[chainId],
          name: 'balanceOf',
          params: [lpAdress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAdress,
          name: 'balanceOf',
          params: [masterChefAddress],
        },
        // Total supply of LP tokens
        {
          address: lpAdress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: farmConfig.tokenAddresses[chainId],
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: farmConfig.quoteTokenAdresses[chainId],
          name: 'decimals',
        },
      ]
    }
  })

  const lpCalls = await labelledGroupMulticall(multicallContract, erc20, calls)

  const pidCalls = farmsConfig.map(f => {
    return {
      label: f.pid.toString(),
      calls: [
        {
          address: masterChefAddress,
          name: 'poolInfo',
          params: [f.pid],
        },
        {
          address: masterChefAddress,
          name: 'totalAllocPoint',
        },
      ]
    }
  })
  const infoCalls =
    await labelledGroupMulticall(multicallContract, masterchefABI, pidCalls)

  const data = []
  farmsConfig.forEach(fc => {
    const [tokenBalanceLP, quoteTokenBlanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] = lpCalls[fc.pid.toString()]
    const [info, totalAllocPoint] = infoCalls[fc.pid.toString()]

    // Ratio in % a LP tokens that are in staking, vs the total number in circulation
    const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

    // Total value in staking in quote token value
    const lpTotalInQuoteToken = new BigNumber(quoteTokenBlanceLP)
      .div(new BigNumber(10).pow(18))
      .times(new BigNumber(2))
      .times(lpTokenRatio)

    // Total value in pool in quote token value
    const totalInQuoteToken = new BigNumber(quoteTokenBlanceLP).div(new BigNumber(10).pow(18)).times(new BigNumber(2))

    // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
    const tokenAmount = new BigNumber(tokenBalanceLP).div(new BigNumber(10).pow(tokenDecimals)).times(lpTokenRatio)
    const quoteTokenAmount = new BigNumber(quoteTokenBlanceLP)
      .div(new BigNumber(10).pow(quoteTokenDecimals))
      .times(lpTokenRatio)

    const allocPoint = new BigNumber(info.allocPoint._hex)
    const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))
    const alloc = poolWeight.toJSON()
    const multiplier = `${allocPoint.div(100).toString()}X`

    data.push({
      ...fc,
      tokenAmount: tokenAmount.toJSON(),
      quoteTokenAmount: quoteTokenAmount.toJSON(),
      totalInQuoteToken: totalInQuoteToken.toJSON(),
      lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
      tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
      poolWeight: alloc,
      multiplier,
    })
  })

  return data
}

export default fetchFarms
