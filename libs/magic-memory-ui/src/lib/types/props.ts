export type LevelKey = "2x2" | "3x3" | "4x4" | "5x5" | "6x6"; // если ещё используется где-то

export type MagicMemoryPropConfig = {
  // главное — возраст/сложность. Мы сразу заходим в игру и растём: 2x2 → 3x3 → … → 6x6
  age: number;

  // язык: клиент у себя просто укажет lang в пропсах или положится на язык устройства
  lang?: string; // "en" | "es" | "pt" | "pl" | ...
  language?: string; // альтернативное имя поля (на всякий случай)

  // фон и картинки карточек
  background: string | string[];
  backCardSide: string | string[];
  frontCardSide: string[]; // список url лицевых сторон (уникальные)
};
