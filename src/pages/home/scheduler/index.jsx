import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import {format} from 'date-fns';
import firestore from '@react-native-firebase/firestore';

import * as Styled from './styles';
import {Title} from '../../../components/title';
import Button from '../../../components/button';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Scheduler() {
  // const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const options = {weekday: 'long', timeZone: 'UTC'};

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
  const formattedDate = format(date, 'dd/MM/yyyy');

  useEffect(() => {
    updateAvailableTimesByDate();
  }, [date, chose, selectedDayOfWeek]);

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
      .collection('serviços')
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
        console.error(
          'Erro ao consultar o Firestore para os serviços: ',
          error,
        );
      });
  }, [selectedDayOfWeek]);

  const order = {
    dia: formattedDate,
    hora: selectedTime,
    preço: choseService.preço,
    profissional: chose?.profissionais,
    serviço: choseService.serviços,
    semana: selectedDayOfWeek,
  };

  const Envio = () => {
    const collectionRef = firestore().collection('agendados');
    const query = collectionRef
      .where('profissional', '==', order.profissional)
      .where('dia', '==', order.dia)
      .where('hora', '==', order.hora);
    const horarioParaVerificar = selectedTime;

    let horarioNaoExiste = false;

    firestore()
      .collection('profissionais')
      .where(selectedDayOfWeek, 'array-contains', horarioParaVerificar)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size === 0) {
          console.log('Horário não existe na coleção "profissionais".');
          horarioNaoExiste = true;
          getPro(chose?.id);
        } else {
          console.log('Horário existe na coleção "profissionais".');
        }

        if (!horarioNaoExiste) {
          query
            .get()
            .then(querySnapshot => {
              if (!querySnapshot.empty) {
                console.log('Já existe um documento com os mesmos valores.');
              } else {
                collectionRef
                  .add({order})
                  .then(() => {
                    console.log('Pedido adicionado com sucesso!');

                    if (chose) {
                      const fieldName = selectedDayOfWeek;
                      const updatedHorarios = chose
                        ? (chose[fieldName] || []).filter(
                            horario => horario !== selectedTime,
                          )
                        : [];
                      const updatedChose = {
                        ...chose,
                        [fieldName]: updatedHorarios,
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
                        })
                        .catch(error => {
                          console.error(
                            'Erro ao atualizar o Firestore:',
                            error,
                          );
                        });
                    }
                  })
                  .catch(error => {
                    console.error('Erro ao adicionar o pedido:', error);
                  });
              }
            })
            .catch(error => {
              console.error('Erro ao consultar o Firestore:', error);
            });
        }
      })
      .catch(error => {
        console.error('Erro ao consultar o Firestore:', error);
      });
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
            [selectedDayOfWeek.toLowerCase()]: horariosDisponiveis,
          });
        } else {
          console.log('Profissional não encontrado no Firestore.');
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

    if (chose && chose[selectedDay]) {
      const times = chose[selectedDay];
      setAvailableTimes(times);
    } else {
      setAvailableTimes([]);
    }
  };

  const updateAvailableTimes = profissional => {
    const selectedDay = selectedDayOfWeek.toLowerCase();

    if (profissional[selectedDay]) {
      const times = profissional[selectedDay];
      setAvailableTimes(times);
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
            text={`${item?.serviços} R$ ${item?.preço}`}
            size="xsmall"
            family="bold"
          />
        </Styled.Touch>
      </Styled.BoxFlat>
    );
  };

  return (
    <Styled.Container>
      <Styled.Touch onPress={() => setOpen(true)}>
        <Title text="Data: " size="medium" family="bold" />
        <Title
          text={formattedDate ? formattedDate : ''}
          size="xsmall"
          family="regular"
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
              text={'' || chose?.profissionais}
              size="xsmall"
              family="regular"
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
                  ? `${choseService.serviços} R$ ${choseService.preço}`
                  : ''
              }
              size="xsmall"
              family="regular"
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
                  text="Resumo"
                  size="medium"
                  family="bold"
                  marginTop="xxnano"
                />
                <Styled.Img
                  source={require('../../../../assets/img/logo.png')}
                />
              </Styled.BoxLogo>
              <Styled.BoxInfos>
                <Title
                  text={'Valor : '}
                  family="bold"
                  size="xsmall"
                  marginBottom="nano"
                />
                <Title
                  text={choseService ? `R$ ${choseService.preço}` : ''}
                  size="xsmall"
                  family="regular"
                  marginRight="medium"
                />
                <Title
                  text={'Duração estimada : '}
                  family="bold"
                  size="xsmall"
                  marginBottom="nano"
                />
                <Title text={'60 minutos '} size="small" />
              </Styled.BoxInfos>
            </Styled.BoxResume>
            <Styled.BoxButton>
              <Button
                colorButton="error"
                text="Agendar"
                onPress={() => Envio()}
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
                          text={profissional.profissionais}
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
              animationType="slide"
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
