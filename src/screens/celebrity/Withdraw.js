import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../../constants/Colors';

export default function Withdraw({ route, navigation }) {
  const { balance, celebProfile } = route.params;
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWithdrawPress = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to withdraw.');
      return;
    }
    if (numAmount > balance) {
      Alert.alert('Insufficient Balance', 'You cannot withdraw more than your available balance.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpModalVisible(true);
      Alert.alert('OTP Sent', 'A 6-digit code was sent to your phone.');
    }, 1000);
  };

  const handleOtpSubmit = () => {
    if (otp.length !== 6 || isNaN(otp)) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit code sent to your phone.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpModalVisible(false);
      if (otp === '123456') {
        Alert.alert(
          'Withdrawal Successful',
          `You have withdrawn $${parseFloat(amount).toFixed(2)}.`,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert('Incorrect OTP', 'The OTP entered is incorrect. Please try again.');
      }
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <Text style={styles.title}>💵 Withdraw Funds</Text>
      <Text style={styles.balance}>Available Balance: ${balance.toFixed(2)}</Text>

      <View style={styles.profileRow}>
        <Image
          source={celebProfile?.avatar || require('../../../assets/images/default_avatar.png')}
          style={styles.avatar}
        />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.celebName}>{celebProfile?.name || 'Your Profile'}</Text>
          <Text style={styles.walletId}>Wallet ID: {celebProfile?.walletId || 'N/A'}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>🔎 Minimum Withdrawal: $5.00</Text>
        <Text style={styles.infoText}>⏱ Processing Time: 24 hours</Text>
        <Text style={styles.infoText}>📅 Last Withdrawal: 3 days ago</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        editable={!loading}
        placeholderTextColor="#aaa"
      />

      {amount !== '' && parseFloat(amount) > 0 && (
        <View style={styles.previewBox}>
          <Text style={styles.previewLabel}>You'll Receive:</Text>
          <Text style={styles.previewAmount}>
            ${ (parseFloat(amount) * 0.98).toFixed(2) } 
            <Text style={styles.feeNote}> (after 2% fee)</Text>
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, loading && { backgroundColor: '#ccc' }]}
        onPress={handleWithdrawPress}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Sending OTP...' : 'Withdraw Now'}
        </Text>
      </TouchableOpacity>

      <Modal
        isVisible={otpModalVisible}
        onBackdropPress={() => !loading && setOtpModalVisible(false)}
        animationIn="fadeInUp"
        animationOut="fadeOutDown"
        backdropOpacity={0.4}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>🔐 Enter OTP</Text>
          <Text style={styles.modalSubtitle}>
            Enter the 6-digit code sent to your phone to confirm withdrawal of ${parseFloat(amount || 0).toFixed(2)}.
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

          <TouchableOpacity
            style={[styles.modalButton, loading && { backgroundColor: '#ccc' }]}
            onPress={handleOtpSubmit}
            disabled={loading}
          >
            <Text style={styles.modalButtonText}>
              {loading ? 'Verifying...' : 'Confirm Withdrawal'}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.07,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  balance: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    marginBottom: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#eee',
  },
  celebName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  walletId: {
    fontSize: 13,
    color: '#999',
  },
  infoCard: {
    backgroundColor: '#f0f4f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
    textAlign: 'center',
    marginBottom: 16,
  },
  previewBox: {
    backgroundColor: '#e7f9f3',
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bde5da',
  },
  previewLabel: {
    fontSize: 14,
    color: '#222',
  },
  previewAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  feeNote: {
    fontSize: 12,
    color: '#888',
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    color: Colors.primary,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpInput: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
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
