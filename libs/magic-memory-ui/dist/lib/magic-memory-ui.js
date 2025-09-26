import { jsx as _jsx } from "react/jsx-runtime";
import GameScreen from "./screens/GameScreen"; // ← один экран, без Stack/NavigationContainer
import { PropConfigProvider } from "./contexts"; // ← ИМПОРТ ЧЕРЕЗ БАРРЕЛЬ!
/** Публичный компонент библиотеки: провайдер + экран. */
export const MagicMemory = ({ props }) => {
    return (_jsx(PropConfigProvider, { value: props, children: _jsx(GameScreen, {}) }));
};
export default MagicMemory;
