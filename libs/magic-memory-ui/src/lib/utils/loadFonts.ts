import * as Font from "expo-font";

let loaded = false;

export async function loadMagicMemoryFonts() {
  if (loaded) return;
  loaded = true;

  await Font.loadAsync({
    FredokaRegular: require("../../assets/fonts/Fredoka-Regular.ttf"),
    FredokaSemiBold: require("../../assets/fonts/Fredoka-SemiBold.ttf"),
    FredokaBold: require("../../assets/fonts/Fredoka-Bold.ttf"),
  });
}
