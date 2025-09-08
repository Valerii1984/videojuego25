import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GameScreen from "./screens/GameScreen";
import { LanguageProvider } from "./contexts/LanguageContext";
import { SoundProvider } from "./contexts/SoundContext";

// единый проп для клиента
export type LevelKey = 4 | 6 | 8 | 10 | 12;
export interface MagicMemoryPropConfig {
  age: LevelKey;
  lang: string;
  background?: string; // один URL
  backCardSide?: string | string[]; // один URL или массив
  frontCardSide?: string[]; // список URL (минимум age/2 уникальных)
}

export interface MagicMemoryProps {
  props: MagicMemoryPropConfig;
}

export type RootStackParamList = {
  GameScreen: { level?: number; config: MagicMemoryPropConfig };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const MagicMemory: React.FC<MagicMemoryProps> = ({ props }) => {
  return (
    <LanguageProvider>
      <SoundProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="GameScreen"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen
              name="GameScreen"
              component={GameScreen}
              initialParams={{ level: props.age, config: props }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SoundProvider>
    </LanguageProvider>
  );
};

export default MagicMemory;
