import React from "react";
import GameScreen from "./screens/GameScreen";
import { PropConfigProvider } from "./contexts/PropConfigContext";
import { SoundProvider } from "./contexts/SoundContext";
import type { MagicMemoryPropConfig } from "./types/props";

export interface MagicMemoryProps {
  props: MagicMemoryPropConfig;
}

export const MagicMemory: React.FC<MagicMemoryProps> = ({ props }) => {
  return (
    <PropConfigProvider value={props}>
      <GameScreen />
    </PropConfigProvider>
  );
};

export default MagicMemory;
