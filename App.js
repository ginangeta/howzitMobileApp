// App.js
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AuthNavigator from './src/navigation/AuthNavigator';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { LoginProvider } from './src/context/LoginContext';

import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';

function AppContent({ showOnboarding, onFinishOnboarding }) {
  const { navTheme } = useAppTheme();

  return (
    <NavigationContainer theme={navTheme}>
      {showOnboarding ? (
        <OnboardingScreen onDone={onFinishOnboarding} />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const seen = await AsyncStorage.getItem('hasSeenOnboarding');
        setShowOnboarding(!seen);
      } catch (e) {
        console.warn('Error checking onboarding status', e);
      } finally {
        setLoading(false);
      }
    };
    checkOnboarding();
  }, []);

  const handleFinishOnboarding = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setShowOnboarding(false);
    } catch (e) {
      console.warn('Error setting onboarding status', e);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff6600" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LoginProvider>
        <ThemeProvider>
          <AppContent
            showOnboarding={showOnboarding}
            onFinishOnboarding={handleFinishOnboarding}
          />
        </ThemeProvider>
      </LoginProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
