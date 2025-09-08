"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePropConfig = exports.PropConfigProvider = exports.PropConfigContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
// src/lib/contexts/PropConfigContext.tsx
const react_1 = require("react");
exports.PropConfigContext = (0, react_1.createContext)(null);
const PropConfigProvider = ({ value, children }) => ((0, jsx_runtime_1.jsx)(exports.PropConfigContext.Provider, { value: value, children: children }));
exports.PropConfigProvider = PropConfigProvider;
const usePropConfig = () => {
    const ctx = (0, react_1.useContext)(exports.PropConfigContext);
    return ctx;
};
exports.usePropConfig = usePropConfig;
