import React from "react";
import { ImageBackground } from "react-native";
import styles from "./CanvasBackground.styles";

const backgroundImage = require("../../assets/images/Background.png");

type CanvasBackgroundProps = {
  width: number;
  height: number;
};

const CanvasBackground: React.FC<CanvasBackgroundProps> = ({
  width,
  height,
}) => {
  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={[styles.background, { width, height }]}
    />
  );
};

export default CanvasBackground;
