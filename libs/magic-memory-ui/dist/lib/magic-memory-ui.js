import { jsx as _jsx } from "react/jsx-runtime";
import GameScreen from "./screens/GameScreen";
import { PropConfigProvider } from "./contexts/PropConfigContext";
import { SoundProvider } from "./contexts/SoundContext";
export const MagicMemory = ({ props }) => {
    return (_jsx(SoundProvider, { children: _jsx(PropConfigProvider, { value: props, children: _jsx(GameScreen, {}) }) }));
};
export default MagicMemory;
