import React, {useEffect, useState} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import {Title} from '../../../components/title';
import Button from '../../../components/button';

import * as Styled from './styles';

export default function Profile() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [dados, setDados] = useState(null);
  const [infos, setInfos] = useState(null);
  const [uid, setUid] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  // const showToast = () => {
  //   Toast.show({
  //     type: 'error',
  //     text1: 'Feito!',
  //     text2: 'O item foi removido da sua agenda!',
  //   });
  // };

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

  function handleSignOut() {
    auth()
      .signOut()
      .then(() => {
        setUser(null);
        AsyncStorage.clear();
        Toast.show({
          type: 'LogoutSuccess',
        });
      })
      .catch(error => {
        console.error('Erro ao fazer logout:', error);
      });
  }

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Logo source={require('../../../../assets/img/logo.png')} />
        <Title text={`Perfil `} color="dark" size="large" marginTop="medium" />
      </Styled.Header>
      <Styled.BoxProfilePic>
        <Styled.ProfilePic source={{uri: user?.photoUrl}} />
        <Title
          text={user?.name}
          size="medium"
          family="bold"
          marginBottom="medium"
        />
      </Styled.BoxProfilePic>
      <Styled.Body>
        <Styled.Touch onPress={() => setModalVisible(!modalVisible)}>
          <Title text="Dados pessoais" size="medium" />
          <Styled.Icon source={require('../../../../assets/img/next.png')} />
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
                {user?.admin === true ? (
                  <Title text={`${user?.name}`} family="bold" size="medium" />
                ) : (
                  <Title
                    text={`${dados?.displayName}`}
                    family="bold"
                    size="medium"
                  />
                )}
              </Styled.InfoDados>
              <Styled.InfoDados>
                <Title text={`Tel:${dados?.phone || ''} `} />
                <Title text={user?.phone} family="bold" size="medium" />
              </Styled.InfoDados>
              <Styled.BoxBT>
                <Button
                  text="Voltar"
                  colorButton="error"
                  size={100}
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </Styled.BoxBT>
            </Styled.ModalView>
          </Styled.BoxModal>
        </Styled.Modal>
        {user?.admin ? (
          <Styled.Touch
            onPress={() => {
              navigation.navigate('MyScheduleAdmin');
            }}>
            <Title text="Monte sua agenda" size="medium" />
            <Styled.Icon source={require('../../../../assets/img/next.png')} />
          </Styled.Touch>
        ) : null}

        <Styled.Touch onPress={handleSignOut}>
          <Title text=" Sair" color="error" family="bold" size="medium" />
        </Styled.Touch>
      </Styled.Body>
    </Styled.Container>
  );
}
