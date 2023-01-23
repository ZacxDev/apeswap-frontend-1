/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex, Svg, Text, TooltipBubble } from '@ape.swap/uikit'
import { MigrateProvider } from './provider'
// import { usePollFarms, useSetFarms } from 'state/farms/hooks'
// import { usePollVaultsData, usePollVaultUserData, useSetVaults } from 'state/vaults/hooks'
import MigrateStart from './MigrateStart'
import Banner from 'components/Banner'
import MigrateTimer from './components/MigrateTimer'
import { AboutMigrating } from './components/AboutMigrating'
import { useTranslation } from 'contexts/Localization'
import {
  useMergedV1Products,
  useMergedV2Products,
  useMigrateStatus,
  useMonitorActiveIndex,
  useSetInitialMigrateStatus,
  useSetMigrationLoading,
} from 'state/masterApeMigration/hooks'
// import { useFarmsV2, usePollFarmsV2, useSetFarmsV2 } from 'state/farmsV2/hooks'

const MigrateMasterApeV2: React.FC = () => {
  // Fetch farms to filter lps on steps
  // TODO: Once data pulling is removed from the app we can add these back
  // useSetFarms()
  // useSetFarmsV2()
  // useSetVaults()
  // usePollVaultsData()
  // usePollVaultUserData()
  // usePollFarms()
  // usePollFarmsV2()
  useSetInitialMigrateStatus()
  useSetMigrationLoading()
  useMonitorActiveIndex()
  useMergedV1Products()
  useMergedV2Products()
  useMigrateStatus()
  const { t } = useTranslation()
  return (
    <Flex
      sx={{
        alignItems: 'center',
        height: 'fit-content',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <Flex sx={{ flexDirection: 'column', maxWidth: '1200px', width: '100%', padding: '0px 10px' }}>
        <Flex sx={{ position: 'relative' }}>
          <Flex
            sx={{
              position: 'absolute',
              right: '8.5%',
              bottom: '47.5%',
              zIndex: 10,
              flexDirection: 'column',
              flexWrap: 'no-wrap',
              alignItems: 'flex-start',
            }}
          >
            <MigrateTimer />
          </Flex>
          <Banner banner="migrate" link="?modal=tutorial" title="The Migration" margin="30px 0px 20px 0px" />
        </Flex>
        <Flex sx={{ margin: '.5vw 0px' }} />
        <Flex sx={{ alignItems: 'center', mb: '10px' }}>
          <Text mr="5px"> {t('Migration Progress')}</Text>
          <TooltipBubble
            placement="topLeft"
            body={t(
              'Follow the steps to migrate your tokens. Click on a step to navigate. Completed steps are marked in green.',
            )}
            transformTip="translate(-5%, 0%)"
            width="200px"
          >
            <Svg icon="question" width="15px" />
          </TooltipBubble>
        </Flex>
        <MigrateProvider>
          <MigrateStart />
        </MigrateProvider>
        <AboutMigrating />
      </Flex>
    </Flex>
  )
}

export default MigrateMasterApeV2
