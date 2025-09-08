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
const ScreenOrientation = __importStar(require("expo-screen-orientation"));
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
const LanguageContext_1 = require("../contexts/LanguageContext");
const SoundContext_1 = require("../contexts/SoundContext");
const Confetti_1 = __importDefault(require("../components/Confetti"));
const CustomAlert_1 = __importDefault(require("../components/CustomAlert"));
const Card_1 = __importDefault(require("../components/Card"));
const global_styles_1 = __importDefault(require("../styles/global-styles"));
const BackIcon_1 = __importDefault(require("../../icons/BackIcon"));
const GameScreen_styles_1 = __importDefault(require("./GameScreen.styles"));
// ассеты-фоллбэки
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
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const asArray = (v) => v ? (Array.isArray(v) ? v : [v]) : undefined;
// иконка Play Again
const PlayIcon = () => ((0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../assets/playAgain.png"), style: GameScreen_styles_1.default.playIcon }));
const GameScreen = () => {
    const navigation = (0, native_1.useNavigation)();
    const route = (0, native_1.useRoute)();
    const { language } = (0, LanguageContext_1.useLanguage)();
    const { playNotificationSound, playSuccessSound, playBackgroundMusic, stopSuccessSound, } = (0, SoundContext_1.useSound)();
    // конфиг из пропсов навигации
    const { level: routeLevel, config } = (route.params || {});
    // уровень
    const level = (0, react_1.useMemo)(() => {
        const raw = (routeLevel ?? config?.age ?? 4);
        const allowed = [4, 6, 8, 10, 12];
        return (allowed.includes(raw) ? raw : 4);
    }, [routeLevel, config?.age]);
    const { width, height } = react_native_1.Dimensions.get("window");
    // state
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
    const [isGameActive, setIsGameActive] = (0, react_1.useState)(true);
    const [showCongrats, setShowCongrats] = (0, react_1.useState)(false);
    const [showPlayAgain, setShowPlayAgain] = (0, react_1.useState)(false);
    const [hintActive, setHintActive] = (0, react_1.useState)([]);
    const [smileVisible, setSmileVisible] = (0, react_1.useState)(null);
    // фон/рубашка на ТЕКУЩИЙ раунд
    const [roundBackground, setRoundBackground] = (0, react_1.useState)();
    const [roundBack, setRoundBack] = (0, react_1.useState)();
    // таймеры/анимации
    const timer = (0, react_1.useRef)(null);
    const completionTimers = (0, react_1.useRef)([]);
    const [isInitialized, setIsInitialized] = (0, react_1.useState)(false);
    const arcOffsetY = (0, react_native_reanimated_1.useSharedValue)(0);
    const arcOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const statsOffsetY = (0, react_native_reanimated_1.useSharedValue)(0);
    const statsOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const playAgainScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const playAgainOpacity = (0, react_native_reanimated_1.useSharedValue)(1);
    const hintScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const backScale = (0, react_native_reanimated_1.useSharedValue)(1);
    const congratsPulse = (0, react_native_reanimated_1.useSharedValue)(1.05);
    const PLAY_AGAIN_OFFSET = 110;
    const PLAY_AGAIN_CAP = 0.78;
    const playAgainTop = Math.min(height * PLAY_AGAIN_CAP, height * 0.6 + PLAY_AGAIN_OFFSET);
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
    // прелоад ассет-фонов (для скорости), не мешает URL
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
        ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => { });
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
            timer.current = setInterval(() => setTime((p) => p + 1), 1000);
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
        }
        else {
            setRoundBackground(pickRandom(assetBackgrounds));
        }
        // рубашка
        const backCandidates = asArray(config?.backCardSide);
        if (backCandidates && backCandidates.length > 0) {
            setRoundBack({ uri: pickRandom(backCandidates) });
        }
        else {
            setRoundBack(pickRandom(assetBacks));
        }
        // лица
        const totalPairs = Math.floor(level / 2);
        let frontPool = [];
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
        const cardPairs = selectedValues
            .map((val, index) => ({
            id: index,
            // значение из допустимых ключей — чтобы тип совпал
            value: "cardFace-1",
            isFlipped: false,
            isMatched: false,
            isHidden: false,
            // локально кладём реальный источник
            __source: val.source,
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
        arcOffsetY.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 500 });
        arcOpacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 500 });
        statsOffsetY.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 500 });
        statsOpacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 500 });
        if (level === 4) {
            setIsShowingCards(true);
            const showTimer = setTimeout(() => {
                setCards((prev) => prev.map((c) => ({ ...c, isFlipped: true })));
                const hideTimer = setTimeout(() => {
                    setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));
                    setIsShowingCards(false);
                }, 3000);
                completionTimers.current.push(hideTimer);
            }, 1000);
            completionTimers.current.push(showTimer);
        }
        if ([8, 10, 12].includes(level)) {
            playBackgroundMusic().catch(() => { });
            timer.current = setInterval(() => setTime((p) => p + 1), 1000);
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
            setMoves((p) => p + 1);
        if (newSelected.length === 2) {
            const [aId, bId] = newSelected;
            const a = cards.find((c) => c.id === aId);
            const b = cards.find((c) => c.id === bId);
            const same = a?.__source?.uri
                ? a.__source.uri === b?.__source?.uri
                : a?.__source === b?.__source;
            if (same) {
                const matchDelay = setTimeout(() => {
                    if (!isGameActive)
                        return;
                    playNotificationSound().catch(() => { });
                    const newMatched = [...matchedCards, aId, bId];
                    setMatchedCards(newMatched);
                    setCards((prev) => prev.map((c) => newMatched.includes(c.id)
                        ? { ...c, isMatched: true, isFlipped: true }
                        : c));
                    setSmileVisible(bId);
                    const smileTimer = setTimeout(() => {
                        if (!isGameActive)
                            return;
                        setSmileVisible(null);
                        setCards((prev) => prev.map((c) => newMatched.includes(c.id) ? { ...c, isHidden: true } : c));
                        setSelectedCards([]);
                        if (newMatched.length === cards.length) {
                            const rounds = roundsCompleted + 1;
                            setRoundsCompleted(rounds);
                            setTotalStars((p) => p + getStars(level, time, moves));
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
                                if (rounds >= 5)
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
                const flipBack = setTimeout(() => {
                    if (!isGameActive)
                        return;
                    setCards((prev) => prev.map((c) => newSelected.includes(c.id) ? { ...c, isFlipped: false } : c));
                    setSelectedCards([]);
                    setIsFlipping(false);
                }, 500);
                completionTimers.current.push(flipBack);
            }
        }
        else {
            const unlock = setTimeout(() => setIsFlipping(false), 500);
            completionTimers.current.push(unlock);
        }
    };
    const handleHint = () => {
        const unmatched = cards.filter((c) => !matchedCards.includes(c.id));
        if (selectedCards.length === 1) {
            const sel = cards.find((c) => c.id === selectedCards[0]);
            if (sel) {
                const key = sel.__source?.uri ?? sel.__source;
                const match = unmatched.find((c) => c.id !== sel.id &&
                    (c.__source?.uri ?? c.__source) === key);
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
            await new Promise((r) => setTimeout(r, 100));
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
        const t = setTimeout(() => handlePlayAgain(), 300);
        completionTimers.current.push(t);
    };
    const handlePlayAgain = () => {
        setShowConfetti(false);
        setShowCongrats(false);
        setShowPlayAgain(false);
        generateCards(); // тут снова выбираются фон/рубашка/лица
    };
    const getNumColumns = () => level === 4 ? 2 : level === 6 ? 3 : level === 8 ? 4 : level === 10 ? 5 : 6;
    const getCardSize = () => (level <= 6 ? 120 : 100);
    const { width: W, height: H } = react_native_1.Dimensions.get("window");
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
                        shadowColor: "rgba(197,124,255,0.3)",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.8,
                        shadowRadius: 15,
                        elevation: 2,
                        zIndex: 1,
                    }, pointerEvents: "none" })), !item.isHidden && ((0, jsx_runtime_1.jsx)(Card_1.default, { item: item, onPress: handleCardPress, getCardSize: getCardSize, disabled: isShowingCards || selectedCards.length >= 2, isHinted: hintActive.includes(item.id) || selectedCards.includes(item.id), style: { opacity: 1, zIndex: 0 }, backImage: roundBack, frontImage: faceSource })), smileVisible === item.id && ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
                        position: "absolute",
                        left: 46,
                        top: -49,
                        zIndex: 9999,
                        elevation: 50,
                    }, pointerEvents: "none", collapsable: false, renderToHardwareTextureAndroid: true, needsOffscreenAlphaCompositing: true, children: (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../assets/faceSmile.png"), style: {
                            width: 32,
                            height: 32,
                            opacity: 1,
                            resizeMode: "contain",
                        } }) }))] }));
    };
    return ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: { flex: 1, width: "100%", height: "100%" }, children: [roundBackground && ((0, jsx_runtime_1.jsx)(react_native_1.ImageBackground, { source: roundBackground.source, style: [
                    react_native_1.StyleSheet.absoluteFillObject,
                    { width: "100%", height: "100%", zIndex: 0 },
                ], resizeMode: "cover" })), roundBackground &&
                "hasStars" in roundBackground &&
                roundBackground.hasStars && ((0, jsx_runtime_1.jsxs)(react_native_svg_1.default, { height: "100%", width: "100%", style: [react_native_1.StyleSheet.absoluteFillObject, { zIndex: 1 }], viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none", children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Defs, { children: (0, jsx_runtime_1.jsxs)(react_native_svg_1.RadialGradient, { id: "starGradient", cx: "50%", cy: "50%", r: "50%", children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0%", stopColor: "#FFFFFF", stopOpacity: "1.5" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "14.58%", stopColor: "#FFFFFF", stopOpacity: "1.5" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "100%", stopColor: "rgba(165, 94, 255, 0)", stopOpacity: "0" })] }) }), [
                        38.11, 61.37, 158.31, 18.16, 274.63, 231.97, 369.62, 524.71,
                        569.3, 703.07, 751.53, 834.89, 173.82,
                    ].map((x, i) => ((0, jsx_runtime_1.jsx)(react_native_svg_1.Circle, { cx: x, cy: (i * 60 + 45) % H, r: Math.min(W, H) * (i % 3 === 0 ? 0.04 : 0.02), fill: "url(#starGradient)" }, i)))] })), (0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [arcAnimatedStyle, { zIndex: 30 }], children: (0, jsx_runtime_1.jsxs)(react_native_svg_1.default, { height: H, width: "100%", style: { position: "absolute", top: 0, left: 0, zIndex: 5 }, viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none", children: [(0, jsx_runtime_1.jsxs)(react_native_svg_1.Defs, { children: [(0, jsx_runtime_1.jsxs)(react_native_svg_1.LinearGradient, { id: "arcGrad", x1: "0", y1: "0", x2: "0", y2: "1", gradientUnits: "objectBoundingBox", children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0", stopColor: "#020743", stopOpacity: "0.55" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "1", stopColor: "#080001", stopOpacity: "0.75" })] }), (0, jsx_runtime_1.jsxs)(react_native_svg_1.LinearGradient, { id: "arcBorderGrad", x1: "0", y1: "0.5", x2: "1", y2: "0.5", gradientUnits: "objectBoundingBox", children: [(0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0", stopColor: "#C57CFF", stopOpacity: "0" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0.3", stopColor: "#C57CFF", stopOpacity: "1" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "0.7", stopColor: "#C57CFF", stopOpacity: "1" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Stop, { offset: "1", stopColor: "#C57CFF", stopOpacity: "0" })] })] }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: `M0 ${H} L0 100 Q${W / 2} 60 ${W} 100 L${W} ${H} Z`, fill: "url(#arcGrad)" }), (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: `M0 100 Q${W / 2} 60 ${W} 100`, fill: "none", stroke: "url(#arcBorderGrad)", strokeWidth: 4, strokeLinecap: "round" })] }) }), (0, jsx_runtime_1.jsx)(react_native_1.StatusBar, { hidden: true }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [
                    global_styles_1.default.containers.gameArea,
                    { flex: 1, width: "100%", overflow: "visible" },
                ], children: [!showPlayAgain && ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [GameScreen_styles_1.default.backButton, backAnimatedStyle], children: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleBackPress, activeOpacity: 0.7, hitSlop: { top: 20, bottom: 20, left: 20, right: 20 }, children: (0, jsx_runtime_1.jsx)(BackIcon_1.default, {}) }) })), !showPlayAgain && ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [GameScreen_styles_1.default.hintButton, hintAnimatedStyle], children: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: handleHint, onPressIn: () => (hintScale.value = 1.1), onPressOut: () => (hintScale.value = 1), children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: GameScreen_styles_1.default.hintGlow, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: GameScreen_styles_1.default.hintBorder, children: (0, jsx_runtime_1.jsx)(expo_linear_gradient_1.LinearGradient, { colors: ["#FFB380", "#D16C00"], style: GameScreen_styles_1.default.hintButtonInner, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: GameScreen_styles_1.default.hintText, children: "?" }) }) }) }) }) })), [8, 10, 12].includes(level) && ((0, jsx_runtime_1.jsxs)(react_native_reanimated_1.default.View, { style: [GameScreen_styles_1.default.statsPanel, statsAnimatedStyle, { zIndex: 20 }], children: [(0, jsx_runtime_1.jsx)(react_native_1.View, { style: [
                                    GameScreen_styles_1.default.statsItem,
                                    {
                                        backgroundColor: "#C57CFF",
                                        minWidth: 100,
                                        alignItems: "center",
                                    },
                                ], children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: [GameScreen_styles_1.default.statsText, { color: "#FFF" }], children: ["Time: ", (0, jsx_runtime_1.jsxs)(react_native_1.Text, { children: [time, "s"] })] }) }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: [GameScreen_styles_1.default.statsItem, { backgroundColor: "#C57CFF" }], children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: [GameScreen_styles_1.default.statsText, { color: "#FFF" }], children: ["Moves: ", (0, jsx_runtime_1.jsx)(react_native_1.Text, { children: moves })] }) }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: [GameScreen_styles_1.default.statsItem, { backgroundColor: "#C57CFF" }], children: (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: [GameScreen_styles_1.default.statsText, { color: "#FFF" }], children: ["Stars: ", (0, jsx_runtime_1.jsxs)(react_native_1.Text, { children: [totalStars, "\u2605"] })] }) })] })), cards.length > 0 && ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
                            flex: 1,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 100,
                        }, children: (0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: cards, renderItem: renderItem, keyExtractor: (it) => it.id.toString(), numColumns: getNumColumns(), columnWrapperStyle: [GameScreen_styles_1.default.row, { justifyContent: "center" }], contentContainerStyle: [
                                GameScreen_styles_1.default.grid,
                                { paddingTop: 62, width: "100%" },
                            ], style: { flex: 1, width: "100%" }, initialNumToRender: 4, maxToRenderPerBatch: 6, windowSize: 3, extraData: cards, removeClippedSubviews: false, getItemLayout: (data, index) => ({
                                length: getCardSize(),
                                offset: getCardSize() * Math.floor(index / getNumColumns()),
                                index,
                            }) }, `flatlist-${level}`) })), (0, jsx_runtime_1.jsx)(react_native_1.View, { pointerEvents: "none", style: react_native_1.StyleSheet.absoluteFill, children: (0, jsx_runtime_1.jsx)(Confetti_1.default, { isActive: showConfetti, level: level }) }), showCongrats && ((0, jsx_runtime_1.jsxs)(react_native_1.View, { style: [GameScreen_styles_1.default.congratsContainer, { zIndex: 3500 }], pointerEvents: "none", children: [(0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [GameScreen_styles_1.default.congratsGlow, congratsAnimatedStyle], children: (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../assets/Frame_Type3_03_Decor.png"), style: { width: 221, height: 221, resizeMode: "contain" } }) }), (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../assets/TitlFon.png"), style: GameScreen_styles_1.default.congratsFon }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [GameScreen_styles_1.default.congratsText, { zIndex: 10 }], adjustsFontSizeToFit: true, numberOfLines: 1, children: language === "es" ? "¡Felicidades!" : "Congratulations!" })] })), showPlayAgain && ((0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [
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
                        ], children: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPressIn: handlePlayAgainPressIn, onPressOut: handlePlayAgainPressOut, activeOpacity: 1, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: GameScreen_styles_1.default.playAgainGradient, children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: GameScreen_styles_1.default.playAgainContent, children: [(0, jsx_runtime_1.jsx)(react_native_1.Text, { style: GameScreen_styles_1.default.playAgainText, adjustsFontSizeToFit: true, numberOfLines: 1, children: "Play Game Again" }), (0, jsx_runtime_1.jsx)(PlayIcon, {})] }) }) }) })), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: { position: "relative", zIndex: 3000 }, children: (0, jsx_runtime_1.jsx)(CustomAlert_1.default, { visible: showUpgradePrompt, onClose: () => setShowUpgradePrompt(false), title: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: { fontSize: 20, fontWeight: "bold", color: "#FFF" }, children: "Match!" }), message: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: { fontSize: 16, color: "#FFF" }, children: "Increase difficulty?" }), onYes: () => {
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
                                arcOffsetY.value = (0, react_native_reanimated_1.withTiming)(0, { duration: 500 });
                                arcOpacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 500 });
                            }, onNo: () => {
                                setShowUpgradePrompt(false);
                                generateCards();
                            } }) })] })] }));
};
exports.default = GameScreen;
