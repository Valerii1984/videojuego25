import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
  Easing,
  ImageBackground,
  TouchableOpacity,
  ImageSourcePropType,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import type { TicTacToeProps } from "../types/tic-tac-toe";
import type { Language } from "../types/props";
import GameBoard from "./TicTacToe/GameBoard";
import PlayerAvatar from "./TicTacToe/PlayerAvatar";
import GameOverScreen from "./TicTacToe/GameOverScreen";
import { useTicTacToeGame } from "../hooks/useTicTacToeGame";
import { useTicTacToeAnimations } from "../hooks/useTicTacToeAnimations";
import { useSound } from "../hooks/useSound";
import * as ScreenOrientation from "expo-screen-orientation";

const ENABLE_BACKGROUND_MUSIC = false;
const SHOW_LANG_BADGE = false;

const STRINGS: Record<Language, { langBadge: (code: Language) => string }> = {
  en: { langBadge: (c) => c.toUpperCase() },
  es: { langBadge: (c) => c.toUpperCase() },
  uk: { langBadge: (c) => c.toUpperCase() },
  de: { langBadge: (c) => c.toUpperCase() },
  fr: { langBadge: (c) => c.toUpperCase() },
  pl: { langBadge: (c) => c.toUpperCase() },
  it: { langBadge: (c) => c.toUpperCase() },
  pt: { langBadge: (c) => c.toUpperCase() },
};

const DEFAULTS = {
  backgroundImage:
    require("../assets/WTP_BGS_ALL_0048.png") as ImageSourcePropType,
  name1: "Player 1",
  name2: "Player 2",
  photo1: require("../assets/6.png") as ImageSourcePropType,
  photo2: require("../assets/81.png") as ImageSourcePropType,

  winGif: require("../assets/animations/success-animation.json") as any,
  lang: "en" as Language,
};

const resolveImage = (src?: string | ImageSourcePropType) =>
  typeof src === "string" ? { uri: src } : src;

/** Нормализация длинных тэгов в короткий код для GameOverScreen */
type ShortLang = "en" | "es" | "pt" | "pl" | "uk" | "de" | "fr" | "it";
const toShortLang = (raw?: string): ShortLang => {
  const s = (raw || "").toLowerCase().replace("_", "-");
  if (s.startsWith("pl")) return "pl";
  if (s.startsWith("uk") || s === "ua" || s.startsWith("uk-ua")) return "uk";
  if (s.startsWith("de")) return "de";
  if (s === "es-419" || s.startsWith("es")) return "es";
  if (s.startsWith("fr")) return "fr";
  if (s.startsWith("it")) return "it";
  if (s === "pt-br" || s.startsWith("pt")) return "pt";
  return "en";
};

type ShortProps = {
  props?: {
    lang?: Language;
    background?: string;
    userAvatar?: string;
    enemyCard?: string;
  };

  lang?: Language;
  background?: string;
  userAvatar?: string;
  enemyCard?: string;

  backgroundImage?: ImageSourcePropType;
  name1?: string;
  name2?: string;
  photo1?: ImageSourcePropType;
  photo2?: ImageSourcePropType;
  winGif?: any;
};

const TicTacToe: React.FC<ShortProps> = (rawProps) => {
  const p = (rawProps.props ?? rawProps) as Required<ShortProps>["props"] &
    Omit<ShortProps, "props">;

  const lang: Language = (p.lang as Language) ?? DEFAULTS.lang;
  const L = STRINGS[lang] ?? STRINGS.en;
  const shortLang = toShortLang(lang); // <- передаём сюда

  const {
    background,
    userAvatar,
    enemyCard,

    backgroundImage = DEFAULTS.backgroundImage,
    name1 = DEFAULTS.name1,
    name2 = DEFAULTS.name2,
    photo1 = DEFAULTS.photo1,
    photo2 = DEFAULTS.photo2,
    winGif = DEFAULTS.winGif,
  } = p as any;

  const resolvedBackground = background
    ? { uri: background }
    : resolveImage(backgroundImage);
  const resolvedPhoto1 = userAvatar
    ? { uri: userAvatar }
    : resolveImage(photo1);
  const resolvedPhoto2 = enemyCard ? { uri: enemyCard } : resolveImage(photo2);

  const [boardHeight, setBoardHeight] = useState<number>(0);

  const [showHint, setShowHint] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [screenH, setScreenH] = useState(Dimensions.get("window").height);
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setScreenH(window.height);
    });
    return () => {
      sub?.remove?.();
    };
  }, []);

  const {
    playBackgroundMusic,
    stopBackgroundMusic,
    playNotificationSound,
    playVictorySound,
    playSadGameSound,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
  } = useSound();

  const {
    setIsGameStarted,
    gameState,
    bestMove,
    gameComplete,
    handleCellPress,
    resetGame,
  } = useTicTacToeGame(() => {
    playNotificationSound();
  });

  const {
    player1Style,
    player2Style,
    gameContainerStyle,
    congratsContainerStyle,

    resetAnimations,
  } = useTicTacToeAnimations(
    gameState.currentPlayer,
    gameState.winner,
    gameComplete
  );

  const introAnim = useRef(new Animated.Value(0)).current;
  const introStyle = {
    opacity: introAnim,
    transform: [
      {
        translateY: introAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  const ellipseTranslateY = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const ellipseOpacity = useRef(new Animated.Value(0)).current;

  const hintScale = useRef(new Animated.Value(1)).current;
  const hintAnimatedStyle = {
    transform: [{ scale: hintScale }],
    opacity: 1,
  };
  const animateHintButton = (toValue: number) => {
    Animated.timing(hintScale, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    StatusBar.setHidden(true, "none");

    (async () => {
      if (Platform.OS === "android") {
        try {
          const NB: any = await import("expo-navigation-bar");
          try {
            await NB.setBackgroundColorAsync("#16103E");
          } catch {}
          try {
            await NB.setVisibilityAsync("hidden");
          } catch {}
          try {
            await NB.setBehaviorAsync("inset-swipe");
          } catch {}
        } catch (err) {
          console.warn("NavigationBar import/ops error:", err);
        }
      }
    })();

    const sub = Dimensions.addEventListener("change", async () => {
      if (Platform.OS === "android") {
        try {
          const NB: any = await import("expo-navigation-bar");
          await NB.setVisibilityAsync("hidden");
        } catch {}
      }
    });

    return () => {
      StatusBar.setHidden(false, "none");
      if (Platform.OS === "android") {
        (async () => {
          try {
            const NB: any = await import("expo-navigation-bar");
            await NB.setVisibilityAsync("visible");
          } catch {}
        })();
      }

      sub?.remove?.();
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch {}

      if (ENABLE_BACKGROUND_MUSIC) {
        playBackgroundMusic();
      }
      setIsGameStarted(true);

      introAnim.setValue(0);
      Animated.timing(introAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        if (mounted) resetAnimations();
      });

      ellipseTranslateY.setValue(Dimensions.get("window").height);
      ellipseOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(ellipseTranslateY, {
          toValue: 0,
          duration: 1500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ellipseOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    })();

    return () => {
      stopBackgroundMusic();
      let t = hintTimerRef.current;
      if (t) clearTimeout(t);
    };
  }, []);

  const handleResetGame = () => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setShowHint(false);

    resetGame();
    resetAnimations();
    hintScale.setValue(1);
    setIsGameStarted(true);

    if (ENABLE_BACKGROUND_MUSIC) {
      playBackgroundMusic();
    }

    introAnim.setValue(0);
    Animated.timing(introAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    ellipseTranslateY.setValue(20);
    Animated.parallel([
      Animated.timing(ellipseTranslateY, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ellipseOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ImageBackground
      source={resolvedBackground}
      style={styles.container}
      testID="tic-tac-toe-game"
    >
      <Animated.View
        style={[styles.gameContainer, introStyle, gameContainerStyle]}
        testID="game-content"
      >
        <View>
          <Animated.Image
            source={require("../assets/ellipse.png")}
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              width: "100%",
              height: Dimensions.get("window").height,
              resizeMode: "cover",
              zIndex: 0,
              opacity: ellipseOpacity,
              transform: [{ translateY: ellipseTranslateY }],
            }}
          />

          <Animated.View
            style={[
              styles.playersContainer,
              { transform: [{ translateY: ellipseTranslateY }] },
            ]}
          >
            <View style={{ marginRight: 20 }}>
              <PlayerAvatar
                photo={resolvedPhoto1}
                name={name1}
                player="X"
                currentPlayer={gameState.currentPlayer}
                winner={gameState.winner}
                animatedStyle={player1Style}
                testID="player1-container"
                boardHeight={boardHeight}
                isFirstPlayer={true}
              />
            </View>

            <GameBoard
              board={gameState.board}
              onCellPress={handleCellPress}
              winningLine={gameState.winningLine}
              bestMove={bestMove}
              photo1={resolvedPhoto1}
              photo2={resolvedPhoto2}
              onLayout={(e) => setBoardHeight(e.nativeEvent.layout.height)}
              showHint={showHint}
              onHintUsed={() => setShowHint(false)}
              onVictory={playVictorySound}
              onBotVictory={() => playSadGameSound()}
            />

            <View style={{ marginLeft: 20 }}>
              <PlayerAvatar
                photo={resolvedPhoto2}
                name={name2}
                player="O"
                currentPlayer={gameState.currentPlayer}
                winner={gameState.winner}
                animatedStyle={player2Style}
                testID="player2-container"
                boardHeight={boardHeight}
                isFirstPlayer={false}
              />
            </View>
          </Animated.View>
        </View>

        <View style={styles.topBar} pointerEvents="box-none">
          {SHOW_LANG_BADGE && !!lang && (
            <View style={styles.centerTopBar}>
              <Text style={{ color: "#fff", fontFamily: "Fredoka" }}>
                {L.langBadge(lang)}
              </Text>
            </View>
          )}

          <Animated.View
            style={[
              styles.hintButton,
              hintAnimatedStyle,
              { top: Math.max(34, Math.round(screenH / 2 - 20)) },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => animateHintButton(0.9)}
              onPressOut={() => animateHintButton(1)}
              onPress={() => {
                playNotificationSound();
                animateHintButton(1.08);

                setShowHint(true);
                if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
                hintTimerRef.current = setTimeout(
                  () => setShowHint(false),
                  2500
                );
              }}
            >
              <View style={styles.hintGlow}>
                <View style={styles.hintBorder}>
                  <LinearGradient
                    colors={["#FFB380", "#D16C00"]}
                    style={styles.hintButtonInner}
                  >
                    <Text style={styles.hintText}>?</Text>
                  </LinearGradient>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      <GameOverScreen
        winner={gameState.winner}
        gameComplete={gameComplete}
        winGif={resolveImage(winGif)}
        onPlayAgain={handleResetGame}
        animatedStyle={congratsContainerStyle}
        onPauseBackground={pauseBackgroundMusic}
        onResumeBackground={resumeBackgroundMusic}
        lang={shortLang} // передаём короткий код; в GameOverScreen он мапится на нужный тег
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: "100%" },
  gameContainer: { flex: 1, justifyContent: "center", height: "80%" },
  playersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: "10%",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  centerTopBar: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 50,
    transform: [{ translateY: -26 }],
    top: 54,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 980,
  },
  hintButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    right: 30,
  },
  hintGlow: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 14,
    shadowColor: "rgba(144, 33, 232, 0.8)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
  },
  hintBorder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "rgba(255, 229, 124, 1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1002,
    backgroundColor: "transparent",
  },
  hintButtonInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  hintText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "FredokaSemiBold",
    textAlign: "center",
  },
});

export default TicTacToe;
