import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext<{
  language: string;
  setLanguage: (lang: string) => void;
}>({ language: 'en-US', setLanguage: () => {} });

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState('en-US');

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);