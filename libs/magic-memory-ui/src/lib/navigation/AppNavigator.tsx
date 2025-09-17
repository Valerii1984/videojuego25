// libs/magic-memory-ui/src/lib/navigation/AppNavigator.tsx
import { useEffect, useState } from "react";
import {
  NavigationContainer,
  DefaultTheme as NavDefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import LoadingScreen from "../screens/LoadingScreen";
import LevelSelect from "../screens/LevelSelect";
import { LanguageProvider } from "../contexts/LanguageContext";
import { SoundProvider, useSound } from "../contexts/SoundContext";
import * as Font from "expo-font";
import { StatusBar, Platform, View } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";
import { isWeb } from "../utils/config";
import { enableScreens } from "react-native-screens";
import GameScreen from "../screens/GameScreen";
import * as NavigationBar from "expo-navigation-bar";

enableScreens();

const Stack = createNativeStackNavigator();

const InnerNavigator = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { playBackgroundMusic } = useSound();

  useEffect(() => {
    const prepare = async () => {
      try {
        const fonts = {
          Bangers: require("../../assets/fonts/Bangers-Regular.ttf"),
          Fredoka: require("../../assets/fonts/Fredoka-Regular.ttf"),
          FredokaSemiBold: require("../../assets/fonts/Fredoka-SemiBold.ttf"),
        };

        await Font.loadAsync(fonts);

        if (!isWeb) {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.LANDSCAPE
          );
        }

        if (Platform.OS === "android") {
          try {
            await NavigationBar.setBackgroundColorAsync("#16103E");
            await NavigationBar.setVisibilityAsync("hidden");
            await NavigationBar.setBehaviorAsync("inset-swipe");
          } catch (err) {
            console.warn("NavigationBar error:", err);
          }
        }

        setFontsLoaded(true);
      } catch (e) {
        console.error("Font loading error:", e);
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      playBackgroundMusic().catch(() => {});
    }
  }, [fontsLoaded]);

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
      {/* 👇 единственное изменение — independent */}
      <NavigationContainer theme={theme} independent={true}>
        <StatusBar
          hidden={Platform.OS !== "web"}
          translucent={Platform.OS === "android"}
          backgroundColor="#16103E"
        />
        <Stack.Navigator
          initialRouteName="MagicMemorySplashScreen"
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
            name="MagicMemorySplashScreen"
            children={() => <SplashScreen fontsLoaded={fontsLoaded} />}
          />
          <Stack.Screen
            name="MagicMemoryLoadingScreen"
            component={LoadingScreen}
            options={{ gestureEnabled: false }}
          />
          {/*<Stack.Screen name="LevelSelect" component={LevelSelect} /> */}
          <Stack.Screen name="MagicMemoryGameScreen" component={GameScreen} />
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
