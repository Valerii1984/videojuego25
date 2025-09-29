import React from "react";
import { SupportedLocale } from "../i18n";
type Ctx = {
    language: SupportedLocale;
    setLanguage: (lang: SupportedLocale) => void;
};
export declare const LanguageProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useLanguage: () => Ctx;
export {};
