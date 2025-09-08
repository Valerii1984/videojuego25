import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  ImageBackground,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ScreenOrientation from "expo-screen-orientation";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Path,
  RadialGradient,
  Circle,
} from "react-native-svg";

import { useLanguage } from "../contexts/LanguageContext";
import { useSound } from "../contexts/SoundContext";
import Confetti from "../components/Confetti";
import CustomAlert from "../components/CustomAlert";
import MemoryCard from "../components/Card";
import globalStyles from "../styles/global-styles";
import BackIcon from "../../icons/BackIcon";
import styles from "./GameScreen.styles";

// ВАЖНО: используем тип Card из ваших типов библиотеки
import { Card as LibCard } from "../types";

// типы для пропсов из навигации
type LevelKey = 4 | 6 | 8 | 10 | 12;
type IntervalId = ReturnType<typeof setInterval>;
type TimeoutId = ReturnType<typeof setTimeout>;

export interface MagicMemoryPropConfig {
  age: LevelKey;
  lang: string;
  background?: string | string[];
  backCardSide?: string | string[];
  frontCardSide?: string[];
}

type RootParams = {
  level?: number;
  config: MagicMemoryPropConfig;
};

// ассеты-фоллбэки
const assetFrontGroups: Record<string, any[]> = {
  cardFace: [
    require("../assets/cardFace-1.jpg"),
    require("../assets/cardFace-2.jpg"),
    require("../assets/cardFace-3.jpg"),
    require("../assets/cardFace-4.jpg"),
    require("../assets/cardFace-5.jpg"),
    require("../assets/cardFace-6.jpg"),
  ],
  facecard: [
    require("../assets/animtest/facecard/boy.png"),
    require("../assets/animtest/facecard/donkey.png"),
    require("../assets/animtest/facecard/girl.png"),
    require("../assets/animtest/facecard/kengoo.png"),
    require("../assets/animtest/facecard/owl.png"),
    require("../assets/animtest/facecard/pig.png"),
    require("../assets/animtest/facecard/puh.png"),
    require("../assets/animtest/facecard/tigr.png"),
  ],
};

const assetBacks: any[] = [
  require("../assets/card-1.jpg"),
  require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0000.jpg"),
  require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0001.jpg"),
  require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0002.jpg"),
  require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0003.jpg"),
  require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0004.jpg"),
  require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0005.jpg"),
  require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0006.jpg"),
  require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0007.jpg"),
];

const assetBackgrounds = [
  { source: require("../assets/Background.jpg"), hasStars: true },
  {
    source: require("../assets/animtest/backgroundtest/WTP_BGS_ALL_0023.jpg"),
    hasStars: false,
  },
  {
    source: require("../assets/animtest/backgroundtest/WTP_BGS_ALL_0025.jpg"),
    hasStars: false,
  },
  {
    source: require("../assets/animtest/backgroundtest/WTP_BGS_ALL_0048.jpg"),
    hasStars: false,
  },
  {
    source: require("../assets/animtest/backgroundtest/WTP_BGS_ALL_0051.jpg"),
    hasStars: false,
  },
  {
    source: require("../assets/animtest/backgroundtest/WTP_BGS_ALL_0058.jpg"),
    hasStars: false,
  },
  {
    source: require("../assets/animtest/backgroundtest/WTP_BGS_ALL_0076.jpg"),
    hasStars: false,
  },
];

const pickRandom = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const asArray = (v?: string | string[]) =>
  v ? (Array.isArray(v) ? v : [v]) : undefined;

// иконка Play Again
const PlayIcon = () => (
  <Image source={require("../assets/playAgain.png")} style={styles.playIcon} />
);

const GameScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const route = useRoute();
  const { language } = useLanguage();
  const {
    playNotificationSound,
    playSuccessSound,
    playBackgroundMusic,
    stopSuccessSound,
  } = useSound();

  // конфиг из пропсов навигации
  const { level: routeLevel, config } = (route.params || {}) as RootParams;

  // уровень
  const level: LevelKey = useMemo(() => {
    const raw = (routeLevel ?? config?.age ?? 4) as number;
    const allowed: LevelKey[] = [4, 6, 8, 10, 12];
    return (allowed.includes(raw as LevelKey) ? raw : 4) as LevelKey;
  }, [routeLevel, config?.age]);

  const { width, height } = Dimensions.get("window");

  // state
  const [cards, setCards] = useState<LibCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [time, setTime] = useState(0);
  const [moves, setMoves] = useState(0);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  const [isShowingCards, setIsShowingCards] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [hintActive, setHintActive] = useState<number[]>([]);
  const [smileVisible, setSmileVisible] = useState<number | null>(null);

  // фон/рубашка на ТЕКУЩИЙ раунд
  const [roundBackground, setRoundBackground] = useState<{
    source: any;
    hasStars?: boolean;
  }>();
  const [roundBack, setRoundBack] = useState<any>();

  // таймеры/анимации
  const timer = useRef<IntervalId | null>(null);
  const completionTimers = useRef<TimeoutId[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const arcOffsetY = useSharedValue(0);
  const arcOpacity = useSharedValue(1);
  const statsOffsetY = useSharedValue(0);
  const statsOpacity = useSharedValue(1);
  const playAgainScale = useSharedValue(1);
  const playAgainOpacity = useSharedValue(1);
  const hintScale = useSharedValue(1);
  const backScale = useSharedValue(1);
  const congratsPulse = useSharedValue(1.05);

  const PLAY_AGAIN_OFFSET = 110;
  const PLAY_AGAIN_CAP = 0.78;
  const playAgainTop = Math.min(
    height * PLAY_AGAIN_CAP,
    height * 0.6 + PLAY_AGAIN_OFFSET
  );

  const arcAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: arcOffsetY.value }],
    opacity: arcOpacity.value,
  }));
  const statsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: statsOffsetY.value }],
    opacity: statsOpacity.value,
  }));
  const playAgainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(playAgainScale.value, { duration: 225 }) }],
    opacity: playAgainOpacity.value,
  }));
  const hintAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(hintScale.value, { duration: 100 }) }],
    opacity: 1,
  }));
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(backScale.value, { duration: 200 }) }],
    opacity: 1,
  }));
  const congratsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(congratsPulse.value, { duration: 2000 }) }],
    opacity: 1,
  }));

  // прелоад ассет-фонов (для скорости), не мешает URL
  useEffect(() => {
    const preload = async () => {
      const promises = assetBackgrounds.map((bg) =>
        Image.prefetch(Image.resolveAssetSource(bg.source).uri)
      );
      try {
        await Promise.all(promises);
      } catch {}
    };
    preload();
  }, []);

  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    ).catch(() => {});
    if (!isInitialized) {
      generateCards();
      setIsInitialized(true);
    }
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    if ([8, 10, 12].includes(level)) {
      playBackgroundMusic().catch(() => {});
      timer.current = setInterval(() => setTime((p) => p + 1), 1000);
    }
    if (showCongrats && isGameActive) {
      playSuccessSound().catch(() => {});
      congratsPulse.value = withRepeat(
        withTiming(1.2, { duration: 2000 }),
        -1,
        true
      );
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, isInitialized, showCongrats, isGameActive]);

  // главное: фон/рубашка выбираются КАЖДЫЙ РАЗ при генерации раунда
  const generateCards = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }

    arcOffsetY.value = height;
    arcOpacity.value = 0;
    statsOffsetY.value = -100;
    statsOpacity.value = 0;

    // фон
    const bgCandidates = asArray(config?.background);
    if (bgCandidates && bgCandidates.length > 0) {
      setRoundBackground({ source: { uri: pickRandom(bgCandidates) } });
    } else {
      setRoundBackground(pickRandom(assetBackgrounds));
    }

    // рубашка
    const backCandidates = asArray(config?.backCardSide);
    if (backCandidates && backCandidates.length > 0) {
      setRoundBack({ uri: pickRandom(backCandidates) });
    } else {
      setRoundBack(pickRandom(assetBacks));
    }

    // лица
    const totalPairs = Math.floor(level / 2);
    let frontPool: { source: any }[] = [];
    const incomingFront = config?.frontCardSide ?? [];

    if (incomingFront.length >= totalPairs) {
      const uniq = Array.from(new Set(incomingFront));
      frontPool = uniq.map((u) => ({ source: { uri: u } }));
    }
    if (frontPool.length === 0) {
      const groupKeys = Object.keys(assetFrontGroups);
      const selectedGroup = pickRandom(groupKeys);
      frontPool = assetFrontGroups[selectedGroup].map((req) => ({
        source: req,
      }));
    }

    const shuffled = [...frontPool].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, Math.min(totalPairs, shuffled.length));
    const selectedValues = chosen.flatMap((x) => [x, x]);

    const cardPairs: LibCard[] = selectedValues
      .map((val, index) => ({
        id: index,
        // значение из допустимых ключей — чтобы тип совпал
        value: "cardFace-1" as LibCard["value"],
        isFlipped: false,
        isMatched: false,
        isHidden: false,
        // локально кладём реальный источник
        __source: val.source as any,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(cardPairs);
    setSelectedCards([]);
    setMatchedCards([]);
    setShowConfetti(false);
    setIsFlipping(false);
    setTime(0);
    setMoves(0);
    setHintActive([]);
    setSmileVisible(null);
    setShowCongrats(false);
    setShowPlayAgain(false);
    setShowUpgradePrompt(false);
    setIsGameActive(true);

    arcOffsetY.value = withTiming(0, { duration: 500 });
    arcOpacity.value = withTiming(1, { duration: 500 });
    statsOffsetY.value = withTiming(0, { duration: 500 });
    statsOpacity.value = withTiming(1, { duration: 500 });

    if (level === 4) {
      setIsShowingCards(true);
      const showTimer: TimeoutId = setTimeout(() => {
        setCards((prev) => prev.map((c) => ({ ...c, isFlipped: true })));
        const hideTimer: TimeoutId = setTimeout(() => {
          setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));
          setIsShowingCards(false);
        }, 3000);
        completionTimers.current.push(hideTimer);
      }, 1000);
      completionTimers.current.push(showTimer);
    }
    if ([8, 10, 12].includes(level)) {
      playBackgroundMusic().catch(() => {});
      timer.current = setInterval(() => setTime((p) => p + 1), 1000);
    }
  };

  const getStars = (lvl: number, t: number, m: number) => {
    if (![8, 10, 12].includes(lvl)) return 0;
    let maxTime: number, maxMoves: number;
    switch (lvl) {
      case 8:
        maxTime = 30;
        maxMoves = 12;
        break;
      case 10:
        maxTime = 40;
        maxMoves = 18;
        break;
      case 12:
        maxTime = 50;
        maxMoves = 24;
        break;
      default:
        return 0;
    }
    if (t <= maxTime && m <= maxMoves) return 3;
    if (t <= maxTime * 1.2 && m <= maxMoves * 1.2) return 2;
    return 1;
  };

  const handleCardPress = (id: number) => {
    if (
      isShowingCards ||
      selectedCards.length >= 2 ||
      selectedCards.includes(id) ||
      isFlipping ||
      !isGameActive
    ) {
      return;
    }
    setIsFlipping(true);
    const newSelected = [...selectedCards, id];
    setSelectedCards(newSelected);
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c))
    );
    if ([8, 10, 12].includes(level)) setMoves((p) => p + 1);

    if (newSelected.length === 2) {
      const [aId, bId] = newSelected;
      const a = cards.find((c) => c.id === aId);
      const b = cards.find((c) => c.id === bId);

      const same = (a as any)?.__source?.uri
        ? (a as any).__source.uri === (b as any)?.__source?.uri
        : (a as any)?.__source === (b as any)?.__source;

      if (same) {
        const matchDelay: TimeoutId = setTimeout(() => {
          if (!isGameActive) return;
          playNotificationSound().catch(() => {});
          const newMatched = [...matchedCards, aId, bId];
          setMatchedCards(newMatched);

          setCards((prev) =>
            prev.map((c) =>
              newMatched.includes(c.id)
                ? { ...c, isMatched: true, isFlipped: true }
                : c
            )
          );

          setSmileVisible(bId);
          const smileTimer: TimeoutId = setTimeout(() => {
            if (!isGameActive) return;
            setSmileVisible(null);
            setCards((prev) =>
              prev.map((c) =>
                newMatched.includes(c.id) ? { ...c, isHidden: true } : c
              )
            );
            setSelectedCards([]);

            if (newMatched.length === cards.length) {
              const rounds = roundsCompleted + 1;
              setRoundsCompleted(rounds);
              setTotalStars((p) => p + getStars(level, time, moves));

              const animTimer: TimeoutId = setTimeout(() => {
                if (!isGameActive) return;
                arcOffsetY.value = withTiming(height, { duration: 700 });
                arcOpacity.value = withTiming(0, { duration: 700 });
                statsOffsetY.value = withTiming(height, { duration: 700 });
                statsOpacity.value = withTiming(0, { duration: 700 });
              }, 0);
              completionTimers.current.push(animTimer);

              const congratsTimer: TimeoutId = setTimeout(() => {
                if (!isGameActive) return;
                setShowCongrats(true);
                setShowConfetti(true);
              }, 900);
              completionTimers.current.push(congratsTimer);

              const playAgainTimer: TimeoutId = setTimeout(() => {
                if (!isGameActive) return;
                setShowPlayAgain(true);
                if (rounds >= 5) setShowUpgradePrompt(true);
              }, 2100);
              completionTimers.current.push(playAgainTimer);
            } else {
              setIsFlipping(false);
            }
          }, 2000);
          completionTimers.current.push(smileTimer);
        }, 500);
        completionTimers.current.push(matchDelay);
      } else {
        const flipBack: TimeoutId = setTimeout(() => {
          if (!isGameActive) return;
          setCards((prev) =>
            prev.map((c) =>
              newSelected.includes(c.id) ? { ...c, isFlipped: false } : c
            )
          );
          setSelectedCards([]);
          setIsFlipping(false);
        }, 500);
        completionTimers.current.push(flipBack);
      }
    } else {
      const unlock: TimeoutId = setTimeout(() => setIsFlipping(false), 500);
      completionTimers.current.push(unlock);
    }
  };

  const handleHint = () => {
    const unmatched = cards.filter((c) => !matchedCards.includes(c.id));
    if (selectedCards.length === 1) {
      const sel = cards.find((c) => c.id === selectedCards[0]);
      if (sel) {
        const key = (sel as any).__source?.uri ?? (sel as any).__source;
        const match = unmatched.find(
          (c) =>
            c.id !== sel.id &&
            ((c as any).__source?.uri ?? (c as any).__source) === key
        );
        if (match) {
          setHintActive([match.id]);
          const t: TimeoutId = setTimeout(() => setHintActive([]), 2000);
          completionTimers.current.push(t);
          return;
        }
      }
    }
    for (let i = 0; i < unmatched.length; i++) {
      for (let j = i + 1; j < unmatched.length; j++) {
        const a =
          (unmatched[i] as any).__source?.uri ?? (unmatched[i] as any).__source;
        const b =
          (unmatched[j] as any).__source?.uri ?? (unmatched[j] as any).__source;
        if (a === b) {
          setHintActive([unmatched[i].id, unmatched[j].id]);
          const t: TimeoutId = setTimeout(() => setHintActive([]), 2000);
          completionTimers.current.push(t);
          return;
        }
      }
    }
  };

  const handleBackPress = async () => {
    backScale.value = withTiming(1.1, { duration: 200 }, () => {
      backScale.value = withTiming(1, { duration: 200 });
    });
    try {
      setIsGameActive(false);
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
      completionTimers.current.forEach((t) => clearTimeout(t));
      completionTimers.current = [];
      setTotalStars(0);
      await stopSuccessSound();
      await new Promise<void>((r) => setTimeout(r, 100));
      navigation.goBack();
    } catch {
      navigation.goBack();
    }
  };

  const handlePlayAgainPressIn = () => {
    playAgainScale.value = 1.1;
    playAgainOpacity.value = 0.8;
  };
  const handlePlayAgainPressOut = () => {
    playAgainScale.value = 1;
    playAgainOpacity.value = 1;
    const t: TimeoutId = setTimeout(() => handlePlayAgain(), 300);
    completionTimers.current.push(t);
  };
  const handlePlayAgain = () => {
    setShowConfetti(false);
    setShowCongrats(false);
    setShowPlayAgain(false);
    generateCards(); // тут снова выбираются фон/рубашка/лица
  };

  const getNumColumns = () =>
    level === 4 ? 2 : level === 6 ? 3 : level === 8 ? 4 : level === 10 ? 5 : 6;
  const getCardSize = () => (level <= 6 ? 120 : 100);

  const { width: W, height: H } = Dimensions.get("window");

  const renderItem = ({ item }: { item: LibCard }) => {
    const cardSize = getCardSize();
    const faceSource = (item as any).__source as any;

    return (
      <View
        style={{
          position: "relative",
          marginHorizontal: 5,
          justifyContent: "center",
          alignItems: "center",
          width: cardSize,
          height: cardSize,
          opacity: 1,
          overflow: "visible",
          zIndex: 0,
        }}
        collapsable={false}
      >
        {item.isMatched && !item.isHidden && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: cardSize,
              height: cardSize,
              borderWidth: 3,
              borderColor: "#C57CFF",
              borderRadius: 10,
              backgroundColor: "transparent",
              shadowColor: "rgba(197,124,255,0.3)",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: 15,
              elevation: 2,
              zIndex: 1,
            }}
            pointerEvents="none"
          />
        )}

        {!item.isHidden && (
          <MemoryCard
            item={item}
            onPress={handleCardPress}
            getCardSize={getCardSize}
            disabled={isShowingCards || selectedCards.length >= 2}
            isHinted={
              hintActive.includes(item.id) || selectedCards.includes(item.id)
            }
            style={{ opacity: 1, zIndex: 0 }}
            backImage={roundBack}
            frontImage={faceSource}
          />
        )}

        {smileVisible === item.id && (
          <View
            style={{
              position: "absolute",
              left: 46,
              top: -49,
              zIndex: 9999,
              elevation: 50,
            }}
            pointerEvents="none"
            collapsable={false}
            renderToHardwareTextureAndroid
            needsOffscreenAlphaCompositing
          >
            <Image
              source={require("../assets/faceSmile.png")}
              style={{
                width: 32,
                height: 32,
                opacity: 1,
                resizeMode: "contain",
              }}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      {roundBackground && (
        <ImageBackground
          source={roundBackground.source}
          style={[
            StyleSheet.absoluteFillObject,
            { width: "100%", height: "100%", zIndex: 0 },
          ]}
          resizeMode="cover"
        />
      )}

      {roundBackground &&
        "hasStars" in roundBackground &&
        roundBackground.hasStars && (
          <Svg
            height="100%"
            width="100%"
            style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
          >
            <Defs>
              <RadialGradient id="starGradient" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1.5" />
                <Stop offset="14.58%" stopColor="#FFFFFF" stopOpacity="1.5" />
                <Stop
                  offset="100%"
                  stopColor="rgba(165, 94, 255, 0)"
                  stopOpacity="0"
                />
              </RadialGradient>
            </Defs>
            {[
              38.11, 61.37, 158.31, 18.16, 274.63, 231.97, 369.62, 524.71,
              569.3, 703.07, 751.53, 834.89, 173.82,
            ].map((x, i) => (
              <Circle
                key={i}
                cx={x}
                cy={(i * 60 + 45) % H}
                r={Math.min(W, H) * (i % 3 === 0 ? 0.04 : 0.02)}
                fill="url(#starGradient)"
              />
            ))}
          </Svg>
        )}

      {/* дуга */}
      <Animated.View style={[arcAnimatedStyle, { zIndex: 30 }]}>
        <Svg
          height={H}
          width="100%"
          style={{ position: "absolute", top: 0, left: 0, zIndex: 5 }}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
        >
          <Defs>
            <SvgLinearGradient
              id="arcGrad"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
              gradientUnits="objectBoundingBox"
            >
              <Stop offset="0" stopColor="#020743" stopOpacity="0.55" />
              <Stop offset="1" stopColor="#080001" stopOpacity="0.75" />
            </SvgLinearGradient>
            <SvgLinearGradient
              id="arcBorderGrad"
              x1="0"
              y1="0.5"
              x2="1"
              y2="0.5"
              gradientUnits="objectBoundingBox"
            >
              <Stop offset="0" stopColor="#C57CFF" stopOpacity="0" />
              <Stop offset="0.3" stopColor="#C57CFF" stopOpacity="1" />
              <Stop offset="0.7" stopColor="#C57CFF" stopOpacity="1" />
              <Stop offset="1" stopColor="#C57CFF" stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>
          <Path
            d={`M0 ${H} L0 100 Q${W / 2} 60 ${W} 100 L${W} ${H} Z`}
            fill="url(#arcGrad)"
          />
          <Path
            d={`M0 100 Q${W / 2} 60 ${W} 100`}
            fill="none"
            stroke="url(#arcBorderGrad)"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </Svg>
      </Animated.View>

      <StatusBar hidden />

      <View
        style={[
          globalStyles.containers.gameArea,
          { flex: 1, width: "100%", overflow: "visible" },
        ]}
      >
        {!showPlayAgain && (
          <Animated.View style={[styles.backButton, backAnimatedStyle]}>
            <TouchableOpacity
              onPress={handleBackPress}
              activeOpacity={0.7}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <BackIcon />
            </TouchableOpacity>
          </Animated.View>
        )}

        {!showPlayAgain && (
          <Animated.View style={[styles.hintButton, hintAnimatedStyle]}>
            <TouchableOpacity
              onPress={handleHint}
              onPressIn={() => (hintScale.value = 1.1)}
              onPressOut={() => (hintScale.value = 1)}
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
        )}

        {[8, 10, 12].includes(level) && (
          <Animated.View
            style={[styles.statsPanel, statsAnimatedStyle, { zIndex: 20 }]}
          >
            <View
              style={[
                styles.statsItem,
                {
                  backgroundColor: "#C57CFF",
                  minWidth: 100,
                  alignItems: "center",
                },
              ]}
            >
              <Text style={[styles.statsText, { color: "#FFF" }]}>
                Time: <Text>{time}s</Text>
              </Text>
            </View>
            <View style={[styles.statsItem, { backgroundColor: "#C57CFF" }]}>
              <Text style={[styles.statsText, { color: "#FFF" }]}>
                Moves: <Text>{moves}</Text>
              </Text>
            </View>
            <View style={[styles.statsItem, { backgroundColor: "#C57CFF" }]}>
              <Text style={[styles.statsText, { color: "#FFF" }]}>
                Stars: <Text>{totalStars}★</Text>
              </Text>
            </View>
          </Animated.View>
        )}

        {cards.length > 0 && (
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 100,
            }}
          >
            <FlatList
              key={`flatlist-${level}`}
              data={cards}
              renderItem={renderItem}
              keyExtractor={(it) => it.id.toString()}
              numColumns={getNumColumns()}
              columnWrapperStyle={[styles.row, { justifyContent: "center" }]}
              contentContainerStyle={[
                styles.grid,
                { paddingTop: 62, width: "100%" },
              ]}
              style={{ flex: 1, width: "100%" } as StyleProp<ViewStyle>}
              initialNumToRender={4}
              maxToRenderPerBatch={6}
              windowSize={3}
              extraData={cards}
              removeClippedSubviews={false}
              getItemLayout={(data, index) => ({
                length: getCardSize(),
                offset: getCardSize() * Math.floor(index / getNumColumns()),
                index,
              })}
            />
          </View>
        )}

        {/* Конфетти */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Confetti isActive={showConfetti} level={level} />
        </View>

        {/* Поздравление */}
        {showCongrats && (
          <View
            style={[styles.congratsContainer, { zIndex: 3500 }]}
            pointerEvents="none"
          >
            <Animated.View style={[styles.congratsGlow, congratsAnimatedStyle]}>
              <Image
                source={require("../assets/Frame_Type3_03_Decor.png")}
                style={{ width: 221, height: 221, resizeMode: "contain" }}
              />
            </Animated.View>
            <Image
              source={require("../assets/TitlFon.png")}
              style={styles.congratsFon}
            />
            <Text
              style={[styles.congratsText, { zIndex: 10 }]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {language === "es" ? "¡Felicidades!" : "Congratulations!"}
            </Text>
          </View>
        )}

        {/* Play Again */}
        {showPlayAgain && (
          <Animated.View
            style={[
              styles.playAgainButton,
              playAgainAnimatedStyle,
              {
                top: playAgainTop,
                bottom: undefined,
                zIndex: 5000,
                elevation: 50,
                position: "absolute",
                alignSelf: "center",
              },
            ]}
          >
            <TouchableOpacity
              onPressIn={handlePlayAgainPressIn}
              onPressOut={handlePlayAgainPressOut}
              activeOpacity={1}
            >
              <View style={styles.playAgainGradient}>
                <View style={styles.playAgainContent}>
                  <Text
                    style={styles.playAgainText}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    Play Game Again
                  </Text>
                  <PlayIcon />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Диалог повышения сложности */}
        <View style={{ position: "relative", zIndex: 3000 }}>
          <CustomAlert
            visible={showUpgradePrompt}
            onClose={() => setShowUpgradePrompt(false)}
            title={
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#FFF" }}>
                Match!
              </Text>
            }
            message={
              <Text style={{ fontSize: 16, color: "#FFF" }}>
                Increase difficulty?
              </Text>
            }
            onYes={() => {
              setShowUpgradePrompt(false);
              const next = level === 4 ? 6 : level === 6 ? 8 : 10;
              navigation.replace("GameScreen", { level: next, config });
              setRoundsCompleted(0);
              setMatchedCards([]);
              setTime(0);
              setMoves(0);
              setTotalStars(0);
              arcOffsetY.value = height;
              arcOpacity.value = 0;
              arcOffsetY.value = withTiming(0, { duration: 500 });
              arcOpacity.value = withTiming(1, { duration: 500 });
            }}
            onNo={() => {
              setShowUpgradePrompt(false);
              generateCards();
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default GameScreen;
