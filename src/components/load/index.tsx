import React from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';

import { TitleProps } from '../title';

import * as Styled from './styled';

export interface LoadProps extends Pick<TitleProps, 'color'> {
  load?: boolean;
  size?: number | 'small' | 'large' | undefined;
  children?: React.ReactNode;
  marginTop?:
    | 'nano'
    | 'xnano'
    | 'xxnano'
    | 'small'
    | 'xsmall'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'xxlarge'
    | 'huge';
  marginBottom?:
    | 'nano'
    | 'xnano'
    | 'xxnano'
    | 'small'
    | 'xsmall'
    | 'medium'
    | 'large'
    | 'xlarge'
    | 'xxlarge'
    | 'huge';
}

export default function Load({ load, color, size, children, ...rest }: LoadProps) {
  const theme = useTheme();

  return (
    <>
      {load ? (
        <Styled.Container {...rest}>
          <ActivityIndicator color={theme.colors[color || 'primary']} size={size} />
        </Styled.Container>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
