export type SupportedLocale = "en-US" | "de-DE" | "es-ES" | "es-419" | "fr-FR" | "it-IT" | "pt-BR";
export declare const mapToSupported: (raw?: string) => SupportedLocale;
export declare const STRINGS: Record<SupportedLocale, Record<"loading" | "level4" | "level6" | "level8" | "back" | "match" | "matchMessage" | "changeLanguage" | "friends" | "upgradePrompt" | "yes" | "no" | "time" | "moves" | "stars" | "congrats" | "playAgain", string>>;
