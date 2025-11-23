import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Confetti from "./litlecomponent/Confeti";
import { Player } from "../../types/tic-tac-toe";

const { width, height } = Dimensions.get("window");

/** ── i18n: как в Magic Memory ─────────────────────────────────────────── */

type LocaleTag =
  | "en-US"
  | "de-DE"
  | "es-ES"
  | "es-419"
  | "fr-FR"
  | "it-IT"
  | "pt-BR"; // pl-PL — TBD

/** Любой вход → в наши теги; pl → en-US (TBD) */
const normalizeLocale = (raw?: string): LocaleTag => {
  const s = (raw || "").toLowerCase().replace("_", "-");
  if (s.startsWith("de")) return "de-DE";
  if (s === "es-419") return "es-419";
  if (s.startsWith("es")) return "es-ES";
  if (s.startsWith("fr")) return "fr-FR";
  if (s.startsWith("it")) return "it-IT";
  if (s === "pt-br" || s.startsWith("pt")) return "pt-BR";
  // pl-PL (или pl) пока не поддерживаем — откатываем на en-US
  return "en-US";
};

type TKey = "win" | "lose" | "draw" | "playAgain";

const STR: Record<LocaleTag, Record<TKey, string>> = {
  "en-US": {
    win: "Congratulations!",
    lose: "You Lose",
    draw: "It's a draw!",
    playAgain: "Play Game Again",
  },
  "de-DE": {
    win: "Glückwunsch!",
    lose: "Du hast verloren",
    draw: "Unentschieden!",
    playAgain: "Nochmal spielen",
  },
  "es-ES": {
    win: "¡Felicidades!",
    lose: "Has perdido",
    draw: "¡Empate!",
    playAgain: "Jugar de nuevo",
  },
  "es-419": {
    win: "¡Felicidades!",
    lose: "Perdiste",
    draw: "¡Empate!",
    playAgain: "Jugar otra vez",
  },
  "fr-FR": {
    win: "Félicitations !",
    lose: "Vous avez perdu",
    draw: "Match nul !",
    playAgain: "Rejouer",
  },
  "it-IT": {
    win: "Congratulazioni!",
    lose: "Hai perso",
    draw: "Pareggio!",
    playAgain: "Gioca di nuovo",
  },
  "pt-BR": {
    win: "Parabéns!",
    lose: "Você perdeu",
    draw: "Empate!",
    playAgain: "Jogar novamente",
  },
};

/** ── пропсы ───────────────────────────────────────────────────────────── */

interface GameOverScreenProps {
  winner: Player | "draw" | null;
  gameComplete: boolean;
  winGif: any;
  onPlayAgain: () => void;
  animatedStyle: any;
  onPauseBackground?: () => void;
  onResumeBackground?: () => void;
  /** принимает en-US/de-DE/.../pt-BR (pl-PL → упадёт в en-US) */
  lang?: string;
}

/** ── основной экран ───────────────────────────────────────────────────── */

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  winner,
  gameComplete,
  winGif,
  onPlayAgain,
  animatedStyle,
  onPauseBackground,
  onResumeBackground,
  lang = "en-US",
}) => {
  const locale = normalizeLocale(lang);
  const T = STR[locale];

  const [showVictoryEffects, setShowVictoryEffects] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const contentScale = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const runIdRef = useRef(0);

  const { message, showWinGif } = useMemo(() => {
    if (winner === "X") return { message: T.win, showWinGif: true };
    if (winner === "O") return { message: T.lose, showWinGif: false };
    if (winner === "draw") return { message: T.draw, showWinGif: false };
    return { message: "", showWinGif: false };
  }, [winner, T]);

  const clearTimersAndSound = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // контент/конфетти
  useEffect(() => {
    if (!gameComplete) {
      //clearTimersAndSound();
      setShowVictoryEffects(false);
      setShowContent(false);
      contentScale.setValue(0);
      return;
    }

    const myRunId = ++runIdRef.current;

    onPauseBackground?.(); // приглушили фон

    const readyFallback = setTimeout(() => {
      if (runIdRef.current !== myRunId) return;

      if (winner === "X") setShowVictoryEffects(true);

      setShowContent(true);

      Animated.spring(contentScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }, 300);

    timersRef.current.push(readyFallback);

    return () => {
      clearTimersAndSound();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameComplete]);

  // Пульс кнопки
  useEffect(() => {
    if (gameComplete) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(buttonScale, {
            toValue: 1.08,
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
                <Text
                  style={styles.gameOverText}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.6}
                >
                  {message}
                </Text>
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
                  onResumeBackground?.(); // вернули фон
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
    paddingHorizontal: 16,
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
    maxWidth: Math.min(width * 0.9, 820),
    alignSelf: "center",
  },
  gameOverText: {
    color: "#FFF",
    fontFamily: "FredokaExtraBold",
    fontSize: 64,
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
    lineHeight: Math.round(64 * 1.08),
    paddingHorizontal: 8,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    overflow: "visible",
  },
  playAgainButton: {
    backgroundColor: "#FFC965",
    borderWidth: 1,
    borderColor: "#C57CFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 30,
    minWidth: 260,
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
