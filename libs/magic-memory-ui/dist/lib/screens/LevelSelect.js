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
const expo_status_bar_1 = require("expo-status-bar");
const BackgroundWrapper_1 = __importDefault(require("../components/BackgroundWrapper"));
const BackIcon_1 = __importDefault(require("../../icons/BackIcon"));
const global_styles_1 = __importDefault(require("../styles/global-styles"));
const LevelSelect_styles_1 = __importDefault(require("./LevelSelect.styles"));
const card_1_jpg_1 = __importDefault(require("../../assets/card-1.jpg"));
const Frame_Type3_03_Decor1_png_1 = __importDefault(require("../../assets/Frame_Type3_03_Decor1.png"));
const Group1359_png_1 = __importDefault(require("../../assets/Group1359.png")); // фон под карточками
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
// ================= LevelCard =================
const LevelCard = ({ cards, difficulty, index, isSelected, onPress, cardWidth, cardHeight, }) => {
    const scale = (0, react_native_reanimated_1.useSharedValue)(1);
    const animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        transform: [{ scale: scale.value }],
    }));
    const handlePressIn = () => {
        scale.value = (0, react_native_reanimated_1.withTiming)(1.1, { duration: 100 });
    };
    const handlePressOut = () => {
        scale.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 100 });
    };
    const numberImageSource = (() => {
        switch (cards) {
            case 4:
                return require("../../assets/numbers/number-4.png");
            case 6:
                return require("../../assets/numbers/number-6.png");
            case 8:
                return require("../../assets/numbers/number-8.png");
            case 10:
                return require("../../assets/numbers/number-10.png");
            case 12:
                return require("../../assets/numbers/number-12.png");
            default:
                return null;
        }
    })();
    return ((0, jsx_runtime_1.jsxs)(react_native_1.TouchableOpacity, { onPress: onPress, onPressIn: handlePressIn, onPressOut: handlePressOut, style: [LevelSelect_styles_1.default.levelCard, { width: cardWidth }], activeOpacity: 1, children: [(0, jsx_runtime_1.jsxs)(react_native_reanimated_1.default.View, { style: animatedStyle, children: [(0, jsx_runtime_1.jsx)(react_native_1.Image, { source: Frame_Type3_03_Decor1_png_1.default, style: {
                            width: cardWidth + 25,
                            height: cardHeight + 30,
                            position: "absolute",
                            top: -15,
                            left: -10,
                            zIndex: 1,
                            opacity: 0.5,
                        } }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: [
                            LevelSelect_styles_1.default.cardBackground,
                            { width: cardWidth, height: cardHeight },
                            isSelected && LevelSelect_styles_1.default.cardBackgroundSelected,
                        ], children: (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: LevelSelect_styles_1.default.cardContent, children: [numberImageSource && ((0, jsx_runtime_1.jsx)(react_native_1.Image, { source: numberImageSource, style: {
                                        ...LevelSelect_styles_1.default.numberImage,
                                        width: cards <= 8 ? 18 : 30,
                                        height: 38,
                                    } })), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: LevelSelect_styles_1.default.cardIconWrapper, children: [(0, jsx_runtime_1.jsx)(react_native_1.Image, { source: card_1_jpg_1.default, style: LevelSelect_styles_1.default.cardIcon }), (0, jsx_runtime_1.jsx)(react_native_1.View, { style: LevelSelect_styles_1.default.cardIconBorder })] })] }) })] }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: LevelSelect_styles_1.default.difficulty, children: difficulty })] }, index));
};
// ================= LevelSelectScreen =================
const LevelSelectScreen = () => {
    const navigation = (0, native_1.useNavigation)();
    const { width } = (0, react_native_1.useWindowDimensions)();
    const [selectedLevel, setSelectedLevel] = (0, react_1.useState)(null);
    const levels = [
        { cards: 4, difficulty: "Very Easy" },
        { cards: 6, difficulty: "Easy" },
        { cards: 8, difficulty: "Normal" },
        { cards: 10, difficulty: "Hard" },
        { cards: 12, difficulty: "Very Hard" },
    ];
    const handleLevelSelect = (index) => {
        const level = levels[index];
        setSelectedLevel(index);
        navigation.navigate("GameScreen", { level: level.cards });
    };
    // Размер карточек
    const cardWidth = 100;
    const cardHeight = 90;
    const baseGap = 40;
    // Адаптивный gap
    const paddingHorizontal = width * 0.05;
    const gap = Math.max(15, Math.min(baseGap, (width - levels.length * cardWidth - 2 * paddingHorizontal) /
        (levels.length - 1) || baseGap));
    const renderLevelItem = ({ item, index, }) => ((0, jsx_runtime_1.jsx)(LevelCard, { cards: item.cards, difficulty: item.difficulty, index: index, isSelected: selectedLevel === index, onPress: () => handleLevelSelect(index), cardWidth: cardWidth, cardHeight: cardHeight }));
    return ((0, jsx_runtime_1.jsxs)(BackgroundWrapper_1.default, { children: [(0, jsx_runtime_1.jsx)(expo_status_bar_1.StatusBar, { hidden: true }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { onPress: () => navigation.navigate("SplashScreen"), style: [global_styles_1.default.roundButton.topLeft, LevelSelect_styles_1.default.backButton], children: (0, jsx_runtime_1.jsx)(BackIcon_1.default, { style: { alignSelf: "center" } }) }), (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: [LevelSelect_styles_1.default.title, { marginTop: 0 }], children: "CHOOSE DIFFICULTY" }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: {
                    position: "relative",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 0,
                }, children: [(0, jsx_runtime_1.jsx)(react_native_1.Image, { source: Group1359_png_1.default, style: {
                            position: "absolute",
                            bottom: 25, // оставляем привязку снизу
                            left: -40,
                            width: width + 130,
                            height: 160, // фикс вместо width * 0.22
                            resizeMode: "stretch",
                        } }), (0, jsx_runtime_1.jsx)(react_native_1.FlatList, { data: levels, renderItem: renderLevelItem, keyExtractor: (item, index) => index.toString(), horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: {
                            alignItems: "center",
                            paddingTop: 10,
                            paddingBottom: 0,
                            paddingLeft: paddingHorizontal,
                            paddingRight: paddingHorizontal - 10,
                            gap,
                            justifyContent: "center",
                        }, style: { zIndex: 1, flexGrow: 0, overflow: "visible" } })] })] }));
};
exports.default = LevelSelectScreen;
