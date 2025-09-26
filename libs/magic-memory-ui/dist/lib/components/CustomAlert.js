import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import styles from './CustomAlert.styles';
import { LinearGradient } from 'expo-linear-gradient';
const CustomAlert = ({ visible, onClose, title, message, onYes, onNo, }) => {
    return (_jsx(Modal, { transparent: true, visible: visible, animationType: "fade", hardwareAccelerated: true, presentationStyle: "overFullScreen", onRequestClose: onClose, statusBarTranslucent: true, children: _jsx(View, { style: styles.modalBackground, children: _jsx(View, { style: styles.alertContainer, children: _jsxs(LinearGradient, { colors: ['#25165F', '#50197D'], style: styles.gradientBackground, children: [_jsxs(View, { style: styles.innerContainer, children: [typeof title === 'string' ? (_jsx(Text, { style: styles.title, children: title })) : (title), typeof message === 'string' ? (_jsx(Text, { style: styles.message, children: message })) : (message)] }), _jsxs(View, { style: styles.buttonContainer, children: [_jsx(TouchableOpacity, { style: [styles.button, styles.yesButton], onPress: onYes, children: _jsx(Text, { style: styles.buttonText, children: "Yes" }) }), _jsx(TouchableOpacity, { style: [styles.button, styles.noButton], onPress: onNo, children: _jsx(Text, { style: styles.buttonText, children: "No" }) })] })] }) }) }) }));
};
export default CustomAlert;
