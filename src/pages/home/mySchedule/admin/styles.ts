import {StyleSheet} from 'react-native';
import {lightThemeColor} from './mocks/theme';
import styled from 'styled-components/native';

export const styles = StyleSheet.create({
  calendar: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  header: {
    backgroundColor: 'lightgrey',
  },
  section: {
    backgroundColor: lightThemeColor,
    color: 'grey',
    textTransform: 'capitalize',
  },
});

export const Flat = styled.FlatList``;

export const Modal = styled.Modal``;

export const Touch = styled.TouchableOpacity``;

export const BoxModal = styled.View`
  margin-top: 50%;
  width: 100%;
  height: 28%;
  background-color: white;
  border-radius: 15px;
  elevation: 5;
  flex-direction: row;
`;

export const BoxBt = styled.View`
  flex-direction: row;
  position: absolute;
  bottom: 10px;
  width: 100%;
  justify-content: center;
  gap: 20px;
`;

export const BoxDescriptionClient = styled.View`
  margin-top: 20px;
  width: 60%;
`;
export const BoxDescription = styled.View`
  flex-direction: row;
  width: 100%;
  margin-top: 30px;
  justify-content: center;
`;

export const IMG = styled.Image`
  height: 120px;
  width: 120px;
  border-radius: 55px;
  margin-top: 20px;
  margin-left: 20px;
`;
