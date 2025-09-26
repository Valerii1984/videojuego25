import { jsx as _jsx } from "react/jsx-runtime";
import { ImageBackground } from "react-native";
import styles from "./CanvasBackground.styles";
const backgroundImage = require("../../assets/images/Background.png");
const CanvasBackground = ({ width, height, }) => {
    return (_jsx(ImageBackground, { source: backgroundImage, resizeMode: "cover", style: [styles.background, { width, height }] }));
};
export default CanvasBackground;
