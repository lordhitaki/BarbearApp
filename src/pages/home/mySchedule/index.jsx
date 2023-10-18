import React, {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

import ExpandableCalendarScreen from '../mySchedule/admin/index';
import MyScheduleUser from './user';
import * as Styled from './styles';

export default function MySchedule() {
  const [admin, setAdmin] = useState(undefined);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  const fetchData = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      const sanitizedUid = storedUser.replace(/"/g, '');

      const infoSnapshot = await firestore().collection('infos').get();

      const infoData = infoSnapshot.docs.map(doc => doc.data());

      const userInfo = infoData.find(info => info.uid === sanitizedUid);

      if (userInfo && userInfo.admin) {
        setAdmin(true);
      } else {
        setAdmin(false);
      }
    } else {
      setAdmin(false);
    }
  };

  return (
    <Styled.Container>
      {admin === undefined || admin === false ? (
        <MyScheduleUser />
      ) : (
        <ExpandableCalendarScreen />
      )}
    </Styled.Container>
  );
}
