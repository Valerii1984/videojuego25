import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
  Dimensions,
  PixelRatio,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSound } from "../contexts/SoundContext";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { RootParamList } from "../types/index";
import globalStyles from "../styles/global-styles";
import PlayIcon from "../../icons/PlayIcon";
import BackgroundWrapper from "../components/BackgroundWrapper";
import styles from "./SplashScreen.styles";
import Svg, {
  Defs,
  Stop,
  Circle,
  LinearGradient as SvgGradient,
} from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

interface SplashScreenProps {
  fontsLoaded: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ fontsLoaded }) => {
  if (!fontsLoaded) return null;

  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
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

  // Фиксированный размер шрифта, без системного масштабирования
  const baseFontSize = 48;

  return (
    <BackgroundWrapper>
      <StatusBar
        hidden={Platform.OS !== "web"}
        translucent
        backgroundColor="transparent"
        style="light"
      />
      <View style={styles.contentContainer}>
        {/* Заголовок */}
        <View style={styles.titleWrapper}>
          <Image
            source={require("../../assets/Frame_Type3_03_Decor.png")}
            style={styles.titleGlow}
          />
          <Image
            source={require("../../assets/TitlFon.png")}
            style={styles.titleFon}
          />
          <Text
            style={[
              styles.titleText,
              {
                fontSize: baseFontSize,
                lineHeight: baseFontSize * 1.05, // Уменьшенный множитель для меньшего пространства
              },
            ]}
            allowFontScaling={false}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            Magic{"\n"}Memory
          </Text>
        </View>

        {/* Кнопка Play */}
        <View style={styles.playButtonContainer}>
          <Animated.View style={[styles.playGlow, glowPulseStyle]} />
          <Animated.View style={[buttonStyle]}>
            <View
              style={{
                borderWidth: 6,
                borderColor: "rgba(197, 124, 255, 0.9)",
                borderRadius: 65,
                shadowColor: "rgba(197, 124, 255, 0.8)",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 40,
                elevation: 10,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => (pressAnimation.value = 0.95)}
                onPressOut={() => (pressAnimation.value = 1)}
                onPress={() => {
                  playNotificationSound();
                  navigation.replace('MagicMemoryLoadingScreen');
                }}
              >
                <LinearGradient
                  colors={[
                    "rgba(199, 128, 255, 0.9)",
                    "rgba(117, 0, 209, 0.9)",
                  ]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={{
                    width: 104,
                    height: 104,
                    borderRadius: 52,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <PlayIcon style={{ alignSelf: "center" }} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default SplashScreen;
