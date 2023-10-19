import {css} from 'styled-components';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;

export const Touch = styled.TouchableOpacity`
  flex-direction: row;
  height: ${props => props.theme.spacings.xxhuge};
  width: 90%;
  background-color: ${props => props.theme.colors.white};
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  padding-left: 20px;
  border-radius: 30px;
  overflow: hidden;
`;
export const Touch1 = styled.TouchableOpacity`
  flex-direction: row;
  height: 15%;
  width: 100%;
  background-color: ${props => props.theme.colors.white};
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  padding-left: 20px;
  border-radius: 30px;
  elevation: 5;
`;

export const BoxResume = styled.View`
  height: 150px;
  width: 90%;
  background-color: ${props => props.theme.colors.white};
  border-radius: 15px;
  margin-top: 30px;
  elevation: 5;
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 20px;
`;

export const BoxLogo = styled.View``;

export const BoxInfos = styled.View`
  margin-right: 30px;
  margin-top: 15px;
`;

export const Img = styled.Image`
  width: 100px;
  height: 100px;
  object-fit: contain;
  border-radius: 55px;
`;

export const BoxButton = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
`;

export const BoxModal = styled.View`
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
  elevation: 5;
`;

export const Img1 = styled.Image`
  width: 23%;
  height: 100%;
  object-fit: contain;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
`;

export const Flat = styled.FlatList``;

export const BoxFlat = styled.View`
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
  width: 100%;
`;

export const BoxSunday = styled.View`
  height: 150px;
  width: 80%;
  background-color: ${props => props.theme.colors.white};
  border-radius: 15px;
  margin-top: 100px;
  elevation: 5;
  align-items: center;
  justify-content: center;
`;

export const BoxSelectTime = styled.View``;

export const SelectedTime = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.white};
  elevation: 5;
  width: 25%;
  align-items: center;
  border-radius: 10px;
  height: 30px;
  margin-top: 10px;
  ${props =>
    props.isSelected &&
    css`
      background-color: ${props => props.theme.colors.error};
    `}
`;

export const ScrollTime = styled.ScrollView`
  width: 100%;
`;

export const BoxTime = styled.View`
  width: 90%;
  height: auto;
  align-items: center;
  margin-left: 40px;
  margin-bottom: 30px;
  margin-top: 30px;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 20px;
`;
