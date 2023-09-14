import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {Title} from '../../../components/title';
import Button from '../../../components/button';

import * as Styled from './styles';
import {useFocusEffect} from '@react-navigation/native';

export default function MySchedule() {
  const [schedules, setSchedules] = useState();
  const [admin, setAdmin] = useState(false);
  const [uid, setUid] = useState();
  const [selectedButton, setSelectedButton] = useState('');
  const [isDaySelected, setIsDaySelected] = useState({});
  const [selectedDaySchedules, setSelectedDaySchedules] = useState({});

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

                  // Atualize o estado isDaySelected com os dados formatados
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
    // Crie uma cópia do objeto selectedDaySchedules
    const updatedSelectedDaySchedules = {...selectedDaySchedules};

    // Itere sobre as chaves dos estados isDaySelected
    for (const dia in isDaySelected) {
      if (updatedSelectedDaySchedules[dia]) {
        // Combine os horários existentes com os horários de isDaySelected
        updatedSelectedDaySchedules[dia] = [
          ...updatedSelectedDaySchedules[dia],
          ...isDaySelected[dia],
        ];
      } else {
        // Se não houver horários existentes, use os horários de isDaySelected
        updatedSelectedDaySchedules[dia] = [...isDaySelected[dia]];
      }

      // Remova duplicatas dos horários combinados
      updatedSelectedDaySchedules[dia] = [
        ...new Set(updatedSelectedDaySchedules[dia]),
      ];
    }

    // Atualize o estado selectedDaySchedules com os novos valores combinados
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
      .collection('Horarios')
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
      // Converta o dia de volta para o formato original (ex: 'Seg' para 'segunda-feira')
      const fullDay = dayMapping[dia] || dia;

      // Crie um novo objeto para esse dia com os horários selecionados
      scheduleData[fullDay] = selectedDaySchedules[dia];
    }

    // Verifique se o documento já existe para o usuário atual (uid)
    firestore()
      .collection('profissionais')
      .where('uid', '==', uid)
      .get()
      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          // O documento existe, atualize-o
          querySnapshot.forEach(doc => {
            firestore()
              .collection('profissionais')
              .doc(doc.id)
              .update({scheduleData})
              .then(() => {
                console.log('Agendamentos atualizados com sucesso!');
              })
              .catch(error => {
                console.error('Erro ao atualizar agendamentos:', error);
              });
          });
        } else {
          // O documento não existe, crie um novo
          firestore()
            .collection('profissionais')
            .add({scheduleData})
            .then(() => {
              console.log('Agendamentos adicionados com sucesso!');
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
                    {schedule.hora.map((hour, hourIndex) => (
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
              text="Alou"
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
      <Title
        text="Monte sua agenda!"
        marginTop="medium"
        size="large"
        family="bold"
      />
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
