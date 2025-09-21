// libs/tik-tack-toe-ui/src/lib/components/TicTacToe.tsx
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
import BackIcon from "../assets/svg/back-icon";
import type { TicTacToeProps } from "../types/tic-tac-toe";
import type { Language } from "../types/props";
import GameBoard from "./TicTacToe/GameBoard";
import PlayerAvatar from "./TicTacToe/PlayerAvatar";
import GameOverScreen from "./TicTacToe/GameOverScreen";
import { useTicTacToeGame } from "../hooks/useTicTacToeGame";
import { useTicTacToeAnimations } from "../hooks/useTicTacToeAnimations";
import { useSound } from "../hooks/useSound";
import * as ScreenOrientation from "expo-screen-orientation";

/** Мини-словарик на будущее (если появятся подписи/кнопки). */
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
  winGif:
    require("../assets/animations/success-animation.json") as ImageSourcePropType,
  lang: "en" as Language,
};

const resolveImage = (src?: string | ImageSourcePropType) =>
  typeof src === "string" ? { uri: src } : src;

const TicTacToe: React.FC<TicTacToeProps> = (props) => {
  // ✅ язык берём только из пропса (как в Magic Memory)
  const lang: Language = props.lang ?? DEFAULTS.lang;
  const L = STRINGS[lang] ?? STRINGS.en;

  const {
    background,
    userAvatar,
    enemyCard,

    // поддержка старых полей
    backgroundImage = DEFAULTS.backgroundImage,
    name1 = DEFAULTS.name1,
    name2 = DEFAULTS.name2,
    photo1 = DEFAULTS.photo1,
    photo2 = DEFAULTS.photo2,
    winGif = DEFAULTS.winGif,
  } = props;

  const resolvedBackground = background
    ? { uri: background }
    : resolveImage(backgroundImage);
  const resolvedPhoto1 = userAvatar
    ? { uri: userAvatar }
    : resolveImage(photo1);
  const resolvedPhoto2 = enemyCard ? { uri: enemyCard } : resolveImage(photo2);

  const [boardHeight, setBoardHeight] = useState<number>(0);

  // Звук
  const {
    playBackgroundMusic,
    stopBackgroundMusic,
    playNotificationSound,
    playVictorySound,
    playSadGameSound,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
  } = useSound();

  // Логика игры
  const {
    setIsGameStarted,
    gameState,
    bestMove,
    gameComplete,
    handleCellPress,
    resetGame,
  } = useTicTacToeGame(playNotificationSound);

  // Анимации
  const {
    player1Style,
    player2Style,
    gameContainerStyle,
    congratsContainerStyle,
    backIconStyle,
    resetAnimations,
  } = useTicTacToeAnimations(
    gameState.currentPlayer,
    gameState.winner,
    gameComplete
  );

  // Интро контента
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

  // Дуга (эллипс)
  const ellipseTranslateY = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const ellipseOpacity = useRef(new Animated.Value(0)).current;

  // Подсказка: микро-анимация
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

  // ⬇️ Скрываем статусбар + нижнюю навигацию (Android), как в MagicMemory
  useEffect(() => {
    // StatusBar
    StatusBar.setHidden(true, "none");

    // Android Navigation Bar
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

    // Повторно скрываем навбар при смене размеров/ориентации
    const sub = Dimensions.addEventListener("change", async () => {
      if (Platform.OS === "android") {
        try {
          const NB: any = await import("expo-navigation-bar");
          await NB.setVisibilityAsync("hidden");
        } catch {}
      }
    });

    return () => {
      // Возвращаем, если нужно (внутри песочницы обычно ок оставить скрытым,
      // но для чистоты вернём как было)
      StatusBar.setHidden(false, "none");
      if (Platform.OS === "android") {
        (async () => {
          try {
            const NB: any = await import("expo-navigation-bar");
            await NB.setVisibilityAsync("visible");
          } catch {}
        })();
      }
      // @ts-ignore — совместимость API RN <-> Expo SDK
      sub?.remove?.();
    };
  }, []);

  // Старт: сразу LANDSCAPE, музыка, анимации
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch {}
      playBackgroundMusic();
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
      mounted = false;
      stopBackgroundMusic();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Сброс (Play Again)
  const handleResetGame = () => {
    resetGame();
    resetAnimations();
    hintScale.setValue(1);
    setIsGameStarted(true);
    playBackgroundMusic();

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

  // “Назад” — мягкий ресет (старт и лоадинг выпилены)
  const handleBackSoftReset = () => {
    Animated.timing(introAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      handleResetGame();
    });
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
          {/* ДУГА */}
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
              showHint={false}
              onHintUsed={() => {}}
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

        {/* Верхняя панель */}
        <View style={styles.topBar} pointerEvents="box-none">
          <Animated.View style={[styles.backButton, backIconStyle]}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => {
                Animated.spring(hintScale, {
                  toValue: 0.96,
                  useNativeDriver: true,
                }).start();
              }}
              onPressOut={() => {
                Animated.spring(hintScale, {
                  toValue: 1,
                  useNativeDriver: true,
                }).start();
                handleBackSoftReset();
              }}
            >
              <BackIcon />
            </TouchableOpacity>
          </Animated.View>

          {!!lang && (
            <View style={styles.centerTopBar}>
              <Text style={{ color: "#fff", fontFamily: "Fredoka" }}>
                {L.langBadge(lang)}
              </Text>
            </View>
          )}

          <Animated.View style={[styles.hintButton, hintAnimatedStyle]}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => animateHintButton(0.9)}
              onPressOut={() => animateHintButton(1)}
              onPress={() => {
                // Простая подсказка: звук + небольшой “пульс” кнопки
                playNotificationSound();
                animateHintButton(1.08);
                setTimeout(() => animateHintButton(1), 120);
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
  backButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(18, 18, 18, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    top: 34,
    left: 30,
    zIndex: 1000,
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
    top: 34,
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
