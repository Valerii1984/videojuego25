declare const styles: {
    card: {
        margin: number;
        justifyContent: "center";
        alignItems: "center";
        position: "relative";
    };
    cardSide: {
        position: "absolute";
        borderRadius: number;
        backfaceVisibility: "hidden";
        justifyContent: "center";
        alignItems: "center";
        overflow: "visible";
        width: "100%";
        height: "100%";
    };
    cardBackFace: {
        backgroundColor: string;
    };
    cardImage: {
        width: "100%";
        height: "100%";
        borderRadius: number;
    };
    cardBackText: {
        fontSize: number;
        color: string;
    };
    hintOverlay: {
        position: "absolute";
        width: "100%";
        height: "100%";
        justifyContent: "center";
        alignItems: "center";
    };
    hintBorder: {
        position: "absolute";
        top: number;
        left: number;
        right: number;
        bottom: number;
        borderColor: string;
        borderRadius: number;
        zIndex: number;
    };
};
export default styles;
