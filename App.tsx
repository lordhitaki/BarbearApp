import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  StatusBar,
  TouchableWithoutFeedback,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

import ToastConfig from './src/components/toastConfig/index';
import Routes from './src/routes/stackRoutes';
import {ThemeProvider} from './src/theme/theme';

function App() {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView behavior="height" style={{flex: 1}}>
        <ThemeProvider>
          <StatusBar backgroundColor={'#DCDCDC'} barStyle={'dark-content'} />
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
          <Toast config={ToastConfig} />
        </ThemeProvider>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default App;
