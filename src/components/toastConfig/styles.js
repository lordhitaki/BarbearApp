import styled from 'styled-components/native';

export const BoxToastSuccess = styled.View`
  width: 90%;
  background-color: ${props => props.theme.colors.white};
  border-left-width: 10px;
  border-color: ${props => props.theme.colors.toastSucces};
  border-radius: 10px;
`;

export const BoxToastError = styled.View`
  width: 90%;
  background-color: ${props => props.theme.colors.white};
  border-left-width: 10px;
  border-color: ${props => props.theme.colors.toastError};
  border-radius: 10px;
`;
