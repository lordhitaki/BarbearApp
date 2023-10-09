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
  margin-left: 60px;
  margin-top: 240px;
  align-items: center;
  width: 70%;
  height: 300px;
  background-color: white;
  border-radius: 15px;
  elevation: 50;
`;

export const BoxBt = styled.View`
  flex-direction: row;
  position: absolute;
  bottom: 10px;
  width: 100%;
  justify-content: center;
  gap: 20px;
`;
