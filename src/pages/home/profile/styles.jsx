import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;
export const Body = styled.View`
  width: 100%;
`;

export const BoxProfilePic = styled.View`
  width: 90%;
  align-items: center;
  border-bottom-width: 0.2px;
`;
export const ProfilePic = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 55px;
  margin-bottom: 20px;
`;

export const Touch = styled.TouchableOpacity`
  width: 100%;
  height: 40px;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacings.small};
  padding-left: ${props => props.theme.spacings.xsmall};
  flex-direction: row;
  align-items: center;
`;
export const Touch1 = styled.TouchableOpacity`
  width: 20%;
  height: 40px;
  border-radius: 15px;
  background-color: ${props => props.theme.colors.white};
  elevation: 5;
  justify-content: center;
  margin-top: ${props => props.theme.spacings.xlarge};
  padding-left: 20px;
  align-items: center;
`;
export const InfoDados = styled.View`
  align-items: center;
  width: 100%;
  height: 40px;
  border-radius: 15px;
  background-color: ${props => props.theme.colors.white};
  elevation: 5;
  margin-top: ${props => props.theme.spacings.xlarge};
  padding-left: 20px;
  flex-direction: row;
`;

export const BoxModal = styled.View`
  justify-content: center;
  align-items: center;
`;

export const Modal = styled.Modal``;

export const Scroll = styled.ScrollView``;

export const ModalView = styled.View`
  width: 100%;
  border-radius: 20px;
  padding: 35px;
  background-color: ${props => props.theme.colors.secondary};
  height: 85%;
  elevation: 5;
`;

export const BoxInput = styled.View`
  margin-top: ${props => props.theme.spacings.xsmall};
  margin-bottom: ${props => props.theme.spacings.xsmall};
  gap: 20px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  margin-top: ${props => props.theme.spacings.xxnano};
  margin-left: ${props => props.theme.spacings.xxnano};
`;

export const Logo = styled.Image`
  width: 70px;
  height: 70px;
`;
export const Icon = styled.Image`
  width: 13px;
  height: 13px;
  object-fit: contain;
  margin-right: 5%;
  margin-top: ${props => props.theme.spacings.xxnano};
`;

export const BoxBT = styled.View`
  width: 100%;
  margin-top: ${props => props.theme.spacings.xlarge};
`;

export const HeadeTerms = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacings.xlarge};
`;

export const TouchTerms = styled.TouchableOpacity`
  position: absolute;
  right: ${props => props.theme.spacings.nano};
`;

export const BoxLoad = styled.View`
  margin-top: 20px;
  margin-bottom: 20px;
`;
