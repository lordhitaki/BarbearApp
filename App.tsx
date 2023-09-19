import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

import Routes from './src/routes/stackRoutes';
import {ThemeProvider} from './src/theme/theme';

function App() {
  return (
    <ThemeProvider>
      <StatusBar backgroundColor={'black'} />
      <NavigationContainer>
        <Routes />
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
