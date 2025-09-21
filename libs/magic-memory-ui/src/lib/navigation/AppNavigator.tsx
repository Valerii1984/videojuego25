import { useEffect, useState } from "react";
import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LanguageProvider } from "../contexts/LanguageContext";
import { SoundProvider, useSound } from "../contexts/SoundContext";
import * as Font from "expo-font";
import {
  StatusBar,
  Platform,
  View,
  AppState,
  Keyboard,
  Dimensions,
} from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import { isWeb } from "../utils/config";
import { enableScreens } from "react-native-screens";
import GameScreen from "../screens/GameScreen";

enableScreens();

const Stack = createNativeStackNavigator();

const InnerNavigator = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { playBackgroundMusic } = useSound();

  const lockLandscape = async () => {
    try {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      }
    } catch {}
  };

  const applyImmersive = async () => {
    if (Platform.OS !== "android") return;
    try {
      await NavigationBar.setBackgroundColorAsync("#16103E");
      await NavigationBar.setVisibilityAsync("hidden");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    } catch {}
  };

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          Bangers: require("../../assets/fonts/Bangers-Regular.ttf"),
          Fredoka: require("../../assets/fonts/Fredoka-Regular.ttf"),
          FredokaSemiBold: require("../../assets/fonts/Fredoka-SemiBold.ttf"),
        });

        await lockLandscape();
        await applyImmersive();

        setFontsLoaded(true);
      } catch (e) {
        console.error("App init error:", e);
        setFontsLoaded(true);
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android" && Platform.OS !== "ios") return;

    const appSub = AppState.addEventListener("change", (s) => {
      if (s === "active") {
        lockLandscape();
        applyImmersive();
      }
    });
    const kbShow = Keyboard.addListener("keyboardDidShow", applyImmersive);
    const kbHide = Keyboard.addListener("keyboardDidHide", applyImmersive);
    const dimSub = Dimensions.addEventListener("change", () => {
      lockLandscape();
      applyImmersive();
    });

    return () => {
      appSub.remove();
      kbShow.remove();
      kbHide.remove();
      dimSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      playBackgroundMusic().catch(() => {});
    }
  }, [fontsLoaded, playBackgroundMusic]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "#16103E" }} />;
  }

  const theme = {
    ...NavDefaultTheme,
    dark: true,
    colors: {
      ...NavDefaultTheme.colors,
      background: "#16103E",
      primary: "#FFFFFF",
      card: "#16103E",
      text: "#FFFFFF",
      border: "#16103E",
      notification: "#16103E",
    },
    fonts: {
      regular: { fontFamily: "Fredoka", fontWeight: "400" },
      medium: { fontFamily: "FredokaSemiBold", fontWeight: "600" },
      bold: { fontFamily: "FredokaSemiBold", fontWeight: "700" },
      heavy: { fontFamily: "FredokaSemiBold", fontWeight: "800" },
    },
  } as const;

  return (
    <View style={{ flex: 1, backgroundColor: "#16103E" }}>
      <NavigationContainer theme={theme} independent={true}>
        <StatusBar
          hidden={Platform.OS !== "web"}
          translucent={Platform.OS === "android"}
          backgroundColor="#16103E"
        />
        <Stack.Navigator
          initialRouteName="MagicMemoryGameScreen"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#16103E" },
            animation: "none",
            ...(Platform.OS === "android" && {
              navigationBarColor: "#16103E",
              navigationBarHidden: true,
              statusBarHidden: true,
              statusBarTranslucent: true,
              statusBarColor: "#16103E",
            }),
          }}
        >
          <Stack.Screen
            name="MagicMemoryGameScreen"
            component={GameScreen}
            options={{ gestureEnabled: false }}
            initialParams={{ age: 4 }} // стартуем 2×2
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export function AppNavigator() {
  return (
    <LanguageProvider>
      <SoundProvider>
        <InnerNavigator />
      </SoundProvider>
    </LanguageProvider>
  );
}

export default AppNavigator;
