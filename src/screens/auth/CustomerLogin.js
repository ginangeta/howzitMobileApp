// src/screens/auth/CustomerLogin.js
import React from 'react';
import { useLogin } from '../../context/LoginContext';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, StatusBar } from 'react-native';
import Colors from '../../constants/Colors';

export default function CustomerLogin({ navigation }) {
    const { setUserType } = useLogin();

    const handleNext = () => {
        setUserType('customer');
        navigation.navigate('OTPVerification');
    };

  return (
    <ImageBackground
      source={require('../../../assets/images/abstract_bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Howzit!</Text>
      <TextInput
        placeholder="Enter Phone Number"
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('CelebrityLogin')}>
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
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: Colors.primary,
  },
  input: {
    width: '100%',
    padding: 16,
    borderRadius: 50,
    backgroundColor: Colors.bubbleBg,
    marginBottom: 20,
    color: 'black',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchText: {
    color: Colors.accentBlue,
    marginTop: 20,
    fontWeight: '500',
  },
});
