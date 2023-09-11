import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color:${props => props.theme.colors.secondary}
  align-items: center;
`;

export const Img = styled.Image`
  width: 400px;
  height: 500px;
`;
