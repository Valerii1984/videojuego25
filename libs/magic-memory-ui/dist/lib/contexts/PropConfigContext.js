"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePropConfig = exports.PropConfigProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const PropConfigContext = (0, react_1.createContext)(null);
const PropConfigProvider = ({ value, children }) => {
    return ((0, jsx_runtime_1.jsx)(PropConfigContext.Provider, { value: value, children: children }));
};
exports.PropConfigProvider = PropConfigProvider;
const usePropConfig = () => (0, react_1.useContext)(PropConfigContext);
exports.usePropConfig = usePropConfig;
