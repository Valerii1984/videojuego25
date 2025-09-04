import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Audio } from "expo-av";
import { AppState, AppStateStatus, Platform } from "react-native";

const SoundContext = createContext<{
  playNotificationSound: () => Promise<void>;
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
  const [notificationSound, setNotificationSound] =
    useState<Audio.Sound | null>(null);
  const [successSound, setSuccessSound] = useState<Audio.Sound | null>(null);
  const backgroundMusicRef = useRef<Audio.Sound | null>(null);
  const [isBackgroundPlaying, setIsBackgroundPlaying] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    let isMounted = true;

    const loadSounds = async () => {
      try {
        console.log(`Loading sounds on platform: ${Platform.OS}`);
        const notificationPath = require("../../assets/sounds/notification-sound-effect.mp3");
        const successPath = require("../../assets/sounds/success-fanfare-trumpets.mp3");
        const backgroundPath = require("../../assets/sounds/background-music.wav");
        console.log("Success sound path:", successPath);

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { sound: notification } = await Audio.Sound.createAsync(
          notificationPath,
          { shouldPlay: false }
        );
        const { sound: success } = await Audio.Sound.createAsync(successPath, {
          shouldPlay: false,
        });
        const { sound: background } = await Audio.Sound.createAsync(
          backgroundPath,
          { shouldPlay: false, isLooping: true }
        );

        if (isMounted) {
          setNotificationSound(notification);
          setSuccessSound(success);
          backgroundMusicRef.current = background;

          const successStatus = await success.getStatusAsync();
          console.log("Success sound loaded:", successStatus.isLoaded);
          if (backgroundMusicRef.current) {
            await backgroundMusicRef.current.setVolumeAsync(0.5);
            await backgroundMusicRef.current.playAsync();
            const status = await backgroundMusicRef.current.getStatusAsync();
            if (status.isLoaded && status.isPlaying) {
              setIsBackgroundPlaying(true);
              console.log("Background music loaded and playing");
            } else {
              console.log("Background music failed to play, status:", status);
            }
          }
        }
      } catch (error: unknown) {
        console.error("Failed to load sounds:", error);
      }
    };

    loadSounds();

    // Обработчик AppState
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log(
        `AppState changed: ${nextAppState} on platform: ${Platform.OS}`
      );
      if (
        appState.current === "active" &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        if (backgroundMusicRef.current && isBackgroundPlaying) {
          backgroundMusicRef.current.pauseAsync().catch((err: unknown) => {
            console.error("Error pausing background music:", err);
          });
          setIsBackgroundPlaying(false);
          console.log("Background music paused due to app state");
        }
      } else if (appState.current !== "active" && nextAppState === "active") {
        if (soundEnabled && backgroundMusicRef.current) {
          backgroundMusicRef.current.playAsync().catch((err: unknown) => {
            console.error("Error resuming background music:", err);
          });
          backgroundMusicRef.current
            .setVolumeAsync(0.5)
            .catch((err: unknown) => {
              console.error("Error setting volume:", err);
            });
          setIsBackgroundPlaying(true);
          console.log("Background music resumed due to app state");
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      isMounted = false;
      subscription.remove();
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current
          .unloadAsync()
          .catch((err: unknown) =>
            console.error("Error unloading background music:", err)
          );
      }
      if (notificationSound) {
        notificationSound
          .unloadAsync()
          .catch((err: unknown) =>
            console.error("Error unloading notification sound:", err)
          );
      }
      if (successSound) {
        successSound
          .unloadAsync()
          .catch((err: unknown) =>
            console.error("Error unloading success sound:", err)
          );
      }
    };
  }, [soundEnabled]);

  const playNotificationSound = async () => {
    if (soundEnabled && notificationSound) {
      await notificationSound.replayAsync();
      console.log("Notification sound played");
    }
  };

  const playSuccessSound = async () => {
    if (soundEnabled) {
      try {
        console.log("Attempting to play success sound");
        if (!successSound) {
          console.log("Success sound not loaded, attempting to load");
          const { sound: newSuccessSound } = await Audio.Sound.createAsync(
            require("../../assets/sounds/success-fanfare-trumpets.mp3"),
            { shouldPlay: false }
          );
          setSuccessSound(newSuccessSound);
          console.log("Success sound loaded:", !!newSuccessSound);
          await newSuccessSound.replayAsync();
          console.log("Success sound played after reload");
        } else {
          const status = await successSound.getStatusAsync();
          console.log("Success sound status before play:", status);
          if (status.isLoaded) {
            await successSound.replayAsync();
            console.log("Success sound played");
          } else {
            console.log("Success sound not loaded, attempting to reload");
            await successSound
              .unloadAsync()
              .catch((err: unknown) =>
                console.error(
                  "Error unloading success sound before reload:",
                  err
                )
              );
            const { sound: newSuccessSound } = await Audio.Sound.createAsync(
              require("../../assets/sounds/success-fanfare-trumpets.mp3"),
              { shouldPlay: false }
            );
            setSuccessSound(newSuccessSound);
            await newSuccessSound.replayAsync();
            console.log("Success sound played after reload");
          }
        }
      } catch (error: unknown) {
        console.error("Error playing success sound:", error);
      }
    } else {
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
        } else {
          console.log("Success sound not playing or not loaded:", status);
        }
      } catch (error: unknown) {
        console.error("Error stopping success sound:", error);
      }
    } else {
      console.log(
        "Success sound not stopped: soundEnabled=",
        soundEnabled,
        "successSound=",
        !!successSound
      );
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
        } else {
          console.log("Background music not loaded, reloading");
          const { sound: background } = await Audio.Sound.createAsync(
            require("../../assets/sounds/background-music.wav"),
            { shouldPlay: true, isLooping: true }
          );
          backgroundMusicRef.current = background;
          await backgroundMusicRef.current.setVolumeAsync(0.5);
          await backgroundMusicRef.current.playAsync();
          setIsBackgroundPlaying(true);
          console.log("Background music reloaded and playing");
        }
      } catch (error: unknown) {
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
