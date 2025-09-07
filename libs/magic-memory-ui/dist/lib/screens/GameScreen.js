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
const expo_linear_gradient_1 = require("expo-linear-gradient");
const native_1 = require("@react-navigation/native");
const LanguageContext_1 = require("../contexts/LanguageContext");
const SoundContext_1 = require("../contexts/SoundContext");
const ScreenOrientation = __importStar(require("expo-screen-orientation"));
const Confetti_1 = __importDefault(require("../components/Confetti"));
const CustomAlert_1 = __importDefault(require("../components/CustomAlert"));
const Card_1 = __importDefault(require("../components/Card"));
const config_1 = require("../utils/config");
const global_styles_1 = __importDefault(require("../styles/global-styles"));
const BackIcon_1 = __importDefault(require("../../icons/BackIcon"));
const GameScreen_styles_1 = __importDefault(require("./GameScreen.styles"));
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
// хелперы для конфига
const asArray = (val) => {
    if (!val)
        return undefined;
    return Array.isArray(val) ? val : [val];
};
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const resolvePerLevel = (src, level) => {
    if (!src)
        return undefined;
    if (typeof src === "string")
        return [src];
    if (Array.isArray(src))
        return src;
    const lvl = src[level];
    return asArray(lvl);
};
// ассеты (фоллбэк, когда внешних URL нет/недостаточно)
const assetFrontGroups = {
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
const assetBacks = [
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
const PlayIcon = () => ((0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../assets/playAgain.png"), style: GameScreen_styles_1.default.playIcon }));
const GameScreen = () => {
    const { language } = (0, LanguageContext_1.useLanguage)();
    const { playNotificationSound, playSuccessSound, playBackgroundMusic, stopSuccessSound, } = (0, SoundContext_1.useSound)();
    const navigation = (0, native_1.useNavigation)();
    const route = (0, native_1.useRoute)();
    const incomingLevel = route.params?.level;
    const externalConfig = global
        ?.MAGIC_MEMORY_EXTERNAL_CONFIG;
    // текущий уровень: приоритет route → external → 4
    const level = (0, react_1.useMemo)(() => {
        const raw = (incomingLevel ?? externalConfig?.level ?? 4);
        const allowed = [4, 6, 8, 10, 12];
        return (allowed.includes(raw) ? raw : 4);
    }, [incomingLevel, externalConfig?.level]);
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
    const arcOffsetY = (0, react_native_reanimated_1.useSharedValue)(0);
    const arcOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const statsOffsetY = (0, react_native_reanimated_1.useSharedValue)(0);
    const statsOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const playAgainScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const playAgainOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const hintScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const backScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const congratsPulse = (0, react_native_reanimated_1.useSharedValue)(1.05);
    // размеры
    const { width, height } = react_native_1.Dimensions.get("window");
    // позиция кнопки (ниже баннера)
    const PLAY_AGAIN_OFFSET = 110;
    const PLAY_AGAIN_CAP = 0.78;
    const playAgainTop = Math.min(height * PLAY_AGAIN_CAP, height * 0.6 + PLAY_AGAIN_OFFSET);
    // -------- ПУЛЫ URL из externalConfig --------
    const bgPool = (0, react_1.useMemo)(() => resolvePerLevel(externalConfig?.background, level) ?? [], [externalConfig?.background, level]);
    const backPool = (0, react_1.useMemo)(() => resolvePerLevel(externalConfig?.backCard, level) ?? [], [externalConfig?.backCard, level]);
    const externalFrontList = (0, react_1.useMemo)(() => {
        const perLevel = externalConfig?.frontCards?.[level];
        return perLevel && perLevel.length ? perLevel : undefined;
    }, [externalConfig?.frontCards, level]);
    // -------- Состояние выбора фона/рубашки (перебираем КАЖДУЮ ИГРУ) --------
    const [selectedBackground, setSelectedBackground] = (0, react_1.useState)(() => {
        if (bgPool.length)
            return { source: { uri: pick(bgPool) }, hasStars: false };
        return pick(assetBackgrounds);
    });
    const [selectedBackgroundKey, setSelectedBackgroundKey] = (0, react_1.useState)(() => "hasStars" in selectedBackground && !selectedBackground.hasStars
        ? (selectedBackground.source?.uri ?? "asset")
        : "asset");
    const [selectedBack, setSelectedBack] = (0, react_1.useState)(() => {
        if (backPool.length)
            return { uri: pick(backPool) };
        return pick(assetBacks);
    });
    // прелоад ассетных фонов (не мешает URL)
    (0, react_1.useEffect)(() => {
        const preload = async () => {
            const promises = assetBackgrounds.map((bg) => react_native_1.Image.prefetch(react_native_1.Image.resolveAssetSource(bg.source).uri));
            try {
                await Promise.all(promises);
            }
            catch { }
        };
        preload();
    }, []);
    (0, react_1.useEffect)(() => {
        if (!config_1.isWeb) {
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
    }, [level, isInitialized, showCongrats, isGameActive]);
    const generateCards = () => {
        if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
        }
        // каждый старт выбираем новый фон/рубашку
        if (bgPool.length) {
            const uri = pick(bgPool);
            setSelectedBackground({ source: { uri }, hasStars: false });
            setSelectedBackgroundKey(uri); // форсим ремоунт фона
        }
        else {
            const bg = pick(assetBackgrounds);
            setSelectedBackground(bg);
            setSelectedBackgroundKey("asset-" + Math.random().toString(36).slice(2));
        }
        if (backPool.length) {
            setSelectedBack({ uri: pick(backPool) });
        }
        else {
            setSelectedBack(pick(assetBacks));
        }
        // сброс анимаций
        arcOffsetY.value = height;
        arcOpacity.value = 0;
        statsOffsetY.value = -100;
        statsOpacity.value = 0;
        const totalPairs = Math.floor(level / 2);
        // берём источники лиц
        let frontPool = [];
        if (externalFrontList && externalFrontList.length > 0) {
            const uniq = Array.from(new Set(externalFrontList));
            if (uniq.length >= totalPairs) {
                frontPool = uniq.map((u) => ({ source: { uri: u } }));
            }
        }
        if (frontPool.length === 0) {
            const groupKeys = Object.keys(assetFrontGroups);
            const selectedGroup = pick(groupKeys);
            const assets = assetFrontGroups[selectedGroup];
            frontPool = assets.map((a) => ({ source: a }));
        }
        const shuffled = [...frontPool].sort(() => Math.random() - 0.5);
        const pairsToUse = Math.min(totalPairs, shuffled.length);
        const chosen = shuffled.slice(0, pairsToUse);
        const selectedValues = chosen.flatMap((x) => [x, x]);
        const cardPairs = selectedValues
            .map((val, index) => ({
            id: index,
            value: "cardFace-1", // типобезопасность
            isFlipped: false,
            isMatched: false,
            isHidden: false,
            __source: val.source, // реальный источник изображения
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
        arcOffsetY.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 500 });
        arcOpacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 500 });
        statsOffsetY.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 500 });
        statsOpacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 500 });
        if (level === 4) {
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
        if ([8, 10, 12].includes(level)) {
            playBackgroundMusic().catch(() => { });
            timer.current = setInterval(() => setTime((prev) => prev + 1), 1000);
        }
    };
    const getStars = (lvl, t, m) => {
        if (![8, 10, 12].includes(lvl))
            return 0;
        let maxTime, maxMoves;
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
        if ([8, 10, 12].includes(level))
            setMoves((prev) => prev + 1);
        if (newSelected.length === 2) {
            const [firstId, secondId] = newSelected;
            const first = cards.find((c) => c.id === firstId);
            const second = cards.find((c) => c.id === secondId);
            const firstKey = first?.__source?.uri ?? first?.__source;
            const secondKey = second?.__source?.uri ?? second?.__source;
            const same = firstKey && secondKey && firstKey === secondKey;
            if (same) {
                const matchDelay = setTimeout(() => {
                    if (!isGameActive)
                        return;
                    playNotificationSound().catch(() => { });
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
                            const starsEarned = getStars(level, time, moves);
                            setTotalStars((prev) => prev + starsEarned);
                            const animTimer = setTimeout(() => {
                                if (!isGameActive)
                                    return;
                                arcOffsetY.value = (0, react_native_reanimated_1.withTiming)(height, { duration: 700 });
                                arcOpacity.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 700 });
                                statsOffsetY.value = (0, react_native_reanimated_1.withTiming)(height, { duration: 700 });
                                statsOpacity.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 700 });
                            }, 0);
                            completionTimers.current.push(animTimer);
                            const congratsTimer = setTimeout(() => {
                                if (!isGameActive)
                                    return;
                                setShowCongrats(true);
                                setShowConfetti(true);
                            }, 900);
                            completionTimers.current.push(congratsTimer);
                            const playAgainTimer = setTimeout(() => {
                                if (!isGameActive)
                                    return;
                                setShowPlayAgain(true);
                                if (newRounds >= 5)
                                    setShowUpgradePrompt(true);
                            }, 2100);
                            completionTimers.current.push(playAgainTimer);
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
                const key = selected.__source?.uri ?? selected.__source;
                const match = unmatched.find((c) => c.id !== selected.id && (c.__source?.uri ?? c.__source) === key);
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
                const a = unmatched[i].__source?.uri ?? unmatched[i].__source;
                const b = unmatched[j].__source?.uri ?? unmatched[j].__source;
                if (a === b) {
                    setHintActive([unmatched[i].id, unmatched[j].id]);
                    const t = setTimeout(() => setHintActive([]), 2000);
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
    const handleHintPressIn = () => {
        hintScale.value = 1.1;
    };
    const handleHintPressOut = () => {
        hintScale.value = 1;
    };
    const handleBackPress = async () => {
        backScale.value = (0, react_native_reanimated_1.withTiming)(1.1, { duration: 200 }, () => {
            backScale.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 200 });
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
            await new Promise((resolve) => setTimeout(() => resolve(), 100));
            navigation.goBack();
        }
        catch {
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
        const t = setTimeout(() => {
            handlePlayAgain();
        }, 300);
        completionTimers.current.push(t);
    };
    const handlePlayAgain = () => {
        setShowConfetti(false);
        setShowCongrats(false);
        setShowPlayAgain(false);
        generateCards(); // новый выбор фона/рубашки из пулов
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
                    }, pointerEvents: "none" })), !item.isHidden && ((0, jsx_runtime_1.jsx)(Card_1.default, { item: item, onPress: handleCardPress, getCardSize: getCardSize, disabled: isShowingCards || selectedCards.length >= 2, isHinted: hintActive.includes(item.id) || selectedCards.includes(item.id), style: { opacity: 1, zIndex: 0 }, backImage: selectedBack, frontImage: faceSource })), smileVisible === item.id && ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
                        position: "absolute",
                        left: 46,
                        top: -49,
                        zIndex: 9999,
                        elevation: 50,
                    }, pointerEvents: "none", collapsable: false, renderToHardwareTextureAndroid: true, needsOffscreenAlphaCompositing: true, children: (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../assets/faceSmile.png"), style: {
                            width: 32,
                            height: 32,
                            opacity: 1,
                            transform: [{ rotate: "0deg" }],
                            resizeMode: "contain",
                        } }) }))] }));
    };
    // анимации статики
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
    const backAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: (0, react_native_reanimated_1.withTiming)(backScale.value, { duration: 200 }) }],
        opacity: 1,
    }));
    const congratsAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: (0, react_native_reanimated_1.withTiming)(congratsPulse.value, { duration: 2000 }) }],
        opacity: 1,
    }));
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: { flex: 1, width: "100%", height: "100%" }, children: [(0, jsx_runtime_1.jsx)(react_native_1.ImageBackground, { source: selectedBackground.source, style: [
                    react_native_1.StyleSheet.absoluteFillObject,
                    { width: "100%", height: "100%", zIndex: 0 },
                ], resizeMode: "cover" }, selectedBackgroundKey), "hasStars" in selectedBackground && selectedBackground.hasStars && ((0, jsx_runtime_1.jsxs)(react_native_svg_1.default, { height: "100%", width: "100%", style: [react_native_1.StyleSheet.absoluteFillObject, { zIndex: 1 }], viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: "none", children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Defs, { children: (0, jsx_runtime_1.jsxs)(react_native_svg_1.RadialGradient, { id: "starGradient", cx: "50%", cy: "50%", r: "50%", children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0%", stopColor: "#FFFFFF", stopOpacity: "1.5" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "14.58%", stopColor: "#FFFFFF", stopOpacity: "1.5" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "100%", stopColor: "rgba(165, 94, 255, 0)", stopOpacity: "0" })] }) }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 38.11, cy: 44.71, r: Math.min(width, height) * 0.03, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 61.37, cy: 188.17, r: Math.min(width, height) * 0.02, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 158.31, cy: 250.21, r: Math.min(width, height) * 0.02, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 18.16, cy: 366.52, r: Math.min(width, height) * 0.03, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 274.63, cy: 137.76, r: Math.min(width, height) * 0.02, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 231.97, cy: 356.83, r: Math.min(width, height) * 0.03, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 369.62, cy: 141.64, r: Math.min(width, height) * 0.02, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 524.71, cy: 25.34, r: Math.min(width, height) * 0.03, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 569.3, cy: 347.15, r: Math.min(width, height) * 0.03, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 703.07, cy: 225.01, r: Math.min(width, height) * 0.03, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 751.53, cy: 48.59, r: Math.min(width, height) * 0.03, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 834.89, cy: 327.75, r: Math.min(width, height) * 0.04, fill: "url(#starGradient)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: 173.82, cy: 44.71, r: Math.min(width, height) * 0.04, fill: "url(#starGradient)" })] })), (0, jsx_runtime_1.jsxs)(react_native_reanimated_1.default.View, { style: [arcAnimatedStyle, { zIndex: 30 }], children: [(0, jsx_runtime_1.jsxs)(react_native_svg_1.default, { height: height, width: "100%", style: { position: "absolute", top: 0, left: 0, zIndex: 5 }, viewBox: `0 0 ${width} ${height}`, preserveAspectRatio: "none", children: [(0, jsx_runtime_1.jsxs)(react_native_svg_1.Defs, { children: [(0, jsx_runtime_1.jsxs)(react_native_svg_1.LinearGradient, { id: "arcGrad", x1: "0", y1: "0", x2: "0", y2: "1", gradientUnits: "objectBoundingBox", children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0", stopColor: "#020743", stopOpacity: "0.55" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "1", stopColor: "#080001", stopOpacity: "0.75" })] }), (0, jsx_runtime_1.jsxs)(react_native_svg_1.LinearGradient, { id: "arcBorderGrad", x1: "0", y1: "0.5", x2: "1", y2: "0.5", gradientUnits: "objectBoundingBox", children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0", stopColor: "#C57CFF", stopOpacity: "0" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0.3", stopColor: "#C57CFF", stopOpacity: "1" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0.7", stopColor: "#C57CFF", stopOpacity: "1" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "1", stopColor: "#C57CFF", stopOpacity: "0" })] })] }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: `M0 ${height} L0 100 Q${width / 2} 60 ${width} 100 L${width} ${height} Z`, fill: "url(#arcGrad)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: `M0 100 Q${width / 2} 60 ${width} 100`, fill: "none", stroke: "url(#arcBorderGrad)", strokeWidth: 4, strokeLinecap: "round" })] }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
                            height: height * 0.4,
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            opacity: 0.5,
                            zIndex: 4,
                        } })] }), (0, jsx_runtime_1.jsx)(react_native_1.StatusBar, { hidden: true }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [
                    global_styles_1.default.containers.gameArea,
                    { flex: 1, width: "100%", opacity: 1, overflow: "visible" },
                ], children: [!showPlayAgain && ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [GameScreen_styles_1.default.backButton, backAnimatedStyle], children: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleBackPress, activeOpacity: 0.7, hitSlop: { top: 20, bottom: 20, left: 20, right: 20 }, children: (0, jsx_runtime_1.jsx)(BackIcon_1.default, {}) }) })), !showPlayAgain && ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [GameScreen_styles_1.default.hintButton, hintAnimatedStyle], children: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleHint, onPressIn: handleHintPressIn, onPressOut: handleHintPressOut, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: GameScreen_styles_1.default.hintGlow, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: GameScreen_styles_1.default.hintBorder, children: (0, jsx_runtime_1.jsx)(expo_linear_gradient_1.LinearGradient, { colors: ["#FFB380", "#D16C00"], style: GameScreen_styles_1.default.hintButtonInner, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: GameScreen_styles_1.default.hintText, children: "?" }) }) }) }) }) })), [8, 10, 12].includes(level) && ((0, jsx_runtime_1.jsxs)(react_native_reanimated_1.default.View, { style: [
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
                            }) }, `flatlist-${level}`) })), (0, jsx_runtime_1.jsx)(react_native_1.View, { pointerEvents: "none", style: react_native_1.StyleSheet.absoluteFill, children: (0, jsx_runtime_1.jsx)(Confetti_1.default, { isActive: showConfetti, level: level }) }), showCongrats && ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [GameScreen_styles_1.default.congratsContainer, { zIndex: 3500 }], pointerEvents: "none", children: [(0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [GameScreen_styles_1.default.congratsGlow, congratsAnimatedStyle], children: (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../assets/Frame_Type3_03_Decor.png"), style: {
                                        width: 221,
                                        height: 221,
                                        resizeMode: "contain",
                                        opacity: 1,
                                        zIndex: 2,
                                    } }) }), (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../assets/TitlFon.png"), style: [GameScreen_styles_1.default.congratsFon, { opacity: 1 }] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [GameScreen_styles_1.default.congratsText, { zIndex: 10 }], adjustsFontSizeToFit: true, numberOfLines: 1, children: language === "es" ? "¡Felicidades!" : "Congratulations!" })] })), showPlayAgain && ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [
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
                        ], children: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPressIn: handlePlayAgainPressIn, onPressOut: handlePlayAgainPressOut, activeOpacity: 1, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: [GameScreen_styles_1.default.playAgainGradient, { opacity: 1 }], children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [GameScreen_styles_1.default.playAgainContent, { opacity: 1 }], children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [GameScreen_styles_1.default.playAgainText, { opacity: 1 }], adjustsFontSizeToFit: true, numberOfLines: 1, children: "Play Game Again" }), (0, jsx_runtime_1.jsx)(PlayIcon, {})] }) }) }) })), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: { position: "relative", zIndex: 3000 }, children: (0, jsx_runtime_1.jsx)(CustomAlert_1.default, { visible: showUpgradePrompt, onClose: () => setShowUpgradePrompt(false), title: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: { fontSize: 20, fontWeight: "bold", color: "#FFF" }, children: language === "es" ? "¡Coincidencia!" : "Match!" }), message: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: { fontSize: 16, color: "#FFF" }, children: language === "es"
                                    ? "¿Subir a un nivel más difícil?"
                                    : "Increase difficulty?" }), onYes: () => {
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
                                arcOffsetY.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 500 });
                                arcOpacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 500 });
                            }, onNo: () => {
                                setShowUpgradePrompt(false);
                                generateCards();
                            } }) })] })] }));
};
exports.default = GameScreen;
