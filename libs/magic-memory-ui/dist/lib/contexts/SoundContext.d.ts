import React from "react";
export declare const SoundProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useSound: () => {
    playNotificationSound: () => Promise<void>;
    playSuccessSound: () => Promise<void>;
    playBackgroundMusic: () => Promise<void>;
    stopBackgroundMusic: () => Promise<void>;
    pauseBackgroundMusic: () => Promise<void>;
    resumeBackgroundMusic: () => Promise<void>;
    stopSuccessSound: () => Promise<void>;
};
