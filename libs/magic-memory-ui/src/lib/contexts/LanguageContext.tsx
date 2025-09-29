import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as Localization from "expo-localization";
import { usePropConfig } from "./PropConfigContext";
import { mapToSupported, SupportedLocale } from "../i18n";

type Ctx = {
  language: SupportedLocale;

  setLanguage: (lang: SupportedLocale) => void;
};

const LanguageContext = createContext<Ctx>({
  language: "en-US",
  setLanguage: () => {},
});

const getDeviceLocale = (): SupportedLocale => {
  try {
    const list = (Localization as any)?.getLocales?.();
    if (Array.isArray(list) && list.length > 0) {
      const first = list[0];
      return mapToSupported(
        first.languageTag || first.tag || first.languageCode
      );
    }
    const legacy = (Localization as any)?.locale;
    return mapToSupported(legacy);
  } catch {
    return "en-US";
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cfg = usePropConfig();

  const initial = useMemo<SupportedLocale>(() => {
    const fromProp = cfg?.lang ? mapToSupported(cfg.lang) : undefined;
    return fromProp ?? getDeviceLocale() ?? "en-US";
  }, []);

  const [language, setLanguage] = useState<SupportedLocale>(initial);

  useEffect(() => {
    if (cfg?.lang) {
      setLanguage(mapToSupported(cfg.lang));
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
