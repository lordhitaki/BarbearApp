import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCq99Bs2kSDZJ44kTH4gr-i5uLN4RwVwrM',
  authDomain: 'barbearia-73573.firebaseapp.com',
  projectId: 'barbearia-73573',
  storageBucket: 'barbearia-73573.appspot.com',
  messagingSenderId: '1026438868042',
  appId: '1:1026438868042:web:48a8848b1cf3d199c64ab3',
  measurementId: 'G-0H8BFQHLC7',
};

const app = initializeApp(firebaseConfig);
export const aut = getAuth(app);
const analytics = getAnalytics(app);
