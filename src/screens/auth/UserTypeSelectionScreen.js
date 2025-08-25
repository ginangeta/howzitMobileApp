import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { useLogin } from '../../context/LoginContext';
import { useAppTheme } from '../../context/ThemeContext';
import Colors from '../../constants/Colors';

export default function UserTypeSelectionScreen({ navigation }) {
  const { colors } = useAppTheme();
  const C = colors ?? Colors;
  const { setIsLoggedIn, setUserType } = useLogin();

  const [selectedType, setSelectedType] = useState(null); // State to manage selection

  const handleConfirmSelection = () => {
    if (!selectedType) {
      Alert.alert('Selection Required', 'Please select if you are a Fan or a Creator.');
      return;
    }

    setUserType(selectedType);
    setIsLoggedIn(true);

    if (selectedType === 'celeb') {
      navigation.navigate('CelebrityTabs');
    } else {
      navigation.navigate('CustomerHome');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.header}>
        <Text style={[styles.title, { color: C.textPrimary }]}>How will howzit! be used?</Text>
        <Text style={[styles.subtitle, { color: C.textSecondary + 'AA' }]}>
          Don't worry, your experience is tailored to your choice.
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            { borderColor: C.textPrimary + '33' },
            selectedType === 'customer' && { borderColor: '#FF7A00' },
          ]}
          onPress={() => setSelectedType('customer')}
          activeOpacity={0.8}
        >
          <Text style={[styles.optionIcon, { color: C.textPrimary }]}>👤</Text>
          <Text style={[styles.optionTitle, { color: C.textPrimary }]}>Fan</Text>
          <Text style={[styles.optionDescription, { color: C.textSecondary + 'CC' }]}>
            Order personalized shout-outs
            from your favorite creators.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionCard,
            { borderColor: C.textPrimary + '33' },
            selectedType === 'celeb' && { borderColor: '#FF7A00' },
          ]}
          onPress={() => setSelectedType('celeb')}
          activeOpacity={0.8}
        >
          <Text style={[styles.optionIcon, { color: C.textPrimary }]}>✨</Text>
          <Text style={[styles.optionTitle, { color: C.textPrimary }]}>Creator</Text>
          <Text style={[styles.optionDescription, { color: C.textSecondary + 'CC' }]}>
            Create content and earn income
            from your fans.
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.confirmButton,
          { backgroundColor: '#FF7A00' },
          !selectedType && styles.buttonDisabled,
        ]}
        onPress={handleConfirmSelection}
        disabled={!selectedType}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280, // Constrain width for better readability
  },
  optionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  optionCard: {
    width: '48%',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    minHeight: 180, // Ensure cards have a minimum height
    justifyContent: 'center',
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  confirmButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});