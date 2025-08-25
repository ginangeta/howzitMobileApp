import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
  Platform,
  SafeAreaView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useAppTheme } from '../../context/ThemeContext';

export default function ShoutoutRequest({ route, navigation }) {
  const { celeb } = route.params;
  const { colors } = useAppTheme();

  // --- Helpers -------------------------------------------------------------
  const HOUR = 60 * 60 * 1000;
  const getMinDelivery = () => new Date(Date.now() + 24 * HOUR); // always computed fresh

  const clampToMinDelivery = (candidate) => {
    const min = getMinDelivery();
    if (!(candidate instanceof Date) || isNaN(candidate.getTime())) return new Date(min);
    return candidate < min ? new Date(min) : new Date(candidate);
  };

  // Round to nearest 5 minutes going forward (helps avoid odd seconds from pickers)
  const roundToNext5Min = (d) => {
    const ms = 5 * 60 * 1000;
    return new Date(Math.ceil(d.getTime() / ms) * ms);
  };

  // --- State ---------------------------------------------------------------
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [messageType, setMessageType] = useState('text');

  // Start at now + 25h to satisfy the 24h rule by default
  const [date, setDate] = useState(() => roundToNext5Min(new Date(Date.now() + 25 * HOUR)));

  // iOS: single datetime picker; Android: 2-step (date -> time)
  const [showIOSPicker, setShowIOSPicker] = useState(false);
  const [showAndroidDate, setShowAndroidDate] = useState(false);
  const [showAndroidTime, setShowAndroidTime] = useState(false);
  const [androidTempDate, setAndroidTempDate] = useState(null); // holds the picked calendar date before time is chosen

  // --- Pricing/summary -----------------------------------------------------
  const mockWalletBalance = 5000;
  const shoutoutPrice = 3000;

  const timeUntilDelivery = useMemo(() => {
    const diff = (date instanceof Date ? date.getTime() : 0) - Date.now();
    if (!isFinite(diff)) return 1;
    return Math.max(1, Math.ceil(diff / HOUR));
  }, [date,HOUR]);

  // --- Validation & submit -------------------------------------------------
  const validateAndSubmit = () => {
    if (!message.trim() || !recipient.trim() || !purpose.trim()) {
      Alert.alert('Missing Info', 'Please fill in recipient, purpose and message.');
      return;
    }

    const minTime = getMinDelivery();
    if (!(date instanceof Date) || isNaN(date.getTime()) || date <= minTime) {
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

  // --- Date picking logic (robust & crash-safe) ---------------------------
  const openPicker = () => {
    if (Platform.OS === 'ios') {
      setShowIOSPicker(true);
    } else {
      // Android must pick date then time separately
      setShowAndroidDate(true);
    }
  };

  // iOS unified datetime
  const onChangeIOS = (event, selectedDate) => {
    // User may dismiss the dialog
    if (event?.type === 'dismissed') {
      setShowIOSPicker(false);
      return;
    }
    if (event?.type === 'set' && selectedDate) {
      const clamped = clampToMinDelivery(roundToNext5Min(selectedDate));
      setDate(clamped);
      setShowIOSPicker(false);
    }
  };

  // Android two-step: date then time
  const onChangeAndroidDate = (event, pickedDate) => {
    setShowAndroidDate(false);
    if (event?.type !== 'set' || !pickedDate) return; // dismissed
    const onlyDate = new Date(pickedDate);
    onlyDate.setHours(0, 0, 0, 0);
    setAndroidTempDate(onlyDate);
    // proceed to time picker
    setShowAndroidTime(true);
  };

  const onChangeAndroidTime = (event, pickedTime) => {
    setShowAndroidTime(false);
    if (event?.type !== 'set' || !pickedTime) {
      setAndroidTempDate(null);
      return; // dismissed
    }
    try {
      const final = new Date(androidTempDate || new Date());
      final.setHours(pickedTime.getHours(), pickedTime.getMinutes(), 0, 0);
      const clamped = clampToMinDelivery(roundToNext5Min(final));
      setDate(clamped);
    } catch (e) {
      // Fallback to min delivery if anything goes wrong
      setDate(clampToMinDelivery(getMinDelivery()));
    } finally {
      setAndroidTempDate(null);
    }
  };

  const minDelivery = getMinDelivery();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.secondary }]}>
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

        <Text style={[styles.title, { color: colors.textSecondary }]}>Request a Shoutout</Text>

        {/* Summary Card */}
        <View style={[styles.summaryCard, { backgroundColor: colors.bubbleBg }]}>
          <View style={styles.summaryLeft}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Price</Text>
            <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>ZWG {shoutoutPrice}</Text>
          </View>
          <View style={styles.summaryMid}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Wallet</Text>
            <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>ZWG {mockWalletBalance}</Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>ETA</Text>
            <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>~{timeUntilDelivery}h</Text>
          </View>
        </View>

        {/* Celeb Card */}
        <View style={[styles.celebCard, { backgroundColor: colors.secondary }]}>
          <Image source={{ uri: celeb.image || celeb.avatar }} style={styles.celebImage} />
          <View style={styles.celebInfo}>
            <Text style={[styles.celebName, { color: colors.textSecondary }]}>{celeb.name}</Text>
            <Text style={[styles.celebRole, { color: colors.primary }]}>{celeb.role || 'Public Figure'}</Text>
          </View>
        </View>

        {/* Recipient */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Recipient Name</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bubbleBg, color: colors.textSecondary }]}
          value={recipient}
          onChangeText={setRecipient}
          placeholder="Enter recipient's name"
          placeholderTextColor={colors.placeholder}
        />

        {/* Purpose */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Purpose</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bubbleBg, color: colors.textSecondary }]}
          value={purpose}
          onChangeText={setPurpose}
          placeholder="Why this shoutout?"
          placeholderTextColor={colors.placeholder}
        />

        {/* Message */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Your Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput, { backgroundColor: colors.bubbleBg, color: colors.textSecondary }]}
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="Type your personalized message"
          placeholderTextColor={colors.placeholder}
        />

        {/* Message Type */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>Message Type</Text>
        <View style={styles.bubbles}>
          {['text', 'video', 'audio'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.bubble,
                {
                  backgroundColor: messageType === type ? colors.primary : colors.secondary,
                  borderColor: messageType === type ? colors.primary : colors.bubbleBg,
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
        <Text style={[styles.label, { color: colors.textSecondary }]}>Delivery Time</Text>
        <TouchableOpacity onPress={openPicker} style={[styles.datePicker, { backgroundColor: colors.bubbleBg }]} activeOpacity={0.8}>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>{date?.toLocaleString?.() || ''}</Text>
          <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} style={{ marginLeft: 12 }} />
        </TouchableOpacity>

        {/* Platform-specific pickers */}
        {Platform.OS === 'ios' && showIOSPicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            minimumDate={minDelivery}
            display="spinner"
            onChange={onChangeIOS}
          />
        )}

        {Platform.OS === 'android' && showAndroidDate && (
          <DateTimePicker
            value={date}
            mode="date"
            minimumDate={minDelivery}
            display="calendar"
            onChange={onChangeAndroidDate}
          />
        )}

        {Platform.OS === 'android' && showAndroidTime && (
          <DateTimePicker
            value={date}
            mode="time"
            is24Hour
            display="clock"
            onChange={onChangeAndroidTime}
          />
        )}

        {/* Book Button */}
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={validateAndSubmit} activeOpacity={0.9}>
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Book now • ZWG {shoutoutPrice}</Text>
        </TouchableOpacity>

        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          Earliest available time is {minDelivery.toLocaleString()}. We’ll notify you once the celebrity accepts and records your shoutout.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  contentContainer: {
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 20,
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
