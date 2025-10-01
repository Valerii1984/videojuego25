import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState, useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList, StatusBar, Image, ImageBackground, StyleSheet, Dimensions, Keyboard, Platform, } from "react-native";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { Audio } from "expo-av";
import { Asset } from "expo-asset";
import Confetti from "../components/Confetti";
import CustomAlert from "../components/CustomAlert";
import MemoryCard from "../components/Card";
import { isWeb } from "../utils/config";
import globalStyles from "../styles/global-styles";
import styles from "./GameScreen.styles";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, runOnJS, } from "react-native-reanimated";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Path, } from "react-native-svg";
import { usePropConfig } from "../contexts/PropConfigContext";
import { useSound } from "../contexts/SoundContext";
import { ROBOT_SPRITES, ROBOT_VOICES } from "../../assets/hero";
const ENABLE_BACKGROUND_MUSIC = true;
const FANFARE = require("../../assets/sounds/success-fanfare-trumpets.mp3");
const STRINGS = {
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
const normalizeLocale = (raw) => {
    const s = (raw || "").toLowerCase().replace("_", "-");
    if (s.startsWith("de"))
        return "de-DE";
    if (s === "es-419")
        return "es-419";
    if (s.startsWith("es"))
        return "es-ES";
    if (s.startsWith("fr"))
        return "fr-FR";
    if (s.startsWith("it"))
        return "it-IT";
    if (s === "pt-br" || s === "ptbr" || s.startsWith("pt"))
        return "pt-BR";
    if (s.startsWith("pl"))
        return "pl-PL";
    return "en-US";
};
const asArray = (val) => !val ? undefined : Array.isArray(val) ? val : [val];
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};
const toGridLevel = (age) => {
    const even = age - (age % 2);
    const clamped = Math.min(12, Math.max(4, even));
    return (clamped === 4 || clamped === 6 || clamped === 8 || clamped === 10
        ? clamped
        : 12);
};
const PlayIcon = () => (_jsx(Image, { source: require("../../assets/playAgain.png"), style: styles.playIcon }));
const getSrc = (c) => {
    const anyCard = c;
    if (!anyCard || !anyCard.__source)
        return undefined;
    return typeof anyCard.__source === "string"
        ? anyCard.__source
        : anyCard.__source.uri;
};
const GameScreen = () => {
    const { playBackgroundMusic, resumeBackgroundMusic, playNotificationSound } = useSound();
    const unlockedRef = useRef(false);
    const cfg = usePropConfig();
    if (!cfg) {
        return (_jsx(View, { style: [
                StyleSheet.absoluteFill,
                { justifyContent: "center", alignItems: "center", padding: 24 },
            ], children: _jsx(Text, { style: { color: "#fff", textAlign: "center" }, children: "Missing configuration. Pass props into \"MagicMemory\" component." }) }));
    }
    const locale = normalizeLocale(cfg.lang);
    const t = (key) => (STRINGS[locale] || STRINGS["en-US"])[key];
    const [age, setAge] = useState(Math.max(2, cfg.age));
    const gridLevel = useMemo(() => toGridLevel(age), [age]);
    const pairsNeeded = useMemo(() => Math.floor(age / 2), [age]);
    const [cards, setCards] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [time, setTime] = useState(0);
    const [moves, setMoves] = useState(0);
    const [matchedCards, setMatchedCards] = useState([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
    const [roundsCompleted, setRoundsCompleted] = useState(0);
    const [totalStars, setTotalStars] = useState(0);
    const [isShowingCards, setIsShowingCards] = useState(false);
    const [isFlipping, setIsFlipping] = useState(false);
    const timer = useRef(null);
    const completionTimers = useRef([]);
    const [hintActive, setHintActive] = useState([]);
    const [smileVisible, setSmileVisible] = useState(null);
    const [showCongrats, setShowCongrats] = useState(false);
    const [showPlayAgain, setShowPlayAgain] = useState(false);
    const [isGameActive, setIsGameActive] = useState(true);
    // дуга и её видимость
    const [arcVisible, setArcVisible] = useState(false);
    const [activeRobotIndex, setActiveRobotIndex] = useState(0);
    const robotsOrderRef = useRef([]);
    const robotVoiceUrisRef = useRef(new Array(6).fill(null));
    const { width, height } = Dimensions.get("window");
    // shared values
    const arcOffsetY = useSharedValue(0);
    const arcOpacity = useSharedValue(1);
    const statsOffsetY = useSharedValue(0);
    const statsOpacity = useSharedValue(1);
    const playAgainScale = useSharedValue(1);
    const playAgainOpacity = useSharedValue(1);
    const hintScale = useSharedValue(1);
    const congratsPulse = useSharedValue(1.05);
    const successPlayedRef = useRef(false);
    const fanfareRef = useRef(null);
    const fanfareLoadedRef = useRef(false);
    const PLAY_AGAIN_OFFSET = 110;
    const PLAY_AGAIN_CAP = 0.78;
    const playAgainTop = Math.min(height * PLAY_AGAIN_CAP, height * 0.6 + PLAY_AGAIN_OFFSET);
    const selectedBackground = useMemo(() => {
        const candidates = asArray(cfg.background);
        const uri = candidates && candidates.length > 0 ? pickRandom(candidates) : undefined;
        return uri ? { source: { uri } } : null;
    }, [cfg.background, gridLevel, age]);
    const selectedBack = useMemo(() => {
        const candidates = asArray(cfg.backCardSide);
        const uri = candidates && candidates.length > 0 ? pickRandom(candidates) : undefined;
        return uri ? { uri } : null;
    }, [cfg.backCardSide, gridLevel, age]);
    const externalFrontList = useMemo(() => Array.isArray(cfg.frontCardSide)
        ? cfg.frontCardSide
        : [], [cfg.frontCardSide, gridLevel, age]);
    // animated styles
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
    // ✅ ФИКС ТИПОВ для TS2322: создаём строго типизированный массив transform
    const hintAnimatedStyle = useAnimatedStyle(() => {
        const t = [
            { translateY: arcOffsetY.value },
            { scale: hintScale.value },
        ];
        return {
            transform: t,
            opacity: arcOpacity.value,
        };
    });
    const congratsAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withTiming(congratsPulse.value, { duration: 2000 }) }],
        opacity: 1,
    }));
    // Прячем статус-бар + навбар Android
    useEffect(() => {
        const hideBars = async () => {
            try {
                StatusBar.setHidden(true, "none");
                if (Platform.OS === "android") {
                    await NavigationBar.setVisibilityAsync("hidden");
                    await NavigationBar.setBehaviorAsync("overlay-swipe");
                }
            }
            catch { }
        };
        hideBars();
        const subShow = Keyboard.addListener("keyboardDidShow", hideBars);
        const subHide = Keyboard.addListener("keyboardDidHide", hideBars);
        return () => {
            subShow.remove();
            subHide.remove();
            StatusBar.setHidden(false, "none");
            if (Platform.OS === "android") {
                NavigationBar.setVisibilityAsync("visible").catch(() => { });
            }
        };
    }, []);
    useEffect(() => {
        if (!isWeb) {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => { });
        }
        (async () => {
            try {
                const assets = await Promise.all(ROBOT_VOICES.map(async (mod) => {
                    var _a, _b;
                    const a = Asset.fromModule(mod);
                    await a.downloadAsync();
                    return (_b = (_a = a.localUri) !== null && _a !== void 0 ? _a : a.uri) !== null && _b !== void 0 ? _b : null;
                }));
                robotVoiceUrisRef.current = assets;
            }
            catch {
                robotVoiceUrisRef.current = new Array(6).fill(null);
            }
        })();
        (async () => {
            var _a;
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
                const { sound } = await Audio.Sound.createAsync({ uri: (_a = a.localUri) !== null && _a !== void 0 ? _a : a.uri }, { shouldPlay: false });
                await sound.setVolumeAsync(1.0);
                fanfareRef.current = sound;
                fanfareLoadedRef.current = true;
            }
            catch {
                fanfareLoadedRef.current = false;
            }
        })();
        if (ENABLE_BACKGROUND_MUSIC) {
            playBackgroundMusic().catch(() => { });
        }
        return () => {
            var _a;
            completionTimers.current.forEach(clearTimeout);
            completionTimers.current = [];
            (_a = fanfareRef.current) === null || _a === void 0 ? void 0 : _a.unloadAsync().catch(() => { });
        };
    }, []);
    // Таймер + BGM на ≥8
    useEffect(() => {
        if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
        }
        if (gridLevel >= 8) {
            if (ENABLE_BACKGROUND_MUSIC) {
                playBackgroundMusic().catch(() => { });
            }
            timer.current = setInterval(() => setTime((prev) => prev + 1), 1000);
        }
        return () => {
            if (timer.current)
                clearInterval(timer.current);
        };
    }, [gridLevel]);
    const playFanfareLocal = async () => {
        var _a;
        try {
            if (!fanfareLoadedRef.current || !fanfareRef.current) {
                const a = Asset.fromModule(FANFARE);
                await a.downloadAsync();
                const { sound } = await Audio.Sound.createAsync({ uri: (_a = a.localUri) !== null && _a !== void 0 ? _a : a.uri }, { shouldPlay: false });
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
            await fanfareRef.current.setPositionAsync(0);
            await fanfareRef.current.setVolumeAsync(1.0);
            await fanfareRef.current.replayAsync();
        }
        catch { }
    };
    useEffect(() => {
        if (!(showCongrats && isGameActive))
            return;
        if (successPlayedRef.current)
            return;
        successPlayedRef.current = true;
        (async () => {
            await playFanfareLocal();
            setTimeout(() => {
                var _a;
                (_a = fanfareRef.current) === null || _a === void 0 ? void 0 : _a.getStatusAsync().then((s) => {
                    if (!(s === null || s === void 0 ? void 0 : s.isLoaded) || !s.isPlaying) {
                        playFanfareLocal();
                    }
                }).catch(() => { });
            }, 300);
        })();
        congratsPulse.value = withRepeat(withTiming(1.2, { duration: 2000 }), -1, true);
    }, [showCongrats, isGameActive]);
    useEffect(() => {
        generateCards();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [age]);
    const playRobotVoice = async (idx) => {
        try {
            const uri = robotVoiceUrisRef.current[idx];
            if (!uri)
                throw new Error("no-uri");
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
            setTimeout(() => sound.unloadAsync().catch(() => { }), 2500);
        }
        catch {
            playNotificationSound().catch(() => { });
        }
    };
    const generateCards = () => {
        var _a;
        completionTimers.current.forEach((t) => clearTimeout(t));
        completionTimers.current = [];
        if (timer.current) {
            clearInterval(timer.current);
            timer.current = null;
        }
        const pairs = Math.floor(age / 2);
        const uniqFront = Array.from(new Set(externalFrontList));
        const backOk = !!(selectedBack === null || selectedBack === void 0 ? void 0 : selectedBack.uri);
        const bgOk = !!((_a = selectedBackground === null || selectedBackground === void 0 ? void 0 : selectedBackground.source) === null || _a === void 0 ? void 0 : _a.uri);
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
        setShowUpgradePrompt(false);
        setIsGameActive(true);
        // Дуговой оверлей + синхронное появление кнопки «?»
        arcVisible && setArcVisible(false);
        arcOffsetY.value = height;
        arcOpacity.value = 0;
        statsOffsetY.value = height;
        statsOpacity.value = 0;
        arcOffsetY.value = withTiming(0, { duration: 500 });
        arcOpacity.value = withTiming(1, { duration: 500 }, (finished) => {
            if (finished)
                runOnJS(setArcVisible)(true);
        });
        statsOffsetY.value = withTiming(0, { duration: 500 });
        statsOpacity.value = withTiming(1, { duration: 500 });
        const base = [0, 1, 2, 3, 4, 5];
        robotsOrderRef.current = shuffle(base);
        const chosen = uniqFront
            .slice()
            .sort(() => Math.random() - 0.5)
            .slice(0, pairs)
            .map((u) => ({ source: { uri: u } }));
        const selectedValues = chosen.flatMap((x) => [x, x]);
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
        if (ENABLE_BACKGROUND_MUSIC) {
            playBackgroundMusic().catch(() => { });
        }
        if (gridLevel >= 8) {
            timer.current = setInterval(() => setTime((p) => p + 1), 1000);
        }
    };
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
                    const matchIndex = Math.floor((matchedCards.length + 2) / 2) - 1;
                    const order = robotsOrderRef.current.length
                        ? robotsOrderRef.current
                        : [0, 1, 2, 3, 4, 5];
                    const robotIdx = order[matchIndex % order.length];
                    setActiveRobotIndex(robotIdx);
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
                            // уводим дугу и кнопку «?» вместе
                            arcOffsetY.value = withTiming(height, { duration: 700 }, (finished) => finished && runOnJS(setArcVisible)(false));
                            arcOpacity.value = withTiming(0, { duration: 700 });
                            statsOffsetY.value = withTiming(height, { duration: 700 });
                            statsOpacity.value = withTiming(0, { duration: 700 });
                            const congratsTimer = setTimeout(() => {
                                if (!isGameActive)
                                    return;
                                setShowCongrats(true);
                                setShowConfetti(true);
                            }, 900);
                            completionTimers.current.push(congratsTimer);
                            const nextTimer = setTimeout(() => {
                                if (!isGameActive)
                                    return;
                                setShowPlayAgain(false);
                                const nextAge = age + 2;
                                const goTimer = setTimeout(() => {
                                    setAge(nextAge);
                                }, 400);
                                completionTimers.current.push(goTimer);
                            }, 2100);
                            completionTimers.current.push(nextTimer);
                        }
                        else {
                            setIsFlipping(false);
                        }
                    }, 500);
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
                    const tmo = setTimeout(() => setHintActive([]), 2000);
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
                    const tmo = setTimeout(() => setHintActive([]), 2000);
                    completionTimers.current.push(tmo);
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
        return (_jsxs(View, { style: {
                position: "relative",
                marginHorizontal: 5,
                justifyContent: "center",
                alignItems: "center",
                width: cardSize,
                height: cardSize,
                opacity: 1,
                overflow: "visible",
                zIndex: 0,
            }, collapsable: false, children: [item.isMatched && !item.isHidden && (_jsx(View, { style: {
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
                    }, pointerEvents: "none" })), !item.isHidden && (_jsx(MemoryCard, { item: item, onPress: handleCardPress, getCardSize: getCardSize, disabled: isShowingCards || selectedCards.length >= 2, isHinted: hintActive.includes(item.id) || selectedCards.includes(item.id), style: { opacity: 1, zIndex: 0 }, backImage: selectedBack, frontImage: faceSource })), smileVisible === item.id &&
                    (() => {
                        const size = Math.round(getCardSize() * 0.34);
                        const left = (getCardSize() - size) / 2;
                        const top = -size - 12;
                        return (_jsx(View, { style: {
                                position: "absolute",
                                left,
                                top,
                                width: size,
                                height: size,
                                zIndex: 9999,
                                elevation: 50,
                            }, pointerEvents: "none", collapsable: false, renderToHardwareTextureAndroid: true, needsOffscreenAlphaCompositing: true, children: _jsx(ExpoImage, { source: ROBOT_SPRITES[activeRobotIndex], style: { width: "100%", height: "100%" }, contentFit: "contain" }) }));
                    })()] }));
    };
    const onFirstTouch = (_e) => {
        if (unlockedRef.current)
            return;
        unlockedRef.current = true;
        if (ENABLE_BACKGROUND_MUSIC) {
            resumeBackgroundMusic().catch(() => { });
        }
        StatusBar.setHidden(true, "none");
        if (Platform.OS === "android") {
            NavigationBar.setVisibilityAsync("hidden").catch(() => { });
        }
    };
    const handlePlayAgain = () => {
        setShowConfetti(false);
        setShowCongrats(false);
        setShowPlayAgain(false);
        generateCards();
    };
    const cfgOk = selectedBackground &&
        selectedBack &&
        externalFrontList.length >= pairsNeeded;
    if (!cfgOk) {
        return (_jsxs(View, { style: [
                StyleSheet.absoluteFill,
                { padding: 24, justifyContent: "center" },
            ], children: [_jsx(Text, { style: { color: "#fff", fontSize: 16, marginBottom: 8 }, children: "Invalid props. Expected:" }), _jsx(Text, { style: { color: "#ccc", marginBottom: 4 }, children: "\u2022 background: at least one image URL" }), _jsx(Text, { style: { color: "#ccc", marginBottom: 4 }, children: "\u2022 backCardSide: at least one image URL" }), _jsxs(Text, { style: { color: "#ccc" }, children: ["\u2022 frontCardSide: at least ", pairsNeeded, " unique image URLs"] })] }));
    }
    const { width: W, height: H } = Dimensions.get("window");
    const showHintButton = isGameActive && !showCongrats && !showPlayAgain && arcVisible;
    return (_jsxs(View, { style: { flex: 1, width: "100%", height: "100%" }, onStartShouldSetResponder: () => true, onResponderGrant: onFirstTouch, children: [_jsx(ImageBackground, { source: selectedBackground.source, style: [
                    StyleSheet.absoluteFillObject,
                    { width: "100%", height: "100%", zIndex: 0 },
                ], resizeMode: "cover" }), arcVisible && (_jsx(Animated.View, { style: [arcAnimatedStyle, { zIndex: 30 }], children: _jsxs(Svg, { height: H, width: "100%", style: { position: "absolute", top: 0, left: 0, zIndex: 5 }, viewBox: `0 0 ${W} ${H}`, preserveAspectRatio: "none", children: [_jsxs(Defs, { children: [_jsxs(SvgLinearGradient, { id: "arcGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx(Stop, { offset: "0", stopColor: "#020743", stopOpacity: "0.55" }), _jsx(Stop, { offset: "1", stopColor: "#080001", stopOpacity: "0.75" })] }), _jsxs(SvgLinearGradient, { id: "arcBorderGrad", x1: "0", y1: "0.5", x2: "1", y2: "0.5", children: [_jsx(Stop, { offset: "0", stopColor: "#C57CFF", stopOpacity: "0" }), _jsx(Stop, { offset: "0.3", stopColor: "#C57CFF", stopOpacity: "1" }), _jsx(Stop, { offset: "0.7", stopColor: "#C57CFF", stopOpacity: "1" }), _jsx(Stop, { offset: "1", stopColor: "#C57CFF", stopOpacity: "0" })] })] }), _jsx(Path, { d: `M0 ${H} L0 100 Q${W / 2} 60 ${W} 100 L${W} ${H} Z`, fill: "url(#arcGrad)" }), _jsx(Path, { d: `M0 100 Q${W / 2} 60 ${W} 100`, fill: "none", stroke: "url(#arcBorderGrad)", strokeWidth: 4, strokeLinecap: "round" })] }) })), _jsx(StatusBar, { hidden: true }), _jsxs(View, { style: [
                    globalStyles.containers.gameArea,
                    { flex: 1, width: "100%", opacity: 1, overflow: "visible" },
                ], children: [showHintButton && (_jsx(Animated.View, { style: [styles.hintButton, hintAnimatedStyle], children: _jsx(TouchableOpacity, { onPress: handleHint, onPressIn: () => (hintScale.value = withTiming(1.1, { duration: 100 })), onPressOut: () => (hintScale.value = withTiming(1, { duration: 100 })), activeOpacity: 1, children: _jsx(View, { style: [
                                    styles.hintGlow,
                                    // приглушаем тень в момент совместного движения с дугой
                                    { shadowOpacity: 0, elevation: 0 },
                                ], children: _jsx(View, { style: styles.hintBorder, children: _jsx(LinearGradient, { colors: ["#FFB380", "#D16C00"], style: styles.hintButtonInner, children: _jsx(Text, { style: styles.hintText, children: "?" }) }) }) }) }) })), cards.length > 0 && (_jsx(View, { style: {
                            flex: 1,
                            width: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 100,
                            overflow: "visible",
                        }, children: _jsx(FlatList, { data: cards, renderItem: renderItem, keyExtractor: (item) => item.id.toString(), numColumns: getNumColumns(), columnWrapperStyle: [
                                styles.row,
                                { justifyContent: "center", overflow: "visible" },
                            ], contentContainerStyle: [
                                styles.grid,
                                { paddingTop: 62, width: "100%", overflow: "visible" },
                            ], style: {
                                flex: 1,
                                width: "100%",
                                overflow: "visible",
                            }, initialNumToRender: 2, maxToRenderPerBatch: 2, windowSize: 1, extraData: cards, removeClippedSubviews: false, getItemLayout: (_data, index) => ({
                                length: getCardSize(),
                                offset: getCardSize() * Math.floor(index / getNumColumns()),
                                index,
                            }) }, `flatlist-${gridLevel}-${age}`) })), _jsx(View, { pointerEvents: "none", style: StyleSheet.absoluteFill, children: _jsx(Confetti, { isActive: showConfetti, level: gridLevel }) }), showCongrats && (_jsxs(View, { style: [styles.congratsContainer, { zIndex: 3500 }], pointerEvents: "none", children: [_jsx(Animated.View, { style: [styles.congratsGlow, congratsAnimatedStyle], children: _jsx(Image, { source: require("../../assets/Frame_Type3_03_Decor.png"), style: { width: 221, height: 221, resizeMode: "contain" } }) }), _jsx(Image, { source: require("../../assets/TitlFon.png"), style: [styles.congratsFon] }), _jsx(Text, { style: [styles.congratsText], adjustsFontSizeToFit: true, numberOfLines: 1, children: t("congrats") })] })), showPlayAgain && (_jsx(Animated.View, { style: [
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
                        ], children: _jsx(TouchableOpacity, { onPressIn: () => {
                                playAgainScale.value = 1.1;
                                playAgainOpacity.value = 0.8;
                            }, onPressOut: () => {
                                playAgainScale.value = 1;
                                playAgainOpacity.value = 1;
                                const tmo = setTimeout(() => handlePlayAgain(), 300);
                                completionTimers.current.push(tmo);
                            }, activeOpacity: 1, children: _jsx(View, { style: [styles.playAgainGradient], children: _jsxs(View, { style: [styles.playAgainContent], children: [_jsx(Text, { style: [styles.playAgainText], adjustsFontSizeToFit: true, numberOfLines: 1, children: t("playAgain") }), _jsx(PlayIcon, {})] }) }) }) })), _jsx(View, { style: { position: "relative", zIndex: 3000 }, children: _jsx(CustomAlert, { visible: false, onClose: () => { }, title: _jsx(Text, { style: { fontSize: 20, fontWeight: "bold", color: "#FFF" }, children: t("match") }), message: _jsx(Text, { style: { fontSize: 16, color: "#FFF" }, children: t("upgradePrompt") }), onYes: () => { }, onNo: () => { } }) })] })] }));
};
export default GameScreen;
