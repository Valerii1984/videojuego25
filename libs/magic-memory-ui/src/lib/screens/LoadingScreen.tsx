import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";

import BackgroundWrapper from "../components/BackgroundWrapper";
import BackIcon from "../../icons/BackIcon";
import globalStyles from "../styles/global-styles";
import styles from "./LoadingScreen.styles";
import { GAME_LEVELS } from "./LevelSelect";

type RootStackParamList = {
  MagicMemorySplashScreen: undefined;
  MagicMemoryLoadingScreen: undefined;
  LevelSelect: undefined;
  MagicMemoryGameScreen: { age: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LoadingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const width = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Чистая функция перехода
  const goToLevelSelect = () => {
    // navigation.replace("LevelSelect");

    navigation.replace('MagicMemoryGameScreen', { age: GAME_LEVELS[0].cards });
  };

  useEffect(() => {
    // Запуск анимации прогресса
    width.value = withTiming(420, { duration: 2000 }, () => {
      runOnJS(goToLevelSelect)();
    });

    // Запуск анимации песочных часов
    rotation.value = withRepeat(
      withSequence(
        withTiming(180, { duration: 1000, easing: Easing.linear }),
        withTiming(0, { duration: 0 }),
        withTiming(180, { duration: 1000, easing: Easing.linear }),
        withTiming(0, { duration: 0 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  const hourglassRotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <BackgroundWrapper>
      <StatusBar hidden={true} />

      {/* Кнопка Back */}
      <TouchableOpacity
        onPress={() => navigation.replace('MagicMemorySplashScreen')}
        style={[globalStyles.roundButton.topLeft, styles.customBackPosition]}
      >
        <BackIcon style={{ alignSelf: "center" }} />
      </TouchableOpacity>

      {/* Прогрессбар */}
      <View style={styles.progressContainer}>
        <LinearGradient
          colors={["#e2dce7ff", "#7500D1"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientBorder}
        >
          <View style={styles.innerBackground}>
            <Animated.View style={[styles.progressFill, animatedStyle]} />
          </View>
        </LinearGradient>

        {/* Текст и песочные часы */}
        <View style={styles.loadingTextWrapper}>
          <Animated.Image
            source={require("../../assets/hourglass.png")}
            style={[styles.hourglass, hourglassRotationStyle]}
            resizeMode="contain"
          />
          <Text style={styles.loadingText}>Loading ...</Text>
        </View>
      </View>
    </BackgroundWrapper>
  );
};

export default LoadingScreen;
