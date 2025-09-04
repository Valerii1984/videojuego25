declare const styles: {
    contentContainer: {
        flex: number;
        justifyContent: "center";
        alignItems: "center";
        position: "relative";
        opacity: number;
    };
    titleWrapper: {
        alignItems: "center";
        marginBottom: number;
        position: "relative";
        zIndex: number;
        width: number;
    };
    titleGlow: {
        position: "absolute";
        top: number;
        width: number;
        height: number;
        transform: {
            scale: number;
        }[];
        opacity: number;
        zIndex: number;
        resizeMode: "contain";
    };
    titleFon: {
        width: number;
        height: number;
        zIndex: number;
        resizeMode: "contain";
    };
    titleText: {
        position: "absolute";
        top: number;
        color: string;
        fontFamily: string;
        textAlign: "center";
        textAlignVertical: "center";
        letterSpacing: number;
        opacity: number;
        zIndex: number;
        transform: {
            scaleX: number;
        }[];
        textShadowColor: string;
        textShadowOffset: {
            width: number;
            height: number;
        };
        textShadowRadius: number;
        shadowColor: string;
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowRadius: number;
        shadowOpacity: number;
    };
    playButtonContainer: {
        position: "absolute";
        bottom: number;
        alignItems: "center";
        justifyContent: "center";
    };
    playGlow: {
        position: "absolute";
        width: number;
        height: number;
        borderRadius: number;
        top: number;
        left: number;
        zIndex: number;
        shadowColor: string;
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
    };
};
export default styles;
