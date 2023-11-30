import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
`;

export const Img = styled.Image`
  width: 400px;
  height: 500px;
`;

export const Touch = styled.TouchableOpacity``;

export const Photo = styled.Image`
  width: 200px;
  height: 200px;
`;

export const Inpt = styled.TextInput`
  width: 90%;
  background-color: white;
  border-radius: 15px;
  padding: 10px;
  font-size: 16px;
`;
export const Flat = styled.FlatList``;

export const BoxFlat = styled.View`
  width: 90%;
  height: 100%;
`;
export const ContainerNews = styled.View`
  border-width: 0.5px;
  margin-top: 30px;
`;

export const BoxNewsImg = styled.View`
  width: 90%;
  height: 200px;
  elevation: 1;
`;

export const NewsImg = styled.Image`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
