import React from 'react';
import {useNavigation} from '@react-navigation/native';

import * as Styled from './style';
import {Title} from '../title';
import Back from '../../../assets/img/back';

interface HeaderProps {
  title?: string;
  showImage?: boolean; // Adicione uma propriedade para controlar a exibição da imagem
}

export default function Header({title, showImage, ...rest}: HeaderProps) {
  const navigation = useNavigation();

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.BoxSeta onPress={() => navigation.goBack()}>
          <Back />
        </Styled.BoxSeta>
        {title && (
          <Title text={title} size="large" color="primary" family="bold" />
        )}
      </Styled.Header>
      {showImage && (
        <Styled.Img source={require('../../../assets/img/logo.png')} />
      )}
    </Styled.Container>
  );
}
