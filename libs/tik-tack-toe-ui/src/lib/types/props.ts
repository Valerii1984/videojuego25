export type Language = string; // любой код из песочницы, напр. 'es', 'pt-BR', 'pl'

/** Ключи всех надписей UI */
export type UiKey =
  | "play"
  | "play_again"
  | "congrats"
  | "player_x_wins"
  | "player_o_wins"
  | "draw";

export interface TicTacToePropConfig {
  /** язык интерфейса: приходит из твоей песочницы */
  lang: Language;
  /** фон (URL) */
  background: string;
  /** аватар игрока (X) — URL */
  userAvatar?: string;
  /** аватар соперника (O) — URL */
  enemyCard?: string;

  /** (опц.) прямые оверрайды строк UI */
  labels?: Partial<Record<UiKey, string>>;

  /**
   * (опц.) онлайн-перевод.
   * Ты даёшь функцию, которая на своей стороне переводит defaultText на lang.
   * Компонент сам вызовет её для всех ключей и подставит результат.
   */
  translate?: (
    key: UiKey,
    defaultText: string,
    lang: string
  ) => Promise<string>;
}
