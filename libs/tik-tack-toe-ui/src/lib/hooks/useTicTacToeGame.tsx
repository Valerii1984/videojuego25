import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Board, Player } from "../types/tic-tac-toe";

/** Выбери режим бота: "easy" | "humanlike" | "strong" */
const BOT_MODE: "easy" | "humanlike" | "strong" = "humanlike";

type GameState = {
  board: Board;
  currentPlayer: Player; // 'X' | 'O' | null
  winner: Player | "draw" | null;
  winningLine: number[][] | null;
};

const EMPTY_BOARD: Board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const LINES: number[][][] = [
  // rows
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
  // cols
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
  // diagonals
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

function clone(b: Board): Board {
  return b.map((r) => r.slice()) as Board;
}

function rand(): number {
  return Math.random();
}

function checkWinner(board: Board): {
  winner: Player | "draw" | null;
  line: number[][] | null;
} {
  for (const line of LINES) {
    const [a, b, c] = line;
    const v1 = board[a[0]][a[1]];
    const v2 = board[b[0]][b[1]];
    const v3 = board[c[0]][c[1]];
    if (v1 && v1 === v2 && v2 === v3) {
      return { winner: v1, line };
    }
  }
  const anyEmpty = board.some((row) => row.some((cell) => cell === null));
  return { winner: anyEmpty ? null : "draw", line: null };
}

function getEmptyCells(board: Board): number[][] {
  const cells: number[][] = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++) if (board[r][c] === null) cells.push([r, c]);
  return cells;
}

/** Подсказка для игрока X: сначала выигрыш, потом блок, иначе первая пустая */
function computeHintMoveForX(board: Board): number[] | null {
  const empties = getEmptyCells(board);
  if (empties.length === 0) return null;

  // 1) можем выиграть X сейчас?
  for (const [r, c] of empties) {
    const tmp = clone(board);
    tmp[r][c] = "X";
    const { winner } = checkWinner(tmp);
    if (winner === "X") return [r, c];
  }
  // 2) блокируем немедленную победу O
  for (const [r, c] of empties) {
    const tmp = clone(board);
    tmp[r][c] = "O";
    const { winner } = checkWinner(tmp);
    if (winner === "O") return [r, c];
  }
  // 3) первая пустая
  return empties[0] ?? null;
}

/** Сильный бот (как раньше): выигрывает, блокирует, иначе первая пустая */
function computeStrongMoveForO(board: Board): number[] | null {
  const empties = getEmptyCells(board);
  if (empties.length === 0) return null;

  // 1) можем выиграть O сейчас?
  for (const [r, c] of empties) {
    const tmp = clone(board);
    tmp[r][c] = "O";
    const { winner } = checkWinner(tmp);
    if (winner === "O") return [r, c];
  }
  // 2) блокируем немедленную победу X
  for (const [r, c] of empties) {
    const tmp = clone(board);
    tmp[r][c] = "X";
    const { winner } = checkWinner(tmp);
    if (winner === "X") return [r, c];
  }
  // 3) первая пустая
  return empties[0] ?? null;
}

/** Почти случайный бот */
function computeEasyMoveForO(board: Board): number[] | null {
  const empties = getEmptyCells(board);
  if (empties.length === 0) return null;
  const idx = Math.floor(rand() * empties.length);
  return empties[idx] ?? null;
}

/** «Человечный новичок»: иногда ошибается, любит центр/углы */
function computeHumanlikeMoveForO(board: Board): number[] | null {
  const empties = getEmptyCells(board);
  if (empties.length === 0) return null;

  // Вероятности «ошибок/решений»
  const takeWinProb = 0.7; // 70% заметить свою победу сразу
  const blockProb = 0.7; // 70% заметить угрозу и заблокировать
  const preferGoodProb = 0.6; // 60% предпочесть центр/углы перед рандомом

  // 1) иногда НЕ замечает победу
  const strongWin = computeStrongMoveForO(board);
  if (strongWin) {
    if (rand() < takeWinProb) return strongWin; // замечает и добивает
    // иначе «промахнулся» — идём дальше
  }

  // 2) иногда НЕ блокирует немедленную победу X
  // найдём угрозу X
  let blockMove: number[] | null = null;
  for (const [r, c] of empties) {
    const tmp = clone(board);
    tmp[r][c] = "X";
    const { winner } = checkWinner(tmp);
    if (winner === "X") {
      blockMove = [r, c];
      break;
    }
  }
  if (blockMove) {
    if (rand() < blockProb) return blockMove; // заметил и заблокировал
    // иначе «промахнулся» — идём дальше
  }

  // 3) структура предпочтений (центр -> углы -> стороны)
  const center: number[][] = [[1, 1]];
  const corners: number[][] = [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ];
  const sides: number[][] = [
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1],
  ];

  const emptyCenter = center.filter(([r, c]) => board[r][c] === null);
  const emptyCorners = corners.filter(([r, c]) => board[r][c] === null);
  const emptySides = sides.filter(([r, c]) => board[r][c] === null);

  // 60% — выбрать по приоритету, иначе — чистый рандом
  if (rand() < preferGoodProb) {
    if (emptyCenter.length) return emptyCenter[0];
    if (emptyCorners.length)
      return emptyCorners[Math.floor(rand() * emptyCorners.length)];
    if (emptySides.length)
      return emptySides[Math.floor(rand() * emptySides.length)];
  }

  // fallback: чисто случайный ход
  const idx = Math.floor(rand() * empties.length);
  return empties[idx] ?? null;
}

function pickBotMove(board: Board): number[] | null {
  switch (BOT_MODE) {
    case "easy":
      return computeEasyMoveForO(board);
    case "humanlike":
      return computeHumanlikeMoveForO(board);
    case "strong":
    default:
      return computeStrongMoveForO(board);
  }
}

export function useTicTacToeGame(playNotification?: () => void) {
  const [state, setState] = useState<GameState>({
    board: clone(EMPTY_BOARD),
    currentPlayer: "X",
    winner: null,
    winningLine: null,
  });

  const botTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProcessingBot = useRef(false);

  const gameComplete = state.winner !== null;

  // Подсказка — для игрока X (не «тупит»)
  const bestMove = useMemo(
    () => computeHintMoveForX(state.board),
    [state.board]
  );

  const handleCellPress = useCallback(
    (row: number, col: number) => {
      if (gameComplete) return;
      if (state.currentPlayer !== "X") return; // ход бота — тапы блокируем
      if (state.board[row][col] !== null) return; // занято — игнор

      setState((prev) => {
        const next = clone(prev.board);
        next[row][col] = "X";
        const { winner, line } = checkWinner(next);
        return {
          board: next,
          currentPlayer: winner ? null : "O",
          winner,
          winningLine: line,
        };
      });

      if (playNotification) playNotification();
    },
    [state.board, state.currentPlayer, gameComplete, playNotification]
  );

  const undoLastTwoMoves = useCallback(() => {
    if (gameComplete) return;

    const next = clone(state.board);
    let removed = 0;
    for (let r = 2; r >= 0; r--) {
      for (let c = 2; c >= 0; c--) {
        if (next[r][c] !== null && removed < 2) {
          next[r][c] = null;
          removed++;
        }
      }
    }
    const { winner, line } = checkWinner(next);
    setState({
      board: next,
      currentPlayer: "X",
      winner,
      winningLine: line,
    });
  }, [state.board, gameComplete]);

  const resetGame = useCallback(() => {
    if (botTimer.current) {
      clearTimeout(botTimer.current);
      botTimer.current = null;
    }
    isProcessingBot.current = false;
    setState({
      board: clone(EMPTY_BOARD),
      currentPlayer: "X",
      winner: null,
      winningLine: null,
    });
  }, []);

  // Авто-ход бота «O»
  useEffect(() => {
    if (gameComplete) return;
    if (state.currentPlayer !== "O") return;
    if (isProcessingBot.current) return;

    isProcessingBot.current = true;
    botTimer.current = setTimeout(() => {
      setState((prev) => {
        if (prev.currentPlayer !== "O" || prev.winner) {
          isProcessingBot.current = false;
          return prev;
        }
        const move = pickBotMove(prev.board);
        if (!move) {
          // ничья
          const { winner, line } = checkWinner(prev.board);
          isProcessingBot.current = false;
          return { ...prev, winner: winner ?? "draw", winningLine: line };
        }
        const [r, c] = move;
        const next = clone(prev.board);
        next[r][c] = "O";
        const { winner, line } = checkWinner(next);
        isProcessingBot.current = false;
        return {
          board: next,
          currentPlayer: winner ? null : "X",
          winner,
          winningLine: line,
        };
      });
    }, 450);

    return () => {
      if (botTimer.current) {
        clearTimeout(botTimer.current);
        botTimer.current = null;
      }
      isProcessingBot.current = false;
    };
  }, [state.currentPlayer, state.board, gameComplete]);

  // Совместимость с твоим компонентом
  const isGameStarted = true;
  const setIsGameStarted = (_: boolean) => {};

  return {
    isGameStarted,
    setIsGameStarted,
    gameState: state,
    bestMove,
    gameComplete,
    handleCellPress,
    undoLastTwoMoves,
    resetGame,
  };
}
