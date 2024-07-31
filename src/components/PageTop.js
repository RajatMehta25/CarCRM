import React from 'react'
import { FlexWrapper, StyledText } from './StyledComponents'

function PageTop({ title, component, ...props }) {
  return (
    <FlexWrapper direction="row" alignItems="center" justifyContent="space-between" viewPadding="0 0 0 0" {...props}>
      <StyledText fontSize="20px" fontWeight="600" margin="0">
        {title}
      </StyledText>
      {component && component}
    </FlexWrapper>
  )
}

export default PageTop
