import React, {useEffect, useState} from 'react';
import LottieView from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';

import {Title} from '../../../../components/title';

import * as Styled from './styles';

export default function CompleteRegistration() {
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const [admin, setAdmin] = useState(undefined);
  const [phoneCheck, setPhoneCheck] = useState();

  useEffect(() => {
    fetchUserInfo();
  }, [user]);

  const fetchUserInfo = async () => {
    const subscriber = auth().onAuthStateChanged(async loggedInUser => {
      setUser(loggedInUser);
    });
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const sanitizedUid = storedUser?.replace(/"/g, '');
      if (storedUser) {
        const infoSnapshot = await firestore()
          .collection('infos')
          .where('uid', '==', sanitizedUid)
          .get();

        if (!infoSnapshot.empty) {
          fetchUserInfo();
          const infoData = infoSnapshot.docs[0]._data;
          setAdmin(infoData.admin);
          if (infoData.phone !== undefined) {
            setPhoneCheck(infoData.phone);
          } else {
            setPhoneCheck(null);
          }
        } else {
          setAdmin(false);
          RegisterInfos();
        }
      }
    } catch (error) {
      console.error('Erro ao consultar o Firestore:', error);
    }
    return subscriber;
  };

  const RegisterInfos = async () => {
    const InfosRegister = {
      name: user?.displayName,
      phone: phoneCheck !== undefined ? phoneCheck : user?.phoneNumber,
      admin: false,
      uid: user?.uid,
      photoUrl: user?.photoURL,
    };
    if (admin === false || admin === undefined) {
      const infosCollection = firestore().collection('infos');
      const querySnapshot = await infosCollection
        .where('uid', '==', user.uid)
        .get();
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await docRef.update(InfosRegister);
      } else {
        await infosCollection.add(InfosRegister);
      }
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Home'}],
        }),
      );
    }
  };

  useEffect(() => {
    if (phoneCheck !== undefined) {
      RegisterInfos();
    }
  }, [phoneCheck]);

  return (
    <Styled.Container>
      <Title
        text="Coletando mais dados aguarde..."
        size="xxlarge"
        align="center"
        family="bold"
        marginTop="medium"
      />
      <LottieView
        source={require('../../../../../assets/animation/lustre.json')}
        autoPlay
        loop
        style={{width: 400, height: 400}}
      />
    </Styled.Container>
  );
}
