import BigNumber from 'bignumber.js'
import React, { useCallback, useState, useRef } from 'react'
import Reward from 'react-rewards'
import rewards from 'config/constants/rewards'
import styled from 'styled-components'
import { Button, IconButton, useModal, AddIcon, Image } from '@apeswapfinance/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import UnlockButton from 'components/UnlockButton'
import Label from 'components/Label'
import { useERC20 } from 'hooks/useContract'
import { useSousApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import { useSousStake } from 'hooks/useStake'
import useReward from 'hooks/useReward'
import { useSousUnstake } from 'hooks/useUnstake'
import useBlock from 'hooks/useBlock'
import { getBalanceNumber } from 'utils/formatBalance'
import { useSousHarvest } from 'hooks/useHarvest'
import Balance from 'components/Balance'
import { QuoteToken, PoolCategory } from 'config/constants/types'
import { Pool } from 'state/types'
import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
import CompoundModal from './CompoundModal'
import CardTitle from './CardTitle'
import Card from './Card'
import OldSyrupTitle from './OldSyrupTitle'
import HarvestButton from './HarvestButton'
import CardFooter from './CardFooter'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID
interface PoolWithApy extends Pool {
  apy: BigNumber
}

interface HarvestProps {
  pool: PoolWithApy
}

const PoolCard: React.FC<HarvestProps> = ({ pool }) => {
  const {
    sousId,
    image,
    tokenName,
    stakingTokenName,
    stakingTokenAddress,
    projectLink,
    harvest,
    apy,
    tokenDecimals,
    poolCategory,
    totalStaked,
    startBlock,
    endBlock,
    isFinished,
    userData,
    stakingLimit,
    displayDecimals,
  } = pool
  // Pools using native BNB behave differently than pools using a token
  const isBnbPool = poolCategory === PoolCategory.BINANCE

  const rewardRef = useRef(null)

  const TranslateString = useI18n()
  const stakingTokenContract = useERC20(stakingTokenAddress[CHAIN_ID])
  const { account } = useWallet()
  const block = useBlock()
  const { onApprove } = useSousApprove(stakingTokenContract, sousId)
  const onStake = useReward(rewardRef, useSousStake(sousId, isBnbPool).onStake)
  const onUnstake = useReward(rewardRef, useSousUnstake(sousId).onUnstake)
  const onReward = useReward(rewardRef, useSousHarvest(sousId, isBnbPool).onReward)

  const [requestedApproval, setRequestedApproval] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)

  const [typeOfReward, setTypeOfReward] = useState('rewardBanana')

  const allowance = new BigNumber(userData?.allowance || 0)
  const stakingTokenBalance = new BigNumber(userData?.stakingTokenBalance || 0)
  const stakedBalance = new BigNumber(userData?.stakedBalance || 0)
  const earnings = new BigNumber(userData?.pendingReward || 0)

  const blocksUntilStart = Math.max(startBlock - block, 0)
  const blocksRemaining = Math.max(endBlock - block, 0)
  const isOldSyrup = stakingTokenName === QuoteToken.SYRUP
  const accountHasStakedBalance = stakedBalance?.toNumber() > 0
  const needsApproval = !accountHasStakedBalance && !allowance.toNumber() && !isBnbPool
  const isCardActive = isFinished && accountHasStakedBalance

  const convertedLimit = new BigNumber(stakingLimit).multipliedBy(new BigNumber(10).pow(tokenDecimals))
  const [onPresentDeposit] = useModal(
    <DepositModal
      max={stakingLimit && stakingTokenBalance.isGreaterThan(convertedLimit) ? convertedLimit : stakingTokenBalance}
      onConfirm={onStake}
      tokenName={stakingLimit ? `${stakingTokenName} (${stakingLimit} max)` : stakingTokenName}
    />,
  )

  const [onPresentCompound] = useModal(
    <CompoundModal earnings={earnings} onConfirm={onStake} tokenName={stakingTokenName} />,
  )

  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={stakingTokenName} />,
  )

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      const txHash = await onApprove()
      // user rejected tx or didn't go thru
      if (!txHash) {
        setRequestedApproval(false)
      } else {
        rewardRef.current?.rewardMe()
      }
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, setRequestedApproval])

  return (
    <Card isActive={isCardActive} isFinished={isFinished && sousId !== 0}>
      <Reward ref={rewardRef} type="emoji" config={rewards[typeOfReward]}>
        {isFinished && sousId !== 0 && <PoolFinishedSash />}
        <div style={{ padding: '24px' }}>
          <CardTitle isFinished={isFinished && sousId !== 0}>
            {isOldSyrup && '[OLD]'} {tokenName} {TranslateString(348, 'Pool')}
          </CardTitle>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <Image src={`/images/tokens/${image || tokenName}.svg`} width={64} height={64} alt={tokenName} />
            </div>
            {account && harvest && !isOldSyrup && (
              <HarvestButton
                disabled={!earnings.toNumber() || pendingTx}
                text={pendingTx ? 'Collecting' : 'Wuzz out'}
                onClick={async () => {
                  setPendingTx(true)
                  setTypeOfReward('removed')
                  await onReward().catch(() => setPendingTx(false))
                  setPendingTx(false)
                }}
              />
            )}
          </div>
          {!isOldSyrup ? (
            <BalanceAndCompound>
              <Balance
                value={getBalanceNumber(earnings, tokenDecimals)}
                decimals={displayDecimals}
                isDisabled={isFinished}
              />
              {sousId === 0 && account && harvest && (
                <HarvestButton
                  disabled={!earnings.toNumber() || pendingTx}
                  text={pendingTx ? TranslateString(999, 'Aping') : TranslateString(999, 'Ape Harder')}
                  onClick={() => {
                    setTypeOfReward('rewardBanana')
                    onPresentCompound()
                  }}
                />
              )}
            </BalanceAndCompound>
          ) : (
            <OldSyrupTitle hasBalance={accountHasStakedBalance} />
          )}
          <Label isFinished={isFinished && sousId !== 0} text={TranslateString(330, `${tokenName} earned`)} />
          <StyledCardActions>
            {!account && <UnlockButton />}
            {account &&
              (needsApproval && !isOldSyrup ? (
                <div style={{ flex: 1 }}>
                  <Button disabled={isFinished || requestedApproval} onClick={handleApprove} fullWidth>
                    {`Approve ${stakingTokenName}`}
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    disabled={stakedBalance.eq(new BigNumber(0)) || pendingTx}
                    onClick={
                      isOldSyrup
                        ? async () => {
                            setPendingTx(true)
                            setTypeOfReward('removed')
                            await onUnstake('0')
                            setPendingTx(false)
                          }
                        : () => {
                            setTypeOfReward('removed')
                            onPresentWithdraw()
                          }
                    }
                  >
                    {`Unstake ${stakingTokenName}`}
                  </Button>
                  <StyledActionSpacer />
                  {!isOldSyrup && (
                    <IconButton
                      disabled={isFinished && sousId !== 0}
                      onClick={() => {
                        setTypeOfReward('rewardBanana')
                        onPresentDeposit()
                      }}
                    >
                      <AddIcon color="background" />
                    </IconButton>
                  )}
                </>
              ))}
          </StyledCardActions>
          <StyledDetails>
            <div style={{ flex: 1 }}>{TranslateString(736, 'APR')}:</div>
            {isFinished || isOldSyrup || !apy || apy?.isNaN() || !apy?.isFinite() ? (
              '-'
            ) : (
              <Balance fontSize="14px" isDisabled={isFinished} value={apy?.toNumber()} decimals={2} unit="%" />
            )}
          </StyledDetails>
          <StyledDetails>
            <div style={{ flex: 1 }}>
              <span role="img" aria-label={stakingTokenName}>
                🍌{' '}
              </span>
              {TranslateString(384, 'Your Stake')}:
            </div>
            <Balance fontSize="14px" isDisabled={isFinished} value={getBalanceNumber(stakedBalance)} />
          </StyledDetails>
        </div>
        <CardFooter
          projectLink={projectLink}
          totalStaked={totalStaked}
          blocksRemaining={blocksRemaining}
          isFinished={isFinished}
          blocksUntilStart={blocksUntilStart}
          poolCategory={poolCategory}
        />
      </Reward>
    </Card>
  )
}

const PoolFinishedSash = styled.div`
  background-image: url('/images/pool-finished-sash.svg');
  background-position: top right;
  background-repeat: not-repeat;
  height: 135px;
  position: absolute;
  right: -24px;
  top: -24px;
  width: 135px;
`

const StyledCardActions = styled.div`
  display: flex;
  justify-content: center;
  margin: 16px 0;
  width: 100%;
  box-sizing: border-box;
`

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`

const StyledActionSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  display: flex;
  font-size: 14px;
`

export default PoolCard
