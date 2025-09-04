declare const progressBarStyles: {
    container: {
        width: number;
        height: number;
        marginBottom: number;
        alignItems: "flex-start";
        justifyContent: "center";
    };
    track: {
        width: "100%";
        height: "100%";
        backgroundColor: string;
        borderRadius: number;
        overflow: "hidden";
        borderWidth: number;
        borderColor: string;
    };
    fill: {
        height: "100%";
        borderRadius: number;
        overflow: "hidden";
    };
};
export default progressBarStyles;
