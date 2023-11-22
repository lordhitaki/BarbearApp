import React, {useEffect} from 'react';
import {StatusBar, PermissionsAndroid, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';

import Routes from './src/routes/stackRoutes';
import {ThemeProvider} from './src/theme/theme';
import ToastConfig from './src/components/toastConfig/index';

function App() {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    // messaging()
    //   .subscribeToTopic('news')
    //   .then(() => console.log('Subscribed to topic!'));
    return unsubscribe;
  }, []);

  return (
    <ThemeProvider>
      <StatusBar backgroundColor={'#DCDCDC'} barStyle={'dark-content'} />
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
      <Toast config={ToastConfig} />
    </ThemeProvider>
  );
}

export default App;
