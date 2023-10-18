import React, {useEffect, useState} from 'react';

import * as Styled from './styles';
import {Title} from '../../../components/title';

export default function News() {
  return (
    <Styled.Container>
      <Title text="Aqui vai ser onde vem as novidades" />
    </Styled.Container>
  );
}
