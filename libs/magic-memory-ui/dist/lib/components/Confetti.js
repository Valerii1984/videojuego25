"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const lottie_react_native_1 = __importDefault(require("lottie-react-native"));
const Confetti = ({ isActive, level }) => {
    if (!isActive)
        return null;
    return ((0, jsx_runtime_1.jsx)(lottie_react_native_1.default, { source: require("../../assets/animations/success-animation.json"), autoPlay: true, loop: true, speed: 0.5, style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%", // Растянуть по ширине экрана
            height: "100%", // Растянуть по высоте экрана
            zIndex: 1000,
        } }));
};
exports.default = Confetti;
