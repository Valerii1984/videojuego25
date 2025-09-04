"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_native_1 = require("react-native");
const imageMap_1 = __importDefault(require("../utils/imageMap"));
const Card_styles_1 = __importDefault(require("./Card.styles"));
// Цвета для группы facecard
const facecardBackgroundColors = {
    boy: "#00FF00",
    donkey: "#FFFF00",
    girl: "#FF69B4",
    kengoo: "#90EE90",
    owl: "#800080",
    pig: "#8B4513",
    puh: "#FF0000",
    tigr: "#00B7EB",
};
const MemoryCard = (0, react_1.memo)(({ item, onPress, getCardSize, disabled = false, isHinted = false, style, backImage, frontImage, }) => {
    const cardSize = getCardSize();
    const animatedValue = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const hintOpacity = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const matchedBorderAnimated = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const cardOpacity = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const prevIsHintedRef = (0, react_1.useRef)(isHinted);
    const prevIsMatchedRef = (0, react_1.useRef)(item.isMatched);
    const prevIsHiddenRef = (0, react_1.useRef)(item.isHidden);
    const flipToFront = () => {
        react_native_1.Animated.timing(animatedValue, {
            toValue: 180,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };
    const flipToBack = () => {
        react_native_1.Animated.timing(animatedValue, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };
    const animateHint = () => {
        react_native_1.Animated.sequence([
            react_native_1.Animated.timing(hintOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            react_native_1.Animated.delay(2000),
            react_native_1.Animated.timing(hintOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    };
    (0, react_1.useEffect)(() => {
        if (item.isFlipped || item.isMatched) {
            flipToFront();
        }
        else {
            flipToBack();
        }
    }, [item.isFlipped, item.isMatched]);
    (0, react_1.useEffect)(() => {
        if (isHinted &&
            !item.isFlipped &&
            !item.isMatched &&
            !prevIsHintedRef.current) {
            animateHint();
        }
        else if (prevIsHintedRef.current &&
            (!isHinted || item.isFlipped || item.isMatched)) {
            react_native_1.Animated.timing(hintOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
        prevIsHintedRef.current = isHinted;
    }, [isHinted, item.isFlipped, item.isMatched]);
    (0, react_1.useEffect)(() => {
        if (item.isMatched && !prevIsMatchedRef.current) {
            setTimeout(() => {
                react_native_1.Animated.parallel([
                    react_native_1.Animated.timing(matchedBorderAnimated, {
                        toValue: 1,
                        duration: 1500,
                        useNativeDriver: true,
                    }),
                    react_native_1.Animated.timing(cardOpacity, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ]).start();
            }, 500);
        }
        else if (item.isHidden && !prevIsHiddenRef.current) {
            react_native_1.Animated.parallel([
                react_native_1.Animated.timing(cardOpacity, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(matchedBorderAnimated, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ]).start();
        }
        prevIsMatchedRef.current = item.isMatched;
        prevIsHiddenRef.current = item.isHidden;
    }, [item.isMatched, item.isHidden]);
    const frontInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ["180deg", "0deg"],
    });
    const backInterpolate = animatedValue.interpolate({
        inputRange: [0, 180],
        outputRange: ["0deg", "180deg"],
    });
    const matchedBorderOpacity = matchedBorderAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });
    const resolvedBackImage = backImage || imageMap_1.default["card-1"];
    const imageSource = frontImage || resolvedBackImage;
    const frontBackgroundColor = facecardBackgroundColors[item.value] || "#FFFFFF";
    return ((0, jsx_runtime_1.jsx)(react_native_1.Animated.View, { style: { opacity: cardOpacity }, children: (0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { style: [Card_styles_1.default.card, { width: cardSize, height: cardSize }, style], onPress: () => !disabled && onPress(item.id), disabled: disabled, activeOpacity: 1, children: [item.isMatched && ((0, jsx_runtime_1.jsx)(react_native_1.Animated.View, { pointerEvents: "none", style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: 10,
                        borderColor: "#C57CFF",
                        borderWidth: 6,
                        opacity: matchedBorderOpacity,
                        zIndex: 3,
                    } })), (0, jsx_runtime_1.jsxs)(react_native_1.Animated.View, { style: [
                        Card_styles_1.default.cardSide,
                        {
                            position: "absolute",
                            width: cardSize,
                            height: cardSize,
                            transform: [{ rotateY: frontInterpolate }],
                            backfaceVisibility: "hidden",
                            backgroundColor: frontBackgroundColor,
                            borderRadius: 10,
                            zIndex: 0,
                        },
                    ], children: [!item.isMatched && ((0, jsx_runtime_1.jsx)(react_native_1.Animated.View, { pointerEvents: "none", style: {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: 10,
                                borderColor: "#1780DB",
                                borderWidth: 4,
                                zIndex: 2,
                            } })), (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: imageSource, style: [Card_styles_1.default.cardImage, { width: cardSize, height: cardSize }], resizeMode: "contain" })] }), isHinted && !item.isFlipped && !item.isMatched && ((0, jsx_runtime_1.jsx)(react_native_1.Animated.View, { style: {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderColor: "rgba(232, 143, 64, 1)",
                        borderRadius: 10,
                        borderWidth: 4,
                        opacity: hintOpacity,
                        zIndex: 3,
                    } })), (0, jsx_runtime_1.jsxs)(react_native_1.Animated.View, { style: [
                        Card_styles_1.default.cardSide,
                        Card_styles_1.default.cardBackFace,
                        {
                            width: cardSize,
                            height: cardSize,
                            transform: [{ rotateY: backInterpolate }],
                            backfaceVisibility: "hidden",
                            backgroundColor: "#FFFFFF",
                            borderRadius: 10,
                            zIndex: 0,
                        },
                    ], children: [!item.isMatched && ((0, jsx_runtime_1.jsx)(react_native_1.Animated.View, { pointerEvents: "none", style: {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: 10,
                                borderColor: "#1780DB",
                                borderWidth: 4,
                                zIndex: 2,
                            } })), (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: resolvedBackImage, style: [Card_styles_1.default.cardImage, { width: cardSize, height: cardSize }], resizeMode: "contain" }), (0, jsx_runtime_1.jsx)(react_native_1.Animated.View, { style: [Card_styles_1.default.hintOverlay, { opacity: hintOpacity }], children: (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: resolvedBackImage, style: [
                                    Card_styles_1.default.cardImage,
                                    { width: cardSize, height: cardSize },
                                ], resizeMode: "contain" }) })] })] }) }));
});
exports.default = MemoryCard;
