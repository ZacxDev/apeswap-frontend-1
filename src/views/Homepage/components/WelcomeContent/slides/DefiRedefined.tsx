/** @jsxImportSource theme-ui */
import React, { useMemo } from 'react'
import { Button, Flex, Text } from '@ape.swap/uikit'
import { styles } from './styles'
import { Box, Image } from 'theme-ui'
import { useHomepageStats } from 'state/hooks'
import CountUp from 'react-countup'
import { useTranslation } from 'contexts/Localization'
import { Link, useHistory } from 'react-router-dom'
import useSelectNetwork from 'hooks/useSelectNetwork'
import { grayIcons } from './grayChains'
import { ChainId } from '@ape.swap/sdk'
import { AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS, LIST_VIEW_PRODUCTS } from 'config/constants/chains'

const DefiRedefined = () => {
  const rawStats = useHomepageStats()
  const { t } = useTranslation()
  const { switchNetwork } = useSelectNetwork()
  const history = useHistory()

  const randomImage = useMemo(() => {
    // this function returns a random number between 1 and 10, which is the amount of bill images
    return Math.floor(Math.random() * (10 + 1))
  }, [])

  const handleNetworkSwitch = (chainId: ChainId) => {
    history.push('/bonds')
    switchNetwork(chainId)
  }

  return (
    <Flex sx={styles.slideContainer}>
      <Flex sx={styles.slideContent}>
        <Text sx={styles.slideTitle}>{t('DeFi, Redefined')}</Text>
        <Text sx={styles.slideSubtitle}>
          {t('Join our growing network of')}{' '}
          {rawStats?.bondingPartnerCount && (
            <Text sx={styles.counterText}>
              <CountUp end={rawStats?.bondingPartnerCount} decimals={0} duration={3} separator="," />{' '}
            </Text>
          )}
          {t('communities building project-owned liquidity through ApeSwap Bonds.')}
        </Text>
        <Flex sx={{ alignItems: 'center', marginTop: ['25px', '25px', '0px'] }}>
          <Text sx={styles.availableOn}>{t('BONDS AVAILABLE ON')}</Text>
          {AVAILABLE_CHAINS_ON_LIST_VIEW_PRODUCTS[LIST_VIEW_PRODUCTS.BILLS].map((chainId) => {
            return (
              <Flex
                key={chainId}
                sx={{ marginRight: '10px', cursor: 'pointer' }}
                onClick={() => handleNetworkSwitch(chainId)}
              >
                {grayIcons[chainId]}
              </Flex>
            )
          })}
        </Flex>
        <Link to="/bonds">
          <Flex sx={styles.billImage}>
            <Box
              sx={{ ...styles.image, backgroundImage: `url('/images/homepage/treasury-bills-${randomImage}.jpg')` }}
            />
          </Flex>
        </Link>
        <Flex sx={styles.buttonContainer}>
          <Button
            variant="secondary"
            sx={styles.learnMoreButton}
            onClick={() =>
              window.open(
                'https://apeswap.gitbook.io/apeswap-finance/product-and-features/raise/treasury-bills',
                '_blank',
              )
            }
          >
            {t('Learn more')}
          </Button>
          <Link to="/bonds">
            <Button sx={{ fontSize: ['14px', '14px', '16px'], width: '138px' }}>{t('Buy a bond')}</Button>
          </Link>
        </Flex>
      </Flex>
      <Flex sx={{ width: ['0', '100%'], justifyContent: 'center' }}>
        <Flex sx={{ ...styles.imageWrapper, background: 'lvl1' }} onClick={() => history.push(`/bonds`)}>
          <Image src={`/images/homepage/treasury-bills-${randomImage}.jpg`} sx={styles.image} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default DefiRedefined
