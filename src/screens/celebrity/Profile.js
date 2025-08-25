// src/screens/wallet/WalletScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
  Platform,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLogin } from '../../context/LoginContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function WalletScreen({ navigation }) {
  const { setIsLoggedIn } = useLogin();

  // Theme (fallbacks for safety)
  const { themeName, toggleTheme, colors } = useAppTheme();

  const [balance] = useState(1200.45);
  const animatedBalance = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(animatedBalance, {
      toValue: balance,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [balance, animatedBalance]);

  const logout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const balanceText = animatedBalance.interpolate({
    inputRange: [0, balance],
    outputRange: ['0', balance.toFixed(2)],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'}
      />

      {/* Gradient Header */}
      <LinearGradient
        colors={[colors.primary, colors.accentOrange]}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Wallet</Text>

          <TouchableOpacity
            style={styles.themeToggle}
            onPress={toggleTheme}
          >
            <Icon
              name={themeName === 'dark' ? 'sunny' : 'moon'}
              size={22}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Balance */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Animated.Text style={styles.balanceText}>
            {balanceText.__getValue ? balanceText.__getValue() : `$${balance.toFixed(2)}`}
          </Animated.Text>
        </View>
      </LinearGradient>

      {/* Menu */}
      <ScrollView contentContainerStyle={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Icon name="add-circle-outline" size={24} color={colors.primary} />
          <Text style={[styles.menuText, { color: colors.textPrimary }]}>Add Funds</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="card-outline" size={24} color={colors.primary} />
          <Text style={[styles.menuText, { color: colors.textPrimary }]}>Payment Methods</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Icon name="document-text-outline" size={24} color={colors.primary} />
          <Text style={[styles.menuText, { color: colors.textPrimary }]}>Transactions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={logout}>
          <Icon name="log-out-outline" size={24} color={colors.accentRed} />
          <Text style={[styles.menuText, { color: colors.accentRed }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  backButton: { padding: 8 },
  themeToggle: { padding: 8 },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },

  balanceContainer: {
    marginTop: 20,
    alignItems: 'center',
  },

  balanceLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },

  balanceText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },

  menuContainer: {
    padding: 20,
    gap: 16,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  menuText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
});
