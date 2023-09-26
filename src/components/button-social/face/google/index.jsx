/* eslint-disable no-console */
import React, {useState} from 'react';

import Google from '../../../../assets/img/google';

import ButtonSocial, {ButtonSocialProps} from '..';

export default function ButtonSocialGoogle({
  onPress,
  ...rest
}: Omit<ButtonSocialProps, 'children'>) {
  const [load, setLoad] = useState(false);

  return (
    <ButtonSocial {...rest} onPress={onPress} load={load}>
      <Google />
    </ButtonSocial>
  );
}
