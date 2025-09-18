import type { SupportedLang } from "./index";

/**
 * ВНЕШНИЕ пропсы, приходящие в библиотеку Magic Memory.
 * Только URL — никаких ассетов.
 *
 * Теперь ориентируемся на age (число).
 * Пары = Math.floor(age / 2).
 */
export type LevelKey = number;

export interface MagicMemoryPropConfig {
  /** Возраст/размер колоды, число. Пары = Math.floor(age / 2). */
  age: number;

  /** Язык интерфейса — строго из поддерживаемых коротких кодов. */
  lang: SupportedLang;

  /** Фон: одиночный URL ИЛИ массив URL (на каждый старт выбираем случайный). */
  background: string | string[];

  /** Рубашка: одиночный URL ИЛИ массив URL (на каждый старт выбираем случайный). */
  backCardSide: string | string[];

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
