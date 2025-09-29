import { StyleSheet, ImageStyle } from "react-native";

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    top: 0,
  },
  waveContainer: {
    position: "absolute",
    width: "100%",
    height: 200,
    left: 0,
    top: 0,
  },
  waveTop: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    top: 30,
    left: 20,
    position: "absolute",
    zIndex: 10,
  },
  title: {
    fontFamily: "Fredoka",
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  levelsWrapper: {
    width: "100%",
    marginTop: 0,
    position: "relative",
  },
  levelCard: {
    alignItems: "center",
    marginBottom: 30,
  },

  cardBackground: {
    backgroundColor: "#5F81EE",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",

    borderWidth: 3,
    borderColor: "rgba(75, 41, 154, 1)",
  },

  cardBackgroundSelected: {
    borderColor: "#EBBA56",
  },

  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  levelNumber: {
    fontFamily: "Fredoka",
    fontWeight: "900" as const,
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: 0,
    color: "#FFFFFF",
    textAlign: "center",
    minWidth: 18,
  },
  numberImage: {
    resizeMode: "contain",
  },

  cardIconWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  cardIconBorder: {
    position: "absolute",
    top: -2,
    left: -2,
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(235,186,86,0.95)",

    zIndex: 2,
    pointerEvents: "none",
  },

  difficulty: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500" as const,
    color: "#FFFFFF",
  },
});

export default styles;
