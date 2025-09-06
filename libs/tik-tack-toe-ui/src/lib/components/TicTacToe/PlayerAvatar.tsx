import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Player } from "../../types/tic-tac-toe";
import {
  AnimatedStar,
  useBlinkingOpacity,
  useLoopingRotation,
  useAvatarStars,
} from "./Animation";

const { width } = Dimensions.get("window");
const AVATAR_SIZE = 60;

interface PlayerAvatarProps {
  photo: any;
  name: string;
  player: Player;
  currentPlayer: Player;
  winner: Player | "draw" | null;
  animatedStyle: any; // анимация подъёма аватара
  testID: string;
  boardHeight?: number;
  isFirstPlayer?: boolean;
}

const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  photo,
  name,
  player,
  currentPlayer,
  winner,
  animatedStyle,
  testID,
  boardHeight,
  isFirstPlayer,
}) => {
  // Победитель остаётся поднятым
  const isActive = (!winner && currentPlayer === player) || winner === player;

  const [showBackground, setShowBackground] = useState(false);

  const { activeStars, starTriggers, removeStar } = useAvatarStars(
    isActive && showBackground,
    {
      maxStars: 5,
      minIntervalMs: 500,
      maxIntervalMs: 1500,
    }
  );

  const rotation = useLoopingRotation(isActive && showBackground, {
    durationMs: 18000,
  });
  const blinkingOpacity = useBlinkingOpacity(
    !winner && currentPlayer === player,
    { lowOpacity: 0.3, durationMs: 200 }
  );

  // Очистка звезд при деактивации
  useEffect(() => {
    if (!isActive || !showBackground) {
      activeStars.forEach((starId) => removeStar(starId));
    }
  }, [isActive, showBackground, activeStars, removeStar]);

  // Включаем фон после анимации подъёма аватара
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowBackground(true), 100);
      return () => clearTimeout(timer);
    } else {
      setShowBackground(false);
    }
    return undefined;
  }, [isActive]);

  const renderTurnIndicator = () => {
    if (!(!winner && currentPlayer === player)) return null;

    return (
      <View style={styles.turnIndicatorAboveAvatar}>
        <Animated.Text
          style={[
            styles.turnTextAboveAvatar,
            player === "O" && styles.turnTextSecondPlayer,
            { opacity: blinkingOpacity },
          ]}
        >
          {player === "X" ? "Your turn" : `${name}'s turn`}
        </Animated.Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.playerContainer,
        boardHeight ? { height: boardHeight } : undefined,
      ]}
      testID={testID}
    >
      <LinearGradient
        colors={["rgba(43, 23, 178, 0)", "rgba(39, 25, 135, 0.3)"]}
        style={styles.gradientBackground}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        {isFirstPlayer ? (
          <Image
            source={require("../../assets/border_player.png")}
            style={[styles.leftBorderImage]}
            resizeMode="stretch"
          />
        ) : (
          <Image
            source={require("../../assets/border_player.png")}
            style={[styles.rightBorderImage]}
            resizeMode="stretch"
          />
        )}

        <View style={styles.contentContainer}>
          {/* Фон и звёзды для активного игрока или победителя */}
          {isActive && showBackground && (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.rotatingBackground,
                {
                  transform: [
                    {
                      rotate: rotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ["0deg", "360deg"],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Image
                source={
                  isFirstPlayer
                    ? require("../../assets/bg_player.png")
                    : require("../../assets/bg_player2.png")
                }
                style={styles.bgImage}
              />
              {activeStars.map((starId) => (
                <AnimatedStar
                  key={starId}
                  isActive={starTriggers.includes(starId)}
                  onComplete={() => removeStar(starId)}
                  isFirstPlayer={isFirstPlayer || false}
                />
              ))}
            </Animated.View>
          )}

          {renderTurnIndicator()}

          <Animated.View
            style={[
              styles.avatarContainer,
              // Определяем позицию контейнера (цвет рамки, фон и т.п.)
              currentPlayer === player || winner === player
                ? isFirstPlayer
                  ? styles.activeFirstPlayerContainer
                  : styles.activeSecondPlayerContainer
                : isFirstPlayer
                  ? styles.firstPlayerAvatar
                  : styles.secondPlayerAvatar,

              winner
                ? {
                    transform: [
                      {
                        translateY: winner === player ? -40 : 0, // победитель сверху, проигравший снизу
                      },
                    ],
                    borderWidth: winner === player ? 6 : 3,
                  }
                : animatedStyle, // обычная анимация в процессе игры
            ]}
          >
            <Image
              source={photo}
              style={[
                styles.avatar,
                isFirstPlayer
                  ? { backgroundColor: "#dc851b" }
                  : { backgroundColor: "#3d4ab0" },
              ]}
            />
          </Animated.View>

          <Text style={styles.playerName}>{name}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    alignItems: "center",
    width: width * 0.2,
    justifyContent: "flex-end",
  },
  gradientBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
    overflow: "hidden",
  },
  contentContainer: {
    alignItems: "center",
    minWidth: AVATAR_SIZE * 1.5,
    justifyContent: "flex-end",
  },
  avatarContainer: {
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
    zIndex: 999,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 50,
    resizeMode: "cover",
    zIndex: 999,
  },
  leftBorder: {
    position: "absolute",
    left: -2,
    bottom: 0,
    width: 3,
    zIndex: 1000,
    height: "100%",
    borderRadius: 1,
  },
  rightBorder: {
    position: "absolute",
    right: -2,
    width: 3,
    height: "100%",
    borderRadius: 1,
    bottom: 0,
  },
  playerName: {
    color: "white",
    position: "relative",
    fontFamily: "Fredoka",
    textTransform: "uppercase",
    width: 90,
    textAlign: "center",
    height: "auto",
    fontStyle: "normal",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  turnIndicatorAboveAvatar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    maxWidth: "100%",
    fontFamily: "Fredoka",
    position: "absolute",
    top: "-90%",
    zIndex: 10,
  },
  leftBorderImage: {
    position: "absolute",
    left: -1,
    bottom: 0,
    width: 3, // ширина бордера
    height: "100%",
    zIndex: 100000,
  },
  rightBorderImage: {
    position: "absolute",
    right: -2,
    bottom: 0,
    width: 3, // ширина бордера
    height: "100%",
    zIndex: 701,
  },

  turnTextAboveAvatar: {
    color: "#FFE97C",
    fontFamily: "Fredoka",
    fontSize: 15,
    lineHeight: 18.3,
    letterSpacing: 0,
    width: 100,
    height: "auto",
    textAlign: "center",
    verticalAlign: "middle",
    textShadowColor: "#B14EFF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  turnTextSecondPlayer: {
    color: "white",
    textShadowColor: "#B14EFF",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  firstPlayerAvatar: {
    borderWidth: 3,
    borderColor: "#FFE97C",
    shadowColor: "#C57CFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    borderRadius: 50,
    shadowRadius: 10,
    elevation: 10,
  },
  secondPlayerAvatar: {
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#ADEFFF",
  },
  activeFirstPlayerContainer: {
    borderRadius: 50,
    overflow: "hidden",
    position: "relative",
    borderWidth: 6,
    borderColor: "#FFE97C",
    shadowColor: "#C57CFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  activeSecondPlayerContainer: {
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
    borderWidth: 6,
    borderColor: "#B5F1FF",
  },
  rotatingBackground: {
    position: "absolute",
    top: -60,
    left: -10,
    width: AVATAR_SIZE + 50,
    height: AVATAR_SIZE + 50,
    zIndex: 700,
  },
  bgImage: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
});

export default PlayerAvatar;
