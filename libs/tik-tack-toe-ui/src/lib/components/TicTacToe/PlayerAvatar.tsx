import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  StyleProp,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { Player } from "../../types/tic-tac-toe";
import {
  AnimatedStar,
  useBlinkingOpacity,
  useLoopingRotation,
  useAvatarStars,
} from "./Animation";

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

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

/**
 * FIXES:
 * - avatars scale down on small screens (were слишком крупные)
 * - "Your turn" is rendered above the horizon reliably (higher zIndex + responsive top)
 * - vertical border lines no longer overlap the avatar (behind + pointerEvents none)
 */
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
  const { width: w, height: h } = useWindowDimensions();
  const shortSide = Math.min(w, h);
  const longSide = Math.max(w, h);
  const isLandscape = w > h;

  /**
   * Avatar sizing rules:
   * - Small phones: smaller avatars to avoid crossing the arc ("horizon")
   * - Large phones / tablets: keep avatars comfortably big (do NOT shrink big screens)
   * We use longSide to detect "big" landscape phones (Pixel 8 etc.), because shortSide is small in landscape.
   */
  const isSmallDevice = shortSide < 390 || (shortSide < 430 && longSide < 780);

  const AVATAR_SIZE = useMemo(() => {
    if (isSmallDevice) {
      // keep inside arc on very small devices
      return clamp(Math.round(shortSide * 0.18), 64, 88);
    }

    // tablets / very large displays
    if (longSide >= 1100 || shortSide >= 700) {
      return clamp(Math.round(shortSide * 0.24), 120, 170);
    }

    // large phones in landscape (Pixel 8 etc.)
    if (isLandscape && longSide >= 850) {
      return clamp(Math.round(shortSide * 0.23), 96, 140);
    }

    // regular phones
    return clamp(Math.round(shortSide * 0.21), 90, 130);
  }, [shortSide, longSide, isLandscape, isSmallDevice]);

  const AVATAR_RADIUS = AVATAR_SIZE / 2;

  // push avatar + 'Your turn' slightly down on tiny screens so they don't cross the arc
  const smallDeviceDownShift = isSmallDevice
    ? Math.round(AVATAR_SIZE * 0.22)
    : 0;

  const starImage = isFirstPlayer
    ? require("../../assets/star-yellow.png")
    : require("../../assets/star-purple.png");

  const isActive = (!winner && currentPlayer === player) || winner === player;
  const [showBackground, setShowBackground] = useState(false);

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

  const stars = useMemo(
    () => [
      { angle: 250, distance: 1.15, scale: 1.5, rotate: "30deg", even: false },
      { angle: 180, distance: 0.85, scale: 1.4, rotate: "70deg", even: true },
      { angle: 120, distance: 1.35, scale: 1.2, rotate: "10deg", even: false },
      { angle: 320, distance: 1.65, scale: 1.5, rotate: "40deg", even: true },
      { angle: 0, distance: 1.65, scale: 1.2, rotate: "25deg", even: false },
      { angle: 40, distance: 1.75, scale: 1, rotate: "15deg", even: true },
    ],
    []
  );

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

    // In your UX: "Your turn" is for user (X). For bot (O) show "<name>'s turn".
    const text = player === "X" ? TTURN.yourTurn : TTURN.otherTurn(name);

    return (
      <View
        style={[
          styles.turnIndicatorAboveAvatar,
          {
            // ⬆️ на маленьких девайсах поднимаем выше,
            // большие экраны НЕ трогаем
            top: -Math.round(AVATAR_SIZE * (isSmallDevice ? 0.78 : 0.75)),
            minWidth: Math.round(AVATAR_SIZE * 1.15),
            maxWidth: Math.round(AVATAR_SIZE * 2.4),
            zIndex: 9999,
          },
        ]}
        pointerEvents="none"
      >
        <Animated.Text
          style={[
            styles.turnTextAboveAvatar,
            player === "O" && styles.turnTextSecondPlayer,
            {
              opacity: blinkingOpacity as unknown as number,
              fontSize: clamp(Math.round(AVATAR_SIZE * 0.28), 16, 25),
            },
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

  const containerWidth = useMemo(() => {
    // keep layout stable, but allow a bit more on tablets
    return clamp(Math.round(w * 0.26), 120, 260);
  }, [w]);

  return (
    <Animated.View
      style={[
        styles.playerContainer,
        { width: containerWidth, overflow: "visible" },
        smallDeviceDownShift
          ? { transform: [{ translateY: smallDeviceDownShift }] }
          : undefined,
        boardHeight ? { height: boardHeight } : undefined,
        style,
      ]}
      testID={testID}
    >
      {/* Border line behind avatar (no overlap) */}
      <View
        pointerEvents="none"
        style={[
          isFirstPlayer ? styles.leftBorderImage : styles.rightBorderImage,
          { zIndex: 0 },
        ]}
      >
        <Image
          source={require("../../assets/border_player.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="stretch"
        />
      </View>

      <View style={[styles.contentContainer, { overflow: "visible" }]}>
        <Animated.View
          style={[
            styles.avatarContentContainer,
            { width: containerWidth, zIndex: 9990 },
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
              {
                width:
                  currentPlayer === player || winner === player
                    ? AVATAR_SIZE + 12
                    : AVATAR_SIZE + 6,
                height:
                  currentPlayer === player || winner === player
                    ? AVATAR_SIZE + 12
                    : AVATAR_SIZE + 6,
                borderRadius: 999,
              },
              winner && { borderWidth: winner === player ? 6 : 3 },
            ]}
          >
            <Image
              source={photo}
              style={[
                styles.avatar,
                {
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: 999,
                  backgroundColor: isFirstPlayer ? "#dc851b" : "#3d4ab0",
                },
              ]}
            />
          </Animated.View>

          {renderTurnIndicator()}

          {isActive && showBackground && (
            <View style={styles.wrapper} pointerEvents="none">
              <Animated.View
                style={[
                  styles.rotatingBackground,
                  {
                    width: AVATAR_SIZE + 50,
                    height: AVATAR_SIZE + 50,
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
                    avatarSize={AVATAR_SIZE}
                  />
                ))}
              </Animated.View>

              <View
                style={[
                  styles.starWrapper,
                  { width: AVATAR_SIZE + 50, height: AVATAR_SIZE + 50 },
                ]}
              >
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

        <Text
          style={[
            styles.playerName,
            { fontSize: clamp(Math.round(AVATAR_SIZE * 0.24), 16, 25) },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {name}
        </Text>
      </View>
    </Animated.View>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  playerContainer: {
    alignItems: "center",
  },
  contentContainer: {
    alignItems: "center",
    minWidth: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  avatarContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarContainer: {
    overflow: "hidden",
    zIndex: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    resizeMode: "cover",
    zIndex: 999,
  },
  playerName: {
    color: "white",
    position: "relative",
    fontFamily: "Fredoka",
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
    position: "absolute",
    zIndex: 9999,
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
  },
  rightBorderImage: {
    position: "absolute",
    right: "-5%",
    bottom: 0,
    width: 3,
    height: "100%",
  },
  turnTextAboveAvatar: {
    color: "#FFE97C",
    fontFamily: "Fredoka",
    lineHeight: 22,
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
    shadowRadius: 10,
    elevation: 10,
  },
  secondPlayerAvatar: {
    borderWidth: 3,
    borderColor: "#ADEFFF",
  },
  activeFirstPlayerContainer: {
    overflow: "hidden",
    borderWidth: 6,
    borderColor: "#FFE97C",
    shadowColor: "#C57CFF",
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    alignItems: "center",
  },
  activeSecondPlayerContainer: {
    overflow: "hidden",
    borderWidth: 6,
    borderColor: "#C57CFF",
    alignItems: "center",
  },
  rotatingBackground: {},
  bgImage: { width: "100%", height: "100%" },
  wrapper: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  starWrapper: {
    position: "absolute",
    zIndex: 990,
  },
  star: {
    height: 20,
    width: 20,
  },
});

export default PlayerAvatar;
