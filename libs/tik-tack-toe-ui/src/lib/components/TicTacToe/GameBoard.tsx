import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  useWindowDimensions,
  Animated,
  StyleProp,
  ImageStyle,
  ImageSourcePropType,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Board, Player } from "../../types/tic-tac-toe";

import {
  VictoryGlow,
  AnimatedStar,
  useLoopingRotation,
  useAvatarStars,
} from "./Animation";
import { StarAdvise } from "../../assets/svg/star-advise";

type AnimatedAvatarProps = {
  source: ImageSourcePropType;
  row: number;
  col: number;
  style?: StyleProp<ImageStyle>;
  cellSize: number;
  instant?: boolean;
};

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({
  source,
  row,
  col,
  style,
  cellSize,
  instant = false,
}) => {
  const scale = useRef(new Animated.Value(instant ? 1 : 1.2)).current;
  const translateX = useRef(
    new Animated.Value(
      instant ? 0 : col === 0 ? -cellSize * 0.8 : col === 2 ? cellSize * 0.8 : 0
    )
  ).current;
  const opacity = useRef(new Animated.Value(instant ? 1 : 0)).current;

  const handleLoad = () => {
    if (instant) return;
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 35,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.Image
      source={source}
      onLoad={handleLoad}
      style={[
        styles.cellImage,
        style,
        {
          opacity,
          transform: [{ translateX }, { scale }],
          borderRadius: (cellSize * 0.8) / 2,
          zIndex: 2,
        },
      ]}
    />
  );
};

interface GameBoardProps {
  board: Board;
  onCellPress: (row: number, col: number) => void;
  winningLine: number[][] | null;
  bestMove: number[] | null;
  photo1: ImageSourcePropType;
  photo2: ImageSourcePropType;
  onLayout?: (event: any) => void;
  onMoveCountChange?: (count: number) => void;
  showHint: boolean;
  onHintUsed: () => void;
  onVictory?: () => void;
  onBotVictory?: () => void;
  suppressContent?: boolean;
  roundKey?: number;
  style?: StyleProp<ViewStyle>;
}

const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellPress,
  winningLine,
  bestMove,
  photo1,
  photo2,
  onLayout,
  onMoveCountChange,
  showHint,
  onHintUsed,
  onVictory,
  onBotVictory,
  suppressContent = false,
  roundKey,
  style,
}) => {
  const countMoves = board
    .flat()
    .filter((cell: Player) => cell !== null).length;

  useEffect(() => {
    onMoveCountChange?.(countMoves);
  }, [countMoves, onMoveCountChange]);

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);
  const [hasPlayedVictorySound, setHasPlayedVictorySound] = useState(false);

  const hintScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setElapsedSeconds(0);
    setHasPlayedVictorySound(false);
    if (intervalRef.current != null) {
      clearInterval(intervalRef.current as number);
      intervalRef.current = null;
    }
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000) as unknown as number;
    return () => {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current as number);
        intervalRef.current = null;
      }
    };
  }, [roundKey]);

  useEffect(() => {
    if (bestMove && showHint) {
      hintScale.setValue(1);
      Animated.loop(
        Animated.sequence([
          Animated.timing(hintScale, {
            toValue: 1.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(hintScale, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [bestMove, showHint, hintScale]);

  const getHintCell = (): [number, number] | null => {
    if (bestMove && board[bestMove[0]][bestMove[1]] === null) {
      return [bestMove[0], bestMove[1]];
    }
    return null;
  };

  const isBoardEmpty = (b: Board) =>
    b.every((row) => row.every((cell) => cell === null));
  const hasAnyEmpty = (b: Board) =>
    b.some((row) => row.some((cell) => cell === null));
  const isGameOver = (b: Board, win: number[][] | null) =>
    win !== null || !hasAnyEmpty(b);

  useEffect(() => {
    if (isGameOver(board, winningLine)) {
      if (intervalRef.current != null) {
        clearInterval(intervalRef.current as number);
        intervalRef.current = null;
      }
      if (winningLine && !hasPlayedVictorySound) {
        const [winRow, winCol] = winningLine[0];
        const w = board[winRow][winCol];
        if (w === "X" && onVictory) onVictory();
        else if (w === "O" && onBotVictory) onBotVictory();
        setHasPlayedVictorySound(true);
      }
    } else if (isBoardEmpty(board)) {
      setElapsedSeconds(0);
      setHasPlayedVictorySound(false);
      if (intervalRef.current == null) {
        intervalRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000) as unknown as number;
      }
    } else {
      if (intervalRef.current == null) {
        intervalRef.current = setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000) as unknown as number;
      }
    }
  }, [board, winningLine, onVictory, onBotVictory, hasPlayedVictorySound]);

  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");

  const { width } = useWindowDimensions();
  const cellSize = Math.floor(width / 10);

  const WinningCellEffects: React.FC<{
    isActive: boolean;
    isFirstPlayer: boolean;
  }> = ({ isActive, isFirstPlayer }) => {
    const rotation = useLoopingRotation(isActive, { durationMs: 6000 });
    const { activeStars, starTriggers, removeStar } = useAvatarStars(isActive, {
      maxStars: 5,
      minIntervalMs: 500,
      maxIntervalMs: 1500,
    });

    if (!isActive) return null;

    return (
      <Animated.View
        pointerEvents="none"
        style={[
          styles.cellRotatingBackground,
          {
            transform: [
              {
                rotate: rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0deg", "360deg"],
                }),
              },
            ],
            width: cellSize + 20,
            height: cellSize + 20,
            zIndex: 0,
          },
        ]}
      >
        <Image
          source={
            isFirstPlayer
              ? require("../../assets/bg_player.png")
              : require("../../assets/bg_player2.png")
          }
          style={styles.bgImage}
        />
        {activeStars.map((starId) => (
          <AnimatedStar
            key={starId}
            isActive={starTriggers.includes(starId)}
            onComplete={() => removeStar(starId)}
            isFirstPlayer={isFirstPlayer}
            avatarSize={cellSize * 0.8}
          />
        ))}
      </Animated.View>
    );
  };

  const hintCell = getHintCell();
  const currentPlayer: Exclude<Player, null> = countMoves % 2 === 0 ? "X" : "O";
  const hintVisible = showHint && hintCell !== null && currentPlayer === "X";

  const renderCell = (row: number, col: number) => {
    const cell = board[row][col];
    const isWinningCell = winningLine?.some(([r, c]) => r === row && c === col);
    const isHintCell =
      hintVisible && hintCell?.[0] === row && hintCell?.[1] === col;

    const handleCellPress = () => {
      onHintUsed();
      onCellPress(row, col);
    };

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={{ width: cellSize, height: cellSize }}
        onPress={handleCellPress}
        activeOpacity={0.7}
        testID={`cell-${row}-${col}`}
        disabled={suppressContent || cell !== null}
      >
        <View
          style={[
            styles.cell,
            {
              width: cellSize,
              height: cellSize,
              backgroundColor: "#184BD933",
            },
          ]}
        >
          {!suppressContent && isWinningCell && (
            <>
              <VictoryGlow style={{ zIndex: 0 }} />
              <WinningCellEffects
                isActive={true}
                isFirstPlayer={cell === "X"}
              />
            </>
          )}

          {!suppressContent && cell === "X" && (
            <AnimatedAvatar
              source={photo1}
              row={row}
              col={col}
              cellSize={cellSize}
              instant={suppressContent || isWinningCell}
              style={[
                styles.photo1Cell,
                {
                  width: cellSize * 0.8,
                  height: cellSize * 0.8,
                  borderRadius: (cellSize * 0.8) / 2,
                  zIndex: 2,
                },
              ]}
            />
          )}
          {!suppressContent && cell === "O" && (
            <AnimatedAvatar
              source={photo2}
              row={row}
              col={col}
              cellSize={cellSize}
              instant={suppressContent || isWinningCell}
              style={[
                styles.photo2Cell,
                {
                  width: cellSize * 0.8,
                  height: cellSize * 0.8,
                  borderRadius: (cellSize * 0.8) / 2,
                  zIndex: 2,
                },
              ]}
            />
          )}

          {!suppressContent && isHintCell && (
            <Animated.View
              style={[
                styles.hintBackground,
                {
                  transform: [{ scale: hintScale }],
                },
              ]}
            >
              <StarAdvise width={16} height={16} />
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View
      style={[
        styles.board,
        { width: cellSize * 3 + 10, height: cellSize * 3 + 10 },
        style,
      ]}
      testID="game-board"
      onLayout={onLayout}
    >
      <View style={styles.timerContainer} pointerEvents="none">
        <View
          style={[
            styles.timerPill,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Animated.Text style={[styles.timerText, { textAlign: "center" }]}>
            {minutes}:{seconds}
          </Animated.Text>
        </View>
      </View>

      {[1, 2].map((i: number) => (
        <Image
          key={`h-${i}`}
          source={require("../../assets/horizontal_line.png")}
          style={{
            position: "absolute",
            top: i * cellSize - 1,
            left: 0,
            width: cellSize * 3,
            height: 2,
            resizeMode: "stretch",
          }}
        />
      ))}

      {[1, 2].map((i: number) => (
        <LinearGradient
          key={`v-${i}`}
          colors={[
            "rgba(183, 0, 255, 0.2)",
            "#00CCFF",
            "#00CCFF",
            "rgba(183, 0, 255, 0.2)",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          locations={[0, 0.3, 0.9, 1]}
          style={{
            position: "absolute",
            left: i * cellSize - 1,
            top: 0,
            width: 2,
            height: cellSize * 3,
          }}
        />
      ))}

      {board.map((row: Board[number], rowIndex: number) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((cell: Player, colIndex: number) => (
            <View
              key={`cell-${rowIndex}-${colIndex}`}
              style={styles.cellWrapper}
            >
              {renderCell(rowIndex, colIndex)}
            </View>
          ))}
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  board: {},
  row: { flexDirection: "row", position: "relative" },
  cellWrapper: { position: "relative" },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#184BD933",
    borderRadius: 20,
    overflow: "visible",
  },
  cellImage: {},
  timerContainer: {
    position: "absolute",
    top: 0,
    left: -1000,
    right: 0,
    zIndex: 10,
    alignItems: "flex-start",
  },
  timerPill: {
    backgroundColor: "#7500D1",
    borderWidth: 3,
    borderColor: "#C57CFF",
    borderRadius: 24,
    width: 95,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timerText: {
    fontFamily: "Fredoka",
    fontSize: 20,
    lineHeight: 20,
    letterSpacing: 0,
    color: "#FFFFFF",
    textAlignVertical: "center",
  },
  cellRotatingBackground: {
    position: "absolute",
    top: -10,
    left: -10,
    zIndex: 0,
    overflow: "hidden",
  },
  bgImage: { width: "100%", height: "100%" },
  photo1Cell: {
    borderColor: "#FFE97C",
    borderWidth: 3,
    shadowColor: "#C57CFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  photo2Cell: {
    borderWidth: 3,
    borderColor: "#ADEFFF",
  },
  hintContainer: { position: "absolute", width: 32, height: 32, zIndex: 20 },
  hintBackground: {
    flex: 1,
    backgroundColor: "#90A6FF99",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#6876B94D",
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: { padding: 6 },
});

export default GameBoard;
