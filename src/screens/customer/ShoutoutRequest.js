import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Image,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ShoutoutRequest({ route, navigation }) {
  const { celeb } = route.params;

  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [purpose, setPurpose] = useState('');
  const [messageType, setMessageType] = useState('text');
  const [date, setDate] = useState(new Date(Date.now() + 25 * 60 * 60 * 1000)); // +25 hrs
  const [showPicker, setShowPicker] = useState(false);

  const mockWalletBalance = 50;
  const shoutoutPrice = celeb.price;

  const timeUntilDelivery = Math.round((date - new Date()) / (60 * 60 * 1000)); // in hours

  const validateAndSubmit = () => {
    if (!message.trim() || !recipient.trim() || !purpose.trim()) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    const now = new Date();
    const minTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    if (date <= minTime) {
      Alert.alert('Invalid Time', 'Shoutout time must be at least 24 hours from now.');
      return;
    }

    if (mockWalletBalance < shoutoutPrice) {
      Alert.alert('Low Balance', 'You need to deposit more funds to request this shoutout.');
      return navigation.navigate('Deposit');
    }

    Alert.alert('Shoutout Requested', 'You’ll be updated once it’s accepted!');
    navigation.navigate('StatusTracker', {
      celeb,
      message,
      messageType,
      recipient,
      purpose,
      deliveryTime: date.toString(),
      status: 'Pending',
    });
  };

  const getMessageEmoji = (type) => {
    switch (type) {
      case 'text': return '✍️';
      case 'video': return '📹';
      case 'audio': return '🎤';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/abstract_bg.png')} style={styles.backgroundImage} />
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text style={styles.title}>Request a Shoutout</Text>
        <Text style={styles.summary}>💵 Price: ${shoutoutPrice} • 💰 Wallet: ${mockWalletBalance} • ⏱ In ~{timeUntilDelivery}h</Text>

        <View style={styles.celebCard}>
          <Image source={{ uri: celeb.avatar }} style={styles.celebImage} />
          <View style={{ flex: 1 }}>
            <Text style={styles.celebName}>{celeb.name}</Text>
            <View style={styles.celebTags}>
              {celeb.tags?.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.tagBubble}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>


        <Text style={styles.label}>Recipient Name</Text>
        <TextInput
          style={styles.input}
          value={recipient}
          onChangeText={setRecipient}
          placeholder="Enter recipient's name"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Purpose</Text>
        <TextInput
          style={styles.input}
          value={purpose}
          onChangeText={setPurpose}
          placeholder="Why this shoutout?"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Your Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={message}
          onChangeText={setMessage}
          multiline
          placeholder="Type your personalized message"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Message Type</Text>
        <View style={styles.bubbles}>
          {['text', 'video', 'audio'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.bubble, messageType === type && styles.bubbleSelected]}
              onPress={() => setMessageType(type)}
            >
              <Text style={messageType === type ? styles.bubbleTextSelected : styles.bubbleText}>
                {getMessageEmoji(type)} {type.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Delivery Time</Text>
        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePicker}>
          <Text style={styles.dateText}>{date.toLocaleString()}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
            onChange={(e, selected) => {
              setShowPicker(Platform.OS === 'ios');
              if (selected) setDate(selected);
            }}
          />
        )}

        <TouchableOpacity style={styles.button} onPress={validateAndSubmit}>
          <Text style={styles.buttonText}>Submit Request</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  contentContainer: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 6,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  summary: {
    textAlign: 'center',
    color: Colors.textDark,
    marginBottom: 26,
    fontSize: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: Colors.textDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 18,
  },
  messageInput: {
    height: 110,
    textAlignVertical: 'top',
  },
  bubbles: {
    flexDirection: 'row',
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  bubble: {
    backgroundColor: Colors.bubbleBg,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 30,
    marginRight: 12,
    marginBottom: 10,
  },
  bubbleSelected: {
    backgroundColor: Colors.accentBlue,
  },
  bubbleText: {
    color: Colors.textDark,
    fontSize: 13,
  },
  bubbleTextSelected: {
    color: Colors.textLight,
    fontWeight: '700',
    fontSize: 13,
  },
  datePicker: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 32,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 15,
    color: Colors.textDark,
  },
  button: {
    backgroundColor: Colors.accentGreen,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#2e7d32',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: '700',
    fontSize: 17,
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
  celebCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  celebImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
    backgroundColor: '#ddd',
  },
  celebName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  celebTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBubble: {
    backgroundColor: Colors.bubbleBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '500',
  },
});
