import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./navigation/AppNavigator";
import { PropConfigProvider } from "./contexts/PropConfigContext";
import { LanguageProvider } from "./contexts/LanguageContext";
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

export const MagicMemory: React.FC<MagicMemoryProps> = ({ props }) => {
  // ВАЖНО: убрали initialLanguage — ваш LanguageProvider его не принимает.
  // Язык из props.lang вы можете выставлять внутри GameScreen, если в контексте есть setter.
  return (
    <PropConfigProvider value={props}>
      <LanguageProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </LanguageProvider>
    </PropConfigProvider>
  );
};
