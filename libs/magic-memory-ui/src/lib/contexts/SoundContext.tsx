import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from "expo-av";
import { Asset } from "expo-asset";
import { AppState, AppStateStatus } from "react-native";

const ENABLE_BACKGROUND_MUSIC = false;

type Ctx = {
  playNotificationSound: (heroIndex?: number) => Promise<void>;
  playSuccessSound: () => Promise<void>;
  playBackgroundMusic: () => Promise<void>;
  stopBackgroundMusic: () => Promise<void>;
  pauseBackgroundMusic: () => Promise<void>;
  resumeBackgroundMusic: () => Promise<void>;
  stopSuccessSound: () => Promise<void>;
};

const noop = async () => {};
const SoundContext = createContext<Ctx>({
  playNotificationSound: noop,
  playSuccessSound: noop,
  playBackgroundMusic: noop,
  stopBackgroundMusic: noop,
  pauseBackgroundMusic: noop,
  resumeBackgroundMusic: noop,
  stopSuccessSound: noop,
});

const isLoaded = (s?: AVPlaybackStatus | null): s is AVPlaybackStatusSuccess =>
  !!s && "isLoaded" in s && (s as any).isLoaded;

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
  const backgroundMusicUriRef = useRef<string | null>(null);
  const isBackgroundPlayingRef = useRef(false);

  const fallbackNotifRef = useRef<Audio.Sound | null>(null);
  const appState = useRef(AppState.currentState);

  const ensureAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch {}
  };

  const ensureBackgroundReady = async () => {
    if (backgroundMusicRef.current && backgroundMusicUriRef.current) return;
    // Ищем именно тот wav, что у вас лежит в dist/assets/sounds
    const tryLoad = async (req: any) => {
      const a = Asset.fromModule(req);
      await a.downloadAsync();
      backgroundMusicUriRef.current = a.localUri ?? a.uri ?? null;
      if (!backgroundMusicUriRef.current) return false;
      const { sound } = await Audio.Sound.createAsync(
        { uri: backgroundMusicUriRef.current },
        { shouldPlay: false, isLooping: true }
      );
      backgroundMusicRef.current = sound;
      await sound.setVolumeAsync(0.5);
      isBackgroundPlayingRef.current = false;
      return true;
    };

    try {
      // основной путь (wav)
      const ok =
        (await tryLoad(require("../../assets/sounds/background-music.wav"))) ||
        false;
      if (!ok) throw new Error("bgm-not-loaded");
    } catch (e) {
      console.warn("Background music load failed (wav):", e);
    }
  };

  const loadFx = async () => {
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
  };

  useEffect(() => {
    (async () => {
      await ensureAudioMode();
      await Promise.all([ensureBackgroundReady(), loadFx()]);
      if (ENABLE_BACKGROUND_MUSIC) {
        await playBackgroundMusic().catch(() => {});
      }
    })();

    const onAppState = async (next: AppStateStatus) => {
      if (
        appState.current === "active" &&
        (next === "background" || next === "inactive")
      ) {
        try {
          const st = await backgroundMusicRef.current?.getStatusAsync();
          if (isLoaded(st) && st.isPlaying) {
            await backgroundMusicRef.current?.pauseAsync();
            isBackgroundPlayingRef.current = false;
          }
        } catch {}
      } else if (appState.current !== "active" && next === "active") {
        try {
          if (soundEnabled && ENABLE_BACKGROUND_MUSIC) {
            await playBackgroundMusic();
          }
        } catch {}
      }
      appState.current = next;
    };

    const sub = AppState.addEventListener("change", onAppState);
    return () => {
      sub.remove();
      backgroundMusicRef.current?.unloadAsync().catch(() => {});
      fallbackNotifRef.current?.unloadAsync().catch(() => {});
      successSoundRef.current?.unloadAsync().catch(() => {});
      heroVoicesRef.current.forEach((s) => s?.unloadAsync().catch(() => {}));
    };
  }, [soundEnabled]);

  const duckBg = async (ms = 700) => {
    const bg = backgroundMusicRef.current;
    if (!bg || !isBackgroundPlayingRef.current) return;
    try {
      await bg.setVolumeAsync(0.25);
      setTimeout(
        () => backgroundMusicRef.current?.setVolumeAsync(0.5).catch(() => {}),
        ms
      );
    } catch {}
  };

  const playNotificationSound = async (heroIndex?: number) => {
    if (!soundEnabled) return;
    try {
      const voice = heroIndex != null ? heroVoicesRef.current[heroIndex] : null;
      const snd = voice ?? fallbackNotifRef.current;
      if (!snd) return;
      await duckBg(900);
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
      await duckBg(1400);
      await snd.setPositionAsync(0);
      await snd.setVolumeAsync(1.0);
      await snd.replayAsync();
    } catch (e) {
      console.error("playSuccessSound error:", e);
    }
  };

  const stopSuccessSound = async () => {
    try {
      const st = await successSoundRef.current?.getStatusAsync();
      if (isLoaded(st) && st.isPlaying) {
        await successSoundRef.current?.stopAsync();
      }
    } catch {}
  };

  const playBackgroundMusic = async () => {
    if (!soundEnabled || !ENABLE_BACKGROUND_MUSIC) return;
    try {
      await ensureAudioMode();
      await ensureBackgroundReady();
      const st = await backgroundMusicRef.current?.getStatusAsync();
      if (isLoaded(st)) {
        if (!st.isPlaying) {
          await backgroundMusicRef.current!.setPositionAsync(0);
          await backgroundMusicRef.current!.setVolumeAsync(0.5);
          await backgroundMusicRef.current!.playAsync();
        }
        isBackgroundPlayingRef.current = true;
      }
    } catch {
      // до первого тапа может быть заблокировано
    }
  };

  const stopBackgroundMusic = async () => {
    try {
      const st = await backgroundMusicRef.current?.getStatusAsync();
      if (isLoaded(st) && st.isPlaying) {
        await backgroundMusicRef.current?.stopAsync();
      }
      isBackgroundPlayingRef.current = false;
    } catch {}
  };

  const pauseBackgroundMusic = async () => {
    try {
      const st = await backgroundMusicRef.current?.getStatusAsync();
      if (isLoaded(st) && st.isPlaying) {
        await backgroundMusicRef.current?.pauseAsync();
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
export default useSound;
