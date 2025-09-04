import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3000,
  },
  alertContainer: {
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 3001,
    width: Math.min(340, width * 0.8),
    height: Math.min(202, height * 0.6),
  },
  gradientBackground: {
    flex: 1,
    borderRadius: 30,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FAFAFA',
    fontFamily: 'FredokaSemiBold'
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#FAFAFA',
    fontFamily: 'FredokaSemiBold'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: '35%',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100%',
    borderTopWidth: 2,
    borderColor: '#543080',
  },
  yesButton: {
    backgroundColor: 'transparent',
    borderRightWidth: 1,
    borderColor: '#543080',
  },
  noButton: {
    backgroundColor: 'transparent',
    borderLeftWidth: 1,
    borderColor: '#543080',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: 'FredokaSemiBold'
  },
});

export default styles;
