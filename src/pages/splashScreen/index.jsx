import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

import * as Styled from './styles';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async loggedInUser => {
      const registrationSuccess = await AsyncStorage.getItem(
        'registrationSuccess',
      );
      if (registrationSuccess) {
        navigation.navigate('RegisterSuccess');
        await AsyncStorage.removeItem('registrationSuccess');
      } else if (loggedInUser) {
        await AsyncStorage.setItem('user', JSON.stringify(loggedInUser?.uid));
        await AsyncStorage.setItem('infos', JSON.stringify(loggedInUser));
        navigation.navigate('CompleteRegistration');
      } else {
        navigation.navigate('Login');
      }
    });

    return subscriber;
  }, []);

  return (
    <Styled.Container>
      <Styled.Img source={require('../../../assets/img/logo.png')} />
      <LottieView
        source={require('../../../assets/animation/lustre.json')}
        autoPlay
        loop
        style={{width: 400, height: 400}}
      />
    </Styled.Container>
  );
}
