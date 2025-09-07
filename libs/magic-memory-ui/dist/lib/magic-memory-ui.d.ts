import type { MagicMemoryConfig } from "./types/external-config";
export interface MagicMemoryUiProps {
    /** Внешний конфиг (фон/рубашка/лица карт). Необязателен. */
    externalConfig?: MagicMemoryConfig;
}
/**
 * Корневой компонент библиотеки.
 * Принимает externalConfig и прокидывает его через контекст на экраны.
 */
export declare function MagicMemoryUi({ externalConfig }: MagicMemoryUiProps): import("react/jsx-runtime").JSX.Element;
export default MagicMemoryUi;
