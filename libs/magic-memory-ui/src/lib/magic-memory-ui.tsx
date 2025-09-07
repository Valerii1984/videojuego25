import React from "react";
import { View, Text } from "react-native";
import { ExternalConfigContext } from "./contexts/ExternalConfigContext";
import type { MagicMemoryConfig } from "./types/external-config";
import GameScreen from "./screens/GameScreen";

/* eslint-disable-next-line */
export interface MagicMemoryUiProps {
  /** Внешний конфиг (фон/рубашка/лица карт). Необязателен. */
  externalConfig?: MagicMemoryConfig;
}

/**
 * Корневой компонент библиотеки.
 * Принимает externalConfig и прокидывает его через контекст на экраны.
 */
export function MagicMemoryUi({ externalConfig }: MagicMemoryUiProps) {
  return (
    <ExternalConfigContext.Provider value={externalConfig}>
      {/* Если у тебя есть навигация — поставь её здесь вместо простого GameScreen */}
      <GameScreen />
    </ExternalConfigContext.Provider>
  );
}

export default MagicMemoryUi;
