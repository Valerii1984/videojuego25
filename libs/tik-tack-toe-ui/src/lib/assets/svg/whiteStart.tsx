// WhiteStar.tsx
import React from 'react';
import Svg, {
  G,
  Path,
  Defs,
  Filter,
  RadialGradient,
  Stop,
  FeFlood,
  FeBlend,
  FeGaussianBlur,
  FeOffset,
} from 'react-native-svg';

const WhiteStar = () => {
  return (
    <Svg width="25" height="25" viewBox="0 0 109 129" fill="none">
      <Defs>
        <Filter
          id="filter0"
          x="0.679688"
          y="0.561157"
          width="107.641"
          height="127.878"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <FeGaussianBlur
            stdDeviation="2.75"
            result="effect1_foregroundBlur_30_1781"
          />
        </Filter>

        <Filter
          id="filter1"
          x="9.09215"
          y="10.622"
          width="90.8123"
          height="107.756"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <FeGaussianBlur
            stdDeviation="2.5575"
            result="effect1_foregroundBlur_30_1781"
          />
        </Filter>

        <RadialGradient
          id="paint0"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(54.5 64.5) rotate(90) scale(60.5 49.5)"
        >
          <Stop offset="0" stopColor="white" />
          <Stop offset="1" stopColor="white" />
        </RadialGradient>
      </Defs>

      <G filter="url(#filter0)">
        <Path
          d="M53.5549 6.73448C53.8652 5.83672 55.1348 5.83672 55.4451 6.73448L69.07 46.1542C69.1539 46.397 69.3281 46.5982 69.5564 46.716L102.279 63.6114C103.001 63.984 103.001 65.016 102.279 65.3886L69.5564 82.284C69.3281 82.4018 69.1539 82.603 69.07 82.8458L55.4451 122.266C55.1348 123.163 53.8652 123.163 53.5549 122.266L39.93 82.8458C39.8461 82.603 39.6719 82.4018 39.4436 82.284L6.72093 65.3886C5.9993 65.016 5.9993 63.984 6.72093 63.6114L39.4436 46.716C39.6719 46.5982 39.8461 46.397 39.93 46.1542L53.5549 6.73448Z"
          fill="url(#paint0)"
        />
      </G>

      <G filter="url(#filter1)">
        <Path
          d="M53.6191 16.3638C53.9074 15.5281 55.0892 15.5281 55.3774 16.3638L66.6677 49.0955C66.7456 49.3213 66.9073 49.5085 67.1195 49.6183L94.2868 63.6739C94.957 64.0207 94.957 64.9792 94.2868 65.3259L67.1195 79.3816C66.9073 79.4914 66.7456 79.6786 66.6677 79.9044L55.3774 112.636C55.0892 113.472 53.9074 113.472 53.6191 112.636L42.3289 79.9044C42.251 79.6786 42.0892 79.4914 41.8771 79.3816L14.7098 65.3259C14.0396 64.9792 14.0396 64.0207 14.7098 63.6739L41.8771 49.6183C42.0892 49.5085 42.251 49.3213 42.3289 49.0955L53.6191 16.3638Z"
          fill="white"
        />
      </G>
    </Svg>
  );
};

export default WhiteStar;
