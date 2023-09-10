/** @jsxImportSource theme-ui */
import React from 'react'
import { Modal, ModalProps } from '@ape.swap/uikit'
import useTheme from '../../hooks/useTheme'

const SquidBridge = ({ onDismiss }: ModalProps) => {
  const { isDark } = useTheme()
  const src = isDark
    ? 'https://widget.squidrouter.com/iframe?config=%7B%22companyName%22%3A%22Custom%22%2C%22style%22%3A%7B%22neutralContent%22%3A%22%23FAFAFA%22%2C%22baseContent%22%3A%22%23FAFAFA%22%2C%22base100%22%3A%22%23424242%22%2C%22base200%22%3A%22%23383838%22%2C%22base300%22%3A%22%23212121%22%2C%22error%22%3A%22%23ED6A5E%22%2C%22warning%22%3A%22%23FFB155%22%2C%22success%22%3A%22%2362C555%22%2C%22primary%22%3A%22%23FFB300%22%2C%22secondary%22%3A%22%23888888%22%2C%22secondaryContent%22%3A%22%23212121%22%2C%22neutral%22%3A%22%23424242%22%2C%22roundedBtn%22%3A%2210px%22%2C%22roundedBox%22%3A%2210px%22%2C%22roundedDropDown%22%3A%2210px%22%2C%22displayDivider%22%3Atrue%7D%2C%22slippage%22%3A1.5%2C%22infiniteApproval%22%3Afalse%2C%22instantExec%22%3Afalse%2C%22apiUrl%22%3A%22https%3A%2F%2Fapi.squidrouter.com%22%2C%22mainLogoUrl%22%3A%22https%3A%2F%2Fapeswap.finance%2Flogo.png%22%2C%22comingSoonChainIds%22%3A%5B%22cosmoshub-4%22%2C%22injective-1%22%2C%22axelar-dojo-1%22%2C%22kichain-2%22%5D%2C%22titles%22%3A%7B%22swap%22%3A%22Convert%22%2C%22settings%22%3A%22Settings%22%2C%22wallets%22%3A%22Wallets%22%2C%22tokens%22%3A%22Tokens%22%2C%22chains%22%3A%22Chains%22%2C%22history%22%3A%22History%22%2C%22transaction%22%3A%22Transaction%22%2C%22allTokens%22%3A%22Tokens%22%2C%22destination%22%3A%22Destination%20address%22%7D%2C%22priceImpactWarnings%22%3A%7B%22warning%22%3A3%2C%22critical%22%3A5%7D%7D'
    : 'https://widget.squidrouter.com/iframe?config=%7B%22companyName%22%3A%22Custom%22%2C%22style%22%3A%7B%22neutralContent%22%3A%22%234D4040%22%2C%22baseContent%22%3A%22%234D4040%22%2C%22base100%22%3A%22%23FDFBF5%22%2C%22base200%22%3A%22%23F9F4E7%22%2C%22base300%22%3A%22%23F1EADA%22%2C%22error%22%3A%22%23ED6A5E%22%2C%22warning%22%3A%22%23FFB155%22%2C%22success%22%3A%22%2362C555%22%2C%22primary%22%3A%22%23FFB300%22%2C%22secondary%22%3A%22%23888888%22%2C%22secondaryContent%22%3A%22%23F1EADA%22%2C%22neutral%22%3A%22%23FDFBF5%22%2C%22roundedBtn%22%3A%2210px%22%2C%22roundedBox%22%3A%2210px%22%2C%22roundedDropDown%22%3A%2210px%22%2C%22displayDivider%22%3Atrue%7D%2C%22slippage%22%3A1.5%2C%22infiniteApproval%22%3Afalse%2C%22instantExec%22%3Afalse%2C%22apiUrl%22%3A%22https%3A%2F%2Fapi.squidrouter.com%22%2C%22mainLogoUrl%22%3A%22https%3A%2F%2Fapeswap.finance%2Flogo.png%22%2C%22comingSoonChainIds%22%3A%5B%22cosmoshub-4%22%2C%22injective-1%22%2C%22axelar-dojo-1%22%2C%22kichain-2%22%5D%2C%22titles%22%3A%7B%22swap%22%3A%22Convert%22%2C%22settings%22%3A%22Settings%22%2C%22wallets%22%3A%22Wallets%22%2C%22tokens%22%3A%22Tokens%22%2C%22chains%22%3A%22Chains%22%2C%22history%22%3A%22History%22%2C%22transaction%22%3A%22Transaction%22%2C%22allTokens%22%3A%22Tokens%22%2C%22destination%22%3A%22Destination%20address%22%7D%2C%22priceImpactWarnings%22%3A%7B%22warning%22%3A3%2C%22critical%22%3A5%7D%7D'
  const modalProps = {
    style: {
      zIndex: 10,
      overflowY: 'auto',
      maxHeight: 'calc(100% - 30px)',
    },
    sx: {
      minWidth: '437px',
      '@media screen and (max-width: 437px)': {
        minWidth: '95%',
      },
      maxWidth: '437px',
    },
  }
  return (
    <Modal title="Cross Chain Bridge" onDismiss={onDismiss} {...modalProps}>
      <iframe
        style={{ overflow: 'hidden', width: '100%', height: '642px', border: 'none' }}
        title="SquidBridge"
        src={src}
      />
    </Modal>
  )
}

export default SquidBridge
