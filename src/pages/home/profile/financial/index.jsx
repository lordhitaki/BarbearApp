import React from 'react';
import {useNavigation} from '@react-navigation/native';

import {Title} from '../../../../components/title';
import Back from '../../../../../assets/img/back';

import * as Styled from './styles';

export default function Financial() {
  const navigation = useNavigation();

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Touch onPress={() => navigation.goBack()}>
          <Back />
        </Styled.Touch>
        <Title text="Do que precisa?" size="large" family="bold" />
      </Styled.Header>
      <Styled.Touch1
        onPress={() => {
          navigation.navigate('Finish');
        }}>
        <Title text="Finalizar atendimento feitos" size="medium" />
        <Styled.Icon source={require('../../../../../assets/img/next.png')} />
      </Styled.Touch1>
      <Styled.Touch1
        onPress={() => {
          navigation.navigate('Financial');
        }}>
        <Title text="Ver todos serviços finalizado" size="medium" />
        <Styled.Icon source={require('../../../../../assets/img/next.png')} />
      </Styled.Touch1>
      <Styled.Touch1
        onPress={() => {
          navigation.navigate('Balance');
        }}>
        <Title text="Balanço semanal" size="medium" />
        <Styled.Icon source={require('../../../../../assets/img/next.png')} />
      </Styled.Touch1>
    </Styled.Container>
  );
}
