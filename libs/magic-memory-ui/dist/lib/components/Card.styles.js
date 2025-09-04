"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const styles = react_native_1.StyleSheet.create({
    card: {
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    cardSide: {
        position: 'absolute',
        borderRadius: 10,
        backfaceVisibility: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'visible',
        width: '100%',
        height: '100%',
    },
    cardBackFace: {
        backgroundColor: 'transparent',
    },
    cardImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    cardBackText: {
        fontSize: 40,
        color: '#000',
    },
    hintOverlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hintBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderColor: 'rgba(232, 143, 64, 1)',
        borderRadius: 10,
        zIndex: 2,
    },
});
exports.default = styles;
