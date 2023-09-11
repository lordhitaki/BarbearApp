import React from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import * as Styled from './styles';
import {Title} from '../../../components/title';

export default function Profile() {
  const navigation = useNavigation();

  function handleSignOut() {
    auth().signOut();
  }

  return (
    <Styled.Container>
      <Styled.Touch onPress={() => handleSignOut()}>
        <Title text=" Deslogar" />
      </Styled.Touch>
    </Styled.Container>
  );
}
