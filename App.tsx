import React, {useState, useEffect} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/routes/stackRoutes';
import {ThemeProvider} from './src/theme/theme';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import Home from './src/pages/home';

function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(setUser);

    return subscriber;
  }, []);

  return (
    <ThemeProvider>
      <StatusBar backgroundColor={'black'} />
      <NavigationContainer>{user ? <Home /> : <Routes />}</NavigationContainer>
    </ThemeProvider>
  );
}

export default App;