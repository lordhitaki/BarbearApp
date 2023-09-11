import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;

export const BoxCenter = styled.View`
  width: 90%;
  align-items: center;
  margin-top: ${props => props.theme.spacings.huge};
`;

export const BoxText = styled.Text`
  text-align: center;
  top: ${props => props.theme.spacings.medium};
  width: 90%;
`;

export const BoxNext = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.error};
  justify-content: center;
  align-items: center;
  border-radius: 50px;
  height: 40px;
  width: 120%;
  right: ${props => props.theme.spacings.xxnano};
`;

export const Img = styled.Image`
  width: 100%;
  height: 45%;
`;
