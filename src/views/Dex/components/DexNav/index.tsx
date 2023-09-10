/** @jsxImportSource theme-ui */
import { Link, useHistory } from 'react-router-dom'
import { CogIcon, Flex, Text, useModal, Svg } from '@ape.swap/uikit'
import { ChainId } from '@ape.swap/sdk'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import SettingsModal from 'components/Menu/GlobalSettings/SettingsModal'
import { styles } from './styles'
import SquidBridge from 'components/SquidBridge/SquidBridge'
import { Link as ThemeLink, Switch } from 'theme-ui'

interface DexNavProps {
  zapSettings?: boolean
}

const DexNav: React.FC<DexNavProps> = ({ zapSettings }) => {
  const history = useHistory()
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const { pathname } = history.location
  const BRIDGE_SUPPORTED_CHAINS = [ChainId.BSC, ChainId.ARBITRUM, ChainId.MATIC, ChainId.MAINNET]

  const onOrders = pathname?.includes('orders')

  const onLiquidity =
    pathname?.includes('add-liquidity') ||
    pathname?.includes('liquidity') ||
    pathname?.includes('remove') ||
    pathname?.includes('find') ||
    pathname?.includes('zap') ||
    pathname?.includes('migrate') ||
    pathname?.includes('unstake')

  const [onPresentSettingsModal] = useModal(<SettingsModal zapSettings={zapSettings} />)
  const [onBridgeModal] = useModal(<SquidBridge />)

  const v3Link = `${process.env.REACT_APP_APESWAP_URL}${pathname}`
  const showV3Liquidity = onLiquidity && [ChainId.BSC, ChainId.MATIC].includes(chainId)

  return (
    <Flex sx={styles.dexNavContainer}>
      <Flex sx={styles.navLinkContainer}>
        <Text
          size="14px"
          sx={{
            ...styles.navLink,
            color: !pathname?.includes('swap') && 'textDisabled',
            mr: '30px',
          }}
          as={Link}
          to="/swap"
          id="swap-link"
          className="swap"
        >
          {t('Swap')}
        </Text>
        {onOrders && (
          <Text
            size="14px"
            sx={{
              ...styles.navLink,
              color: !pathname?.includes('orders') && 'textDisabled',
              mr: '30px',
            }}
            as={Link}
            to="/limit-orders"
            id="orders-link"
            className="orders"
          >
            {t('Orders')}
          </Text>
        )}
        <Text
          size="14px"
          sx={{ ...styles.navLink, color: !onLiquidity && 'textDisabled' }}
          as={Link}
          to={chainId === ChainId.MAINNET ? '/add-liquidity' : '/zap'}
          id="liquidity-link"
          className="liquidity"
        >
          {t('Liquidity')}
        </Text>
      </Flex>
      <Flex sx={styles.navIconContainer}>
        {!onOrders && chainId !== ChainId.TLOS ? (
          onLiquidity ? (
            showV3Liquidity && (
              <Flex
                as={ThemeLink}
                href={v3Link}
                rel="noopener noreferrer"
                // onClick={() => push(pathname.includes('/v2') ? '/add-liquidity' : '/add-liquidity/v2')}
                sx={{
                  position: 'relative',
                  mr: ['6px', '6px', '10px'],
                  height: 'fit-content',
                  minWidth: 'fit-content',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 2,
                }}
              >
                <Text
                  size="13px"
                  weight={700}
                  color="primaryBright"
                  sx={{ position: 'absolute', zIndex: 1, right: 3, mt: '2px' }}
                >
                  V2
                </Text>
                <Switch
                  onClick={() => window.location.replace(v3Link)}
                  // onChange={() => push(pathname.includes('/v2') ? '/add-liquidity' : '/add-liquidity/v2')}
                  checked={false}
                  sx={{
                    mr: '0px',
                    width: '50px',
                    borderRadius: '10px',
                    backgroundColor: 'yellow',
                    '& > div': {
                      transform: 'translateX(0%)',
                    },
                    'input:checked ~ &': {
                      background: 'linear-gradient(90deg, rgba(161, 101, 82, 1) 0%, rgba(255, 179, 0, 1)) 100%',
                      '> div': {
                        transform: 'translateX(28px)',
                      },
                    },
                  }}
                />
              </Flex>
            )
          ) : (
            <Flex
              as={ThemeLink}
              href={v3Link}
              rel="noopener noreferrer"
              // onClick={() => push(pathname.includes('/v2') ? '/add-liquidity' : '/add-liquidity/v2')}
              sx={{
                position: 'relative',
                mr: ['6px', '6px', '10px'],
                height: 'fit-content',
                minWidth: 'fit-content',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 2,
              }}
            >
              <Text
                size="13px"
                weight={700}
                color="primaryBright"
                sx={{ position: 'absolute', zIndex: 1, right: 3, mt: '2px' }}
              >
                V2
              </Text>
              <Switch
                onClick={() => window.location.replace(v3Link)}
                // onChange={() => push(pathname.includes('/v2') ? '/add-liquidity' : '/add-liquidity/v2')}
                checked={false}
                sx={{
                  mr: '0px',
                  width: '50px',
                  borderRadius: '10px',
                  backgroundColor: 'yellow',
                  '& > div': {
                    transform: 'translateX(0%)',
                  },
                  'input:checked ~ &': {
                    background: 'linear-gradient(90deg, rgba(161, 101, 82, 1) 0%, rgba(255, 179, 0, 1)) 100%',
                    '> div': {
                      transform: 'translateX(28px)',
                    },
                  },
                }}
              />
            </Flex>
          )
        ) : (
          <></>
        )}
        <Flex sx={styles.iconCover} onClick={() => history.push({ search: `?modal=tutorial` })}>
          <Svg icon="quiz" />
        </Flex>
        <Flex
          sx={styles.iconCover}
          onClick={
            BRIDGE_SUPPORTED_CHAINS.includes(chainId)
              ? onBridgeModal
              : () => window.open('https://app.multichain.org/#/router', '_blank')
          }
        >
          <Svg icon="bridge" />
        </Flex>
        <CogIcon sx={{ cursor: 'pointer' }} width={24} onClick={onPresentSettingsModal} />
      </Flex>
    </Flex>
  )
}

export default React.memo(DexNav)
