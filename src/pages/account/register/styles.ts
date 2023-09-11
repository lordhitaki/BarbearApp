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
  top: ${props => props.theme.spacings.huge};
  z-index: 1;
  right: ${props => props.theme.spacings.xlarge};
`;

export const BoxInput = styled.View`
  width: 100%;
  align-items: center;
  margin-bottom: ${props => props.theme.spacings.xxnano};
`;

export const BoxSocial = styled.View`
  flex-direction: row;
`;

export const Scroll = styled.ScrollView``;

export const BoxQlqr = styled.View`
  width: 100%;
  align-items: center;
`;
