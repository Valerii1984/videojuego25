"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicMemory = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const native_1 = require("@react-navigation/native");
const native_stack_1 = require("@react-navigation/native-stack");
const GameScreen_1 = __importDefault(require("./screens/GameScreen"));
const LanguageContext_1 = require("./contexts/LanguageContext");
const SoundContext_1 = require("./contexts/SoundContext");
const Stack = (0, native_stack_1.createNativeStackNavigator)();
const MagicMemory = ({ props }) => {
    return ((0, jsx_runtime_1.jsx)(LanguageContext_1.LanguageProvider, { children: (0, jsx_runtime_1.jsx)(SoundContext_1.SoundProvider, { children: (0, jsx_runtime_1.jsx)(native_1.NavigationContainer, { children: (0, jsx_runtime_1.jsx)(Stack.Navigator, { initialRouteName: "GameScreen", screenOptions: { headerShown: false }, children: (0, jsx_runtime_1.jsx)(Stack.Screen, { name: "GameScreen", component: GameScreen_1.default, initialParams: { level: props.age, config: props } }) }) }) }) }));
};
exports.MagicMemory = MagicMemory;
exports.default = exports.MagicMemory;
