import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React, { useState, useRef, useEffect, useMemo } from "react";
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
import { BlurView } from "expo-blur";
import type { Language } from "../types/props";
import GameBoard from "./TicTacToe/GameBoard";
import PlayerAvatar from "./TicTacToe/PlayerAvatar";
import GameOverScreen from "./TicTacToe/GameOverScreen";
import { useTicTacToeGame } from "../hooks/useTicTacToeGame";
import { useTicTacToeAnimations } from "../hooks/useTicTacToeAnimations";
import { useSound } from "../hooks/useSound";
import * as ScreenOrientation from "expo-screen-orientation";
import BackgroundWrapper from "./TicTacToe/litlecomponent/BackgroundWrapper";
import BackgroundWave from "./TicTacToe/litlecomponent/BackgroundWave";
import { Image as ExpoImage } from "expo-image";
import { Audio } from "expo-av";

const { width, height: screenHeight } = Dimensions.get("window");
const baseHeight = 375;
const scale = screenHeight / baseHeight;
const scaled = (n: number) => Math.round(n * scale);

const ENABLE_BACKGROUND_MUSIC = false;
const ARC_BOTTOM_PAD = scaled(48);

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
    player1: "Quinn",
    player2: "Pooh",
    badge: (c: string) => c.toUpperCase(),
  },
  "de-DE": {
    player1: "Quinn",
    player2: "Puuh",
    badge: (c: string) => c.toUpperCase(),
  },
  "es-ES": {
    player1: "Quinn",
    player2: "Puh",
    badge: (c: string) => c.toUpperCase(),
  },
  "es-419": {
    player1: "Quinn",
    player2: "Puh",
    badge: (c: string) => c.toUpperCase(),
  },
  "fr-FR": {
    player1: "Quinn",
    player2: "Pouh",
    badge: (c: string) => c.toUpperCase(),
  },
  "it-IT": {
    player1: "Quinn",
    player2: "Puh",
    badge: (c: string) => c.toUpperCase(),
  },
  "pt-BR": {
    player1: "Quinn",
    player2: "Puff",
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
  name1: "Quinn",
  name2: "Pooh",
  photo1: require("../assets/9.png") as ImageSourcePropType,
  photo2: require("../assets/82.png") as ImageSourcePropType,
  winGif: require("../assets/animations/success-animation.json") as any,
  lang: "en" as Language,
};

/** ── ассеты роботов ───────────────────────────────────────────────────── */

const HERO = {
  hero1: {
    anim: require("../assets/hero/hero1/anim.webp"),
    voice: require("../assets/hero/hero1/hero.m4a"),
  },
  hero2: {
    anim: require("../assets/hero/hero2/anim.webp"),
    voice: require("../assets/hero/hero2/hero.m4a"),
  },
  hero3: {
    anim: require("../assets/hero/hero3/anim.webp"),
    voice: require("../assets/hero/hero3/hero.m4a"),
  },
  hero4: {
    anim: require("../assets/hero/hero4/anim.webp"),
    voice: require("../assets/hero/hero4/hero.m4a"),
  },
  hero5: {
    anim: require("../assets/hero/hero5/anim.webp"),
    voice: require("../assets/hero/hero5/hero.m4a"),
  },
  hero6: {
    anim: require("../assets/hero/hero6/anim.webp"),
    voice: require("../assets/hero/hero6/hero.m4a"),
  },
} as const;

type HeroKey = keyof typeof HERO;

/** ── стикер-робот ─────────────────────────────────────────────────────── */
let heroSize = null;
const HeroSticker: React.FC<{
  hero: HeroKey;
  size?: number;
  opacity?: number;
  onReady?: () => void;
}> = ({ hero, size, opacity = 1, onReady }) => {
  const source = HERO[hero].anim;
  const base = Math.min(width, screenHeight) * 0.55;
  const clamped = Math.max(320, Math.min(base, 460));
  const finalSize = size ?? clamped;
  heroSize = finalSize;

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) onReady?.();
  }, [loaded, onReady]);

  return (
    <ExpoImage
      source={source}
      style={{
        width: finalSize,
        height: finalSize,
        backgroundColor: "transparent",
        opacity,
      }}
      contentFit="contain"
      onLoadEnd={() => setLoaded(true)}
    />
  );
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

  const [isBlocked, setIsBlocked] = useState(true);

  const [screenH, setScreenH] = useState(Dimensions.get("window").height);
  const [screenW, setScreenW] = useState(Dimensions.get("window").width);

  const [resetKey, setResetKey] = useState(false);
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setScreenH(window.height);
      setScreenW(window.width);
    });
    return () => sub?.remove?.();
  }, []);

  const shorter = Math.min(screenW, screenH);
  const isTablet = shorter >= 600;

  const targetBoard = shorter * (isTablet ? 0.7 : 0.78);
  const maxBoardByWidth = screenW * (isTablet ? 0.72 : 0.9);
  let boardSide = Math.min(targetBoard, maxBoardByWidth);

  const AVATAR_RATIO = isTablet ? 0.32 : 0.4;
  const MIN_AVATAR_PX = isTablet ? 150 : 130;
  let avatarColumnWidth = boardSide * AVATAR_RATIO;
  if (avatarColumnWidth < MIN_AVATAR_PX) avatarColumnWidth = MIN_AVATAR_PX;

  let gap = scaled(isTablet ? 26 : 20);

  let stageWidth = boardSide + avatarColumnWidth * 2 + gap * 2;

  const maxStageWidth = screenW * (isTablet ? 0.98 : 0.99);

  if (stageWidth > maxStageWidth) {
    const k = maxStageWidth / stageWidth;
    boardSide *= k;
    avatarColumnWidth *= k;
    gap *= k;
    stageWidth = maxStageWidth;
  }

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
    setAssistMode, // ✅ добавили
  } = useTicTacToeGame(() => {
    playNotificationSound();
  });

  const {
    player1Style,
    player2Style,
    gameContainerStyle,
    congratsContainerStyle,
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
  const gameContainerTranslateY = useRef(new Animated.Value(0)).current;
  const gameContainerOpacity = useRef(new Animated.Value(1)).current;
  const heroOutOpacity = useRef(new Animated.Value(1)).current;

  const boardIntro = useRef(new Animated.Value(0)).current;
  const playersIntro = useRef(new Animated.Value(0)).current;

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
        duration: 1250,
        delay: 150,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ellipseOpacity, {
        toValue: 0,
        duration: 850,
        useNativeDriver: true,
      }),
      Animated.timing(gameContainerTranslateY, {
        toValue: screenHeight + ARC_BOTTOM_PAD,
        duration: 1050,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(gameContainerOpacity, {
        toValue: 0,
        duration: 850,
        useNativeDriver: true,
      }),
      Animated.timing(heroOutOpacity, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => onDone?.());
  };

  useEffect(() => {
    setIsBlocked(true);
    Animated.sequence([
      Animated.timing(ellipseTranslateY, {
        toValue: 0,
        duration: 1000,
        delay: 10,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ellipseOpacity, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(boardIntro, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(playersIntro, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsBlocked(false);
    });
  }, [resetKey]);

  const boardIntroStyle = {
    opacity: boardIntro,
    transform: [
      {
        translateY: boardIntro.interpolate({
          inputRange: [0, 1],
          outputRange: [30, 0],
        }),
      },
    ],
  };

  const playersIntroStyle = {
    opacity: playersIntro,
    transform: [
      {
        translateY: playersIntro.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  const hintIntroStyle = {
    opacity: playersIntro,
    transform: [
      {
        translateY: playersIntro.interpolate({
          inputRange: [0, 1],
          outputRange: [40, 0],
        }),
      },
    ],
  };

  const resetStage = () => {
    playersFade.setValue(1);
    gameContainerTranslateY.setValue(0);
    gameContainerOpacity.setValue(1);
    ellipseTranslateY.setValue(Dimensions.get("window").height);
    ellipseOpacity.setValue(0);
    playersIntro.setValue(0);
    boardIntro.setValue(0);
  };

  useEffect(() => {
    StatusBar.setHidden(true, "fade");

    (async () => {
      if (Platform.OS === "android") {
        try {
          const NB: any = await import("expo-navigation-bar");
          try {
            await NB.setBackgroundColorAsync("transparent");
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
      StatusBar.setHidden(false, "fade");
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
        if (mounted) {
        }
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

  const handleResetGame = () => {
    resetStage();
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
    setShowHint(false);
    setShowGameOver(false);
    setSuppressContent(true);
    setShowBoard(false);
    setRoundKey((k) => k + 1);
    resetGame();
    setIsGameStarted(true);
    setResetKey(!resetKey);
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

  const displayedBoard: (null | "X" | "O")[][] = showBoard
    ? gameState.board
    : EMPTY_BOARD;

  const [heroKey, setHeroKey] = useState<HeroKey | null>(null);
  const [showHero, setShowHero] = useState(false);
  const [heroReady, setHeroReady] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);
  const runIdRef = useRef(0);
  // Сколько держим героя до появления поздравления
  const ROBOT_MS = 2800;
  const winner = gameState.winner;
  const chooseHero = useMemo<HeroKey | null>(() => {
    if (!gameComplete || winner == null) return null;
    if (winner === "X") return Math.random() < 0.5 ? "hero1" : "hero2";
    if (winner === "draw") return Math.random() < 0.5 ? "hero3" : "hero4";
    return Math.random() < 0.5 ? "hero5" : "hero6";
  }, [gameComplete, winner]);

  const clearTimersAndSound = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    if (soundRef.current) {
      soundRef.current.stopAsync().catch(() => {});
      soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }
  };

  // Порядок: робот → (ROBOT_MS) → контент/конфетти
  useEffect(() => {
    if (!gameComplete) {
      clearTimersAndSound();
      setShowHero(false);
      setHeroKey(null);
      setHeroReady(false);
      return;
    }

    const myRunId = ++runIdRef.current;

    if (chooseHero) setHeroKey(chooseHero);
    setShowHero(true);
    setHeroReady(false);

    const readyTimer = setTimeout(() => {
      if (runIdRef.current !== myRunId) return;
      setHeroReady(true);
    }, 800);
    timersRef.current.push(readyTimer);

    const hideHeroTimer = setTimeout(() => {
      if (runIdRef.current !== myRunId) return;
      setShowHero(false);
    }, ROBOT_MS);
    timersRef.current.push(hideHeroTimer);

    return () => clearTimersAndSound();
  }, [gameComplete, chooseHero]);

  // Голос робота — после загрузки кадра
  useEffect(() => {
    if (!gameComplete || !chooseHero || !showHero || !heroReady) return;

    const myRunId = runIdRef.current;
    const voiceTimer = setTimeout(async () => {
      if (runIdRef.current !== myRunId) return;
      try {
        const { sound } = await Audio.Sound.createAsync(
          HERO[chooseHero].voice,
          {
            shouldPlay: true,
            volume: 1.0,
          }
        );
        if (runIdRef.current !== myRunId) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
        await sound.playAsync();
      } catch {}
    }, 120);
    timersRef.current.push(voiceTimer);
  }, [gameComplete, chooseHero, showHero, heroReady]);

  return (
    <ImageBackground
      source={resolvedBackground}
      style={styles.container}
      testID="tic-tac-toe-game"
    >
      <ExpoStatusBar
        hidden={true}
        translucent={true}
        backgroundColor="transparent"
      />
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: ellipseTranslateY }],
            opacity: ellipseOpacity,
          },
        ]}
      >
        <BackgroundWave
          style={[styles.ellipseBackground, { transform: [{ scaleX: 1.2 }] }]}
        />
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
                width: stageWidth,
                alignSelf: "center",
              },
            ]}
          >
            <View style={styles.bandInner}>
              <View
                style={{
                  width: avatarColumnWidth,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
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
                  style={[playersIntroStyle]}
                />
              </View>
              <View
                style={[
                  styles.boardWrapper,
                  {
                    width: boardSide,
                    marginHorizontal: gap,
                  },
                ]}
              >
                {isBlocked && (
                  <View
                    style={{
                      ...StyleSheet.absoluteFillObject,
                      zIndex: 100000,
                    }}
                  />
                )}
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
                  style={[boardIntroStyle]}
                />
              </View>

              <View
                style={{
                  width: avatarColumnWidth,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              >
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
                  style={[playersIntroStyle]}
                />
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={[
              { position: "absolute", bottom: 22, right: 22 },
              hintStyles.wrap,
              hintIntroStyle,
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
                    setAssistMode(true);
                    animateHintButton(1.06);
                    setShowHint(true);
                    if (hintTimerRef.current)
                      clearTimeout(hintTimerRef.current);
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
        {/* Робот */}
        {showHero && heroKey && (
          <Animated.View style={[styles.heroWrap]} pointerEvents="none">
            <HeroSticker hero={heroKey} onReady={() => setHeroReady(true)} />
          </Animated.View>
        )}
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
  heroWrap: {
    height: heroSize,
    width: heroSize,
    position: "absolute",
    right: "20%",
    bottom: 30,
    zIndex: 20,
    backgroundColor: "transparent",
  },
  container: { flex: 1, width: "100%", height: "100%" },
  gameContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playersContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: scaled(18),
  },
  bandBlurWrapper: {
    width: "100%",
    borderRadius: scaled(40),
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.14)",
  },
  bandInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: scaled(12),
  },
  boardWrapper: {
    aspectRatio: 1,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  ellipseBackground: {
    position: "absolute",
    top: "10%",
    width: "100%",
    height: "100%",
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
