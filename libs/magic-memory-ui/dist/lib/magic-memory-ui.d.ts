import React from "react";
export type LevelKey = 4 | 6 | 8 | 10 | 12;
export interface MagicMemoryPropConfig {
    age: LevelKey;
    lang: string;
    background?: string;
    backCardSide?: string | string[];
    frontCardSide?: string[];
}
export interface MagicMemoryProps {
    props: MagicMemoryPropConfig;
}
export type RootStackParamList = {
    GameScreen: {
        level?: number;
        config: MagicMemoryPropConfig;
    };
};
export declare const MagicMemory: React.FC<MagicMemoryProps>;
export default MagicMemory;
