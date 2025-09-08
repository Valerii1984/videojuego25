"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicMemory = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const native_1 = require("@react-navigation/native");
const AppNavigator_1 = require("./navigation/AppNavigator");
const PropConfigContext_1 = require("./contexts/PropConfigContext");
const LanguageContext_1 = require("./contexts/LanguageContext");
const MagicMemory = ({ props }) => {
    // ВАЖНО: убрали initialLanguage — ваш LanguageProvider его не принимает.
    // Язык из props.lang вы можете выставлять внутри GameScreen, если в контексте есть setter.
    return ((0, jsx_runtime_1.jsx)(PropConfigContext_1.PropConfigProvider, { value: props, children: (0, jsx_runtime_1.jsx)(LanguageContext_1.LanguageProvider, { children: (0, jsx_runtime_1.jsx)(native_1.NavigationContainer, { children: (0, jsx_runtime_1.jsx)(AppNavigator_1.AppNavigator, {}) }) }) }));
};
exports.MagicMemory = MagicMemory;
