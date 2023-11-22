import React, {useState} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import auth from '@react-native-firebase/auth';

import InputForm from '../../../../components/form/input/form';
import Hide from '../../../../../assets/img/hide';
import Show from '../../../../../assets/img/show';
import Button from '../../../../components/button';

import * as Styled from './styles';
import Toast from 'react-native-toast-message';

export default function LoginAdm() {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const signUpSchema = yup.object({
    username: yup.string().required('Preencha este campo'),
    Password: yup.string().required('Informe sua senha!'),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      username: 'marcio@ms.com.br',
      Password: 'ms123456',
    },
  });
  const email = watch('username');
  const password = watch('Password'); // Corrigido para 'Password' com P maiúsculo

  const togglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
  };

  function handleLogin() {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        Toast.show({
          type: 'LoginSuccess', // Corrigido para 'LoginSuccess'
        });
        navigation.navigate('Home');
      })
      .catch(error => console.log(error));
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Styled.Container>
        <Styled.IMG source={require('../../../../../assets/img/logo.png')} />

        <Styled.BoxInput>
          <InputForm
            label="nome de usuário"
            control={control}
            name={'username'}
            size="90%"
            color="black"
          />
          <Styled.BoxPass>
            <Styled.TouchPass onPress={togglePasswordVisibility}>
              {passwordVisible ? <Hide /> : <Show />}
            </Styled.TouchPass>
            <InputForm
              control={control}
              name={'Password'} // Corrigido para 'Password' com P maiúsculo
              label="Senha"
              size="90%"
              secureTextEntry={!passwordVisible}
            />
          </Styled.BoxPass>
        </Styled.BoxInput>

        <Button
          colorButton="error"
          text="Entrar"
          color="white"
          onPress={() => handleSubmit(handleLogin)()}
        />
      </Styled.Container>
    </TouchableWithoutFeedback>
  );
}
