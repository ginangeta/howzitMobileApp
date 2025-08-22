import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useAppTheme } from '../../context/ThemeContext';

export default function ShoutoutRequest({ route, navigation }) {
  const { celeb } = route.params;
  const { colors } = useAppTheme();

  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [messageType, setMessageType] = useState('text');
  const [date, setDate] = useState(new Date(Date.now() + 25 * 60 * 60 * 1000)); // +25 hrs
  const [showPicker, setShowPicker] = useState(false);

  const mockWalletBalance = 5000;
  const shoutoutPrice = 3000;
  const timeUntilDelivery = Math.max(
    1,
    Math.round((date - new Date()) / (60 * 60 * 1000))
  );

  const validateAndSubmit = () => {
    if (!message.trim() || !recipient.trim() || !purpose.trim()) {
      Alert.alert('Missing Info', 'Please fill in recipient, purpose and message.');
      return;
    }

    const now = new Date();
    const minTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    if (date <= minTime) {
      Alert.alert('Invalid Time', 'Shoutout time must be at least 24 hours from now.');
      return;
    }

    if (mockWalletBalance < shoutoutPrice) {
      Alert.alert('Low Balance', 'You need to deposit more funds.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Deposit', onPress: () => navigation.navigate('Deposit') },
      ]);
      return;
    }

    navigation.navigate('StatusTracker', {
      celeb,
      message,
      messageType,
      recipient,
      purpose,
      deliveryTime: date.toString(),
      status: 'Pending',
    });

    Alert.alert('Requested', 'Your shoutout request has been sent.');
  };

  const getMessageEmoji = (type) => {
    switch (type) {
      case 'text':
        return '✍️';
      case 'video':
        return '📹';
      case 'audio':
        return '🎤';
      default:
        return '';
    }
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(false);
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.secondary }]}>
      <LinearGradient
        colors={[`${colors.primary}22`, `${colors.primary}00`]}
        style={styles.headerGradient}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.9}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.textSecondary }]}>
          Request a Shoutout
        </Text>

        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.bubbleBg }]}>
          <View style={styles.summaryLeft}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Price
            </Text>
            <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>
              ZWG {shoutoutPrice}
            </Text>
          </View>
          <View style={styles.summaryMid}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              Wallet
            </Text>
            <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>
              ZWG {mockWalletBalance}
            </Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              ETA
            </Text>
            <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>
              ~{timeUntilDelivery}h
            </Text>
          </View>
        </View>

        {/* Celeb Card */}
        <View style={[styles.celebCard, { backgroundColor: colors.secondary }]}>
          <Image
            source={{ uri: celeb.image || celeb.avatar }}
            style={styles.celebImage}
          />
          <View style={styles.celebInfo}>
            <Text style={[styles.celebName, { color: colors.textSecondary }]}>
              {celeb.name}
            </Text>
            <Text style={[styles.celebRole, { color: colors.primary }]}>
              {celeb.role || 'Public Figure'}
            </Text>
          </View>
        </View>

        {/* Recipient */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Recipient Name
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bubbleBg, color: colors.textSecondary }]}
          value={recipient}
          onChangeText={setRecipient}
          placeholder="Enter recipient's name"
          placeholderTextColor={colors.placeholder}
        />

        {/* Purpose */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Purpose
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bubbleBg, color: colors.textSecondary }]}
          value={purpose}
          onChangeText={setPurpose}
          placeholder="Why this shoutout?"
          placeholderTextColor={colors.placeholder}
        />

        {/* Message */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Your Message
        </Text>
        <TextInput
          style={[
            styles.input,
            styles.messageInput,
            { backgroundColor: colors.bubbleBg, color: colors.textSecondary },
          ]}
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="Type your personalized message"
          placeholderTextColor={colors.placeholder}
        />

        {/* Message Type */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Message Type
        </Text>
        <View style={styles.bubbles}>
          {['text', 'video', 'audio'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.bubble,
                {
                  backgroundColor:
                    messageType === type ? colors.primary : colors.secondary,
                  borderColor:
                    messageType === type ? colors.primary : colors.bubbleBg,
                },
              ]}
              onPress={() => setMessageType(type)}
              activeOpacity={0.85}
            >
              <Text
                style={
                  messageType === type
                    ? [styles.bubbleTextSelected, { color: colors.textPrimary }]
                    : [styles.bubbleText, { color: colors.textSecondary }]
                }
              >
                {getMessageEmoji(type)} {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Delivery Time */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Delivery Time
        </Text>
        <TouchableOpacity
          onPress={() => setShowPicker(true)}
          style={[styles.datePicker, { backgroundColor: colors.bubbleBg }]}
          activeOpacity={0.8}
        >
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {date.toLocaleString()}
          </Text>
          <Ionicons
            name="calendar-outline"
            size={18}
            color={colors.textSecondary}
            style={{ marginLeft: 12 }}
          />
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
            display="default"
            onChange={onChange}
          />
        )}

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={validateAndSubmit}
          activeOpacity={0.9}
        >
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
            Book now • ZWG {shoutoutPrice}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          We’ll notify you once the celebrity accepts and records your shoutout.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 30 },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  contentContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 18,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 18,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    marginBottom: 18,
  },
  summaryLeft: { flex: 1, alignItems: 'flex-start' },
  summaryMid: { flex: 1, alignItems: 'center' },
  summaryRight: { flex: 1, alignItems: 'flex-end' },
  summaryLabel: { fontSize: 12, marginBottom: 4 },
  summaryValue: { fontSize: 16, fontWeight: '700' },
  celebCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderRadius: 14,
  },
  celebImage: {
    width: 68,
    height: 68,
    borderRadius: 50,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  celebInfo: { flex: 1 },
  celebName: { fontSize: 16, fontWeight: '800' },
  celebRole: { fontSize: 13, marginTop: 4 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  input: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    marginBottom: 16,
  },
  messageInput: { height: 120, textAlignVertical: 'top' },
  bubbles: { flexDirection: 'row', marginBottom: 20, flexWrap: 'wrap' },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  bubbleText: { fontSize: 13, fontWeight: '600' },
  bubbleTextSelected: { fontSize: 13, fontWeight: '700' },
  datePicker: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: { flex: 1, fontSize: 15 },
  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { fontWeight: '800', fontSize: 16 },
  helperText: { textAlign: 'center', fontSize: 13 },
});
