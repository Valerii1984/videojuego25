/// <reference path="./lib/types/assets.d.ts" />

// Внешняя точка входа
export { MagicMemory } from "./lib/magic-memory-ui";
export type { MagicMemoryProps } from "./lib/magic-memory-ui";

// Типы пропсов наружу (экспортим из types/props.ts)
export type { MagicMemoryPropConfig, LevelKey } from "./lib/types/props";

// Если нужно оставить и старые экспорты:
export { AppNavigator } from "./lib/navigation/AppNavigator";
export * from "./lib/navigation/AppNavigator";
export * from "./lib/i18n";
