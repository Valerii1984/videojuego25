import React, { useEffect, useRef, memo } from "react";
import { TouchableOpacity, Image, Animated, ViewStyle } from "react-native";
import images from "../utils/imageMap";
import { Card } from "../types/index";
import styles from "./Card.styles";

interface CardProps {
  item: Card;
  onPress: (id: number) => void;
  getCardSize: () => number;
  disabled?: boolean;
  isHinted?: boolean;
  style?: ViewStyle;
  backImage: any;
  frontImage: any;
}

// Цвета для группы facecard
const facecardBackgroundColors: Record<string, string> = {
  boy: "#00FF00",
  donkey: "#FFFF00",
  girl: "#FF69B4",
  kengoo: "#90EE90",
  owl: "#800080",
  pig: "#8B4513",
  puh: "#FF0000",
  tigr: "#00B7EB",
};

const MemoryCard: React.FC<CardProps> = memo(
  ({
    item,
    onPress,
    getCardSize,
    disabled = false,
    isHinted = false,
    style,
    backImage,
    frontImage,
  }) => {
    const cardSize = getCardSize();

    const animatedValue = useRef(new Animated.Value(0)).current;
    const hintOpacity = useRef(new Animated.Value(0)).current;
    const matchedBorderAnimated = useRef(new Animated.Value(0)).current;
    const cardOpacity = useRef(new Animated.Value(1)).current;

    const prevIsHintedRef = useRef(isHinted);
    const prevIsMatchedRef = useRef(item.isMatched);
    const prevIsHiddenRef = useRef(item.isHidden);

    const flipToFront = () => {
      Animated.timing(animatedValue, {
        toValue: 180,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    const flipToBack = () => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    const animateHint = () => {
      Animated.sequence([
        Animated.timing(hintOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(hintOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };

    useEffect(() => {
      if (item.isFlipped || item.isMatched) {
        flipToFront();
      } else {
        flipToBack();
      }
    }, [item.isFlipped, item.isMatched]);

    useEffect(() => {
      if (
        isHinted &&
        !item.isFlipped &&
        !item.isMatched &&
        !prevIsHintedRef.current
      ) {
        animateHint();
      } else if (
        prevIsHintedRef.current &&
        (!isHinted || item.isFlipped || item.isMatched)
      ) {
        Animated.timing(hintOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
      prevIsHintedRef.current = isHinted;
    }, [isHinted, item.isFlipped, item.isMatched]);

    useEffect(() => {
      if (item.isMatched && !prevIsMatchedRef.current) {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(matchedBorderAnimated, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(cardOpacity, {
              toValue: 0,
              duration: 2000,
              useNativeDriver: true,
            }),
          ]).start();
        }, 500);
      } else if (item.isHidden && !prevIsHiddenRef.current) {
        Animated.parallel([
          Animated.timing(cardOpacity, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(matchedBorderAnimated, {
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

    const resolvedBackImage = backImage || images["card-1"];
    const imageSource = frontImage || resolvedBackImage;

    const frontBackgroundColor =
      facecardBackgroundColors[item.value] || "#FFFFFF";

    return (
      <Animated.View style={{ opacity: cardOpacity }}>
        <TouchableOpacity
          style={[styles.card, { width: cardSize, height: cardSize }, style]}
          onPress={() => !disabled && onPress(item.id)}
          disabled={disabled}
          activeOpacity={1}
        >
          {/* Фиолетовая рамка совпадения */}
          {item.isMatched && (
            <Animated.View
              pointerEvents="none"
              style={{
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
              }}
            />
          )}

          {/* Передняя сторона */}
          <Animated.View
            style={[
              styles.cardSide,
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
            ]}
          >
            {/* Голубая рамка поверх передней стороны */}
            {!item.isMatched && (
              <Animated.View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 10,
                  borderColor: "#1780DB",
                  borderWidth: 4,
                  zIndex: 2,
                }}
              />
            )}
            <Image
              source={imageSource}
              style={[styles.cardImage, { width: cardSize, height: cardSize }]}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Оранжевая рамка-подсказка */}
          {isHinted && !item.isFlipped && !item.isMatched && (
            <Animated.View
              style={{
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
              }}
            />
          )}

          {/* Задняя сторона */}
          <Animated.View
            style={[
              styles.cardSide,
              styles.cardBackFace,
              {
                width: cardSize,
                height: cardSize,
                transform: [{ rotateY: backInterpolate }],
                backfaceVisibility: "hidden",
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                zIndex: 0,
              },
            ]}
          >
            {/* Голубая рамка поверх задней стороны */}
            {!item.isMatched && (
              <Animated.View
                pointerEvents="none"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 10,
                  borderColor: "#1780DB",
                  borderWidth: 4,
                  zIndex: 2,
                }}
              />
            )}
            <Image
              source={resolvedBackImage}
              style={[styles.cardImage, { width: cardSize, height: cardSize }]}
              resizeMode="contain"
            />
            <Animated.View
              style={[styles.hintOverlay, { opacity: hintOpacity }]}
            >
              <Image
                source={resolvedBackImage}
                style={[
                  styles.cardImage,
                  { width: cardSize, height: cardSize },
                ]}
                resizeMode="contain"
              />
            </Animated.View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

export default MemoryCard;
