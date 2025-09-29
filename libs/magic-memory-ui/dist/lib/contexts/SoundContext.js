import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useRef, } from "react";
import { Audio } from "expo-av";
import { Asset } from "expo-asset";
import { AppState } from "react-native";
const ENABLE_BACKGROUND_MUSIC = false;
const SoundContext = createContext({
    playNotificationSound: async () => { },
    playSuccessSound: async () => { },
    playBackgroundMusic: async () => { },
    stopBackgroundMusic: async () => { },
    pauseBackgroundMusic: async () => { },
    resumeBackgroundMusic: async () => { },
    stopSuccessSound: async () => { },
});
export const SoundProvider = ({ children, }) => {
    const [soundEnabled] = useState(true);
    const heroVoicesRef = useRef([
        null,
        null,
        null,
        null,
        null,
        null,
    ]);
    const successSoundRef = useRef(null);
    const backgroundMusicRef = useRef(null);
    const isBackgroundPlayingRef = useRef(false);
    const fallbackNotifRef = useRef(null);
    const appState = useRef(AppState.currentState);
    useEffect(() => {
        let mounted = true;
        const loadSounds = async () => {
            var _a, _b, _c, _d;
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    staysActiveInBackground: false,
                    playsInSilentModeIOS: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });
                const HERO_MODULES = [
                    require("../../assets/hero/hero1/hero.m4a"),
                    require("../../assets/hero/hero2/hero.m4a"),
                    require("../../assets/hero/hero3/hero.m4a"),
                    require("../../assets/hero/hero4/hero.m4a"),
                    require("../../assets/hero/hero5/hero.m4a"),
                    require("../../assets/hero/hero6/hero.m4a"),
                ];
                for (let i = 0; i < HERO_MODULES.length; i++) {
                    try {
                        const a = Asset.fromModule(HERO_MODULES[i]);
                        await a.downloadAsync();
                        const { sound } = await Audio.Sound.createAsync({ uri: (_a = a.localUri) !== null && _a !== void 0 ? _a : a.uri }, { shouldPlay: false });
                        await sound.setVolumeAsync(1.0);
                        heroVoicesRef.current[i] = sound;
                    }
                    catch (e) {
                        console.warn("Hero voice load failed:", i, e);
                        heroVoicesRef.current[i] = null;
                    }
                }
                try {
                    const fb = Asset.fromModule(require("../../assets/sounds/notification-sound-effect.mp3"));
                    await fb.downloadAsync();
                    const { sound } = await Audio.Sound.createAsync({ uri: (_b = fb.localUri) !== null && _b !== void 0 ? _b : fb.uri }, { shouldPlay: false });
                    await sound.setVolumeAsync(1.0);
                    fallbackNotifRef.current = sound;
                }
                catch (e) {
                    console.warn("Fallback notification load failed:", e);
                }
                try {
                    const succ = Asset.fromModule(require("../../assets/sounds/success-fanfare-trumpets.mp3"));
                    await succ.downloadAsync();
                    const { sound } = await Audio.Sound.createAsync({ uri: (_c = succ.localUri) !== null && _c !== void 0 ? _c : succ.uri }, { shouldPlay: false });
                    await sound.setVolumeAsync(1.0);
                    successSoundRef.current = sound;
                }
                catch (e) {
                    console.warn("Success fanfare load failed:", e);
                }
                try {
                    const bg = Asset.fromModule(require("../../assets/sounds/background-music.wav"));
                    await bg.downloadAsync();
                    const { sound: background } = await Audio.Sound.createAsync({ uri: (_d = bg.localUri) !== null && _d !== void 0 ? _d : bg.uri }, { shouldPlay: false, isLooping: true });
                    backgroundMusicRef.current = background;
                    await backgroundMusicRef.current.setVolumeAsync(0.5);
                    isBackgroundPlayingRef.current = false;
                }
                catch (e) {
                    console.warn("Background music load failed:", e);
                }
            }
            catch (error) {
                console.error("Failed to load sounds:", error);
            }
        };
        loadSounds();
        const handleAppStateChange = async (next) => {
            if (appState.current === "active" &&
                (next === "background" || next === "inactive")) {
                if (backgroundMusicRef.current && isBackgroundPlayingRef.current) {
                    await backgroundMusicRef.current.pauseAsync().catch(() => { });
                    isBackgroundPlayingRef.current = false;
                }
            }
            else if (appState.current !== "active" && next === "active") {
                if (soundEnabled &&
                    ENABLE_BACKGROUND_MUSIC &&
                    backgroundMusicRef.current) {
                    await backgroundMusicRef.current.playAsync().catch(() => { });
                    await backgroundMusicRef.current.setVolumeAsync(0.5).catch(() => { });
                    isBackgroundPlayingRef.current = true;
                }
            }
            appState.current = next;
        };
        const sub = AppState.addEventListener("change", handleAppStateChange);
        return () => {
            var _a, _b, _c;
            mounted = false;
            sub.remove();
            (_a = backgroundMusicRef.current) === null || _a === void 0 ? void 0 : _a.unloadAsync().catch(() => { });
            (_b = fallbackNotifRef.current) === null || _b === void 0 ? void 0 : _b.unloadAsync().catch(() => { });
            (_c = successSoundRef.current) === null || _c === void 0 ? void 0 : _c.unloadAsync().catch(() => { });
            heroVoicesRef.current.forEach((s) => s === null || s === void 0 ? void 0 : s.unloadAsync().catch(() => { }));
        };
    }, [soundEnabled]);
    const duckBackgroundTemporarily = async (ms = 700) => {
        const bg = backgroundMusicRef.current;
        if (!bg || !isBackgroundPlayingRef.current)
            return;
        try {
            await bg.setVolumeAsync(0.25);
            setTimeout(() => {
                var _a;
                (_a = backgroundMusicRef.current) === null || _a === void 0 ? void 0 : _a.setVolumeAsync(0.5).catch(() => { });
            }, ms);
        }
        catch { }
    };
    const playNotificationSound = async (heroIndex) => {
        if (!soundEnabled)
            return;
        try {
            const voice = heroIndex != null ? heroVoicesRef.current[heroIndex] : null;
            const snd = voice !== null && voice !== void 0 ? voice : fallbackNotifRef.current;
            if (!snd)
                return;
            await duckBackgroundTemporarily(900);
            await snd.setPositionAsync(0);
            await snd.setVolumeAsync(1.0);
            await snd.replayAsync();
        }
        catch (e) {
            console.error("playNotificationSound error:", e);
        }
    };
    const playSuccessSound = async () => {
        if (!soundEnabled)
            return;
        try {
            const snd = successSoundRef.current;
            if (!snd)
                return;
            await duckBackgroundTemporarily(1400);
            await snd.setPositionAsync(0);
            await snd.setVolumeAsync(1.0);
            await snd.replayAsync();
        }
        catch (e) {
            console.error("playSuccessSound error:", e);
        }
    };
    const stopSuccessSound = async () => {
        try {
            const s = successSoundRef.current;
            const st = await (s === null || s === void 0 ? void 0 : s.getStatusAsync());
            if ((st === null || st === void 0 ? void 0 : st.isLoaded) && st.isPlaying) {
                await (s === null || s === void 0 ? void 0 : s.stopAsync());
            }
        }
        catch { }
    };
    const playBackgroundMusic = async () => {
        if (!ENABLE_BACKGROUND_MUSIC)
            return;
        try {
            const bg = backgroundMusicRef.current;
            const st = await (bg === null || bg === void 0 ? void 0 : bg.getStatusAsync());
            if ((st === null || st === void 0 ? void 0 : st.isLoaded) && !st.isPlaying) {
                await (bg === null || bg === void 0 ? void 0 : bg.setPositionAsync(0));
                await (bg === null || bg === void 0 ? void 0 : bg.setVolumeAsync(0.5));
                await (bg === null || bg === void 0 ? void 0 : bg.playAsync());
                isBackgroundPlayingRef.current = true;
            }
        }
        catch { }
    };
    const stopBackgroundMusic = async () => {
        try {
            const bg = backgroundMusicRef.current;
            const st = await (bg === null || bg === void 0 ? void 0 : bg.getStatusAsync());
            if ((st === null || st === void 0 ? void 0 : st.isLoaded) && st.isPlaying) {
                await (bg === null || bg === void 0 ? void 0 : bg.stopAsync());
            }
            isBackgroundPlayingRef.current = false;
        }
        catch { }
    };
    const pauseBackgroundMusic = async () => {
        try {
            const bg = backgroundMusicRef.current;
            const st = await (bg === null || bg === void 0 ? void 0 : bg.getStatusAsync());
            if ((st === null || st === void 0 ? void 0 : st.isLoaded) && st.isPlaying) {
                await (bg === null || bg === void 0 ? void 0 : bg.pauseAsync());
            }
            isBackgroundPlayingRef.current = false;
        }
        catch { }
    };
    const resumeBackgroundMusic = async () => {
        await playBackgroundMusic();
    };
    return (_jsx(SoundContext.Provider, { value: {
            playNotificationSound,
            playSuccessSound,
            playBackgroundMusic,
            stopBackgroundMusic,
            pauseBackgroundMusic,
            resumeBackgroundMusic,
            stopSuccessSound,
        }, children: children }));
};
export const useSound = () => useContext(SoundContext);
