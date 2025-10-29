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
  Keyboard,
  GestureResponderEvent,
  Platform,
  Animated as RNAnimated,
  Easing as RNEasing,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { Audio } from "expo-av";
import { Asset } from "expo-asset";

import Confetti from "../components/Confetti";
import CustomAlert from "../components/CustomAlert";
import MemoryCard from "../components/Card";
import { Card } from "../types";
import { isWeb } from "../utils/config";
import globalStyles from "../styles/global-styles";
import styles from "./GameScreen.styles";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

import { usePropConfig } from "../contexts/PropConfigContext";
import { useSound } from "../contexts/SoundContext";
import { ROBOT_SPRITES, ROBOT_VOICES } from "../../assets/hero";

const { height } = Dimensions.get("window");
const baseHeight = 375;
const scale = height / baseHeight;
const scaled = (size: number) => Math.round(size * scale);

const ENABLE_BACKGROUND_MUSIC = false;
const FANFARE = require("../../assets/sounds/success-fanfare-trumpets.mp3");

const HERO_FALLBACK = require("../../assets/hero/hero.webp");
const SAFE_SPRITES = (ROBOT_SPRITES ?? []).map(
  (m: any, i: number) =>
    m || (console.warn("[robots] missing sprite", i + 1), HERO_FALLBACK)
);
const SAFE_VOICES = (ROBOT_VOICES ?? []).filter(Boolean) as any[];

type LocaleTag =
  | "en-US"
  | "de-DE"
  | "es-ES"
  | "es-419"
  | "fr-FR"
  | "it-IT"
  | "pt-BR"
  | "pl-PL";
type TKey =
  | "time"
  | "moves"
  | "stars"
  | "congrats"
  | "playAgain"
  | "match"
  | "upgradePrompt";

const STRINGS: Record<LocaleTag, Record<TKey, string>> = {
  "en-US": {
    time: "Time",
    moves: "Moves",
    stars: "Stars",
    congrats: "Congratulations!",
    playAgain: "Play Game Again",
    match: "Match!",
    upgradePrompt: "Upgrade to a harder level?",
  },
  "de-DE": {
    time: "Zeit",
    moves: "Züge",
    stars: "Sterne",
    congrats: "Glückwunsch!",
    playAgain: "Nochmals spielen",
    match: "Treffer!",
    upgradePrompt: "Auf einen schwierigeren Level wechseln?",
  },
  "es-ES": {
    time: "Tiempo",
    moves: "Movimientos",
    stars: "Estrellas",
    congrats: "¡Felicidades!",
    playAgain: "Jugar de nuevo",
    match: "¡Coincidencia!",
    upgradePrompt: "¿Subir a un nivel más difícil?",
  },
  "es-419": {
    time: "Tiempo",
    moves: "Movimientos",
    stars: "Estrellas",
    congrats: "¡Felicidades!",
    playAgain: "Jugar otra vez",
    match: "¡Acierto!",
    upgradePrompt: "¿Pasar a un nivel más difícil?",
  },
  "fr-FR": {
    time: "Temps",
    moves: "Coups",
    stars: "Étoiles",
    congrats: "Félicitations !",
    playAgain: "Rejouer",
    match: "Paire !",
    upgradePrompt: "Passer à un niveau plus difficile ?",
  },
  "it-IT": {
    time: "Tempo",
    moves: "Mosse",
    stars: "Stelle",
    congrats: "Congratulazioni!",
    playAgain: "Gioca di nuovo",
    match: "Coppia!",
    upgradePrompt: "Passare a un livello più difficile?",
  },
  "pt-BR": {
    time: "Tempo",
    moves: "Movimentos",
    stars: "Estrelas",
    congrats: "Parabéns!",
    playAgain: "Jogar novamente",
    match: "Acerto!",
    upgradePrompt: "Subir para um nível mais difícil?",
  },
  "pl-PL": {
    time: "Czas",
    moves: "Ruchy",
    stars: "Gwiazdy",
    congrats: "Gratulacje!",
    playAgain: "Zagraj ponownie",
    match: "Para!",
    upgradePrompt: "Przejść na trudniejszy poziom?",
  },
};

const normalizeLocale = (raw?: string): LocaleTag => {
  const s = (raw || "").toLowerCase().replace("_", "-");
  if (s.startsWith("de")) return "de-DE";
  if (s === "es-419") return "es-419";
  if (s.startsWith("es")) return "es-ES";
  if (s.startsWith("fr")) return "fr-FR";
  if (s.startsWith("it")) return "it-IT";
  if (s === "pt-br" || s === "ptbr" || s.startsWith("pt")) return "pt-BR";
  if (s.startsWith("pl")) return "pl-PL";
  return "en-US";
};

const asArray = (val?: string | string[]): string[] | undefined =>
  !val ? undefined : Array.isArray(val) ? val : [val];
const pickRandom = <T,>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
const shuffle = <T,>(arr: T[]): T[] => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const toGridLevel = (age: number): 4 | 6 | 8 | 10 | 12 => {
  const even = age - (age % 2);
  const clamped = Math.min(12, Math.max(4, even));
  return (
    clamped === 4 || clamped === 6 || clamped === 8 || clamped === 10
      ? clamped
      : 12
  ) as 4 | 6 | 8 | 10 | 12;
};

type IntervalId = ReturnType<typeof setInterval>;
type TimeoutId = ReturnType<typeof setTimeout>;

const PlayIcon = () => (
  <Image
    source={require("../../assets/playAgain.png")}
    style={styles.playIcon}
  />
);

const getSrc = (c?: Card): string | undefined => {
  const anyCard = c as unknown as { __source?: { uri?: string } | string };
  if (!anyCard || !anyCard.__source) return undefined;
  return typeof anyCard.__source === "string"
    ? anyCard.__source
    : anyCard.__source.uri;
};

const ARC_BOTTOM_PAD = scaled(48);
const ELLIPSE_TOP = scaled(50) + 30;

const GameScreen = () => {
  const { playBackgroundMusic, resumeBackgroundMusic, playNotificationSound } =
    useSound();

  const unlockedRef = useRef(false);

  const cfg = usePropConfig();
  if (!cfg) {
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { justifyContent: "center", alignItems: "center", padding: 24 },
        ]}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Missing configuration. Pass props into "MagicMemory" component.
        </Text>
      </View>
    );
  }

  const locale = normalizeLocale((cfg as any).lang);
  const t = (key: TKey) => (STRINGS[locale] || STRINGS["en-US"])[key];

  const [age, setAge] = useState<number>(Math.max(2, (cfg as any).age));
  const gridLevel = useMemo(() => toGridLevel(age), [age]);
  const pairsNeeded = useMemo(() => Math.floor(age / 2), [age]);

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [time, setTime] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [roundsCompleted, setRoundsCompleted] = useState<number>(0);
  const [totalStars, setTotalStars] = useState<number>(0);
  const [isShowingCards, setIsShowingCards] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const timer = useRef<IntervalId | null>(null);
  const completionTimers = useRef<TimeoutId[]>([]);

  const [hintActive, setHintActive] = useState<number[]>([]);
  const [smileVisible, setSmileVisible] = useState<number | null>(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [showPlayAgain, setShowPlayAgain] = useState(false);
  const [isGameActive, setIsGameActive] = useState(true);

  const [activeRobotIndex, setActiveRobotIndex] = useState<number>(0);
  const robotsOrderRef = useRef<number[]>([]);
  const robotVoiceUrisRef = useRef<(string | null)[]>(
    new Array(6).fill(null) as (string | null)[]
  );

  // screen size
  const [screen, setScreen] = useState(Dimensions.get("window"));
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setScreen(window);
    });
    return () => sub?.remove?.();
  }, []);
  const { height } = screen;

  const [redealTick, setRedealTick] = useState(0);

  const arcTransY = useRef(
    new RNAnimated.Value(Dimensions.get("window").height + ARC_BOTTOM_PAD)
  ).current;
  const arcOpacity = useRef(new RNAnimated.Value(0)).current;

  const arcFromBottomRef = useRef(true);
  const arcSlowRef = useRef(true);

  const gridOpacityRN = useRef(new RNAnimated.Value(0)).current;
  const revealGridSmoothly = () => {
    RNAnimated.timing(gridOpacityRN, {
      toValue: 1,
      duration: 260,
      easing: RNEasing.out(RNEasing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const hintScaleRN = useRef(new RNAnimated.Value(1)).current;

  const arcIn = () => {
    const H = Dimensions.get("window").height;
    arcTransY.setValue(H);
    arcOpacity.setValue(0);
    RNAnimated.parallel([
      RNAnimated.timing(arcTransY, {
        toValue: 0,
        duration: 1500,
        easing: RNEasing.out(RNEasing.quad),
        useNativeDriver: true,
      }),
      RNAnimated.timing(arcOpacity, {
        toValue: 1,
        duration: 1000,
        easing: RNEasing.out(RNEasing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const arcOut = (onDone?: () => void) => {
    RNAnimated.parallel([
      RNAnimated.timing(arcTransY, {
        toValue: height + ARC_BOTTOM_PAD,
        duration: 600,
        easing: RNEasing.in(RNEasing.cubic),
        useNativeDriver: true,
      }),
      RNAnimated.timing(arcOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => onDone?.());
  };

  const playAgainScale = useSharedValue(1);
  const playAgainOpacity = useSharedValue(1);
  const playAgainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(playAgainScale.value, { duration: 225 }) }],
    opacity: playAgainOpacity.value,
  }));
  const congratsPulse = useSharedValue(1.05);
  const congratsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(congratsPulse.value, { duration: 2000 }) }],
    opacity: 1,
  }));

  const successPlayedRef = useRef(false);
  const fanfareRef = useRef<Audio.Sound | null>(null);
  const fanfareLoadedRef = useRef(false);

  const PLAY_AGAIN_OFFSET = 110;
  const PLAY_AGAIN_CAP = 0.78;
  const playAgainTop = Math.min(
    height * PLAY_AGAIN_CAP,
    height * 0.6 + PLAY_AGAIN_OFFSET
  );

  const selectedBackground = useMemo(() => {
    const candidates = asArray((cfg as any).background);
    const uri =
      candidates && candidates.length > 0 ? pickRandom(candidates) : undefined;
    return uri ? { source: { uri } } : null;
  }, [(cfg as any).background, gridLevel, age]);

  const selectedBack = useMemo(() => {
    const candidates = asArray((cfg as any).backCardSide);
    const uri =
      candidates && candidates.length > 0 ? pickRandom(candidates) : undefined;
    return uri ? { uri } : null;
  }, [(cfg as any).backCardSide, gridLevel, age]);

  const externalFrontList: string[] = useMemo(
    () =>
      Array.isArray((cfg as any).frontCardSide)
        ? (cfg as any).frontCardSide
        : [],
    [(cfg as any).frontCardSide, gridLevel, age]
  );

  useEffect(() => {
    const hideBars = async () => {
      try {
        StatusBar.setHidden(true, "none");
        if (Platform.OS === "android") {
          await NavigationBar.setVisibilityAsync("hidden");
          await NavigationBar.setBehaviorAsync("overlay-swipe");
        }
      } catch {}
    };
    hideBars();
    const subShow = Keyboard.addListener("keyboardDidShow", hideBars);
    const subHide = Keyboard.addListener("keyboardDidHide", hideBars);
    return () => {
      subShow.remove();
      subHide.remove();
      StatusBar.setHidden(false, "none");
      if (Platform.OS === "android") {
        NavigationBar.setVisibilityAsync("visible").catch(() => {});
      }
    };
  }, []);

  useEffect(() => {
    if (!isWeb) {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      ).catch(() => {});
    }
    (async () => {
      try {
        const assets = await Promise.all(
          SAFE_VOICES.map(async (mod) => {
            const a = Asset.fromModule(mod);
            await a.downloadAsync();
            return a.localUri ?? a.uri ?? null;
          })
        );
        robotVoiceUrisRef.current = assets;
        while (robotVoiceUrisRef.current.length < 6)
          robotVoiceUrisRef.current.push(null);
      } catch {
        robotVoiceUrisRef.current = new Array(6).fill(null) as (
          | string
          | null
        )[];
      }
    })();
    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        const a = Asset.fromModule(FANFARE);
        await a.downloadAsync();
        const { sound } = await Audio.Sound.createAsync(
          { uri: a.localUri ?? a.uri },
          { shouldPlay: false }
        );
        await sound.setVolumeAsync(1.0);
        fanfareRef.current = sound;
        fanfareLoadedRef.current = true;
      } catch {
        fanfareLoadedRef.current = false;
      }
    })();
    if (ENABLE_BACKGROUND_MUSIC) playBackgroundMusic().catch(() => {});
    return () => {
      completionTimers.current.forEach(clearTimeout);
      completionTimers.current = [];
      fanfareRef.current?.unloadAsync().catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    if (gridLevel >= 8) {
      if (ENABLE_BACKGROUND_MUSIC) {
        playBackgroundMusic().catch(() => {});
      }
      timer.current = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
  }, [gridLevel, playBackgroundMusic]);

  const playFanfareLocal = async () => {
    try {
      if (!fanfareLoadedRef.current || !fanfareRef.current) {
        const a = Asset.fromModule(FANFARE);
        await a.downloadAsync();
        const { sound } = await Audio.Sound.createAsync(
          { uri: a.localUri ?? a.uri },
          { shouldPlay: false }
        );
        await sound.setVolumeAsync(1.0);
        fanfareRef.current = sound;
        fanfareLoadedRef.current = true;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      await fanfareRef.current!.setPositionAsync(0);
      await fanfareRef.current!.setVolumeAsync(1.0);
      await fanfareRef.current!.replayAsync();
    } catch {}
  };

  useEffect(() => {
    if (!(showCongrats && isGameActive)) return;
    if (successPlayedRef.current) return;
    successPlayedRef.current = true;
    (async () => {
      await playFanfareLocal();
      setTimeout(() => {
        fanfareRef.current
          ?.getStatusAsync()
          .then((s) => {
            if (!s?.isLoaded || !(s as any).isPlaying) {
              playFanfareLocal();
            }
          })
          .catch(() => {});
      }, 300);
    })();
    congratsPulse.value = withRepeat(
      withTiming(1.2, { duration: 2000 }),
      -1,
      true
    );
  }, [showCongrats, isGameActive]);

  useEffect(() => {
    generateCards();
  }, [age, redealTick]);

  const playRobotVoice = async (idx: number) => {
    try {
      const uri = robotVoiceUrisRef.current[idx] ?? null;
      if (!uri) {
        await playNotificationSound().catch(() => {});
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();
      setTimeout(() => sound.unloadAsync().catch(() => {}), 2500);
    } catch {
      playNotificationSound().catch(() => {});
    }
  };

  const fadesRef = useRef(new Map<number, RNAnimated.Value>()).current;
  const scalesRef = useRef(new Map<number, RNAnimated.Value>()).current;
  const ensureAnimFor = (id: number) => {
    if (!fadesRef.has(id)) fadesRef.set(id, new RNAnimated.Value(1));
    if (!scalesRef.has(id)) scalesRef.set(id, new RNAnimated.Value(1));
    return { fade: fadesRef.get(id)!, scale: scalesRef.get(id)! };
  };

  const lastDealAtRef = useRef(0);

  const generateCards = () => {
    const now = Date.now();
    if (now - lastDealAtRef.current < 600) {
      return;
    }
    lastDealAtRef.current = now;

    completionTimers.current.forEach((t) => clearTimeout(t));
    completionTimers.current = [];

    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }

    gridOpacityRN.setValue(0);

    const pairs = Math.floor(age / 2);
    const uniqFront = Array.from(new Set(externalFrontList));
    const backOk = !!selectedBack?.uri;
    const bgOk = !!selectedBackground?.source?.uri;
    const facesOk = uniqFront.length >= pairs;

    if (!bgOk || !backOk || !facesOk) {
      setCards([]);
      return;
    }

    setTime(0);
    setMoves(0);
    setMatchedCards([]);
    setSelectedCards([]);
    setShowConfetti(false);
    setIsFlipping(false);
    setHintActive([]);
    setSmileVisible(null);
    setShowCongrats(false);
    setShowPlayAgain(false);
    setIsGameActive(true);
    successPlayedRef.current = false;

    arcIn();

    const availableIdx = SAFE_SPRITES.map((m, i) => (m ? i : -1)).filter(
      (i) => i >= 0
    );
    robotsOrderRef.current = shuffle(availableIdx.length ? availableIdx : [0]);

    const chosen = uniqFront
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, pairs)
      .map((u) => ({ source: { uri: u } }));
    const selectedValues = chosen.flatMap((x) => [x, x]);

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

    fadesRef.clear();
    scalesRef.clear();
    setCards(cardPairs);

    requestAnimationFrame(() => revealGridSmoothly());

    if (gridLevel === 4) {
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

    if (ENABLE_BACKGROUND_MUSIC) {
      playBackgroundMusic().catch(() => {});
    }
    if (gridLevel >= 8) {
      timer.current = setInterval(() => setTime((p) => p + 1), 1000);
    }
  };

  const getStars = (lvl: 4 | 6 | 8 | 10 | 12, t: number, m: number) => {
    if (lvl < 8) return 0;
    let maxTime = 30,
      maxMoves = 12;
    if (lvl === 10) {
      maxTime = 40;
      maxMoves = 18;
    } else if (lvl === 12) {
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

          const matchIndex = Math.floor((matchedCards.length + 2) / 2) - 1;
          const order = robotsOrderRef.current.length
            ? robotsOrderRef.current
            : [0];
          const robotIdx = order[matchIndex % order.length];
          setActiveRobotIndex(robotIdx);
          playRobotVoice(robotIdx).catch(() => {});

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

            const pairIds = [firstId, secondId];
            RNAnimated.parallel(
              pairIds.map((pid) => {
                const { fade, scale } = ensureAnimFor(pid);
                fade.stopAnimation();
                scale.stopAnimation();
                fade.setValue(1);
                scale.setValue(1);
                return RNAnimated.parallel([
                  RNAnimated.timing(fade, {
                    toValue: 0,
                    duration: 500,
                    easing: RNEasing.out(RNEasing.cubic),
                    useNativeDriver: true,
                  }),
                  RNAnimated.timing(scale, {
                    toValue: 0.92,
                    duration: 500,
                    easing: RNEasing.out(RNEasing.cubic),
                    useNativeDriver: true,
                  }),
                ]);
              })
            ).start(() => {
              setCards((prev) =>
                prev.map((card) =>
                  pairIds.includes(card.id) ? { ...card, isHidden: true } : card
                )
              );

              setSelectedCards([]);

              if (newMatched.length === cards.length) {
                const newRounds = roundsCompleted + 1;
                setRoundsCompleted(newRounds);

                const starsEarned = getStars(gridLevel, time, moves);
                setTotalStars((prev) => prev + starsEarned);

                arcOut();

                const congratsTimer: TimeoutId = setTimeout(() => {
                  if (!isGameActive) return;
                  setShowCongrats(true);
                  setShowConfetti(true);
                }, 900);
                completionTimers.current.push(congratsTimer);

                const nextTimer: TimeoutId = setTimeout(async () => {
                  if (!isGameActive) return;

                  const started = Date.now();
                  try {
                    let playing = true;
                    while (playing && Date.now() - started < 6500) {
                      const s = await fanfareRef.current?.getStatusAsync();
                      playing = !!(s as any)?.isPlaying;
                      if (playing) await new Promise((r) => setTimeout(r, 140));
                    }
                  } catch {}

                  setShowPlayAgain(false);

                  arcFromBottomRef.current = true;
                  arcSlowRef.current = true;

                  if (gridLevel === 12) {
                    lastDealAtRef.current = 0;
                    setShowCongrats(false);
                    setShowConfetti(false);
                    setIsGameActive(true);
                    setRedealTick((t) => t + 1);
                  } else {
                    setAge(age + 2);
                  }
                }, 3800);
                completionTimers.current.push(nextTimer);
              } else {
                setIsFlipping(false);
              }
            });
          }, 500);
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
        }, 650);
        completionTimers.current.push(flipBackTimer);
      }
    } else {
      const unlockTimer: TimeoutId = setTimeout(
        () => setIsFlipping(false),
        120
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
          (c) => c.id !== selected!.id && getSrc(c) === key
        );
        if (match) {
          setHintActive([unmatched.find((c) => c.id === match.id)!.id]);
          const tmo: TimeoutId = setTimeout(() => setHintActive([]), 2000);
          completionTimers.current.push(tmo);
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
          const tmo: TimeoutId = setTimeout(() => setHintActive([]), 2000);
          completionTimers.current.push(tmo);
          return;
        }
      }
    }
  };

  const getNumColumns = () =>
    gridLevel === 4
      ? 2
      : gridLevel === 6
        ? 3
        : gridLevel === 8
          ? 4
          : gridLevel === 10
            ? 5
            : 6;
  const getCardSize = () => (gridLevel <= 6 ? 120 : 100);

  const renderItem = ({ item }: { item: Card }) => {
    const cardSize = getCardSize();
    const faceSource = (item as any).__source as any;
    const { fade, scale } = ensureAnimFor(item.id);

    return (
      <RNAnimated.View
        style={{
          position: "relative",
          marginHorizontal: 5,
          justifyContent: "center",
          alignItems: "center",
          width: cardSize,
          height: cardSize,
          zIndex: 0,
          opacity: fade,
          transform: [{ scale }],
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
            backImage={selectedBack!}
            frontImage={faceSource}
          />
        )}

        {smileVisible === item.id &&
          (() => {
            const size = Math.round(getCardSize() * 0.34);
            const left = (getCardSize() - size) / 2;
            const top = -size - 18;
            return (
              <View
                style={{
                  position: "absolute",
                  left,
                  top,
                  width: size,
                  height: size,
                  zIndex: 9999,
                  elevation: 50,
                }}
                pointerEvents="none"
                collapsable={false}
                renderToHardwareTextureAndroid
                needsOffscreenAlphaCompositing
              >
                <ExpoImage
                  source={SAFE_SPRITES[activeRobotIndex] || HERO_FALLBACK}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="contain"
                />
              </View>
            );
          })()}
      </RNAnimated.View>
    );
  };

  const onFirstTouch = (_e: GestureResponderEvent) => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    if (ENABLE_BACKGROUND_MUSIC) {
      resumeBackgroundMusic().catch(() => {});
    }
  };

  const handlePlayAgain = () => {
    setShowConfetti(false);
    setShowCongrats(false);
    setShowPlayAgain(false);
    arcFromBottomRef.current = true;
    arcSlowRef.current = true;
    lastDealAtRef.current = 0;
    setRedealTick((t) => t + 1);
  };

  const cfgOk =
    selectedBackground &&
    selectedBack &&
    externalFrontList.length >= pairsNeeded;

  if (!cfgOk) {
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
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

  const { height: H } = screen;
  const hintTop = Math.max(scaled(34), Math.round(H / 2 - scaled(20)));

  return (
    <View
      style={{ flex: 1, width: "100%", height: "100%" }}
      onStartShouldSetResponder={() => true}
      onResponderGrant={onFirstTouch}
    >
      <ImageBackground
        source={selectedBackground!.source}
        style={[
          StyleSheet.absoluteFillObject,
          { width: "100%", height: "100%", zIndex: 0 },
        ]}
        resizeMode="cover"
      />

      <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
        <RNAnimated.Image
          source={require("../../assets/ellipse.png")}
          resizeMode="cover"
          style={{
            position: "absolute",
            top: ELLIPSE_TOP,
            left: 0,
            right: 0,
            width: "100%",
            height: Dimensions.get("window").height,
            zIndex: 0,
            opacity: arcOpacity as any,
            transform: [{ translateY: arcTransY as any }],
          }}
        />
      </View>

      <StatusBar hidden />

      <View
        style={[
          globalStyles.containers.gameArea,
          { flex: 1, width: "100%", opacity: 1, overflow: "visible" },
        ]}
      >
        {isGameActive && !showCongrats && !showPlayAgain && (
          <RNAnimated.View
            style={{
              position: "absolute",
              right: 30,
              top: hintTop,
              zIndex: 1000,
              opacity: RNAnimated.multiply(arcOpacity as any, gridOpacityRN),
              transform: [
                { translateY: arcTransY as any },
                { scale: hintScaleRN as any },
              ],
            }}
          >
            <TouchableOpacity
              onPress={handleHint}
              activeOpacity={1}
              onPressIn={() =>
                RNAnimated.timing(hintScaleRN, {
                  toValue: 1.1,
                  duration: 100,
                  useNativeDriver: true,
                }).start()
              }
              onPressOut={() =>
                RNAnimated.timing(hintScaleRN, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: true,
                }).start()
              }
            >
              <View
                style={[styles.hintGlow, { shadowOpacity: 0, elevation: 0 }]}
              >
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
          </RNAnimated.View>
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
            <RNAnimated.View
              style={{ flex: 1, width: "100%", opacity: gridOpacityRN }}
            >
              <FlatList<Card>
                key={`flatlist-${gridLevel}-${age}-${redealTick}`}
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
                  {
                    paddingTop: scaled(62),
                    width: "100%",
                    overflow: "visible",
                  },
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
                getItemLayout={(_data, index) => {
                  const itemSize = getCardSize();
                  const cols = getNumColumns();
                  const row = Math.floor(index / cols);
                  return { length: itemSize, offset: itemSize * row, index };
                }}
              />
            </RNAnimated.View>
          </View>
        )}

        <View pointerEvents="none" style={StyleSheet.absoluteFillObject}>
          <Confetti isActive={showConfetti} level={gridLevel} />
        </View>

        {showCongrats && (
          <View
            style={[styles.congratsContainer, { zIndex: 3500 }]}
            pointerEvents="none"
          >
            <Animated.View style={[styles.congratsGlow, congratsAnimatedStyle]}>
              <Image
                source={require("../../assets/Frame_Type3_03_Decor.png")}
                style={{ width: 221, height: 221, resizeMode: "contain" }}
              />
            </Animated.View>
            <Image
              source={require("../../assets/TitlFon.png")}
              style={[styles.congratsFon]}
            />
            <Text
              style={[styles.congratsText]}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {t("congrats")}
            </Text>
          </View>
        )}

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
              onPressIn={() => {
                playAgainScale.value = 1.1;
                playAgainOpacity.value = 0.8;
              }}
              onPressOut={() => {
                playAgainScale.value = 1;
                playAgainOpacity.value = 1;
                const tmo: TimeoutId = setTimeout(() => handlePlayAgain(), 300);
                completionTimers.current.push(tmo);
              }}
              activeOpacity={1}
            >
              <View style={[styles.playAgainGradient]}>
                <View style={[styles.playAgainContent]}>
                  <Text
                    style={[styles.playAgainText]}
                    adjustsFontSizeToFit
                    numberOfLines={1}
                  >
                    {t("playAgain")}
                  </Text>
                  <PlayIcon />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ position: "relative", zIndex: 3000 }}>
          <CustomAlert
            visible={false}
            onClose={() => {}}
            title={
              <Text style={{ fontSize: 20, fontWeight: "bold", color: "#FFF" }}>
                {t("match")}
              </Text>
            }
            message={
              <Text style={{ fontSize: 16, color: "#FFF" }}>
                {t("upgradePrompt")}
              </Text>
            }
            onYes={() => {}}
            onNo={() => {}}
          />
        </View>
      </View>
    </View>
  );
};

export default GameScreen;
