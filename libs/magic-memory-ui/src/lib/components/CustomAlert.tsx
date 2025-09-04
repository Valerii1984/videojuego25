import React from 'react';
import { View, Text, Modal, TouchableOpacity, StatusBar } from 'react-native';
import styles from './CustomAlert.styles';
import { LinearGradient } from 'expo-linear-gradient';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  title: React.ReactNode;
  message: React.ReactNode;
  onYes: () => void;
  onNo: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  onClose,
  title,
  message,
  onYes,
  onNo,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      hardwareAccelerated
      presentationStyle="overFullScreen"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalBackground}>
        <View style={styles.alertContainer}>
          <LinearGradient
            colors={['#25165F', '#50197D']}
            style={styles.gradientBackground}
          >
            <View style={styles.innerContainer}>
              {typeof title === 'string' ? (
                <Text style={styles.title}>{title}</Text>
              ) : (
                title
              )}
              {typeof message === 'string' ? (
                <Text style={styles.message}>{message}</Text>
              ) : (
                message
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[ styles.button, styles.yesButton]} onPress={onYes}>
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[ styles.button, styles.noButton]} onPress={onNo}>
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
