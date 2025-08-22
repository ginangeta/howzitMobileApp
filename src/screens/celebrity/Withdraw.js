import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';

export default function Withdraw({ route, navigation }) {
  const { balance, celebProfile } = route.params;
  const [amount, setAmount] = useState('');
  const [otp, setOtp] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const parsedAmount = parseFloat(amount || 0);
  const receiveAmount = parsedAmount > 0 ? (parsedAmount * 0.98).toFixed(2) : null;

  const handleWithdrawPress = () => {
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount to withdraw.');
      return;
    }
    if (parsedAmount > balance) {
      Alert.alert('Insufficient Balance', 'You cannot withdraw more than your available balance.');
      return;
    }
    setOtpModalVisible(true);
  };

  const handleOtpSubmit = () => {
    if (otp.length !== 6 || isNaN(otp)) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit code sent to your phone.');
      return;
    }

    setOtpModalVisible(false);
    Alert.alert(
      'Withdrawal Successful',
      `You have withdrawn $${parsedAmount.toFixed(2)}.`,
      [{ text: 'OK', onPress: () => setAmount('') }]
    );
    setOtp('');
  };

  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Icon name="arrow-back" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Icon name="cash-outline" size={60} color={Colors.primary} />
          <Text style={styles.title}>Withdraw Funds</Text>
          <Text style={styles.subtitle}>
            Withdraw your earnings safely and quickly to your account.
          </Text>
        </View>

        {/* Profile + Balance Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: celebProfile?.avatar } || require('../../../assets/images/default_avatar.png')}
            style={styles.avatar}
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.celebName}>{celebProfile?.name || 'Your Profile'}</Text>
            <Text style={styles.walletId}>Wallet ID: {celebProfile?.walletId || 'N/A'}</Text>
            <Text style={styles.balanceText}>Available: <Text style={styles.balanceValue}>${balance.toFixed(2)}</Text></Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.card}>
          <TextInput
            placeholder="Enter amount"
            placeholderTextColor="#aaa"
            keyboardType="numeric"
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
          />

          {receiveAmount && (
            <View style={styles.receiveBox}>
              <Text style={styles.receiveLabel}>You'll Receive</Text>
              <Text style={styles.receiveAmount}>
                ${receiveAmount} <Text style={styles.feeNote}>(after 2% fee)</Text>
              </Text>
            </View>
          )}
        </View>

        {/* Withdraw Button */}
        <TouchableOpacity
          style={[styles.button, loading && { backgroundColor: '#ccc' }]}
          onPress={handleWithdrawPress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Withdraw Now'}
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footerText}>🔒 Secure withdrawal powered by Howzit!</Text>
      </ScrollView>

      {/* OTP Modal */}
      <Modal
        isVisible={otpModalVisible}
        onBackdropPress={() => !loading && setOtpModalVisible(false)}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.4}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter OTP</Text>
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
          <TouchableOpacity style={styles.modalButton} onPress={handleOtpSubmit}>
            <Text style={styles.modalButtonText}>Confirm Withdrawal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffdfb' },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
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
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, alignItems: 'center' },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.primary, marginTop: 10 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginTop: 6, paddingHorizontal: 12 },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#eee' },
  celebName: { fontSize: 16, fontWeight: '600', color: '#333' },
  walletId: { fontSize: 13, color: '#999' },
  balanceText: { fontSize: 14, color: '#444', marginTop: 6 },
  balanceValue: { fontWeight: '700', color: Colors.primary },
  card: {
    borderRadius: 18,
    padding: 20,
    width: '100%',
    marginBottom: 30,
  },
  input: {
    backgroundColor: Colors.bubbleBg,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
    textAlign: 'center',
  },
  receiveBox: { marginTop: 10, alignItems: 'center' },
  receiveLabel: { fontSize: 14, color: '#444', marginBottom: 2 },
  receiveAmount: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  feeNote: { fontSize: 12, color: '#888' },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  footerText: { fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 30 },
  modal: { justifyContent: 'center', alignItems: 'center' },
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
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 8, color: Colors.primary },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20, textAlign: 'center' },
  otpInput: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 14,
    padding: 14,
    fontSize: 18,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  modalButton: { backgroundColor: Colors.primary, paddingVertical: 12, borderRadius: 25, width: '100%' },
  modalButtonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
});
