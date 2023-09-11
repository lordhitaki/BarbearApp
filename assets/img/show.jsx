import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Show(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        clipRule="evenodd"
        d="M3.118 12.467a.987.987 0 010-.935C5.01 8.033 8.505 5 12 5s6.99 3.033 8.882 6.533a.987.987 0 010 .935C18.99 15.967 15.495 19 12 19s-6.99-3.033-8.882-6.533z"
        stroke="gray"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14.121 9.879A3 3 0 119.88 14.12 3 3 0 0114.12 9.88"
        stroke="gray"
        strokeWidth={1.4286}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Show;
