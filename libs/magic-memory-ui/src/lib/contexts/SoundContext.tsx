import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Audio } from "expo-av";
import { Asset } from "expo-asset";
import { AppState, AppStateStatus } from "react-native";

const ENABLE_BACKGROUND_MUSIC = false;

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

  const heroVoicesRef = useRef<(Audio.Sound | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const successSoundRef = useRef<Audio.Sound | null>(null);

  const backgroundMusicRef = useRef<Audio.Sound | null>(null);
  const isBackgroundPlayingRef = useRef(false);

  const fallbackNotifRef = useRef<Audio.Sound | null>(null);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    let mounted = true;

    const loadSounds = async () => {
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
            console.warn("Hero voice load failed:", i, e);
            heroVoicesRef.current[i] = null;
          }
        }

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

        try {
          const succ = Asset.fromModule(
            require("../../assets/sounds/success-fanfare-trumpets.mp3")
          );
          await succ.downloadAsync();
          const { sound } = await Audio.Sound.createAsync(
            { uri: succ.localUri ?? succ.uri },
            { shouldPlay: false }
          );
          await sound.setVolumeAsync(1.0);
          successSoundRef.current = sound;
        } catch (e) {
          console.warn("Success fanfare load failed:", e);
        }

        try {
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
          isBackgroundPlayingRef.current = false;
        } catch (e) {
          console.warn("Background music load failed:", e);
        }
      } catch (error) {
        console.error("Failed to load sounds:", error);
      }
    };

    loadSounds();

    const handleAppStateChange = async (next: AppStateStatus) => {
      if (
        appState.current === "active" &&
        (next === "background" || next === "inactive")
      ) {
        if (backgroundMusicRef.current && isBackgroundPlayingRef.current) {
          await backgroundMusicRef.current.pauseAsync().catch(() => {});
          isBackgroundPlayingRef.current = false;
        }
      } else if (appState.current !== "active" && next === "active") {
        if (
          soundEnabled &&
          ENABLE_BACKGROUND_MUSIC &&
          backgroundMusicRef.current
        ) {
          await backgroundMusicRef.current.playAsync().catch(() => {});
          await backgroundMusicRef.current.setVolumeAsync(0.5).catch(() => {});
          isBackgroundPlayingRef.current = true;
        }
      }
      appState.current = next;
    };

    const sub = AppState.addEventListener("change", handleAppStateChange);

    return () => {
      mounted = false;
      sub.remove();
      backgroundMusicRef.current?.unloadAsync().catch(() => {});
      fallbackNotifRef.current?.unloadAsync().catch(() => {});
      successSoundRef.current?.unloadAsync().catch(() => {});
      heroVoicesRef.current.forEach((s) => s?.unloadAsync().catch(() => {}));
    };
  }, [soundEnabled]);

  const duckBackgroundTemporarily = async (ms = 700) => {
    const bg = backgroundMusicRef.current;
    if (!bg || !isBackgroundPlayingRef.current) return;
    try {
      await bg.setVolumeAsync(0.25);
      setTimeout(() => {
        backgroundMusicRef.current?.setVolumeAsync(0.5).catch(() => {});
      }, ms);
    } catch {}
  };

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
      const snd = successSoundRef.current;
      if (!snd) return;
      await duckBackgroundTemporarily(1400);
      await snd.setPositionAsync(0);
      await snd.setVolumeAsync(1.0);
      await snd.replayAsync();
    } catch (e) {
      console.error("playSuccessSound error:", e);
    }
  };

  const stopSuccessSound = async () => {
    try {
      const s = successSoundRef.current;
      const st = await s?.getStatusAsync();
      if (st?.isLoaded && st.isPlaying) {
        await s?.stopAsync();
      }
    } catch {}
  };

  const playBackgroundMusic = async () => {
    if (!ENABLE_BACKGROUND_MUSIC) return;
    try {
      const bg = backgroundMusicRef.current;
      const st = await bg?.getStatusAsync();
      if (st?.isLoaded && !st.isPlaying) {
        await bg?.setPositionAsync(0);
        await bg?.setVolumeAsync(0.5);
        await bg?.playAsync();
        isBackgroundPlayingRef.current = true;
      }
    } catch {}
  };

  const stopBackgroundMusic = async () => {
    try {
      const bg = backgroundMusicRef.current;
      const st = await bg?.getStatusAsync();
      if (st?.isLoaded && st.isPlaying) {
        await bg?.stopAsync();
      }
      isBackgroundPlayingRef.current = false;
    } catch {}
  };

  const pauseBackgroundMusic = async () => {
    try {
      const bg = backgroundMusicRef.current;
      const st = await bg?.getStatusAsync();
      if (st?.isLoaded && st.isPlaying) {
        await bg?.pauseAsync();
      }
      isBackgroundPlayingRef.current = false;
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
