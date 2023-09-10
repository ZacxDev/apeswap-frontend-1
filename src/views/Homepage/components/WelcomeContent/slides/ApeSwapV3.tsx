/** @jsxImportSource theme-ui */
import React from 'react'
import { styles } from './styles'
import { Button, Flex, Text } from '@ape.swap/uikit'
import { Link } from 'react-router-dom'
import Bnb from './grayChains/bnb'
import Poly from './grayChains/poly'
import { Box, Image } from 'theme-ui'
import { useTranslation } from 'contexts/Localization'

const ApeSwapV3 = () => {
  const { t } = useTranslation()

  return (
    <Flex sx={styles.slideContainer}>
      <Flex sx={styles.slideContent}>
        <Text sx={{ ...styles.slideTitle, fontSize: ['43px', '38px', '64px'] }}>
          {t('Do More With Your Liquidity')}
        </Text>
        <Text sx={styles.slideSubtitle}>
          {t('Leverage ApeSwap’s new V3 capabilities to concentrate your liquidity depth.')}
        </Text>
        <Flex sx={{ alignItems: 'center', marginTop: ['25px', '25px', '0px'] }}>
          <Text sx={styles.availableOn}>{t('AVAILABLE ON')}</Text>
          <Bnb
            sx={{ marginRight: '10px', cursor: 'pointer' }}
            onClick={() => window.open('https://v3.apeswap.finance/add-liquidity?chain=56')}
          />
          <Poly
            sx={{ marginRight: '10px', cursor: 'pointer' }}
            onClick={() => window.open('https://v3.apeswap.finance/add-liquidity?chain=137')}
          />
        </Flex>
        <Link to="/add-liquidity">
          <Flex sx={styles.billImage}>
            <Box sx={{ ...styles.image, backgroundImage: `url('/images/homepage/add-liquidity-0.png')` }} />
          </Flex>
        </Link>
        <Flex sx={styles.buttonContainer}>
          <Button
            variant="secondary"
            sx={{ ...styles.learnMoreButton }}
            onClick={() =>
              window.open(
                'https://apeswap.gitbook.io/apeswap-finance/product-and-features/exchange/liquidity/how-to-add-liquidity-v3',
                '_blank',
              )
            }
          >
            {t('Learn more')}
          </Button>
          <Button
            sx={{ fontSize: ['14px', '14px', '16px'], minWidth: ['140px', '140px'] }}
            onClick={() => window.open('https://v3.apeswap.finance/add-liquidity')}
          >
            {t('Add liquidity')}
          </Button>
        </Flex>
      </Flex>
      <Flex sx={{ width: ['0', '100%'], justifyContent: 'center' }}>
        <Flex
          sx={{ ...styles.imageWrapper, background: 'none' }}
          onClick={() => window.open('https://v3.apeswap.finance/add-liquidity')}
        >
          <Image src={`/images/homepage/add-liquidity-0.png`} sx={styles.image} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ApeSwapV3
