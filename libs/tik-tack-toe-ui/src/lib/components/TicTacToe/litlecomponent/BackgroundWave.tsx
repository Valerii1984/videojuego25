import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import Svg, {
  G,
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  ClipPath,
  Rect,
} from "react-native-svg";

interface BackgroundWaveProps {
  style?: StyleProp<ViewStyle>;
}

export default function BackgroundWave({ style }: BackgroundWaveProps) {
  return (
    <View style={style}>
      <Svg width="100%" height="100%" viewBox="0 0 1102 590" fill="none">
        <G clipPath="url(#clip0_3_2)">
          <Path
            d="M551 0C805.565 1.66828e-05 1036.07 39.0154 1202.97 102.125C1286.4 133.676 1354.01 171.276 1400.8 213.103C1424.2 234.015 1442.45 256.046 1454.88 279.01C1467.31 301.983 1474 326.068 1474 351.002C1474 375.934 1467.31 400.017 1454.88 422.99C1442.45 445.954 1424.2 467.985 1400.8 488.897C1354.01 530.724 1286.4 568.324 1202.97 599.874C1036.07 662.984 805.565 702 551 702C296.435 702 65.9312 662.984 -100.966 599.874C-184.404 568.324 -252.018 530.724 -298.806 488.897C-322.197 467.985 -340.454 445.954 -352.881 422.99C-365.312 400.017 -372 375.934 -372 351C-372 326.067 -365.312 301.983 -352.881 279.01C-340.454 256.046 -322.197 234.015 -298.806 213.103C-252.018 171.276 -184.404 133.676 -100.966 102.125C65.9312 39.0154 296.435 0 551 0Z"
            fill="url(#paint0_linear_3_2)"
            fillOpacity="0.7"
            stroke="url(#paint1_radial_3_2)"
            strokeWidth="3"
          />
        </G>
        <Defs>
          <LinearGradient
            id="paint0_linear_3_2"
            x1="560.166"
            y1="-2.49996"
            x2="560.166"
            y2="699.498"
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="#1A1053" />
            <Stop offset="1" stopColor="#240930" />
          </LinearGradient>
          <RadialGradient
            id="paint1_radial_3_2"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(560.17 13.3463) rotate(-180) scale(399.829 1960.37)"
          >
            <Stop offset="0.21116" stopColor="#C57CFF" />
            <Stop offset="0.999414" stopColor="#C57CFF" stopOpacity="0" />
          </RadialGradient>
          <ClipPath id="clip0_3_2">
            <Rect width="1102" height="590" fill="white" />
          </ClipPath>
        </Defs>
      </Svg>
    </View>
  );
}
