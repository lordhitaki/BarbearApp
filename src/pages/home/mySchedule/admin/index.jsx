import React, {useEffect, useId, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Calendar, LocaleConfig} from 'react-native-calendars';

import {Title} from '../../../../components/title';
import * as Styled from './styles';

export default function MyScheduleAdmin() {
  const [selectedButton, setSelectedButton] = useState('');
  const [schedules, setSchedules] = useState();
  const [selectedDaySchedules, setSelectedDaySchedules] = useState({});
  const [user, setUser] = useState();
  const [selected, setSelected] = useState('');

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

  const dayMapping = {
    Seg: 'segunda-feira',
    Ter: 'terça-feira',
    Qua: 'quarta-feira',
    Qui: 'quinta-feira',
    Sex: 'sexta-feira',
    Sab: 'sábado',
  };

  const dayMappingReverse = {
    'segunda-feira': 'Seg',
    'terça-feira': 'Ter',
    'quarta-feira': 'Qua',
    'quinta-feira': 'Qui',
    'sexta-feira': 'Sex',
    sábado: 'Sab',
  };

  const toggleHour = hour => {
    const updatedSelectedDaySchedules = {...selectedDaySchedules};
    if (updatedSelectedDaySchedules[selectedButton]) {
      if (updatedSelectedDaySchedules[selectedButton].includes(hour)) {
        updatedSelectedDaySchedules[selectedButton] =
          updatedSelectedDaySchedules[selectedButton].filter(
            selectedHour => selectedHour !== hour,
          );
      } else {
        updatedSelectedDaySchedules[selectedButton].push(hour);
      }
    } else {
      updatedSelectedDaySchedules[selectedButton] = [hour];
    }
    setSelectedDaySchedules(updatedSelectedDaySchedules);
  };

  const fetchUserInfo = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const sanitizedUid = storedUser.replace(/"/g, '');
      const storedData = await AsyncStorage.getItem('infos');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
      }
      if (storedUser) {
        const infoSnapshot = await firestore()
          .collection('infos')
          .where('uid', '==', sanitizedUid)
          .get();

        if (!infoSnapshot.empty) {
          const infoData = infoSnapshot.docs[0]._data;
          setUser(infoData);
        } else {
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

        querySnapshot.forEach(documentSnapshot => {
          const service = {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
          setSchedules(service);
        });
      } catch (error) {
        console.error(
          'Erro ao consultar o Firestore para os serviços: ',
          error,
        );
      }
    } else {
      fetchSchedule();
    }
  };

  const renderContent = () => {
    let showHourSelector = false;

    switch (selectedButton) {
      case 'Seg':
      case 'Ter':
      case 'Qua':
      case 'Qui':
      case 'Sex':
      case 'Sab':
        showHourSelector = true;
        break;
      default:
        showHourSelector = false;
    }
    if (showHourSelector) {
      return (
        <>
          <Calendar
            style={{height: 350, width: 350, marginTop: 20}}
            onDayPress={day => {
              setSelected(day.dateString);
            }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
              },
            }}
          />
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <Styled.Container>
      <Title
        text={`Ola ${user?.name}`}
        marginTop="medium"
        size="large"
        family="bold"
      />
      <Styled.BoxSelec>
        <Title
          text="Selecione um ou mais dia para ver sua agenda!"
          size="medium"
          align="center"
          family="bold"
        />
        <Styled.BoxWeek>
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day, index) => (
            <Styled.TouchCheck
              isSelected={selectedButton === day}
              key={index}
              onPress={() => {
                setSelectedButton(day);
              }}>
              <Title
                text={day}
                size="medium"
                family="bold"
                color={selectedButton === day ? 'white' : 'dark'}
              />
            </Styled.TouchCheck>
          ))}
        </Styled.BoxWeek>
      </Styled.BoxSelec>
      {renderContent()}
    </Styled.Container>
  );
}
