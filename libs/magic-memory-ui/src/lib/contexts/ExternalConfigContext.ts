import { createContext, useContext } from "react";
import type { MagicMemoryConfig } from "../types/external-config";

export const ExternalConfigContext = createContext<
  MagicMemoryConfig | undefined
>(undefined);

export const useExternalConfig = () => useContext(ExternalConfigContext);
