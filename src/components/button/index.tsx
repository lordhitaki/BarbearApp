import React = require('react');
import {ActivityIndicator, TouchableOpacityProps} from 'react-native';
import {useTheme} from 'styled-components';

import {Title, TitleProps} from '../title';
import Load from '../load';

import * as Styled from './styles';
import Google from '../../../assets/img/google';
import Face from '../../../assets/img/face';

export interface ButtonProps
  extends TouchableOpacityProps,
    Pick<TitleProps, 'color'> {
  text: string;
  load?: boolean;
  link?: boolean;
  loading?: boolean;
  size?: number;
  colorButton?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'dark'
    | 'dark2'
    | 'white'
    | 'grayDark'
    | 'pinkLight'
    | 'title'
    | 'pink'
    | 'primaryLight'
    | 'transparent'
    | 'tertiary';

  disabled?: boolean;
  border?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'dark'
    | 'dark2'
    | 'white'
    | 'grayDark'
    | 'pinkLight'
    | 'title'
    | 'pink'
    | 'primaryLight'
    | 'transparent'
    | 'tertiary';
  icon?: 'google' | 'facebook';
}

export default function Button({
  text,
  load,
  disabled,
  color,
  border,
  icon,
  ...rest
}: ButtonProps) {
  return (
    <Styled.Button {...rest} color={color} disabled={disabled} border={border}>
      {icon === 'google' && (
        <Styled.BoxIcon>
          <Google />
        </Styled.BoxIcon>
      )}
      {icon === 'facebook' && (
        <Styled.BoxIcon1>
          <Face />
        </Styled.BoxIcon1>
      )}
      <Load load={load} color={color || 'white'}>
        <Title
          text={text}
          color={color || 'white'}
          family="bold"
          size="xsmall"
        />
      </Load>
    </Styled.Button>
  );
}
