"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSound = exports.SoundProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const expo_av_1 = require("expo-av");
const expo_asset_1 = require("expo-asset"); // ★
const react_native_1 = require("react-native");
const SoundContext = (0, react_1.createContext)({
    playNotificationSound: async () => { },
    playSuccessSound: async () => { },
    playBackgroundMusic: async () => { },
    stopBackgroundMusic: async () => { },
    pauseBackgroundMusic: async () => { },
    resumeBackgroundMusic: async () => { },
    stopSuccessSound: async () => { },
});
const SoundProvider = ({ children, }) => {
    const [soundEnabled] = (0, react_1.useState)(true);
    const [notificationSound, setNotificationSound] = (0, react_1.useState)(null);
    const [successSound, setSuccessSound] = (0, react_1.useState)(null);
    const backgroundMusicRef = (0, react_1.useRef)(null);
    const [isBackgroundPlaying, setIsBackgroundPlaying] = (0, react_1.useState)(false);
    const appState = (0, react_1.useRef)(react_native_1.AppState.currentState);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        const loadSounds = async () => {
            try {
                console.log(`Loading sounds on platform: ${react_native_1.Platform.OS}`);
                // Пути ассетов
                const heroNotificationModule = require("../../assets/hero/hero.m4a"); // ★
                const fallbackNotificationModule = require("../../assets/sounds/notification-sound-effect.mp3");
                const successModule = require("../../assets/sounds/success-fanfare-trumpets.mp3");
                const backgroundModule = require("../../assets/sounds/background-music.wav");
                await expo_av_1.Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                    // Можно добавить/поиграть режимами прерываний при желании:
                    // interruptionModeAndroid: 1, // DO_NOT_MIX
                    // interruptionModeIOS: 2,     // DUCK_OTHERS
                });
                // --- Notification (hero.m4a с предзагрузкой, fallback на mp3)
                let notif = null;
                try {
                    const heroAsset = expo_asset_1.Asset.fromModule(heroNotificationModule);
                    await heroAsset.downloadAsync(); // гарантируем локальную доступность
                    const uri = heroAsset.localUri ?? heroAsset.uri;
                    const res = await expo_av_1.Audio.Sound.createAsync({ uri }, { shouldPlay: false });
                    notif = res.sound;
                    await notif.setVolumeAsync(1.0);
                    console.log("Hero notification loaded from URI:", uri);
                }
                catch (err) {
                    console.warn("Hero m4a load failed, fallback to mp3:", err);
                    const fbAsset = expo_asset_1.Asset.fromModule(fallbackNotificationModule);
                    await fbAsset.downloadAsync();
                    const uri = fbAsset.localUri ?? fbAsset.uri;
                    const res = await expo_av_1.Audio.Sound.createAsync({ uri }, { shouldPlay: false });
                    notif = res.sound;
                    await notif.setVolumeAsync(1.0);
                    console.log("Fallback notification loaded from URI:", uri);
                }
                // --- Success
                const successAsset = expo_asset_1.Asset.fromModule(successModule);
                await successAsset.downloadAsync();
                const { sound: success } = await expo_av_1.Audio.Sound.createAsync({ uri: successAsset.localUri ?? successAsset.uri }, { shouldPlay: false });
                await success.setVolumeAsync(1.0);
                // --- Background (loop)
                const bgAsset = expo_asset_1.Asset.fromModule(backgroundModule);
                await bgAsset.downloadAsync();
                const { sound: background } = await expo_av_1.Audio.Sound.createAsync({ uri: bgAsset.localUri ?? bgAsset.uri }, { shouldPlay: false, isLooping: true });
                if (!isMounted)
                    return;
                setNotificationSound(notif);
                setSuccessSound(success);
                backgroundMusicRef.current = background;
                if (backgroundMusicRef.current) {
                    await backgroundMusicRef.current.setVolumeAsync(0.5);
                    await backgroundMusicRef.current.playAsync();
                    const status = await backgroundMusicRef.current.getStatusAsync();
                    if (status.isLoaded && status.isPlaying) {
                        setIsBackgroundPlaying(true);
                        console.log("Background music loaded and playing");
                    }
                    else {
                        console.log("Background music failed to play, status:", status);
                    }
                }
            }
            catch (error) {
                console.error("Failed to load sounds:", error);
            }
        };
        loadSounds();
        // AppState
        const handleAppStateChange = (nextAppState) => {
            console.log(`AppState changed: ${nextAppState} on platform: ${react_native_1.Platform.OS}`);
            if (appState.current === "active" &&
                (nextAppState === "background" || nextAppState === "inactive")) {
                if (backgroundMusicRef.current && isBackgroundPlaying) {
                    backgroundMusicRef.current.pauseAsync().catch((err) => {
                        console.error("Error pausing background music:", err);
                    });
                    setIsBackgroundPlaying(false);
                    console.log("Background music paused due to app state");
                }
            }
            else if (appState.current !== "active" && nextAppState === "active") {
                if (soundEnabled && backgroundMusicRef.current) {
                    backgroundMusicRef.current.playAsync().catch((err) => {
                        console.error("Error resuming background music:", err);
                    });
                    backgroundMusicRef.current
                        .setVolumeAsync(0.5)
                        .catch((err) => console.error("Error setting volume:", err));
                    setIsBackgroundPlaying(true);
                    console.log("Background music resumed due to app state");
                }
            }
            appState.current = nextAppState;
        };
        const subscription = react_native_1.AppState.addEventListener("change", handleAppStateChange);
        return () => {
            isMounted = false;
            subscription.remove();
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current
                    .unloadAsync()
                    .catch((err) => console.error("Error unloading background music:", err));
            }
            if (notificationSound) {
                notificationSound
                    .unloadAsync()
                    .catch((err) => console.error("Error unloading notification sound:", err));
            }
            if (successSound) {
                successSound
                    .unloadAsync()
                    .catch((err) => console.error("Error unloading success sound:", err));
            }
        };
    }, [soundEnabled]);
    // Временный duckинг фона на период нотификации
    const duckBackgroundTemporarily = async (ms = 700) => {
        if (!backgroundMusicRef.current)
            return;
        try {
            await backgroundMusicRef.current.setVolumeAsync(0.25);
            setTimeout(() => {
                backgroundMusicRef.current
                    ?.setVolumeAsync(0.5)
                    .catch((e) => console.warn("Restore bg volume error:", e));
            }, ms);
        }
        catch (e) {
            console.warn("Duck bg error:", e);
        }
    };
    const playNotificationSound = async () => {
        if (soundEnabled && notificationSound) {
            try {
                await duckBackgroundTemporarily(800);
                await notificationSound.setPositionAsync(0);
                await notificationSound.setVolumeAsync(1.0);
                await notificationSound.replayAsync();
                console.log("Notification sound played");
            }
            catch (e) {
                console.error("Error playing notification sound:", e);
            }
        }
        else {
            console.log("Notification not played: soundEnabled or sound missing");
        }
    };
    const playSuccessSound = async () => {
        if (soundEnabled) {
            try {
                console.log("Attempting to play success sound");
                if (!successSound) {
                    const mod = require("../../assets/sounds/success-fanfare-trumpets.mp3");
                    const asset = expo_asset_1.Asset.fromModule(mod);
                    await asset.downloadAsync();
                    const { sound: newSuccessSound } = await expo_av_1.Audio.Sound.createAsync({ uri: asset.localUri ?? asset.uri }, { shouldPlay: false });
                    await newSuccessSound.setVolumeAsync(1.0);
                    setSuccessSound(newSuccessSound);
                    await duckBackgroundTemporarily(1200);
                    await newSuccessSound.setPositionAsync(0);
                    await newSuccessSound.replayAsync();
                    console.log("Success sound played after reload");
                }
                else {
                    const status = await successSound.getStatusAsync();
                    console.log("Success sound status before play:", status);
                    await duckBackgroundTemporarily(1200);
                    if (status.isLoaded) {
                        await successSound.setPositionAsync(0);
                        await successSound.setVolumeAsync(1.0);
                        await successSound.replayAsync();
                        console.log("Success sound played");
                    }
                    else {
                        await successSound
                            .unloadAsync()
                            .catch((e) => console.error("Unload success before reload:", e));
                        const mod = require("../../assets/sounds/success-fanfare-trumpets.mp3");
                        const asset = expo_asset_1.Asset.fromModule(mod);
                        await asset.downloadAsync();
                        const { sound: newSuccessSound } = await expo_av_1.Audio.Sound.createAsync({ uri: asset.localUri ?? asset.uri }, { shouldPlay: false });
                        await newSuccessSound.setVolumeAsync(1.0);
                        setSuccessSound(newSuccessSound);
                        await newSuccessSound.setPositionAsync(0);
                        await newSuccessSound.replayAsync();
                        console.log("Success sound played after reload");
                    }
                }
            }
            catch (error) {
                console.error("Error playing success sound:", error);
            }
        }
        else {
            console.log("Success sound not played: soundEnabled=false");
        }
    };
    const stopSuccessSound = async () => {
        if (soundEnabled && successSound) {
            try {
                const status = await successSound.getStatusAsync();
                console.log("Success sound status before stop:", status);
                if (status.isLoaded && status.isPlaying) {
                    await successSound.stopAsync();
                    console.log("Success sound stopped successfully");
                }
            }
            catch (error) {
                console.error("Error stopping success sound:", error);
            }
        }
    };
    const playBackgroundMusic = async () => {
        if (soundEnabled && backgroundMusicRef.current) {
            try {
                console.log("Attempting to play background music");
                const status = await backgroundMusicRef.current.getStatusAsync();
                if (status.isLoaded) {
                    if (!status.isPlaying) {
                        await backgroundMusicRef.current.setPositionAsync(0);
                        await backgroundMusicRef.current.playAsync();
                        await backgroundMusicRef.current.setVolumeAsync(0.5);
                        setIsBackgroundPlaying(true);
                        console.log("Background music resumed");
                    }
                }
                else {
                    const mod = require("../../assets/sounds/background-music.wav");
                    const asset = expo_asset_1.Asset.fromModule(mod);
                    await asset.downloadAsync();
                    const { sound: background } = await expo_av_1.Audio.Sound.createAsync({ uri: asset.localUri ?? asset.uri }, { shouldPlay: true, isLooping: true });
                    backgroundMusicRef.current = background;
                    await backgroundMusicRef.current.setVolumeAsync(0.5);
                    setIsBackgroundPlaying(true);
                    console.log("Background music reloaded and playing");
                }
            }
            catch (error) {
                console.error("Error playing background music:", error);
            }
        }
    };
    const stopBackgroundMusic = async () => {
        if (soundEnabled && backgroundMusicRef.current) {
            await backgroundMusicRef.current.stopAsync();
            setIsBackgroundPlaying(false);
            console.log("Background music stopped");
        }
    };
    const pauseBackgroundMusic = async () => {
        if (soundEnabled && backgroundMusicRef.current && isBackgroundPlaying) {
            await backgroundMusicRef.current.pauseAsync();
            setIsBackgroundPlaying(false);
            console.log("Background music paused");
        }
    };
    const resumeBackgroundMusic = async () => {
        if (soundEnabled && backgroundMusicRef.current) {
            await playBackgroundMusic();
            console.log("Background music resumed");
        }
    };
    return ((0, jsx_runtime_1.jsx)(SoundContext.Provider, { value: {
            playNotificationSound,
            playSuccessSound,
            playBackgroundMusic,
            stopBackgroundMusic,
            pauseBackgroundMusic,
            resumeBackgroundMusic,
            stopSuccessSound,
        }, children: children }));
};
exports.SoundProvider = SoundProvider;
const useSound = () => (0, react_1.useContext)(SoundContext);
exports.useSound = useSound;
