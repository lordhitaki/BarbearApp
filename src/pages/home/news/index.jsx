import React, {useEffect, useState} from 'react';
import database, {firebase} from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';

import * as Styled from './styles';
import {Title} from '../../../components/title';
import Button from '../../../components/button';

export default function News() {
  function SendNOti() {
    database()
      .ref('/users')
      .set({
        name: 'Ader Lovelace',
        age: 31,
        link: 'https://firebasestorage.googleapis.com/v0/b/barbearia-73573.appspot.com/o/Img%2Fic_launcher.png?alt=media&token=75a87873-be34-48ce-bac3-d659c0cce135',
      })
      .then(() => console.log('Data set.'));
  }

  return (
    <Styled.Container>
      <Title text="Aqui vai ser onde vem as novidades" />
      <Button text="Aqui OW" onPress={() => SendNOti()} />
    </Styled.Container>
  );
}
