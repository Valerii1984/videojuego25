"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const expo_image_1 = require("expo-image");
const expo_linear_gradient_1 = require("expo-linear-gradient");
const native_1 = require("@react-navigation/native");
const LanguageContext_1 = require("../contexts/LanguageContext");
const SoundContext_1 = require("../contexts/SoundContext");
const ScreenOrientation = __importStar(require("expo-screen-orientation"));
const expo_av_1 = require("expo-av");
const expo_asset_1 = require("expo-asset");
const Confetti_1 = __importDefault(require("../components/Confetti"));
const CustomAlert_1 = __importDefault(require("../components/CustomAlert"));
const Card_1 = __importDefault(require("../components/Card"));
const config_1 = require("../utils/config");
const global_styles_1 = __importDefault(require("../styles/global-styles"));
const GameScreen_styles_1 = __importDefault(require("./GameScreen.styles"));
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
const PropConfigContext_1 = require("../contexts/PropConfigContext");
// ───────────────────────── helpers ─────────────────────────
const asArray = (val) => {
    if (!val)
        return undefined;
    return Array.isArray(val) ? val : [val];
};
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};
// Нормалізуємо age у "бакет" для сітки/розмірів (4,6,8,10,12)
const toGridLevel = (age) => {
    const even = age - (age % 2);
    const clamped = Math.min(12, Math.max(4, even));
    return (clamped === 4 || clamped === 6 || clamped === 8 || clamped === 10
        ? clamped
        : 12);
};
// Иконка PlayAgain (не используем в авто-прогрессе, но пусть будет)
const PlayIcon = () => ((0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../../assets/playAgain.png"), style: GameScreen_styles_1.default.playIcon }));
// ---- РОБОТЫ (анимация + голос) ----
const ROBOT_SPRITES = [
    require("../../assets/hero/hero1/anim.webp"),
    require("../../assets/hero/hero2/anim.webp"),
    require("../../assets/hero/hero3/anim.webp"),
    require("../../assets/hero/hero4/anim.webp"),
    require("../../assets/hero/hero5/anim.webp"),
    require("../../assets/hero/hero6/anim.webp"),
];
const ROBOT_VOICES = [
    require("../../assets/hero/hero1/hero.m4a"),
    require("../../assets/hero/hero2/hero.m4a"),
    require("../../assets/hero/hero3/hero.m4a"),
    require("../../assets/hero/hero4/hero.m4a"),
    require("../../assets/hero/hero5/hero.m4a"),
    require("../../assets/hero/hero6/hero.m4a"),
];
// Витягнути джерело лицьової картинки з локального поля
const getSrc = (c) => {
    const anyCard = c;
    if (!anyCard || !anyCard.__source)
        return undefined;
    return typeof anyCard.__source === "string"
        ? anyCard.__source
        : anyCard.__source.uri;
};
const GameScreen = () => {
    const { language } = (0, LanguageContext_1.useLanguage)();
    const { playNotificationSound, playSuccessSound, playBackgroundMusic, stopSuccessSound,
    // pauseBackgroundMusic, // не используем, музыку не останавливаем
    // resumeBackgroundMusic,
     } = (0, SoundContext_1.useSound)();
    const navigation = (0, native_1.useNavigation)();
    const route = (0, native_1.useRoute)();
    const cfg = (0, PropConfigContext_1.usePropConfig)();
    if (!cfg) {
        return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: [
                react_native_1.StyleSheet.absoluteFill,
                { justifyContent: "center", alignItems: "center", padding: 24 },
            ], children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: { color: "#fff", textAlign: "center" }, children: "Missing configuration. Pass props into \"MagicMemory\" component." }) }));
    }
    const incomingAge = route.params?.age;
    const age = (0, react_1.useMemo)(() => Math.max(2, incomingAge ?? cfg.age), [incomingAge, cfg.age]);
    const gridLevel = (0, react_1.useMemo)(() => toGridLevel(age), [age]); // 4|6|8|10|12
    const pairsNeeded = (0, react_1.useMemo)(() => Math.floor(age / 2), [age]);
    const [cards, setCards] = (0, react_1.useState)([]);
    const [selectedCards, setSelectedCards] = (0, react_1.useState)([]);
    const [time, setTime] = (0, react_1.useState)(0);
    const [moves, setMoves] = (0, react_1.useState)(0);
    const [matchedCards, setMatchedCards] = (0, react_1.useState)([]);
    const [showConfetti, setShowConfetti] = (0, react_1.useState)(false);
    const [showUpgradePrompt, setShowUpgradePrompt] = (0, react_1.useState)(false);
    const [roundsCompleted, setRoundsCompleted] = (0, react_1.useState)(0);
    const [totalStars, setTotalStars] = (0, react_1.useState)(0);
    const [isShowingCards, setIsShowingCards] = (0, react_1.useState)(false);
    const [isFlipping, setIsFlipping] = (0, react_1.useState)(false);
    const timer = (0, react_1.useRef)(null);
    const completionTimers = (0, react_1.useRef)([]);
    const [isInitialized, setIsInitialized] = (0, react_1.useState)(false);
    const [hintActive, setHintActive] = (0, react_1.useState)([]);
    const [smileVisible, setSmileVisible] = (0, react_1.useState)(null);
    const [showCongrats, setShowCongrats] = (0, react_1.useState)(false);
    const [showPlayAgain, setShowPlayAgain] = (0, react_1.useState)(false);
    const [isGameActive, setIsGameActive] = (0, react_1.useState)(true);
    // Дуга — полностью контролируем видимость флагом
    const [arcVisible, setArcVisible] = (0, react_1.useState)(false);
    // Робот текущего совпадения + очередь роботов на раунд
    const [activeRobotIndex, setActiveRobotIndex] = (0, react_1.useState)(0);
    const robotsOrderRef = (0, react_1.useRef)([]);
    // Предзагруженные URI голосов роботов
    const robotVoiceUrisRef = (0, react_1.useRef)([
        null,
        null,
        null,
        null,
        null,
        null,
    ]);
    const { width, height } = react_native_1.Dimensions.get("window");
    const arcOffsetY = (0, react_native_reanimated_1.useSharedValue)(0);
    const arcOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const statsOffsetY = (0, react_native_reanimated_1.useSharedValue)(0);
    const statsOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const playAgainScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const playAgainOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const hintScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const congratsPulse = (0, react_native_reanimated_1.useSharedValue)(1.05);
    const PLAY_AGAIN_OFFSET = 110;
    const PLAY_AGAIN_CAP = 0.78;
    const playAgainTop = Math.min(height * PLAY_AGAIN_CAP, height * 0.6 + PLAY_AGAIN_OFFSET);
    // ───────────── фон/рубашка/лиця — только из пропсов ─────────────
    const selectedBackground = (0, react_1.useMemo)(() => {
        const candidates = asArray(cfg.background);
        const uri = candidates && candidates.length > 0 ? pickRandom(candidates) : undefined;
        return uri ? { source: { uri } } : null;
    }, [cfg.background, gridLevel, age]);
    const selectedBack = (0, react_1.useMemo)(() => {
        const candidates = asArray(cfg.backCardSide);
        const uri = candidates && candidates.length > 0 ? pickRandom(candidates) : undefined;
        return uri ? { uri } : null;
    }, [cfg.backCardSide, gridLevel, age]);
    const externalFrontList = (0, react_1.useMemo)(() => {
        return Array.isArray(cfg.frontCardSide) ? cfg.frontCardSide : [];
    }, [cfg.frontCardSide, gridLevel, age]);
    // ───────────── анімації ─────────────
    const arcAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ translateY: arcOffsetY.value }],
        opacity: arcOpacity.value,
    }));
    const statsAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ translateY: statsOffsetY.value }],
        opacity: statsOpacity.value,
    }));
    const playAgainAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: (0, react_native_reanimated_1.withTiming)(playAgainScale.value, { duration: 225 }) }],
        opacity: playAgainOpacity.value,
    }));
    const hintAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: (0, react_native_reanimated_1.withTiming)(hintScale.value, { duration: 100 }) }],
        opacity: 1,
    }));
    const congratsAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: (0, react_native_reanimated_1.withTiming)(congratsPulse.value, { duration: 2000 }) }],
        opacity: 1,
    }));
    // ───────────── жизненный цикл ─────────────
    (0, react_1.useEffect)(() => {
        if (!config_1.isWeb) {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => { });
        }
        // Предзагружаем голоса роботов (надёжное воспроизведение на Android)
        (async () => {
            try {
                const assets = await Promise.all(ROBOT_VOICES.map(async (mod) => {
                    const a = expo_asset_1.Asset.fromModule(mod);
                    await a.downloadAsync();
                    return a.localUri ?? a.uri ?? null;
                }));
                robotVoiceUrisRef.current = assets;
            }
            catch {
                // если что — fallback потом на notificationSound
                robotVoiceUrisRef.current = [null, null, null, null, null, null];
            }
        })();
        if (!isInitialized) {
            generateCards();
            setIsInitialized(true);
        }
        if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
        }
        if (gridLevel >= 8) {
            playBackgroundMusic().catch(() => { });
            timer.current = setInterval(() => setTime((prev) => prev + 1), 1000);
        }
        if (showCongrats && isGameActive) {
            playSuccessSound().catch(() => { });
            congratsPulse.value = (0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withTiming)(1.2, { duration: 2000 }), -1, true);
        }
        return () => {
            if (timer.current)
                clearInterval(timer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridLevel, isInitialized, showCongrats, isGameActive]);
    // ───────────── проиграть голос робота (через предзагруженный URI) ─────────────
    const playRobotVoice = async (idx) => {
        try {
            const uri = robotVoiceUrisRef.current[idx];
            if (!uri)
                throw new Error("no-uri");
            // гарантируем режим (миксуется с фоном)
            await expo_av_1.Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: false,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });
            const { sound } = await expo_av_1.Audio.Sound.createAsync({ uri });
            await sound.setVolumeAsync(1.0);
            await sound.playAsync();
            setTimeout(() => sound.unloadAsync().catch(() => { }), 2500);
        }
        catch {
            // запасной вариант
            playNotificationSound().catch(() => { });
        }
    };
    // ───────────── генерация колоды ─────────────
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
        // Скидываем статистику
        statsOffsetY.value = -100;
        statsOpacity.value = 0;
        // Очерёдность роботов без повторов (если пар больше 6 — зациклим)
        const base = [0, 1, 2, 3, 4, 5];
        robotsOrderRef.current = shuffle(base);
        // Выбор лиц и разворот в пары
        const chosen = uniqFront
            .slice()
            .sort(() => Math.random() - 0.5)
            .slice(0, pairs)
            .map((u) => ({ source: { uri: u } }));
        const selectedValues = chosen.flatMap((x) => [x, x]);
        // Карточки
        const cardPairs = selectedValues
            .map((val, index) => ({
            id: index,
            value: "cardFace-1",
            isFlipped: false,
            isMatched: false,
            isHidden: false,
            ...{ __source: val.source },
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
        // Показ дуги (вход) — без лишних тёмных оверлеев
        // ПЕРЕДВИНУЛИ setArcVisible В КОНЕЦ АНИМАЦИИ
        arcOffsetY.value = height;
        arcOpacity.value = 0;
        arcOffsetY.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 500 });
        arcOpacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 500 }, (finished) => {
            if (finished)
                (0, react_native_reanimated_1.runOnJS)(setArcVisible)(true); // Включаем дугу только ПОСЛЕ анимации
        });
        statsOffsetY.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 500 });
        statsOpacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 500 });
        // Автопоказ для 2x2
        if (gridLevel === 4) {
            setIsShowingCards(true);
            const showTimer = setTimeout(() => {
                const updated = cardPairs.map((c) => ({ ...c, isFlipped: true }));
                setCards(updated);
                const hideTimer = setTimeout(() => {
                    const closed = cardPairs.map((c) => ({ ...c, isFlipped: false }));
                    setCards(closed);
                    setIsShowingCards(false);
                }, 3000);
                completionTimers.current.push(hideTimer);
            }, 1000);
            completionTimers.current.push(showTimer);
        }
        if (gridLevel >= 8) {
            playBackgroundMusic().catch(() => { });
            timer.current = setInterval(() => setTime((prev) => prev + 1), 1000);
        }
    };
    // Звёзды — по бакету
    const getStars = (lvlBucket, t, m) => {
        if (lvlBucket < 8)
            return 0;
        let maxTime = 30;
        let maxMoves = 12;
        if (lvlBucket === 10) {
            maxTime = 40;
            maxMoves = 18;
        }
        else if (lvlBucket === 12) {
            maxTime = 50;
            maxMoves = 24;
        }
        if (t <= maxTime && m <= maxMoves)
            return 3;
        if (t <= maxTime * 1.2 && m <= maxMoves * 1.2)
            return 2;
        return 1;
    };
    const handleCardPress = (id) => {
        if (isShowingCards ||
            selectedCards.length >= 2 ||
            selectedCards.includes(id) ||
            isFlipping ||
            !isGameActive) {
            return;
        }
        setIsFlipping(true);
        const newSelected = [...selectedCards, id];
        setSelectedCards(newSelected);
        setCards((prev) => prev.map((c) => (c.id === id ? { ...c, isFlipped: true } : c)));
        if (gridLevel >= 8)
            setMoves((prev) => prev + 1);
        if (newSelected.length === 2) {
            const [firstId, secondId] = newSelected;
            const first = cards.find((c) => c.id === firstId);
            const second = cards.find((c) => c.id === secondId);
            const same = getSrc(first) && getSrc(first) === getSrc(second);
            if (same) {
                const matchDelay = setTimeout(() => {
                    if (!isGameActive)
                        return;
                    // Выбор робота по порядку совпадений
                    const matchIndex = Math.floor((matchedCards.length + 2) / 2) - 1; // 0-based
                    const order = robotsOrderRef.current.length
                        ? robotsOrderRef.current
                        : [0, 1, 2, 3, 4, 5];
                    const robotIdx = order[matchIndex % order.length];
                    setActiveRobotIndex(robotIdx);
                    // Голос робота (не останавливая фон)
                    playRobotVoice(robotIdx).catch(() => { });
                    const newMatched = [...matchedCards, firstId, secondId];
                    setMatchedCards(newMatched);
                    setCards((prev) => prev.map((card) => newMatched.includes(card.id)
                        ? { ...card, isMatched: true, isFlipped: true }
                        : card));
                    setSmileVisible(secondId);
                    const smileTimer = setTimeout(() => {
                        if (!isGameActive)
                            return;
                        setSmileVisible(null);
                        setCards((prev) => prev.map((card) => newMatched.includes(card.id)
                            ? { ...card, isHidden: true }
                            : card));
                        setSelectedCards([]);
                        if (newMatched.length === cards.length) {
                            const newRounds = roundsCompleted + 1;
                            setRoundsCompleted(newRounds);
                            const starsEarned = getStars(gridLevel, time, moves);
                            setTotalStars((prev) => prev + starsEarned);
                            // Уводим дугу вниз и полностью скрываем до следующего уровня (без вспышек)
                            // УБРАЛИ setTimeout — достаточно анимации
                            arcOffsetY.value = (0, react_native_reanimated_1.withTiming)(height, { duration: 700 }, (finished) => finished && (0, react_native_reanimated_1.runOnJS)(setArcVisible)(false));
                            arcOpacity.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 700 });
                            statsOffsetY.value = (0, react_native_reanimated_1.withTiming)(height, { duration: 700 });
                            statsOpacity.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 700 });
                            // Убрали: setTimeout(() => setArcVisible(false), 750);
                            const congratsTimer = setTimeout(() => {
                                if (!isGameActive)
                                    return;
                                setShowCongrats(true);
                                setShowConfetti(true);
                            }, 900);
                            completionTimers.current.push(congratsTimer);
                            // Переход на следующий уровень
                            const nextTimer = setTimeout(() => {
                                if (!isGameActive)
                                    return;
                                setShowPlayAgain(false);
                                const nextAge = age + 2;
                                const goTimer = setTimeout(() => {
                                    navigation.replace("MagicMemoryGameScreen", { age: nextAge });
                                }, 400);
                                completionTimers.current.push(goTimer);
                            }, 2100);
                            completionTimers.current.push(nextTimer);
                        }
                        else {
                            setIsFlipping(false);
                        }
                    }, 2000);
                    completionTimers.current.push(smileTimer);
                }, 500);
                completionTimers.current.push(matchDelay);
            }
            else {
                const flipBackTimer = setTimeout(() => {
                    if (!isGameActive)
                        return;
                    setCards((prev) => prev.map((card) => newSelected.includes(card.id)
                        ? { ...card, isFlipped: false }
                        : card));
                    setSelectedCards([]);
                    setIsFlipping(false);
                }, 500);
                completionTimers.current.push(flipBackTimer);
            }
        }
        else {
            const unlockTimer = setTimeout(() => setIsFlipping(false), 500);
            completionTimers.current.push(unlockTimer);
        }
    };
    const handleHint = () => {
        const unmatched = cards.filter((c) => !matchedCards.includes(c.id));
        if (selectedCards.length === 1) {
            const selected = cards.find((c) => c.id === selectedCards[0]);
            if (selected) {
                const key = getSrc(selected);
                const match = unmatched.find((c) => c.id !== selected.id && getSrc(c) === key);
                if (match) {
                    setHintActive([match.id]);
                    const t = setTimeout(() => setHintActive([]), 2000);
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
                    const t = setTimeout(() => setHintActive([]), 2000);
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
    const renderItem = ({ item }) => {
        const cardSize = getCardSize();
        const faceSource = item.__source;
        return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: {
                position: "relative",
                marginHorizontal: 5,
                justifyContent: "center",
                alignItems: "center",
                width: cardSize,
                height: cardSize,
                opacity: 1,
                overflow: "visible",
                zIndex: 0,
            }, collapsable: false, children: [item.isMatched && !item.isHidden && ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
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
                    }, pointerEvents: "none" })), !item.isHidden && ((0, jsx_runtime_1.jsx)(Card_1.default, { item: item, onPress: handleCardPress, getCardSize: getCardSize, disabled: isShowingCards || selectedCards.length >= 2, isHinted: hintActive.includes(item.id) || selectedCards.includes(item.id), style: { opacity: 1, zIndex: 0 }, backImage: selectedBack, frontImage: faceSource })), smileVisible === item.id &&
                    (() => {
                        const size = Math.round(getCardSize() * 0.34);
                        const left = (getCardSize() - size) / 2;
                        const top = -size - 12;
                        return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
                                position: "absolute",
                                left,
                                top,
                                width: size,
                                height: size,
                                zIndex: 9999,
                                elevation: 50,
                            }, pointerEvents: "none", collapsable: false, renderToHardwareTextureAndroid: true, needsOffscreenAlphaCompositing: true, children: (0, jsx_runtime_1.jsx)(expo_image_1.Image, { source: ROBOT_SPRITES[activeRobotIndex], style: { width: "100%", height: "100%" }, contentFit: "contain" }) }));
                    })()] }));
    };
    const handleHintPressIn = () => (hintScale.value = 1.1);
    const handleHintPressOut = () => (hintScale.value = 1);
    const handlePlayAgainPressIn = () => {
        playAgainScale.value = 1.1;
        playAgainOpacity.value = 0.8;
    };
    const handlePlayAgainPressOut = () => {
        playAgainScale.value = 1;
        playAgainOpacity.value = 1;
        const t = setTimeout(() => handlePlayAgain(), 300);
        completionTimers.current.push(t);
    };
    const handlePlayAgain = () => {
        setShowConfetti(false);
        setShowCongrats(false);
        setShowPlayAgain(false);
        generateCards();
    };
    // Валідація пропсів
    const cfgOk = selectedBackground &&
        selectedBack &&
        externalFrontList.length >= pairsNeeded;
    if (!cfgOk) {
        return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [
                react_native_1.StyleSheet.absoluteFill,
                { padding: 24, justifyContent: "center" },
            ], children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: { color: "#fff", fontSize: 16, marginBottom: 8 }, children: "Invalid props. Expected:" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: { color: "#ccc", marginBottom: 4 }, children: "\u2022 background: at least one image URL" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: { color: "#ccc", marginBottom: 4 }, children: "\u2022 backCardSide: at least one image URL" }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: { color: "#ccc" }, children: ["\u2022 frontCardSide: at least ", pairsNeeded, " unique image URLs"] })] }));
    }
    const { width: W, height: H } = react_native_1.Dimensions.get("window");
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: { flex: 1, width: "100%", height: "100%" }, children: [(0, jsx_runtime_1.jsx)(react_native_1.ImageBackground, { source: selectedBackground.source, style: [
                    react_native_1.StyleSheet.absoluteFillObject,
                    { width: "100%", height: "100%", zIndex: 0 },
                ], resizeMode: "cover" }), arcVisible && ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [arcAnimatedStyle, { zIndex: 30 }], children: (0, jsx_runtime_1.jsxs)(react_native_svg_1.default, { height: H, width: "100%", style: { position: "absolute", top: 0, left: 0, zIndex: 5 }, viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none", children: [(0, jsx_runtime_1.jsxs)(react_native_svg_1.Defs, { children: [(0, jsx_runtime_1.jsxs)(react_native_svg_1.LinearGradient, { id: "arcGrad", x1: "0", y1: "0", x2: "0", y2: "1", gradientUnits: "objectBoundingBox", children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0", stopColor: "#020743", stopOpacity: "0.55" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "1", stopColor: "#080001", stopOpacity: "0.75" })] }), (0, jsx_runtime_1.jsxs)(react_native_svg_1.LinearGradient, { id: "arcBorderGrad", x1: "0", y1: "0.5", x2: "1", y2: "0.5", gradientUnits: "objectBoundingBox", children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0", stopColor: "#C57CFF", stopOpacity: "0" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0.3", stopColor: "#C57CFF", stopOpacity: "1" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0.7", stopColor: "#C57CFF", stopOpacity: "1" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "1", stopColor: "#C57CFF", stopOpacity: "0" })] })] }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: `M0 ${H} L0 100 Q${W / 2} 60 ${W} 100 L${W} ${H} Z`, fill: "url(#arcGrad)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: `M0 100 Q${W / 2} 60 ${W} 100`, fill: "none", stroke: "url(#arcBorderGrad)", strokeWidth: 4, strokeLinecap: "round" })] }) })), (0, jsx_runtime_1.jsx)(react_native_1.StatusBar, { hidden: true }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [
                    global_styles_1.default.containers.gameArea,
                    { flex: 1, width: "100%", opacity: 1, overflow: "visible" },
                ], children: [!showPlayAgain && ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [GameScreen_styles_1.default.hintButton, hintAnimatedStyle], children: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleHint, onPressIn: handleHintPressIn, onPressOut: handleHintPressOut, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: GameScreen_styles_1.default.hintGlow, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: GameScreen_styles_1.default.hintBorder, children: (0, jsx_runtime_1.jsx)(expo_linear_gradient_1.LinearGradient, { colors: ["#FFB380", "#D16C00"], style: GameScreen_styles_1.default.hintButtonInner, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: GameScreen_styles_1.default.hintText, children: "?" }) }) }) }) }) })), gridLevel >= 8 && ((0, jsx_runtime_1.jsxs)(react_native_reanimated_1.default.View, { style: [
                            GameScreen_styles_1.default.statsPanel,
                            statsAnimatedStyle,
                            { zIndex: 20, opacity: 1 },
                        ], children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { style: [
                                    GameScreen_styles_1.default.statsItem,
                                    {
                                        backgroundColor: "#C57CFF",
                                        width: "auto",
                                        minWidth: 100,
                                        flexShrink: 0,
                                        flexGrow: 0,
                                        alignItems: "center",
                                    },
                                ], children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: [GameScreen_styles_1.default.statsText, { color: "#FFF", opacity: 1 }], children: ["Time: ", (0, jsx_runtime_1.jsxs)(react_native_1.Text, { children: [time, "s"] })] }) }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: [GameScreen_styles_1.default.statsItem, { backgroundColor: "#C57CFF" }], children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: [GameScreen_styles_1.default.statsText, { color: "#FFF", opacity: 1 }], children: ["Moves: ", (0, jsx_runtime_1.jsx)(react_native_1.Text, { children: moves })] }) }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: [GameScreen_styles_1.default.statsItem, { backgroundColor: "#C57CFF" }], children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: [GameScreen_styles_1.default.statsText, { color: "#FFF", opacity: 1 }], children: ["Stars: ", (0, jsx_runtime_1.jsxs)(react_native_1.Text, { children: [totalStars, "\u2605"] })] }) })] })), cards.length > 0 && ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
                            flex: 1,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 100,
                            overflow: "visible",
                        }, children: (0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: cards, renderItem: renderItem, keyExtractor: (item) => item.id.toString(), numColumns: getNumColumns(), columnWrapperStyle: [
                                GameScreen_styles_1.default.row,
                                { justifyContent: "center", overflow: "visible" },
                            ], contentContainerStyle: [
                                GameScreen_styles_1.default.grid,
                                { paddingTop: 62, width: "100%", overflow: "visible" },
                            ], style: {
                                flex: 1,
                                width: "100%",
                                overflow: "visible",
                            }, initialNumToRender: 2, maxToRenderPerBatch: 2, windowSize: 1, extraData: cards, removeClippedSubviews: false, getItemLayout: (data, index) => ({
                                length: getCardSize(),
                                offset: getCardSize() * Math.floor(index / getNumColumns()),
                                index,
                            }) }, `flatlist-${gridLevel}-${age}`) })), (0, jsx_runtime_1.jsx)(react_native_1.View, { pointerEvents: "none", style: react_native_1.StyleSheet.absoluteFill, children: (0, jsx_runtime_1.jsx)(Confetti_1.default, { isActive: showConfetti, level: gridLevel }) }), showCongrats && ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [GameScreen_styles_1.default.congratsContainer, { zIndex: 3500 }], pointerEvents: "none", children: [(0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [GameScreen_styles_1.default.congratsGlow, congratsAnimatedStyle], children: (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../../assets/Frame_Type3_03_Decor.png"), style: {
                                        width: 221,
                                        height: 221,
                                        resizeMode: "contain",
                                        opacity: 1,
                                        zIndex: 2,
                                    } }) }), (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../../assets/TitlFon.png"), style: [GameScreen_styles_1.default.congratsFon, { opacity: 1 }] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [GameScreen_styles_1.default.congratsText, { zIndex: 10 }], adjustsFontSizeToFit: true, numberOfLines: 1, children: language === "es"
                                    ? "¡Felicidades!"
                                    : language === "pt"
                                        ? "Parabéns!"
                                        : language === "pl"
                                            ? "Gratulacje!"
                                            : language === "uk"
                                                ? "Вітаємо!"
                                                : language === "ru"
                                                    ? "Поздравляем!"
                                                    : "Congratulations!" })] })), showPlayAgain && ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [
                            GameScreen_styles_1.default.playAgainButton,
                            playAgainAnimatedStyle,
                            {
                                top: playAgainTop,
                                bottom: undefined,
                                zIndex: 5000,
                                elevation: 50,
                                position: "absolute",
                                alignSelf: "center",
                            },
                        ], children: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPressIn: handlePlayAgainPressIn, onPressOut: handlePlayAgainPressOut, activeOpacity: 1, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: [GameScreen_styles_1.default.playAgainGradient, { opacity: 1 }], children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [GameScreen_styles_1.default.playAgainContent, { opacity: 1 }], children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [GameScreen_styles_1.default.playAgainText, { opacity: 1 }], adjustsFontSizeToFit: true, numberOfLines: 1, children: "Play Game Again" }), (0, jsx_runtime_1.jsx)(PlayIcon, {})] }) }) }) })), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: { position: "relative", zIndex: 3000 }, children: (0, jsx_runtime_1.jsx)(CustomAlert_1.default, { visible: false, onClose: () => { }, title: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: { fontSize: 20, fontWeight: "bold", color: "#FFF" }, children: "Match!" }), message: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: { fontSize: 16, color: "#FFF" }, children: "Increase difficulty?" }), onYes: () => { }, onNo: () => { } }) })] })] }));
};
exports.default = GameScreen;
