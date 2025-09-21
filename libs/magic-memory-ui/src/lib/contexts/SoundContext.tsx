import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Audio } from "expo-av";
import { Asset } from "expo-asset";
import { AppState, AppStateStatus, Platform } from "react-native";

const SoundContext = createContext<{
  playNotificationSound: (heroIndex?: number) => Promise<void>;
  playSuccessSound: () => Promise<void>;
  playBackgroundMusic: () => Promise<void>;
  stopBackgroundMusic: () => Promise<void>;
  pauseBackgroundMusic: () => Promise<void>;
  resumeBackgroundMusic: () => Promise<void>;
  stopSuccessSound: () => Promise<void>;
}>({
  playNotificationSound: async () => {},
  playSuccessSound: async () => {},
  playBackgroundMusic: async () => {},
  stopBackgroundMusic: async () => {},
  pauseBackgroundMusic: async () => {},
  resumeBackgroundMusic: async () => {},
  stopSuccessSound: async () => {},
});

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [soundEnabled] = useState(true);

  // ГОЛОСА РОБОТОВ (hero1..hero6/hero.m4a)
  const heroVoicesRef = useRef<(Audio.Sound | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const [successSound, setSuccessSound] = useState<Audio.Sound | null>(null);
  const backgroundMusicRef = useRef<Audio.Sound | null>(null);
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState(false);
  const appState = useRef(AppState.currentState);

  // Фоллбек-жужжалка (используем только если нет голоса робота)
  const fallbackNotifRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSounds = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        // --- HERO VOICES ---
        const HERO_MODULES = [
          require("../../assets/hero/hero1/hero.m4a"),
          require("../../assets/hero/hero2/hero.m4a"),
          require("../../assets/hero/hero3/hero.m4a"),
          require("../../assets/hero/hero4/hero.m4a"),
          require("../../assets/hero/hero5/hero.m4a"),
          require("../../assets/hero/hero6/hero.m4a"),
        ] as const;

        for (let i = 0; i < HERO_MODULES.length; i++) {
          try {
            const a = Asset.fromModule(HERO_MODULES[i]);
            await a.downloadAsync();
            const { sound } = await Audio.Sound.createAsync(
              { uri: a.localUri ?? a.uri },
              { shouldPlay: false }
            );
            await sound.setVolumeAsync(1.0);
            heroVoicesRef.current[i] = sound;
          } catch (e) {
            console.warn("Hero voice load failed, index:", i, e);
            heroVoicesRef.current[i] = null;
          }
        }

        // --- Fallback notification ---
        try {
          const fb = Asset.fromModule(
            require("../../assets/sounds/notification-sound-effect.mp3")
          );
          await fb.downloadAsync();
          const { sound } = await Audio.Sound.createAsync(
            { uri: fb.localUri ?? fb.uri },
            { shouldPlay: false }
          );
          await sound.setVolumeAsync(1.0);
          fallbackNotifRef.current = sound;
        } catch (e) {
          console.warn("Fallback notification load failed:", e);
        }

        // --- Success ---
        const succ = Asset.fromModule(
          require("../../assets/sounds/success-fanfare-trumpets.mp3")
        );
        await succ.downloadAsync();
        const { sound: success } = await Audio.Sound.createAsync(
          { uri: succ.localUri ?? succ.uri },
          { shouldPlay: false }
        );
        await success.setVolumeAsync(1.0);
        if (!isMounted) return;
        setSuccessSound(success);

        // --- Background (loop) ---
        const bg = Asset.fromModule(
          require("../../assets/sounds/background-music.wav")
        );
        await bg.downloadAsync();
        const { sound: background } = await Audio.Sound.createAsync(
          { uri: bg.localUri ?? bg.uri },
          { shouldPlay: false, isLooping: true }
        );
        backgroundMusicRef.current = background;
        await backgroundMusicRef.current.setVolumeAsync(0.5);
        await backgroundMusicRef.current.playAsync();
        const status = await backgroundMusicRef.current.getStatusAsync();
        if (status.isLoaded && status.isPlaying) {
          setIsBackgroundPlaying(true);
        }
      } catch (error: unknown) {
        console.error("Failed to load sounds:", error);
      }
    };

    loadSounds();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current === "active" &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        if (backgroundMusicRef.current && isBackgroundPlaying) {
          backgroundMusicRef.current.pauseAsync().catch(() => {});
          setIsBackgroundPlaying(false);
        }
      } else if (appState.current !== "active" && nextAppState === "active") {
        if (soundEnabled && backgroundMusicRef.current) {
          backgroundMusicRef.current.playAsync().catch(() => {});
          backgroundMusicRef.current.setVolumeAsync(0.5).catch(() => {});
          setIsBackgroundPlaying(true);
        }
      }
      appState.current = nextAppState;
    };
    const sub = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      isMounted = false;
      sub.remove();
      backgroundMusicRef.current?.unloadAsync().catch(() => {});
      fallbackNotifRef.current?.unloadAsync().catch(() => {});
      successSound?.unloadAsync().catch(() => {});
      heroVoicesRef.current.forEach((s) => s?.unloadAsync().catch(() => {}));
    };
  }, [soundEnabled]);

  const duckBackgroundTemporarily = async (ms = 700) => {
    if (!backgroundMusicRef.current) return;
    try {
      await backgroundMusicRef.current.setVolumeAsync(0.25);
      setTimeout(() => {
        backgroundMusicRef.current?.setVolumeAsync(0.5).catch(() => {});
      }, ms);
    } catch {}
  };

  // ▶️ голос робота по индексу (0..5)
  const playNotificationSound = async (heroIndex?: number) => {
    if (!soundEnabled) return;
    try {
      const voice = heroIndex != null ? heroVoicesRef.current[heroIndex] : null;
      const snd = voice ?? fallbackNotifRef.current;
      if (!snd) return;

      await duckBackgroundTemporarily(900);
      await snd.setPositionAsync(0);
      await snd.setVolumeAsync(1.0);
      await snd.replayAsync();
    } catch (e) {
      console.error("playNotificationSound error:", e);
    }
  };

  const playSuccessSound = async () => {
    if (!soundEnabled) return;
    try {
      if (!successSound) return;
      await duckBackgroundTemporarily(1400);
      await successSound.setPositionAsync(0);
      await successSound.setVolumeAsync(1.0);
      await successSound.replayAsync();
    } catch (e) {
      console.error("playSuccessSound error:", e);
    }
  };

  const stopSuccessSound = async () => {
    try {
      const st = await successSound?.getStatusAsync();
      if (st?.isLoaded && st?.isPlaying) {
        await successSound?.stopAsync();
      }
    } catch {}
  };

  const playBackgroundMusic = async () => {
    try {
      const st = await backgroundMusicRef.current?.getStatusAsync();
      if (st?.isLoaded && !st.isPlaying) {
        await backgroundMusicRef.current?.setPositionAsync(0);
        await backgroundMusicRef.current?.setVolumeAsync(0.5);
        await backgroundMusicRef.current?.playAsync();
        setIsBackgroundPlaying(true);
      }
    } catch {}
  };

  const stopBackgroundMusic = async () => {
    try {
      await backgroundMusicRef.current?.stopAsync();
      setIsBackgroundPlaying(false);
    } catch {}
  };

  const pauseBackgroundMusic = async () => {
    try {
      if (isBackgroundPlaying) {
        await backgroundMusicRef.current?.pauseAsync();
        setIsBackgroundPlaying(false);
      }
    } catch {}
  };

  const resumeBackgroundMusic = async () => {
    await playBackgroundMusic();
  };

  return (
    <SoundContext.Provider
      value={{
        playNotificationSound,
        playSuccessSound,
        playBackgroundMusic,
        stopBackgroundMusic,
        pauseBackgroundMusic,
        resumeBackgroundMusic,
        stopSuccessSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);
