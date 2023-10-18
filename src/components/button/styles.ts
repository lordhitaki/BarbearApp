import styled from 'styled-components/native';
import {ButtonProps} from './index';

export const Button = styled.TouchableOpacity<ButtonProps>`
  width: ${({theme, size}) => size || 85}%;
  margin-top: 10px;
  align-items: center;
  justify-content: center;
  height: 55px;
  background-color: ${({theme, colorButton}) =>
    theme.colors[colorButton || 'primary']};
  border: 1.5px ${({theme, border}) => theme.colors[border || 'error']};
  opacity: ${({disabled}) => (disabled ? '0.7' : '1')};
  border-radius: 12px;
  flex-direction: row;

  ${({link, theme}) =>
    link &&
    `
      height: 30px;
      border: none;
      background-color: transparent;
  `}
`;

export const Text = styled.Text`
  color: ${({theme}) => theme.colors.primary};
  font-size: 16px;
`;

export const BoxIcon = styled.View`
  position: absolute;
  left: 20px;
`;
export const BoxIcon1 = styled.View`
  position: absolute;
  left: 20px;
`;
