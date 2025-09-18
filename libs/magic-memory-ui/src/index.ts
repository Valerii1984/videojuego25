/// <reference path="./lib/types/assets.d.ts" />

// Внешняя точка входа
export { MagicMemory } from "./lib/magic-memory-ui";
export type { MagicMemoryProps } from "./lib/magic-memory-ui";

// Типы пропсов наружу
export type { MagicMemoryPropConfig, LevelKey } from "./lib/types/props";

// Навигация и i18n
export { AppNavigator } from "./lib/navigation/AppNavigator";
export * from "./lib/navigation/AppNavigator";
export * from "./lib/i18n";

// ⬇️ ДОБАВЛЕНО: ассеты робота, чтобы удобно импортировать в приложении
export const heroRobot = require("./lib/assets/hero/hero.webp");
export const heroRobotSound = require("./lib/assets/hero/hero.m4a");
