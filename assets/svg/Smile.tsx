import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';
const Smile = (props: SvgProps) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={800}
        height={800}
        viewBox="0 0 330 330"
        {...props}>
        <Path d="M165 0C74.019 0 0 74.019 0 165s74.019 165 165 165 165-74.019 165-165S255.981 0 165 0zm0 300c-74.439 0-135-60.561-135-135S90.561 30 165 30s135 60.561 135 135-60.561 135-135 135z" />
        <Path d="M205.306 205.305c-22.226 22.224-58.386 22.225-80.611.001-5.857-5.858-15.355-5.858-21.213 0-5.858 5.858-5.858 15.355 0 21.213 16.963 16.963 39.236 25.441 61.519 25.441 22.276 0 44.56-8.482 61.519-25.441 5.858-5.857 5.858-15.355 0-21.213-5.859-5.859-15.357-5.858-21.214-.001zM115.14 147.14c3.73-3.72 5.86-8.88 5.86-14.14s-2.13-10.42-5.86-14.14c-3.72-3.72-8.88-5.86-14.14-5.86-5.271 0-10.42 2.14-14.141 5.86C83.13 122.58 81 127.74 81 133s2.13 10.42 5.859 14.14C90.58 150.87 95.74 153 101 153s10.42-2.13 14.14-5.86zM229 113c-5.26 0-10.42 2.14-14.141 5.86A20.137 20.137 0 0 0 209 133c0 5.27 2.14 10.42 5.859 14.14C218.58 150.87 223.74 153 229 153s10.42-2.13 14.14-5.86c3.72-3.72 5.86-8.87 5.86-14.14 0-5.26-2.141-10.42-5.86-14.14-3.72-3.72-8.88-5.86-14.14-5.86z" />
    </Svg>
);
export default Smile;