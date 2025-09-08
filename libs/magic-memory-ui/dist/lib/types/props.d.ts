export type LevelKey = 4 | 6 | 8 | 10 | 12;
/**
 * Конфиг, который приходит ИЗВНЕ в библиотеку (через пропсы).
 * Никаких ассетов — только URL.
 */
export interface MagicMemoryPropConfig {
    /** Стартовый уровень, если не придёт через route.params */
    level: LevelKey;
    /** Язык интерфейса, например 'es' | 'en' */
    lang: string;
    /** Фон: одиночный URL или массив URL (на каждый старт берём случайный) */
    background: string;
    /** Рубашка: одиночный URL или массив URL (на каждый старт берём случайный) */
    backCardSide: string | string[];
    /**
     * Лица карт: массив URL. Минимум level/2 уникальных URL.
     * (для 6 — минимум 3; для 8 — минимум 4, и т.д.)
     */
    frontCardSide: string[];
}
