import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;

export const IMG = styled.Image`
  width: 400px;
  height: 400px;
`;

export const BoxBTN = styled.View`
  width: 100%;
  align-items: center;
  gap: 30px;
`;

export const BoxAdm = styled.View`
  flex-direction: row;
  margin-top: ${props => props.theme.spacings.xsmall};
`;

export const Touch = styled.TouchableOpacity``;
