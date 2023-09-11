/* eslint-disable no-console */
import React, {useState} from 'react';

import Face from '../../../../assets/img/face';

import ButtonSocial, {ButtonSocialProps} from '..';

export default function ButtonSocialFace({
  onPress,
  ...rest
}: Omit<ButtonSocialProps, 'children'>) {
  const [load, setLoad] = useState(false);

  return (
    <ButtonSocial {...rest} onPress={onPress} load={load}>
      <Face />
    </ButtonSocial>
  );
}
