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

/** ——— локали как в Magic Memory ——— */
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

const I18N: Record<
  LocaleTag,
  { player1: string; player2: string; badge: (c: string) => string }
> = {
  "en-US": {
    player1: "Player 1",
    player2: "Player 2",
    badge: (c) => c.toUpperCase(),
  },
  "de-DE": {
    player1: "Spieler 1",
    player2: "Spieler 2",
    badge: (c) => c.toUpperCase(),
  },
  "es-ES": {
    player1: "Jugador 1",
    player2: "Jugador 2",
    badge: (c) => c.toUpperCase(),
  },
  "es-419": {
    player1: "Jugador 1",
    player2: "Jugador 2",
    badge: (c) => c.toUpperCase(),
  },
  "fr-FR": {
    player1: "Joueur 1",
    player2: "Joueur 2",
    badge: (c) => c.toUpperCase(),
  },
  "it-IT": {
    player1: "Giocatore 1",
    player2: "Giocatore 2",
    badge: (c) => c.toUpperCase(),
  },
  "pt-BR": {
    player1: "Jogador 1",
    player2: "Jogador 2",
    badge: (c) => c.toUpperCase(),
  },
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

const resolveImage = (
  src?: string | ImageSourcePropType,
  fallback?: ImageSourcePropType
): ImageSourcePropType => {
  if (typeof src === "string") return { uri: src };
  return src ?? (fallback as ImageSourcePropType);
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

const EMPTY_BOARD: (null | "X" | "O")[][] = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const TicTacToe: React.FC<ShortProps> = (rawProps) => {
  const p = (rawProps.props ?? rawProps) as Required<ShortProps>["props"] &
    Omit<ShortProps, "props">;

  const lang: Language = (p.lang as Language) ?? DEFAULTS.lang;
  const locale = normalizeLocale(lang);
  const L = I18N[locale];

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

  const finalName1 = name1 === DEFAULTS.name1 ? L.player1 : name1;
  const finalName2 = name2 === DEFAULTS.name2 ? L.player2 : name2;

  const resolvedBackground = background
    ? { uri: background }
    : resolveImage(backgroundImage, DEFAULTS.backgroundImage);
  const resolvedPhoto1 = userAvatar
    ? { uri: userAvatar }
    : resolveImage(photo1, DEFAULTS.photo1);
  const resolvedPhoto2 = enemyCard
    ? { uri: enemyCard }
    : resolveImage(photo2, DEFAULTS.photo2);

  const [boardHeight, setBoardHeight] = useState<number>(0);
  const [roundKey, setRoundKey] = useState(0);
  const [showBoard, setShowBoard] = useState(true);
  const [suppressContent, setSuppressContent] = useState(false); // прячем фишки/эффекты полностью
  const [showHint, setShowHint] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [screenH, setScreenH] = useState(Dimensions.get("window").height);
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setScreenH(window.height);
    });
    return () => sub?.remove?.();
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
  const hintAnimatedStyle = { transform: [{ scale: hintScale }], opacity: 1 };
  const animateHintButton = (toValue: number) => {
    Animated.timing(hintScale, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  /** системные бары */
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
        } catch {}
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

  /** старт анимаций/музыки */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch {}

      if (ENABLE_BACKGROUND_MUSIC) playBackgroundMusic();
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

  /** как только партия закончилась — мгновенно скрываем всё содержимое доски */
  useEffect(() => {
    if (gameComplete) setSuppressContent(true);
  }, [gameComplete]);

  /** новый раунд */
  const handleResetGame = () => {
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setShowHint(false);

    // 1) мгновенно убираем содержимое + переключаем ключ раунда
    setSuppressContent(true);
    setShowBoard(false);
    setRoundKey((k) => k + 1);

    // 2) сбрасываем внутреннее состояние
    resetGame();
    resetAnimations();
    hintScale.setValue(1);
    setIsGameStarted(true);
    if (ENABLE_BACKGROUND_MUSIC) playBackgroundMusic();

    // 3) возвращаем чистую доску на следующий кадр и разрешаем контент
    requestAnimationFrame(() => {
      setShowBoard(true);
      setSuppressContent(false);
    });

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

  // пока board скрыт — отдаём пустую матрицу (ни кадра старого стейта)
  const displayedBoard = showBoard ? gameState.board : (EMPTY_BOARD as any);

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
                key={`p1-${roundKey}`}
                photo={resolvedPhoto1}
                name={finalName1}
                player="X"
                currentPlayer={gameState.currentPlayer}
                winner={gameState.winner}
                animatedStyle={player1Style}
                testID="player1-container"
                boardHeight={boardHeight}
                isFirstPlayer={true}
                lang={lang}
              />
            </View>

            <GameBoard
              key={`board-${roundKey}`}
              board={displayedBoard}
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
              suppressContent={suppressContent}
            />

            <View style={{ marginLeft: 20 }}>
              <PlayerAvatar
                key={`p2-${roundKey}`}
                photo={resolvedPhoto2}
                name={finalName2}
                player="O"
                currentPlayer={gameState.currentPlayer}
                winner={gameState.winner}
                animatedStyle={player2Style}
                testID="player2-container"
                boardHeight={boardHeight}
                isFirstPlayer={false}
                lang={lang}
              />
            </View>
          </Animated.View>
        </View>

        <View style={styles.topBar} pointerEvents="box-none">
          {SHOW_LANG_BADGE && !!lang && (
            <View style={styles.centerTopBar}>
              <Text style={{ color: "#fff", fontFamily: "Fredoka" }}>
                {I18N[locale].badge(lang)}
              </Text>
            </View>
          )}

          <Animated.View
            style={[
              styles.hintButton,
              { transform: [{ scale: hintAnimatedStyle.transform[0].scale }] },
              { top: Math.max(34, Math.round(screenH / 2 - 20)) },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() =>
                (
                  hintAnimatedStyle.transform[0].scale as Animated.Value
                ).setValue(0.9)
              }
              onPressOut={() =>
                (
                  hintAnimatedStyle.transform[0].scale as Animated.Value
                ).setValue(1)
              }
              onPress={() => {
                playNotificationSound();
                (
                  hintAnimatedStyle.transform[0].scale as Animated.Value
                ).setValue(1.08);
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
        winGif={resolveImage(winGif, DEFAULTS.winGif)}
        onPlayAgain={handleResetGame}
        animatedStyle={congratsContainerStyle}
        onPauseBackground={pauseBackgroundMusic}
        onResumeBackground={resumeBackgroundMusic}
        lang={lang}
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
  /** КНОПКА ПОДСКАЗКИ — без «торчащей» тени */
  hintButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    right: 30,
    overflow: "hidden", // режем любое свечение
  },
  hintGlow: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 0, // Android: тени нет
    shadowOpacity: 0, // iOS: тени нет
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 0,
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
