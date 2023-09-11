import React from 'react';

import * as Styled from './styles';
import TabRoute from '../../routes/tabBar';
import User from '../../../assets/img/perfil';

export default function Home() {
  return (
    <Styled.Container>
      <TabRoute />
    </Styled.Container>
  );
}
