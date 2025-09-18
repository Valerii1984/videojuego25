import { ViewStyle } from "react-native";
import { RouteProp } from "@react-navigation/native";

/** -----------------------------
 *  Карточки (игровые типы)
 * ----------------------------- */
export interface Card {
  id: number;
  value: CardValue;
  isFlipped: boolean;
  isMatched: boolean;
  isHidden?: boolean;
  isSelected?: boolean;
}

export type CardValue =
  | "cardFace-1"
  | "cardFace-2"
  | "cardFace-3"
  | "cardFace-4"
  | "cardFace-5"
  | "cardFace-6"
  | "boy"
  | "donkey"
  | "girl"
  | "kengoo"
  | "owl"
  | "pig"
  | "puh"
  | "tigr";

/** -----------------------------
 *  Навигация
 * ----------------------------- */
export type RootParamList = {
  MagicMemorySplashScreen: undefined;
  MagicMemoryLoadingScreen: undefined;
  LevelSelect: undefined;
  MagicMemoryGameScreen: { age: number };
};

export type ScreenProps<T extends keyof RootParamList> = {
  navigation: any;
  route: RouteProp<RootParamList, T>;
};

/** -----------------------------
 *  Языки
 * ----------------------------- */

/**
 * Полный (исторический) список BCP-47 тэгов, если где-то нужен.
 * Оставляем для совместимости с существующим кодом i18n.
 */
export type Language =
  | "en-US"
  | "de-DE"
  | "es-ES"
  | "es-419"
  | "fr-FR"
  | "pl-PL"
  | "it-IT"
  | "pt-BR";

/**
 * НОВЫЙ строгий список коротких кодов языка,
 * который используем в пропсах внешней конфигурации.
 * При необходимости маппим его на BCP-47 внутри провайдера i18n.
 */
export type SupportedLang = "en" | "es" | "uk";

/** -----------------------------
 *  i18n переводы
 * ----------------------------- */
export interface Translation {
  loading: string;
  level4: string;
  level6: string;
  level8: string;
  back: string;
  match: string;
  matchMessage: string;
  changeLanguage: string;
  friends: string;
  upgradePrompt: string;
  yes: string;
  no: string;
}

/** -----------------------------
 *  Пропсы компонентов
 * ----------------------------- */
export interface CardProps {
  item: Card;
  onPress: (id: number) => void;
  getCardSize: () => number;
  disabled?: boolean;
  isHinted?: boolean;
  style?: ViewStyle;
  pointerEvents?: "auto" | "none" | "box-none" | "box-only";
}
