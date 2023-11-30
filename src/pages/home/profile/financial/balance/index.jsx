import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

import Header from '../../../../../components/header';
import {Title} from '../../../../../components/title';

import * as Styled from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native';
import LottieView from 'lottie-react-native';

export default function Balance() {
  const [user, setUser] = useState();
  const [priceTotal, setPriceTotal] = useState();
  const [priceSellTotal, setPriceSellTotal] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const CommissionCalculation = () => {
    let totalPrice = 0;
    let totalPriceSell = 0;

    if (user) {
      user.forEach(userData => {
        if (userData.item && userData.item.price) {
          totalPrice += userData.item.price.reduce(
            (acc, price) => acc + parseFloat(price),
            0,
          );
        }

        if (userData.item && userData.item.priceSell) {
          totalPriceSell += userData.item.priceSell.reduce(
            (acc, price) => acc + parseFloat(price),
            0,
          );
        }
      });
    }

    setPriceTotal(totalPrice * 0.4);
    setPriceSellTotal(totalPriceSell * 0.2);
  };

  const fetchUserInfo = async () => {
    try {
      const sanitizedUid = (await AsyncStorage.getItem('user'))?.replace(
        /"/g,
        '',
      );
      if (sanitizedUid) {
        const infoSnapshot = await firestore().collection('finished').get();
        const matchingData = [];

        infoSnapshot.forEach(doc => {
          const infoData = doc.data();
          if (
            infoData.item &&
            infoData.itemWithComission &&
            infoData.item.uidPro &&
            infoData.itemWithComission.item.uidPro === sanitizedUid
          ) {
            matchingData.push(infoData);
          }
        });

        setUser(matchingData);
      }
    } catch (error) {
      console.error('Erro ao consultar o Firestore:', error);
    }
    CommissionCalculation();
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserInfo();
  }, [priceSellTotal]);

  return (
    <Styled.Container>
      <Header title="Saldo" />
      <Styled.Scroll>
        <Styled.BoxBalance>
          <Title text="Balanço" align="center" family="bold" size="medium" />
          {isLoading ? (
            <LottieView
              source={require('../../../../../../assets/animation/lustre.json')}
              autoPlay
              loop
              style={{width: 400, height: 400}}
            />
          ) : (
            <>
              <Styled.BoxDesc>
                <Title text="Serviços: " family="bold" size="small" />
                <Title
                  text="Valor das comissões: "
                  family="bold"
                  size="small"
                />
              </Styled.BoxDesc>
              <Styled.BoxDesc>
                <Styled.Box>
                  {user
                    ? (() => {
                        const allTitles = user
                          .map(userItem => userItem.item.title)
                          .flat();
                        const titleCounts = allTitles.reduce((acc, title) => {
                          acc[title] = (acc[title] || 0) + 1;
                          return acc;
                        }, {});

                        const uniqueTitles = Array.from(new Set(allTitles));

                        return uniqueTitles.map((title, index) => {
                          const count = titleCounts[title];
                          const titleText =
                            count > 1
                              ? `${title} (x${count})`
                              : count === 1
                              ? title
                              : null;

                          if (titleText) {
                            return (
                              <Title key={title + index} text={titleText} />
                            );
                          } else {
                            return null;
                          }
                        });
                      })()
                    : null}
                </Styled.Box>

                <Styled.Box>
                  {user
                    ? (() => {
                        const allPrices = user
                          .map(userItem => userItem.item.price)
                          .flat();
                        const priceCounts = allPrices.reduce((acc, price) => {
                          const formattedPrice = new Intl.NumberFormat(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL',
                            },
                          ).format(price * 0.4);
                          acc[formattedPrice] = (acc[formattedPrice] || 0) + 1;
                          return acc;
                        }, {});

                        const uniquePrices = Array.from(new Set(allPrices));

                        return uniquePrices.map((price, index) => {
                          const formattedPrice = new Intl.NumberFormat(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL',
                            },
                          ).format(price * 0.4);
                          const count = priceCounts[formattedPrice];
                          const priceText =
                            count > 1
                              ? `${formattedPrice} x${count}`
                              : formattedPrice;

                          if (priceText) {
                            return (
                              <Title
                                key={formattedPrice + index}
                                text={priceText}
                              />
                            );
                          } else {
                            return null;
                          }
                        });
                      })()
                    : null}
                </Styled.Box>
              </Styled.BoxDesc>
              <Styled.ValueTotal>
                <Title text="Valor Total dos serviços: " family="bold" />
                <Title
                  text={new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(priceTotal)}
                  family="bold"
                />
              </Styled.ValueTotal>
              <Styled.BoxDesc>
                <Title text="Vendas: " family="bold" size="small" />
                <Title
                  text="Valor das comissões: "
                  family="bold"
                  size="small"
                />
              </Styled.BoxDesc>
              <Styled.BoxDesc>
                <Styled.Box>
                  {user
                    ? (() => {
                        const allSells = user
                          .map(userItem => userItem.item.sells)
                          .flat()
                          .filter(Boolean);

                        const sellsCounts = allSells.reduce((acc, sells) => {
                          acc[sells] = (acc[sells] || 0) + 1;
                          return acc;
                        }, {});

                        const uniqueSells = Array.from(new Set(allSells));

                        return uniqueSells.map((sells, index) => {
                          const count = sellsCounts[sells];
                          const sellsText =
                            count > 1
                              ? `${sells} (x${count})`
                              : count === 1
                              ? sells
                              : null;

                          if (sellsText) {
                            return (
                              <Title key={sells + index} text={sellsText} />
                            );
                          } else {
                            return null;
                          }
                        });
                      })()
                    : null}
                </Styled.Box>

                <Styled.Box>
                  {user
                    ? (() => {
                        const allPriceSells = user
                          .map(userItem => userItem.item.priceSell)
                          .flat()
                          .filter(Boolean); // Filtra para remover valores nulos

                        const priceSellCounts = allPriceSells.reduce(
                          (acc, priceSell) => {
                            const formattedPriceSell = new Intl.NumberFormat(
                              'pt-BR',
                              {
                                style: 'currency',
                                currency: 'BRL',
                              },
                            ).format(priceSell * 0.2);

                            acc[formattedPriceSell] =
                              (acc[formattedPriceSell] || 0) + 1;
                            return acc;
                          },
                          {},
                        );

                        const uniquePriceSells = Array.from(
                          new Set(allPriceSells),
                        );

                        return uniquePriceSells.map((priceSell, index) => {
                          const formattedPriceSell = new Intl.NumberFormat(
                            'pt-BR',
                            {
                              style: 'currency',
                              currency: 'BRL',
                            },
                          ).format(priceSell * 0.2);

                          const count = priceSellCounts[formattedPriceSell];
                          const priceSellText =
                            count > 1
                              ? `${formattedPriceSell} x ${count}`
                              : formattedPriceSell;

                          if (priceSellText) {
                            return (
                              <Title
                                key={formattedPriceSell + index}
                                text={priceSellText}
                              />
                            );
                          } else {
                            return null;
                          }
                        });
                      })()
                    : null}
                </Styled.Box>
              </Styled.BoxDesc>
              <Styled.ValueTotal>
                <Title text="Valor Total das vendas: " family="bold" />
                <Title
                  text={new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(priceSellTotal)}
                  family="bold"
                />
              </Styled.ValueTotal>
              <Styled.BoxDesc>
                <Title text="Valor Total" family="bold" />
                <Title
                  text={new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(priceSellTotal + priceTotal)}
                  family="bold"
                />
              </Styled.BoxDesc>
            </>
          )}
        </Styled.BoxBalance>
      </Styled.Scroll>
    </Styled.Container>
  );
}
