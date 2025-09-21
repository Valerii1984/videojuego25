"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLanguage = exports.LanguageProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Localization = __importStar(require("expo-localization"));
const PropConfigContext_1 = require("./PropConfigContext");
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
    // Корректно для expo-localization ≥ 14: используем getLocales()
    const list = Localization?.getLocales?.();
    if (Array.isArray(list) && list.length > 0) {
        const first = list[0];
        // возможные поля: languageTag | tag | languageCode
        return normalizeLang(first.languageTag || first.tag || first.languageCode);
    }
    // старый фолбэк
    const legacy = Localization?.locale;
    return normalizeLang(legacy);
};
const LanguageContext = (0, react_1.createContext)({
    language: "en",
    setLanguage: () => { },
});
const LanguageProvider = ({ children, }) => {
    const cfg = (0, PropConfigContext_1.usePropConfig)(); // берём props { lang?: string } если есть
    const initialLang = (0, react_1.useMemo)(() => normalizeLang(cfg?.lang) || getDeviceLang() || "en", 
    // cfg может меняться, но initial — только на самый первый маунт. Далее следим через useEffect ниже
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    const [language, setLanguage] = (0, react_1.useState)(initialLang);
    // Если проп cfg.lang меняется — подхватываем сразу
    (0, react_1.useEffect)(() => {
        if (cfg?.lang) {
            setLanguage(normalizeLang(cfg.lang));
        }
    }, [cfg?.lang]);
    const value = (0, react_1.useMemo)(() => ({ language, setLanguage }), [language]);
    return ((0, jsx_runtime_1.jsx)(LanguageContext.Provider, { value: value, children: children }));
};
exports.LanguageProvider = LanguageProvider;
const useLanguage = () => (0, react_1.useContext)(LanguageContext);
exports.useLanguage = useLanguage;
