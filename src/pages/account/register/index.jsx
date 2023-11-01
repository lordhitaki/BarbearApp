import React, {useEffect, useState} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

import Header from '../../../components/header';
import ButtonSocial from '../../../components/button-social';
import InputForm from '../../../components/form/input/form';
import Button from '../../../components/button';
import {Title} from '../../../components/title';

import Hide from '../../../../assets/img/hide';
import Show from '../../../../assets/img/show';
import Google from '../../../../assets/img/google';
import Face from '../../../../assets/img/face';

import * as Styled from './styles';

export default function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const clienteId =
    '1026438868042-4ukrocj1dn4ec3a1enqd1oe4900t2mvm.apps.googleusercontent.com';

  GoogleSignin.configure({
    webClientId: clienteId,
  });

  const signUpSchema = yup.object({
    name: yup.string().required('Preencha este campo'),
    phone: yup.string().required('Preencha este campo'),
    email: yup.string().required('Preencha este campo'),
    Password: yup.string().required('Informe sua senha!'),
  });

  const {
    control,
    // handleSubmit,
    watch,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      Password: '',
    },
  });
  const email = watch('email');
  const password = watch('Password');

  const togglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
  };

  function handleNewAccount() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => AsyncStorage.setItem('registrationSuccess', 'true'))
      .catch(error => console.log(error));
  }

  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Styled.Container>
        <Styled.Scroll>
          <Header title="Registre-se" />
          <Styled.BoxInput>
            <InputForm
              label="E-mail"
              control={control}
              name={'email'}
              size="90%"
              color="black"
            />
            <Styled.BoxPass>
              <Styled.TouchPass onPress={togglePasswordVisibility}>
                {passwordVisible ? <Hide /> : <Show />}
              </Styled.TouchPass>
              <InputForm
                control={control}
                name={'Password'}
                label="Senha"
                size="90%"
                secureTextEntry={!passwordVisible}
              />
            </Styled.BoxPass>
          </Styled.BoxInput>
          <Styled.BoxQlqr>
            <Button
              colorButton="error"
              text="Cadastre-se"
              color="white"
              onPress={() => handleNewAccount()}
            />
            <Title
              text=" Ou"
              color="primary"
              size="medium"
              marginTop="xxnano"
              family="bold"
            />
            <Styled.BoxSocial>
              <ButtonSocial onPress={() => onGoogleButtonPress().then()}>
                <Google />
                <Title text="Google" size="xsmall" family="bold" />
              </ButtonSocial>
              <ButtonSocial>
                <Face />
                <Title text="Facebook" size="xsmall" family="bold" />
              </ButtonSocial>
            </Styled.BoxSocial>
          </Styled.BoxQlqr>
        </Styled.Scroll>
      </Styled.Container>
    </TouchableWithoutFeedback>
  );
}
