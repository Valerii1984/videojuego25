import React from 'react';
import Svg, { G, Path, Defs, Filter, FeFlood, FeBlend, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite } from 'react-native-svg';

export const StoreIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <G filter="url(#filter0_i)">
      <Path
        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
        stroke="#FAFAFA"
        strokeWidth={2.57143}
        strokeLinejoin="round"
      />
    </G>
    <Defs>
      <Filter id="filter0_i" x={0} y={0} width={24.5} height={24.5} filterUnits="userSpaceOnUse"  >
        <FeFlood floodOpacity={0} result="BackgroundImageFix" />
        <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <FeColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <FeOffset dx={0.5} dy={0.5} />
        <FeGaussianBlur stdDeviation={0.25} />
        <FeComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <FeColorMatrix type="matrix" values="0 0 0 0 0.772549 0 0 0 0 0.486275 0 0 0 0 1 0 0 0 0.25 0" />
        <FeBlend mode="normal" in2="shape" result="effect1_innerShadow" />
      </Filter>
    </Defs>
  </Svg>
);
