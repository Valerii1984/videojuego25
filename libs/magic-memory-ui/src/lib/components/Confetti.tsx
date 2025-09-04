import React from "react";
import LottieView from "lottie-react-native";

// Определяем интерфейс для пропсов
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
      loop={true} // Конфетти сыплется всё время
      speed={0.5} // Медленное падение
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%", // Растянуть по ширине экрана
        height: "100%", // Растянуть по высоте экрана
        zIndex: 1000,
      }}
    />
  );
};

export default Confetti;
