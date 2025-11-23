import { useCallback, useEffect, useRef, useState } from "react";

export type Cell = null | "X" | "O";
export type Player = "X" | "O";
export type Board = Cell[][];
export type Winner = Player | "draw" | null;

type GameState = {
  board: Board;
  currentPlayer: Player;
  winner: Winner;
  winningLine: [number, number][] | null;
};

const EMPTY_BOARD: Board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

// UX тайминги
const AI_THINK_DELAY_MS = 800;
const BETWEEN_TURNS_DELAY_MS = 400;
const LAST_MOVE_FREEZE_MS = 1500;

function cloneBoard(b: Board): Board {
  return b.map((r) => [...r]);
}

function checkWinner(board: Board): {
  winner: Winner;
  line: [number, number][] | null;
} {
  const lines: [[number, number], [number, number], [number, number]][] = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    const v1 = board[a[0]][a[1]];
    const v2 = board[b[0]][b[1]];
    const v3 = board[c[0]][c[1]];
    if (v1 && v1 === v2 && v2 === v3) {
      return { winner: v1, line };
    }
  }

  const hasEmpty = board.some((row) => row.some((c) => c === null));
  if (!hasEmpty) return { winner: "draw", line: null };
  return { winner: null, line: null };
}

function isDraw(board: Board) {
  return checkWinner(board).winner === "draw";
}

// ──────────────────────────────────────
// Вспомогательные функции для minimax
// ──────────────────────────────────────

function otherPlayer(p: Player): Player {
  return p === "X" ? "O" : "X";
}

function getAvailableMoves(board: Board): [number, number][] {
  const result: [number, number][] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] === null) result.push([r, c]);
    }
  }
  return result;
}

function minimax(
  board: Board,
  current: Player,
  maxPlayer: Player,
  depth: number
): { score: number; move: [number, number] | null } {
  const { winner } = checkWinner(board);

  if (winner === maxPlayer) {
    return { score: 10 - depth, move: null };
  }
  if (winner && winner !== "draw" && winner !== maxPlayer) {
    return { score: depth - 10, move: null };
  }
  if (winner === "draw") {
    return { score: 0, move: null };
  }

  const moves = getAvailableMoves(board);
  if (moves.length === 0) {
    return { score: 0, move: null };
  }

  const isMaximizing = current === maxPlayer;
  let bestScore = isMaximizing ? -Infinity : Infinity;
  let bestMove: [number, number] | null = null;

  for (const [r, c] of moves) {
    const next = cloneBoard(board);
    next[r][c] = current;

    const res = minimax(next, otherPlayer(current), maxPlayer, depth + 1);

    if (isMaximizing) {
      if (res.score > bestScore) {
        bestScore = res.score;
        bestMove = [r, c];
      }
    } else {
      if (res.score < bestScore) {
        bestScore = res.score;
        bestMove = [r, c];
      }
    }
  }

  return { score: bestScore, move: bestMove };
}

/**
 * Лучший ход для указанного игрока.
 * - Для ИИ: player = "O"
 * - Для подсказки: player = "X"
 */
function computeBestMoveFor(
  board: Board,
  player: Player
): [number, number] | null {
  const { winner } = checkWinner(board);
  if (winner) return null;

  const res = minimax(board, player, player, 0);
  return res.move;
}

export function useTicTacToeGame(onTick?: () => void) {
  const [gameState, setGameState] = useState<GameState>({
    board: cloneBoard(EMPTY_BOARD),
    currentPlayer: "X",
    winner: null,
    winningLine: null,
  });

  const [gameComplete, setGameComplete] = useState(false);
  const [isInputLocked, setIsInputLocked] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // bestMove используем как подсказку для ИГРОКА (X)
  const bestMove = computeBestMoveFor(gameState.board, "X");

  const applyMove = useCallback(
    (row: number, col: number, by: Player) => {
      setGameState((prev) => {
        if (prev.board[row][col] != null || prev.winner) return prev;

        const next: GameState = {
          board: cloneBoard(prev.board),
          currentPlayer: prev.currentPlayer,
          winner: prev.winner,
          winningLine: prev.winningLine,
        };

        next.board[row][col] = by;

        const { winner, line } = checkWinner(next.board);

        if (winner) {
          next.winner = winner;
          next.winningLine = line;
          if (endTimerRef.current) clearTimeout(endTimerRef.current);
          endTimerRef.current = setTimeout(() => {
            setGameComplete(true);
          }, LAST_MOVE_FREEZE_MS);
        } else if (isDraw(next.board)) {
          next.winner = "draw";
          next.winningLine = null;
          if (endTimerRef.current) clearTimeout(endTimerRef.current);
          endTimerRef.current = setTimeout(() => {
            setGameComplete(true);
          }, LAST_MOVE_FREEZE_MS);
        } else {
          next.currentPlayer = by === "X" ? "O" : "X";
        }

        return next;
      });

      onTick?.();
    },
    [onTick]
  );

  const handleCellPress = useCallback(
    (row: number, col: number) => {
      if (isInputLocked || gameComplete) return;
      setIsInputLocked(true);
      applyMove(row, col, "X");
      setTimeout(() => setIsInputLocked(false), BETWEEN_TURNS_DELAY_MS);
    },
    [applyMove, gameComplete, isInputLocked]
  );

  useEffect(() => {
    if (!isGameStarted) return;
    if (gameComplete) return;
    if (gameState.winner) return;
    if (gameState.currentPlayer !== "O") return;

    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    aiTimerRef.current = setTimeout(() => {
      const move = computeBestMoveFor(gameState.board, "O"); // умный ход ИИ
      if (move) applyMove(move[0], move[1], "O");
    }, AI_THINK_DELAY_MS);

    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    };
  }, [
    gameState.currentPlayer,
    gameState.board,
    gameState.winner,
    gameComplete,
    isGameStarted,
    applyMove,
  ]);

  const resetGame = useCallback(() => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    if (endTimerRef.current) clearTimeout(endTimerRef.current);
    setGameState({
      board: cloneBoard(EMPTY_BOARD),
      currentPlayer: "X",
      winner: null,
      winningLine: null,
    });
    setGameComplete(false);
    setIsInputLocked(false);
  }, []);

  useEffect(() => {
    return () => {
      if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
      if (endTimerRef.current) clearTimeout(endTimerRef.current);
    };
  }, []);

  return {
    setIsGameStarted,
    isGameStarted,
    gameState,
    bestMove, // [row, col] | null
    gameComplete,
    handleCellPress,
    resetGame,
  };
}
