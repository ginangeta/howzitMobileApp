// src/screens/auth/CelebrityLogin.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { useLogin } from '../../context/LoginContext';
import Colors from '../../constants/Colors';

export default function CelebrityLogin({ navigation }) {
  const { setUserType } = useLogin();
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    if (!phone.trim()) {
      Alert.alert('Missing Number', 'Please enter your phone number.');
      return;
    }
    setUserType('celebrity');
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
        <Text style={styles.title}>Welcome Back, Star ✨</Text>
        <Text style={styles.subtitle}>Sign in to manage your shoutouts</Text>

        <View style={styles.inputWrapper}>
          <Image
            source={require('../../../assets/images/flag_zim.png')}
            style={styles.flagIcon}
          />
          <TextInput
            placeholder="+263 7XXXXXXXX"
            keyboardType="phone-pad"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={phone}
            onChangeText={setPhone}
            maxLength={13}
          />
        </View>

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
          onPress={() => navigation.navigate('CustomerLogin')}
        >
          <Text style={styles.switchText}>I’m a Customer Instead</Text>
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
    marginBottom: 8,
    color: Colors.accentBlue,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#555',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    borderWidth: 1.2,
    borderColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  flagIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
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
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    marginTop: 28,
  },
  switchText: {
    color: Colors.accentGreen,
    fontWeight: '600',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
