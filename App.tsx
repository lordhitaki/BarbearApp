import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import ToastConfig from './src/components/toastConfig/index';

import Routes from './src/routes/stackRoutes';
import {ThemeProvider} from './src/theme/theme';

function App() {
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
