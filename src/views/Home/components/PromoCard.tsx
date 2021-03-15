import React from 'react'
import styled from 'styled-components'
import { Card, CardBody, Heading, Image, Text } from '@apeswapfinance/uikit'
import useI18n from 'hooks/useI18n'
import { NavLink } from 'react-router-dom'

const StyledPromoCard = styled(Card)`
  text-align: center;
`
const StyledLink = styled.a`
  font-weight: 500;
  color: #ffb300;
  display: block;
`

const StyledNavLink = styled(NavLink)`
  font-weight: 500;
  color: #ffb300;
  display: block;
`
const StyledImage = styled(Image)`
  display: inline-block;
`

const PromoCard = () => {
  const TranslateString = useI18n()
  return (
    <StyledPromoCard>
      <NavLink to="/iao">
        <CardBody>
          <Heading size="lg" mb="24px">
            🐵 {TranslateString(999, 'Initial Ape Offering')} 🐵
          </Heading>
          <>
            <Text color="textSubtle">
              We are taking monkeys to the moon, with our first IAO{' '}
              <a href="https://twitter.com/astronauttoken" target="blank">
                @astronauttoken
              </a>{' '}
            </Text>
            <Text color="textSubtle">🚀 Launch will take place on March 15th 🚀</Text>
            <Text color="textSubtle">
              <StyledNavLink to="/iao"> Check it out!</StyledNavLink>
            </Text>
          </>
        </CardBody>
      </NavLink>
    </StyledPromoCard>
  )
}

export default PromoCard