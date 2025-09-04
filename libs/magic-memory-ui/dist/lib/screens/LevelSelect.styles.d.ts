declare const styles: {
    container: {
        position: "absolute";
        width: "100%";
        alignItems: "center";
        top: number;
    };
    waveContainer: {
        position: "absolute";
        width: "100%";
        height: number;
        left: number;
        top: number;
    };
    waveTop: {
        width: "100%";
        height: "100%";
        resizeMode: "cover";
    };
    backButton: {
        top: number;
        left: number;
        position: "absolute";
        zIndex: number;
    };
    title: {
        fontFamily: string;
        fontSize: number;
        fontWeight: "700";
        color: string;
        textAlign: "center";
        marginTop: number;
        marginBottom: number;
    };
    levelsWrapper: {
        width: "100%";
        marginTop: number;
        position: "relative";
    };
    levelCard: {
        alignItems: "center";
        marginBottom: number;
    };
    cardBackground: {
        backgroundColor: string;
        borderRadius: number;
        justifyContent: "center";
        alignItems: "center";
        overflow: "hidden";
        borderWidth: number;
        borderColor: string;
    };
    cardBackgroundSelected: {
        borderColor: string;
    };
    cardContent: {
        flexDirection: "row";
        alignItems: "center";
        gap: number;
    };
    levelNumber: {
        fontFamily: string;
        fontWeight: "900";
        fontSize: number;
        lineHeight: number;
        letterSpacing: number;
        color: string;
        textAlign: "center";
        minWidth: number;
    };
    numberImage: {
        resizeMode: "contain";
    };
    cardIconWrapper: {
        width: number;
        height: number;
        justifyContent: "center";
        alignItems: "center";
    };
    cardIcon: {
        width: number;
        height: number;
        borderRadius: number;
    };
    cardIconBorder: {
        position: "absolute";
        top: number;
        left: number;
        width: number;
        height: number;
        borderRadius: number;
        borderWidth: number;
        borderColor: string;
        zIndex: number;
        pointerEvents: "none";
    };
    difficulty: {
        marginTop: number;
        fontSize: number;
        fontWeight: "500";
        color: string;
    };
};
export default styles;
