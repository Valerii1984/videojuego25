export type LevelKey = "2x2" | "3x3" | "4x4" | "5x5" | "6x6";

export type MagicMemoryPropConfig = {
  age: number;

  language?: string;

  /** @deprecated use `language` instead */
  lang?: string;

  background: string | string[];
  backCardSide: string | string[];
  frontCardSide: string[];
};
