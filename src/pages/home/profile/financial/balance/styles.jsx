import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;

export const Scroll = styled.ScrollView`
  width: 100%;
`;

export const BoxBalance = styled.View`
  background-color: ${props => props.theme.colors.white};
  width: 90%;
  border-radius: 15px;
  gap: 10px;
  margin-left: 5%;
  margin-bottom: 5%;
`;

export const BoxDesc = styled.View`
  width: 100%;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
`;
export const ValueTotal = styled.View`
  width: 100%;
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
  border-top-width: 0.5px;
  border-bottom-width: 0.5px;
`;

export const Flat = styled.FlatList``;

export const Box = styled.View``;
