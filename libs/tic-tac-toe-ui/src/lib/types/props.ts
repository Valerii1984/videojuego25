export type Language = string;

export type UiKey =
  | "play"
  | "play_again"
  | "congrats"
  | "player_x_wins"
  | "player_o_wins"
  | "draw";

export interface TicTacToePropConfig {
  lang: Language;

  background: string;

  userAvatar?: string;

  enemyCard?: string;

  labels?: Partial<Record<UiKey, string>>;

  translate?: (
    key: UiKey,
    defaultText: string,
    lang: string
  ) => Promise<string>;
}
