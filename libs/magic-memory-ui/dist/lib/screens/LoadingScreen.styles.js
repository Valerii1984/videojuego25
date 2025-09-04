"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const styles = react_native_1.StyleSheet.create({
    progressContainer: {
        position: 'absolute',
        top: 170,
        left: 200,
        width: 420,
        height: 53,
        borderRadius: 20,
        overflow: 'hidden',
    },
    gradientBorder: {
        flex: 1,
        borderRadius: 20,
        padding: 2, // толщина рамки
    },
    innerBackground: {
        flex: 1,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.8)',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 18,
        backgroundColor: '#7500D1',
    },
    loadingTextWrapper: {
        position: 'absolute',
        top: 12.5,
        left: '50%',
        transform: [{ translateX: -50 }],
        height: 28,
        flexDirection: 'row',
        alignItems: 'center',
    },
    hourglass: {
        width: 28,
        height: 28,
        marginRight: 10,
    },
    loadingText: {
        fontFamily: 'Fredoka',
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 22,
        color: '#FFFFFF',
    },
    customBackPosition: {
        top: 40,
        left: 26,
    },
});
exports.default = styles;
