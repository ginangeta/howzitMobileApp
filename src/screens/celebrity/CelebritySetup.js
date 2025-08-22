import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image, ScrollView
} from 'react-native';
import Colors from '../../constants/Colors';

export default function CelebritySetup({ navigation }) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [acceptedTypes, setAcceptedTypes] = useState(['text']);
  const [leadTime, setLeadTime] = useState('');
  const [rate, setRate] = useState('');

  const toggleType = (type) => {
    setAcceptedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = () => {
    if (!name || !bio || !leadTime || !rate || acceptedTypes.length === 0) {
      return Alert.alert('Missing Fields', 'Please complete all fields to save your profile.');
    }

    const celebProfile = {
      name,
      bio,
      acceptedTypes,
      deliveryTime: leadTime,
      price: parseFloat(rate),
      avatar: 'https://i.pravatar.cc/100?img=4', // Placeholder avatar
    };

    navigation.navigate('CelebrityTabs', { celebProfile });
  };

  const emojiMap = {
    text: '💬',
    video: '🎥',
    audio: '🎙️',
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <Text style={styles.title}>🌟 Complete Your Profile</Text>

      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100?img=4' }}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. DJ Howzit"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Short Bio</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={bio}
        onChangeText={setBio}
        multiline
        placeholder="Tell fans what you’re known for!"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Accepted Message Types</Text>
      <View style={styles.bubbles}>
        {['text', 'video', 'audio'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.bubble,
              acceptedTypes.includes(type) && styles.bubbleSelected,
            ]}
            onPress={() => toggleType(type)}
          >
            <Text
              style={
                acceptedTypes.includes(type)
                  ? styles.bubbleTextSelected
                  : styles.bubbleText
              }
            >
              {emojiMap[type]} {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Delivery Lead Time</Text>
      <TextInput
        style={styles.input}
        value={leadTime}
        onChangeText={setLeadTime}
        placeholder="e.g. 2 days"
        placeholderTextColor="#aaa"
      />

      <Text style={styles.label}>Rate per Shoutout (USD)</Text>
      <TextInput
        style={styles.input}
        value={rate}
        onChangeText={setRate}
        keyboardType="numeric"
        placeholder="e.g. 20"
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.8}>
        <Text style={styles.buttonText}>✅ Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff9f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: Colors.textSecondary,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  bubbles: {
    flexDirection: 'row',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  bubble: {
    backgroundColor: Colors.bubbleBg,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginRight: 10,
    marginBottom: 10,
  },
  bubbleSelected: {
    backgroundColor: Colors.accentBlue,
  },
  bubbleText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  bubbleTextSelected: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  button: {
    backgroundColor: Colors.accentGreen,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
