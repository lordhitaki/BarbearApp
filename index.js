/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {firebase} from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyBx4sufXmQsOgNXVUp4goKimzyFPRV8W5k',
  authDomain: 'barbearia-73573.firebaseapp.com',
  projectId: 'barbearia-73573',
  storageBucket: 'barbearia-73573.appspot.com',
  messagingSenderId: '1026438868042',
  appId: '1:1026438868042:web:48a8848b1cf3d199c64ab3',
  measurementId: 'G-0H8BFQHLC7',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
AppRegistry.registerComponent(appName, () => App);
