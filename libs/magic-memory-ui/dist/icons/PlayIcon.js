"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_native_svg_1 = __importStar(require("react-native-svg"));
function PlayIcon(props) {
    return ((0, jsx_runtime_1.jsx)(react_native_svg_1.default, { width: 36, height: 38, viewBox: "0 0 36 38", fill: "none", xmlns: "http://www.w3.org/2000/svg", ...props, children: (0, jsx_runtime_1.jsx)(react_native_svg_1.Path, { d: "M32.356 20.762c-.737 2.798-4.217 4.776-11.177 8.73-6.729 3.822-10.093 5.734-12.804 4.966a6.78 6.78 0 01-2.966-1.752C3.417 30.696 3.417 26.797 3.417 19s0-11.696 1.992-13.706a6.779 6.779 0 012.966-1.751c2.711-.769 6.075 1.143 12.804 4.965 6.96 3.954 10.44 5.932 11.177 8.73a6.928 6.928 0 010 3.524z", stroke: "#FAFAFA", strokeWidth: 5.55555, strokeLinejoin: "round" }) }));
}
exports.default = PlayIcon;
