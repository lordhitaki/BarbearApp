import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;

export const BoxFlat = styled.TouchableOpacity`
  width: 90%;
  background-color: ${props => props.theme.colors.white};
  margin-top: 6%;
  margin-left: 5%;
  border-radius: 15px;
  elevation: 4;
  padding: 5px;
  overflow: hidden;
`;

export const Flat = styled.FlatList`
  width: 100%;
`;

export const BoxText = styled.View`
  flex-direction: row;
  align-items: center;
`;
export const BoxText1 = styled.View`
  flex-direction: row;
  margin-top: 20px;
`;
export const BoxText2 = styled.View`
  flex-direction: column;
`;

export const Modal = styled.Modal``;

export const BoxModal = styled.View`
  margin-top: 50%;
  margin-left: 5%;
  width: 90%;
  height: 35%;
  background-color: ${props => props.theme.colors.white};
  border-radius: 15px;
  elevation: 5;
  padding: 10px;
`;

export const BoxBt = styled.View`
  flex-direction: row;
  position: absolute;
  bottom: 5%;
  width: 100%;
  justify-content: center;
  gap: 20px;
  margin-left: 3%;
`;

export const BoxInfos = styled.View`
  margin-right: 30px;
  margin-top: 15px;
  justify-content: space-around;
`;

export const BoxLogo = styled.View`
  margin-right: 20px;
`;

export const Img = styled.Image`
  width: 90px;
  height: 90px;
  object-fit: contain;
  border-radius: 55px;
`;

export const BoxFuck = styled.View`
  flex-direction: row;
  justify-content: space-around;
`;
