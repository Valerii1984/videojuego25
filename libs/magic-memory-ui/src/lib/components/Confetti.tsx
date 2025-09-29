import React from "react";
import LottieView from "lottie-react-native";

interface ConfettiProps {
  isActive: boolean;
  level: number;
}

const Confetti: React.FC<ConfettiProps> = ({ isActive, level }) => {
  if (!isActive) return null;

  return (
    <LottieView
      source={require("../../assets/animations/success-animation.json")}
      autoPlay
      loop={true}
      speed={0.5}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1000,
      }}
    />
  );
};

export default Confetti;
