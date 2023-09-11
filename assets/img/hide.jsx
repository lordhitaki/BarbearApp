import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function Hide(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M12 19c-.842 0-1.685-.178-2.504-.495M20.882 12.468C18.99 15.967 15.495 19 12 19M19.079 8.92a15.135 15.135 0 011.803 2.613.987.987 0 010 .935M5 19L19 5M9.773 14.227a3.15 3.15 0 014.455-4.455"
        stroke="gray"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17.044 6.956C15.497 5.759 13.748 5 12 5c-3.495 0-6.99 3.033-8.882 6.533a.987.987 0 000 .935c.946 1.749 2.292 3.381 3.838 4.577"
        stroke="gray"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Hide;
