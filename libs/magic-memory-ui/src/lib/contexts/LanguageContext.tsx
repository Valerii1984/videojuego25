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
    // ONLY cfg.language now → if missing, fallback to system → en-US
    const fromLanguageProp = (cfg && (cfg as any).language) as
      | string
      | undefined;

    if (fromLanguageProp) return mapToSupported(fromLanguageProp);
    return getDeviceLocale() ?? "en-US";
  }, [cfg]);

  const [language, setLanguage] = useState<SupportedLocale>(initial);

  useEffect(() => {
    // Apply external update ONLY from cfg.language
    const fromLanguageProp = (cfg && (cfg as any).language) as
      | string
      | undefined;

    if (fromLanguageProp) {
      setLanguage(mapToSupported(fromLanguageProp));
    }
  }, [cfg?.language]);

  const value = useMemo(() => ({ language, setLanguage }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
