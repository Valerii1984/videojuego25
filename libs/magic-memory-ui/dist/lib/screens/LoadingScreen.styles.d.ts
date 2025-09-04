declare const styles: {
    progressContainer: {
        position: "absolute";
        top: number;
        left: number;
        width: number;
        height: number;
        borderRadius: number;
        overflow: "hidden";
    };
    gradientBorder: {
        flex: number;
        borderRadius: number;
        padding: number;
    };
    innerBackground: {
        flex: number;
        borderRadius: number;
        backgroundColor: string;
        overflow: "hidden";
    };
    progressFill: {
        height: "100%";
        borderRadius: number;
        backgroundColor: string;
    };
    loadingTextWrapper: {
        position: "absolute";
        top: number;
        left: "50%";
        transform: {
            translateX: number;
        }[];
        height: number;
        flexDirection: "row";
        alignItems: "center";
    };
    hourglass: {
        width: number;
        height: number;
        marginRight: number;
    };
    loadingText: {
        fontFamily: string;
        fontSize: number;
        fontWeight: "600";
        lineHeight: number;
        color: string;
    };
    customBackPosition: {
        top: number;
        left: number;
    };
};
export default styles;
