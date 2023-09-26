import {css} from 'styled-components';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;

export const Touch = styled.TouchableOpacity``;

export const BoxSelec = styled.View`
  width: 90%;
  height: 20%;
  background-color: white;
  elevation: 20;
  margin-top: 30px;
  border-radius: 15px;
  justify-content: center;
`;

export const BoxWeek = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 20px;
  padding-bottom: 10px;
`;

export const TouchCheck = styled.TouchableOpacity`
  border-radius: 10px;
  width: 40px;
  border-width: 1px;
  border-color: #fc0137;
  align-items: center;
  justify-content: center;
  ${props =>
    props.isSelected &&
    css`
      background-color: ${props => props.theme.colors.error};
      color: white;
    `}
`;

export const ScrollTime = styled.ScrollView`
  width: 100%;
`;

export const Hours = styled.View`
  width: 90%;
  height: auto;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 30px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  background-color: white;
  border-radius: 15px;
  padding: 10px;
`;

export const TouchHour = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.white};
  elevation: 30;
  width: 25%;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  height: 30px;
  margin-top: 10px;
  border-width: 1px;
  border-color: red;
`;