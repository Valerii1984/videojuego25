// компонент
export { MagicMemory } from "./lib/magic-memory-ui";

// *герои* (как у тебя)
export * from "./assets/hero";

// 🔥 ВАЖНО: ре-экспорт типов наружу пакета,
// чтобы у клиента работал: `import type { MagicMemoryPropConfig } from "@game/magic-memory-ui"`
export type { MagicMemoryPropConfig, LevelKey } from "./lib/types/props";
