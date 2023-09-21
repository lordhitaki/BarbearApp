import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useIsFocused} from '@react-navigation/native';

import TabRoute from '../../routes/tabBar';

import * as Styled from './styles';

export default function Home() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      const checkRegistrationSuccess = async () => {
        const registrationSuccess = await AsyncStorage.getItem(
          'registrationSuccess',
        );

        if (registrationSuccess) {
          navigation.navigate('CompleteRegistration');
        } else {
        }
      };

      checkRegistrationSuccess();
    }
  }, [isFocused, navigation]);

  return (
    <Styled.Container>
      <TabRoute />
    </Styled.Container>
  );
}
