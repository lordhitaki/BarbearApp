import React from 'react';
import {useNavigation} from '@react-navigation/native';
import AppIntroSlider from 'react-native-app-intro-slider';
import * as Styled from './styles';
import {Title} from '../../components/title';
import Button from '../../components/button';

// import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const slides = [
    {
      key: '1',
      title: 'Atendendo desde 2003',
      text: 'Com cortesia, felicidade, um bom ambiente, e muita resenha!!!',
      image: <Styled.Img source={require('../../../assets/img/externo.png')} />,
    },
    {
      key: '2',
      title: 'Ambiente bem estruturado',
      text: 'Com equipamentos modernos, e adequados prontos para atende-los',
      image: <Styled.Img source={require('../../../assets/img/interno.png')} />,
    },
    {
      key: '3',
      title: `Studio M'S Barbearia`,
      text: 'Faça o cadastro e agende seu horario com',
      image: <Styled.Img source={require('../../../assets/img/todos.png')} />,
    },
  ];
  const navigation = useNavigation();

  // async function Valida() {
  //   await AsyncStorage.setItem('onBoarding', 'true');
  //   navigation.navigate('Pre');
  // }

  function renderSlides({item}) {
    return (
      <Styled.Container>
        {item.image}
        <Styled.BoxCenter>
          <Title
            text={item.title}
            size="xlarge"
            color="primary"
            family="bold"
          />
        </Styled.BoxCenter>
        <Styled.BoxText>
          <Title
            text={item.text}
            size="xsmall"
            color="primary"
            family="regular"
          />
        </Styled.BoxText>
      </Styled.Container>
    );
  }

  return (
    <AppIntroSlider
      renderItem={renderSlides}
      data={slides}
      nextLabel=""
      activeDotStyle={{
        backgroundColor: 'red',
        width: '10%',
        bottom: '45%',
      }}
      dotStyle={{
        backgroundColor: 'white',
        bottom: '45%',
      }}
      renderDoneButton={() => (
        <>
          <Styled.BoxNext onPress={() => navigation.navigate('Login')}>
            <Title text="Continuar" color="white" family="bold" />
          </Styled.BoxNext>
        </>
      )}
    />
  );
}
