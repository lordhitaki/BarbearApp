import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
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
