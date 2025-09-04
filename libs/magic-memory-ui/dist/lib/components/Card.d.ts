import React from "react";
import { ViewStyle } from "react-native";
import { Card } from "../types/index";
interface CardProps {
    item: Card;
    onPress: (id: number) => void;
    getCardSize: () => number;
    disabled?: boolean;
    isHinted?: boolean;
    style?: ViewStyle;
    backImage: any;
    frontImage: any;
}
declare const MemoryCard: React.FC<CardProps>;
export default MemoryCard;
