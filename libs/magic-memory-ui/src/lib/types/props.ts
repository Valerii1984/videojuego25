// libs/magic-memory-ui/src/lib/types/props.ts

/**
 * ВНЕШНИЕ пропсы, которые приходят в библиотеку.
 * Только URL, никаких ассетов.
 *
 * Теперь ориентируемся на age (число).
 * Пары = Math.floor(age / 2).
 */
export type LevelKey = number;

export interface MagicMemoryPropConfig {
  /** Возраст/размер колоды, число. Пары = Math.floor(age / 2). */
  age: number;

  /** Язык интерфейса, например 'es' | 'en' */
  lang: string;

  /** Фон: одиночный URL ИЛИ массив URL (на каждый старт берём случайный) */
  background: string;

  /** Рубашка: одиночный URL ИЛИ массив URL (на каждый старт берём случайный) */
  backCardSide: string;

  /**
   * Лица карт: массив URL.
   * Должно быть минимум Math.floor(age / 2) УНИКАЛЬНЫХ URL.
   */
  frontCardSide: string[];
}

/** Пропсы обёртки-компонента MagicMemory */
export interface MagicMemoryProps {
  props: MagicMemoryPropConfig;
}
