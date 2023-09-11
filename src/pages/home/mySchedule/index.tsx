import React from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import * as Styled from './styles';
import {Title} from '../../../components/title';

export default function MySchedule() {
  const navigation = useNavigation();

  return (
    <Styled.Container>
      <Styled.Touch>
        <Title text=" MySchedule" />
      </Styled.Touch>
    </Styled.Container>
  );
}
