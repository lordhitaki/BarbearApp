import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;

export const BoxInput = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: 40px;
  margin-top: 40px;
`;

export const BoxSocial = styled.View`
  flex-direction: row;
`;

export const ErrorText = styled.Text`
  color: red;
  size: 18px;
`;

export const Teste = styled.View``;
