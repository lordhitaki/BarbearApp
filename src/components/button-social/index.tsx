import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  TouchableOpacityProps,
} from 'react-native';

import * as Styled from './styles';

export interface ButtonSocialProps extends TouchableOpacityProps {
  children: React.ReactNode;
  load?: boolean;
  onCustomRespLogin: () => void;
}

export default function ButtonSocial({
  onPress,
  load,
  children,
  ...rest
}: ButtonSocialProps) {
  return (
    <Styled.Button
      {...rest}
      onPress={(e: GestureResponderEvent) => {
        if (onPress && !load) {
          onPress(e);
        }
      }}>
      {load ? <ActivityIndicator color="#62489D" /> : children}
    </Styled.Button>
  );
}
