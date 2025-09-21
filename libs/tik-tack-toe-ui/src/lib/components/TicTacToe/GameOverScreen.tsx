import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  View,
} from "react-native";
import { Player } from "../../types/tic-tac-toe";
import { Language } from "../../types/props";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { Image as ExpoImage } from "expo-image";
import Confetti from "./litlecomponent/Confeti";

const { width, height } = Dimensions.get("window");

const STR: Record<
  Language,
  { win: string; lose: string; draw: string; playAgain: string }
> = {
  en: {
    win: "Congratulations!",
    lose: "You Lose",
    draw: "It's a draw!",
    playAgain: "Play Game Again",
  },
  es: {
    win: "¡Felicidades!",
    lose: "Has perdido",
    draw: "¡Empate!",
    playAgain: "Jugar de nuevo",
  },
  pt: {
    win: "Parabéns!",
    lose: "Você perdeu",
    draw: "Empate!",
    playAgain: "Jogar novamente",
  },
  pl: {
    win: "Gratulacje!",
    lose: "Przegrałeś",
    draw: "Remis!",
    playAgain: "Zagraj ponownie",
  },
  uk: {
    win: "Вітаємо!",
    lose: "Ви програли",
    draw: "Нічия!",
    playAgain: "Грати ще раз",
  },
  de: {
    win: "Glückwunsch!",
    lose: "Du hast verloren",
    draw: "Unentschieden!",
    playAgain: "Nochmal spielen",
  },
  fr: {
    win: "Félicitations !",
    lose: "Vous avez perdu",
    draw: "Match nul !",
    playAgain: "Rejouer",
  },
  it: {
    win: "Congratulazioni!",
    lose: "Hai perso",
    draw: "Pareggio!",
    playAgain: "Gioca di nuovo",
  },
};

const HERO = {
  hero1: {
    anim: require("../../assets/hero/hero1/anim.webp"),
    voice: require("../../assets/hero/hero1/hero.m4a"),
  },
  hero2: {
    anim: require("../../assets/hero/hero2/anim.webp"),
    voice: require("../../assets/hero/hero2/hero.m4a"),
  },
  hero3: {
    anim: require("../../assets/hero/hero3/anim.webp"),
    voice: require("../../assets/hero/hero3/hero.m4a"),
  },
  hero4: {
    anim: require("../../assets/hero/hero4/anim.webp"),
    voice: require("../../assets/hero/hero4/hero.m4a"),
  },
  hero5: {
    anim: require("../../assets/hero/hero5/anim.webp"),
    voice: require("../../assets/hero/hero5/hero.m4a"),
  },
  hero6: {
    anim: require("../../assets/hero/hero6/anim.webp"),
    voice: require("../../assets/hero/hero6/hero.m4a"),
  },
} as const;

type HeroKey = keyof typeof HERO;

interface GameOverScreenProps {
  winner: Player | "draw" | null;
  gameComplete: boolean;
  winGif: any;
  onPlayAgain: () => void;
  animatedStyle: any;
  onPauseBackground?: () => void;
  onResumeBackground?: () => void;
  lang?: Language;
}

const HeroSticker: React.FC<{
  hero: HeroKey;
  size?: number;
  opacity?: number;
  onReady?: () => void; // <- сообщаем, когда картинка реально загрузилась
}> = ({ hero, size, opacity = 1, onReady }) => {
  const source = HERO[hero].anim;
  const base = Math.min(width, height) * 0.55;
  const clamped = Math.max(320, Math.min(base, 460));
  const finalSize = size ?? clamped;

  return (
    <ExpoImage
      source={source}
      style={{
        width: finalSize,
        height: finalSize,
        backgroundColor: "transparent",
        opacity,
      }}
      contentFit="contain"
      onLoadEnd={onReady}
    />
  );
};

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  winner,
  gameComplete,
  winGif,
  onPlayAgain,
  animatedStyle,
  onPauseBackground,
  onResumeBackground,
  lang = "en",
}) => {
  const T = STR[lang] ?? STR.en;

  const [showVictoryEffects, setShowVictoryEffects] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showHero, setShowHero] = useState(false);
  const [heroKey, setHeroKey] = useState<HeroKey | null>(null);
  const [heroReady, setHeroReady] = useState(false); // <- флаг готовности изображения

  const contentScale = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const soundRef = useRef<Audio.Sound | null>(null);
  const runIdRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // сколько держим героя на экране до появления поздравления
  const ROBOT_MS = 2800;

  const chooseHero = useMemo<HeroKey | null>(() => {
    if (!gameComplete || winner == null) return null;
    if (winner === "X") return Math.random() < 0.5 ? "hero1" : "hero2";
    if (winner === "draw") return Math.random() < 0.5 ? "hero3" : "hero4";
    return Math.random() < 0.5 ? "hero5" : "hero6";
  }, [gameComplete, winner]);

  const { message, showWinGif } = useMemo(() => {
    if (winner === "X") return { message: T.win, showWinGif: true };
    if (winner === "O") return { message: T.lose, showWinGif: false };
    if (winner === "draw") return { message: T.draw, showWinGif: false };
    return { message: "", showWinGif: false };
  }, [winner, T]);

  const clearTimersAndSound = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    if (soundRef.current) {
      soundRef.current.stopAsync().catch(() => {});
      soundRef.current.unloadAsync().catch(() => {});
      soundRef.current = null;
    }
  };

  // Основной цикл показа: показать героя -> (подождать ROBOT_MS) -> показать контент/конфетти
  useEffect(() => {
    if (!gameComplete) {
      clearTimersAndSound();
      setShowVictoryEffects(false);
      setShowContent(false);
      setShowHero(false);
      setHeroKey(null);
      setHeroReady(false);
      contentScale.setValue(0);
      return;
    }

    const myRunId = ++runIdRef.current;

    if (chooseHero) setHeroKey(chooseHero);

    onPauseBackground?.();
    setShowHero(true);
    setHeroReady(false); // ждем фактическую загрузку кадра

    // Фолбэк: если по какой-то причине onLoadEnd не пришел — не зависаем
    const readyFallback = setTimeout(() => {
      setHeroReady((prev) => prev || true);
    }, 800);
    timersRef.current.push(readyFallback);

    // Через ROBOT_MS скрываем героя и показываем финальный экран/конфетти
    const contentTimer = setTimeout(() => {
      if (runIdRef.current !== myRunId) return;
      setShowHero(false);
      if (winner === "X") setShowVictoryEffects(true);

      setShowContent(true);
      Animated.spring(contentScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, ROBOT_MS);
    timersRef.current.push(contentTimer);

    return () => {
      clearTimersAndSound();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameComplete, chooseHero]);

  // 🔊 Старт голоса — только после того, как герой реально загрузился и показан
  useEffect(() => {
    if (!gameComplete || !chooseHero || !showHero || !heroReady) return;

    const myRunId = runIdRef.current;
    const voiceTimer = setTimeout(async () => {
      if (runIdRef.current !== myRunId) return;
      try {
        const { sound } = await Audio.Sound.createAsync(
          HERO[chooseHero].voice,
          {
            shouldPlay: true,
            volume: 1.0,
          }
        );
        if (runIdRef.current !== myRunId) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
        await sound.playAsync();
      } catch {}
    }, 120); // маленькая пауза после onLoadEnd, чтобы кадр гарантированно оказался на экране
    timersRef.current.push(voiceTimer);

    return () => {
      // очищаемся в общем clearTimersAndSound
    };
  }, [gameComplete, chooseHero, showHero, heroReady]);

  // Пульсация кнопки
  useEffect(() => {
    if (gameComplete) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(buttonScale, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      buttonScale.setValue(1);
    }
  }, [gameComplete, buttonScale]);

  if (!gameComplete) return null;

  return (
    <Animated.View
      style={[styles.container, animatedStyle]}
      pointerEvents="box-none"
    >
      {/* Робот — слой без перехвата тачей */}
      {showHero && heroKey && (
        <View style={styles.heroWrap} pointerEvents="none">
          <HeroSticker hero={heroKey} onReady={() => setHeroReady(true)} />
        </View>
      )}

      {/* Конфетти */}
      {showVictoryEffects && (
        <View style={styles.confettiWrap} pointerEvents="none">
          <Confetti level={1} isActive={true} />
        </View>
      )}

      {/* Сообщение + кнопка */}
      {showContent && (
        <View style={styles.contentWrap} pointerEvents="auto">
          <Animated.View style={{ transform: [{ scale: contentScale }] }}>
            <LinearGradient
              colors={["rgba(125,34,241,0)", "#7D22F1", "rgba(125,34,241,0)"]}
              locations={[0.1, 0.5, 0.9]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientTextContainer}
            >
              <View style={styles.centeredTextWrapper}>
                <Text style={styles.gameOverText}>{message}</Text>
              </View>
            </LinearGradient>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
              <TouchableOpacity
                testID="play-again-button"
                style={styles.playAgainButton}
                activeOpacity={0.85}
                onPress={() => {
                  clearTimersAndSound();
                  runIdRef.current++;
                  onResumeBackground?.();
                  onPlayAgain();
                }}
              >
                <Text style={styles.playAgainText}>{T.playAgain}</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      )}

      {/* Победная подложка */}
      {showContent && showWinGif && (
        <View style={styles.lottieUnderlay} pointerEvents="none">
          <LottieView
            source={winGif}
            autoPlay
            loop
            style={styles.winGif}
            speed={0.5}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  heroWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    backgroundColor: "transparent",
  },
  confettiWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  contentWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  gradientTextContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  centeredTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
    minWidth: 400,
  },
  gameOverText: {
    fontFamily: "Fredoka",
    fontWeight: "600",
    width: "100%",
    fontSize: 48,
    height: 50,
    color: "white",
    textAlign: "center",
    lineHeight: 38,
    letterSpacing: 0,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playAgainButton: {
    backgroundColor: "#FFC965",
    borderWidth: 1,
    borderColor: "#C57CFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    width: 300,
    alignSelf: "center",
    alignItems: "center",
  },
  playAgainText: {
    color: "#C57CFF",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  lottieUnderlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  winGif: { width: width * 1.6, height: 300 },
});

export default GameOverScreen;
