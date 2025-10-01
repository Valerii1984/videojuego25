import React from "react";
import type { MagicMemoryPropConfig } from "./types/props";
export interface MagicMemoryProps {
    props: MagicMemoryPropConfig;
}
/**
 * Главный компонент библиотеки.
 * Оборачивает экран в SoundProvider (фон/голоса) и PropConfigProvider (настройки).
 */
export declare const MagicMemory: React.FC<MagicMemoryProps>;
export default MagicMemory;
