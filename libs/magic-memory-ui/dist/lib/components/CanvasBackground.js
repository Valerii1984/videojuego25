"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const CanvasBackground_styles_1 = __importDefault(require("./CanvasBackground.styles"));
const backgroundImage = require("../../assets/images/Background.png");
const CanvasBackground = ({ width, height, }) => {
    return ((0, jsx_runtime_1.jsx)(react_native_1.ImageBackground, { source: backgroundImage, resizeMode: "cover", style: [CanvasBackground_styles_1.default.background, { width, height }] }));
};
exports.default = CanvasBackground;
