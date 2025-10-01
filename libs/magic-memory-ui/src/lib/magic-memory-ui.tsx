import React from "react";
import GameScreen from "./screens/GameScreen";
import { PropConfigProvider } from "./contexts/PropConfigContext";
import type { MagicMemoryPropConfig } from "./types/props";

import { SoundProvider } from "./contexts/SoundContext";

export interface MagicMemoryProps {
  props: MagicMemoryPropConfig;
}

/**
 * Главный компонент библиотеки.
 * Оборачивает экран в SoundProvider (фон/голоса) и PropConfigProvider (настройки).
 */
export const MagicMemory: React.FC<MagicMemoryProps> = ({ props }) => {
  return (
    <SoundProvider>
      <PropConfigProvider value={props}>
        <GameScreen />
      </PropConfigProvider>
    </SoundProvider>
  );
};

export default MagicMemory;
