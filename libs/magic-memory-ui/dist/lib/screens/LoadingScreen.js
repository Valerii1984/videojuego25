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
const expo_status_bar_1 = require("expo-status-bar");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const native_1 = require("@react-navigation/native");
const expo_linear_gradient_1 = require("expo-linear-gradient");
const BackgroundWrapper_1 = __importDefault(require("../components/BackgroundWrapper"));
const BackIcon_1 = __importDefault(require("../../icons/BackIcon"));
const global_styles_1 = __importDefault(require("../styles/global-styles"));
const LoadingScreen_styles_1 = __importDefault(require("./LoadingScreen.styles"));
const LoadingScreen = () => {
    const navigation = (0, native_1.useNavigation)();
    const width = (0, react_native_reanimated_1.useSharedValue)(0);
    const rotation = (0, react_native_reanimated_1.useSharedValue)(0);
    // Чистая функция перехода
    const goToLevelSelect = () => {
        navigation.replace("LevelSelect");
    };
    (0, react_1.useEffect)(() => {
        // Запуск анимации прогресса
        width.value = (0, react_native_reanimated_1.withTiming)(420, { duration: 2000 }, () => {
            (0, react_native_reanimated_1.runOnJS)(goToLevelSelect)();
        });
        // Запуск анимации песочных часов
        rotation.value = (0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(180, { duration: 1000, easing: react_native_reanimated_1.Easing.linear }), (0, react_native_reanimated_1.withTiming)(0, { duration: 0 }), (0, react_native_reanimated_1.withTiming)(180, { duration: 1000, easing: react_native_reanimated_1.Easing.linear }), (0, react_native_reanimated_1.withTiming)(0, { duration: 0 })), -1, true);
    }, []);
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        width: width.value,
    }));
    const hourglassRotationStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));
    return ((0, jsx_runtime_1.jsxs)(BackgroundWrapper_1.default, { children: [(0, jsx_runtime_1.jsx)(expo_status_bar_1.StatusBar, { hidden: true }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => navigation.replace("SplashScreen"), style: [global_styles_1.default.roundButton.topLeft, LoadingScreen_styles_1.default.customBackPosition], children: (0, jsx_runtime_1.jsx)(BackIcon_1.default, { style: { alignSelf: "center" } }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: LoadingScreen_styles_1.default.progressContainer, children: [(0, jsx_runtime_1.jsx)(expo_linear_gradient_1.LinearGradient, { colors: ["#e2dce7ff", "#7500D1"], start: { x: 1, y: 0 }, end: { x: 0, y: 0 }, style: LoadingScreen_styles_1.default.gradientBorder, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: LoadingScreen_styles_1.default.innerBackground, children: (0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [LoadingScreen_styles_1.default.progressFill, animatedStyle] }) }) }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: LoadingScreen_styles_1.default.loadingTextWrapper, children: [(0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.Image, { source: require("../../assets/hourglass.png"), style: [LoadingScreen_styles_1.default.hourglass, hourglassRotationStyle], resizeMode: "contain" }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: LoadingScreen_styles_1.default.loadingText, children: "Loading ..." })] })] })] }));
};
exports.default = LoadingScreen;
