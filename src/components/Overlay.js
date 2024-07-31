import React from 'react'
import styled, { keyframes, withTheme } from 'styled-components'
import { FlexWrapper } from './StyledComponents'

const spin = keyframes`
0% { transform: rotate(0deg) }
100% {transform: rotate(360deg) }
`
const Circle = styled.div`
  border: 3px solid ${props => props.theme.primary};
  border-top: 3px solid #fff;
  border-radius: 50%;
  margin: auto;
  width: 60px;
  height: 60px;
  animation: ${spin} 0.6s linear infinite;
  transition: 0.2s;
`
function Overlay(props) {
  return (
    <FlexWrapper
      css={`
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        cursor: pointer;
      `}>
      <Circle />
    </FlexWrapper>
  )
}

export default withTheme(Overlay)
