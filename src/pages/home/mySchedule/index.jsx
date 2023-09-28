import React, {useEffect, useState} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

import MyScheduleAdmin from './admin';

import * as Styled from './styles';
import MyScheduleUser from './user';

export default function MySchedule() {
  const navigation = useNavigation();
  const [admin, setAdmin] = useState();

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [admin]),
  );

  const fetchData = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      const sanitizedUid = storedUser.replace(/"/g, '');

      const infoSnapshot = await firestore().collection('infos').get();

      const infoData = infoSnapshot.docs.map(doc => doc.data());

      const userInfo = infoData.find(info => info.uid === sanitizedUid);
      setAdmin(userInfo.admin);
    }
  };

  return (
    <Styled.Container>
      {admin ? <MyScheduleAdmin /> : <MyScheduleUser />}
    </Styled.Container>
  );
}
