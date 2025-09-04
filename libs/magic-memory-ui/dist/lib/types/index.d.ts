import { ViewStyle } from 'react-native';
import { RouteProp } from '@react-navigation/native';
export interface Card {
    id: number;
    value: CardValue;
    isFlipped: boolean;
    isMatched: boolean;
    isHidden?: boolean;
    isSelected?: boolean;
}
export type CardValue = 'cardFace-1' | 'cardFace-2' | 'cardFace-3' | 'cardFace-4' | 'cardFace-5' | 'cardFace-6' | 'boy' | 'donkey' | 'girl' | 'kengoo' | 'owl' | 'pig' | 'puh' | 'tigr';
export type RootParamList = {
    SplashScreen: undefined;
    LoadingScreen: undefined;
    LevelSelect: undefined;
    GameScreen: {
        level: number;
    };
};
export type Language = 'en-US' | 'de-DE' | 'es-ES' | 'es-419' | 'fr-FR' | 'pl-PL' | 'it-IT' | 'pt-BR';
export interface Translation {
    loading: string;
    level4: string;
    level6: string;
    level8: string;
    back: string;
    match: string;
    matchMessage: string;
    changeLanguage: string;
    friends: string;
    upgradePrompt: string;
    yes: string;
    no: string;
}
export type ScreenProps<T extends keyof RootParamList> = {
    navigation: any;
    route: RouteProp<RootParamList, T>;
};
export interface CardProps {
    item: Card;
    onPress: (id: number) => void;
    getCardSize: () => number;
    disabled?: boolean;
    isHinted?: boolean;
    style?: ViewStyle;
    pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
}
