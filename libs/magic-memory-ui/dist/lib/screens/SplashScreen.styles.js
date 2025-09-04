"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const { width, height } = react_native_1.Dimensions.get('window');
const styles = react_native_1.StyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        opacity: 1,
    },
    titleWrapper: {
        alignItems: 'center',
        marginBottom: 200,
        position: 'relative',
        zIndex: 15,
        width: width * 0.8, // Динамическая ширина: 80% от ширины экрана
    },
    titleGlow: {
        position: 'absolute',
        top: -52,
        width: 221,
        height: 221,
        transform: [{ scale: 1.3 }],
        opacity: 0.85,
        zIndex: 2,
        resizeMode: 'contain',
    },
    titleFon: {
        width: 344,
        height: 100,
        zIndex: 1,
        resizeMode: 'contain',
    },
    titleText: {
        position: 'absolute',
        top: -5,
        color: '#FFFFFF',
        fontFamily: 'FredokaSemiBold',
        textAlign: 'center',
        textAlignVertical: 'center',
        letterSpacing: 0,
        opacity: 1,
        zIndex: 10,
        transform: [{ scaleX: 1.05 }],
        textShadowColor: '#C27CFF',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 5,
        shadowColor: '#C27CFF',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 15,
        shadowOpacity: 0.8,
    },
    playButtonContainer: {
        position: 'absolute',
        bottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playGlow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 130,
        top: -15,
        left: -13,
        zIndex: 0,
        shadowColor: 'rgba(197, 124, 255, 1)',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 40,
        elevation: 10,
    },
});
exports.default = styles;
