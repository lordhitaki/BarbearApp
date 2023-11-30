import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';
import {
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';

import {Title} from '../../../components/title';
import * as Styled from './styles';
import {ActivityIndicator} from 'react-native';
import InputForm from '../../../components/form/input/form';
import Button from '../../../components/button';

export default function News() {
  const [user, setUser] = useState();
  const [admin, setAdmin] = useState(undefined);
  const [img, setImg] = useState();
  const [news, setNews] = useState();
  const [load, setLoad] = useState(false);

  const signUpSchema = yup.object({
    TextPost: yup.string().required('Preencha este campo'),
  });

  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    setValue,
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      TextPost: '',
    },
  });

  useEffect(() => {
    fetchUserInfo();
    CatchNews();
  }, [user]);

  const fetchUserInfo = async () => {
    const subscriber = auth().onAuthStateChanged(async loggedInUser => {
      setUser(loggedInUser);
    });
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const sanitizedUid = storedUser?.replace(/"/g, '');
      if (storedUser) {
        const infoSnapshot = await firestore()
          .collection('infos')
          .where('uid', '==', sanitizedUid)
          .get();
        setAdmin(infoSnapshot._docs[0]._data.admin);
      }
    } catch (error) {
      console.error('Erro ao consultar o Firestore:', error);
    }
    return subscriber;
  };

  const selectImage = async () => {
    try {
      setLoad(true);
      setImg(undefined);

      const options = {
        mediaType: 'photo',
        includeBase64: false,
        selection: 1,
        cancelButtonTitle: 'Cancelar',
        chooseFileButtonTitle: 'Escolher arquivo',
        takePhotoButtonTitle: 'Tirar foto',
      };
      const result = await launchImageLibrary(options);

      if (!result.didCancel) {
        const storageRef = storage().ref(`Img/${result.assets[0].fileName}`);
        const imageLocalPath = result.assets[0].uri;
        await storageRef.putFile(imageLocalPath, {
          contentType: result.assets[0].type,
        });

        const imageUrl = await storageRef.getDownloadURL();

        setImg(imageUrl);
      }
    } catch (error) {
      console.error('Erro ao selecionar e enviar imagem:', error);
    } finally {
      setLoad(false);
    }
  };

  const SendNews = async data => {
    const InfosRegister = {
      Photo: img,
      TextPost: data.TextPost,
    };

    try {
      await firestore().collection('newslatter').add(InfosRegister);
      setValue('TextPost', '');
      setImg(undefined);
    } catch (error) {
      console.error('Erro ao enviar notícia:', error);
    }
  };

  const CatchNews = async () => {
    try {
      const infoSnapshot = await firestore().collection('newslatter').get();

      const newsItems = [];

      infoSnapshot.forEach(doc => {
        const data = doc.data();
        newsItems.push({id: doc.id, ...data});
      });
      setNews(newsItems);
    } catch (error) {
      console.error('Erro ao obter notícias:', error);
    }
  };
  const renderServices = ({item, index}) => {
    return (
      <Styled.ContainerNews>
        {item.Photo ? (
          <Styled.BoxNewsImg>
            <Styled.NewsImg source={{uri: item.Photo}} />
          </Styled.BoxNewsImg>
        ) : null}

        <Title text={item.TextPost} />
      </Styled.ContainerNews>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
        <Styled.Container>
          {admin ? (
            <>
              <Title text="Aqui vai ser onde vem as novidades" />
              <Styled.Touch onPress={() => selectImage()}>
                <Title text="Teste" />
              </Styled.Touch>
              {load ? <ActivityIndicator /> : null}
              {img ? <Styled.Photo source={{uri: img}} /> : null}
              <InputForm
                control={control}
                name="TextPost"
                placeholder="Digite aqui"
                multiline={true}
                numberOfLines={10}
                textAlignVertical="top"
              />
              <Button
                text="Publicar"
                colorButton="success"
                border="transparent"
                onPress={handleSubmit(SendNews)}
              />
            </>
          ) : (
            <Styled.BoxFlat>
              <Styled.Flat
                data={news}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderServices}
              />
            </Styled.BoxFlat>
          )}
        </Styled.Container>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
