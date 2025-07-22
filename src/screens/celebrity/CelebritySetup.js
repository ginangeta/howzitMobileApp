import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image
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
      return Alert.alert('Missing Fields', 'Please complete all fields.');
    }

    const celebProfile = {
      name,
      bio,
      acceptedTypes,
      deliveryTime: leadTime,
      price: parseFloat(rate),
      avatar: 'https://i.pravatar.cc/100?img=4', // Placeholder avatar
    };

    // Normally you'd save to backend or context/store
    navigation.navigate('CelebrityTabs', { celebProfile });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Text style={styles.title}>Complete Your Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={bio}
        onChangeText={setBio}
        multiline
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
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Delivery Lead Time (e.g. &quot;2 days&quot;)</Text>
      <TextInput style={styles.input} value={leadTime} onChangeText={setLeadTime} />

      <Text style={styles.label}>Rate per Shoutout</Text>
      <TextInput
        style={styles.input}
        value={rate}
        onChangeText={setRate}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.2,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
    color: Colors.textDark,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    fontSize: 14,
    color: Colors.textDark,
  },
  bubbles: {
    flexDirection: 'row',
    marginTop: 10,
  },
  bubble: {
    backgroundColor: Colors.bubbleBg,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    marginRight: 10,
  },
  bubbleSelected: {
    backgroundColor: Colors.accentBlue,
  },
  bubbleText: {
    color: Colors.textDark,
    fontSize: 12,
  },
  bubbleTextSelected: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 12,
  },
  button: {
    backgroundColor: Colors.accentGreen,
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
