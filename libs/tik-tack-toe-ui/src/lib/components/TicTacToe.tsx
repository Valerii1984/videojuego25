import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Image,
  Text,
  Easing,
  ImageBackground,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { StoreIcon } from "../assets/svg/store-icon";
import { LinearGradient } from "expo-linear-gradient";
import BackIcon from "../assets/svg/back-icon";
import type { TicTacToeProps } from "../types/tic-tac-toe";
import GameBoard from "./TicTacToe/GameBoard";
import PlayerAvatar from "./TicTacToe/PlayerAvatar";
import GameOverScreen from "./TicTacToe/GameOverScreen";
import StartScreen from "./TicTacToe/StartScreen";
import { useTicTacToeGame } from "../hooks/useTicTacToeGame";
import { useTicTacToeAnimations } from "../hooks/useTicTacToeAnimations";
import { useSound } from "../hooks/useSound";

const DEFAULTS = {
  backgroundImage:
    require("../assets/WTP_BGS_ALL_0048.png") as ImageSourcePropType,
  name1: "Player 1",
  name2: "Player 2",
  photo1: require("../assets/6.png") as ImageSourcePropType,
  photo2: require("../assets/81.png") as ImageSourcePropType,
  winGif:
    require("../assets/animations/success-animation.json") as ImageSourcePropType,
  lang: "en",
};

const resolveImage = (src?: string | ImageSourcePropType) =>
  typeof src === "string" ? { uri: src } : src;

const TicTacToe: React.FC<TicTacToeProps> = (props) => {
  const {
    // новый внешний конфиг
    lang = "en",
    background,
    userAvatar,
    enemyCard,

    // совместимость со старым
    backgroundImage = DEFAULTS.backgroundImage,
    name1 = DEFAULTS.name1,
    name2 = DEFAULTS.name2,
    photo1 = DEFAULTS.photo1,
    photo2 = DEFAULTS.photo2,
    winGif = DEFAULTS.winGif,
  } = props;

  // фон: приоритет URL (background)
  const resolvedBackground = background
    ? { uri: background }
    : resolveImage(backgroundImage);

  // аватары: приоритет URL (userAvatar/enemyCard), затем старые поля
  const resolvedPhoto1 = userAvatar
    ? { uri: userAvatar }
    : resolveImage(photo1);
  const resolvedPhoto2 = enemyCard ? { uri: enemyCard } : resolveImage(photo2);

  const [moveCount, setMoveCount] = useState(0);
  const [boardHeight, setBoardHeight] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isLoadingStory, setIsLoadingStory] = useState<boolean>(false);
  const [storyLoaded, setStoryLoaded] = useState<boolean>(false);

  const introAnim = useRef(new Animated.Value(0)).current;
  const storyProgressAnimation = useRef(new Animated.Value(0)).current;
  const storyLoadingIconRotation = useRef(new Animated.Value(0)).current;

  const {
    playBackgroundMusic,
    stopBackgroundMusic,
    playNotificationSound,
    playVictorySound,
    playSadGameSound,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
  } = useSound();

  const {
    isGameStarted,
    setIsGameStarted,
    gameState,
    bestMove,
    gameComplete,
    handleCellPress,
    undoLastTwoMoves,
    resetGame,
  } = useTicTacToeGame(playNotificationSound);

  const {
    player1Style,
    player2Style,
    gameContainerStyle,
    congratsContainerStyle,
    backIconStyle,
    undoButtonStyle,
    playButtonStyle,
    animateBackIcon,
    animateUndoButton,
    animatePlayButton,
    resetAnimations,
  } = useTicTacToeAnimations(
    gameState.currentPlayer,
    gameState.winner,
    gameComplete
  );

  const handleResetGame = () => {
    resetGame();
    resetAnimations();
    hintScale.setValue(1);
    setShowHint(false);
    setIsLoadingStory(false);
    setStoryLoaded(false);
    setIsGameStarted(true);
    storyProgressAnimation.setValue(0);
    storyLoadingIconRotation.setValue(0);
    playBackgroundMusic();
  };

  useEffect(() => {
    if (hasStarted) {
      introAnim.setValue(0);
      Animated.timing(introAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        resetAnimations();
      });
    }
  }, [hasStarted, introAnim, resetAnimations]);

  const ellipseTranslateY = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current;
  const ellipseOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hasStarted) {
      Animated.parallel([
        Animated.timing(ellipseTranslateY, {
          toValue: 0,
          duration: 1500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(ellipseOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      ellipseTranslateY.setValue(Dimensions.get("window").height);
      ellipseOpacity.setValue(0);
    }
  }, [hasStarted, ellipseTranslateY, ellipseOpacity]);

  useEffect(() => {
    (async () => {
      try {
        const SO = await import("expo-screen-orientation");
        if (hasStarted) {
          await SO.lockAsync(SO.OrientationLock.LANDSCAPE);
        } else {
          await SO.unlockAsync();
        }
      } catch {}
    })();
  }, [hasStarted]);

  useEffect(() => {
    if (hasStarted && !storyLoaded) {
      setIsLoadingStory(true);
      storyProgressAnimation.setValue(0);
      storyLoadingIconRotation.setValue(0);

      const rotationLoop = Animated.loop(
        Animated.timing(storyLoadingIconRotation, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        })
      );
      rotationLoop.start();

      const progressLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(storyProgressAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: false,
            easing: Easing.linear,
          }),
          Animated.timing(storyProgressAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: false,
          }),
        ])
      );
      progressLoop.start();

      return () => {
        rotationLoop.stop();
        progressLoop.stop();
      };
    }
    return undefined;
  }, [
    hasStarted,
    storyLoaded,
    storyLoadingIconRotation,
    storyProgressAnimation,
  ]);

  const storyProgressWidth = storyProgressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const handlePlayStory = () => {
    console.log("Playing story...");
  };

  const introStyle = {
    opacity: introAnim,
    transform: [
      {
        translateY: introAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  const hintScale = useRef(new Animated.Value(1)).current;
  const hintAnimatedStyle = {
    transform: [{ scale: hintScale }],
    opacity: 1,
  };
  const animateHintButton = (toValue: number) => {
    Animated.timing(hintScale, {
      toValue,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handleBackToStart = () => {
    Animated.timing(introAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      handleResetGame();
      setHasStarted(false);
      setIsGameStarted(false);
      introAnim.setValue(0);
      resetAnimations();
      setIsLoadingStory(false);
      setStoryLoaded(false);
      storyProgressAnimation.setValue(0);
      storyLoadingIconRotation.setValue(0);
      stopBackgroundMusic();
    });
  };

  return (
    <ImageBackground
      source={resolvedBackground}
      style={styles.container}
      testID="tic-tac-toe-game"
    >
      <Animated.View
        style={[
          styles.gameContainer,
          hasStarted ? introStyle : null,
          gameContainerStyle,
        ]}
        testID="game-content"
      >
        <View>
          {/* ДУГА */}
          <Animated.Image
            source={require("../assets/ellipse.png")}
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              width: "100%",
              height: Dimensions.get("window").height,
              resizeMode: "cover",
              zIndex: 0,
              opacity: ellipseOpacity,
              transform: [{ translateY: ellipseTranslateY }],
            }}
          />

          <Animated.View
            style={[
              styles.playersContainer,
              { transform: [{ translateY: ellipseTranslateY }] },
            ]}
          >
            <View style={{ marginRight: 20 }}>
              <PlayerAvatar
                photo={resolvedPhoto1}
                name={name1}
                player="X"
                currentPlayer={gameState.currentPlayer}
                winner={gameState.winner}
                animatedStyle={player1Style}
                testID="player1-container"
                boardHeight={boardHeight}
                isFirstPlayer={true}
              />
            </View>

            <GameBoard
              board={gameState.board}
              onCellPress={handleCellPress}
              winningLine={gameState.winningLine}
              bestMove={bestMove}
              photo1={resolvedPhoto1}
              photo2={resolvedPhoto2}
              onMoveCountChange={setMoveCount}
              onLayout={(e) => setBoardHeight(e.nativeEvent.layout.height)}
              showHint={showHint}
              onHintUsed={() => setShowHint(false)}
              onVictory={playVictorySound}
              onBotVictory={() => playSadGameSound()}
            />

            <View style={{ marginLeft: 20 }}>
              <PlayerAvatar
                photo={resolvedPhoto2}
                name={name2}
                player="O"
                currentPlayer={gameState.currentPlayer}
                winner={gameState.winner}
                animatedStyle={player2Style}
                testID="player2-container"
                boardHeight={boardHeight}
                isFirstPlayer={false}
              />
            </View>
          </Animated.View>
        </View>

        {/* Top bar */}
        <View style={styles.topBar} pointerEvents="box-none">
          <Animated.View style={[styles.backButton, backIconStyle]}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => animateBackIcon(0.9)}
              onPressOut={() => {
                animateBackIcon(1);
                setHasStarted(false);
                setIsGameStarted(false);
              }}
            >
              <BackIcon />
            </TouchableOpacity>
          </Animated.View>

          {!!lang && (
            <View style={styles.centerTopBar}>
              <Text style={{ color: "#fff", fontFamily: "Fredoka" }}>
                {lang.toUpperCase()}
              </Text>
            </View>
          )}

          <Animated.View style={[styles.hintButton, hintAnimatedStyle]}>
            <TouchableOpacity
              activeOpacity={1}
              onPressIn={() => animateHintButton(0.9)}
              onPressOut={() => animateHintButton(1)}
              onPress={() => setShowHint(true)}
            >
              <View style={styles.hintGlow}>
                <View style={styles.hintBorder}>
                  <LinearGradient
                    colors={["#FFB380", "#D16C00"]}
                    style={styles.hintButtonInner}
                  >
                    <Text style={styles.hintText}>?</Text>
                  </LinearGradient>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>

      <GameOverScreen
        winner={gameState.winner}
        gameComplete={gameComplete}
        winGif={resolveImage(winGif)}
        onPlayAgain={handleResetGame}
        animatedStyle={congratsContainerStyle}
        onPauseBackground={pauseBackgroundMusic}
        onResumeBackground={resumeBackgroundMusic}
      />

      {!hasStarted && (
        <View style={styles.startScreenContainer}>
          <StartScreen
            onStart={() => {
              setHasStarted(true);
              setIsGameStarted(true);
              handleResetGame();
            }}
            playButtonStyle={playButtonStyle}
            animatePlayButton={animatePlayButton}
            onStartBackgroundMusic={playBackgroundMusic}
          />
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", height: "100%" },
  gameContainer: { flex: 1, justifyContent: "center", height: "80%" },
  playersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginTop: "10%",
  },
  startScreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(18, 18, 18, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    top: 34,
    left: 30,
    zIndex: 1000,
  },
  centerTopBar: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 50,
    transform: [{ translateY: -26 }],
    top: 54,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 980,
  },
  hintButton: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    top: 34,
    right: 30,
  },
  hintGlow: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 14,
    shadowColor: "rgba(144, 33, 232, 0.8)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
  },
  hintBorder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "rgba(255, 229, 124, 1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1002,
    backgroundColor: "transparent",
  },
  hintButtonInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  hintText: {
    color: "#FFF",
    fontSize: 18,
    fontFamily: "FredokaSemiBold",
    textAlign: "center",
  },
});

export default TicTacToe;
