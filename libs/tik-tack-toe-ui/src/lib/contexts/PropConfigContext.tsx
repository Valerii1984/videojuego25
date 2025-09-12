import { createContext, useContext } from "react";
import { TicTacToePropConfig } from "../types/props";

export const TicTacToeConfigContext = createContext<TicTacToePropConfig | null>(
  null
);

export const useTicTacToeConfig = () => {
  const ctx = useContext(TicTacToeConfigContext);
  if (!ctx) {
    throw new Error("Missing <TicTacToeConfigProvider>");
  }
  return ctx;
};
