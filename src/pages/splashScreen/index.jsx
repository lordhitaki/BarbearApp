import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Styled from './styles';
import LottieView from 'lottie-react-native';

export default function SplashScreen() {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async loggedInUser => {
      setUser(loggedInUser);
      const registrationSuccess = await AsyncStorage.getItem(
        'registrationSuccess',
      );
      if (registrationSuccess) {
        navigation.navigate('RegisterSuccess');
        await AsyncStorage.removeItem('registrationSuccess');
      } else if (loggedInUser) {
        await AsyncStorage.setItem('user', JSON.stringify(loggedInUser?.uid));
        navigation.navigate('Home');
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
