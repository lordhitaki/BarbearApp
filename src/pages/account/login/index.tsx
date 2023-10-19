import React from 'react';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import {Title} from '../../../components/title';
import Button from '../../../components/button';

import * as Styled from './styles';

export default function Login() {
  const navigation = useNavigation();

  const clienteId =
    '1026438868042-4ukrocj1dn4ec3a1enqd1oe4900t2mvm.apps.googleusercontent.com';

  GoogleSignin.configure({
    webClientId: clienteId,
  });

  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    Toast.show({
      type: 'LoginSuccess',
    });
    return auth().signInWithCredential(googleCredential);
  }

  return (
    <Styled.Container>
      <Styled.IMG source={require('../../../../assets/img/logo.png')} />
      <Styled.BoxBTN>
        <Button
          text="Google"
          color="dark"
          icon="google"
          colorButton="transparent"
          border="grayDark"
          onPress={() => onGoogleButtonPress().then()}
        />
        <Button
          text="Facebook"
          color="dark"
          icon="facebook"
          colorButton="transparent"
          border="grayDark"
          // onPress={() =>
          //   onFacebookButtonPress().then(() =>
          //     console.log('Signed in with Facebook!'),
          //   )
          // }
        />
      </Styled.BoxBTN>
      <Title
        text=" Use uma das contas acima para se logar!"
        marginTop="xxlarge"
        size="xsmall"
        color="primary"
        family="bold"
      />
      <Styled.BoxAdm>
        <Title text="Caso seja um ADM clique " />
        <Styled.Touch onPress={() => navigation.navigate('LoginAdm')}>
          <Title text="aqui" color="error" family="bold" />
        </Styled.Touch>
      </Styled.BoxAdm>
    </Styled.Container>
  );
}
