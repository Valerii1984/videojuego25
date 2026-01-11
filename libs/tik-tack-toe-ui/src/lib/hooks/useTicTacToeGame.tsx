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

function computeBestMove(
  board: Board,
  ai: Player = "O",
  human: Player = "X"
): [number, number] | null {
  const lines: [number, number][][] = [
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

  // Win
  for (const line of lines) {
    const [[r1, c1], [r2, c2], [r3, c3]] = line;
    const cells = [board[r1][c1], board[r2][c2], board[r3][c3]];
    if (cells.filter((v) => v === ai).length === 2 && cells.includes(null)) {
      const idx = cells.indexOf(null);
      return line[idx];
    }
  }

  // Block
  for (const line of lines) {
    const [[r1, c1], [r2, c2], [r3, c3]] = line;
    const cells = [board[r1][c1], board[r2][c2], board[r3][c3]];
    if (cells.filter((v) => v === human).length === 2 && cells.includes(null)) {
      const idx = cells.indexOf(null);
      return line[idx];
    }
  }

  if (board[1][1] === null) return [1, 1];

  const corners: [number, number][] = [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ];
  const freeCorner = corners.find(([r, c]) => board[r][c] === null);
  if (freeCorner) return freeCorner;

  const edges: [number, number][] = [
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1],
  ];
  const freeEdge = edges.find(([r, c]) => board[r][c] === null);
  if (freeEdge) return freeEdge;

  return null;
}

/** ─────────────────────────────────────────────────────────
 *  Assist-mode AI: после подсказки бот начинает "сливать"
 *  Цель: дать X победить, но без лагов и без ломания UX.
 *  - Не берем свою мгновенную победу (если есть альтернативы)
 *  - Не блокируем мгновенную победу X (если есть альтернативы)
 *  - Иначе ходим слабее (края -> углы -> центр)
 *  ───────────────────────────────────────────────────────── */
const LINES: [number, number][][] = [
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

function listEmpty(board: Board): [number, number][] {
  const res: [number, number][] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] === null) res.push([r, c]);
    }
  }
  return res;
}

function findWinningMoves(board: Board, player: Player): [number, number][] {
  const wins: [number, number][] = [];
  for (const line of LINES) {
    const [a, b, c] = line;
    const v1 = board[a[0]][a[1]];
    const v2 = board[b[0]][b[1]];
    const v3 = board[c[0]][c[1]];
    const cells = [v1, v2, v3];

    if (
      cells.filter((v) => v === player).length === 2 &&
      cells.includes(null)
    ) {
      const idx = cells.indexOf(null);
      wins.push(line[idx] as [number, number]);
    }
  }
  // уникализируем
  return wins.filter(
    (m, i) => wins.findIndex((x) => x[0] === m[0] && x[1] === m[1]) === i
  );
}

function pickAssistMove(board: Board): [number, number] | null {
  const empties = listEmpty(board);
  if (!empties.length) return null;

  const xWins = findWinningMoves(board, "X"); // клетки, которые блокируют победу X
  const oWins = findWinningMoves(board, "O"); // клетки, которые дают победу O

  // 1) если можем выиграть — специально НЕ выигрываем (если есть альтернатива)
  if (oWins.length) {
    const avoidSet = new Set(oWins.map((m) => `${m[0]}:${m[1]}`));
    const alt = empties.find((m) => !avoidSet.has(`${m[0]}:${m[1]}`));
    if (alt) return alt;
    // нет альтернатив -> вынужденно выиграем
    return oWins[0];
  }

  // 2) если X может выиграть следующим ходом — специально НЕ блокируем (если есть альтернатива)
  if (xWins.length) {
    const blockSet = new Set(xWins.map((m) => `${m[0]}:${m[1]}`));
    const alt = empties.find((m) => !blockSet.has(`${m[0]}:${m[1]}`));
    if (alt) return alt;
    // вынуждены блокировать (например, две угрозы)
    return xWins[0];
  }

  // 3) слабый приоритет ходов: edges -> corners -> center
  const edges: [number, number][] = [
    [0, 1],
    [1, 0],
    [1, 2],
    [2, 1],
  ];
  const corners: [number, number][] = [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ];
  for (const m of edges) if (board[m[0]][m[1]] === null) return m;
  for (const m of corners) if (board[m[0]][m[1]] === null) return m;
  if (board[1][1] === null) return [1, 1];

  // fallback
  return empties[0] ?? null;
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

  // ✅ Новое: режим "помочь ребёнку выиграть" (включается только после нажатия подсказки)
  const [assistMode, setAssistMode] = useState(false);

  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const endTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const bestMove = computeBestMove(gameState.board);

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

  // 🛑 БЛОКИРУЕМ ХОДЫ НЕ В СВОЙ ХОД
  const handleCellPress = useCallback(
    (row: number, col: number) => {
      if (gameComplete) return;
      if (isInputLocked) return;

      // ❗ НОВАЯ КРИТИЧЕСКАЯ ПРОВЕРКА
      if (gameState.currentPlayer !== "X") return;

      if (gameState.board[row][col] != null) return;

      setIsInputLocked(true);
      applyMove(row, col, "X");

      setTimeout(() => setIsInputLocked(false), BETWEEN_TURNS_DELAY_MS);
    },
    [applyMove, gameComplete, isInputLocked, gameState]
  );

  useEffect(() => {
    if (!isGameStarted) return;
    if (gameComplete) return;
    if (gameState.winner) return;
    if (gameState.currentPlayer !== "O") return;

    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    aiTimerRef.current = setTimeout(() => {
      const move = assistMode
        ? pickAssistMove(gameState.board) // ✅ после подсказки — “сливаем”
        : computeBestMove(gameState.board);

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
    assistMode,
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

    // ✅ Сброс “помощи” на новую игру
    setAssistMode(false);
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
    bestMove,
    gameComplete,
    handleCellPress,
    resetGame,

    // ✅ НОВОЕ: дергаешь это при нажатии на подсказку
    setAssistMode,
  };
}
