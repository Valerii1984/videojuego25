import { jsx as _jsx } from "react/jsx-runtime";
import GameScreen from "./screens/GameScreen";
import { PropConfigProvider } from "./contexts/PropConfigContext";
import { SoundProvider } from "./contexts/SoundContext";
/**
 * Главный компонент библиотеки.
 * Оборачивает экран в SoundProvider (фон/голоса) и PropConfigProvider (настройки).
 */
export const MagicMemory = ({ props }) => {
    return (_jsx(SoundProvider, { children: _jsx(PropConfigProvider, { value: props, children: _jsx(GameScreen, {}) }) }));
};
export default MagicMemory;
