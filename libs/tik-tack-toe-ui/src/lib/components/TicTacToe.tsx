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
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur"; // ⬅️ добавил
import type { Language } from "../types/props";
import GameBoard from "./TicTacToe/GameBoard";
import PlayerAvatar from "./TicTacToe/PlayerAvatar";
import GameOverScreen from "./TicTacToe/GameOverScreen";
import { useTicTacToeGame } from "../hooks/useTicTacToeGame";
import { useTicTacToeAnimations } from "../hooks/useTicTacToeAnimations";
import { useSound } from "../hooks/useSound";
import * as ScreenOrientation from "expo-screen-orientation";

const { height: screenHeight } = Dimensions.get("window");
const baseHeight = 375;
const scale = screenHeight / baseHeight;
const scaled = (n: number) => Math.round(n * scale);

const ENABLE_BACKGROUND_MUSIC = false;
const SHOW_LANG_BADGE = false;
const ARC_BOTTOM_PAD = scaled(48);
const ELLIPSE_TOP = scaled(50) + 30;

const TIMINGS = {
  AI_THINK_MS: 400,
  BETWEEN_TURNS_MS: 300,
  LAST_MOVE_FREEZE_MS: 1200,
  AVATAR_HOLD_MS: 1500,
  GAMEOVER_XFADE_MS: 700,
};

type Timings = {
  aiThink: number;
  betweenTurns: number;
  lastMoveFreeze: number;
  avatarHold: number;
  gameOverXFade: number;
};

type TicTacToeInputProps = {
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
  timings?: Partial<Timings>;
};

type Props =
  | TicTacToeInputProps
  | {
      props?: TicTacToeInputProps;
    };

const I18N = {
  "en-US": {
    player1: "Player 1",
    player2: "Player 2",
    badge: (c: string) => c.toUpperCase(),
  },
  "de-DE": {
    player1: "Spieler 1",
    player2: "Spieler 2",
    badge: (c: string) => c.toUpperCase(),
  },
  "es-ES": {
    player1: "Jugador 1",
    player2: "Jugador 2",
    badge: (c: string) => c.toUpperCase(),
  },
  "es-419": {
    player1: "Jugador 1",
    player2: "Jugador 2",
    badge: (c: string) => c.toUpperCase(),
  },
  "fr-FR": {
    player1: "Joueur 1",
    player2: "Joueur 2",
    badge: (c: string) => c.toUpperCase(),
  },
  "it-IT": {
    player1: "Giocatore 1",
    player2: "Giocatore 2",
    badge: (c: string) => c.toUpperCase(),
  },
  "pt-BR": {
    player1: "Jogador 1",
    player2: "Jogador 2",
    badge: (c: string) => c.toUpperCase(),
  },
} as const;
type LocaleTag = keyof typeof I18N;

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

const DEFAULTS = {
  backgroundImage:
    require("../assets/WTP_BGS_ALL_0048.png") as ImageSourcePropType,
  name1: "Player 1",
  name2: "Player 2",
  photo1: require("../assets/9.png") as ImageSourcePropType,
  photo2: require("../assets/82.png") as ImageSourcePropType,
  winGif: require("../assets/animations/success-animation.json") as any,
  lang: "en" as Language,
};

const resolveImage = (
  src?: string | ImageSourcePropType,
  fallback?: ImageSourcePropType
) => {
  if (typeof src === "string") return { uri: src };
  return src ?? (fallback as ImageSourcePropType);
};

const EMPTY_BOARD: (null | "X" | "O")[][] = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const eyePng = require("../assets/eye.png");

/** Figma specs */
const BTN_SIZE = 60;
const BORDER_W = 3;
const EYE_SIZE = 30;
const SHADOW_BLUR = 25;
const PURPLE_GLOW = "rgba(144, 33, 232, 0.8)";
const BORDER_COLOR = "#C57CFF";
const GRADIENT_COLORS = ["#C780FF", "#7500D1"] as const;

const TicTacToe: React.FC<Props> = (rawProps) => {
  const base = (rawProps as any).props ? (rawProps as any).props : rawProps;
  const p: TicTacToeInputProps = base || {};

  const T = {
    aiThink: p.timings?.aiThink ?? TIMINGS.AI_THINK_MS,
    betweenTurns: p.timings?.betweenTurns ?? TIMINGS.BETWEEN_TURNS_MS,
    lastMoveFreeze: p.timings?.lastMoveFreeze ?? TIMINGS.LAST_MOVE_FREEZE_MS,
    avatarHold: p.timings?.avatarHold ?? TIMINGS.AVATAR_HOLD_MS,
    gameOverXFade: p.timings?.gameOverXFade ?? TIMINGS.GAMEOVER_XFADE_MS,
  };

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
  } = p;

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
  const [suppressContent, setSuppressContent] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [screenH, setScreenH] = useState(Dimensions.get("window").height);
  const [screenW, setScreenW] = useState(Dimensions.get("window").width);
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setScreenH(window.height);
      setScreenW(window.width);
    });
    return () => sub?.remove?.();
  }, []);

  // ---- tablet/layout helpers ----
  const shorter = Math.min(screenW, screenH);
  const isTablet = shorter >= 600;

  // сценическая максимальная ширина и размер квадрата под доску
  // сценическая максимальная ширина и размер квадрата под доску
  const stageMaxWidth = Math.min(
    screenW * (isTablet ? 0.9 : 0.98),
    shorter * (isTablet ? 1.08 : 1.0)
  );
  const boardSide = Math.min(
    shorter * (isTablet ? 0.66 : 0.58),
    stageMaxWidth * (isTablet ? 0.6 : 0.54)
  );

  // размазанный прямоугольник:
  // – по ширине чуть меньше всей сцены, чтобы захватывал аватары + доску
  // – по высоте примерно доска + небольшой отступ сверху/снизу
  const blurWidth = stageMaxWidth * (isTablet ? 0.9 : 0.92);
  const blurHeight = boardSide * (isTablet ? 1.2 : 1.25);
  const blurRadius = isTablet ? 34 : 26;

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

  // дуга выключена; но её анимационные значения мы используем для контейнера
  const ellipseTranslateY = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const ellipseOpacity = useRef(new Animated.Value(0)).current;
  const gameContainerTranslateY = useRef(new Animated.Value(0)).current;
  const gameContainerOpacity = useRef(new Animated.Value(1)).current;

  const playersFade = useRef(new Animated.Value(1)).current;

  const hintScale = useRef(new Animated.Value(1)).current;
  const hintAnimatedStyle = { transform: [{ scale: hintScale }], opacity: 1 };
  const animateHintButton = (toValue: number) => {
    Animated.timing(hintScale, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const ellipseOut = (onDone?: () => void) => {
    Animated.parallel([
      Animated.timing(ellipseTranslateY, {
        toValue: screenHeight + ARC_BOTTOM_PAD,
        duration: 850,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ellipseOpacity, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(gameContainerTranslateY, {
        toValue: screenHeight + ARC_BOTTOM_PAD,
        duration: 850,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(gameContainerOpacity, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start(() => onDone?.());
  };

  const resetStage = () => {
    playersFade.setValue(1);
    gameContainerTranslateY.setValue(0);
    gameContainerOpacity.setValue(1);
    ellipseTranslateY.setValue(0);
    ellipseOpacity.setValue(0);
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
    })();

    return () => {
      stopBackgroundMusic();
      const t = hintTimerRef.current;
      if (t) clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!gameComplete) return;
    const holdTimer = setTimeout(() => {
      Animated.timing(playersFade, {
        toValue: 0,
        duration: T.gameOverXFade,
        useNativeDriver: true,
      }).start(() => {
        setSuppressContent(true);
        ellipseOut(() => setShowGameOver(true));
      });
    }, T.avatarHold);
    return () => clearTimeout(holdTimer);
  }, [gameComplete, T.avatarHold, T.gameOverXFade, playersFade]);

  // --- рестарт новой партии ---
  const handleResetGame = () => {
    resetStage();
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setShowHint(false);
    setShowGameOver(false);
    setSuppressContent(true);
    setShowBoard(false);
    setRoundKey((k) => k + 1);
    resetGame();
    resetAnimations();
    setIsGameStarted(true);
    if (ENABLE_BACKGROUND_MUSIC) playBackgroundMusic();
    setTimeout(() => {
      setShowBoard(true);
      setSuppressContent(false);
      introAnim.setValue(0);
      Animated.timing(introAnim, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }).start();
    }, 150);
  };
  // --- конец рестарта ---

  const displayedBoard: (null | "X" | "O")[][] = showBoard
    ? gameState.board
    : EMPTY_BOARD;

  return (
    <ImageBackground
      source={resolvedBackground}
      style={styles.container}
      testID="tic-tac-toe-game"
    >
      {/* Размытый прямоугольник за аватарами и доской */}
      <Animated.View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",

          // 🔥 добавили синхронизацию с уходом доски
          opacity: gameContainerOpacity,
          transform: [{ translateY: gameContainerTranslateY }],
        }}
      >
        <BlurView
          intensity={55}
          tint="dark"
          style={{
            width: blurWidth,
            height: blurHeight,
            borderRadius: blurRadius,
            backgroundColor: "rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.gameContainer,
          introStyle,
          gameContainerStyle,
          {
            opacity: gameContainerOpacity,
            transform: [{ translateY: gameContainerTranslateY }],
            alignItems: "center",
          },
        ]}
        testID="game-content"
      >
        <Animated.View
          style={[
            styles.playersContainer,
            {
              opacity: playersFade,
              width: stageMaxWidth,
              alignSelf: "center",
            },
          ]}
        >
          <View style={{ marginRight: scaled(isTablet ? 28 : 22), opacity: 1 }}>
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

          {/* Квадратная область под большую доску */}
          <Animated.View
            style={{
              opacity: playersFade,
              alignItems: "center",
              justifyContent: "center",
              width: boardSide,
              aspectRatio: 1,
            }}
          >
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
              onBotVictory={playSadGameSound}
              suppressContent={suppressContent}
              roundKey={roundKey}
            />
          </Animated.View>

          <View style={{ marginLeft: scaled(isTablet ? 28 : 22), opacity: 1 }}>
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

        {/* Кнопка-подсказка 60×60 */}
        <Animated.View
          style={[
            { position: "absolute", bottom: 22, right: 22 },
            hintStyles.wrap,
            hintAnimatedStyle,
          ]}
        >
          <View style={hintStyles.glow} pointerEvents="none" />
          <View style={hintStyles.ring}>
            <LinearGradient
              colors={GRADIENT_COLORS}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={hintStyles.gradient}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                onPressIn={() => animateHintButton(0.94)}
                onPressOut={() => animateHintButton(1)}
                onPress={() => {
                  playNotificationSound();
                  animateHintButton(1.06);
                  setShowHint(true);
                  if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
                  hintTimerRef.current = setTimeout(
                    () => setShowHint(false),
                    2500
                  );
                }}
                style={hintStyles.touch}
              >
                <Image source={eyePng} style={hintStyles.eye} />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Animated.View>
      </Animated.View>

      {showGameOver && (
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
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: "100%" },
  gameContainer: {
    flex: 1,
    justifyContent: "center", // вертикальный центр всей сцены
    alignItems: "center",
  },
  playersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scaled(20),
    marginTop: scaled(32),
    marginBottom: scaled(24),
    gap: scaled(18),
  },
});

const hintStyles = StyleSheet.create({
  wrap: { width: BTN_SIZE, height: BTN_SIZE },
  glow: {
    position: "absolute",
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    shadowColor: PURPLE_GLOW,
    shadowOpacity: 1,
    shadowRadius: SHADOW_BLUR / 2,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  ring: {
    width: BTN_SIZE,
    height: BTN_SIZE,
    borderRadius: BTN_SIZE / 2,
    borderWidth: BORDER_W,
    borderColor: BORDER_COLOR,
    overflow: "hidden",
  },
  gradient: { flex: 1, borderRadius: BTN_SIZE / 2 },
  touch: { flex: 1, alignItems: "center", justifyContent: "center" },
  eye: {
    width: EYE_SIZE,
    height: EYE_SIZE,
    tintColor: "#FFFFFF",
    resizeMode: "contain",
  } as const,
});

export default TicTacToe;
