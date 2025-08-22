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
  Modal
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
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');

  const { userType, setUserType, setUserData, setIsLoggedIn } = useLogin();

  useEffect(() => {
    setUserType(isCelebrity ? 'celebrity' : 'customer');
  }, [setUserType, isCelebrity]);

  const handleContinue = () => {
    if (!phone.trim()) {
      Alert.alert('Missing Info', 'Please enter your phone number.');
      return;
    }

    if (isRegistering && userType === 'celebrity' && !name.trim()) {
      Alert.alert('Missing Info', 'Please enter your full name.');
      return;
    }

    const userData = { phone, userType };
    if (isRegistering) {
      userData.name = name;
      if (userType === 'celebrity') {
        userData.specialization = specialization;
      }
    }

    setUserData(userData);
    // navigation.navigate('OTPVerification');
    setShowOTPModal(true);
  };

  const handleSignupRedirect = () => {
    setIsRegistering(true);
  };

  const handleVerifyOTP = () => {
    if (!otp.trim()) {
      Alert.alert('Missing OTP', 'Please enter the OTP sent to your phone.');
      return;
    }
    // TODO: call your OTP verification API here
    Alert.alert('Success', 'OTP Verified Successfully!');
    setShowOTPModal(false);
    setIsLoggedIn(true);
    if (userType === 'celeb') {
      navigation.navigate('CelebritySetup');
    } else {
      navigation.navigate('CustomerTabs');
    }
  };

  return (
    <View style={styles.container}>
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

        <View style={styles.form}>
          <TextInput
            placeholder="+263 7XXXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholderTextColor={Colors.textSecondary + '99'}
            maxLength={13}
          />

          {!isRegistering && (
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor={Colors.textSecondary + '99'}
            />
          )}

          {isRegistering && (
            <>
              <TextInput
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholderTextColor={Colors.textSecondary + '99'}
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
            activeOpacity={0.85}
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

          <TouchableOpacity style={styles.secondaryButton} onPress={handleSignupRedirect}>
            <Text style={styles.secondaryButtonText}>
              {isRegistering ? 'Login' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* OTP Modal */}
      <Modal
        visible={showOTPModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOTPModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Verify Your Number</Text>
            <Text style={styles.modalSubtitle}>
              Enter the 6-digit code sent to {phone}
            </Text>

            <TextInput
              placeholder="123456"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              style={styles.otpInput}
              placeholderTextColor={Colors.textSecondary + '66'}
              maxLength={6}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOTP}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <View style={styles.resendRow}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <TouchableOpacity>
                <Text style={styles.resendButton}>Resend OTP</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setShowOTPModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.secondary, paddingTop: 60 },
  wrapper: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  content: { alignItems: 'center', marginBottom: 40 },
  logo: { width: 100, height: 100, marginBottom: 12 },
  tagline: { fontSize: 16, textAlign: 'center', color: Colors.textSecondary, fontWeight: '500', lineHeight: 22 },
  form: { paddingVertical: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.textPrimary,
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  label: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', marginBottom: 8 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: Colors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: Platform.OS === 'ios' ? 8 : 4,
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  switchLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  primaryButton: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700', textTransform: 'uppercase' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 20 },
  signInLabel: { textAlign: 'center', color: Colors.textSecondary, marginBottom: 10 },
  secondaryButton: { borderWidth: 1, borderColor: Colors.primary, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  secondaryButtonText: { color: Colors.primary, fontWeight: '700', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.textPrimary,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary + '99',
    textAlign: 'center',
    marginBottom: 24,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    backgroundColor: '#F8F8F8',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  resendText: { fontSize: 14, color: Colors.textSecondary + '99' },
  resendButton: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  modalCloseButton: { marginTop: 24 },
  modalCloseText: { color: Colors.primary, textAlign: 'center', fontWeight: '600' },
});
