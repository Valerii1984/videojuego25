"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWeb = void 0;
const react_native_1 = require("react-native");
exports.isWeb = react_native_1.Platform.OS !== 'web';
