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
exports.AppNavigator = AppNavigator;
const jsx_runtime_1 = require("react/jsx-runtime");
// libs/magic-memory-ui/src/lib/navigation/AppNavigator.tsx
const react_1 = require("react");
const native_1 = require("@react-navigation/native");
const native_stack_1 = require("@react-navigation/native-stack");
const SplashScreen_1 = __importDefault(require("../screens/SplashScreen"));
const LoadingScreen_1 = __importDefault(require("../screens/LoadingScreen"));
const LevelSelect_1 = __importDefault(require("../screens/LevelSelect"));
const LanguageContext_1 = require("../contexts/LanguageContext");
const SoundContext_1 = require("../contexts/SoundContext");
const Font = __importStar(require("expo-font"));
const react_native_1 = require("react-native");
const ScreenOrientation = __importStar(require("expo-screen-orientation"));
const config_1 = require("../utils/config");
const react_native_screens_1 = require("react-native-screens");
const GameScreen_1 = __importDefault(require("../screens/GameScreen"));
const NavigationBar = __importStar(require("expo-navigation-bar"));
(0, react_native_screens_1.enableScreens)();
const Stack = (0, native_stack_1.createNativeStackNavigator)();
const InnerNavigator = () => {
    const [fontsLoaded, setFontsLoaded] = (0, react_1.useState)(false);
    const { playBackgroundMusic } = (0, SoundContext_1.useSound)();
    (0, react_1.useEffect)(() => {
        const prepare = async () => {
            try {
                const fonts = {
                    Bangers: require("../../assets/fonts/Bangers-Regular.ttf"),
                    Fredoka: require("../../assets/fonts/Fredoka-Regular.ttf"),
                    FredokaSemiBold: require("../../assets/fonts/Fredoka-SemiBold.ttf"),
                };
                await Font.loadAsync(fonts);
                if (!config_1.isWeb) {
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
                }
                if (react_native_1.Platform.OS === "android") {
                    try {
                        await NavigationBar.setBackgroundColorAsync("#16103E");
                        await NavigationBar.setVisibilityAsync("hidden");
                        await NavigationBar.setBehaviorAsync("inset-swipe");
                    }
                    catch (err) {
                        console.warn("NavigationBar error:", err);
                    }
                }
                setFontsLoaded(true);
            }
            catch (e) {
                console.error("Font loading error:", e);
            }
        };
        prepare();
    }, []);
    (0, react_1.useEffect)(() => {
        if (fontsLoaded) {
            playBackgroundMusic().catch(() => { });
        }
    }, [fontsLoaded]);
    if (!fontsLoaded) {
        return (0, jsx_runtime_1.jsx)(react_native_1.View, { style: { flex: 1, backgroundColor: "#16103E" } });
    }
    const theme = {
        ...native_1.DefaultTheme,
        dark: true,
        colors: {
            ...native_1.DefaultTheme.colors,
            background: "#16103E",
            primary: "#FFFFFF",
            card: "#16103E",
            text: "#FFFFFF",
            border: "#16103E",
            notification: "#16103E",
        },
        fonts: {
            regular: { fontFamily: "Fredoka", fontWeight: "400" },
            medium: { fontFamily: "FredokaSemiBold", fontWeight: "600" },
            bold: { fontFamily: "FredokaSemiBold", fontWeight: "700" },
            heavy: { fontFamily: "FredokaSemiBold", fontWeight: "800" },
        },
    };
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { style: { flex: 1, backgroundColor: "#16103E" }, children: (0, jsx_runtime_1.jsxs)(native_1.NavigationContainer, { theme: theme, independent: true, children: [(0, jsx_runtime_1.jsx)(react_native_1.StatusBar, { hidden: react_native_1.Platform.OS !== "web", translucent: react_native_1.Platform.OS === "android", backgroundColor: "#16103E" }), (0, jsx_runtime_1.jsxs)(Stack.Navigator, { initialRouteName: "SplashScreen", screenOptions: {
                        headerShown: false,
                        contentStyle: { backgroundColor: "#16103E" },
                        animation: "none",
                        ...(react_native_1.Platform.OS === "android" && {
                            navigationBarColor: "#16103E",
                            navigationBarHidden: true,
                            statusBarHidden: true,
                            statusBarTranslucent: true,
                            statusBarColor: "#16103E",
                        }),
                    }, children: [(0, jsx_runtime_1.jsx)(Stack.Screen, { name: "SplashScreen", children: () => (0, jsx_runtime_1.jsx)(SplashScreen_1.default, { fontsLoaded: fontsLoaded }) }), (0, jsx_runtime_1.jsx)(Stack.Screen, { name: "LoadingScreen", component: LoadingScreen_1.default, options: { gestureEnabled: false } }), (0, jsx_runtime_1.jsx)(Stack.Screen, { name: "LevelSelect", component: LevelSelect_1.default }), (0, jsx_runtime_1.jsx)(Stack.Screen, { name: "GameScreen", component: GameScreen_1.default })] })] }) }));
};
function AppNavigator() {
    return ((0, jsx_runtime_1.jsx)(LanguageContext_1.LanguageProvider, { children: (0, jsx_runtime_1.jsx)(SoundContext_1.SoundProvider, { children: (0, jsx_runtime_1.jsx)(InnerNavigator, {}) }) }));
}
exports.default = AppNavigator;
