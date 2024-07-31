import React from 'react'
import { FlexViewCenter, StyledImage, FlexWrapper } from './StyledComponents'
import Icon from './Icon'

const disabled = ''
const active = `transition: 0.6s linear;

:hover {
  img {
    display: none;
  }
  > div {
    display: flex;
  }
}`

function TableImage({ src, uploading, disableEdit, ...props }) {
  return (
    <FlexViewCenter css={disableEdit ? disabled : active}>
      <StyledImage src={src} maxWidth="100px" height="50px"></StyledImage>
      {disableEdit ? null : (
        <FlexWrapper
          width="auto"
          alignItems="center"
          justifyContent="center"
          position="relative"
          css={`
            display: none;
            cursor: pointer;
            > * {
              cursor: pointer;
            }
            input {
              opacity: 0;
              max-width: 100px;
              height: 50px;
              z-index: 999;
            }
            svg {
              position: absolute;
            }
          `}>
          <input type="file" value="" accept="image/*" multiple={false} {...props} />
          <Icon icon="uploadImage" />
        </FlexWrapper>
      )}
    </FlexViewCenter>
  )
}

export default TableImage
