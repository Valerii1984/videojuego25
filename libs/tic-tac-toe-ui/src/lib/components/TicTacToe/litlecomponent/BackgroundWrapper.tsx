import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Stop,
  Path,
  LinearGradient,
  Rect,
} from 'react-native-svg';

const wrapperStyles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    backgroundColor: '#16103E',
  },
  fullGradient: {
    ...StyleSheet.absoluteFillObject,
    height: '100%', // Покрывает весь экран
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type Props = {
  children: React.ReactNode;
  overlay?: boolean;
};

const BackgroundWrapper = ({ children, overlay = true }: Props) => {
  const { width, height } = useWindowDimensions(); // Оновлення розмірів при зміні орієнтації

  return (
    <View style={wrapperStyles.container}>
      <View style={wrapperStyles.fullGradient} />
      <Svg
        height={height}
        width={width}
        style={StyleSheet.absoluteFillObject}
        viewBox={`0 0 ${width} ${height}`}
      >
        <Defs>
          <RadialGradient id="baseGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#16103E" stopOpacity="1" />
            <Stop offset="100%" stopColor="#16103E" stopOpacity="1" />
          </RadialGradient>
          <LinearGradient id="bottomGlow" x1="50%" y1="100%" x2="50%" y2="0%">
            <Stop offset="0%" stopColor="#271B51" stopOpacity="0.3" />
            <Stop offset="20%" stopColor="#271B51" stopOpacity="0.25" />
            <Stop offset="30%" stopColor="#2D2057" stopOpacity="0.23" />
            <Stop offset="40%" stopColor="#1F145A" stopOpacity="0.2" />
            <Stop offset="60%" stopColor="#1A1053" stopOpacity="0.15" />
            <Stop offset="80%" stopColor="#16103E" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#16103E" stopOpacity="0" />
          </LinearGradient>
          <LinearGradient id="glowEdge" x1="50%" y1="100%" x2="50%" y2="0%">
            <Stop offset="0%" stopColor="#271B51" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#16103E" stopOpacity="0" />
          </LinearGradient>
          <RadialGradient id="starGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <Stop offset="10%" stopColor="#87CEEB" stopOpacity="0.8" />
            <Stop offset="20%" stopColor="#AE6AFF" stopOpacity="0.9" />
            <Stop offset="30%" stopColor="#9B5FFF" stopOpacity="1" />
            <Stop offset="40%" stopColor="#7246FF" stopOpacity="1" />
            <Stop offset="50%" stopColor="#5233FF" stopOpacity="1" />
            <Stop offset="70%" stopColor="#2A1A7F" stopOpacity="1" />
            <Stop offset="90%" stopColor="#1A1053" stopOpacity="1" />
            <Stop offset="100%" stopColor="#16103E" stopOpacity="0.9" />
          </RadialGradient>
          <RadialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="faintStarGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <Stop offset="10%" stopColor="#87CEEB" stopOpacity="0.2" />
            <Stop offset="20%" stopColor="#AE6AFF" stopOpacity="0.3" />
            <Stop offset="30%" stopColor="#9B5FFF" stopOpacity="0.2" />
            <Stop offset="40%" stopColor="#7246FF" stopOpacity="0.1" />
            <Stop offset="50%" stopColor="#5233FF" stopOpacity="0.1" />
            <Stop offset="70%" stopColor="#2A1A7F" stopOpacity="0.05" />
            <Stop offset="90%" stopColor="#1A1053" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#16103E" stopOpacity="0.05" />
          </RadialGradient>
          <RadialGradient id="faintCenterGradient" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <Stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#baseGradient)" />
        <Path
          d={`M 0 ${height} L ${width} ${height} L ${width} ${height * 0.8} L 0 ${height * 0.8} Z`} // Прямокутна смуга на всю ширину
          fill="url(#bottomGlow)"
        />
        <Path
          d={`M 0 ${height} L ${width} ${height} L ${width} ${height * 0.8} L 0 ${height * 0.8} Z`} // Прямокутна смуга на всю ширину
          fill="url(#glowEdge)"
        />
        <Circle
          cx={38.11}
          cy={44.71}
          r={Math.min(width, height) * 0.008}
          fill="black"
          opacity={0.2}
        />
        <Circle
          cx={38.11}
          cy={44.71}
          r={Math.min(width, height) * 0.009}
          fill="url(#faintStarGradient)"
        />
        <Circle
          cx={38.11}
          cy={44.71}
          r={Math.min(width, height) * 0.009}
          fill="url(#faintCenterGradient)"
        />
        <Circle
          cx={61.37}
          cy={188.17}
          r={Math.min(width, height) * 0.008}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={61.37}
          cy={188.17}
          r={Math.min(width, height) * 0.009}
          fill="url(#faintCenterGradient)"
        />
        <Circle
          cx={61.37}
          cy={188.17}
          r={Math.min(width, height) * 0.009}
          fill="url(#faintCenterGradient)"
        />
        <Circle
          cx={158.31}
          cy={250.21}
          r={Math.min(width, height) * 0.01}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={158.31}
          cy={250.21}
          r={Math.min(width, height) * 0.03}
          fill="url(#starGradient)"
        />
        <Circle
          cx={158.31}
          cy={250.21}
          r={Math.min(width, height) * 0.006}
          fill="url(#centerGradient)"
        />
        <Circle
          cx={18.16}
          cy={366.52}
          r={Math.min(width, height) * 0.008}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={18.16}
          cy={366.52}
          r={Math.min(width, height) * 0.009}
          fill="url(#faintCenterGradient)"
        />
        <Circle
          cx={18.16}
          cy={366.52}
          r={Math.min(width, height) * 0.009}
          fill="url(#faintCenterGradient)"
        />
        <Circle
          cx={274.63}
          cy={137.76}
          r={Math.min(width, height) * 0.01}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={274.63}
          cy={137.76}
          r={Math.min(width, height) * 0.03}
          fill="url(#starGradient)"
        />
        <Circle
          cx={274.63}
          cy={137.76}
          r={Math.min(width, height) * 0.006}
          fill="url(#centerGradient)"
        />
        <Circle
          cx={231.97}
          cy={356.83}
          r={Math.min(width, height) * 0.01}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={231.97}
          cy={356.83}
          r={Math.min(width, height) * 0.03}
          fill="url(#starGradient)"
        />
        <Circle
          cx={231.97}
          cy={356.83}
          r={Math.min(width, height) * 0.006}
          fill="url(#centerGradient)"
        />
        <Circle
          cx={369.62}
          cy={141.64}
          r={Math.min(width, height) * 0.008}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={369.62}
          cy={141.64}
          r={Math.min(width, height) * 0.009}
          fill="url(#starGradient)"
        />
        <Circle
          cx={369.62}
          cy={141.64}
          r={Math.min(width, height) * 0.009}
          fill="url(#centerGradient)"
        />
        <Circle
          cx={524.71}
          cy={25.34}
          r={Math.min(width, height) * 0.01}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={524.71}
          cy={25.34}
          r={Math.min(width, height) * 0.03}
          fill="url(#starGradient)"
        />
        <Circle
          cx={524.71}
          cy={25.34}
          r={Math.min(width, height) * 0.006}
          fill="url(#centerGradient)"
        />
        <Circle
          cx={569.3}
          cy={347.15}
          r={Math.min(width, height) * 0.01}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={569.3}
          cy={347.15}
          r={Math.min(width, height) * 0.03}
          fill="url(#starGradient)"
        />
        <Circle
          cx={569.3}
          cy={347.15}
          r={Math.min(width, height) * 0.006}
          fill="url(#centerGradient)"
        />
        <Circle
          cx={703.07}
          cy={225.01}
          r={Math.min(width, height) * 0.01}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={703.07}
          cy={225.01}
          r={Math.min(width, height) * 0.03}
          fill="url(#starGradient)"
        />
        <Circle
          cx={703.07}
          cy={225.01}
          r={Math.min(width, height) * 0.006}
          fill="url(#centerGradient)"
        />
        <Circle
          cx={751.53}
          cy={48.59}
          r={Math.min(width, height) * 0.01}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={751.53}
          cy={48.59}
          r={Math.min(width, height) * 0.03}
          fill="url(#starGradient)"
        />
        <Circle
          cx={751.53}
          cy={48.59}
          r={Math.min(width, height) * 0.006}
          fill="url(#centerGradient)"
        />
        <Circle
          cx={834.89}
          cy={327.75}
          r={Math.min(width, height) * 0.01}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={834.89}
          cy={327.75}
          r={Math.min(width, height) * 0.03}
          fill="url(#starGradient)"
        />
        <Circle
          cx={834.89}
          cy={327.75}
          r={Math.min(width, height) * 0.006}
          fill="url(#centerGradient)"
        />
        <Circle
          cx={173.82}
          cy={44.71}
          r={Math.min(width, height) * 0.01}
          fill="black"
          opacity={0.5}
        />
        <Circle
          cx={173.82}
          cy={44.71}
          r={Math.min(width, height) * 0.03}
          fill="url(#starGradient)"
        />
        <Circle
          cx={173.82}
          cy={44.71}
          r={Math.min(width, height) * 0.006}
          fill="url(#centerGradient)"
        />
      </Svg>
      {overlay && <View style={wrapperStyles.overlay} />}
      <View style={wrapperStyles.content}>{children}</View>
    </View>
  );
};

export default BackgroundWrapper;
