import React, { createContext, useContext } from "react";
import type { MagicMemoryPropConfig } from "../types/props";

const PropConfigContext = createContext<MagicMemoryPropConfig | null>(null);

export const PropConfigProvider: React.FC<{
  value: MagicMemoryPropConfig;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <PropConfigContext.Provider value={value}>
      {children}
    </PropConfigContext.Provider>
  );
};

export const usePropConfig = () => useContext(PropConfigContext);
