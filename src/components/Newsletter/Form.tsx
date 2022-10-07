/** @jsxImportSource theme-ui */
import React, { useState } from 'react'
import useIsMobile from 'hooks/useIsMobile'
import { Text, Flex, Svg, Input, ChevronRightIcon, useMatchBreakpoints, Button } from '@ape.swap/uikit'
import { useToast } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { styles } from './styles'

const Form: React.FC<{
  status: any
  message: any
  onValidated: any
  isModal?: boolean
}> = ({ status, message, onValidated, isModal }) => {
  const isMobile = useIsMobile()
  const { isMd } = useMatchBreakpoints()
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  const [subscriber, setSubscriber] = useState('')

  const onHandleChange = (evt) => {
    const { value } = evt.target
    setSubscriber(value)
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    subscriber.indexOf('@') > -1 &&
      onValidated({
        EMAIL: subscriber,
      })
    setSubscriber('')
    return status === 'success' && toastSuccess(t('Subscribe Successful'))
  }

  return (
    <Flex
      sx={{
        flexDirection: ['column', (isModal && 'column') || 'row'],
        marginTop: isModal && '25px',
        width: ['100%', '100%', (isModal && '60%') || '100%'],
        padding: [(!isModal && '10px') || '', '', '20px'],
        alignItems: [(!isModal && 'center') || '', '', 'center'],
        justifyContent: [(!isModal && 'center') || '', '', 'center'],
        background: !isModal && 'white2',
      }}
    >
      <Flex sx={{ ...styles.leftForm, width: '100%' }}>
        <Text
          sx={{ ...styles.getLatestText, fontSize: ['16px', '16px', '25px'], lineHeight: ['24px', '24px', '28px'] }}
        >
          Get the latest from {isModal && <br />} ApeSwap {!isModal && (isMobile || isMd) && <br />} right to your{' '}
          {isModal && <br />} inbox.
        </Text>
        {!isModal && (
          <Flex sx={{ alignSelf: 'flex-start', marginTop: (isModal && '10px') || '5px' }}>
            <Text sx={{ ...styles.privacyText }}>We respect your privacy</Text>
            <Svg icon="question" width="10px" />
          </Flex>
        )}
      </Flex>
      {/* <Newsletter isModal /> */}

      <Flex
        className="input-form-container"
        as="form"
        onSubmit={(e) => handleSubmit(e)}
        sx={{
          ...styles.form,
          width: [(isModal && '100%') || '360px', (isModal && '100%') || '360px', (isModal && '100%') || '360px', ''],
          marginTop: ['10px', '', isModal && '20px'],
        }}
      >
        <Flex sx={{ alignItems: 'center' }}>
          <Svg icon="message" />
          <Input
            className="input"
            name="EMAIL"
            onChange={onHandleChange}
            value={subscriber}
            placeholder={(status === 'success' && message) || 'hornyape@domain.com'}
            sx={{
              ...styles.input,
              width: ['190px', '290px'],
              paddingLeft: '10px',
              '@media screen and (min-width: 425px)': {
                width: '230px',
              },
              '@media screen and (max-width: 320px)': {
                paddingLeft: '5px',
                width: '140px',
              },
              '::placeholder': {
                opacity: (status === 'success' && 0.8) || 0.5,
                fontStyle: 'italic',
                fontSize: ['12px', '14px'],
                lineHeight: '14px',
                fontWeight: status === 'success' && 500,
                color: (status === 'success' && 'success') || 'text',
              },
            }}
          />
        </Flex>
        <Button variant="text" className="input-btn" sx={styles.submit} type="submit" formValues={[subscriber]}>
          {status === 'sending' ? '...' : <ChevronRightIcon sx={{ width: '40px' }} />}
        </Button>
      </Flex>
      {isModal && (
        <Flex sx={{ alignSelf: 'flex-start', marginTop: '10px' }}>
          <Text sx={{ ...styles.privacyText }}>We respect your privacy</Text>
          <Svg icon="question" width="10px" />
        </Flex>
      )}
    </Flex>
  )
}

export default Form
