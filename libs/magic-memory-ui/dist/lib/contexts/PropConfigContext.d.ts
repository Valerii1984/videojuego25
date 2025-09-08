import React from "react";
import type { MagicMemoryPropConfig } from "../types/props";
export declare const PropConfigContext: React.Context<MagicMemoryPropConfig>;
export declare const PropConfigProvider: React.FC<{
    value: MagicMemoryPropConfig;
    children: React.ReactNode;
}>;
export declare const usePropConfig: () => MagicMemoryPropConfig;
