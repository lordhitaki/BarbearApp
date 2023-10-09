import React, {useRef, useCallback, useEffect, useState} from 'react';
import {
  ExpandableCalendar,
  AgendaList,
  CalendarProvider,
  WeekCalendar,
  LocaleConfig,
} from 'react-native-calendars';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {format, compareAsc, parse} from 'date-fns';

import testIDs from './mocks/testIDs';
import {getMarkedDates} from './mocks/agendaItems';
import {getTheme, themeColor} from './mocks/theme';
import {Title} from '../../../../components/title';

import * as Styled from './styles';
import Button from '../../../../components/button';

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
      'Agost',
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
    dayNamesShort: ['Seg.', 'Ter.', 'Qua.', 'Qui.', 'Sex.', 'Sab.', 'Dom.'],
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
          .collection('agendados')
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
    console.log(taskId);
    try {
      await firestore().collection('agendados').doc(taskId).delete();
      fetchSchedule();
    } catch (error) {
      console.error('Erro ao excluir a tarefa:', error);
    }
  };

  const sortItemsByDate = (a, b) => {
    const dateA = new Date(a.title);
    const dateB = new Date(b.title);
    return dateA - dateB;
  };

  // ...

  const ITEMS: any[] =
    schedules && schedules.length > 0
      ? schedules.map(item => ({
          title: item.dia,
          data: [
            {
              hora: item.hora,
              duration: '30m',
              title: item.services,
              uid: item.uid,
              id: item.id,
            },
          ],
        }))
      : [];

  const sortedItems = ITEMS.slice().sort(sortItemsByDate);

  const renderItem = useCallback(
    ({item}) => {
      return (
        <>
          <TouchableOpacity
            onPress={async () => {
              setSelectedItem(item);
              setModalVisible(true);
            }}
            style={styles.item}
            testID={testIDs.agenda.ITEM}>
            <View>
              <Text style={styles.itemHourText}>{item.hora}</Text>
              <Text style={styles.itemDurationText}>{item.duration}</Text>
            </View>
            <Text style={styles.itemTitleText}>{item.title}</Text>
          </TouchableOpacity>
          <Styled.Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <Styled.BoxModal>
              <Title text={selectedItem?.title} />
              <Styled.BoxBt>
                <Button
                  text="Feito"
                  size={40}
                  colorButton="error"
                  onPress={async () => {
                    if (selectedItem) {
                      await deleteTask(selectedItem.id);
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
    [modalVisible],
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
