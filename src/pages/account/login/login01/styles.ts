import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;

export const BoxInput = styled.View`
  width: 100%;
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
  top: ${props => props.theme.spacings.huge};
  z-index: 1;
  right: ${props => props.theme.spacings.xlarge};
`;

export const BoxForgot = styled.View`
  flex-direction: row;
  gap: 10px;
  margin-top: ${props => props.theme.spacings.xxnano};
  margin-bottom: ${props => props.theme.spacings.xsmall};
`;

export const Touch = styled.TouchableOpacity``;

export const BoxSocial = styled.View`
  flex-direction: row;
`;
