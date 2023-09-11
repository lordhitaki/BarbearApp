import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Back(props) {
  return (
    <Svg
      width={31}
      height={24}
      viewBox="0 0 31 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M9.57 5.93L3.5 12l6.07 6.07M27 12H4"
        stroke="#000"
        strokeWidth={1.5}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Back;
