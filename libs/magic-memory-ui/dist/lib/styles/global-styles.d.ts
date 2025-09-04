declare const globalStyles: {
    readonly roundButton: {
        base: {
            backgroundColor: string;
            borderColor: string;
            shadowColor: string;
            shadowOffset: {
                width: number;
                height: number;
            };
            shadowOpacity: number;
            shadowRadius: number;
            elevation: number;
            justifyContent: "center";
            alignItems: "center";
        };
        xs: {
            width: number;
            height: number;
            borderRadius: number;
            borderWidth: number;
        };
        sm: {
            width: number;
            height: number;
            borderRadius: number;
            borderWidth: number;
        };
        md: {
            width: number;
            height: number;
            borderRadius: number;
            borderWidth: number;
        };
        lg: {
            width: number;
            height: number;
            borderRadius: number;
            borderWidth: number;
        };
        xl: {
            width: number;
            height: number;
            borderRadius: number;
            borderWidth: number;
        };
        xxl: {
            width: number;
            height: number;
            borderRadius: number;
            borderWidth: number;
        };
        topLeft: {
            position: "absolute";
            top: number;
            left: number;
            zIndex: number;
            padding: number;
        };
        topRight: {
            position: "absolute";
            top: number;
            right: number;
            zIndex: number;
            padding: number;
        };
    };
    readonly progressBar: {
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
    readonly containers: {
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
};
export default globalStyles;
