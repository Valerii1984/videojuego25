"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useExternalConfig = exports.ExternalConfigContext = void 0;
const react_1 = require("react");
exports.ExternalConfigContext = (0, react_1.createContext)(undefined);
const useExternalConfig = () => (0, react_1.useContext)(exports.ExternalConfigContext);
exports.useExternalConfig = useExternalConfig;
