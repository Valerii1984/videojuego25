import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import BackgroundWrapper from "../components/BackgroundWrapper";
import BackIcon from "../../icons/BackIcon";
import globalStyles from "../styles/global-styles";
import styles from "./LevelSelect.styles";
import CardImage from "../../assets/card-1.jpg";
import FrameDecor from "../../assets/Frame_Type3_03_Decor1.png";
import GroupImage from "../../assets/Group1359.png"; // фон под карточками
import { RootParamList } from "../types/index";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

export const GAME_LEVELS = [
  { cards: 4, difficulty: "Very Easy" },
  { cards: 6, difficulty: "Easy" },
  { cards: 8, difficulty: "Normal" },
  { cards: 10, difficulty: "Hard" },
  { cards: 12, difficulty: "Very Hard" },
];

// ================= LevelCard =================
const LevelCard = ({
  cards,
  difficulty,
  index,
  isSelected,
  onPress,
  cardWidth,
  cardHeight,
}: {
  cards: number;
  difficulty: string;
  index: number;
  isSelected: boolean;
  onPress: () => void;
  cardWidth: number;
  cardHeight: number;
}) => {
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

  return (
    <TouchableOpacity
      key={index}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.levelCard, { width: cardWidth }]}
      activeOpacity={1}
    >
      <Animated.View style={animatedStyle}>
        <Image
          source={FrameDecor}
          style={{
            width: cardWidth + 25,
            height: cardHeight + 30,
            position: "absolute",
            top: -15,
            left: -10,
            zIndex: 1,
            opacity: 0.5,
          }}
        />
        <View
          style={[
            styles.cardBackground,
            { width: cardWidth, height: cardHeight },
            isSelected && styles.cardBackgroundSelected,
          ]}
        >
          <View style={styles.cardContent}>
            {numberImageSource && (
              <Image
                source={numberImageSource}
                style={{
                  ...styles.numberImage,
                  width: cards <= 8 ? 18 : 30,
                  height: 38,
                }}
              />
            )}
            <View style={styles.cardIconWrapper}>
              <Image source={CardImage} style={styles.cardIcon} />
              <View style={styles.cardIconBorder} />
            </View>
          </View>
        </View>
      </Animated.View>
      <Text style={styles.difficulty}>{difficulty}</Text>
    </TouchableOpacity>
  );
};

// ================= LevelSelectScreen =================
const LevelSelectScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const { width } = useWindowDimensions();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const levels = GAME_LEVELS;

  const handleLevelSelect = (index: number) => {
    const level = levels[index];
    setSelectedLevel(index);
    navigation.navigate("MagicMemoryGameScreen", { age: level.cards });
  };

  // Размер карточек
  const cardWidth = 100;
  const cardHeight = 90;
  const baseGap = 40;

  // Адаптивный gap
  const paddingHorizontal = width * 0.05;
  const gap = Math.max(
    15,
    Math.min(
      baseGap,
      (width - levels.length * cardWidth - 2 * paddingHorizontal) /
        (levels.length - 1) || baseGap
    )
  );

  const renderLevelItem = ({
    item,
    index,
  }: {
    item: { cards: number; difficulty: string };
    index: number;
  }) => (
    <LevelCard
      cards={item.cards}
      difficulty={item.difficulty}
      index={index}
      isSelected={selectedLevel === index}
      onPress={() => handleLevelSelect(index)}
      cardWidth={cardWidth}
      cardHeight={cardHeight}
    />
  );

  return (
    <BackgroundWrapper>
      <StatusBar hidden={true} />

      {/* Кнопка назад */}
      <TouchableOpacity
        onPress={() => navigation.navigate('MagicMemorySplashScreen')}
        style={[globalStyles.roundButton.topLeft, styles.backButton]}
      >
        <BackIcon style={{ alignSelf: "center" }} />
      </TouchableOpacity>

      <Text style={[styles.title, { marginTop: 0 }]}>CHOOSE DIFFICULTY</Text>

      <View
        style={{
          position: "relative",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 0,
        }}
      >
        {/* Адаптивный фон */}
        <Image
          source={GroupImage}
          style={{
            position: "absolute",
            bottom: 25, // оставляем привязку снизу
            left: -40,
            width: width + 130,
            height: 160, // фикс вместо width * 0.22
            resizeMode: "stretch",
          }}
        />

        {/* Список уровней */}
        <FlatList
          data={levels}
          renderItem={renderLevelItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            paddingTop: 10,
            paddingBottom: 0,
            paddingLeft: paddingHorizontal,
            paddingRight: paddingHorizontal - 10,
            gap,
            justifyContent: "center",
          }}
          style={{ zIndex: 1, flexGrow: 0, overflow: "visible" }}
        />
      </View>
    </BackgroundWrapper>
  );
};

export default LevelSelectScreen;
