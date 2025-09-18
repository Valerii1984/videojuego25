// libs/tik-tack-toe-ui/src/lib/types/props.ts

/**
 * Поддерживаемые языки интерфейса.
 * Если менеджер попросит добавить ещё — просто расширяем union.
 */
export type Language = "en" | "es" | "uk" | "de" | "fr" | "pl" | "it" | "pt";

/**
 * Новый внешний конфиг TicTacToe (менеджерский вариант).
 * Минимальный и строгий.
 */
export interface TicTacToePropConfig {
  /** язык интерфейса — строго типизированный ключ */
  lang: Language;

  /** фон: одиночный URL */
  background: string;

  /** аватар игрока (X) — URL */
  userAvatar?: string;

  /** карточка/аватар соперника (O) — URL */
  enemyCard?: string;
}
