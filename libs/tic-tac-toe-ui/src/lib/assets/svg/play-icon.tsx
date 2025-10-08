import * as React from "react"
import Svg, { Path } from "react-native-svg"

function PlayIcon(props: any) {
  return (
    <Svg
      width={36}
      height={38}
      viewBox="0 0 36 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M32.356 20.762c-.737 2.798-4.217 4.776-11.177 8.73-6.729 3.822-10.093 5.734-12.804 4.966a6.78 6.78 0 01-2.966-1.752C3.417 30.696 3.417 26.797 3.417 19s0-11.696 1.992-13.706a6.779 6.779 0 012.966-1.751c2.711-.769 6.075 1.143 12.804 4.965 6.96 3.954 10.44 5.932 11.177 8.73a6.928 6.928 0 010 3.524z"
        stroke="#FAFAFA"
        strokeWidth={5.55555}
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export default PlayIcon;
