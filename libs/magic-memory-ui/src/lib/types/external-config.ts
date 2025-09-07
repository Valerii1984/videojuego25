// external-config.ts
export type ImageURI = string;
export type LevelKey = 4 | 6 | 8 | 10 | 12;

export type PerLevelURIs =
  | ImageURI
  | ImageURI[]
  | Partial<Record<LevelKey, ImageURI | ImageURI[]>>;

export interface MagicMemoryConfig {
  level?: LevelKey;
  lang: string;
  background?: PerLevelURIs;
  backCard?: PerLevelURIs;
  frontCards?: PerLevelURIs;
}

// ⚡ Рабочий конфиг для теста
export const externalConfig: MagicMemoryConfig = {
  level: 6,
  lang: "es",
  background: [
    "https://picsum.photos/id/1015/800/600",
    "https://picsum.photos/id/1025/800/600",
    "https://picsum.photos/id/1035/800/600",
  ],
  backCard: [
    "https://picsum.photos/id/200/200/300",
    "https://picsum.photos/id/201/200/300",
  ],
  frontCards: {
    4: [
      "https://picsum.photos/id/301/200/300",
      "https://picsum.photos/id/302/200/300",
    ],
    6: [
      "https://picsum.photos/id/303/200/300",
      "https://picsum.photos/id/304/200/300",
      "https://picsum.photos/id/305/200/300",
    ],
    8: [
      "https://picsum.photos/id/306/200/300",
      "https://picsum.photos/id/307/200/300",
      "https://picsum.photos/id/308/200/300",
      "https://picsum.photos/id/309/200/300",
    ],
    10: [
      "https://picsum.photos/id/310/200/300",
      "https://picsum.photos/id/311/200/300",
      "https://picsum.photos/id/312/200/300",
      "https://picsum.photos/id/313/200/300",
      "https://picsum.photos/id/314/200/300",
    ],
    12: [
      "https://picsum.photos/id/315/200/300",
      "https://picsum.photos/id/316/200/300",
      "https://picsum.photos/id/317/200/300",
      "https://picsum.photos/id/318/200/300",
      "https://picsum.photos/id/319/200/300",
      "https://picsum.photos/id/320/200/300",
    ],
  },
};
