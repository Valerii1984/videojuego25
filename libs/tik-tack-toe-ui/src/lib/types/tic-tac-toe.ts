// ТИПЫ ДЛЯ TIC-TAC-TOE

export type Player = "X" | "O" | null;
export type Board = Player[][];
export type Cell = Player;

export interface TicTacToeProps {
  /**
   * Язык интерфейса (пока опционально — для совместимости).
   * Пример: "en" | "es" | "uk" и т.д.
   */
  lang?: string;

  /**
   * Фон как URL. Если задан — имеет приоритет над backgroundImage.
   */
  background?: string;

  /**
   * Аватар игрока (X) — URL.
   * Если не задан — берём photo1 (ниже) или дефолт из ассетов.
   */
  userAvatar?: string;

  /**
   * «Карточка»/аватар соперника (O) — URL.
   * Если не задан — берём photo2 (ниже) или дефолт из ассетов.
   */
  enemyCard?: string;

  /**
   * СТАРЫЕ ПОЛЯ для совместимости (можно удалять позже).
   * Могут быть require(...) или URL (string).
   */
  backgroundImage?: any;
  name1?: string;
  name2?: string;
  photo1?: any;
  photo2?: any;
  backendUrl?: string;
  winGif?: any;
}

export interface GameState {
  board: Board;
  currentPlayer: Exclude<Player, null>;
  winner: Player | "draw" | null;
  winningLine: number[][] | null;
}
