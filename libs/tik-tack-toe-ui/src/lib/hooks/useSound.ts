import { useRef, useCallback } from "react";
import { Audio } from "expo-av";

type SoundRef = { sound: Audio.Sound | null };

export const useSound = () => {
  const bg = useRef<SoundRef>({ sound: null }).current;
  const notif = useRef<SoundRef>({ sound: null }).current;
  const win = useRef<SoundRef>({ sound: null }).current;
  const lose = useRef<SoundRef>({ sound: null }).current;

  const ensure = useCallback(
    async (
      slot: SoundRef,
      res: any,
      opts?: Parameters<typeof Audio.Sound.createAsync>[1]
    ) => {
      if (slot.sound) return;
      const { sound } = await Audio.Sound.createAsync(res, opts);
      slot.sound = sound;
    },
    []
  );

  const playBackgroundMusic = useCallback(async () => {
    await ensure(bg, require("../assets/sounds/background-music.mp3"), {
      isLooping: true,
      volume: 0.5,
    });
    await bg.sound!.playAsync();
  }, [ensure]);

  const pauseBackgroundMusic = useCallback(async () => {
    if (bg.sound) await bg.sound.pauseAsync();
  }, []);

  const resumeBackgroundMusic = useCallback(async () => {
    if (bg.sound) await bg.sound.playAsync();
  }, []);

  const stopBackgroundMusic = useCallback(async () => {
    if (bg.sound) {
      await bg.sound.stopAsync();
      await bg.sound.unloadAsync();
      bg.sound = null;
    }
  }, []);

  const playNotificationSound = useCallback(async () => {
    await ensure(
      notif,
      require("../assets/sounds/notification-sound-effect.mp3")
    );
    await notif.sound!.replayAsync();
  }, [ensure]);

  const playVictorySound = useCallback(async () => {
    await ensure(win, require("../assets/sounds/success-fanfare-trumpets.mp3"));
    await win.sound!.replayAsync();
  }, [ensure]);

  const playSadGameSound = useCallback(async () => {
    await ensure(lose, require("../assets/sounds/sad-game.mp3"));
    await lose.sound!.replayAsync();
  }, [ensure]);

  return {
    playBackgroundMusic,
    pauseBackgroundMusic,
    resumeBackgroundMusic,
    stopBackgroundMusic,
    playNotificationSound,
    playVictorySound,
    playSadGameSound,
  };
};
