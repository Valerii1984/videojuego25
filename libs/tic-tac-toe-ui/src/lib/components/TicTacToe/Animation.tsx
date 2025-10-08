import React, { useRef, useEffect } from "react";
import { Animated, StyleSheet, Dimensions, Easing, View } from "react-native";
import Star from "../../assets/svg/star";
import WhiteStar from "../../assets/svg/whiteStart";

const { width } = Dimensions.get("window");
const CELL_SIZE = Math.floor(width / 12);

// Компонент для анимации победы с золотистым свечением
export const VictoryGlow: React.FC = () => {
  const glow = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: CELL_SIZE / 2,
          backgroundColor: "#F3B63A", // золотистый свет
          opacity: glow,
        },
      ]}
    />
  );
};

// Компонент для анимации появления ячейки
export const CellAppearAnimation: React.FC<{ delay?: number }> = ({
  delay = 0,
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
};

// Компонент для анимации пульсации
export const PulseAnimation: React.FC<{ color?: string }> = ({
  color = "#4CAF50",
}) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: CELL_SIZE / 2,
          backgroundColor: color,
          opacity: 0.3,
          transform: [{ scale: pulse }],
        },
      ]}
    />
  );
};

// Компонент для анимации вращения
export const RotationAnimation: React.FC = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        {
          borderRadius: CELL_SIZE / 2,
          borderWidth: 2,
          borderColor: "#FFD700",
          transform: [{ rotate: spin }],
        },
      ]}
    />
  );
};

// ===== PlayerAvatar extracted animations =====

// Animated star that flies away and fades
export const AnimatedStar: React.FC<{
  isActive: boolean;
  onComplete: () => void;
  isFirstPlayer: boolean;
  avatarSize?: number;
}> = ({ isActive, onComplete, isFirstPlayer, avatarSize = 60 }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = 60 + Math.random() * 40;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      translateX.setValue(0);
      translateY.setValue(0);
      rotate.setValue(0);
      opacity.setValue(1);

      Animated.parallel([
        Animated.timing(translateX, {
          toValue: dx,
          duration: 2000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: dy,
          duration: 2000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => onComplete(), 0);
      });
    }
  }, [isActive]);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  if (!isActive) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: avatarSize / 2 - 10,
        left: avatarSize / 2 - 10,
        transform: [{ translateX }, { translateY }, { rotate: spin }],
        opacity,
        zIndex: 805,
      }}
    >
      {isFirstPlayer ? (
        <Star width={20} height={20} />
      ) : (
        <View style={{ width: 20, height: 20 }}>
          <WhiteStar />
        </View>
      )}
    </Animated.View>
  );
};

// Hook for blinking opacity
export const useBlinkingOpacity = (
  isActive: boolean,
  options?: { lowOpacity?: number; durationMs?: number }
) => {
  const { lowOpacity = 0.3, durationMs = 500 } = options || {};
  const blinkingOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkingOpacity, {
            toValue: lowOpacity,
            duration: durationMs,
            useNativeDriver: true,
          }),
          Animated.timing(blinkingOpacity, {
            toValue: 1,
            duration: durationMs,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      blinkingOpacity.setValue(1);
    }
  }, [isActive, lowOpacity, durationMs]);

  return blinkingOpacity;
};

// Hook for looping rotation value
export const useLoopingRotation = (
  isActive: boolean,
  options?: { durationMs?: number }
) => {
  const { durationMs = 6000 } = options || {};
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      rotation.setValue(0);
      Animated.loop(
        Animated.timing(rotation, {
          toValue: 1,
          duration: durationMs,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotation.setValue(0);
    }
  }, [isActive, durationMs]);

  return rotation;
};

// Hook for spawning/removing flying stars
export const useAvatarStars = (
  isActive: boolean,
  options?: {
    maxStars?: number;
    minIntervalMs?: number;
    maxIntervalMs?: number;
  }
) => {
  const {
    maxStars = 5,
    minIntervalMs = 500,
    maxIntervalMs = 1500,
  } = options || {};
  const [activeStars, setActiveStars] = React.useState<number[]>([]);
  const [starTriggers, setStarTriggers] = React.useState<number[]>([]);
  const starCounter = useRef(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(
        () => {
          setActiveStars((prev) => {
            if (prev.length >= maxStars) return prev;
            const newStarId = starCounter.current++;
            setStarTriggers((t) => [...t, newStarId]);
            return [...prev, newStarId];
          });
        },
        minIntervalMs + Math.random() * (maxIntervalMs - minIntervalMs)
      );

      return () => clearInterval(interval);
    } else {
      setActiveStars([]);
      setStarTriggers([]);
    }
    return undefined;
  }, [isActive, maxStars, minIntervalMs, maxIntervalMs]);

  const removeStar = (starId: number) => {
    setActiveStars((prev) => prev.filter((id) => id !== starId));
    setStarTriggers((prev) => prev.filter((id) => id !== starId));
  };

  return { activeStars, starTriggers, removeStar };
};

// Экспорт по умолчанию для обратной совместимости
export default VictoryGlow;
