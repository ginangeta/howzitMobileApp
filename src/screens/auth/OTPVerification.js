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
  Image,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { useLogin } from '../../context/LoginContext';
import Colors from '../../constants/Colors';

export default function OTPVerification({ navigation }) {
  const [otp, setOtp] = useState('');
  const { userData, userType, setIsLoggedIn } = useLogin();

  const verifyOTP = () => {
    if (otp.trim().length === 4) {
      Alert.alert('Success', 'OTP Verified Successfully', [
        {
          text: 'Continue',
          onPress: () => {
            setIsLoggedIn(true);
            if (userType === 'celeb') {
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
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.cardWrapper}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            We sent a 4-digit code to{' '}
            <Text style={styles.phoneHighlight}>
              {userData?.phone || 'your number'}
            </Text>
          </Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={4}
            value={otp}
            onChangeText={setOtp}
            placeholder="0000"
            placeholderTextColor={Colors.textSecondary + '66'}
          />

          <TouchableOpacity
            style={[styles.button, otp.trim().length < 4 && styles.buttonDisabled]}
            onPress={verifyOTP}
            activeOpacity={0.85}
            disabled={otp.trim().length < 4}
          >
            <Text style={styles.buttonText}>VerifY</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.04,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: Colors.textPrimary,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textSecondary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary + '99',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 20,
  },
  phoneHighlight: {
    fontWeight: '600',
    color: Colors.accentBlue,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.textSecondary + '33',
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
