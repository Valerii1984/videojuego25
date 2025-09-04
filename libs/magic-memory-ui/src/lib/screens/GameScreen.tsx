import { useEffect, useRef, useState } from "react";
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
import BackgroundWrapper from "../components/BackgroundWrapper";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Path,
  RadialGradient,
  Circle,
} from "react-native-svg";

// универсальные типы для таймеров
type IntervalId = ReturnType<typeof setInterval>;
type TimeoutId = ReturnType<typeof setTimeout>;

// ключи ассетов карточек и фонов
type CardImageKeys =
  | "cardFace-1"
  | "cardFace-2"
  | "cardFace-3"
  | "cardFace-4"
  | "cardFace-5"
  | "cardFace-6"
  | "card-1"
  | "faceSmile"
  | "boy"
  | "donkey"
  | "girl"
  | "kengoo"
  | "owl"
  | "pig"
  | "puh"
  | "tigr"
  | "SJ_GAMES_WTP_CARDS_v01_0000"
  | "SJ_GAMES_WTP_CARDS_v01_0001"
  | "SJ_GAMES_WTP_CARDS_v01_0002"
  | "SJ_GAMES_WTP_CARDS_v01_0003"
  | "SJ_GAMES_WTP_CARDS_v01_0004"
  | "SJ_GAMES_WTP_CARDS_v01_0005"
  | "SJ_GAMES_WTP_CARDS_v01_0006"
  | "SJ_GAMES_WTP_CARDS_v01_0007";

// карта ассетов
const cardImages: Record<CardImageKeys, any> = {
  "cardFace-1": require("../assets/cardFace-1.jpg"),
  "cardFace-2": require("../assets/cardFace-2.jpg"),
  "cardFace-3": require("../assets/cardFace-3.jpg"),
  "cardFace-4": require("../assets/cardFace-4.jpg"),
  "cardFace-5": require("../assets/cardFace-5.jpg"),
  "cardFace-6": require("../assets/cardFace-6.jpg"),
  "card-1": require("../assets/card-1.jpg"),
  faceSmile: require("../assets/faceSmile.png"),
  boy: require("../assets/animtest/facecard/boy.png"),
  donkey: require("../assets/animtest/facecard/donkey.png"),
  girl: require("../assets/animtest/facecard/girl.png"),
  kengoo: require("../assets/animtest/facecard/kengoo.png"),
  owl: require("../assets/animtest/facecard/owl.png"),
  pig: require("../assets/animtest/facecard/pig.png"),
  puh: require("../assets/animtest/facecard/puh.png"),
  tigr: require("../assets/animtest/facecard/tigr.png"),
  SJ_GAMES_WTP_CARDS_v01_0000: require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0000.jpg"),
  SJ_GAMES_WTP_CARDS_v01_0001: require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0001.jpg"),
  SJ_GAMES_WTP_CARDS_v01_0002: require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0002.jpg"),
  SJ_GAMES_WTP_CARDS_v01_0003: require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0003.jpg"),
  SJ_GAMES_WTP_CARDS_v01_0004: require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0004.jpg"),
  SJ_GAMES_WTP_CARDS_v01_0005: require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0005.jpg"),
  SJ_GAMES_WTP_CARDS_v01_0006: require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0006.jpg"),
  SJ_GAMES_WTP_CARDS_v01_0007: require("../assets/animtest/backcard/SJ_GAMES_WTP_CARDS_v01_0007.jpg"),
};

// иконка Play Again
const PlayIcon = () => (
  <Image source={require("../assets/playAgain.png")} style={styles.playIcon} />
);

// варианты задников карты
const backOptions: CardImageKeys[] = [
  "card-1",
  "SJ_GAMES_WTP_CARDS_v01_0000",
  "SJ_GAMES_WTP_CARDS_v01_0001",
  "SJ_GAMES_WTP_CARDS_v01_0002",
  "SJ_GAMES_WTP_CARDS_v01_0003",
  "SJ_GAMES_WTP_CARDS_v01_0004",
  "SJ_GAMES_WTP_CARDS_v01_0005",
  "SJ_GAMES_WTP_CARDS_v01_0006",
  "SJ_GAMES_WTP_CARDS_v01_0007",
];

// варианты фонов
const backgroundOptions = [
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
  const { level } = (route.params as { level: number }) || { level: 4 };
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

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

  // группы лиц карточек
  const frontGroups: Record<string, CardImageKeys[]> = {
    cardFace: [
      "cardFace-1",
      "cardFace-2",
      "cardFace-3",
      "cardFace-4",
      "cardFace-5",
      "cardFace-6",
    ],
    facecard: ["boy", "donkey", "girl", "kengoo", "owl", "pig", "puh", "tigr"],
  };

  // выбранные задник/фон
  const [selectedBack, setSelectedBack] = useState<CardImageKeys>(
    () => backOptions[Math.floor(Math.random() * backOptions.length)]
  );
  const [selectedBackground, setSelectedBackground] = useState<{
    source: any;
    hasStars: boolean;
  }>(
    () =>
      backgroundOptions[Math.floor(Math.random() * backgroundOptions.length)]
  );

  // размеры экрана
  const { width, height } = Dimensions.get("window");

  // позиция кнопки — ниже баннера поздравления
  const PLAY_AGAIN_OFFSET = 110; // было 140 → стало 110
  const PLAY_AGAIN_CAP = 0.78; // было 0.82 → стало 0.78

  const playAgainTop = Math.min(
    height * PLAY_AGAIN_CAP,
    height * 0.6 + PLAY_AGAIN_OFFSET
  );

  // предварительная загрузка фонов
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = backgroundOptions.map((bg) =>
        Image.prefetch(Image.resolveAssetSource(bg.source).uri)
      );
      try {
        await Promise.all(imagePromises);
        console.log("All background images preloaded");
      } catch (error: unknown) {
        console.error("Error preloading background images:", error);
      }
    };
    preloadImages();
  }, []);

  useEffect(() => {
    console.log("Screen dimensions:", { width, height });
  }, [width, height]);

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

  useEffect(() => {
    console.log(
      "Attempting to load Frame_Type3_03_Decor.png:",
      require("../assets/Frame_Type3_03_Decor.png")
    );
    console.log(
      "Attempting to load TitlFon.png:",
      require("../assets/TitlFon.png")
    );

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
      playBackgroundMusic().catch((error: unknown) =>
        console.error("Error playing background music:", error)
      );
      timer.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    }

    if (showCongrats && isGameActive) {
      playSuccessSound().catch((error: unknown) =>
        console.error("Error in useEffect playSuccessSound:", error)
      );
      congratsPulse.value = withRepeat(
        withTiming(1.2, { duration: 2000 }),
        -1,
        true
      );
    }

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [level, isInitialized, showCongrats, isGameActive]);

  const generateCards = () => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }

    // сброс анимаций
    arcOffsetY.value = height;
    arcOpacity.value = 0;
    statsOffsetY.value = -100;
    statsOpacity.value = 0;

    const totalPairs = Math.floor(level / 2);
    const groupKeys = Object.keys(frontGroups);
    const selectedGroup =
      groupKeys[Math.floor(Math.random() * groupKeys.length)];
    const availableValues = frontGroups[selectedGroup];
    const maxPairs = availableValues.length;
    const pairsToUse = Math.min(totalPairs, maxPairs);
    const shuffledFronts = availableValues
      .sort(() => Math.random() - 0.5)
      .slice(0, pairsToUse);
    const selectedValues = shuffledFronts.flatMap((value) => [value, value]);
    const cardPairs = selectedValues
      .map((value, index) => ({
        id: index,
        value: value as Card["value"],
        isFlipped: false,
        isMatched: false,
        isHidden: false,
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

    // анимации входа
    arcOffsetY.value = withTiming(0, { duration: 500 });
    arcOpacity.value = withTiming(1, { duration: 500 });
    statsOffsetY.value = withTiming(0, { duration: 500 });
    statsOpacity.value = withTiming(1, { duration: 500 });

    if (level === 4) {
      setIsShowingCards(true);
      const showTimer: TimeoutId = setTimeout(() => {
        const updatedCards = cardPairs.map((card) => ({
          ...card,
          isFlipped: true,
        }));
        setCards(updatedCards);
        const hideTimer: TimeoutId = setTimeout(() => {
          const closedCards = cardPairs.map((card) => ({
            ...card,
            isFlipped: false,
          }));
          setCards(closedCards);
          setIsShowingCards(false);
        }, 3000);
        completionTimers.current.push(hideTimer);
      }, 1000);
      completionTimers.current.push(showTimer);
    }
    if ([8, 10, 12].includes(level)) {
      playBackgroundMusic().catch((error: unknown) =>
        console.error("Error playing background music:", error)
      );
      timer.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
  };

  const getStars = (level: number, time: number, moves: number) => {
    if (![8, 10, 12].includes(level)) return 0;

    let maxTime: number;
    let maxMoves: number;

    switch (level) {
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

    if (time <= maxTime && moves <= maxMoves) return 3;
    if (time <= maxTime * 1.2 && moves <= maxMoves * 1.2) return 2;
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
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, isFlipped: true } : card
      )
    );

    if ([8, 10, 12].includes(level)) setMoves((prev) => prev + 1);

    if (newSelected.length === 2) {
      const [firstId, secondId] = newSelected;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard?.value === secondCard?.value) {
        const matchDelay: TimeoutId = setTimeout(() => {
          if (!isGameActive) return;
          playNotificationSound().catch((error: unknown) =>
            console.error("Error playing notification sound:", error)
          );
          const newMatchedCards = [...matchedCards, firstId, secondId];
          setMatchedCards(newMatchedCards);

          setCards((prevCards) =>
            prevCards.map((card) =>
              newMatchedCards.includes(card.id)
                ? { ...card, isMatched: true, isFlipped: true }
                : card
            )
          );

          // показать смайл над второй картой
          setSmileVisible(secondId);

          const smileTimer: TimeoutId = setTimeout(() => {
            if (!isGameActive) return;
            setSmileVisible(null);
            setCards((prevCards) =>
              prevCards.map((card) =>
                newMatchedCards.includes(card.id)
                  ? { ...card, isHidden: true }
                  : card
              )
            );
            setSelectedCards([]);
            if (newMatchedCards.length === cards.length) {
              const newRoundsCompleted = roundsCompleted + 1;
              setRoundsCompleted(newRoundsCompleted);

              const starsEarned = getStars(level, time, moves);
              setTotalStars((prev) => prev + starsEarned);

              // NEW: сначала прячем дугу/статистику
              const animTimer: TimeoutId = setTimeout(() => {
                if (!isGameActive) return;
                arcOffsetY.value = withTiming(height, { duration: 700 });
                arcOpacity.value = withTiming(0, { duration: 700 });
                statsOffsetY.value = withTiming(height, { duration: 700 });
                statsOpacity.value = withTiming(0, { duration: 700 });
              }, 0);
              completionTimers.current.push(animTimer);

              // затем — показываем поздравление И конфетти
              const congratsTimer: TimeoutId = setTimeout(() => {
                if (!isGameActive) return;
                setShowCongrats(true);
                setShowConfetti(true);
              }, 900);
              completionTimers.current.push(congratsTimer);

              // и только после этого — кнопку
              const playAgainTimer: TimeoutId = setTimeout(() => {
                if (!isGameActive) return;
                setShowPlayAgain(true);
                if (newRoundsCompleted >= 5) {
                  setShowUpgradePrompt(true);
                }
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
          setCards((prevCards) =>
            prevCards.map((card) =>
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
    const unmatchedCards = cards.filter(
      (card) => !matchedCards.includes(card.id)
    );
    if (selectedCards.length === 1) {
      const selectedCard = cards.find((card) => card.id === selectedCards[0]);
      if (selectedCard) {
        const matchingCard = unmatchedCards.find(
          (card) =>
            card.value === selectedCard.value &&
            !selectedCards.includes(card.id)
        );
        if (matchingCard) {
          setHintActive([matchingCard.id]);
          const hintTimer: TimeoutId = setTimeout(
            () => setHintActive([]),
            2000
          );
          completionTimers.current.push(hintTimer);
          return;
        }
      }
    }
    for (let i = 0; i < unmatchedCards.length; i++) {
      for (let j = i + 1; j < unmatchedCards.length; j++) {
        if (unmatchedCards[i].value === unmatchedCards[j].value) {
          const hintIds = [unmatchedCards[i].id, unmatchedCards[j].id];
          setHintActive(hintIds);
          const hintTimer: TimeoutId = setTimeout(
            () => setHintActive([]),
            2000
          );
          completionTimers.current.push(hintTimer);
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

  // >>>>>>>>>>>>>>> смайл над карточкой
  const renderItem = ({ item }: { item: Card }) => {
    const cardSize = getCardSize();

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
            backImage={
              cardImages[selectedBack] || require("../assets/card-1.jpg")
            }
            frontImage={
              cardImages[item.value as CardImageKeys] ||
              require("../assets/card-1.jpg")
            }
          />
        )}

        {smileVisible === item.id && (
          <View
            style={{
              position: "absolute",
              left: 46, // координаты не меняем
              top: -49, // координаты не меняем
              zIndex: 9999,
              elevation: 50,
            }}
            pointerEvents="none"
            collapsable={false}
            renderToHardwareTextureAndroid
            needsOffscreenAlphaCompositing
          >
            <Image
              source={cardImages.faceSmile}
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
  // <<<<<<<<<<<<<<< смайл

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
    } catch (error: unknown) {
      console.error("Error stopping success sound:", error);
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
    const playAgainDelay: TimeoutId = setTimeout(() => {
      handlePlayAgain();
    }, 300);
    completionTimers.current.push(playAgainDelay);
  };

  const handlePlayAgain = () => {
    setShowConfetti(false);
    setShowCongrats(false);
    setShowPlayAgain(false);
    setSelectedBackground(
      backgroundOptions[Math.floor(Math.random() * backgroundOptions.length)]
    );
    setSelectedBack(
      backOptions[Math.floor(Math.random() * backOptions.length)]
    );
    generateCards();
  };

  return (
    <BackgroundWrapper overlay={false}>
      <View
        style={{
          backgroundColor: "#1C2526",
          flex: 1,
          width: "100%",
          height: "100%",
          overflow: "visible",
        }}
      >
        <ImageBackground
          source={selectedBackground.source}
          style={[
            StyleSheet.absoluteFillObject,
            { width: "100%", height: "100%", zIndex: 0 },
          ]}
          resizeMode="cover"
          onLoad={() =>
            console.log("Background loaded:", selectedBackground.source)
          }
          onError={(error: unknown) =>
            console.error(
              "Error loading background:",
              selectedBackground.source,
              error
            )
          }
        />
        {selectedBackground.hasStars && (
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

        <View
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          <Animated.View style={[arcAnimatedStyle, { zIndex: 30 }]}>
            <Svg
              height={height}
              width="100%"
              style={{ position: "absolute", top: 0, left: 0, zIndex: 5 }}
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              onLayout={() => console.log("SVG arc rendered with gradient")}
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
                onLayout={() =>
                  console.log("Border path rendered with gradient")
                }
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

          <StatusBar hidden={true} />

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
                  <Text
                    style={[styles.statsText, { color: "#FFF", opacity: 1 }]}
                  >
                    Time: <Text>{time}s</Text>
                  </Text>
                </View>
                <View
                  style={[styles.statsItem, { backgroundColor: "#C57CFF" }]}
                >
                  <Text
                    style={[styles.statsText, { color: "#FFF", opacity: 1 }]}
                  >
                    Moves: <Text>{moves}</Text>
                  </Text>
                </View>
                <View
                  style={[styles.statsItem, { backgroundColor: "#C57CFF" }]}
                >
                  <Text
                    style={[styles.statsText, { color: "#FFF", opacity: 1 }]}
                  >
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

            {/* Конфетти — поверх всего, не блокируют тапы */}
            <View pointerEvents="none" style={StyleSheet.absoluteFill}>
              <Confetti isActive={showConfetti} level={level} />
            </View>

            {/* Поздравление — не блокирует тапы по кнопке */}
            {showCongrats && (
              <View
                style={[styles.congratsContainer, { zIndex: 3500 }]}
                pointerEvents="none"
              >
                <Animated.View
                  style={[styles.congratsGlow, congratsAnimatedStyle]}
                >
                  <Image
                    source={require("../assets/Frame_Type3_03_Decor.png")}
                    style={{
                      width: 221,
                      height: 221,
                      resizeMode: "contain",
                      opacity: 1,
                      zIndex: 2,
                    }}
                    onError={(error: unknown) =>
                      console.error(
                        "Error loading Frame_Type3_03_Decor.png:",
                        error
                      )
                    }
                  />
                </Animated.View>
                <Image
                  source={require("../assets/TitlFon.png")}
                  style={[styles.congratsFon, { opacity: 1 }]}
                  onError={(error: unknown) =>
                    console.error("Error loading TitlFon.png:", error)
                  }
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

            {/* Кнопка — ниже баннера, кликабельна */}
            {showPlayAgain && (
              <AnimatedTouchableOpacity
                style={[
                  styles.playAgainButton,
                  playAgainAnimatedStyle,
                  {
                    top: playAgainTop, // позиционируем ниже поздравления
                    bottom: undefined, // перекрываем bottom из стилей
                    zIndex: 5000,
                    elevation: 50,
                    pointerEvents: "auto",
                    position: "absolute",
                    alignSelf: "center",
                  },
                ]}
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
              </AnimatedTouchableOpacity>
            )}

            <View style={{ position: "relative", zIndex: 3000 }}>
              <CustomAlert
                visible={showUpgradePrompt}
                onClose={() => setShowUpgradePrompt(false)}
                title={
                  <Text
                    style={{ fontSize: 20, fontWeight: "bold", color: "#FFF" }}
                  >
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
                  const nextLevel = level === 4 ? 6 : level === 6 ? 8 : 10;
                  navigation.replace("GameScreen", { level: nextLevel });
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
      </View>
    </BackgroundWrapper>
  );
};

export default GameScreen;
