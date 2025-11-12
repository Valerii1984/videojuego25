import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  grid: {
    flexGrow: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingVertical: 10,
    paddingTop: 62,
  },
  row: {
    justifyContent: "space-around",
    marginVertical: 5,
  },

  /** ───────── Hint pill (фиолетовая, как в ТикТак) ───────── */
  // стало
  hintGlowPurple: {
    width: 78,
    height: 78,
    borderRadius: 39,
    justifyContent: "center",
    alignItems: "center",
    // чуть мягче и ровнее свет
    shadowColor: "rgba(144,33,232,0.8)",
    shadowOpacity: 1,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12, // Android свет
  },
  hintBorderPurple: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#C57CFF",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8E3BFF", // ← сплошной фон под градиентом, чтобы ничего не просвечивало
    overflow: "hidden",
  },
  hintButtonInnerPurple: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8E3BFF", // ← запасной сплошной фон
  },

  backButton: {
    position: "absolute",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "rgba(18, 18, 18, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    top: 34,
    left: 30,
    zIndex: 1000,
    padding: 8,
  },

  congratsContainer: {
    position: "absolute",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    top: "60%",
    transform: [{ translateY: -100 }],
    zIndex: 3500,
  },
  congratsGlow: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 125,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    shadowColor: "#C27CFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  congratsFon: {
    width: 344,
    height: 100,
    resizeMode: "contain",
    zIndex: 1,
  },
  congratsText: {
    position: "absolute",
    color: "#FFFFFF",
    fontSize: Math.min(40, width * 0.08),
    fontFamily: "FredokaSemiBold",
    textAlign: "center",
    zIndex: 10,
    textShadowColor: "rgba(197, 124, 255, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  playAgainButton: {
    position: "absolute",
    width: Math.min(200, width * 0.5),
    height: Math.min(68, height * 0.14),
    bottom: height * 0.15,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3000,
    overflow: "visible",
  },
  playAgainGradient: {
    flex: 1,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#C57CFF",
    backgroundColor: "#FFC965",
    shadowColor: "#C27CFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  playAgainContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  playAgainText: {
    fontFamily: "FredokaSemiBold",
    fontSize: Math.min(16, width * 0.04),
    color: "#C57CFF",
    lineHeight: Math.min(20, width * 0.05),
  },
  playIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "40%",
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
  },
});

export default styles;
