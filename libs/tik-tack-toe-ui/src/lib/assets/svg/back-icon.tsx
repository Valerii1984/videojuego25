import * as React from "react"
import Svg, { Path } from "react-native-svg"

function BackIcon(props: any) {
  return (
    <Svg
      width={10}
      height={18}
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8.5 2s-7 5.155-7 7c0 1.845 7 7 7 7"
        stroke="#FAFAFA"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default BackIcon;
