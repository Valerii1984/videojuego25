import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, useWindowDimensions, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import BackgroundWrapper from "../components/BackgroundWrapper";
import BackIcon from "../../icons/BackIcon";
import globalStyles from "../styles/global-styles";
import styles from "./LevelSelect.styles";
import CardImage from "../../assets/card-1.jpg";
import FrameDecor from "../../assets/Frame_Type3_03_Decor1.png";
import GroupImage from "../../assets/Group1359.png";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, } from "react-native-reanimated";
export const GAME_LEVELS = [
    { cards: 4, difficulty: "Very Easy" },
    { cards: 6, difficulty: "Easy" },
    { cards: 8, difficulty: "Normal" },
    { cards: 10, difficulty: "Hard" },
    { cards: 12, difficulty: "Very Hard" },
];
const LevelCard = ({ cards, difficulty, index, isSelected, onPress, cardWidth, cardHeight, }) => {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    const handlePressIn = () => {
        scale.value = withTiming(1.1, { duration: 100 });
    };
    const handlePressOut = () => {
        scale.value = withTiming(1, { duration: 100 });
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
    return (_jsxs(TouchableOpacity, { onPress: onPress, onPressIn: handlePressIn, onPressOut: handlePressOut, style: [styles.levelCard, { width: cardWidth }], activeOpacity: 1, children: [_jsxs(Animated.View, { style: animatedStyle, children: [_jsx(Image, { source: FrameDecor, style: {
                            width: cardWidth + 25,
                            height: cardHeight + 30,
                            position: "absolute",
                            top: -15,
                            left: -10,
                            zIndex: 1,
                            opacity: 0.5,
                        } }), _jsx(View, { style: [
                            styles.cardBackground,
                            { width: cardWidth, height: cardHeight },
                            isSelected && styles.cardBackgroundSelected,
                        ], children: _jsxs(View, { style: styles.cardContent, children: [numberImageSource && (_jsx(Image, { source: numberImageSource, style: {
                                        ...styles.numberImage,
                                        width: cards <= 8 ? 18 : 30,
                                        height: 38,
                                    } })), _jsxs(View, { style: styles.cardIconWrapper, children: [_jsx(Image, { source: CardImage, style: styles.cardIcon }), _jsx(View, { style: styles.cardIconBorder })] })] }) })] }), _jsx(Text, { style: styles.difficulty, children: difficulty })] }, index));
};
const LevelSelectScreen = () => {
    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const [selectedLevel, setSelectedLevel] = useState(null);
    const levels = GAME_LEVELS;
    const handleLevelSelect = (index) => {
        const level = levels[index];
        setSelectedLevel(index);
        navigation.navigate("MagicMemoryGameScreen", { age: level.cards });
    };
    const cardWidth = 100;
    const cardHeight = 90;
    const baseGap = 40;
    const paddingHorizontal = width * 0.05;
    const gap = Math.max(15, Math.min(baseGap, (width - levels.length * cardWidth - 2 * paddingHorizontal) /
        (levels.length - 1) || baseGap));
    const renderLevelItem = ({ item, index, }) => (_jsx(LevelCard, { cards: item.cards, difficulty: item.difficulty, index: index, isSelected: selectedLevel === index, onPress: () => handleLevelSelect(index), cardWidth: cardWidth, cardHeight: cardHeight }));
    return (_jsxs(BackgroundWrapper, { children: [_jsx(StatusBar, { hidden: true }), _jsx(TouchableOpacity, { onPress: () => navigation.navigate("MagicMemorySplashScreen"), style: [globalStyles.roundButton.topLeft, styles.backButton], children: _jsx(BackIcon, { style: { alignSelf: "center" } }) }), _jsx(Text, { style: [styles.title, { marginTop: 0 }], children: "CHOOSE DIFFICULTY" }), _jsxs(View, { style: {
                    position: "relative",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 0,
                }, children: [_jsx(Image, { source: GroupImage, style: {
                            position: "absolute",
                            bottom: 25,
                            left: -40,
                            width: width + 130,
                            height: 160,
                            resizeMode: "stretch",
                        } }), _jsx(FlatList, { data: levels, renderItem: renderLevelItem, keyExtractor: (item, index) => index.toString(), horizontal: true, showsHorizontalScrollIndicator: false, contentContainerStyle: {
                            alignItems: "center",
                            paddingTop: 10,
                            paddingBottom: 0,
                            paddingLeft: paddingHorizontal,
                            paddingRight: paddingHorizontal - 10,
                            gap,
                            justifyContent: "center",
                        }, style: { zIndex: 1, flexGrow: 0, overflow: "visible" } })] })] }));
};
export default LevelSelectScreen;
