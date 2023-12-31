import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import {format} from 'date-fns';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {useForm} from 'react-hook-form';

import {Title} from '../../../../../components/title';
import Back from '../../../../../../assets/img/back';

import * as Styled from './styles';
import Button from '../../../../../components/button';
import InputForm from '../../../../../components/form/input/form';
import Toast from 'react-native-toast-message';

export default function Finish() {
  const navigation = useNavigation();

  const [profissionais, setProfissionais] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [chose, setChose] = useState();
  const [services, setServices] = useState();
  const [infos, setInfos] = useState();
  const [infosModal, setInfosModal] = useState();
  const [priceTotal, setPriceTotal] = useState();
  const [priceSellTotal, setPriceSellTotal] = useState();
  const [comisisonService, setComissionService] = useState();
  const [comisisonItem, setComissionItem] = useState();
  const [totalComission, setTotalComission] = useState(0);
  const [isScreenDirty, setIsScreenDirty] = useState(false);

  const signUpSchema = yup.object({
    service: yup.string(),
    priceService: yup.string(),
    sell: yup.string(),
    priceSell: yup.string(),
  });

  const CommissionCalculation = () => {
    const totalPrice = infosModal?.item?.price
      ? infosModal.item.price.reduce((acc, price) => acc + parseFloat(price), 0)
      : 0;
    setPriceTotal(totalPrice);
    const totalAfter40Percent = totalPrice * 0.4;
    setComissionService(totalAfter40Percent);

    const totalPriceSell = infosModal?.item?.priceSell
      ? infosModal.item.priceSell.reduce(
          (acc, price) => acc + parseFloat(price),
          0,
        )
      : 0;
    setPriceSellTotal(totalPriceSell);
    const totalAfter20Percent = totalPriceSell * 0.2;
    setComissionItem(totalAfter20Percent);

    const totalComissionValue = totalAfter40Percent + totalAfter20Percent;
    setTotalComission(totalComissionValue);
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: {errors, isValid},
  } = useForm({
    resolver: yupResolver(signUpSchema),
    defaultValues: {
      service: 'cortezim',
      priceService: '35',
      sell: 'Gel cola',
      priceSell: '25',
    },
  });

  const onSubmit = data => {
    setInfosModal(prevInfosModal => {
      if (!prevInfosModal) {
        prevInfosModal = {
          item: {
            title: [],
            price: [],
            sells: [],
          },
        };
      }

      const updatedItem = {
        title: Array.isArray(prevInfosModal.item.title)
          ? [...prevInfosModal.item.title, data.service].filter(Boolean)
          : [prevInfosModal.item.title, data.service].filter(Boolean),
        price: Array.isArray(prevInfosModal.item.price)
          ? [...prevInfosModal.item.price, data.priceService].filter(Boolean)
          : [prevInfosModal.item.price, data.priceService].filter(Boolean),
        sells: Array.isArray(prevInfosModal.item.sells)
          ? [...(prevInfosModal.item.sells || []), data.sell].filter(Boolean)
          : [prevInfosModal.item.sells, data.sell].filter(Boolean),
        priceSell: Array.isArray(prevInfosModal.item.priceSell)
          ? [...(prevInfosModal.item.priceSell || []), data.priceSell].filter(
              Boolean,
            )
          : [prevInfosModal.item.priceSell, data.priceSell].filter(Boolean),
        date: prevInfosModal.item.date,
        hour: prevInfosModal.item.hour,
        uid: prevInfosModal.item.uid,
        uidPro: prevInfosModal.item.uidPro,
        duration: prevInfosModal.item.duration,
        id: prevInfosModal.item.id,
      };

      return {
        ...prevInfosModal,
        item: updatedItem,
      };
    });
    setModalVisible2(!modalVisible2);
  };

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
    CommissionCalculation();
  }, [infosModal, isScreenDirty]);

  const finishOrder = item => {
    const itemWithComission = {
      ...item,
      totalComission: totalComission,
    };

    const itemWithComissionAdded = {
      ...item,
      itemWithComission: itemWithComission,
    };

    firestore()
      .collection('finished')
      .add(itemWithComissionAdded)
      .then(() => {
        setModalVisible2(false);
        setModalVisible1(false);
        deleteTask(infosModal);
        Toast.show({
          type: 'ScheduledSuccess',
        });
      })
      .catch(error => {
        console.error('Erro ao adicionar agendamentos:', error);
      });
  };
  const deleteTask = async form => {
    try {
      const querySnapshot = await firestore()
        .collection('done')
        .where('id', '==', form.item.id)
        .get();

      querySnapshot.forEach(doc => {
        doc.ref.delete();
      });
    } catch (error) {
      console.error('Erro ao excluir a tarefa:', error);
    }
    fetchUserInfo(infosModal.item.uidPro);
  };

  const fetchUserInfo = async uidPro => {
    try {
      const infoSnapshot = await firestore()
        .collection('done')
        .where('uidPro', '==', uidPro)
        .get();

      const infoDataArray = infoSnapshot.docs.map(doc => doc.data());

      if (infoDataArray.length > 0) {
        setServices(infoDataArray);
      } else {
        setServices([]);
      }
    } catch (error) {
      console.error(
        'Erro ao consultar o Firestore para serviços concluídos:',
        error,
      );
    } finally {
      await catchName();
    }
  };

  const catchName = async () => {
    try {
      const querySnapshot = await firestore().collection('infos').get();

      const infoDataArray = querySnapshot.docs.map(doc => doc.data());

      if (infoDataArray.length > 0) {
        setInfos(infoDataArray);
      } else {
        setInfos([]);
      }
    } catch (error) {
      console.error('Erro ao consultar o Firestore para infos:', error);
    }
  };

  const renderServices = ({item, index}) => {
    const originalDate = new Date(item.date);
    const formattedDate = format(originalDate, 'dd/MM/yyyy');
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(item.price);

    const findNameByUid = uid => {
      const matchingInfo = infos && infos.find(info => info.uid === uid);
      return matchingInfo ? matchingInfo.name : 'Sem Nome';
    };

    const openModal = () => {
      const selectedItem = {
        item: item,
        name: findNameByUid(item.uid),
      };
      setInfosModal(selectedItem);
      setModalVisible1(true);
    };

    return (
      <>
        <Styled.BoxServices onPress={openModal}>
          <Styled.BoxDescri>
            <Styled.TextDescr>
              <Title text="Serviço: " size="xsmall" />
              <Title text={item.title} family="bold" />
            </Styled.TextDescr>
            <Styled.TextDescr>
              <Title text="Preço: " size="xsmall" />
              <Title text={`R$: ${formattedPrice}`} family="bold" />
            </Styled.TextDescr>
          </Styled.BoxDescri>
          <Styled.BoxDescri>
            <Styled.TextDescr>
              <Title text="Cliente: " size="xsmall" />
              {infos &&
                infos.map(info => {
                  if (info.uid === item.uid) {
                    return (
                      <Title key={info.uid} text={info.name} family="bold" />
                    );
                  }
                  return null;
                })}
            </Styled.TextDescr>
            <Styled.TextDescr>
              <Title text="Dia: " size="xsmall" />
              <Title text={formattedDate} family="bold" />
            </Styled.TextDescr>
          </Styled.BoxDescri>
        </Styled.BoxServices>
      </>
    );
  };

  return (
    <Styled.Container>
      {isScreenDirty ? (
        <>
          <Styled.Header>
            <Styled.Touch onPress={() => navigation.goBack()}>
              <Back />
            </Styled.Touch>
            <Title text="Atendimentos feitos" size="large" family="bold" />
          </Styled.Header>
          <Styled.TouchPro onPress={() => setModalVisible(true)}>
            <Title text="Escolha o profissional: " size="small" family="bold" />
            <Title
              text={'' || chose?.professional}
              size="xsmall"
              family="bold"
              marginRight="small"
            />
          </Styled.TouchPro>
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
                    <Styled.Touch2
                      key={profissional.id}
                      onPress={() => {
                        fetchUserInfo(profissional.uid);
                        setChose(profissional);
                        setModalVisible(!modalVisible);
                      }}>
                      <Title
                        text={profissional?.professional}
                        size="large"
                        family="bold"
                      />
                      <Styled.Img1
                        source={{
                          uri: profissional?.img,
                        }}
                      />
                    </Styled.Touch2>
                  ))
                ) : (
                  <Title text="Carregando..." size="small" />
                )}
              </Styled.ModalView>
            </Styled.BoxModal>
          </Styled.Modal>
          <Styled.Body>
            {chose ? (
              <Styled.BoxFlat>
                <Styled.Flat
                  data={services}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderServices}
                />
                <Styled.Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible1}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible1);
                  }}>
                  <Styled.BoxModal>
                    <Styled.ModalView1>
                      <Styled.TouchClosed
                        onPress={() => setModalVisible1(false)}>
                        <Title text="X" size="medium" family="bold" />
                      </Styled.TouchClosed>
                      <Styled.TextDescr>
                        <Title text="Cliente: " size="medium" />
                        <Title
                          text={infosModal?.name}
                          family="bold"
                          size="medium"
                        />
                      </Styled.TextDescr>
                      <Styled.Scroll showsVerticalScrollIndicator={false}>
                        <Styled.BoxInfos>
                          <Title text="Serviços feitos: " size="xsmall" />
                          <Styled.TextInfos>
                            {infosModal?.item.title.map((title, index) => (
                              <Styled.BoxText key={index}>
                                <Title
                                  text={title}
                                  family="bold"
                                  size="xsmall"
                                />
                              </Styled.BoxText>
                            ))}
                            <Styled.BoxText>
                              <Title
                                text="Valor dos serviços: "
                                size="xsmall"
                                marginTop="xxnano"
                              />
                              <Title
                                text="Comissão "
                                size="xsmall"
                                marginTop="xxnano"
                              />
                            </Styled.BoxText>

                            {infosModal?.item.price.map((price, index) => (
                              <Styled.BoxText key={index}>
                                <Title
                                  text={new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  }).format(price)}
                                  family="bold"
                                  size="small"
                                />
                                <Title
                                  text={new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  }).format(price * 0.4)}
                                  family="bold"
                                  size="small"
                                />
                              </Styled.BoxText>
                            ))}
                            <Styled.BoxText1>
                              <Title
                                text="Total dos serviços: "
                                size="xsmall"
                                marginTop="xxnano"
                              />
                              <Title
                                text="Comissão "
                                size="xsmall"
                                marginTop="xxnano"
                              />
                            </Styled.BoxText1>
                            <Styled.BoxText>
                              <Title
                                text={new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(priceTotal)}
                                family="bold"
                                size="small"
                              />
                              <Title
                                text={new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(comisisonService)}
                                family="bold"
                                size="small"
                              />
                            </Styled.BoxText>

                            {infosModal?.item.sells &&
                            infosModal.item.sells.length > 0 ? (
                              <Title
                                text="Vendas:"
                                marginTop="xxnano"
                                size="xsmall"
                              />
                            ) : null}

                            {infosModal?.item.sells &&
                            infosModal.item.sells.length > 0
                              ? infosModal.item.sells.map((sells, index) => (
                                  <Styled.BoxText key={index}>
                                    <Title
                                      text={sells}
                                      family="bold"
                                      size="small"
                                    />
                                  </Styled.BoxText>
                                ))
                              : null}

                            {infosModal?.item?.priceSell?.length &&
                            infosModal.item.priceSell.length > 0 ? (
                              <Styled.BoxText>
                                <Title
                                  text="Valor do item:"
                                  marginTop="xxnano"
                                  size="xsmall"
                                />
                                <Title
                                  text="Comissão"
                                  marginTop="xxnano"
                                  size="xsmall"
                                />
                              </Styled.BoxText>
                            ) : null}

                            {infosModal?.item?.priceSell?.length &&
                            infosModal.item.priceSell.length > 0
                              ? infosModal.item.priceSell.map(
                                  (priceSell, index) => (
                                    <Styled.BoxText key={index}>
                                      <Title
                                        text={new Intl.NumberFormat('pt-BR', {
                                          style: 'currency',
                                          currency: 'BRL',
                                        }).format(priceSell)}
                                        family="bold"
                                        size="small"
                                      />
                                      <Title
                                        text={new Intl.NumberFormat('pt-BR', {
                                          style: 'currency',
                                          currency: 'BRL',
                                        }).format(priceSell * 0.2)}
                                        family="bold"
                                        size="small"
                                      />
                                    </Styled.BoxText>
                                  ),
                                )
                              : null}
                            {infosModal?.item?.priceSell?.length &&
                            infosModal.item.priceSell.length > 0 ? (
                              <>
                                <Styled.BoxText1>
                                  <Title
                                    text="Valor total dos itens:"
                                    size="xsmall"
                                    marginTop="xxnano"
                                  />
                                  <Title
                                    text="Comissão "
                                    size="xsmall"
                                    marginTop="xxnano"
                                  />
                                </Styled.BoxText1>
                                <Styled.BoxText>
                                  <Title
                                    text={new Intl.NumberFormat('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL',
                                    }).format(priceSellTotal)}
                                    family="bold"
                                    size="small"
                                  />
                                  <Title
                                    text={new Intl.NumberFormat('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL',
                                    }).format(comisisonItem)}
                                    family="bold"
                                    size="small"
                                  />
                                </Styled.BoxText>
                              </>
                            ) : null}
                          </Styled.TextInfos>
                          <Title
                            text="Valor total da comissão"
                            size="xsmall"
                            marginTop="xxnano"
                            align="center"
                          />
                          <Title
                            text={new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(totalComission)}
                            family="bold"
                            size="small"
                            align="center"
                          />
                        </Styled.BoxInfos>
                        <Title
                          text="Foi feito mais algum serviço ou venda?"
                          align="center"
                          marginTop="medium"
                          marginBottom="medium"
                          size="xsmall"
                          family="bold"
                        />
                        <Button
                          text="Adicionar"
                          size={100}
                          colorButton="error"
                          onPress={() => setModalVisible2(true)}
                        />
                        <Button
                          text="Finalizar comanda"
                          size={100}
                          colorButton="error"
                          onPress={() => finishOrder(infosModal)}
                        />

                        <Styled.Modal
                          animationType="slide"
                          transparent={true}
                          visible={modalVisible2}
                          onRequestClose={() => {
                            setModalVisible2(!modalVisible2);
                          }}>
                          <Styled.BoxModal>
                            <Styled.ModalView2>
                              <Title text="TesteHere" />
                              <Styled.Touch
                                onPress={() =>
                                  setModalVisible2(!modalVisible2)
                                }>
                                <Title text="Fechar" />
                              </Styled.Touch>
                              <InputForm
                                placeholder="Qual serviço foi feito?"
                                control={control}
                                name={'service'}
                                size="100%"
                                color="black"
                              />
                              <InputForm
                                placeholder="Qual o valor dele?"
                                control={control}
                                name={'priceService'}
                                size="100%"
                                color="black"
                              />
                              <Title
                                text="Foi feita alguma venda? Se sim."
                                marginTop="medium"
                                size="medium"
                                family="bold"
                              />
                              <InputForm
                                placeholder="Qual Produto?"
                                control={control}
                                name={'sell'}
                                size="100%"
                                color="black"
                              />
                              <InputForm
                                placeholder="Qual o valor dele?"
                                control={control}
                                name={'priceSell'}
                                size="100%"
                                color="black"
                              />
                              <Button
                                colorButton="error"
                                text="Adicionar"
                                size={100}
                                onPress={handleSubmit(onSubmit)}
                              />
                            </Styled.ModalView2>
                          </Styled.BoxModal>
                        </Styled.Modal>
                      </Styled.Scroll>
                    </Styled.ModalView1>
                  </Styled.BoxModal>
                </Styled.Modal>
              </Styled.BoxFlat>
            ) : (
              <Styled.NotProfisisonal>
                <Title
                  text="Selecione um profissional para exebir seus atendimentos"
                  size="medium"
                  align="center"
                  family="bold"
                />
              </Styled.NotProfisisonal>
            )}
          </Styled.Body>
        </>
      ) : (
        <>
          <Styled.Header>
            <Styled.Touch onPress={() => navigation.goBack()}>
              <Back />
            </Styled.Touch>
            <Title text="Atendimentos feitos" size="large" family="bold" />
          </Styled.Header>
          <Styled.TouchPro onPress={() => setModalVisible(true)}>
            <Title text="Escolha o profissional: " size="small" family="bold" />
            <Title
              text={'' || chose?.professional}
              size="xsmall"
              family="bold"
              marginRight="small"
            />
          </Styled.TouchPro>
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
                    <Styled.Touch2
                      key={profissional.id}
                      onPress={() => {
                        fetchUserInfo(profissional.uid);
                        setChose(profissional);
                        setModalVisible(!modalVisible);
                      }}>
                      <Title
                        text={profissional?.professional}
                        size="large"
                        family="bold"
                      />
                      <Styled.Img1
                        source={{
                          uri: profissional?.img,
                        }}
                      />
                    </Styled.Touch2>
                  ))
                ) : (
                  <Title text="Carregando..." size="small" />
                )}
              </Styled.ModalView>
            </Styled.BoxModal>
          </Styled.Modal>
          <Styled.Body>
            {chose ? (
              <Styled.BoxFlat>
                <Styled.Flat
                  data={services}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderServices}
                />
                <Styled.Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible1}
                  onRequestClose={() => {
                    setModalVisible(!modalVisible1);
                  }}>
                  <Styled.BoxModal>
                    <Styled.ModalView1>
                      <Styled.TouchClosed
                        onPress={() => setModalVisible1(!modalVisible1)}>
                        <Title text="X" size="medium" family="bold" />
                      </Styled.TouchClosed>
                      <Styled.TextDescr>
                        <Title text="Cliente: " size="medium" />
                        <Title
                          text={infosModal?.name}
                          family="bold"
                          size="medium"
                        />
                      </Styled.TextDescr>
                      <Styled.Scroll showsVerticalScrollIndicator={false}>
                        <Styled.BoxInfos>
                          <Title text="Serviços feitos: " size="xsmall" />
                          <Styled.TextInfos>
                            {infosModal?.item.title.map((title, index) => (
                              <Styled.BoxText key={index}>
                                <Title
                                  text={title}
                                  family="bold"
                                  size="xsmall"
                                />
                              </Styled.BoxText>
                            ))}
                            <Styled.BoxText>
                              <Title
                                text="Valor dos serviços: "
                                size="xsmall"
                                marginTop="xxnano"
                              />
                              <Title
                                text="Comissão "
                                size="xsmall"
                                marginTop="xxnano"
                              />
                            </Styled.BoxText>

                            {infosModal?.item.price.map((price, index) => (
                              <Styled.BoxText key={index}>
                                <Title
                                  text={new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  }).format(price)}
                                  family="bold"
                                  size="small"
                                />
                                <Title
                                  text={new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  }).format(price * 0.4)}
                                  family="bold"
                                  size="small"
                                />
                              </Styled.BoxText>
                            ))}
                            <Styled.BoxText1>
                              <Title
                                text="Total dos serviços: "
                                size="xsmall"
                                marginTop="xxnano"
                              />
                              <Title
                                text="Comissão "
                                size="xsmall"
                                marginTop="xxnano"
                              />
                            </Styled.BoxText1>
                            <Styled.BoxText>
                              <Title
                                text={new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(priceTotal)}
                                family="bold"
                                size="small"
                              />
                              <Title
                                text={new Intl.NumberFormat('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                }).format(comisisonService)}
                                family="bold"
                                size="small"
                              />
                            </Styled.BoxText>

                            {infosModal?.item.sells &&
                            infosModal.item.sells.length > 0 ? (
                              <Title
                                text="Vendas:"
                                marginTop="xxnano"
                                size="xsmall"
                              />
                            ) : null}

                            {infosModal?.item.sells &&
                            infosModal.item.sells.length > 0
                              ? infosModal.item.sells.map((sells, index) => (
                                  <Styled.BoxText key={index}>
                                    <Title
                                      text={sells}
                                      family="bold"
                                      size="small"
                                    />
                                  </Styled.BoxText>
                                ))
                              : null}

                            {infosModal?.item?.priceSell?.length &&
                            infosModal.item.priceSell.length > 0 ? (
                              <Styled.BoxText>
                                <Title
                                  text="Valor do item:"
                                  marginTop="xxnano"
                                  size="xsmall"
                                />
                                <Title
                                  text="Comissão"
                                  marginTop="xxnano"
                                  size="xsmall"
                                />
                              </Styled.BoxText>
                            ) : null}

                            {infosModal?.item?.priceSell?.length &&
                            infosModal.item.priceSell.length > 0
                              ? infosModal.item.priceSell.map(
                                  (priceSell, index) => (
                                    <Styled.BoxText key={index}>
                                      <Title
                                        text={new Intl.NumberFormat('pt-BR', {
                                          style: 'currency',
                                          currency: 'BRL',
                                        }).format(priceSell)}
                                        family="bold"
                                        size="small"
                                      />
                                      <Title
                                        text={new Intl.NumberFormat('pt-BR', {
                                          style: 'currency',
                                          currency: 'BRL',
                                        }).format(priceSell * 0.2)}
                                        family="bold"
                                        size="small"
                                      />
                                    </Styled.BoxText>
                                  ),
                                )
                              : null}
                            {infosModal?.item?.priceSell?.length &&
                            infosModal.item.priceSell.length > 0 ? (
                              <>
                                <Styled.BoxText1>
                                  <Title
                                    text="Valor total dos itens:"
                                    size="xsmall"
                                    marginTop="xxnano"
                                  />
                                  <Title
                                    text="Comissão "
                                    size="xsmall"
                                    marginTop="xxnano"
                                  />
                                </Styled.BoxText1>
                                <Styled.BoxText>
                                  <Title
                                    text={new Intl.NumberFormat('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL',
                                    }).format(priceSellTotal)}
                                    family="bold"
                                    size="small"
                                  />
                                  <Title
                                    text={new Intl.NumberFormat('pt-BR', {
                                      style: 'currency',
                                      currency: 'BRL',
                                    }).format(comisisonItem)}
                                    family="bold"
                                    size="small"
                                  />
                                </Styled.BoxText>
                              </>
                            ) : null}
                          </Styled.TextInfos>
                          <Title
                            text="Valor total da comissão"
                            size="xsmall"
                            marginTop="xxnano"
                            align="center"
                          />
                          <Title
                            text={new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(totalComission)}
                            family="bold"
                            size="small"
                            align="center"
                          />
                        </Styled.BoxInfos>
                        <Title
                          text="Foi feito mais algum serviço ou venda?"
                          align="center"
                          marginTop="medium"
                          marginBottom="medium"
                          size="xsmall"
                          family="bold"
                        />
                        <Button
                          text="Adicionar"
                          size={100}
                          colorButton="error"
                          onPress={() => setModalVisible2(!modalVisible2)}
                        />
                        <Button
                          text="Finalizar comanda"
                          size={100}
                          colorButton="error"
                          onPress={() => finishOrder(infosModal)}
                        />

                        <Styled.Modal
                          animationType="slide"
                          transparent={true}
                          visible={modalVisible2}
                          onRequestClose={() => {
                            setModalVisible2(!modalVisible2);
                          }}>
                          <Styled.BoxModal>
                            <Styled.ModalView2>
                              <Title text="TesteHere" />
                              <Styled.Touch
                                onPress={() =>
                                  setModalVisible2(!modalVisible2)
                                }>
                                <Title text="Fechar" />
                              </Styled.Touch>
                              <InputForm
                                placeholder="Qual serviço foi feito?"
                                control={control}
                                name={'service'}
                                size="100%"
                                color="black"
                              />
                              <InputForm
                                placeholder="Qual o valor dele?"
                                control={control}
                                name={'priceService'}
                                size="100%"
                                color="black"
                              />
                              <Title
                                text="Foi feita alguma venda? Se sim."
                                marginTop="medium"
                                size="medium"
                                family="bold"
                              />
                              <InputForm
                                placeholder="Qual Produto?"
                                control={control}
                                name={'sell'}
                                size="100%"
                                color="black"
                              />
                              <InputForm
                                placeholder="Qual o valor dele?"
                                control={control}
                                name={'priceSell'}
                                size="100%"
                                color="black"
                              />
                              <Button
                                colorButton="error"
                                text="Adicionar"
                                size={100}
                                onPress={handleSubmit(onSubmit)}
                              />
                            </Styled.ModalView2>
                          </Styled.BoxModal>
                        </Styled.Modal>
                      </Styled.Scroll>
                    </Styled.ModalView1>
                  </Styled.BoxModal>
                </Styled.Modal>
              </Styled.BoxFlat>
            ) : (
              <Styled.NotProfisisonal>
                <Title
                  text="Selecione um profissional para exebir seus atendimentos"
                  size="medium"
                  align="center"
                  family="bold"
                />
              </Styled.NotProfisisonal>
            )}
          </Styled.Body>
        </>
      )}
    </Styled.Container>
  );
}
