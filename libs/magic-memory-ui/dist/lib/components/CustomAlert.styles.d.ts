declare const styles: {
    modalBackground: {
        flex: number;
        backgroundColor: string;
        justifyContent: "center";
        alignItems: "center";
        zIndex: number;
    };
    alertContainer: {
        backgroundColor: string;
        padding: number;
        borderRadius: number;
        alignItems: "center";
        zIndex: number;
        width: number;
        height: number;
    };
    gradientBackground: {
        flex: number;
        borderRadius: number;
    };
    innerContainer: {
        flex: number;
        justifyContent: "space-between";
        alignItems: "center";
        padding: number;
    };
    title: {
        fontSize: number;
        fontWeight: "bold";
        marginBottom: number;
        color: string;
        fontFamily: string;
    };
    message: {
        fontSize: number;
        marginBottom: number;
        textAlign: "center";
        color: string;
        fontFamily: string;
    };
    buttonContainer: {
        flexDirection: "row";
        justifyContent: "space-between";
        width: "100%";
        height: "35%";
    };
    button: {
        justifyContent: "center";
        alignItems: "center";
        width: "50%";
        height: "100%";
        borderTopWidth: number;
        borderColor: string;
    };
    yesButton: {
        backgroundColor: string;
        borderRightWidth: number;
        borderColor: string;
    };
    noButton: {
        backgroundColor: string;
        borderLeftWidth: number;
        borderColor: string;
    };
    buttonText: {
        color: string;
        fontWeight: "bold";
        fontFamily: string;
    };
};
export default styles;
