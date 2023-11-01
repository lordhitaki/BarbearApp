import React, {useEffect, useState} from 'react';
import {
  useNavigation,
  useFocusEffect,
  CommonActions,
} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Restart from 'react-native-restart'; // Importe a função de reinicialização

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
  const [modalVisible1, setModalVisible1] = useState(false);

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
      })
      .finally(() => {
        Restart.Restart(); // Reinicie o aplicativo
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
          <>
            <Styled.Touch
              onPress={() => {
                navigation.navigate('MyScheduleAdmin');
              }}>
              <Title text="Monte sua agenda" size="medium" />
              <Styled.Icon
                source={require('../../../../assets/img/next.png')}
              />
            </Styled.Touch>
            <Styled.Touch
              onPress={() => {
                navigation.navigate('Financial');
              }}>
              <Title text="Financeiro" size="medium" />
              <Styled.Icon
                source={require('../../../../assets/img/next.png')}
              />
            </Styled.Touch>
          </>
        ) : null}
        <Styled.Touch
          onPress={() => {
            setModalVisible1(!modalVisible1);
          }}>
          <Title text="Termos de uso" size="medium" />
          <Styled.Icon source={require('../../../../assets/img/next.png')} />
        </Styled.Touch>
        <Styled.Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible1}
          onRequestClose={() => {
            setModalVisible1(!modalVisible1);
          }}>
          <Styled.BoxModal>
            <Styled.ModalView>
              <Styled.Scroll showsVerticalScrollIndicator={false}>
                <Styled.HeadeTerms>
                  <Title
                    text="Termos de Uso!"
                    size="xsmall"
                    family="bold"
                    align="center"
                  />
                  <Styled.TouchTerms
                    onPress={() => setModalVisible1(!modalVisible1)}>
                    <Title text="X" family="bold" size="xsmall" />
                  </Styled.TouchTerms>
                </Styled.HeadeTerms>
                <Title text="1. Aceitação dos Termos de Uso" family="bold" />
                <Title
                  text="Ao acessar e utilizar o Aplicativo, você concorda em cumprir estes Termos de Uso. Se você não concordar com estes termos, não deve usar o Aplicativo."
                  marginTop="small"
                  marginBottom="small"
                />
                <Title text="2. Uso do Aplicativo" family="bold" />
                <Title
                  text="O Aplicativo é projetado para permitir que os usuários agendem serviços de cabeleireiro em salões de beleza parceiros. Você concorda em usar o Aplicativo somente para esse fim legítimo."
                  marginTop="small"
                  marginBottom="small"
                />
                <Title text="3. Cadastro de Conta" family="bold" />
                <Title
                  text="Para utilizar todas as funcionalidades do Aplicativo, você deve criar uma conta. Você é responsável por manter a confidencialidade de suas informações de login e é o único responsável por todas as atividades que ocorrerem em sua conta."
                  marginTop="small"
                  marginBottom="small"
                />
                <Title text="4. Agendamentos e Cancelamentos" family="bold" />
                <Title
                  text="Você pode agendar serviços de cabeleireiro através do Aplicativo. Cancelamentos podem estar sujeitos a políticas específicas do salão, e é sua responsabilidade revisá-las e seguir as orientações fornecidas."
                  marginTop="small"
                  marginBottom="small"
                />
                <Title text="5. Pagamentos" family="bold" />
                <Title
                  text="Alguns salões de beleza podem permitir pagamentos através do Aplicativo. Você concorda em pagar os serviços de acordo com os termos estabelecidos pelo salão."
                  marginTop="small"
                  marginBottom="small"
                />
                <Title text="6. Política de Privacidade" family="bold" />
                <Title
                  text="Seu uso do Aplicativo está sujeito à nossa Política de Privacidade, que explica como coletamos, usamos e protegemos suas informações pessoais."
                  marginTop="small"
                  marginBottom="small"
                />
                <Title
                  text="7. Conteúdo do Usuário

"
                  family="bold"
                />
                <Title
                  text="Ao enviar comentários, avaliações ou outros tipos de conteúdo para o Aplicativo, você concede ao Aplicativo uma licença não exclusiva, transferível, sublicenciável, gratuita e mundial para usar, reproduzir, modificar, distribuir e exibir tal conteúdo."
                  marginTop="small"
                  marginBottom="small"
                />
                <Title text="8. Propriedade Intelectual" family="bold" />
                <Title
                  text="O Aplicativo e todo o seu conteúdo são protegidos por direitos autorais e outras leis de propriedade intelectual. Você concorda em não copiar, modificar, distribuir, ou criar trabalhos derivados do Aplicativo ou de seu conteúdo."
                  marginTop="small"
                  marginBottom="small"
                />
                <Title text="9. Limitação de Responsabilidade" family="bold" />
                <Title
                  text="O Aplicativo não é responsável por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos decorrentes do uso ou impossibilidade de uso do Aplicativo."
                  marginTop="small"
                  marginBottom="small"
                />
                <Title
                  text="10. Modificações dos Termos de Uso"
                  family="bold"
                />
                <Title
                  text="Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. As alterações serão comunicadas através do Aplicativo. O uso contínuo do Aplicativo após tais alterações constitui aceitação dos novos termos."
                  marginTop="small"
                  marginBottom="small"
                />
                <Title text="11. Encerramento da Conta" family="bold" />
                <Title
                  text="Podemos encerrar sua conta e seu acesso ao Aplicativo a nosso critério, sem aviso prévio, se você violar estes Termos de Uso."
                  marginTop="small"
                  marginBottom="small"
                />
                <Title
                  text="12. Contato

"
                  family="bold"
                />
                <Title
                  text="Se tiver alguma dúvida ou preocupação em relação a estes Termos de Uso, entre em contato conosco através do [endereço de e-mail de suporte] ou [número de telefone de suporte].

Ao aceitar estes Termos de Uso, você concorda em cumprir todas as disposições aqui contidas. Lembre-se de que o não cumprimento desses termos pode resultar no encerramento de sua conta e na impossibilidade de usar o Aplicativo.

"
                  marginTop="small"
                  marginBottom="small"
                />
              </Styled.Scroll>
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
