import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  View,
  Image,
} from "react-native";
import { Player } from "../../types/tic-tac-toe";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Confetti from "./litlecomponent/Confeti";
const { width } = Dimensions.get("window");

interface GameOverScreenProps {
  winner: Player | "draw" | null;
  gameComplete: boolean;
  winGif: any;
  onPlayAgain: () => void;
  animatedStyle: any;
  onPauseBackground?: () => void;
  onResumeBackground?: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  winner,
  gameComplete,
  winGif,
  onPlayAgain,
  animatedStyle,
  onPauseBackground,
  onResumeBackground,
}) => {
  const [showVictoryEffects, setShowVictoryEffects] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const startProgress = 0.3;

  const progress = useRef(new Animated.Value(startProgress)).current;
  const contentScale = useRef(new Animated.Value(0)).current;

  // **Анимация кнопки**
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (gameComplete) {
      // если есть победитель, запускаем анимацию кнопки
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      buttonScale.setValue(1);
    }
  }, [gameComplete, buttonScale]);

  useEffect(() => {
    if (gameComplete && winner !== "draw" && winner !== null) {
      // Приостанавливаем фоновую музыку при победе
      onPauseBackground?.();

      const timeout = setTimeout(() => setShowVictoryEffects(true), 300);

      const contentTimeout = setTimeout(() => {
        setShowContent(true);
        Animated.spring(contentScale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      }, 2000);

      return () => {
        clearTimeout(timeout);
        clearTimeout(contentTimeout);
      };
    } else if (gameComplete) {
      setShowContent(true);
      Animated.spring(contentScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      setShowVictoryEffects(false);
      setShowContent(false);
      contentScale.setValue(0);
    }
    return undefined;
  }, [gameComplete, winner, contentScale, onPauseBackground]);

  if (!gameComplete) return null;

  let message = "It's a draw!";
  let showWinGif = false;

  if (winner === "X") {
    message = "Congratulations!";
    showWinGif = true;
  } else if (winner === "O") {
    message = "You Lose";
  }

  return (
    <Animated.View style={[styles.gameOverContainer, animatedStyle]}>
      {showWinGif && (
        <View
          style={[styles.lottieContainer, { transform: [{ scale: 3 }] }]}
          pointerEvents="none"
        >
          <LottieView
            source={winGif}
            autoPlay
            loop
            style={styles.winGif}
            speed={0.5}
          />
        </View>
      )}
      {showContent && (
        <Animated.View style={{ transform: [{ scale: contentScale }] }}>
          <LinearGradient
            colors={[
              "rgba(125, 34, 241, 0)",
              "#7D22F1",
              "rgba(125, 34, 241, 0)",
            ]}
            locations={[0.1, 0.5, 0.9]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientTextContainer}
          >
            <View style={styles.centeredTextWrapper}>
              <Text style={styles.gameOverText}>{message}</Text>
            </View>
          </LinearGradient>

          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={styles.playAgainButton}
              onPress={() => {
                onResumeBackground?.(); // Возобновляем фоновую музыку
                onPlayAgain();
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.playAgainText}>Play Game Again</Text>
                <Image
                  source={require("../../assets/play.png")}
                  style={{ width: 24, height: 24, marginLeft: 8, marginTop: 5 }}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  gameOverContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  gradientTextContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,

    borderRadius: 10,
    marginBottom: 20,
  },
  centeredTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 400,
  },
  gameOverText: {
    fontFamily: "Fredoka",
    fontWeight: "600",
    width: "100%",
    fontSize: 48,
    height: 50,
    fontStyle: "normal",
    color: "white",
    textAlign: "center",

    lineHeight: 38, // 80% of 48
    letterSpacing: 0,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playAgainButton: {
    backgroundColor: "#FFC965",
    borderWidth: 1,
    borderColor: "#C57CFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    width: 300,
    justifyContent: "center", // центрируем содержимое по вертикали
    alignItems: "center", // центрируем содержимое по горизонтали
    flexDirection: "row", // оставляем текст + иконку в ряд
    alignSelf: "center", // центрируем саму кнопку на экране
  },
  playAgainText: {
    color: "#C57CFF",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center", // центрируем текст внутри кнопки
  },
  lottieContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
  winGif: {
    width: width * 4, // например 80% ширины экрана
    height: 300,
  },
});

export default GameOverScreen;
