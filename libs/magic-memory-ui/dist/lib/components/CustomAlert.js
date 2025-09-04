"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
const CustomAlert_styles_1 = __importDefault(require("./CustomAlert.styles"));
const expo_linear_gradient_1 = require("expo-linear-gradient");
const CustomAlert = ({ visible, onClose, title, message, onYes, onNo, }) => {
    return ((0, jsx_runtime_1.jsx)(react_native_1.Modal, { transparent: true, visible: visible, animationType: "fade", hardwareAccelerated: true, presentationStyle: "overFullScreen", onRequestClose: onClose, statusBarTranslucent: true, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: CustomAlert_styles_1.default.modalBackground, children: (0, jsx_runtime_1.jsx)(react_native_1.View, { style: CustomAlert_styles_1.default.alertContainer, children: (0, jsx_runtime_1.jsxs)(expo_linear_gradient_1.LinearGradient, { colors: ['#25165F', '#50197D'], style: CustomAlert_styles_1.default.gradientBackground, children: [(0, jsx_runtime_1.jsxs)(react_native_1.View, { style: CustomAlert_styles_1.default.innerContainer, children: [typeof title === 'string' ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { style: CustomAlert_styles_1.default.title, children: title })) : (title), typeof message === 'string' ? ((0, jsx_runtime_1.jsx)(react_native_1.Text, { style: CustomAlert_styles_1.default.message, children: message })) : (message)] }), (0, jsx_runtime_1.jsxs)(react_native_1.View, { style: CustomAlert_styles_1.default.buttonContainer, children: [(0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [CustomAlert_styles_1.default.button, CustomAlert_styles_1.default.yesButton], onPress: onYes, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: CustomAlert_styles_1.default.buttonText, children: "Yes" }) }), (0, jsx_runtime_1.jsx)(react_native_1.TouchableOpacity, { style: [CustomAlert_styles_1.default.button, CustomAlert_styles_1.default.noButton], onPress: onNo, children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { style: CustomAlert_styles_1.default.buttonText, children: "No" }) })] })] }) }) }) }));
};
exports.default = CustomAlert;
