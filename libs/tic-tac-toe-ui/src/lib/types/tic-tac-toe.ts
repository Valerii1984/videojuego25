import type { ImageSourcePropType } from "react-native";
import type { TicTacToePropConfig, Language } from "./props";

export type Player = "X" | "O" | null;
export type Board = Player[][];
export type Cell = Player;

export interface TicTacToeProps extends Partial<TicTacToePropConfig> {
  backgroundImage?: ImageSourcePropType;
  name1?: string;
  name2?: string;
  photo1?: ImageSourcePropType;
  photo2?: ImageSourcePropType;
  backendUrl?: string;
  winGif?: ImageSourcePropType;

  lang?: Language;
}

export interface GameState {
  board: Board;
  currentPlayer: Exclude<Player, null>;
  winner: Player | "draw" | null;
  winningLine: number[][] | null;
}
