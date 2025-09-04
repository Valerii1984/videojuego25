"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const styles = react_native_1.StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        top: 0,
    },
    waveContainer: {
        position: 'absolute',
        width: '100%',
        height: 200, // Масштабируется в коде
        left: 0,
        top: 0,
    },
    waveTop: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backButton: {
        top: 30,
        left: 20,
        position: 'absolute',
        zIndex: 10,
    },
    title: {
        fontFamily: 'Fredoka',
        fontSize: 24,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 20,
    },
    levelsWrapper: {
        width: '100%',
        marginTop: 0,
        position: 'relative',
    },
    levelCard: {
        alignItems: 'center',
        marginBottom: 30,
    },
    // --- ОСНОВНОЙ КВАДРАТ КАРТОЧКИ ---
    cardBackground: {
        backgroundColor: '#5F81EE', // временно как фон; градиент ниже (опция)
        borderRadius: 30, // в Figma: Radius 30px
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        // opacity: 0.85,                // уберите, чтобы цвет был как в макете
        borderWidth: 3, // в Figma: Border 3px
        borderColor: 'rgba(75, 41, 154, 1)', // фиолетовый бордер как в Figma
    },
    // при выборе просто меняем цвет рамки
    cardBackgroundSelected: {
        borderColor: '#EBBA56',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    levelNumber: {
        fontFamily: 'Fredoka',
        fontWeight: '900',
        fontSize: 32,
        lineHeight: 38,
        letterSpacing: 0,
        color: '#FFFFFF',
        textAlign: 'center',
        minWidth: 18,
    },
    numberImage: {
        resizeMode: 'contain',
    },
    // --- МИНИ-КАРТА + “ГЕЛЕВАЯ” ЖЁЛТАЯ РАМКА ---
    cardIconWrapper: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardIcon: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    cardIconBorder: {
        position: 'absolute',
        top: -2, // рамка выступает наружу
        left: -2,
        width: 44,
        height: 44,
        borderRadius: 10,
        borderWidth: 2, // толще, как в макете
        borderColor: 'rgba(235,186,86,0.95)', // насыщённое золото
        zIndex: 2,
        pointerEvents: 'none',
    },
    difficulty: {
        marginTop: 6,
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
});
exports.default = styles;
