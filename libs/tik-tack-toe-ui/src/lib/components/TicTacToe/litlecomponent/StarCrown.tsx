import {
  View,
  Text,
  useWindowDimensions,
  Animated,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useBlinkingOpacity } from "../Animation";
import React from "react";

interface StarCrownProps {
  isFirstPlayer: boolean;
  children?: React.ReactNode;
}

const { width } = Dimensions.get("window");

export default function StarCrown({ isFirstPlayer, children }: StarCrownProps) {
  const starImage = isFirstPlayer
    ? require("../../../assets/star-yellow.png")
    : require("../../../assets/star-purple.png");
  const blinkingOpacityOdd = useBlinkingOpacity(true, {
    lowOpacity: 0.4,
    durationMs: 2550,
  });
  const blinkingOpacityEven = useBlinkingOpacity(true, {
    lowOpacity: 0.45,
    durationMs: 2050,
  });

  const stars = [
    {
      top: -130,
      offset: 0,
      scale: 0.7,
      rotate: "-8deg",
      even: false,
      side: "left",
    },
    {
      top: 0,
      offset: -40,
      scale: 0.5,
      rotate: "60deg",
      even: true,
      side: "left",
    },
    {
      top: 100,
      offset: -15,
      scale: 0.5,
      rotate: "20deg",
      even: false,
      side: "left",
    },
    {
      top: -130,
      offset: 0,
      scale: 0.6,
      rotate: "30deg",
      even: true,
      side: "right",
    },
    {
      top: 0,
      offset: -45,
      scale: 0.5,
      rotate: "35deg",
      even: false,
      side: "right",
    },
    {
      top: 100,
      offset: -15,
      scale: 0.4,
      rotate: "0deg",
      even: true,
      side: "right",
    },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.starWrapper}>
        {stars.map((star, i) => {
          const animatedStyle = star.even
            ? { opacity: blinkingOpacityEven }
            : { opacity: blinkingOpacityOdd };
          return (
            <Animated.View
              key={i}
              pointerEvents="none"
              style={[
                styles.star,
                animatedStyle,
                {
                  position: "absolute",
                  top: star.top,
                  [star.side === "left" ? "left" : "right"]: star.offset,
                  transform: [{ scale: star.scale }, { rotate: star.rotate }],
                },
              ]}
            >
              <Image
                source={starImage}
                style={styles.bgImage}
                resizeMode="contain"
              />
            </Animated.View>
          );
        })}
      </View>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: width * 0.22,
  },
  starWrapper: {
    backgroundColor: "green",
    position: "relative",
  },
  star: {
    height: 100,
    width: 150,
  },
  bgImage: {
    width: "100%",
    height: "100%",
  },
});
