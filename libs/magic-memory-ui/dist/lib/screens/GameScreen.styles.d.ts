declare const styles: {
    grid: {
        flexGrow: number;
        justifyContent: "flex-end";
        alignItems: "center";
        paddingVertical: number;
        paddingTop: number;
    };
    row: {
        justifyContent: "space-around";
        marginVertical: number;
    };
    statsPanel: {
        position: "absolute";
        flexDirection: "row";
        justifyContent: "center";
        alignItems: "center";
        top: number;
        width: "90%";
        alignSelf: "center";
        zIndex: number;
        padding: number;
        flexWrap: "wrap";
    };
    statsItem: {
        backgroundColor: string;
        padding: number;
        borderRadius: number;
        marginHorizontal: number;
        minWidth: number;
        flexShrink: number;
        flexGrow: number;
        alignItems: "center";
    };
    statsText: {
        color: string;
        fontSize: number;
        fontFamily: string;
        textAlign: "center";
    };
    hintButton: {
        position: "absolute";
        width: number;
        height: number;
        borderRadius: number;
        justifyContent: "center";
        alignItems: "center";
        zIndex: number;
        top: number;
        right: number;
    };
    hintGlow: {
        width: number;
        height: number;
        borderRadius: number;
        justifyContent: "center";
        alignItems: "center";
        elevation: number;
        shadowColor: string;
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
    };
    hintBorder: {
        width: number;
        height: number;
        borderRadius: number;
        borderWidth: number;
        borderColor: string;
        justifyContent: "center";
        alignItems: "center";
        zIndex: number;
        backgroundColor: string;
    };
    hintButtonInner: {
        width: number;
        height: number;
        borderRadius: number;
        justifyContent: "center";
        alignItems: "center";
    };
    hintText: {
        color: string;
        fontSize: number;
        fontFamily: string;
        textAlign: "center";
    };
    backButton: {
        position: "absolute";
        width: number;
        height: number;
        borderRadius: number;
        backgroundColor: string;
        justifyContent: "center";
        alignItems: "center";
        top: number;
        left: number;
        zIndex: number;
        padding: number;
    };
    congratsContainer: {
        position: "absolute";
        alignSelf: "center";
        alignItems: "center";
        justifyContent: "center";
        top: "60%";
        transform: {
            translateY: number;
        }[];
        zIndex: number;
    };
    congratsGlow: {
        position: "absolute";
        width: number;
        height: number;
        borderRadius: number;
        justifyContent: "center";
        alignItems: "center";
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
    congratsFon: {
        width: number;
        height: number;
        resizeMode: "contain";
        zIndex: number;
    };
    congratsText: {
        position: "absolute";
        color: string;
        fontSize: number;
        fontFamily: string;
        textAlign: "center";
        zIndex: number;
        textShadowColor: string;
        textShadowOffset: {
            width: number;
            height: number;
        };
        textShadowRadius: number;
    };
    playAgainButton: {
        position: "absolute";
        width: number;
        height: number;
        bottom: number;
        alignSelf: "center";
        justifyContent: "center";
        alignItems: "center";
        zIndex: number;
        overflow: "visible";
    };
    playAgainGradient: {
        flex: number;
        borderRadius: number;
        borderWidth: number;
        borderColor: string;
        backgroundColor: string;
        shadowColor: string;
        shadowOffset: {
            width: number;
            height: number;
        };
        shadowOpacity: number;
        shadowRadius: number;
        elevation: number;
        width: "100%";
        height: "100%";
        justifyContent: "center";
        alignItems: "center";
    };
    playAgainContent: {
        flexDirection: "row";
        justifyContent: "center";
        alignItems: "center";
        paddingHorizontal: number;
        paddingVertical: number;
        gap: number;
        backgroundColor: string;
        borderRadius: number;
    };
    playAgainText: {
        fontFamily: string;
        fontSize: number;
        color: string;
        lineHeight: number;
    };
    playIcon: {
        width: number;
        height: number;
        resizeMode: "contain";
    };
    overlay: {
        position: "absolute";
        width: "100%";
        height: "40%";
        bottom: number;
        borderTopLeftRadius: number;
        borderTopRightRadius: number;
        zIndex: number;
        backgroundColor: string;
    };
};
export default styles;
