import React from 'react';
export declare const LanguageProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useLanguage: () => {
    language: string;
    setLanguage: (lang: string) => void;
};
