import { StyleSheet, Image, Animated, Dimensions, Easing } from "react-native";
import React, { useRef, useEffect } from "react";

interface EclipsBackGroundProps {
  isGameDone?: boolean;
  children: React.ReactNode;
}

const bgImage = require("../../../assets/ellipse.png");
const { height } = Dimensions.get("window");

export default function EclipsBackGround({
  children,
  isGameDone,
}: EclipsBackGroundProps) {
  const eclipsTransY = useRef(new Animated.Value(height)).current;
  const eclipsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isGameDone) return;
    Animated.parallel([
      Animated.timing(eclipsTransY, {
        toValue: height,
        duration: 650,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(eclipsOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isGameDone]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(eclipsTransY, {
        toValue: 0,
        duration: 900,
        delay: 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(eclipsOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: eclipsTransY }],
          opacity: eclipsOpacity,
        },
      ]}
    >
      <Image
        source={bgImage}
        style={[styles.bg, { transform: [{ scale: 1.5 }] }]}
        resizeMode="cover"
      />
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  bg: {
    position: "absolute",
    top: "40%",
    width: "100%",
    height: "100%",
  },
});
