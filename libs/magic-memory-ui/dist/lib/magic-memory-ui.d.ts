import React from "react";
import type { MagicMemoryPropConfig } from "./types/props";
/**
 * Импорт снаружи:
 *   import { MagicMemory } from '@valerii1984/magic-memory-ui';
 * Использование:
 *   <MagicMemory props={...} />
 */
export interface MagicMemoryProps {
    props: MagicMemoryPropConfig;
}
export declare const MagicMemory: React.FC<MagicMemoryProps>;
