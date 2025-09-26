import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState, } from "react";
import * as Localization from "expo-localization";
import { usePropConfig } from "./PropConfigContext";
// Нормализация тега языка в короткий код
const normalizeLang = (raw) => {
    if (!raw)
        return "en";
    const s = raw.toLowerCase();
    if (s.startsWith("en"))
        return "en";
    if (s.startsWith("es"))
        return "es";
    if (s.startsWith("pt"))
        return "pt";
    if (s.startsWith("pl"))
        return "pl";
    if (s.startsWith("uk"))
        return "uk";
    if (s.startsWith("ru"))
        return "ru";
    return s.length >= 2 ? s.slice(0, 2) : "en";
};
const getDeviceLang = () => {
    var _a;
    // Корректно для expo-localization ≥ 14: используем getLocales()
    const list = (_a = Localization === null || Localization === void 0 ? void 0 : Localization.getLocales) === null || _a === void 0 ? void 0 : _a.call(Localization);
    if (Array.isArray(list) && list.length > 0) {
        const first = list[0];
        // возможные поля: languageTag | tag | languageCode
        return normalizeLang(first.languageTag || first.tag || first.languageCode);
    }
    // старый фолбэк
    const legacy = Localization === null || Localization === void 0 ? void 0 : Localization.locale;
    return normalizeLang(legacy);
};
const LanguageContext = createContext({
    language: "en",
    setLanguage: () => { },
});
export const LanguageProvider = ({ children, }) => {
    const cfg = usePropConfig(); // берём props { lang?: string } если есть
    const initialLang = useMemo(() => normalizeLang(cfg === null || cfg === void 0 ? void 0 : cfg.lang) || getDeviceLang() || "en", 
    // cfg может меняться, но initial — только на самый первый маунт. Далее следим через useEffect ниже
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    const [language, setLanguage] = useState(initialLang);
    // Если проп cfg.lang меняется — подхватываем сразу
    useEffect(() => {
        if (cfg === null || cfg === void 0 ? void 0 : cfg.lang) {
            setLanguage(normalizeLang(cfg.lang));
        }
    }, [cfg === null || cfg === void 0 ? void 0 : cfg.lang]);
    const value = useMemo(() => ({ language, setLanguage }), [language]);
    return (_jsx(LanguageContext.Provider, { value: value, children: children }));
};
export const useLanguage = () => useContext(LanguageContext);
