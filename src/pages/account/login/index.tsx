import React, {useState} from 'react';
import {TouchableWithoutFeedback, Keyboard} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import auth from '@react-native-firebase/auth';

import * as Styled from './styles';
import Header from '../../../components/header';
import InputForm from '../../../components/form/input/form';
import {Title} from '../../../components/title';
import Hide from '../../../../assets/img/hide';
import Show from '../../../../assets/img/show';
import ButtonSocial from '../../../components/button-social';
import Face from '../../../../assets/img/face';
import Google from '../../../../assets/img/google';
import Button from '../../../components/button';

export default function Login() {
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
      username: 'teste@teste.com',
      Password: '123456',
    },
  });
  const email = watch('username');
  const password = watch('Password');

  const togglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
  };

  function handleLogin() {
    auth()
      .signInWithEmailAndPassword(email, password, auth)
      .then(() => alert('Logado com sucesso!'))
      .catch(error => console.log(error));
  }

  function handleForgetPass() {
    auth()
      .sendPasswordResetEmail(email)
      .then(() => alert('E-mail de redefinição enviado'))
      .catch(error => console.log(error));
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Styled.Container>
        <Header title="Entrar" />
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
              name={'Password'}
              label="Senha"
              size="90%"
              secureTextEntry={!passwordVisible}
            />
          </Styled.BoxPass>
        </Styled.BoxInput>
        <Styled.BoxForgot>
          <Title text="Esqueceu sua senha?" />
          <Styled.Touch onPress={() => handleForgetPass()}>
            <Title text="Clique aqui" color="error" />
          </Styled.Touch>
        </Styled.BoxForgot>
        <Button
          colorButton="error"
          text="Entrar"
          color="white"
          onPress={() => handleLogin()}
        />
        <Title text="Ou entre com " marginTop="xlarge" />
        <Styled.BoxSocial>
          <ButtonSocial>
            <Google />
            <Title text="Google" size="xsmall" family="bold" />
          </ButtonSocial>
          <ButtonSocial>
            <Face />
            <Title text="Facebook" size="xsmall" family="bold" />
          </ButtonSocial>
        </Styled.BoxSocial>
        <Styled.BoxForgot>
          <Title text="Ainda não possui um cadastro?" />
          <Styled.Touch onPress={() => navigation.navigate('Register')}>
            <Title text="Clique aqui" color="error" />
          </Styled.Touch>
        </Styled.BoxForgot>
      </Styled.Container>
    </TouchableWithoutFeedback>
  );
}
