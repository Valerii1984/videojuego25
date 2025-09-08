export type LevelKey = 4 | 6 | 8 | 10 | 12;
export interface MagicMemoryPropConfig {
    age: LevelKey;
    lang: string;
    background?: string | string[];
    backCardSide?: string | string[];
    frontCardSide?: string[];
}
