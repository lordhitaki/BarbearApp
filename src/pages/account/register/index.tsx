import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

import * as Styled from './styles';
import Header from '../../../components/header';
import InputForm from '../../../components/form/input/form';
import Google from '../../../../assets/img/google';
import Button from '../../../components/button';
import Hide from '../../../../assets/img/hide';
import Show from '../../../../assets/img/show';
import {Title} from '../../../components/title';
import ButtonSocial from '../../../components/button-social';
import Face from '../../../../assets/img/face';

export default function Register() {
  const navigation = useNavigation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const signUpSchema = yup.object({
    username: yup.string().required('Preencha este campo'),
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
      username: 'teste@teste.com',
      Password: '123456',
    },
  });
  const email = watch('username');
  const password = watch('Password');

  const togglePasswordVisibility = () => {
    setPasswordVisible(prevState => !prevState);
  };

  function handleNewAccount() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => alert('Cadastrado com sucesso!'))
      .catch(error => console.log(error));
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Styled.Container>
        <Styled.Scroll>
          <Header title="Registre-se" />
          <Styled.BoxInput>
            <InputForm
              label="Nome"
              control={control}
              name={'username'}
              size="90%"
              color="black"
            />
            <InputForm
              label="Sobrenome"
              control={control}
              name={'username'}
              size="90%"
              color="black"
            />

            <InputForm
              label="E-mail"
              control={control}
              name={'username'}
              size="90%"
              color="black"
            />
            <InputForm
              label="Telefone"
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
            <Styled.BoxPass>
              <Styled.TouchPass onPress={togglePasswordVisibility}>
                {passwordVisible ? <Hide /> : <Show />}
              </Styled.TouchPass>
              <InputForm
                control={control}
                name={'Password'}
                label="Confirme sua senha"
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
              <ButtonSocial>
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
