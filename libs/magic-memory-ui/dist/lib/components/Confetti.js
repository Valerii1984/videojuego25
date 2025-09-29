import { jsx as _jsx } from "react/jsx-runtime";
import LottieView from "lottie-react-native";
const Confetti = ({ isActive, level }) => {
    if (!isActive)
        return null;
    return (_jsx(LottieView, { source: require("../../assets/animations/success-animation.json"), autoPlay: true, loop: true, speed: 0.5, style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1000,
        } }));
};
export default Confetti;
