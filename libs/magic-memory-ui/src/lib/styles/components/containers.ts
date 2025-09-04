import { StyleSheet } from 'react-native';

const containerStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    zIndex: 100,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  starsBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2, // Самый нижний слой
    resizeMode: 'cover',
  },
  fullscreen: {
    flex: 1,
    position: 'relative', // или 'absolute', если нужно
  },
});

export default containerStyles;
