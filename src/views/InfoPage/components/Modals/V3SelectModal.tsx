/** @jsxImportSource theme-ui */
import React from 'react'
import { Modal, Flex, Text, IconButton, Svg } from '@ape.swap/uikit'
import useIsMobile from '../../../../hooks/useIsMobile'

interface V3SelectModalProps {
  onDismiss: () => void
}

const V3SelectModal: React.FC<V3SelectModalProps> = ({ onDismiss }) => {
  const mobile = useIsMobile()

  return (
    <Modal onDismiss={onDismiss} minWidth={`${mobile ? '95vw' : '500px'}`} maxWidth={`${mobile ? '95vw' : '500px'}`}>
      <Flex alignItems="center" justifyContent="center" mt="10px" mb="20px">
        <IconButton
          icon="close"
          color="text"
          variant="transparent"
          onClick={onDismiss}
          sx={{ position: 'absolute', right: '20px', top: '25px' }}
        />
      </Flex>
      <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'center', mb: '20px' }}>
        <Text size="14px" sx={{ textAlign: 'center' }}>
          {`Select a logo below to view that chain's v3 analytics page`}{' '}
        </Text>
      </Flex>
      <Flex sx={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <a
          href="https://v3-info.apeswap.finance/#/bnb"
          target="_blank"
          rel="noopener noreferrer"
          key={56}
          sx={{ cursor: 'pointer', margin: '0px 20px' }}
        >
          <Flex>
            <Svg width={30} height={30} icon="binance_chain" />
          </Flex>
        </a>
        <a
          href="https://v3-info.apeswap.finance/#/polygon"
          target="_blank"
          rel="noopener noreferrer"
          key={137}
          sx={{ cursor: 'pointer', margin: '0px 20px' }}
        >
          <Flex>
            <Svg width={30} height={30} icon="polygon_chain" />
          </Flex>
        </a>
      </Flex>
    </Modal>
  )
}

export default React.memo(V3SelectModal)
