/** @jsxImportSource theme-ui */
import React from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Link, useLocation } from 'react-router-dom'
import {
  AVAILABLE_CHAINS_ON_PRODUCTS,
  FULL_PRODUCT_NAMES,
  INFO_PAGE_CHAIN_PARAMS,
  NETWORK_LABEL,
} from 'config/constants/chains'
import { Flex, Svg, Text } from '@ape.swap/uikit'
import MonkeyImage from 'views/Dex/Orders/components/OrderHistoryPanel/MonkeyImage'
import { useTranslation } from 'contexts/Localization'
import useSwitchNetwork from 'hooks/useSelectNetwork'
import { ChainId } from '@ape.swap/sdk'

const NetworkProductCheck = () => {
  const { chainId } = useActiveWeb3React()
  const { switchNetwork } = useSwitchNetwork()
  const { pathname } = useLocation()
  const { t } = useTranslation()
  // Get exact path for product
  const product = pathname.split('/')?.[1]
  const productDoesNotExistOnNetwork = AVAILABLE_CHAINS_ON_PRODUCTS[product]?.includes(chainId) === false
  return (
    productDoesNotExistOnNetwork && (
      <Flex
        sx={{
          zIndex: 999,
          background: 'rgb(1, 1, 1, .6)',
          width: '100%',
          height: '100%',
          position: 'fixed',
          top: 0,
          left: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Flex
          sx={{
            width: '100%',
            maxWidth: '500px',
            maxHeight: '500px',
            background: 'white2',
            alignItems: 'center',
            justifyContent: 'space-around',
            borderRadius: '10px',
          }}
        >
          <Flex sx={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px 20px' }}>
            <Text size="25px" sx={{ mb: '15px', textAlign: 'center' }}>
              {"You're"} connected to: {NETWORK_LABEL[chainId]}
            </Text>
            <MonkeyImage />
            <Text size="14px" sx={{ margin: '10px 0px 5px 0px', opacity: '.5', textAlign: 'center' }}>
              {t('%product% is only available on ', {
                product: FULL_PRODUCT_NAMES[product],
              })}
              {AVAILABLE_CHAINS_ON_PRODUCTS[product]?.length === 1
                ? AVAILABLE_CHAINS_ON_PRODUCTS[product].map((chainId) => `${NETWORK_LABEL[chainId]}. `)
                : AVAILABLE_CHAINS_ON_PRODUCTS[product].map((chainId) =>
                    AVAILABLE_CHAINS_ON_PRODUCTS[product].indexOf(chainId) ===
                    AVAILABLE_CHAINS_ON_PRODUCTS[product].length - 1
                      ? `${NETWORK_LABEL[chainId]}. `
                      : `${NETWORK_LABEL[chainId]}, `,
                  )}
              {t('Switch to: ')}
            </Text>
            <Flex sx={{ flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
              {AVAILABLE_CHAINS_ON_PRODUCTS[product].map((chainId) => {
                return (
                  <Flex
                    key={chainId}
                    sx={{
                      padding: '5px 10px',
                      background: 'white3',
                      alignItems: 'center',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      margin: '5px 5px',
                    }}
                    onClick={() => switchNetwork(chainId)}
                  >
                    <Svg
                      width={22.5}
                      height={22.5}
                      icon={chainId === ChainId.TLOS ? 'tlos_token' : INFO_PAGE_CHAIN_PARAMS[chainId].icon}
                    />
                    <Text ml="10px">{NETWORK_LABEL[chainId]}</Text>
                  </Flex>
                )
              })}
            </Flex>
            <Text size="14px" sx={{ margin: '10px 0px 5px 0px', opacity: '.5', textAlign: 'center' }}>
              {t('Or stay on: ')}
            </Text>
            <Flex
              as={Link}
              key={chainId}
              sx={{
                padding: '5px 10px',
                background: 'white3',
                alignItems: 'center',
                borderRadius: '10px',
                cursor: 'pointer',
                margin: '5px 5px',
              }}
              to={'/'}
            >
              <Svg
                width={22.5}
                height={22.5}
                icon={chainId === ChainId.TLOS ? 'tlos_token' : INFO_PAGE_CHAIN_PARAMS[chainId].icon}
              />
              <Text ml="10px">{NETWORK_LABEL[chainId]}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    )
  )
}

export default NetworkProductCheck
