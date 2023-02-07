import { ThemeUIStyleObject } from 'theme-ui'

export const styles: Record<
  | 'farmInfo'
  | 'cardContent'
  | 'actionContainer'
  | 'expandedContent'
  | 'styledBtn'
  | 'smallBtn'
  | 'depositContainer'
  | 'columnView'
  | 'harvestAllBtn'
  | 'stakeActions'
  | 'onlyDesktop'
  | 'onlyMobile',
  ThemeUIStyleObject
> = {
  farmInfo: {
    width: '100%',
    justifyContent: 'space-between',
    '@media screen and (min-width: 852px)': {
      maxWidth: '140px',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
  },
  cardContent: {
    flexDirection: 'column',
    width: '100%',
    justifyContent: 'space-between',
    '@media screen and (min-width: 852px)': {
      flexDirection: 'row',
    },
  },
  actionContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    mt: '10px',
    '@media screen and (min-width: 852px)': {
      mt: '0',
      flexDirection: 'row-reverse',
      justifyContent: 'space-around',
    },
  },
  expandedContent: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '0 10px',
    justifyContent: 'space-between',
    '@media screen and (min-width: 852px)': {
      flexWrap: 'nowrap',
    },
  },
  styledBtn: {
    fontSize: '16px',
    padding: '10px',
    width: '140px',
    minWidth: '100px',
    height: '44px',
    '@media screen and (max-width: 852px)': {
      minWidth: '130px',
      width: '130px',
    },
    '&:disabled': {
      background: 'white4',
    },
  },
  smallBtn: {
    maxWidth: '60px',
    width: '100%',
    minWidth: '44px',
    height: '44px',
    '&:disabled': {
      background: 'white4',
    },
  },
  depositContainer: {
    width: '100%',
    maxWidth: '130px',
    justifyContent: 'center',
    alignItems: 'center',
    '@media screen and (min-width: 852px)': {
      maxWidth: '140px',
    },
  },
  columnView: {
    maxWidth: '50%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  harvestAllBtn: {
    height: '36px',
    lineHeight: '18px',
    justifyContent: 'center',
    width: '100%',
    '@media screen and (min-width: 852px)': {
      width: '150px',
    },
  },
  stakeActions: {
    maxWidth: ['', '', '94px'],
    alignItems: 'center',
    width: '100%',
  },
  onlyDesktop: {
    justifyContent: 'space-around',
    display: ['none', 'none', 'flex'],
  },
  onlyMobile: {
    flexDirection: 'column',
    display: ['flex', 'flex', 'none'],
  },
}
