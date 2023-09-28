import React from 'react';

import * as Styled from './styles';
import {Title} from '../../../../components/title';

export default function MyScheduleUser() {
  return (
    <Styled.Container>
      <Title
        text="Minha agenda"
        size="medium"
        family="bold"
        marginTop="medium"
      />
    </Styled.Container>
  );
}
