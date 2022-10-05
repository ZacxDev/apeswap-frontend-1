import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { JSBI, Percent, ZapType, ZapV1 } from '@ape.swap/sdk'
import { useMemo } from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import truncateHash from 'utils/truncateHash'
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from '../config/constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, isAddress } from '../utils'
import isZero from '../utils/isZero'
import useTransactionDeadline from './useTransactionDeadline'
import useENS from './ENS/useENS'
import { useZapContract } from './useContract'
import { MergedZap } from 'state/zap/actions'
import track from '../utils/track'
import { getBalanceNumber } from '../utils/formatBalance'
import { BigNumber as BN } from 'bignumber.js'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract
  parameters: any
}

interface SuccessfulCall {
  call: SwapCall
  gasEstimate: BigNumber
}

interface FailedCall {
  call: SwapCall
  error: Error
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param bestZapOne trade to execute
 * @param bestZapTwo trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */

function useZapCallArguments(
  zap: MergedZap,
  zapType: ZapType,
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  stakingContractAddress?: string,
  maxPrice?: string,
  stakingPid?: string,
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress
  const deadline = useTransactionDeadline()
  const contract: Contract | null = useZapContract()

  return useMemo(() => {
    if (
      !zap?.currencyIn?.currency ||
      !zap?.pairOut?.pair ||
      !recipient ||
      !library ||
      !account ||
      !chainId ||
      !deadline
    )
      return []

    if (!contract) {
      return []
    }

    const swapMethods = []

    swapMethods.push(
      ZapV1.zapCallParameters(zap, {
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        zapType: zapType,
        stakingContractAddress,
        recipient,
        deadline: deadline.toNumber(),
        maxPrice,
        stakingPid,
      }),
    )

    return swapMethods.map((parameters) => ({ parameters, contract }))
  }, [
    account,
    allowedSlippage,
    chainId,
    deadline,
    library,
    recipient,
    contract,
    zap,
    stakingContractAddress,
    maxPrice,
    zapType,
    stakingPid,
  ])
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useZapCallback(
  zap: MergedZap,
  zapType: ZapType,
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddressOrName: string | null, // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  stakingContractAddress?: string,
  maxPrice?: string,
  poolPid?: string,
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId, library } = useActiveWeb3React()

  const swapCalls = useZapCallArguments(
    zap,
    zapType,
    allowedSlippage,
    recipientAddressOrName,
    stakingContractAddress,
    maxPrice,
    poolPid,
  )
  console.log(swapCalls)

  const addTransaction = useTransactionAdder()

  const { address: recipientAddress } = useENS(recipientAddressOrName)
  const recipient = recipientAddressOrName === null ? account : recipientAddress

  return useMemo(() => {
    if (!library || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddressOrName !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onZap(): Promise<string> {
        const estimatedCalls = await Promise.all(
          swapCalls.map((call) => {
            const {
              parameters: { methodName, args, value },
              contract,
            } = call
            const options = !value || isZero(value) ? {} : { value }

            return contract.estimateGas[methodName](...args, options)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.error('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](...args, options)
                  .then((result) => {
                    console.error('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: new Error('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch((callError) => {
                    console.error('Call threw error', call, callError)
                    const reason: string = callError.reason || callError.data?.message || callError.message
                    const errorMessage = `The transaction cannot succeed due to error: ${
                      `${reason}. This is probably an issue with one of the tokens you are zapping` ??
                      'Unknown error, check the logs'
                    }.`

                    return { call, error: new Error(errorMessage) }
                  })
              })
          }),
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw errorCalls[errorCalls.length - 1].error
          throw new Error('Unexpected error. Please contact support: none of the calls threw an error')
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value },
          },
          gasEstimate,
        } = successfulEstimation

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = zap?.currencyIn?.currency?.getSymbol(chainId)
            const outputSymbol = `${zap?.pairOut?.pair?.token0?.getSymbol(
              chainId,
            )} - ${zap?.pairOut?.pair?.token1?.getSymbol(chainId)}`

            const base = `Zap ${inputSymbol} into ${outputSymbol}`
            const withRecipient =
              recipient === account
                ? base
                : `${base} to ${
                    recipientAddressOrName && isAddress(recipientAddressOrName)
                      ? truncateHash(recipientAddressOrName)
                      : recipientAddressOrName
                  }`

            addTransaction(response, {
              summary: withRecipient,
            })
            track({
              event: 'zap',
              chain: chainId,
              data: {
                cat: 'liquidity',
                token1: zap.currencyIn.currency.getSymbol(chainId),
                token2: `${zap.currencyOut1.outputCurrency.getSymbol(
                  chainId,
                )}-${zap.currencyOut2.outputCurrency.getSymbol(chainId)}`,
                amount: getBalanceNumber(new BN(zap.currencyIn.inputAmount.toString())),
              },
            })
            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(`Swap failed: ${error.message}`)
            }
          })
      },
      error: null,
    }
  }, [zap, library, account, chainId, recipient, recipientAddressOrName, swapCalls, addTransaction])
}
