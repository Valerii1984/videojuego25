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
import { RootParamList, Card } from "../types";
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
} from "react-native-svg";
import { usePropConfig } from "../contexts/PropConfigContext";

// ───────────────────────── helpers ─────────────────────────
const asArray = (val?: string | string[]): string[] | undefined => {
  if (!val) return undefined;
  return Array.isArray(val) ? val : [val];
};
const pickRandom = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// Нормалізуємо age у “бакет” для сітки/розмірів (4,6,8,10,12)
const toGridLevel = (age: number): 4 | 6 | 8 | 10 | 12 => {
  const even = age - (age % 2); // робимо парним
  const clamped = Math.min(12, Math.max(4, even)); // у діапазон
  return (
    clamped === 4 || clamped === 6 || clamped === 8 || clamped === 10
      ? clamped
      : 12
  ) as 4 | 6 | 8 | 10 | 12;
};

// Таймери
type IntervalId = ReturnType<typeof setInterval>;
type TimeoutId = ReturnType<typeof setTimeout>;

// Кнопка Play Again — іконка з ассетів
const PlayIcon = () => (
  <Image
    source={require("../../assets/playAgain.png")}
    style={styles.playIcon}
  />
);

// Витягнути джерело лицьової картинки з локального поля
const getSrc = (c?: Card): string | undefined => {
  const anyCard = c as unknown as { __source?: { uri?: string } | string };
  if (!anyCard || !anyCard.__source) return undefined;
  return typeof anyCard.__source === "string"
    ? anyCard.__source
    : anyCard.__source.uri;
};

// ───────────────────────── component ─────────────────────────
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
  const cfg = usePropConfig();

  if (!cfg) {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: "center", alignItems: "center", padding: 24 },
        ]}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Missing configuration. Pass props into "MagicMemory" component.
        </Text>
      </View>
    );
  }

  // ✅ age замість level
  const incomingAge = (route.params as { age?: number } | undefined)?.age;
  const age = useMemo(
    () => Math.max(2, incomingAge ?? cfg.age),
    [incomingAge, cfg.age]
  );
  const gridLevel = useMemo(() => toGridLevel(age), [age]); // 4|6|8|10|12 для UI
  const pairsNeeded = useMemo(() => Math.floor(age / 2), [age]); // скільки пар треба

  const [cards, setCards] = useState<Card[]>([]);
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

  // ───────────── фон/рубашка/лиця — тільки з пропсів ─────────────
  const selectedBackground = useMemo(() => {
    const candidates = asArray(cfg.background);
    const uri =
      candidates && candidates.length > 0 ? pickRandom(candidates) : undefined;
    return uri ? { source: { uri } } : null;
  }, [cfg.background, gridLevel, age]);

  const selectedBack = useMemo(() => {
    const candidates = asArray(cfg.backCardSide);
    const uri =
      candidates && candidates.length > 0 ? pickRandom(candidates) : undefined;
    return uri ? { uri } : null;
  }, [cfg.backCardSide, gridLevel, age]);

  const externalFrontList: string[] = useMemo(() => {
    return Array.isArray(cfg.frontCardSide) ? cfg.frontCardSide : [];
  }, [cfg.frontCardSide, gridLevel, age]);

  // ───────────── анімації ─────────────
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

  // ───────────── життєвий цикл ─────────────
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
    // Статистика/таймер — для “доросліших” значень: коли gridLevel >= 8
    if (gridLevel >= 8) {
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
  }, [gridLevel, isInitialized, showCongrats, isGameActive]);

  // ───────────── генерація колоди ─────────────
  const generateCards = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }

    const pairs = pairsNeeded;
    const uniqFront = Array.from(new Set(externalFrontList));
    const backOk = !!selectedBack?.uri;
    const bgOk = !!selectedBackground?.source?.uri;
    const facesOk = uniqFront.length >= pairs;

    if (!bgOk || !backOk || !facesOk) {
      setCards([]);
      return;
    }

    // Скидання анімацій
    arcOffsetY.value = height;
    arcOpacity.value = 0;
    statsOffsetY.value = -100;
    statsOpacity.value = 0;

    // Обираємо потрібну кількість лиць і розвертаємо в пари
    const chosen = uniqFront
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, pairs)
      .map((u) => ({ source: { uri: u } as const }));
    const selectedValues = chosen.flatMap((x) => [x, x]);

    // Карточки (value — муляж, рендер по __source)
    const cardPairs: Card[] = selectedValues
      .map((val, index) => ({
        id: index,
        value: "cardFace-1" as Card["value"],
        isFlipped: false,
        isMatched: false,
        isHidden: false,
        ...({ __source: val.source } as any),
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

    // Вхідні анімації
    arcOffsetY.value = withTiming(0, { duration: 500 });
    arcOpacity.value = withTiming(1, { duration: 500 });
    statsOffsetY.value = withTiming(0, { duration: 500 });
    statsOpacity.value = withTiming(1, { duration: 500 });

    // Показ для “легкого” бакету 4
    if (gridLevel === 4) {
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

    if (gridLevel >= 8) {
      playBackgroundMusic().catch(() => {});
      timer.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
  };

  // Зірки — орієнтуємось на бакет (аналог колишніх рівнів)
  const getStars = (lvlBucket: 4 | 6 | 8 | 10 | 12, t: number, m: number) => {
    if (lvlBucket < 8) return 0;
    let maxTime = 30;
    let maxMoves = 12;
    if (lvlBucket === 10) {
      maxTime = 40;
      maxMoves = 18;
    } else if (lvlBucket === 12) {
      maxTime = 50;
      maxMoves = 24;
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

    if (gridLevel >= 8) setMoves((prev) => prev + 1);

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      const first = cards.find((c) => c.id === firstId);
      const second = cards.find((c) => c.id === secondId);

      const same = getSrc(first) && getSrc(first) === getSrc(second);

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

              const starsEarned = getStars(gridLevel, time, moves);
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
      const selected = cards.find((c) => c.id === selectedCards[0]);
      if (selected) {
        const key = getSrc(selected);
        const match = unmatched.find(
          (c) => c.id !== selected.id && getSrc(c) === key
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
        const a = getSrc(unmatched[i]);
        const b = getSrc(unmatched[j]);
        if (a && b && a === b) {
          setHintActive([unmatched[i].id, unmatched[j].id]);
          const t: TimeoutId = setTimeout(() => setHintActive([]), 2000);
          completionTimers.current.push(t);
          return;
        }
      }
    }
  };

  const getNumColumns = () => {
    switch (gridLevel) {
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
        return 3;
    }
  };

  const getCardSize = () => {
    switch (gridLevel) {
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
        return 110;
    }
  };

  const renderItem = ({ item }: { item: Card }) => {
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
            backImage={selectedBack!}
            frontImage={faceSource}
          />
        )}

        {/* 😄 смайл */}
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
              source={require("../../assets/faceSmile.png")}
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
    generateCards();
  };

  // Валідація пропсів
  const cfgOk =
    selectedBackground &&
    selectedBack &&
    externalFrontList.length >= pairsNeeded;

  if (!cfgOk) {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          { padding: 24, justifyContent: "center" },
        ]}
      >
        <Text style={{ color: "#fff", fontSize: 16, marginBottom: 8 }}>
          Invalid props. Expected:
        </Text>
        <Text style={{ color: "#ccc", marginBottom: 4 }}>
          • background: at least one image URL
        </Text>
        <Text style={{ color: "#ccc", marginBottom: 4 }}>
          • backCardSide: at least one image URL
        </Text>
        <Text style={{ color: "#ccc" }}>
          • frontCardSide: at least {pairsNeeded} unique image URLs
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      <ImageBackground
        source={selectedBackground!.source}
        style={[
          StyleSheet.absoluteFillObject,
          { width: "100%", height: "100%", zIndex: 0 },
        ]}
        resizeMode="cover"
      />

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

        {gridLevel >= 8 && (
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
              key={`flatlist-${gridLevel}-${age}`} // ключ включає бакет і age
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

        {/* конфетті */}
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Confetti isActive={showConfetti} level={gridLevel} />
        </View>

        {/* привітання */}
        {showCongrats && (
          <View
            style={[styles.congratsContainer, { zIndex: 3500 }]}
            pointerEvents="none"
          >
            <Animated.View style={[styles.congratsGlow, congratsAnimatedStyle]}>
              <Image
                source={require("../../assets/Frame_Type3_03_Decor.png")}
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
              source={require("../../assets/TitlFon.png")}
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

        {/* апгрейд-діалог (інкрементуємо age на 2, щоб залишатися парним) */}
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
              const nextAge = age + 2;
              navigation.replace("GameScreen", { age: nextAge });
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
