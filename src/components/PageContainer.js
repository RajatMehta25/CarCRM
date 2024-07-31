import React from 'react'
import { withTheme } from 'styled-components'
import { FlexWrapper } from './StyledComponents'

function PageContainer(props) {
  const { children, padding } = props
  return (
    <FlexWrapper
      height={'calc(100vh - 50px)'}
      overflow="auto"
      viewPadding={padding || '20px'}
      className="page"
      {...props}>
      {children}
    </FlexWrapper>
  )
}

export default withTheme(PageContainer)
