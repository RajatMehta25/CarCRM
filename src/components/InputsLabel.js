import React from 'react'
import styled from 'styled-components'
import { FlexWrapper, StyledText } from './StyledComponents'

const Label = styled.p`
  color: ${props => (props.disabled ? '#9b9b9b' : '#323c47')};
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  font-family: 'Montserrat', sans-serif !important;
`

function InputsLabel(props) {
  const { labelStyle, label, required } = props
  return (
    <FlexWrapper direction="row" alignItems="center" width="auto">
      <Label style={labelStyle && labelStyle}>{label}</Label>
      {required && (
        <StyledText viewPadding="2px" color="red">
          *
        </StyledText>
      )}
    </FlexWrapper>
  )
}

export default InputsLabel
