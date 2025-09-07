export type ImageURI = string;
export type LevelKey = 4 | 6 | 8 | 10 | 12;
export type PerLevelURIs = ImageURI | ImageURI[] | Partial<Record<LevelKey, ImageURI | ImageURI[]>>;
export interface MagicMemoryConfig {
    level?: LevelKey;
    lang: string;
    background?: PerLevelURIs;
    backCard?: PerLevelURIs;
    frontCards?: PerLevelURIs;
}
export declare const externalConfig: MagicMemoryConfig;
