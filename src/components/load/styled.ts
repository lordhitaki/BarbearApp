import styled from 'styled-components/native';
import { LoadProps } from '.';

export const Container = styled.View<Pick<LoadProps, 'marginBottom' | 'marginTop'>>`
  margin-top: ${({ theme, marginTop }) => (marginTop ? theme.spacings[marginTop] : '0px')};
  margin-bottom: ${({ theme, marginBottom }) =>
    marginBottom ? theme.spacings[marginBottom] : '0px'};
  justify-content: center;
  align-items: center;
  flex: 1;
`;
