import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

import {Title} from '../../../../components/title';
import InputForm from '../../../../components/form/input/form';
import Button from '../../../../components/button';

import * as Styled from './styles';

export default function CompleteRegistration() {
  const navigation = useNavigation();
  const [uid, setUid] = useState();

  const signUpSchema = yup.object({
    name: yup
      .string()
      .min(3, 'Precisa de 3 carcteres')
      .required('Preencha este campo'),
    phone: yup
      .string()
      .min(3, 'Digite um numero de telefone Válido')
      .required('Informe um número de Telefone!'),
  });

  useEffect(() => {
    const loadUid = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      setUid(storedUser);
    };

    loadUid();
  }, []);

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: '',
      phone: '',
    },
  });
  const name = watch('name');
  const phone = watch('phone');

  const InfosRegister = {
    name: name,
    phone: phone,
    admin: false,
    uid: uid,
  };

  const RegisterInfos = () => {
    firestore()
      .collection('infos')
      .add(InfosRegister)
      .then(() => {
        AsyncStorage.removeItem('registrationSuccess');
        AsyncStorage.removeItem('user');
        navigation.navigate('Login');
      })
      .catch(error => {
        console.error('Erro ao adicionar agendamentos:', error);
      });
  };

  return (
    <Styled.Container>
      <Title
        text="Agora complete seu cadastro com algumas informações!"
        size="medium"
        family="bold"
        align="center"
        marginTop="medium"
      />
      <Styled.BoxInput>
        <InputForm
          label="Nome"
          control={control}
          placeholder="Digite seu Nome e sobrenome ou um apelido..."
          name={'name'}
          size="90%"
          color="black"
        />

        <InputForm
          label="Telefone"
          placeholder="Ex. (xx) x xxxx xxxx"
          control={control}
          name={'phone'}
          size="90%"
          color="black"
        />
      </Styled.BoxInput>
      <Button
        onPress={handleSubmit(RegisterInfos)}
        text="Finalizar !"
        colorButton="error"
      />
      <LottieView
        source={require('../../../../../assets/animation/teste1.json')}
        autoPlay
        loop
        style={{width: 400, height: 400}}
      />
    </Styled.Container>
  );
}
