import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { View, Text, TouchableOpacity, Platform, Image, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSound } from "../contexts/SoundContext";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, } from "react-native-reanimated";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import PlayIcon from "../../icons/PlayIcon";
import BackgroundWrapper from "../components/BackgroundWrapper";
import styles from "./SplashScreen.styles";
import { LinearGradient } from "expo-linear-gradient";
const SplashScreen = ({ fontsLoaded }) => {
    if (!fontsLoaded)
        return null;
    const navigation = useNavigation();
    const { playNotificationSound } = useSound();
    const pressAnimation = useSharedValue(1);
    const pulse = useSharedValue(1.05);
    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withTiming(pressAnimation.value, { duration: 100 }) }],
    }));
    const glowPulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulse.value }],
        opacity: 0.7,
    }));
    useEffect(() => {
        pulse.value = withRepeat(withTiming(1.2, { duration: 2000 }), -1, true);
        if (Platform.OS !== "web") {
            ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
    }, []);
    const baseFontSize = 48;
    return (_jsxs(BackgroundWrapper, { children: [_jsx(StatusBar, { hidden: Platform.OS !== "web", translucent: true, backgroundColor: "transparent", style: "light" }), _jsxs(View, { style: styles.contentContainer, children: [_jsxs(View, { style: styles.titleWrapper, children: [_jsx(Image, { source: require("../../assets/Frame_Type3_03_Decor.png"), style: styles.titleGlow }), _jsx(Image, { source: require("../../assets/TitlFon.png"), style: styles.titleFon }), _jsxs(Text, { style: [
                                    styles.titleText,
                                    {
                                        fontSize: baseFontSize,
                                        lineHeight: baseFontSize * 1.05,
                                    },
                                ], allowFontScaling: false, numberOfLines: 2, ellipsizeMode: "tail", children: ["Magic", "\n", "Memory"] })] }), _jsxs(View, { style: styles.playButtonContainer, children: [_jsx(Animated.View, { style: [styles.playGlow, glowPulseStyle] }), _jsx(Animated.View, { style: [buttonStyle], children: _jsx(View, { style: {
                                        borderWidth: 6,
                                        borderColor: "rgba(197, 124, 255, 0.9)",
                                        borderRadius: 65,
                                        shadowColor: "rgba(197, 124, 255, 0.8)",
                                        shadowOffset: { width: 0, height: 0 },
                                        shadowOpacity: 1,
                                        shadowRadius: 40,
                                        elevation: 10,
                                    }, children: _jsx(TouchableOpacity, { activeOpacity: 0.8, onPressIn: () => (pressAnimation.value = 0.95), onPressOut: () => (pressAnimation.value = 1), onPress: () => {
                                            playNotificationSound();
                                            navigation.replace("MagicMemoryLoadingScreen");
                                        }, children: _jsx(LinearGradient, { colors: [
                                                "rgba(199, 128, 255, 0.9)",
                                                "rgba(117, 0, 209, 0.9)",
                                            ], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 }, style: {
                                                width: 104,
                                                height: 104,
                                                borderRadius: 52,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }, children: _jsx(PlayIcon, { style: { alignSelf: "center" } }) }) }) }) })] })] })] }));
};
export default SplashScreen;
