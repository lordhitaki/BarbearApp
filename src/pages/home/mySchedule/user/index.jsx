import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {format} from 'date-fns';
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';

import {Title} from '../../../../components/title';
import Button from '../../../../components/button';

import * as Styled from './styles';

export default function MyScheduleUser() {
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const [selectedInfo, setSelecetedInfo] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [professionalPhoto, setProfessionalPhoto] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
    }, []),
  );

  const fetchUserInfo = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const sanitizedUid = storedUser?.replace(/"/g, '');

      if (storedUser) {
        const infoSnapshot = await firestore()
          .collection('scheduled')
          .where('uid', '==', sanitizedUid)
          .get();

        const infoData = infoSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUser(infoData);
      }
    } catch (error) {
      console.error('Erro ao consultar o Firestore:', error);
    }
  };

  const deleteTask = async taskId => {
    const updatedScheduleData = {[selectedInfo.week]: [selectedInfo.hour]};

    // Consulta para encontrar o documento correspondente com base no UID
    const query = firestore()
      .collection('profissionais')
      .where('uid', '==', selectedInfo.uidPro);

    try {
      const querySnapshot = await query.get();

      if (querySnapshot.size > 0) {
        querySnapshot.forEach(async doc => {
          const docRef = firestore().collection('profissionais').doc(doc.id);

          const existingData = (await docRef.get()).data() || {};

          if (
            existingData.scheduleData &&
            existingData.scheduleData[selectedInfo.week]
          ) {
            existingData.scheduleData[selectedInfo.week].push(
              selectedInfo.hour,
            );
          } else {
            existingData.scheduleData = {
              ...existingData.scheduleData,
              [selectedInfo.week]: [selectedInfo.hour],
            };
          }

          await docRef.update(existingData);

          try {
            await firestore().collection('scheduled').doc(taskId).delete();
            fetchUserInfo();
            Toast.show({
              type: 'CancelOrder',
            });
          } catch (error) {
            console.error('Erro ao excluir a tarefa:', error);
          }
        });
      } else {
        console.log('Nenhum documento encontrado para o UID fornecido.');
      }
    } catch (error) {
      console.error('Erro ao atualizar o documento:', error);
    }
  };

  const fetchProfessionalPhoto = async uidPro => {
    try {
      const infoSnapshot = await firestore()
        .collection('infos')
        .where('uid', '==', uidPro)
        .get();

      if (!infoSnapshot.empty) {
        const infoData = infoSnapshot.docs[0].data();
        if (infoData) {
          const profissionalPhoto = infoData.photoUrl;
          setProfessionalPhoto(profissionalPhoto);
        }
      }
    } catch (error) {
      console.error('Erro ao consultar a foto do profissional:', error);
    }
  };

  const renderSchedule = ({item, index}) => {
    const originalDate = new Date(item.day);
    const formattedDate = format(originalDate, 'dd/MM/yyyy');
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(item.price);
    return (
      <Styled.BoxFlat
        key={index}
        onPress={async () => {
          try {
            setModalVisible(!modalVisible);
            setSelecetedInfo(item);
            await fetchProfessionalPhoto(item.uidPro);
          } catch (error) {
            console.error('Erro ao consultar a foto do profissional:', error);
          }
        }}>
        <Styled.BoxText>
          <Title
            text="Serviço:"
            size="xxnano"
            marginLeft="medium"
            marginTop="xnano"
          />
          <Title
            text={item.services}
            size="xxnano"
            family="bold"
            marginLeft="xxnano"
            marginTop="xnano"
          />
        </Styled.BoxText>
        <Styled.BoxText>
          <Title text="Dia:" xxnano marginLeft="medium" marginTop="xxnano" />
          <Title
            text={formattedDate}
            xxnano
            family="bold"
            marginLeft="medium"
            marginTop="xxnano"
          />
        </Styled.BoxText>
        <Styled.Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <Styled.BoxModal>
            <Styled.BoxFuck>
              <Styled.BoxLogo>
                <Title
                  text={selectedInfo?.professional}
                  xxnano
                  family="bold"
                  marginTop="nano"
                  marginBottom="nano"
                  marginLeft="xnano"
                />
                {professionalPhoto ? (
                  <Styled.Img source={{uri: professionalPhoto}} />
                ) : null}
              </Styled.BoxLogo>
              <Styled.BoxText2>
                <Styled.BoxText1>
                  <Title text="Preço: " size="xxnano" />
                  <Title
                    text={formattedPrice}
                    marginRight="huge"
                    family="bold"
                    size="xxnano"
                  />
                </Styled.BoxText1>
                <Styled.BoxText1>
                  <Title text="Hora: " size="xxnano" />
                  <Title
                    text={selectedInfo?.hour}
                    family="bold"
                    size="xxnano"
                  />
                </Styled.BoxText1>
                <Styled.BoxText1>
                  <Title text="Serviço: " size="xxnano" />
                  <Title
                    text={selectedInfo?.services}
                    family="bold"
                    size="xxnano"
                  />
                </Styled.BoxText1>
              </Styled.BoxText2>
            </Styled.BoxFuck>
            <Styled.BoxBt>
              <Button
                text="Ok"
                size={44}
                colorButton="error"
                onPress={() => setModalVisible(!modalVisible)}
              />
              <Button
                text="Cancelar pedido"
                size={44}
                colorButton="error"
                onPress={async () => {
                  if (selectedInfo) {
                    await deleteTask(selectedInfo.id);
                  }
                  setModalVisible(!modalVisible);
                }}
              />
            </Styled.BoxBt>
          </Styled.BoxModal>
        </Styled.Modal>
      </Styled.BoxFlat>
    );
  };

  return (
    <Styled.Container>
      <Title
        text="Minha agenda"
        size="xsmall"
        family="bold"
        marginTop="medium"
      />
      {user?.length > 0 ? (
        <Styled.Flat
          data={user}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderSchedule}
        />
      ) : (
        <>
          <Styled.BoxNone>
            <Title
              text="Ainda não existe um horario marcado!"
              marginTop="medium"
              size="medium"
            />
            <LottieView
              source={require('../../../../../assets/animation/bigodim.json')}
              autoPlay
              loop
              style={{width: 400, height: 400}}
            />
            <Styled.BoxNT>
              <Title text="Clique " size="medium" />
              <Styled.Touc
                onPress={() =>
                  navigation.navigate('TabRoute', {
                    screen: 'Agendar',
                  })
                }>
                <Title text="aqui " size="medium" color="error" family="bold" />
              </Styled.Touc>
              <Title text=" para ir até la! " size="medium" />
            </Styled.BoxNT>
          </Styled.BoxNone>
        </>
      )}
    </Styled.Container>
  );
}
