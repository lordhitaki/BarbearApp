import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;

export const Scroll = styled.ScrollView`
  height: 100%;
`;

export const Header = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.theme.spacings.xsmall};
`;

export const Touch = styled.TouchableOpacity`
  position: absolute;
  left: 10px;
`;
export const TouchClosed = styled.TouchableOpacity`
  position: absolute;
  top: 36px;
  right: 20px;
`;

export const Touch1 = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacings.small};
  padding-left: ${props => props.theme.spacings.xsmall};
  flex-direction: row;
  align-items: center;
`;

export const Icon = styled.Image`
  width: 13px;
  height: 13px;
  object-fit: contain;
  margin-right: 5%;
  margin-top: ${props => props.theme.spacings.nano};
`;

export const TouchPro = styled.TouchableOpacity`
  flex-direction: row;
  height: ${props => props.theme.spacings.xxhuge};
  width: 90%;
  background-color: ${props => props.theme.colors.white};
  align-items: center;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacings.xlarge};
  padding-left: 20px;
  border-radius: 30px;
  overflow: hidden;
`;

export const Modal = styled.Modal``;

export const BoxModal = styled.View`
  justify-content: center;
  align-items: center;
`;

export const ModalView = styled.View`
  width: 100%;
  border-radius: 20px;
  padding: 35px;
  background-color: ${props => props.theme.colors.secondary};
  height: 85%;
  elevation: 5;
`;
export const ModalView1 = styled.View`
  width: 100%;
  border-radius: 20px;
  padding: 35px;
  background-color: ${props => props.theme.colors.secondary};
  height: 100%;
  elevation: 5;
`;
export const ModalView2 = styled.View`
  width: 100%;
  border-radius: 20px;
  padding: 35px;
  background-color: ${props => props.theme.colors.secondary};
  height: 100%;
  elevation: 5;
`;

export const Touch2 = styled.TouchableOpacity`
  flex-direction: row;
  height: 15%;
  width: 100%;
  background-color: ${props => props.theme.colors.white};
  align-items: center;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacings.xlarge};
  padding-left: 20px;
  border-radius: 30px;
  elevation: 5;
`;

export const Img1 = styled.Image`
  width: 23%;
  height: 100%;
  object-fit: contain;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
`;

export const Body = styled.View`
  width: 100%;
  align-items: center;
`;

export const NotProfisisonal = styled.View`
  background-color: ${props => props.theme.colors.white};
  width: 90%;
  margin-top: 20px;
  border-radius: 10px;
  height: 100px;
  justify-content: center;
`;

export const BoxServices = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.white};
  width: 90%;
  margin-top: 20px;
  border-radius: 10px;
  padding: 10px;
  gap: 10px;
  overflow: hidden;
`;

export const BoxDescri = styled.View`
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
`;

export const TextDescr = styled.Text`
  overflow: hidden;
`;

export const TextInfos = styled.View`
  overflow: hidden;
  width: 100%;
  /* flex-direction: row; */
`;

export const Flat = styled.FlatList``;

export const BoxFlat = styled.View`
  width: 100%;
  margin-left: 10%;
`;

export const BoxInfos = styled.View`
  width: 100%;
  background-color: white;
  margin-top: 40px;
  border-radius: 15px;
  gap: 10px;
  padding: 10px;
`;

export const BoxText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 6px;
`;
export const BoxText1 = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 6px;
  border-top-width: 0.5px;
`;
