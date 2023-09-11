import React from 'react';
import {TextInputProps} from 'react-native';
import {TextInputMask} from 'react-native-masked-text';

import InputErrors from '../input-error';
import {Title} from '../../title';

import * as Styled from './styles';

export interface InputProps extends TextInputProps {
  label?: string;
  errorMsg?: string;
  mask?: string;
  disabled?: boolean;
  size?: string;
  ComponentRight?: React.ReactNode;
  background?: string;
  color?: string;
}

export default function Input({
  label,
  placeholder,
  mask,
  errorMsg,
  disabled = false,
  ComponentRight,
  size,
  background,
  color,
  ...rest
}: InputProps) {
  return (
    <Styled.Container size={size}>
      {ComponentRight}
      <Title
        text={label || ''}
        color="primary"
        family="bold"
        size="medium"
        marginLeft="xxnano"
      />
      {mask ? (
        <Styled.StyledTextInput
          as={TextInputMask}
          type="custom"
          options={{mask}}
          placeholder={placeholder}
          editable={!disabled}
          {...rest}
        />
      ) : (
        <Styled.StyledTextInput
          placeholder={placeholder}
          background={background}
          color={color}
          {...rest}
        />
      )}
      <InputErrors error={errorMsg} />
    </Styled.Container>
  );
}
