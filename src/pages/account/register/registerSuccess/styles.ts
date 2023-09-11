import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;

export const BoxPass = styled.View`
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const TouchPass = styled.TouchableOpacity`
  position: absolute;
  top: 40px;
  z-index: 1;
  right: 30px;
`;

export const BoxInput = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 10px;
`;

export const BoxSocial = styled.View`
  flex-direction: row;
`;
