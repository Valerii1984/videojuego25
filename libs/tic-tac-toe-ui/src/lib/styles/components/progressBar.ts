import { StyleSheet } from 'react-native';

const progressBarStyles = StyleSheet.create({
  container: {
    width: 420,
    height: 52,
    marginBottom: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#999',
  },
  fill: {
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
})

export default progressBarStyles;
