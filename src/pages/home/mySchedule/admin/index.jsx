import React, {useRef, useCallback, useEffect, useState} from 'react';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  LocaleConfig,
} from 'react-native-calendars';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {format} from 'date-fns';
import Toast from 'react-native-toast-message';

import testIDs from './mocks/testIDs';
import {getMarkedDates} from './mocks/agendaItems';
import {getTheme, themeColor} from './mocks/theme';
import {Title} from '../../../../components/title';
import Button from '../../../../components/button';

import * as Styled from './styles';

interface Props {
  weekView?: boolean;
}

export default function ExpandableCalendarScreen(props: Props) {
  const today = new Date();
  const marked = useRef(getMarkedDates());
  const theme = useRef(getTheme());
  const formattedDate = format(today, 'yyyy-MM-dd');
  const [user, setUser] = useState();
  const [schedules, setSchedules] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemInfo, setSelectedItemInfo] = useState(null);

  const todayBtnTheme = useRef({
    todayButtonTextColor: themeColor,
  });

  LocaleConfig.locales['pt-br'] = {
    monthNames: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ],
    monthNamesShort: [
      'Jav.',
      'Fev.',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul.',
      'Ago',
      'Set.',
      'Out.',
      'Nov.',
      'Dez.',
    ],
    dayNames: [
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sabado',
      'Domingo',
    ],
    dayNamesShort: ['Dom.', 'Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sab.'],
    today: 'Hoje',
  };

  LocaleConfig.defaultLocale = 'pt-br';

  useFocusEffect(
    React.useCallback(() => {
      fetchUserInfo();
    }, []),
  );

  const fetchUserInfo = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const sanitizedUid = storedUser?.replace(/"/g, '');

      if (storedUser) {
        const infoSnapshot = await firestore()
          .collection('infos')
          .where('uid', '==', sanitizedUid)
          .get();

        if (!infoSnapshot.empty) {
          const infoData = infoSnapshot.docs[0]._data;
          setUser(infoData);
        }
      }
    } catch (error) {
      console.error('Erro ao consultar o Firestore:', error);
    }
    fetchSchedule();
  };

  useEffect(() => {
    if (user?.uid !== undefined) {
      fetchSchedule();
    }
  }, [user?.uid]);

  const fetchSchedule = async () => {
    if (user?.uid !== undefined) {
      try {
        const querySnapshot = await firestore()
          .collection('scheduled')
          .where('uidPro', '==', user.uid)
          .get();

        const serviceData = [];

        querySnapshot.forEach(documentSnapshot => {
          const service = {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
          serviceData.push(service);
        });

        setSchedules(serviceData);
        setIsLoading(false);
      } catch (error) {
        console.error(
          'Erro ao consultar o Firestore para os serviços: ',
          error,
        );
        setIsLoading(false);
      }
    }
  };

  const deleteTask = async taskId => {
    await firestore()
      .collection('done')
      .add(taskId)
      .then(() => {
        Toast.show({
          type: 'success',
        });
        try {
          firestore().collection('scheduled').doc(taskId.id).delete();
          fetchSchedule();
        } catch (error) {
          console.error('Erro ao excluir a tarefa:', error);
        }
      })
      .catch(error => {
        console.error('Erro ao adicionar agendamentos:', error);
      });
  };

  const sortItemsByDate = (a, b) => {
    const dateA = new Date(a.title);
    const dateB = new Date(b.title);
    return dateA - dateB;
  };

  const ITEMS: any[] =
    schedules && schedules.length > 0
      ? schedules.map(item => ({
          title: item.day,
          data: [
            {
              date: item.day,
              hour: item.hour,
              duration: '30m',
              title: [item.services],
              uid: item.uid,
              uidPro: item.uidPro,
              id: item.id,
              price: [item.price],
            },
          ],
        }))
      : [];

  const sortedItems = ITEMS.slice().sort(sortItemsByDate);

  const getInfoByUid = async uid => {
    try {
      const infoSnapshot = await firestore()
        .collection('infos')
        .where('uid', '==', uid)
        .get();

      if (!infoSnapshot.empty) {
        const infoData = infoSnapshot.docs[0].data();
        return infoData;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Erro ao consultar o Firestore:', error);
      return null;
    }
  };

  const renderItem = useCallback(
    ({item}) => {
      return (
        <>
          <TouchableOpacity
            onPress={async () => {
              setSelectedItem(item);
              setModalVisible(true);
              const info = await getInfoByUid(item.uid);
              setSelectedItemInfo(info);
            }}
            style={styles.item}
            testID={testIDs.agenda.ITEM}>
            <View>
              <Title text={item.hour} size="small" />
              <Text style={styles.itemDurationText}>{item.duration}</Text>
            </View>
            <Text style={styles.itemTitleText}>{item.title}</Text>
          </TouchableOpacity>
          <Styled.Modal
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <Styled.BoxModal>
              <Styled.BoxFuck>
                <Styled.IMG source={{uri: selectedItemInfo?.photoUrl}} />

                <Styled.BoxDescriptionClient>
                  <Title
                    text={selectedItemInfo?.name}
                    size="medium"
                    family="bold"
                    align="center"
                    marginTop="medium"
                  />

                  <Styled.BoxDescription>
                    <Title text="Tel.: " size="medium" />
                    <Title
                      text={selectedItemInfo?.phone}
                      size="medium"
                      family="bold"
                    />
                  </Styled.BoxDescription>
                </Styled.BoxDescriptionClient>
              </Styled.BoxFuck>
              <Styled.BoxBt>
                <Button
                  text="Feito"
                  size={40}
                  colorButton="error"
                  onPress={async () => {
                    if (selectedItem) {
                      await deleteTask(selectedItem);
                    }
                    setModalVisible(!modalVisible);
                  }}
                />

                <Button
                  text="Ok"
                  size={40}
                  colorButton="error"
                  onPress={() => setModalVisible(!modalVisible)}
                />
              </Styled.BoxBt>
            </Styled.BoxModal>
          </Styled.Modal>
        </>
      );
    },
    [modalVisible, selectedItemInfo, schedules],
  );

  return (
    <CalendarProvider
      date={formattedDate}
      showTodayButton
      theme={todayBtnTheme.current}>
      <ExpandableCalendar
        testID={testIDs.expandableCalendar.CONTAINER}
        theme={theme.current}
        firstDay={1}
        markedDates={marked.current}
      />
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <AgendaList
          sections={sortedItems}
          renderItem={renderItem}
          sectionStyle={styles.section}
          dayFormat={'dd/MM/yyyy'}
        />
      )}
    </CalendarProvider>
  );
}
const styles = StyleSheet.create({
  item: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    flexDirection: 'row',
  },
  itemHourText: {
    color: 'black',
  },
  itemDurationText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  itemTitleText: {
    color: 'black',
    marginLeft: 16,
    fontWeight: 'bold',
    fontSize: 16,
  },
  itemButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  emptyItem: {
    paddingLeft: 20,
    height: 52,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  emptyItemText: {
    color: 'lightgrey',
    fontSize: 14,
  },
});
