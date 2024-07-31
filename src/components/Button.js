import React from "react";
import styled, { css, withTheme } from "styled-components";

const ButtonWrapper = styled.button(
  (props) => `

  padding: 0 30px;
  width: ${props.width || "auto"};
  height: 40px;
  font-size: 14px;
  font-weight: 600;
  color: ${props.labelColor || "#fff"};
  background-color: ${props.backgroundColor || props.theme.primary};
  background: ${props.bgColor || props.bgColor};
  border: none;
  border-radius: ${props.borderRadius || "4px"};
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.02, 0.01, 0.47, 1);
  &:focus {
    box-shadow: 0 0 0 2px #fff, 0 0 0 3px ${
      props.bgColor ? props.bgColor : props.theme.primary
    };
    outline: none;
  }
  
  ${
    props.design === "bordered"
      ? `
  background: transparent;
  border: 1px solid ${props.backgroundColor || props.theme.primary};
  color: ${props.backgroundColor || props.theme.primary};
  `
      : null
  };

  ${props.disabled &&
    `
      background-color: #a0b7bf !important;
      border: none;
      color: #fff;
      cursor: not-allowed;
    `};
`
);
const spin = css`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;
const Circle = styled.div`
  border: 3px solid white;
  border-top: 3px solid white;
  border-radius: 50%;
  margin: auto;
  width: 20px;
  height: 20px;
  animation: ${spin} 2s linear infinite;
`;

const Button = ({
  width,
  social,
  labelColor,
  backgroundColor,
  label,
  isLoading,
  borderRadius,
  bgColor,
  disabled,
  padding,
  fontSize,
  design,
  ...props
}) => {
  return (
    <ButtonWrapper
      backgroundColor={backgroundColor}
      labelColor={labelColor}
      borderRadius={borderRadius}
      bgColor={bgColor}
      width={width}
      disabled={disabled}
      fontSize={fontSize}
      design={design}
      {...props}
    >
      {social ? (
        <React.Fragment>{label}</React.Fragment>
      ) : isLoading ? (
        <Circle />
      ) : (
        label
      )}
    </ButtonWrapper>
  );
};

export default withTheme(Button);
