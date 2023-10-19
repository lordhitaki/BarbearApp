import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';
import firestore from '@react-native-firebase/firestore';

import * as Styled from './styles';
import {Title} from '../../../components/title';
import Button from '../../../components/button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function Scheduler() {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const options = {weekday: 'long', timeZone: 'UTC'};
  const [uid, setUid] = useState();
  const [open, setOpen] = useState(false);
  const [profissionais, setProfissionais] = useState('');
  const [services, setServices] = useState();
  const [chose, setChose] = useState();
  const [choseService, setChoseService] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [selectedDayOfWeek, setSelectedDayOfWeek] = useState(
    new Intl.DateTimeFormat('pt-BR', options).format(date),
  );
  const [availableTimes, setAvailableTimes] = useState([]);
  const [disable, setDisable] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const handleSelect = item => {
    if (selectedTime === item) {
      setSelectedTime(null);
    } else {
      setSelectedTime(item);
    }
  };
  const formattedDate = format(date, 'dd-MM-yyyy');
  const formattedSend = format(date, 'yyyy-MM-dd');

  useEffect(() => {
    updateAvailableTimesByDate();
    teste();
  }, [date, chose, selectedDayOfWeek]);

  async function teste() {
    try {
      const storedUserJSON = await AsyncStorage.getItem('infos');
      if (storedUserJSON) {
        const storedUser = JSON.parse(storedUserJSON);
        const uidata = storedUser.uid;
        setUid(uidata);
      } else {
        console.log('Nenhum dado armazenado em "infos".');
      }
    } catch (error) {
      console.error('Erro ao obter e analisar os dados: ', error);
    }
  }

  useEffect(() => {
    firestore()
      .collection('profissionais')
      .get()
      .then(querySnapshot => {
        const profissionaisData = [];

        querySnapshot.forEach(documentSnapshot => {
          const profissional = {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
          profissionaisData.push(profissional);
        });
        setProfissionais(profissionaisData);
      })
      .catch(error => {
        console.error(
          'Erro ao consultar o Firestore para os profissionais: ',
          error,
        );
      });

    firestore()
      .collection('services')
      .get()
      .then(querySnapshot => {
        const servicesData = [];

        querySnapshot.forEach(documentSnapshot => {
          const service = {
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          };
          servicesData.push(service);
        });

        setServices(servicesData);
      })
      .catch(error => {
        Toast.show({
          type: 'ErrorBD',
        });
      });
  }, [selectedDayOfWeek]);

  const order = {
    day: formattedSend,
    hour: selectedTime,
    price: choseService.price,
    professional: chose?.professional,
    services: choseService.services,
    week: selectedDayOfWeek,
    uid: uid,
    uidPro: chose?.uid,
  };

  const Send = () => {
    const collectionRef = firestore().collection('scheduled');
    const horarioParaVerificar = selectedTime;

    if (chose && chose.professional === order.professional) {
      const scheduleData = chose.scheduleData;
      let horarioNaoExiste = true;

      if (scheduleData.hasOwnProperty(order.week)) {
        const horariosDisponiveisNoDia = scheduleData[order.week];

        if (horariosDisponiveisNoDia.includes(order.hour)) {
          horarioNaoExiste = false;
        } else {
          Toast.show({
            type: 'ErrorAdd',
          });
        }
      } else {
        Toast.show({
          type: 'ErrorSche',
        });
      }
      if (!horarioNaoExiste) {
        collectionRef
          .where('profissional', '==', order.professional)
          .where('dia', '==', order.day)
          .where('hora', '==', order.hour)
          .get()
          .then(querySnapshot => {
            if (!querySnapshot.empty) {
              Toast.show({
                type: 'ErrorAdd',
              });
            } else {
              collectionRef
                .add(order)
                .then(() => {
                  Toast.show({
                    type: 'ScheduledAdd',
                  });
                  navigation.navigate('Home', {
                    screen: 'MySchedule',
                  });
                  if (chose) {
                    const fieldName = selectedDayOfWeek;
                    const updatedHorarios = (
                      chose.scheduleData[fieldName] || []
                    ).filter(horario => horario !== selectedTime);
                    const updatedChose = {
                      ...chose,
                      scheduleData: {
                        ...chose.scheduleData,
                        [fieldName]: updatedHorarios,
                      },
                    };
                    setChose(updatedChose);

                    firestore()
                      .collection('profissionais')
                      .doc(chose?.id)
                      .update(updatedChose)
                      .then(() => {
                        console.log(
                          'Horário removido com sucesso do Firestore.',
                        );
                        navigation.navigate('Home', {
                          screen: 'Minha Agenda',
                        });
                      })
                      .catch(error => {
                        console.error('Erro ao atualizar o Firestore:', error);
                      });
                  }
                })
                .catch(error => {
                  Toast.show({
                    type: 'ErrorAdd1',
                  });
                });
            }
          })
          .catch(error => {
            console.error('Erro ao consultar o Firestore:', error, order);
          });

        updateAvailableTimes(chose);
      }
    } else {
      Toast.show({
        type: 'ErrorSche',
      });
    }
  };

  const getPro = profissionalId => {
    firestore()
      .collection('profissionais')
      .doc(profissionalId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          const profissionalData = documentSnapshot.data();
          const horariosDisponiveis = profissionalData.sele || [];
          setChose({
            ...chose,
            ['scheduleData.' + selectedDayOfWeek.toLowerCase()]:
              horariosDisponiveis,
          });
        }
      })
      .catch(error => {
        console.error(
          'Erro ao consultar o Firestore para os horários disponíveis: ',
          error,
        );
      });
  };

  const updateAvailableTimesByDate = () => {
    const selectedDay = selectedDayOfWeek.toLowerCase();

    if (chose && chose.scheduleData[selectedDay]) {
      const times = chose.scheduleData[selectedDay];
      setAvailableTimes(times);
    } else {
      setAvailableTimes([]);
    }
  };

  const updateAvailableTimes = profissional => {
    const selectedDay = selectedDayOfWeek.toLowerCase();
    if (profissional.scheduleData[selectedDay]) {
      const times = profissional.scheduleData[selectedDay];
      setAvailableTimes(times);
      getPro();
    } else {
      setAvailableTimes([]);
    }
  };

  const renderServices = ({item}) => {
    return (
      <Styled.BoxFlat>
        <Styled.Touch
          onPress={() => {
            setChoseService(item);
            setModalVisible1(!modalVisible1);
          }}>
          <Title
            text={`${item?.services} R$ ${item?.price}`}
            size="xsmall"
            family="bold"
          />
        </Styled.Touch>
      </Styled.BoxFlat>
    );
  };
  function orderTimetables(availableTimes) {
    return availableTimes.sort((a, b) => {
      const [hourA, minuteA] = a.split(':');
      const [hourB, minuteB] = b.split(':');

      const hourIntA = parseInt(hourA, 10);
      const minuteIntA = parseInt(minuteA, 10);
      const hourIntB = parseInt(hourB, 10);
      const minuteIntB = parseInt(minuteB, 10);

      if (hourIntA !== hourIntB) {
        return hourIntA - hourIntB;
      }

      return minuteIntA - minuteIntB;
    });
  }
  const OrderTimes = orderTimetables(availableTimes);

  useEffect(() => {
    setAvailableTimes(OrderTimes);
  }, [OrderTimes]);
  return (
    <Styled.Container>
      <Styled.Touch onPress={() => setOpen(true)}>
        <Title text="Data: " size="medium" family="bold" />
        <Title
          text={formattedDate ? formattedDate : ''}
          size="xsmall"
          family="bold"
          marginRight="small"
        />
      </Styled.Touch>
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        confirmText="Confirmar"
        cancelText="Cancelar"
        title={'Escolha a melhor data:'}
        androidVariant="iosClone"
        onConfirm={selectedDate => {
          const currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);
          const selectedDateTime = selectedDate.getTime();

          if (selectedDateTime >= currentDate.getTime()) {
            const dayOfWeek = selectedDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
            });
            const dayOfWeekOnly = dayOfWeek.split(',')[0].trim();
            setSelectedDayOfWeek(dayOfWeekOnly);
            setOpen(false);
            setDate(selectedDate);
          } else {
            alert(
              'Por favor, selecione uma data igual ou posterior à data atual.',
              setOpen(false),
            );
          }
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      {selectedDayOfWeek !== 'domingo' ? (
        <>
          <Styled.Touch
            onPress={() => setModalVisible(true)}
            disabled={disable || selectedDayOfWeek === 'domingo'}>
            <Title text="Escolha o profissional: " size="small" family="bold" />
            <Title
              text={'' || chose?.professional}
              size="xsmall"
              family="bold"
              marginRight="small"
            />
          </Styled.Touch>
          <Styled.Touch
            onPress={() => setModalVisible1(true)}
            disabled={disable || selectedDayOfWeek === 'domingo'}>
            <Title text="Serviço: " size="medium" family="bold" />
            <Title
              text={
                choseService
                  ? `${choseService.services} R$ ${choseService.price}`
                  : ''
              }
              size="xsmall"
              family="bold"
              marginRight="medium"
            />
          </Styled.Touch>
          <Title
            text="Escolha um horario"
            size="medium"
            marginTop="medium"
            family="bold"
          />
          <Styled.ScrollTime contentContainerStyle={{alignItems: 'center'}}>
            <Styled.BoxTime>
              {availableTimes.map((horario, index) => (
                <Styled.SelectedTime
                  key={index}
                  onPress={() => handleSelect(horario)}
                  isSelected={selectedTime === horario}>
                  <Title
                    text={horario}
                    size="medium"
                    family="bold"
                    color={selectedTime === horario ? 'white' : 'primary'}
                  />
                </Styled.SelectedTime>
              ))}
            </Styled.BoxTime>
            <Styled.BoxResume>
              <Styled.BoxLogo>
                <Title
                  text={chose?.professional}
                  size="medium"
                  family="bold"
                  marginTop="xxnano"
                  marginLeft="xxnano"
                />
                <Styled.Img source={{uri: chose?.img}} />
              </Styled.BoxLogo>
              <Styled.BoxInfos>
                <Title
                  text={'Serviço: '}
                  family="bold"
                  size="xsmall"
                  marginBottom="nano"
                />
                <Title text={choseService?.services} size="small" />
                <Title
                  text={'Valor : '}
                  family="bold"
                  size="xsmall"
                  marginBottom="nano"
                />
                <Title
                  text={choseService ? `R$ ${choseService?.price}` : ''}
                  size="xsmall"
                  family="regular"
                  marginRight="medium"
                />
              </Styled.BoxInfos>
            </Styled.BoxResume>
            <Styled.BoxButton>
              <Button
                colorButton="error"
                text="Agendar"
                onPress={() => Send()}
              />
            </Styled.BoxButton>
          </Styled.ScrollTime>
          <Styled.BoxModal>
            <Styled.Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <Styled.BoxModal>
                <Styled.ModalView>
                  <Title
                    text="Escolha um profissional:"
                    size="medium"
                    family="bold"
                  />
                  {profissionais ? (
                    profissionais.map(profissional => (
                      <Styled.Touch1
                        key={profissional.id}
                        onPress={() => {
                          setChose(profissional);
                          setModalVisible(!modalVisible);
                          updateAvailableTimes(profissional);
                        }}>
                        <Title
                          text={profissional.professional}
                          size="large"
                          family="bold"
                        />
                        <Styled.Img1
                          source={{
                            uri: profissional?.img,
                          }}
                        />
                      </Styled.Touch1>
                    ))
                  ) : (
                    <Title text="Carregando..." size="small" />
                  )}
                </Styled.ModalView>
              </Styled.BoxModal>
            </Styled.Modal>
          </Styled.BoxModal>
          <Styled.BoxModal>
            <Styled.Modal
              transparent={true}
              visible={modalVisible1}
              onRequestClose={() => {
                setModalVisible1(!modalVisible1);
              }}>
              <Styled.Flat
                data={services}
                keyExtractor={item => item.id}
                renderItem={renderServices}
              />
            </Styled.Modal>
          </Styled.BoxModal>
        </>
      ) : (
        <Styled.BoxSunday>
          <Title
            text="Não atendemos aos Domingos, Escolha outra data para ver os horarios disponiveis!"
            size="medium"
            align="center"
            family="bold"
          />
        </Styled.BoxSunday>
      )}
    </Styled.Container>
  );
}
