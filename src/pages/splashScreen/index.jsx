import React from 'react';
import {useNavigation} from '@react-navigation/native';

import * as Styled from './styles';
import {ActivityIndicator} from 'react-native';

export default function SplashScreen() {
  const navigation = useNavigation();

  return (
    <Styled.Container>
      <Styled.Img source={require('../../../assets/img/logo.png')} />
      <ActivityIndicator color={'black'} size={100} />
    </Styled.Container>
  );
}
