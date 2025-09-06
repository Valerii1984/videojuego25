export type Player = "X" | "O" | null;
export type Board = Player[][];
export type Cell = Player; // ← ДОБАВИЛИ ЭТО

export interface TicTacToeProps {
  backgroundImage?: string;
  name1?: string;
  name2?: string;
  photo1?: string;
  photo2?: string;
  backendUrl?: string;
  winGif?: string;
}

export interface GameState {
  board: Board;
  currentPlayer: Exclude<Player, null>;
  winner: Player | "draw" | null;
  winningLine: number[][] | null;
}
