import styled from 'styled-components/native';
import {Platform} from 'react-native';

export const Button = styled.TouchableOpacity`
  width: ${!Platform.OS ? '30%' : '35%'};
  height: 60px;
  align-items: center;
  border-width: 2px;
  elevation: 10;
  box-shadow: ${({theme}) => theme.colors.border} 0 2px 5px;
  background-color: ${({theme}) => theme.colors.transparent};
  border-color: ${({theme}) => theme.colors.transparent};
  flex-direction: row;
  gap: 10px;
  padding-left: 6px;
  border-radius: 30px;
`;
