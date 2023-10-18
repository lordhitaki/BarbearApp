import React, {useEffect, useState} from 'react';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {parsePhoneNumberFromString} from 'libphonenumber-js';

import TabRoute from '../../routes/tabBar';
import {Title} from '../../components/title';
import InputForm from '../../components/form/input/form';

import * as Styled from './styles';
import Button from '../../components/button';
import Toast from 'react-native-toast-message';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);
  const [phoneAdded, setPhoneAdded] = useState(false);

  const fetchUserInfo = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    const sanitizedUid = storedUser?.replace(/"/g, '');

    if (storedUser) {
      const infoSnapshot = await firestore()
        .collection('infos')
        .where('uid', '==', sanitizedUid)
        .get();

      if (!infoSnapshot.empty) {
        const infoData = infoSnapshot.docs[0].data();
        setUser(infoData);
        if (infoData.phone !== null) {
          setPhoneAdded(true);
        }
      }
    }
  };

  const signUpSchema = yup.object({
    phone: yup
      .string()
      .test('is-phone', 'Formato de telefone inválido', value => {
        const phoneNumber = parsePhoneNumberFromString(value, 'BR');
        return phoneNumber !== undefined && phoneNumber.isValid();
      })
      .required('Preencha este campo'),
  });

  useEffect(() => {
    fetchUserInfo();
    if (!phoneAdded) {
      const timer = setTimeout(() => {
        setModalVisible(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [phoneAdded]);

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      phone: '11111111111',
    },
  });
  const phone = formatPhoneNumber(watch('phone'));

  function formatPhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/\D/g, '');
  }

  const handleAddPhone = async () => {
    const formattedPhone = formatPhoneNumber(phone);
    const InfosRegister = {
      phone: formattedPhone,
    };

    const infosCollection = firestore().collection('infos');
    const querySnapshot = await infosCollection
      .where('uid', '==', user.uid)
      .get();
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      await docRef.update(InfosRegister);
      setPhoneAdded(true);
      setModalVisible(false);
      Toast.show({
        type: 'PhoneAdd',
      });
    }
  };

  return (
    <Styled.Container>
      <Styled.Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Styled.BoxModal>
          <Title
            text="Vimos que ainda não possui um número de telefone adicionado!"
            align="center"
            family="bold"
            size="xsmall"
            marginTop="small"
          />
          <Title
            text="Por favor, adicione um número abaixo"
            marginTop="medium"
            family="bold"
          />
          <InputForm
            control={control}
            name={'phone'}
            size="90%"
            color="black"
            mask="phoneMask"
            keyboardType="number-pad"
          />
          <Styled.BoxBt>
            <Button
              text="Adicionar"
              onPress={async () => {
                await handleSubmit(handleAddPhone)();
              }}
              size={30}
              colorButton="success"
              border="transparent"
            />
            <Button
              text="Mais tarde"
              onPress={() => setModalVisible(!modalVisible)}
              size={30}
              colorButton="error"
            />
          </Styled.BoxBt>
        </Styled.BoxModal>
      </Styled.Modal>
      <TabRoute />
    </Styled.Container>
  );
}
