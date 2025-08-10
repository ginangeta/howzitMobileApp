// src/screens/auth/UnifiedAuthScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Switch,
} from 'react-native';
import { useLogin } from '../../context/LoginContext';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import api from '../../services/api';

export default function UnifiedAuthScreen({ navigation }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('birthday');
  const [isCelebrity, setIsCelebrity] = useState(false);

  const { setUserType, setUserData, setIsLoggedIn } = useLogin();

  useEffect(() => {
    setUserType(isCelebrity ? 'celeb' : 'fan');
  }, [setUserType, isCelebrity]);

  const handleContinue = async () => {
    if (!phone.trim()) {
      Alert.alert('Missing Info', 'Please enter your phone number.');
      return;
    }

    if (!isRegistering) {
      // Login Flow
      if (!password.trim()) {
        Alert.alert('Missing Info', 'Please enter your password.');
        return;
      }
      try {
        const res = await api.post('user/login-user', {
          userPhone: phone,
          userPassword: password,
        });

        const data = res.data;
        console.log(data);

        if (data.success) {
          const token = data.data.token;
          const user = data.data.user;
          console.log('Token', token);
          console.log('User', user.userType);
          await AsyncStorage.setItem('userToken', token);
          await AsyncStorage.setItem('userInfo', JSON.stringify(user));


          setUserType(user.userType);
          setIsLoggedIn(true);

          if (user.userType === 'celeb') {
            navigation.reset({ index: 0, routes: [{ name: 'CelebrityDashboard' }] });
          } else {
            navigation.reset({ index: 0, routes: [{ name: 'CustomerHome' }] });
          }
        } else {
          Alert.alert('Login Failed', res.data.message || 'Unable to login.');
        }
      } catch (err) {
        Alert.alert('Error', err.response?.data?.message || 'Something went wrong.');
      }
      return;
    }

    // Registration Flow
    if (isRegistering && isCelebrity && !name.trim()) {
      Alert.alert('Missing Info', 'Please enter your full name.');
      return;
    }

    const userData = { phone, userType: isCelebrity ? 'celeb' : 'fan' };
    if (isRegistering) {
      userData.name = name;
      if (isCelebrity) {
        userData.specialization = specialization;
      }
    }

    setUserData(userData);
    navigation.navigate('OTPVerification');
  };

  const handleSignupRedirect = () => {
    setIsRegistering(true);
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
        style={styles.wrapper}
      >
        <View style={styles.content}>
          <Image
            source={require('../../../assets/images/howzit_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>
            Personalized Video & Audio Messages from your favourite stars and creators.
          </Text>
        </View>

        <View style={styles.cardless}>
          <TextInput
            placeholder="+263 7XXXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholderTextColor="#aaa"
            maxLength={13}
          />

          {/* Password for Login */}
          {!isRegistering && (
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#aaa"
            />
          )}

          {isRegistering && (
            <>
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor="#aaa"
              />

              <Text style={styles.label}>User Type</Text>
              <View style={styles.switchRow}>
                <Switch
                  value={isCelebrity}
                  onValueChange={(value) => setIsCelebrity(value)}
                  trackColor={{ false: '#ddd', true: Colors.primary }}
                  thumbColor={isCelebrity ? Colors.primary : '#ccc'}
                />
                <Text style={styles.switchLabel}>Are you a celebrity?</Text>
              </View>

              {isCelebrity && (
                <>
                  <Text style={styles.label}>Specialization</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={specialization}
                      onValueChange={(value) => setSpecialization(value)}
                    >
                      <Picker.Item label="Birthday" value="birthday" />
                      <Picker.Item label="Anniversary" value="anniversary" />
                      <Picker.Item label="Pep Talk" value="pep" />
                      <Picker.Item label="Motivational Message" value="motivation" />
                      <Picker.Item label="Roast" value="roast" />
                      <Picker.Item label="Custom" value="custom" />
                    </Picker>
                  </View>
                </>
              )}
            </>
          )}

          {!isRegistering && (
            <View style={styles.switchRow}>
              <Switch
                value={isCelebrity}
                onValueChange={(value) => setIsCelebrity(value)}
                trackColor={{ false: '#ddd', true: Colors.primary }}
                thumbColor={isCelebrity ? Colors.primary : '#ccc'}
              />
              <Text style={styles.switchLabel}>Are you a celebrity?</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, !phone.trim() && styles.buttonDisabled]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={!phone.trim()}
          >
            <Text style={styles.buttonText}>
              {isRegistering ? 'Continue' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <Text style={styles.signInLabel}>
            {isRegistering ? 'Already have an account?' : 'Do you have an account?'}
          </Text>

          <TouchableOpacity style={styles.signUpButton} onPress={handleSignupRedirect}>
            <Text style={styles.signUpText}>
              {isRegistering ? 'Login' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.06 },
  container: { flex: 1, paddingTop: 60, backgroundColor: '#fff9f5' },
  wrapper: { flex: 1, justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 40 },
  content: { alignItems: 'center' },
  logo: { width: 120, height: 120, marginBottom: 6 },
  tagline: { fontSize: 14, textAlign: 'center', color: '#333', marginBottom: 24, paddingHorizontal: 20 },
  cardless: { padding: 28, backgroundColor: 'transparent' },
  input: {
    borderWidth: 1.2,
    borderColor: Colors.primary,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#000',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 14, color: '#555', marginBottom: 6, fontWeight: '600', marginTop: 10 },
  pickerWrapper: {
    borderWidth: 1.2,
    borderColor: Colors.primary,
    borderRadius: 50,
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingHorizontal: Platform.OS === 'ios' ? 8 : 4,
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  switchLabel: { fontSize: 14, color: '#444', fontWeight: '500' },
  primaryButton: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 50, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#ddd', marginVertical: 20 },
  signInLabel: { textAlign: 'center', color: '#666', marginBottom: 10 },
  signUpButton: { backgroundColor: '#f36f1e', paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  signUpText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
