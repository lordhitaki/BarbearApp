import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import {Title} from '../../../../components/title';
import Button from '../../../../components/button';

import * as Styled from './styles';

import Back from '../../../../../assets/img/back';

export default function MyScheduleAdminP() {
  const [schedules, setSchedules] = useState();
  const [admin, setAdmin] = useState(false);
  const [uid, setUid] = useState();
  const [selectedButton, setSelectedButton] = useState('');
  const [isDaySelected, setIsDaySelected] = useState({});
  const [selectedDaySchedules, setSelectedDaySchedules] = useState({});
  const navigation = useNavigation();

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

  useFocusEffect(
    React.useCallback(() => {
      combineSelectedSchedules();
    }, [isDaySelected]),
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const sanitizedUid = storedUser.replace(/"/g, '');

          setUid(sanitizedUid);
          const infoSnapshot = await firestore().collection('infos').get();

          const infoData = infoSnapshot.docs.map(doc => doc.data());

          const userInfo = infoData.find(info => info.uid === sanitizedUid);

          if (userInfo.admin) {
            setAdmin(true);

            firestore()
              .collection('profissionais')
              .where('uid', '==', uid)
              .get()
              .then(querySnapshot => {
                if (!querySnapshot.empty) {
                  const documentSnapshot = querySnapshot.docs[0];
                  const profissionalData = documentSnapshot.data();

                  const diasFormatados = Object.keys(profissionalData)
                    .filter(key => key.endsWith('-feira') || key === 'sábado')
                    .map(key => ({
                      dia: dayMappingReverse[key] || key,
                      horarios: profissionalData[key],
                    }));

                  const updatedIsDaySelected = {};
                  diasFormatados.forEach(dia => {
                    updatedIsDaySelected[dia.dia] = dia.horarios;
                  });
                  setIsDaySelected(updatedIsDaySelected);
                } else {
                  console.log(
                    'Nenhum profissional encontrado com o mesmo uid.',
                  );
                }
              })
              .catch(error => {
                console.error('Erro ao buscar dados: ', error);
              });
          } else {
            setAdmin(false);
          }
        }
      } catch (error) {}
    };
    fetchData();
  }, [schedules]);

  const combineSelectedSchedules = () => {
    const updatedSelectedDaySchedules = {...selectedDaySchedules};

    for (const dia in isDaySelected) {
      if (updatedSelectedDaySchedules[dia]) {
        updatedSelectedDaySchedules[dia] = [
          ...updatedSelectedDaySchedules[dia],
          ...isDaySelected[dia],
        ];
      } else {
        updatedSelectedDaySchedules[dia] = [...isDaySelected[dia]];
      }

      updatedSelectedDaySchedules[dia] = [
        ...new Set(updatedSelectedDaySchedules[dia]),
      ];
    }

    setSelectedDaySchedules(updatedSelectedDaySchedules);
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

  useEffect(() => {
    firestore()
      .collection('schedules')
      .get()
      .then(querySnapshot => {
        const times = [];

        querySnapshot.forEach(documentSnapshot => {
          const service = {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
          times.push(service);
        });

        setSchedules(times);
      })
      .catch(error => {
        console.error(
          'Erro ao consultar o Firestore para os serviços: ',
          error,
        );
      });
  }, []);

  const sendSchedules = () => {
    const convertedSelectedDays = convertDaysBeforeSend();
    const scheduleData = {};

    for (const dia in selectedDaySchedules) {
      const fullDay = dayMapping[dia] || dia;

      scheduleData[fullDay] = selectedDaySchedules[dia];
    }

    firestore()
      .collection('profissionais')
      .where('uid', '==', uid)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach(doc => {
            const existingScheduleData = doc.data().scheduleData || {};
            const updatedScheduleData = {...existingScheduleData};

            for (const dia in scheduleData) {
              if (updatedScheduleData[dia]) {
                updatedScheduleData[dia] = [
                  ...new Set([
                    ...updatedScheduleData[dia],
                    ...scheduleData[dia],
                  ]),
                ];
              } else {
                updatedScheduleData[dia] = scheduleData[dia];
              }
            }

            firestore()
              .collection('profissionais')
              .doc(doc.id)
              .update({scheduleData: updatedScheduleData})
              .then(() => {
                Toast.show({
                  type: 'ScheduledSuccess',
                });
                navigation.navigate('Home', {
                  screen: 'Perfil',
                });
              })
              .catch(error => {
                console.error('Erro ao atualizar agendamentos:', error);
              });
          });
        } else {
          firestore()
            .collection('profissionais')
            .add({scheduleData})
            .then(() => {
              Toast.show({
                type: 'ScheduledSuccess',
              });
            })
            .catch(error => {
              console.error('Erro ao adicionar agendamentos:', error);
            });
        }
      })
      .catch(error => {
        console.error('Erro ao verificar documentos:', error);
      });
  };

  const convertDaysBeforeSend = () => {
    const convertedSelectedDays = Object.keys(selectedDaySchedules);

    return convertedSelectedDays;
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
          <Title
            text={`Agora selecione os horários para ${selectedButton}`}
            marginTop="medium"
            size="medium"
            family="bold"
          />
          <Styled.ScrollTime
            contentContainerStyle={{
              alignItems: 'center',
              paddingBottom: 20,
            }}>
            <Styled.Hours>
              {schedules ? (
                schedules.map((schedule, index) => (
                  <React.Fragment key={index}>
                    {schedule.hour.map((hour, hourIndex) => (
                      <Styled.TouchHour
                        key={hourIndex}
                        onPress={() => toggleHour(hour)}
                        style={[
                          selectedDaySchedules[selectedButton]?.includes(hour)
                            ? {backgroundColor: 'red'}
                            : {},
                        ]}>
                        <Title
                          text={hour}
                          size="small"
                          family="bold"
                          color={'dark'}
                        />
                      </Styled.TouchHour>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <ActivityIndicator />
              )}
            </Styled.Hours>
            <Button
              text="Criar agenda"
              onPress={() => sendSchedules()}
              border="error"
              colorButton="error"
            />
          </Styled.ScrollTime>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <Styled.Container>
      <Styled.Header>
        <Styled.Touch onPress={() => navigation.goBack()}>
          <Back />
        </Styled.Touch>
        <Title text="Monte sua agenda!" size="large" family="bold" />
      </Styled.Header>
      <Styled.BoxSelec>
        <Title
          text="Selecione um ou mais dias para começar!"
          size="xsmall"
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
