import React from "react";
type Ctx = {
    language: string;
    setLanguage: (lang: string) => void;
};
export declare const LanguageProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useLanguage: () => Ctx;
export {};
