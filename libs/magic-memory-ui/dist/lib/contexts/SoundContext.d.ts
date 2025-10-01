import React from "react";
type Ctx = {
    playNotificationSound: (heroIndex?: number) => Promise<void>;
    playSuccessSound: () => Promise<void>;
    playBackgroundMusic: () => Promise<void>;
    stopBackgroundMusic: () => Promise<void>;
    pauseBackgroundMusic: () => Promise<void>;
    resumeBackgroundMusic: () => Promise<void>;
    stopSuccessSound: () => Promise<void>;
};
export declare const SoundProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useSound: () => Ctx;
export default useSound;
