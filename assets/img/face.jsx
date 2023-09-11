import * as React from 'react';
import Svg, {Circle, Path, Defs, LinearGradient, Stop} from 'react-native-svg';

function Face(props) {
  return (
    <Svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Circle cx={20} cy={20} r={20} fill="url(#paint0_linear_0_464)" />
      <Path
        d="M27.448 26.116l.889-5.645h-5.558V16.81c0-1.545.775-3.051 3.264-3.051h2.528V8.953s-2.293-.382-4.485-.382c-4.58 0-7.57 2.705-7.57 7.598v4.302H11.43v5.645h5.088v13.648c1.021.156 2.066.236 3.13.236 1.065 0 2.11-.08 3.132-.236V26.116h4.67z"
        fill="#fff"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_0_464"
          x1={20}
          y1={0}
          x2={20}
          y2={39.8814}
          gradientUnits="userSpaceOnUse">
          <Stop stopColor="#18ACFE" />
          <Stop offset={1} stopColor="#0163E0" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

export default Face;
