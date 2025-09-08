// src/lib/contexts/PropConfigContext.tsx
import React, { createContext, useContext } from "react";
import type { MagicMemoryPropConfig } from "../types/props";

export const PropConfigContext = createContext<MagicMemoryPropConfig | null>(
  null
);

export const PropConfigProvider: React.FC<{
  value: MagicMemoryPropConfig;
  children: React.ReactNode;
}> = ({ value, children }) => (
  <PropConfigContext.Provider value={value}>
    {children}
  </PropConfigContext.Provider>
);

export const usePropConfig = () => {
  const ctx = useContext(PropConfigContext);
  return ctx;
};
