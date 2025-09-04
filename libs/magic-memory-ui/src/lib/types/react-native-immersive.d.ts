declare module 'react-native-immersive' {
  export default class ImmersiveMode {
    static setImmersive(isImmersive: boolean): void;
    static on(
      event: 'ImmersiveModeChanged',
      callback: (isImmersive: boolean) => void
    ): void;
  }
}
