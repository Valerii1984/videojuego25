"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layout = Layout;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_1 = require("react-native");
function Layout(props) {
    return ((0, jsx_runtime_1.jsx)(react_native_1.View, { children: (0, jsx_runtime_1.jsx)(react_native_1.Text, { children: "Welcome to layout!" }) }));
}
exports.default = Layout;
