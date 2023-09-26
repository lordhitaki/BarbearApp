import React, {useEffect, useState} from 'react';
import {
  useNavigation,
  useFocusEffect,
  CommonActions,
} from '@react-navigation/native';
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
  const [dados, setDados] = useState(null);
  const [infos, setInfos] = useState(null);
  const [uid, setUid] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible3, setModalVisible3] = useState(false);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async loggedInUser => {
      setDados(loggedInUser);
    });

    return subscriber;
  }, []);

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

        if (!infoSnapshot.empty) {
          const infoData = infoSnapshot.docs[0]._data;
          setUser(infoData);
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Erro ao consultar o Firestore:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const loadUid = async () => {
        const storedUser = await AsyncStorage.getItem('user');
        const sanitizedUid = storedUser.replace(/"/g, '');
        setUid(sanitizedUid);
      };
      fetchUserInfo();
      loadUid();
    }, []),
  );

  const signUpSchema = yup.object({
    email: yup
      .string()
      .required('Preencha este campo')
      .email('Digite um E-mail valido'),
    name: yup.string().required('Preencha este campo'),
    phone: yup.string().required('Preencha este campo'),
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
  const phone = watch('phone');
  const name = watch('name');
  function handleSignOut() {
    auth()
      .signOut()
      .then(() => {
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
    alert('Uma mensagem de redefinição foi enviado para seu e-mail');
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
              alert('Você foi deslogado, para a alteração de e-mail!');
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

  const InfosRegister = {
    name: name,
    phone: phone,
    admin: false,
    uid: uid,
  };

  const RegisterInfos = () => {
    firestore()
      .collection('infos')
      .where('uid', '==', uid)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            firestore()
              .collection('infos')
              .doc(doc.id)
              .update(InfosRegister)
              .then(() => {
                console.log('Dados atualizados com sucesso!');
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                  }),
                );
              })
              .catch(error => {
                console.error('Erro ao atualizar dados:', error);
              });
          });
        } else {
          firestore()
            .collection('infos')
            .add(InfosRegister)
            .then(() => {
              console.log('Dados adicionados com sucesso!');
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{name: 'Home'}],
                }),
              );
            })
            .catch(error => {
              console.error('Erro ao adicionar dados:', error);
            });
        }
      })
      .catch(error => {
        console.error('Erro ao verificar documentos:', error);
      });
  };

  return (
    <Styled.Container>
      <Styled.Body>
        <Title
          text={`Bem Vindo ${user?.name || dados?.displayName}`}
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
                <Title
                  text={`${dados?.displayName || user?.name}`}
                  family="bold"
                  size="medium"
                />
              </Styled.InfoDados>
              <Styled.InfoDados>
                <Title text={`Tel: `} />
                <Title text={user?.phone} family="bold" size="medium" />
              </Styled.InfoDados>
              <Styled.Touch onPress={() => setModalVisible3(!modalVisible3)}>
                <Title
                  text="Deseja alterar algum dado? Clique aqui!"
                  family="bold"
                  size="small"
                />
              </Styled.Touch>
              <Styled.Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible3}
                onRequestClose={() => {
                  setModalVisible3(!modalVisible3);
                }}>
                <Styled.BoxModal>
                  <Styled.ModalView>
                    <Title
                      text="Altere os dados desejado"
                      size="medium"
                      family="bold"
                    />
                    <Title
                      text="É preciso preencher todos os campos!"
                      color="error"
                      family="bold"
                    />
                    <Styled.BoxInput>
                      <InputForm
                        label="Nome"
                        placeholder="Digite aqui..."
                        control={control}
                        name={'name'}
                        size="100%"
                        color="black"
                      />
                      <InputForm
                        label="Telefone"
                        placeholder="Digite aqui..."
                        control={control}
                        name={'phone'}
                        size="100%"
                        color="black"
                      />
                    </Styled.BoxInput>
                    <Button
                      text="Enviar"
                      colorButton="success"
                      border="success"
                      size={100}
                      onPress={() => RegisterInfos()}
                    />
                    <Button
                      text="Voltar"
                      colorButton="error"
                      size={100}
                      onPress={() => setModalVisible3(!modalVisible3)}
                    />
                  </Styled.ModalView>
                </Styled.BoxModal>
              </Styled.Modal>
              <Button
                text="Voltar"
                colorButton="error"
                size={100}
                onPress={() => setModalVisible(!modalVisible)}
              />
            </Styled.ModalView>
          </Styled.BoxModal>
        </Styled.Modal>
        <Styled.Touch onPress={() => handleForgetPass()}>
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
