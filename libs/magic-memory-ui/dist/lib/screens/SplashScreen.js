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
const native_1 = require("@react-navigation/native");
const SoundContext_1 = require("../contexts/SoundContext");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const ScreenOrientation = __importStar(require("expo-screen-orientation"));
const expo_status_bar_1 = require("expo-status-bar");
const PlayIcon_1 = __importDefault(require("../../icons/PlayIcon"));
const BackgroundWrapper_1 = __importDefault(require("../components/BackgroundWrapper"));
const SplashScreen_styles_1 = __importDefault(require("./SplashScreen.styles"));
const expo_linear_gradient_1 = require("expo-linear-gradient");
const SplashScreen = ({ fontsLoaded }) => {
    if (!fontsLoaded)
        return null;
    const navigation = (0, native_1.useNavigation)();
    const { playNotificationSound } = (0, SoundContext_1.useSound)();
    const pressAnimation = (0, react_native_reanimated_1.useSharedValue)(1);
    const pulse = (0, react_native_reanimated_1.useSharedValue)(1.05);
    const buttonStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: (0, react_native_reanimated_1.withTiming)(pressAnimation.value, { duration: 100 }) }],
    }));
    const glowPulseStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: pulse.value }],
        opacity: 0.7,
    }));
    (0, react_1.useEffect)(() => {
        pulse.value = (0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withTiming)(1.2, { duration: 2000 }), -1, true);
        if (react_native_1.Platform.OS !== "web") {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
    }, []);
    // Фиксированный размер шрифта, без системного масштабирования
    const baseFontSize = 48;
    return ((0, jsx_runtime_1.jsxs)(BackgroundWrapper_1.default, { children: [(0, jsx_runtime_1.jsx)(expo_status_bar_1.StatusBar, { hidden: react_native_1.Platform.OS !== "web", translucent: true, backgroundColor: "transparent", style: "light" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: SplashScreen_styles_1.default.contentContainer, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: SplashScreen_styles_1.default.titleWrapper, children: [(0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../../assets/Frame_Type3_03_Decor.png"), style: SplashScreen_styles_1.default.titleGlow }), (0, jsx_runtime_1.jsx)(react_native_1.Image, { source: require("../../assets/TitlFon.png"), style: SplashScreen_styles_1.default.titleFon }), (0, jsx_runtime_1.jsxs)(react_native_1.Text, { style: [
                                    SplashScreen_styles_1.default.titleText,
                                    {
                                        fontSize: baseFontSize,
                                        lineHeight: baseFontSize * 1.05, // Уменьшенный множитель для меньшего пространства
                                    },
                                ], allowFontScaling: false, numberOfLines: 2, ellipsizeMode: "tail", children: ["Magic", "\n", "Memory"] })] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: SplashScreen_styles_1.default.playButtonContainer, children: [(0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [SplashScreen_styles_1.default.playGlow, glowPulseStyle] }), (0, jsx_runtime_1.jsx)(react_native_reanimated_1.default.View, { style: [buttonStyle], children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: {
                                        borderWidth: 6,
                                        borderColor: "rgba(197, 124, 255, 0.9)",
                                        borderRadius: 65,
                                        shadowColor: "rgba(197, 124, 255, 0.8)",
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 1,
                                        shadowRadius: 40,
                                        elevation: 10,
                                    }, children: (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { activeOpacity: 0.8, onPressIn: () => (pressAnimation.value = 0.95), onPressOut: () => (pressAnimation.value = 1), onPress: () => {
                                            playNotificationSound();
                                            navigation.navigate("LoadingScreen");
                                        }, children: (0, jsx_runtime_1.jsx)(expo_linear_gradient_1.LinearGradient, { colors: [
                                                "rgba(199, 128, 255, 0.9)",
                                                "rgba(117, 0, 209, 0.9)",
                                            ], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 }, style: {
                                                width: 104,
                                                height: 104,
                                                borderRadius: 52,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }, children: (0, jsx_runtime_1.jsx)(PlayIcon_1.default, { style: { alignSelf: "center" } }) }) }) }) })] })] })] }));
};
exports.default = SplashScreen;
