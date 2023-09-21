import React, {useEffect, useState} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';

import {Title} from '../../../components/title';
import Button from '../../../components/button';
import InputForm from '../../../components/form/input/form';

import * as Styled from './styles';

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [infos, setInfos] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const sanitizedUid = storedUser.replace(/"/g, '');
      const storedData = await AsyncStorage.getItem('infos');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setInfos(parsedData);
      }
      if (storedUser) {
        const infoSnapshot = await firestore()
          .collection('infos')
          .where('uid', '==', sanitizedUid)
          .get();

        const infoData = infoSnapshot.docs[0]._data;
        setUser(infoData);
      }
    } catch (error) {
      console.error('Erro ao consultar o Firestore:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
    }, []),
  );

  const signUpSchema = yup.object({
    email: yup
      .string()
      .required('Preencha este campo')
      .email('Digite um E-mail valido'),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const email = watch('email');

  function handleSignOut() {
    auth()
      .signOut()
      .then(() => {
        alert('Você foi deslogado, para a alteração de e-mail!');
        setUser(null);
      })
      .catch(error => {
        console.error('Erro ao fazer logout:', error);
      });
  }

  function handleForgetPass() {
    auth()
      .sendPasswordResetEmail(infos?.email)
      .catch(error => console.log(error));
  }

  function changeEmail(newEmail) {
    const i = auth().currentUser;
    if (i) {
      i.updateEmail(newEmail)
        .then(() => {
          auth()
            .signOut()
            .then(() => {
              setUser(null);
            })
            .catch(error => {
              console.error('Erro ao fazer logout:', error);
            });
        })
        .catch(error => {
          console.error('Erro ao atualizar o email:', error);
        });
    } else {
      console.error('Nenhum usuário autenticado.');
    }
  }

  return (
    <Styled.Container>
      <Styled.Body>
        <Title
          text={`Bem Vindo ${user?.name}`}
          color="dark"
          size="large"
          marginTop="medium"
        />

        <Styled.Touch onPress={() => setModalVisible(!modalVisible)}>
          <Title text="Dados pessoais" size="medium" />
        </Styled.Touch>
        <Styled.Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <Styled.BoxModal>
            <Styled.ModalView>
              <Title text="Dados:" size="medium" family="bold" />
              <Styled.InfoDados>
                <Title text="Nome: " />
                <Title text={user?.name} family="bold" size="medium" />
              </Styled.InfoDados>
              <Styled.InfoDados>
                <Title text={`Tel: `} />
                <Title text={user?.phone} family="bold" size="medium" />
              </Styled.InfoDados>
              <Styled.Touch>
                <Title
                  text="Deseja alterar algum dado? Clique aqui!"
                  family="bold"
                  size="small"
                />
              </Styled.Touch>
              <Button
                text="Voltar"
                colorButton="error"
                size={100}
                onPress={() => setModalVisible(!modalVisible)}
              />
            </Styled.ModalView>
          </Styled.BoxModal>
        </Styled.Modal>
        <Styled.Touch
          onPress={() => handleForgetPass(setModalVisible1(!modalVisible1))}>
          <Title text="Alterar Senha" size="medium" />
        </Styled.Touch>
        <Styled.Touch
          onPress={() => {
            // changeEmail('2@Teste.com');
            setModalVisible2(!modalVisible2);
          }}>
          <Title text="Alterar E-mail" size="medium" />
        </Styled.Touch>

        <Styled.Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(!modalVisible2);
          }}>
          <Styled.BoxModal>
            <Styled.ModalView>
              <InputForm
                label="Qual o novo e-mail?"
                placeholder="Digite aqui..."
                control={control}
                name={'email'}
                size="100%"
                color="black"
                errorMsg={errors?.email?.message}
              />

              <Styled.BT>
                <Button
                  text="Confirmar"
                  size={50}
                  colorButton="success"
                  border="secondary"
                  onPress={() => changeEmail(email)}
                />

                <Button
                  text="Voltar"
                  colorButton="error"
                  size={50}
                  onPress={() => setModalVisible2(!modalVisible2)}
                />
              </Styled.BT>
            </Styled.ModalView>
          </Styled.BoxModal>
        </Styled.Modal>
        <Styled.Touch onPress={handleSignOut}>
          <Title text=" Sair" color="error" family="bold" size="medium" />
        </Styled.Touch>
      </Styled.Body>
    </Styled.Container>
  );
}
