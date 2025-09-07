"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicMemoryUi = MagicMemoryUi;
const jsx_runtime_1 = require("react/jsx-runtime");
const ExternalConfigContext_1 = require("./contexts/ExternalConfigContext");
const GameScreen_1 = __importDefault(require("./screens/GameScreen"));
/**
 * Корневой компонент библиотеки.
 * Принимает externalConfig и прокидывает его через контекст на экраны.
 */
function MagicMemoryUi({ externalConfig }) {
    return ((0, jsx_runtime_1.jsx)(ExternalConfigContext_1.ExternalConfigContext.Provider, { value: externalConfig, children: (0, jsx_runtime_1.jsx)(GameScreen_1.default, {}) }));
}
exports.default = MagicMemoryUi;
