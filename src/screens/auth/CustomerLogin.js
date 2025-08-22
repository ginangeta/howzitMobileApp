// src/screens/auth/CustomerLogin.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { useLogin } from '../../context/LoginContext';
import Colors from '../../constants/Colors';

export default function CustomerLogin({ navigation }) {
  const { setUserType } = useLogin();
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    if (!phone.trim()) {
      Alert.alert('Missing Number', 'Please enter your phone number.');
      return;
    }
    setUserType('customer');
    navigation.navigate('OTPVerification', { phone });
  };

  return (
    <ImageBackground
      source={require('../../../assets/images/abstract_bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Howzit! 👋</Text>

        <TextInput
          placeholder="+263 7XXXXXXXX"
          keyboardType="phone-pad"
          style={styles.input}
          placeholderTextColor="#aaa"
          value={phone}
          onChangeText={setPhone}
          maxLength={13}
        />

        <TouchableOpacity
          style={[styles.button, !phone.trim() && styles.buttonDisabled]}
          onPress={handleNext}
          activeOpacity={0.8}
          disabled={!phone.trim()}
        >
          <Text style={styles.buttonText}>📲 Send OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchContainer}
          onPress={() => navigation.navigate('CelebrityLogin')}
        >
          <Text style={styles.switchText}>I’m a Celebrity</Text>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 28,
    color: Colors.primary,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingHorizontal: 18,
    borderRadius: 50,
    backgroundColor: '#fff',
    borderWidth: 1.2,
    borderColor: Colors.primary,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    marginTop: 28,
  },
  switchText: {
    color: Colors.accentBlue,
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
