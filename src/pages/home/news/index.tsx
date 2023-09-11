import React from 'react';
import {useNavigation} from '@react-navigation/native';

import * as Styled from './styles';
import {Title} from '../../../components/title';

export default function News() {
  const navigation = useNavigation();

  return (
    <Styled.Container>
      <Styled.Touch>
        <Title text=" Profile" />
      </Styled.Touch>
    </Styled.Container>
  );
}
