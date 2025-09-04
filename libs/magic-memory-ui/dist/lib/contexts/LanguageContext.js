"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLanguage = exports.LanguageProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const LanguageContext = (0, react_1.createContext)({ language: 'en-US', setLanguage: () => { } });
const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = (0, react_1.useState)('en-US');
    return (0, jsx_runtime_1.jsx)(LanguageContext.Provider, { value: { language, setLanguage }, children: children });
};
exports.LanguageProvider = LanguageProvider;
const useLanguage = () => (0, react_1.useContext)(LanguageContext);
exports.useLanguage = useLanguage;
