import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as Localization from "expo-localization";
import { usePropConfig } from "./PropConfigContext";

// Нормализация тега языка в короткий код
const normalizeLang = (raw?: string) => {
  if (!raw) return "en";
  const s = raw.toLowerCase();
  if (s.startsWith("en")) return "en";
  if (s.startsWith("es")) return "es";
  if (s.startsWith("pt")) return "pt";
  if (s.startsWith("pl")) return "pl";
  if (s.startsWith("uk")) return "uk";
  if (s.startsWith("ru")) return "ru";
  return s.length >= 2 ? s.slice(0, 2) : "en";
};

const getDeviceLang = () => {
  // Корректно для expo-localization ≥ 14: используем getLocales()
  const list = (Localization as any)?.getLocales?.();
  if (Array.isArray(list) && list.length > 0) {
    const first = list[0];
    // возможные поля: languageTag | tag | languageCode
    return normalizeLang(first.languageTag || first.tag || first.languageCode);
  }
  // старый фолбэк
  const legacy = (Localization as any)?.locale;
  return normalizeLang(legacy);
};

type Ctx = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<Ctx>({
  language: "en",
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cfg = usePropConfig(); // берём props { lang?: string } если есть
  const initialLang = useMemo(
    () => normalizeLang(cfg?.lang) || getDeviceLang() || "en",
    // cfg может меняться, но initial — только на самый первый маунт. Далее следим через useEffect ниже
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [language, setLanguage] = useState<string>(initialLang);

  // Если проп cfg.lang меняется — подхватываем сразу
  useEffect(() => {
    if (cfg?.lang) {
      setLanguage(normalizeLang(cfg.lang));
    }
  }, [cfg?.lang]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
