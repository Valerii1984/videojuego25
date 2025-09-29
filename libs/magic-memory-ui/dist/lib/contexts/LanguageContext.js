import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useState, } from "react";
import * as Localization from "expo-localization";
import { usePropConfig } from "./PropConfigContext";
import { mapToSupported } from "../i18n";
const LanguageContext = createContext({
    language: "en-US",
    setLanguage: () => { },
});
const getDeviceLocale = () => {
    var _a;
    try {
        const list = (_a = Localization === null || Localization === void 0 ? void 0 : Localization.getLocales) === null || _a === void 0 ? void 0 : _a.call(Localization);
        if (Array.isArray(list) && list.length > 0) {
            const first = list[0];
            return mapToSupported(first.languageTag || first.tag || first.languageCode);
        }
        const legacy = Localization === null || Localization === void 0 ? void 0 : Localization.locale;
        return mapToSupported(legacy);
    }
    catch {
        return "en-US";
    }
};
export const LanguageProvider = ({ children, }) => {
    const cfg = usePropConfig();
    const initial = useMemo(() => {
        var _a;
        const fromProp = (cfg === null || cfg === void 0 ? void 0 : cfg.lang) ? mapToSupported(cfg.lang) : undefined;
        return (_a = fromProp !== null && fromProp !== void 0 ? fromProp : getDeviceLocale()) !== null && _a !== void 0 ? _a : "en-US";
    }, []);
    const [language, setLanguage] = useState(initial);
    useEffect(() => {
        if (cfg === null || cfg === void 0 ? void 0 : cfg.lang) {
            setLanguage(mapToSupported(cfg.lang));
        }
    }, [cfg === null || cfg === void 0 ? void 0 : cfg.lang]);
    const value = useMemo(() => ({ language, setLanguage }), [language]);
    return (_jsx(LanguageContext.Provider, { value: value, children: children }));
};
export const useLanguage = () => useContext(LanguageContext);
