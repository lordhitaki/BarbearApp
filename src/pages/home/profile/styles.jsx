import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;
export const Body = styled.View`
  width: 90%;
`;

export const Touch = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  border-radius: 15px;
  background-color: white;
  elevation: 20;
  justify-content: center;
  margin-top: 30px;
  padding-left: 20px;
  margin-bottom: 20px;
`;
export const Touch1 = styled.TouchableOpacity`
  width: 20%;
  height: 40px;
  border-radius: 15px;
  background-color: white;
  elevation: 20;
  justify-content: center;
  margin-top: 30px;
  padding-left: 20px;
  align-items: center;
`;
export const InfoDados = styled.View`
  align-items: center;
  width: 100%;
  height: 40px;
  border-radius: 15px;
  background-color: white;
  elevation: 20;
  margin-top: 30px;
  padding-left: 20px;
  flex-direction: row;
`;

export const BoxModal = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Modal = styled.Modal``;

export const ModalView = styled.View`
  width: 100%;
  border-radius: 20px;
  padding: 35px;
  background-color: ${props => props.theme.colors.secondary};
  height: 85%;
  elevation: 30;
`;

export const BoxTextReset = styled.Text`
  flex-direction: row;
`;
export const BT = styled.View`
  flex-direction: row;
  margin-top: 30px;
`;

export const ErrorText = styled.Text`
  color: red;
  size: 100px;
`;

export const BoxInput = styled.View`
  margin-top: 20px;
  margin-bottom: 20px;
  gap: 20px;
`;
