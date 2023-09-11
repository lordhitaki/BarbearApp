import styled from 'styled-components/native';

export const Error = styled.Text`
  margin-top: 2px;
  font-size: 14px;
  font-family: ${({ theme }) => theme.font.light};
  color: ${({ theme }) => theme.colors.error};
`;
