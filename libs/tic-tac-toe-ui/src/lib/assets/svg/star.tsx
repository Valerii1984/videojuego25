import React from 'react';
import Svg, { G, Path, Defs, Filter, FeFlood, FeBlend, FeGaussianBlur, RadialGradient, Stop } from 'react-native-svg';

export default function Star({ width = 109, height = 129 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 109 129" fill="none">
      <Defs>
        <Filter
          id="filter0"
          x="-4.02031"
          y="-4.13884"
          width="117.041"
          height="137.278"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend mode="normal" in2="BackgroundImageFix" in="SourceGraphic" result="shape" />
          <FeGaussianBlur stdDeviation="5.1" result="effect1_foregroundBlur" />
        </Filter>
        <Filter
          id="filter1"
          x="10.6719"
          y="12.5737"
          width="87.6562"
          height="103.853"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeBlend mode="normal" in2="BackgroundImageFix" in="SourceGraphic" result="shape" />
          <FeGaussianBlur stdDeviation="2.75" result="effect1_foregroundBlur" />
        </Filter>
        <RadialGradient
          id="paint0"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(54.5 64.5) rotate(90) scale(60.5 49.5)"
        >
          <Stop offset="0" stopColor="#FFE818" />
          <Stop offset="1" stopColor="#FFBE18" />
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
          d="M53.5544 18.7484C53.8639 17.8489 55.1361 17.8489 55.4456 18.7484L66.1008 49.718C66.1843 49.9608 66.358 50.1622 66.5859 50.2804L92.2886 63.6123C93.008 63.9855 93.008 65.0145 92.2886 65.3877L66.5859 78.7196C66.358 78.8378 66.1843 79.0392 66.1008 79.282L55.4456 110.252C55.1361 111.151 53.8639 111.151 53.5544 110.252L42.8992 79.282C42.8157 79.0392 42.642 78.8378 42.4141 78.7196L16.7114 65.3877C15.992 65.0145 15.992 63.9855 16.7114 63.6123L42.4141 50.2804C42.642 50.1622 42.8157 49.9608 42.8992 49.718L53.5544 18.7484Z"
          fill="white"
        />
      </G>
    </Svg>
  );
}
