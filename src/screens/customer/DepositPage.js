import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';

const paymentMethods = [
  { id: 'onemoney', name: 'OneMoney', icon: 'wallet-outline' },
  { id: 'ecocash', name: 'EcoCash', icon: 'cash-outline' },
  { id: 'visa', name: 'VISA/MasterCard', icon: 'card-outline' },
];

export default function DepositPage(navigation) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('onemoney');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');

  const handleDeposit = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to deposit.');
      return;
    }

    // Open OTP Modal
    setOtpModalVisible(true);
  };

  const confirmOtp = () => {
    if (otp.length !== 6 || isNaN(otp)) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit code sent to your phone.');
      return;
    }

    setOtpModalVisible(false);
    setOtp('');
    Alert.alert(
      'Deposit Successful',
      `You've deposited $${parseFloat(amount).toFixed(2)} via ${selectedMethod}.`
    );
    setAmount('');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Back Button */}
      {/* <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Icon name="arrow-back" size={24} color={Colors.primary} />
      </TouchableOpacity> */}

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>💸 Deposit to Wallet</Text>
        <Text style={styles.subtitle}>
          Securely top up your balance using your preferred payment method.
        </Text>

        <TextInput
          placeholder="Enter amount"
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.methodList}>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.methodCard,
                selectedMethod === method.id && styles.methodCardSelected,
              ]}
              onPress={() => setSelectedMethod(method.id)}
              activeOpacity={0.85}
            >
              <Icon
                name={method.icon}
                size={24}
                color={
                  selectedMethod === method.id ? Colors.primary : '#777'
                }
              />
              <Text
                style={[
                  styles.methodText,
                  selectedMethod === method.id && { color: Colors.primary },
                ]}
              >
                {method.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleDeposit}>
          <Text style={styles.buttonText}>
            Deposit with {
              paymentMethods.find((m) => m.id === selectedMethod)?.name
            }
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        isVisible={otpModalVisible}
        onBackdropPress={() => setOtpModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.4}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>🔐 Enter OTP</Text>
          <Text style={styles.modalSubtitle}>
            Enter the 6-digit code sent to your phone
          </Text>
          <TextInput
            placeholder="e.g. 123456"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            style={styles.otpInput}
          />
          <TouchableOpacity style={styles.modalButton} onPress={confirmOtp}>
            <Text style={styles.modalButtonText}>Confirm Deposit</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fffdfb',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    paddingVertical: 250,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 30,
    textAlign: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  methodList: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 36,
    gap: 12,
  },
  methodCard: {
    backgroundColor: '#fdfdfd',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    minWidth: 90,
  },
  methodCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
  },
  methodText: {
    fontSize: 13,
    marginTop: 6,
    color: '#777',
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 3,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: Colors.primary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  otpInput: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
