// src/screens/auth/OTPVerification.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useLogin } from '../../context/LoginContext';
import Colors from '../../constants/Colors';

export default function OTPVerification({ navigation }) {
  const [otp, setOtp] = useState('');
  const { userData, userType, setIsLoggedIn } = useLogin();

  const verifyOTP = () => {
    if (otp.length === 4) {
      // Simulate verification
      Alert.alert('Success', 'OTP Verified Successfully', [
        {
          text: 'Continue',
          onPress: () => {
            setIsLoggedIn(true);
            if (userType === 'celebrity') {
              navigation.navigate('CelebritySetup');
            } else {
              navigation.navigate('CustomerTabs');
            }
          },
        },
      ]);
    } else {
      Alert.alert('Invalid OTP', 'Please enter the 4-digit code sent to your phone.');
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/abstract_bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <View style={styles.card}>
        <Text style={styles.title}>Enter OTP : {userType}</Text>
        <Text style={styles.subtitle}>
          We sent a 4-digit code to {userData?.phone || 'your number'}
        </Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          maxLength={4}
          value={otp}
          onChangeText={setOtp}
          placeholder="0000"
        />

        <TouchableOpacity style={styles.button} onPress={verifyOTP}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 24,
      marginHorizontal: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.1,
      shadowRadius: 20,
      elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
