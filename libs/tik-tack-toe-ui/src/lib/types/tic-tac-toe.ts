// libs/tik-tack-toe-ui/src/lib/types/tic-tac-toe.ts
import type { ImageSourcePropType } from "react-native";
import type { TicTacToePropConfig, Language } from "./props";

// Основные типы игры
export type Player = "X" | "O" | null;
export type Board = Player[][];
export type Cell = Player;

/**
 * Пропсы для компонента TicTacToe.
 * Совмещаем новый внешний конфиг и старые поля (для обратной совместимости).
 */
export interface TicTacToeProps extends Partial<TicTacToePropConfig> {
  /** fallback для ассетов и старых интеграций */
  backgroundImage?: ImageSourcePropType;
  name1?: string;
  name2?: string;
  photo1?: ImageSourcePropType;
  photo2?: ImageSourcePropType;
  backendUrl?: string;
  winGif?: ImageSourcePropType;

  /** для совместимости можно явно указать язык */
  lang?: Language;
}

export interface GameState {
  board: Board;
  currentPlayer: Exclude<Player, null>;
  winner: Player | "draw" | null;
  winningLine: number[][] | null;
}
