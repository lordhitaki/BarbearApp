import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
`;

export const Touch = styled.TouchableOpacity``;

export const Modal = styled.Modal``;

export const BoxModal = styled.View`
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
  margin-top: 50%;
  width: 90%;
  margin-left: 5%;
  border-radius: 10px;
  elevation: 5;
`;

export const BoxBt = styled.View`
  width: 90%;
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
`;
