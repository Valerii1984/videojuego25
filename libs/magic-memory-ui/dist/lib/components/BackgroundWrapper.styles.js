"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const { width, height } = react_native_1.Dimensions.get('window');
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#16103E',
        overflow: 'hidden',
    },
    fullGradient: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        height: '100%',
    },
    overlay: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
    },
    content: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
    },
});
exports.default = styles;
