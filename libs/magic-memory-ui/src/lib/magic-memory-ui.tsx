import React from "react";
import GameScreen from "./screens/GameScreen"; // ← один экран, без Stack/NavigationContainer
import { PropConfigProvider } from "./contexts"; // ← ИМПОРТ ЧЕРЕЗ БАРРЕЛЬ!
import type { MagicMemoryPropConfig } from "./types/props";

export interface MagicMemoryProps {
  props: MagicMemoryPropConfig;
}

/** Публичный компонент библиотеки: провайдер + экран. */
export const MagicMemory: React.FC<MagicMemoryProps> = ({ props }) => {
  return (
    <PropConfigProvider value={props}>
      <GameScreen />
    </PropConfigProvider>
  );
};

export default MagicMemory;
