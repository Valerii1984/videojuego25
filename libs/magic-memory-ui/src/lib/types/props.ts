// libs/magic-memory-ui/src/lib/types/props.ts
export type LevelKey = 4 | 6 | 8 | 10 | 12;

export interface MagicMemoryPropConfig {
  age: LevelKey; // уровень игры (4,6,8,10,12)
  lang: string; // язык интерфейса ("es" | "en" и т.п.)
  background?: string | string[]; // фон: один URL или массив URL (случайный на каждый старт)
  backCardSide?: string | string[]; // рубашка карты: один URL или массив URL (случайный на каждый старт)
  frontCardSide?: string[]; // лица карт: массив URL; минимум age/2 уникальных
}
