declare const containerStyles: {
    container: {
        flex: number;
    };
    gameArea: {
        flex: number;
        backgroundColor: string;
        justifyContent: "center";
        alignItems: "center";
        padding: number;
        zIndex: number;
    };
    background: {
        flex: number;
        width: "100%";
        height: "100%";
    };
    starsBackground: {
        position: "absolute";
        top: number;
        left: number;
        width: "100%";
        height: "100%";
        zIndex: number;
        resizeMode: "cover";
    };
    fullscreen: {
        flex: number;
        position: "relative";
    };
};
export default containerStyles;
