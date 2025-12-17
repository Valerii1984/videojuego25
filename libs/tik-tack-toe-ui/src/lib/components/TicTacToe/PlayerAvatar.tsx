import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  StyleProp,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Player } from "../../types/tic-tac-toe";
import {
  AnimatedStar,
  useBlinkingOpacity,
  useLoopingRotation,
  useAvatarStars,
} from "./Animation";

const { width, height } = Dimensions.get("window");
const AVATAR_SIZE = 110;
const skaleFactor = width / 1600;
const STAR_HEIGHT = (AVATAR_SIZE * 15 * skaleFactor) / 100;
const STAR_WIDTH = (AVATAR_SIZE * 10 * skaleFactor) / 100;

const AVATAR_RADIUS = AVATAR_SIZE / 2;

type LocaleTag =
  | "en-US"
  | "de-DE"
  | "es-ES"
  | "es-419"
  | "fr-FR"
  | "it-IT"
  | "pt-BR";

const normalizeLocale = (raw?: string): LocaleTag => {
  const s = (raw || "").toLowerCase().replace("_", "-");
  if (s.startsWith("de")) return "de-DE";
  if (s === "es-419") return "es-419";
  if (s.startsWith("es")) return "es-ES";
  if (s.startsWith("fr")) return "fr-FR";
  if (s.startsWith("it")) return "it-IT";
  if (s === "pt-br" || s.startsWith("pt")) return "pt-BR";
  return "en-US";
};

const TURN_STR: Record<
  LocaleTag,
  { yourTurn: string; otherTurn: (name: string) => string }
> = {
  "en-US": { yourTurn: "Your turn", otherTurn: (n) => `${n}'s turn` },
  "de-DE": { yourTurn: "Du bist dran", otherTurn: (n) => `${n} ist dran` },
  "es-ES": { yourTurn: "Tu turno", otherTurn: (n) => `Turno de ${n}` },
  "es-419": { yourTurn: "Tu turno", otherTurn: (n) => `Turno de ${n}` },
  "fr-FR": { yourTurn: "À toi", otherTurn: (n) => `À ${n}` },
  "it-IT": { yourTurn: "Tocca a te", otherTurn: (n) => `Tocca a ${n}` },
  "pt-BR": { yourTurn: "Sua vez", otherTurn: (n) => `Vez de ${n}` },
};

interface PlayerAvatarProps {
  photo: any;
  name: string;
  player: Player;
  currentPlayer: Player;
  winner: Player | "draw" | null;
  animatedStyle: any;
  testID: string;
  boardHeight?: number;
  isFirstPlayer?: boolean;
  lang?: string;
  style?: StyleProp<ViewStyle>;
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
  lang,
  style,
}) => {
  const isActive = (!winner && currentPlayer === player) || winner === player;
  const [showBackground, setShowBackground] = useState(false);

  const starImage = isFirstPlayer
    ? require("../../assets/star-yellow.png")
    : require("../../assets/star-purple.png");

  const { activeStars, starTriggers, removeStar } = useAvatarStars(
    isActive && showBackground,
    { maxStars: 5, minIntervalMs: 500, maxIntervalMs: 1500 }
  );

  const rotation = useLoopingRotation(isActive && showBackground, {
    durationMs: 18000,
  });

  const blinkingOpacity = useBlinkingOpacity(
    !winner && currentPlayer === player,
    { lowOpacity: 0.4, durationMs: 350 }
  );

  const blinkingOpacityOdd = useBlinkingOpacity(isActive, {
    lowOpacity: 0.4,
    durationMs: 2550,
  });
  const blinkingOpacityEven = useBlinkingOpacity(isActive, {
    lowOpacity: 0.45,
    durationMs: 2050,
  });
  const stars = [
    { angle: 250, distance: 1.15, scale: 1.5, rotate: "30deg", even: false },
    { angle: 180, distance: 0.85, scale: 1.4, rotate: "70deg", even: true },
    { angle: 120, distance: 1.35, scale: 1.2, rotate: "10deg", even: false },

    { angle: 320, distance: 1.65, scale: 1.5, rotate: "40deg", even: true },
    { angle: 0, distance: 1.65, scale: 1.2, rotate: "25deg", even: false },
    { angle: 40, distance: 1.75, scale: 1, rotate: "15deg", even: true },
  ];

  useEffect(() => {
    if (!isActive || !showBackground) {
      activeStars.forEach((starId) => removeStar(starId));
    }
  }, [isActive, showBackground, activeStars, removeStar]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (isActive) {
      timer = setTimeout(() => setShowBackground(true), 120);
    } else {
      setShowBackground(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isActive]);

  const locale = normalizeLocale(lang);
  const TTURN = TURN_STR[locale];

  const renderTurnIndicator = (): React.ReactElement | null => {
    const isPlayersTurn = !winner && currentPlayer === player;
    if (!isPlayersTurn) return null;

    const text = player === "X" ? TTURN.yourTurn : TTURN.otherTurn(name);

    return (
      <View style={styles.turnIndicatorAboveAvatar} pointerEvents="none">
        <Animated.Text
          style={[
            styles.turnTextAboveAvatar,
            player === "O" && styles.turnTextSecondPlayer,
            { opacity: blinkingOpacity as unknown as number },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          ellipsizeMode="tail"
        >
          {text}
        </Animated.Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.playerContainer,
        { overflow: "visible" },
        boardHeight ? { height: boardHeight } : undefined,
        style,
      ]}
      testID={testID}
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

      <View style={[styles.contentContainer, { overflow: "visible" }]}>
        <Animated.View
          style={[
            styles.avatarContentContainer,
            winner
              ? {
                  transform: [{ translateY: winner === player ? -40 : 0 }],
                }
              : animatedStyle,
          ]}
        >
          <Animated.View
            style={[
              styles.avatarContainer,
              currentPlayer === player || winner === player
                ? isFirstPlayer
                  ? styles.activeFirstPlayerContainer
                  : styles.activeSecondPlayerContainer
                : isFirstPlayer
                  ? styles.firstPlayerAvatar
                  : styles.secondPlayerAvatar,
              winner && {
                borderWidth: winner === player ? 6 : 3,
              },
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
          {renderTurnIndicator()}
          {isActive && showBackground && (
            <View style={styles.wrapper}>
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.rotatingBackground,
                  {
                    transform: [
                      {
                        rotate: (
                          rotation as unknown as Animated.AnimatedInterpolation<number>
                        ).interpolate({
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
                    isFirstPlayer={!!isFirstPlayer}
                  />
                ))}
              </Animated.View>
              <View style={styles.starWrapper}>
                {stars.map((star, i) => {
                  const animatedStyle = star.even
                    ? { opacity: blinkingOpacityEven }
                    : { opacity: blinkingOpacityOdd };

                  const rad = (star.angle * Math.PI) / 180;

                  const x = Math.cos(rad) * AVATAR_RADIUS * star.distance;
                  const y = Math.sin(rad) * AVATAR_RADIUS * star.distance;

                  return (
                    <Animated.View
                      key={i}
                      pointerEvents="none"
                      style={[
                        styles.star,
                        animatedStyle,
                        {
                          position: "absolute",
                          top: AVATAR_RADIUS + y,
                          left: AVATAR_RADIUS + x,
                          transform: [
                            { scale: star.scale },
                            { rotate: star.rotate },
                          ],
                        },
                      ]}
                    >
                      <Image
                        source={starImage}
                        style={{ width: 20, height: 20 }}
                        resizeMode="contain"
                      />
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          )}
        </Animated.View>
        <Text style={styles.playerName}>{name}</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    alignItems: "center",
    width: width * 0.22,
  },
  gradientBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  contentContainer: {
    alignItems: "center",
    minWidth: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  avatarContentContainer: {
    width: width * 0.22,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarContainer: {
    borderRadius: 150,
    overflow: "hidden",
    zIndex: 999,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 150,
    resizeMode: "cover",
    zIndex: 999,
  },
  playerName: {
    color: "white",
    position: "relative",
    fontFamily: "Fredoka",
    fontSize: 25,
    textTransform: "uppercase",
    marginVertical: "10%",
    width: "100%",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  turnIndicatorAboveAvatar: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    minWidth: 92,
    position: "absolute",
    top: -55,
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  leftBorderImage: {
    position: "absolute",
    left: "-5%",
    bottom: 0,
    width: 3,
    height: "100%",
    zIndex: 10,
  },
  rightBorderImage: {
    position: "absolute",
    right: "-5%",
    bottom: 0,
    width: 3,
    height: "100%",
    zIndex: 10,
  },
  turnTextAboveAvatar: {
    color: "#FFE97C",
    fontFamily: "Fredoka",
    fontSize: 25,
    lineHeight: 18.3,
    textAlign: "center",
    textShadowColor: "#B14EFF",
    textShadowRadius: 4,
    paddingHorizontal: 2,
  },
  turnTextSecondPlayer: {
    color: "white",
    textShadowColor: "#B14EFF",
    textShadowRadius: 4,
  },
  firstPlayerAvatar: {
    borderWidth: 3,
    borderColor: "#FFE97C",
    shadowColor: "#C57CFF",
    shadowOpacity: 1,
    borderRadius: 150,
    shadowRadius: 10,
    elevation: 10,
    width: AVATAR_SIZE + 6,
  },
  secondPlayerAvatar: {
    borderRadius: 150,
    borderWidth: 3,
    borderColor: "#ADEFFF",
    width: AVATAR_SIZE + 6,
  },
  activeFirstPlayerContainer: {
    borderRadius: 150,
    overflow: "hidden",
    borderWidth: 6,
    borderColor: "#FFE97C",
    shadowColor: "#C57CFF",
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    width: AVATAR_SIZE + 12,
    backgroundColor: "pink",
    alignItems: "center",
  },
  activeSecondPlayerContainer: {
    borderRadius: 150,
    overflow: "hidden",
    borderWidth: 6,
    borderColor: "#C57CFF",
    width: AVATAR_SIZE + 12,
    alignItems: "center",
  },
  rotatingBackground: {
    width: AVATAR_SIZE + 50,
    height: AVATAR_SIZE + 50,
  },
  bgImage: {
    width: "100%",
    height: "100%",
  },
  wrapper: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  starWrapper: {
    position: "absolute",
    width: AVATAR_SIZE + 50,
    height: AVATAR_SIZE + 50,
    zIndex: 990,
  },
  star: {
    height: STAR_HEIGHT,
    width: STAR_WIDTH,
  },
});

export default PlayerAvatar;
