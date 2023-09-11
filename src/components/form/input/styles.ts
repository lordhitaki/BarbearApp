import styled, {css} from 'styled-components/native';
import {InputProps} from '.';

export const ContainerInputCss = css`
  width: 85%;
`;

export const Container = styled.View<Pick<InputProps, 'disabled' | 'size'>>`
  ${ContainerInputCss}
  width: ${({size}) => size || '85%'};
  opacity: ${({disabled}) => (disabled ? '0.4' : '1')};
`;

export const LinkButton = styled.TouchableOpacity`
  position: absolute;
  top: 33%;
  right: 4%;
  z-index: 1;
`;

export const InputCss = css`
  border-radius: 20px;
  /* border-width: 1.5px; */
  border-color: ${({theme}) => theme.colors.border};
  background-color: ${({theme, background}) =>
    background || theme.colors.white};
  padding: 10px;
  font-size: 16px;
  height: 45px;
  color: ${({color}) => color || 'black'};
`;

export const StyledTextInput = styled.TextInput`
  ${InputCss}
`;

export const Box = styled.TouchableOpacity``;
