import { useEffect, useRef, useState, useMemo } from "react";
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
  ImageSourcePropType,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLanguage } from "../contexts/LanguageContext";
import { useSound } from "../contexts/SoundContext";
import * as ScreenOrientation from "expo-screen-orientation";
import Confetti from "../components/Confetti";
import CustomAlert from "../components/CustomAlert";
import MemoryCard from "../components/Card";
import { RootParamList, Card } from "../types/index";
import { isWeb } from "../utils/config";
import globalStyles from "../styles/global-styles";
import BackIcon from "../../icons/BackIcon";
import styles from "./GameScreen.styles";
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

/** ---------- ВНЕШНИЙ КОНФИГ через global.* ----------
 * Ожидаем, что песочница положит:
 * (global as any).MAGIC_MEMORY_EXTERNAL_CONFIG = {
 *   level?: 4|6|8|10|12,
 *   lang?: string,
 *   background?: string | string[] | Partial<Record<4|6|8|10|12, string|string[]>>,
 *   backCard?: string | string[] | Partial<Record<4|6|8|10|12, string|string[]>>,
 *   // ВАЖНО: теперь поддерживаем и массив, и помеуровневую схему
 *   frontCards?: string[] | Partial<Record<4|6|8|10|12, string[]>>
 * }
 */
type LevelKey = 4 | 6 | 8 | 10 | 12;
type PerLevelURIs =
  | string
  | string[]
  | Partial<Record<LevelKey, string | string[]>>;

interface ExternalConfig {
  level?: LevelKey;
  lang?: string;
  background?: PerLevelURIs;
  backCard?: PerLevelURIs;
  frontCards?: string[] | Partial<Record<LevelKey, string[]>>;
}

const asArray = (val?: string | string[]): string[] | undefined => {
  if (!val) return undefined;
  return Array.isArray(val) ? val : [val];
};

const pickRandom = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const resolvePerLevel = (
  src: PerLevelURIs | undefined,
  level: LevelKey
): string[] | undefined => {
  if (!src) return undefined;
  if (typeof src === "string") return [src];
  if (Array.isArray(src)) return src;
  const lvl = src[level];
  return asArray(lvl as string | string[] | undefined);
};

// таймеры
type IntervalId = ReturnType<typeof setInterval>;
type TimeoutId = ReturnType<typeof setTimeout>;

// ассеты (фоллбеки)
const assetFrontGroups: Record<string, ImageSourcePropType[]> = {
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

const assetBacks: ImageSourcePropType[] = [
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

// иконка Play Again
const PlayIcon = () => (
  <Image source={require("../assets/playAgain.png")} style={styles.playIcon} />
);

const GameScreen = () => {
  const { language } = useLanguage();
  const {
    playNotificationSound,
    playSuccessSound,
    playBackgroundMusic,
    stopSuccessSound,
  } = useSound();

  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const route = useRoute();
  const incomingLevel = (route.params as { level: number } | undefined)?.level;

  const externalConfig: ExternalConfig | undefined = (global as any)
    ?.MAGIC_MEMORY_EXTERNAL_CONFIG;

  // текущий уровень: приоритет route → external → 4
  const level: LevelKey = useMemo(() => {
    const raw = (incomingLevel ?? externalConfig?.level ?? 4) as number;
    const allowed: LevelKey[] = [4, 6, 8, 10, 12];
    return (allowed.includes(raw as LevelKey) ? raw : 4) as LevelKey;
  }, [incomingLevel, externalConfig?.level]);

  const [cards, setCards] = useState<Card[]>([]);
  // map для лиц карт: id -> источник (uri/require)
  const [frontSources, setFrontSources] = useState<
    Record<number, ImageSourcePropType>
  >({});
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

  const timer = useRef<IntervalId | null>(null);
  const completionTimers = useRef<TimeoutId[]>([]);

  const [isInitialized, setIsInitialized] = useState(false);
  const [hintActive, setHintActive] = useState<number[]>([]);
  const [smileVisible, setSmileVisible] = useState<number | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);

  // seed, чтобы на каждый старт брать новый фон/рубашку
  const [roundSeed, setRoundSeed] = useState(0);

  const arcOffsetY = useSharedValue(0);
  const arcOpacity = useSharedValue(1);
  const statsOffsetY = useSharedValue(0);
  const statsOpacity = useSharedValue(1);
  const playAgainScale = useSharedValue(1);
  const playAgainOpacity = useSharedValue(1);
  const hintScale = useSharedValue(1);
  const backScale = useSharedValue(1);
  const congratsPulse = useSharedValue(1.05);

  const { width, height } = Dimensions.get("window");

  const PLAY_AGAIN_OFFSET = 110;
  const PLAY_AGAIN_CAP = 0.78;
  const playAgainTop = Math.min(
    height * PLAY_AGAIN_CAP,
    height * 0.6 + PLAY_AGAIN_OFFSET
  );

  // ---------- выбор фона и рубашки: теперь завязано на roundSeed ----------
  const selectedBackground = useMemo(() => {
    const candidates = resolvePerLevel(externalConfig?.background, level);
    if (candidates && candidates.length > 0) {
      const uri = pickRandom(candidates);
      return { source: { uri }, hasStars: false as const };
    }
    // фоллбэк — ассеты
    return assetBackgrounds[
      Math.floor(Math.random() * assetBackgrounds.length)
    ];
    // roundSeed в deps, чтобы менять на каждом старте
  }, [externalConfig?.background, level, roundSeed]);

  const selectedBack: ImageSourcePropType = useMemo(() => {
    const candidates = resolvePerLevel(externalConfig?.backCard, level);
    if (candidates && candidates.length > 0) {
      const uri = pickRandom(candidates);
      return { uri };
    }
    return assetBacks[Math.floor(Math.random() * assetBacks.length)];
  }, [externalConfig?.backCard, level, roundSeed]);

  // список лиц из внешнего конфига (поддерживаем и массив, и помеуровневую схему)
  const externalFrontList: string[] | undefined = useMemo(() => {
    const fc = externalConfig?.frontCards;
    if (!fc) return undefined;
    if (Array.isArray(fc)) return fc;
    const byLevel = fc[level];
    if (byLevel && byLevel.length > 0) return byLevel;
    return undefined;
  }, [externalConfig?.frontCards, level, roundSeed]);

  // анимации
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

  // прелоад ассетных фонов (не мешает URL)
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
    if (!isWeb) {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
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
      timer.current = setInterval(() => setTime((prev) => prev + 1), 1000);
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

  const generateCards = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }

    // новый seed → поменяются фон/рубашка
    setRoundSeed((s) => s + 1);

    // сброс анимаций
    arcOffsetY.value = height;
    arcOpacity.value = 0;
    statsOffsetY.value = -100;
    statsOpacity.value = 0;

    const totalPairs = Math.floor(level / 2);

    // формируем пул лиц
    let frontPool: ImageSourcePropType[] = [];
    if (externalFrontList && externalFrontList.length > 0) {
      const uniq = Array.from(new Set(externalFrontList));
      if (uniq.length >= totalPairs) {
        frontPool = uniq.map((u) => ({ uri: u }));
      }
    }
    if (frontPool.length === 0) {
      // фоллбэк — ассеты
      const groupKeys = Object.keys(assetFrontGroups);
      const selectedGroup =
        groupKeys[Math.floor(Math.random() * groupKeys.length)];
      frontPool = assetFrontGroups[selectedGroup];
    }

    const shuffled = [...frontPool].sort(() => Math.random() - 0.5);
    const pairsToUse = Math.min(totalPairs, shuffled.length);
    const chosen = shuffled.slice(0, pairsToUse);
    const duplicated = chosen
      .flatMap((x) => [x, x])
      .sort(() => Math.random() - 0.5);

    // карты (без лишних полей — чистый тип Card)
    const cardPairs: Card[] = duplicated.map((_, index) => ({
      id: index,
      // значение берём любое из допустимых (совпадение будем проверять по frontSources)
      value: "cardFace-1",
      isFlipped: false,
      isMatched: false,
      isHidden: false,
    }));

    // источник лиц по id
    const srcMap: Record<number, ImageSourcePropType> = {};
    duplicated.forEach((src, idx) => {
      srcMap[idx] = src;
    });

    setFrontSources(srcMap);
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

    // анимации входа
    arcOffsetY.value = withTiming(0, { duration: 500 });
    arcOpacity.value = withTiming(1, { duration: 500 });
    statsOffsetY.value = withTiming(0, { duration: 500 });
    statsOpacity.value = withTiming(1, { duration: 500 });

    if (level === 4) {
      setIsShowingCards(true);
      const showTimer: TimeoutId = setTimeout(() => {
        const updated = cardPairs.map((c) => ({ ...c, isFlipped: true }));
        setCards(updated);
        const hideTimer: TimeoutId = setTimeout(() => {
          const closed = cardPairs.map((c) => ({ ...c, isFlipped: false }));
          setCards(closed);
          setIsShowingCards(false);
        }, 3000);
        completionTimers.current.push(hideTimer);
      }, 1000);
      completionTimers.current.push(showTimer);
    }
    if ([8, 10, 12].includes(level)) {
      playBackgroundMusic().catch(() => {});
      timer.current = setInterval(() => setTime((prev) => prev + 1), 1000);
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

  const keyFor = (id: number) => {
    const src = frontSources[id];
    // для {uri} берём uri, для require — сам объект
    return (src as any)?.uri ?? src;
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

    if ([8, 10, 12].includes(level)) setMoves((prev) => prev + 1);

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      const same = keyFor(firstId) === keyFor(secondId);

      if (same) {
        const matchDelay: TimeoutId = setTimeout(() => {
          if (!isGameActive) return;
          playNotificationSound().catch(() => {});
          const newMatched = [...matchedCards, firstId, secondId];
          setMatchedCards(newMatched);

          setCards((prev) =>
            prev.map((card) =>
              newMatched.includes(card.id)
                ? { ...card, isMatched: true, isFlipped: true }
                : card
            )
          );

          setSmileVisible(secondId);

          const smileTimer: TimeoutId = setTimeout(() => {
            if (!isGameActive) return;
            setSmileVisible(null);
            setCards((prev) =>
              prev.map((card) =>
                newMatched.includes(card.id)
                  ? { ...card, isHidden: true }
                  : card
              )
            );
            setSelectedCards([]);
            if (newMatched.length === cards.length) {
              const newRounds = roundsCompleted + 1;
              setRoundsCompleted(newRounds);

              const starsEarned = getStars(level, time, moves);
              setTotalStars((prev) => prev + starsEarned);

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
                if (newRounds >= 5) setShowUpgradePrompt(true);
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
        const flipBackTimer: TimeoutId = setTimeout(() => {
          if (!isGameActive) return;
          setCards((prev) =>
            prev.map((card) =>
              newSelected.includes(card.id)
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setSelectedCards([]);
          setIsFlipping(false);
        }, 500);
        completionTimers.current.push(flipBackTimer);
      }
    } else {
      const unlockTimer: TimeoutId = setTimeout(
        () => setIsFlipping(false),
        500
      );
      completionTimers.current.push(unlockTimer);
    }
  };

  const handleHint = () => {
    const unmatched = cards.filter((c) => !matchedCards.includes(c.id));
    if (selectedCards.length === 1) {
      const selId = selectedCards[0];
      const key = keyFor(selId);
      const match = unmatched.find(
        (c) => c.id !== selId && keyFor(c.id) === key
      );
      if (match) {
        setHintActive([match.id]);
        const t: TimeoutId = setTimeout(() => setHintActive([]), 2000);
        completionTimers.current.push(t);
        return;
      }
    }
    for (let i = 0; i < unmatched.length; i++) {
      for (let j = i + 1; j < unmatched.length; j++) {
        if (keyFor(unmatched[i].id) === keyFor(unmatched[j].id)) {
          setHintActive([unmatched[i].id, unmatched[j].id]);
          const t: TimeoutId = setTimeout(() => setHintActive([]), 2000);
          completionTimers.current.push(t);
          return;
        }
      }
    }
  };

  const getNumColumns = () => {
    switch (level) {
      case 4:
        return 2;
      case 6:
        return 3;
      case 8:
        return 4;
      case 10:
        return 5;
      case 12:
        return 6;
      default:
        return 2;
    }
  };

  const getCardSize = () => {
    switch (level) {
      case 4:
        return 120;
      case 6:
        return 120;
      case 8:
        return 100;
      case 10:
      case 12:
        return 100;
      default:
        return 120;
    }
  };

  const renderItem = ({ item }: { item: Card }) => {
    const cardSize = getCardSize();
    const faceSource = frontSources[item.id];

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
              shadowColor: "rgba(197, 124, 255, 0.3)",
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
            backImage={selectedBack}
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
                transform: [{ rotate: "0deg" }],
                resizeMode: "contain",
              }}
            />
          </View>
        )}
      </View>
    );
  };

  const handleHintPressIn = () => {
    hintScale.value = 1.1;
  };
  const handleHintPressOut = () => {
    hintScale.value = 1;
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
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
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
    const t: TimeoutId = setTimeout(() => {
      handlePlayAgain();
    }, 300);
    completionTimers.current.push(t);
  };

  const handlePlayAgain = () => {
    setShowConfetti(false);
    setShowCongrats(false);
    setShowPlayAgain(false);
    generateCards(); // здесь дергается setRoundSeed → фон/рубашка сменятся
  };

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      <ImageBackground
        source={selectedBackground.source}
        style={[
          StyleSheet.absoluteFillObject,
          { width: "100%", height: "100%", zIndex: 0 },
        ]}
        resizeMode="cover"
      />

      {/* звёздное свечение — только для ассетного фона с hasStars */}
      {"hasStars" in selectedBackground && selectedBackground.hasStars && (
        <Svg
          height="100%"
          width="100%"
          style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
          viewBox={`0 0 ${width} ${height}`}
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
          <Circle
            cx={38.11}
            cy={44.71}
            r={Math.min(width, height) * 0.03}
            fill="url(#starGradient)"
          />
          <Circle
            cx={61.37}
            cy={188.17}
            r={Math.min(width, height) * 0.02}
            fill="url(#starGradient)"
          />
          <Circle
            cx={158.31}
            cy={250.21}
            r={Math.min(width, height) * 0.02}
            fill="url(#starGradient)"
          />
          <Circle
            cx={18.16}
            cy={366.52}
            r={Math.min(width, height) * 0.03}
            fill="url(#starGradient)"
          />
          <Circle
            cx={274.63}
            cy={137.76}
            r={Math.min(width, height) * 0.02}
            fill="url(#starGradient)"
          />
          <Circle
            cx={231.97}
            cy={356.83}
            r={Math.min(width, height) * 0.03}
            fill="url(#starGradient)"
          />
          <Circle
            cx={369.62}
            cy={141.64}
            r={Math.min(width, height) * 0.02}
            fill="url(#starGradient)"
          />
          <Circle
            cx={524.71}
            cy={25.34}
            r={Math.min(width, height) * 0.03}
            fill="url(#starGradient)"
          />
          <Circle
            cx={569.3}
            cy={347.15}
            r={Math.min(width, height) * 0.03}
            fill="url(#starGradient)"
          />
          <Circle
            cx={703.07}
            cy={225.01}
            r={Math.min(width, height) * 0.03}
            fill="url(#starGradient)"
          />
          <Circle
            cx={751.53}
            cy={48.59}
            r={Math.min(width, height) * 0.03}
            fill="url(#starGradient)"
          />
          <Circle
            cx={834.89}
            cy={327.75}
            r={Math.min(width, height) * 0.04}
            fill="url(#starGradient)"
          />
          <Circle
            cx={173.82}
            cy={44.71}
            r={Math.min(width, height) * 0.04}
            fill="url(#starGradient)"
          />
        </Svg>
      )}

      {/* дуга + бордер */}
      <Animated.View style={[arcAnimatedStyle, { zIndex: 30 }]}>
        <Svg
          height={height}
          width="100%"
          style={{ position: "absolute", top: 0, left: 0, zIndex: 5 }}
          viewBox={`0 0 ${width} ${height}`}
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
            d={`M0 ${height} L0 100 Q${width / 2} 60 ${width} 100 L${width} ${height} Z`}
            fill="url(#arcGrad)"
          />
          <Path
            d={`M0 100 Q${width / 2} 60 ${width} 100`}
            fill="none"
            stroke="url(#arcBorderGrad)"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </Svg>
        <View
          style={{
            height: height * 0.4,
            position: "absolute",
            bottom: 0,
            width: "100%",
            opacity: 0.5,
            zIndex: 4,
          }}
        />
      </Animated.View>

      <StatusBar hidden />

      <View
        style={[
          globalStyles.containers.gameArea,
          { flex: 1, width: "100%", opacity: 1, overflow: "visible" },
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
              onPressIn={handleHintPressIn}
              onPressOut={handleHintPressOut}
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
            style={[
              styles.statsPanel,
              statsAnimatedStyle,
              { zIndex: 20, opacity: 1 },
            ]}
          >
            <View
              style={[
                styles.statsItem,
                {
                  backgroundColor: "#C57CFF",
                  width: "auto",
                  minWidth: 100,
                  flexShrink: 0,
                  flexGrow: 0,
                  alignItems: "center",
                },
              ]}
            >
              <Text style={[styles.statsText, { color: "#FFF", opacity: 1 }]}>
                Time: <Text>{time}s</Text>
              </Text>
            </View>
            <View style={[styles.statsItem, { backgroundColor: "#C57CFF" }]}>
              <Text style={[styles.statsText, { color: "#FFF", opacity: 1 }]}>
                Moves: <Text>{moves}</Text>
              </Text>
            </View>
            <View style={[styles.statsItem, { backgroundColor: "#C57CFF" }]}>
              <Text style={[styles.statsText, { color: "#FFF", opacity: 1 }]}>
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
              overflow: "visible",
            }}
          >
            <FlatList
              key={`flatlist-${level}`}
              data={cards}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              numColumns={getNumColumns()}
              columnWrapperStyle={[
                styles.row,
                { justifyContent: "center", overflow: "visible" },
              ]}
              contentContainerStyle={[
                styles.grid,
                { paddingTop: 62, width: "100%", overflow: "visible" },
              ]}
              style={
                {
                  flex: 1,
                  width: "100%",
                  overflow: "visible",
                } as StyleProp<ViewStyle>
              }
              initialNumToRender={2}
              maxToRenderPerBatch={2}
              windowSize={1}
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
                style={{
                  width: 221,
                  height: 221,
                  resizeMode: "contain",
                  opacity: 1,
                  zIndex: 2,
                }}
              />
            </Animated.View>
            <Image
              source={require("../assets/TitlFon.png")}
              style={[styles.congratsFon, { opacity: 1 }]}
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

        {/* Кнопка Play Again */}
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
              <View style={[styles.playAgainGradient, { opacity: 1 }]}>
                <View style={[styles.playAgainContent, { opacity: 1 }]}>
                  <Text
                    style={[styles.playAgainText, { opacity: 1 }]}
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

        {/* Апгрейд-диалог */}
        <View style={{ position: "relative", zIndex: 3000 }}>
          <CustomAlert
            visible={showUpgradePrompt}
            onClose={() => setShowUpgradePrompt(false)}
            title={
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#FFF" }}>
                {language === "es" ? "¡Coincidencia!" : "Match!"}
              </Text>
            }
            message={
              <Text style={{ fontSize: 16, color: "#FFF" }}>
                {language === "es"
                  ? "¿Subir a un nivel más difícil?"
                  : "Increase difficulty?"}
              </Text>
            }
            onYes={() => {
              setShowUpgradePrompt(false);
              const next = level === 4 ? 6 : level === 6 ? 8 : 10;
              navigation.replace("GameScreen", { level: next });
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
