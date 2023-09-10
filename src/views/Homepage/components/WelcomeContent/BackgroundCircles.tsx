/** @jsxImportSource theme-ui */
import React from 'react'
import { Flex } from '@ape.swap/uikit'

const BackgroundCircles = () => {
  return (
    <Flex
      sx={{
        width: '1512px',
        height: '600px',
        position: 'relative',
        margin: '0 auto',
        opacity: '.9',
      }}
    >
      <Flex
        sx={{
          position: 'absolute',
          width: '1512px',
          height: '600px',
          overflow: 'hidden',
        }}
      >
        <Flex
          //outerCircle
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            width: ['600px', '900px', '1200px'],
            height: ['600px', '900px', '1200px'],
            top: ['100px', '-100px', '-200px'],
            left: ['-100px', '300px', '500px'],
            background: 'var(--theme-ui-colors-home-c3)',
            boxShadow: 'none',
          }}
        />
        <Flex
          //middleCircle
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            width: ['450px', '675px', '900px'],
            height: ['450px', '675px', '900px'],
            top: ['175px', '12.5px', '-50px'],
            background: 'var(--theme-ui-colors-home-c2)',
            left: ['-25px', '425px', '650px'],
            boxShadow: 'var(--theme-ui-colors-homeCircles-cShadow)',
          }}
        />
        <Flex
          //innerCircle
          sx={{
            position: 'absolute',
            borderRadius: '50%',
            width: ['300px', '450px', '600px'],
            height: ['300px', '450px', '600px'],
            left: ['50px', '550px', '800px'],
            top: ['250px', '125px', '100px'],
            background: 'var(--theme-ui-colors-home-c1)',
            boxShadow: 'var(--theme-ui-colors-home-cShadow)',
          }}
        />
        <Flex
          sx={{
            position: 'absolute',
            bottom: ['-201px', '-30px', '-201px'],
            width: '100%',
            height: '200px',
            boxShadow: 'var(--theme-ui-colors-home-hideCircles)',
            zIndex: 5,
          }}
        />
        <Flex
          sx={{
            position: 'absolute',
            width: '0px',
            height: '1130px',
            left: '1512px',
            top: '0px',
            boxShadow: 'var(--theme-ui-colors-home-hideCircles)',
            transform: 'rotate(-180deg)',
          }}
        />
      </Flex>
    </Flex>
  )
}

export default BackgroundCircles
