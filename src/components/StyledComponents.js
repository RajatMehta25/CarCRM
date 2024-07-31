import styled from "styled-components";
import { Link } from "react-router-dom";
import Colors from "./Colors";
import { Form } from "formik";

const FlexWrapper = styled.div(
  (props) => `
  width: ${props.width || "100%"};
  height: ${props.height || "auto"};
  min-width: ${props.minWidth || "auto"};
  display: flex;
  flex-direction: ${props.direction || "column"};
  justify-content: ${props.justifyContent || "flex-start"};
  align-items: ${props.alignItems || "flex-start"};
  margin: ${props.viewMargin || "0px"};
  padding: ${props.viewPadding || "0px"};
  flex-basis: ${props.flexBasis || "auto"};
  border: ${props.border || "none"};
  background: ${props.background || "transparent"};
  flex-wrap: ${props.flexWrap || "nowrap"};
  border-radius: ${props.borderRadius || "0"};
  position: ${props.position || "static"};
  box-shadow: ${props.boxShadow || "none"};
  cursor: ${props.cursor || "default"};
  overflow: ${props.overflow || "initial"};
  background-size: cover;
`
);

const StyledImage = styled.img(
  (props) => `
  width: ${props.width || "auto"};
  max-width: ${props.maxWidth || "initial"};
  height: ${props.height || "auto"};
  object-fit: ${props.objectFit || "cover"};
`
);

const StyledText = styled.p(
  (props) => `
  width: ${props.width || "auto"};
  font-size: ${props.fontSize || "16px"};
  color: ${props.color || "#000"};
  line-height: ${props.lineHeight || "normal"};
  font-weight: ${props.fontWeight || "normal"};
  background-color: ${props.background || "transparent"};
  text-align: ${props.textAlign || "left"};
  letter-spacing: ${props.letterSpacing || "0.6px"};
  padding: ${props.viewPadding || "0px"};
  text-decoration-line: ${props.textDecorationLine || "none"};
  font-family: inherit, sans-serif;
  text-transform: ${props.textTransform || "initial"};
`
);
const StyledLink = styled(Link)(
  (props) => `
  font-size: 14px;
  padding: ${props.viewPadding || "0"};
  color: ${props.color || Colors.primary};
  transition: 0.2s ease-in;
  font-weight: ${props.fontWeight || 500};
  :hover {
    color: ${props.hoverColor || Colors.primary};
  }
`
);
const FormikForm = styled(Form)`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const FlexViewCenter = styled(FlexWrapper)`
  height: 100%;
  align-items: center;
  justify-content: center;
`;
export {
  StyledText,
  FlexWrapper,
  StyledImage,
  StyledLink,
  FormikForm,
  FlexViewCenter,
};
