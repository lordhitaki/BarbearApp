import {Controller} from 'react-hook-form';

import Input, {InputProps} from '.';
import React from 'react';

interface InputFormProps extends InputProps {
  control: any;
  name: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'number-pad';
  disabled?: boolean;
  background?: string;
  color?: string;
}

export default function InputForm({
  label,
  placeholder,
  name,
  errorMsg,
  control,
  keyboardType,
  disabled,
  ...rest
}: InputFormProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({field: {onChange, onBlur, value}, fieldState}) => (
        <Input
          onBlur={onBlur}
          onChangeText={onChange}
          value={value}
          label={label}
          placeholder={placeholder}
          keyboardType={keyboardType}
          errorMsg={
            errorMsg || (fieldState?.error && fieldState?.error?.message)
          }
          disabled={disabled}
          {...rest}
        />
      )}
    />
  );
}
