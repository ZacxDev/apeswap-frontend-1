/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, Flex, ModalProps } from '@ape.swap/uikit'
import { Modal } from '@apeswapfinance/uikit'
import { Switch } from 'theme-ui'

import {
  useExpertModeManager,
  useUserExpertModeAcknowledgementShow,
  useUserSingleHopOnly,
  useUserRecentTransactions,
  useUserAutonomyPrepay,
  useBonusRouterManager,
} from 'state/user/hooks'
import { useSwapActionHandlers } from 'state/swap/hooks'
import { useTranslation } from 'contexts/Localization'
import TransactionSettings from './TransactionSettings'
import ExpertModal from './ExpertModal'
import { styles } from './styles'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ChainId } from '@ape.swap/sdk'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  max-height: 400px;

  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`

interface Props extends ModalProps {
  zapSettings?: boolean
}

const SettingsModal: React.FC<Props> = ({ onDismiss, zapSettings }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [recentTransactions, setRecentTransactions] = useUserRecentTransactions()
  const [autonomyPrepay, setAutonomyPrepay] = useUserAutonomyPrepay()
  const [bonusRouterDisabled, toggleSetBonusRouter] = useBonusRouterManager()
  const { onChangeRecipient } = useSwapActionHandlers()
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
      />
    )
  }

  const handleExpertModeToggle = () => {
    if (expertMode) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else if (!showExpertModeAcknowledgement) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else {
      setShowConfirmExpertModal(true)
    }
  }

  return (
    <Modal title={t('Settings')} onDismiss={onDismiss} maxWidth="420px">
      {zapSettings ? (
        <TransactionSettings zapSettings={zapSettings} />
      ) : (
        <ScrollableContainer>
          <Text size="18px" weight={700} margin="10px 0px">
            {t('Swap')}
          </Text>
          <TransactionSettings />
          <Flex sx={{ justifyContent: 'space-between', margin: '5px 0px' }}>
            <Text weight={500}>{t('Recent Transactions')}</Text>
            <Flex>
              <Switch
                sx={styles.switch}
                checked={recentTransactions}
                onChange={() => {
                  setRecentTransactions(!recentTransactions)
                }}
              />
            </Flex>
          </Flex>
          <Flex sx={{ justifyContent: 'space-between', margin: '5px 0px' }}>
            <Text>{t('Expert Mode')}</Text>
            <Flex>
              <Switch sx={styles.switch} checked={expertMode} onChange={handleExpertModeToggle} />
            </Flex>
          </Flex>
          <Flex sx={{ justifyContent: 'space-between', margin: '5px 0px' }}>
            <Text weight={500}>{t('Disable Multihops')}</Text>
            <Flex>
              <Switch
                sx={styles.switch}
                checked={singleHopOnly}
                onChange={() => {
                  setSingleHopOnly(!singleHopOnly)
                }}
              />
            </Flex>
          </Flex>
          <Flex sx={{ justifyContent: 'space-between', margin: '5px 0px' }}>
            <Text weight={500}>{t('Autonomy Prepay')}</Text>
            <Flex>
              <Switch
                sx={styles.switch}
                checked={autonomyPrepay}
                onChange={() => {
                  setAutonomyPrepay(!autonomyPrepay)
                }}
              />
            </Flex>
          </Flex>
          <Flex sx={{ justifyContent: 'space-between', margin: '5px 0px' }}>
            <Text weight={500}>{t('Disable Bonus Router')}</Text>
            <Flex>
              <Switch sx={styles.switch} checked={bonusRouterDisabled} onChange={toggleSetBonusRouter} />
            </Flex>
          </Flex>
          {chainId === ChainId.BSC && (
            <Flex sx={{ margin: '5px 0px', textDecoration: 'underline' }}>
              <a href="/limit-orders">
                <Text weight={500}>{t('View Limit Orders')}</Text>
              </a>
            </Flex>
          )}
        </ScrollableContainer>
      )}
    </Modal>
  )
}

export default SettingsModal
