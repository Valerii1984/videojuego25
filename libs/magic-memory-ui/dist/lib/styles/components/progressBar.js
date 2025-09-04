"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const progressBarStyles = react_native_1.StyleSheet.create({
    container: {
        width: 420,
        height: 52,
        marginBottom: 32,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    track: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#999',
    },
    fill: {
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
    },
});
exports.default = progressBarStyles;
