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
} from 'react-native';
import { useLogin } from '../../context/LoginContext';
import Colors from '../../constants/Colors';

export default function CelebrityLogin({ navigation }) {
  const { setUserType } = useLogin();
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    if (!phone.trim()) return;
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
        <Text style={styles.title}>Welcome Back, Star</Text>
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
            placeholderTextColor="#888"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !phone.trim() && { opacity: 0.6 }]}
          onPress={handleNext}
          disabled={!phone.trim()}
        >
          <Text style={styles.buttonText}>📲 Send OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('CustomerLogin')}>
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
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.accentBlue,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bubbleBg,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    width: '100%',
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
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: Colors.accentGreen,
    marginTop: 24,
    fontWeight: '600',
    fontSize: 14,
  },
});
