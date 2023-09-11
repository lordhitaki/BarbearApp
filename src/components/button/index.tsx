import React = require('react');
import {ActivityIndicator, TouchableOpacityProps} from 'react-native';
import {useTheme} from 'styled-components';

import {Title, TitleProps} from '../title';
import Load from '../load';

import * as Styled from './styles';

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
    | 'white'
    | 'grayDark'
    | 'pinkLight'
    | 'title'
    | 'pink'
    | 'primaryLight'
    | 'transparent';
  disabled?: boolean;
  border?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'dark'
    | 'white'
    | 'grayDark'
    | 'pinkLight'
    | 'title'
    | 'pink'
    | 'primaryLight'
    | 'transparent';
}

export default function Button({
  text,
  load,
  disabled,
  color,
  border,
  ...rest
}: ButtonProps) {
  return (
    <Styled.Button {...rest} color={color} disabled={disabled} border={border}>
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
