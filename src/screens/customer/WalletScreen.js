// src/screens/wallet/WalletScreen.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Animated,
  Platform,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import { useLogin } from '../../context/LoginContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function WalletScreen({ navigation }) {
  const { setIsLoggedIn } = useLogin();

  // Use a ref so the Animated.Value persists across renders
  const animatedBalance = useRef(new Animated.Value(0)).current;

  // Theme: prefer ThemeContext.colors, then fall back to Colors[themeName], then Colors.light
  const {
    themeName = 'light',
    toggleTheme = () => {},
    colors: themeColors,
  } = useAppTheme() || {};
  const C = themeColors || Colors[themeName] || Colors.light;

  const [displayBalance, setDisplayBalance] = useState(0);
  const balance = 5924.5;

  // Animate the balance and clean up listener + animation on unmount
  useEffect(() => {
    const listenerId = animatedBalance.addListener(({ value }) => setDisplayBalance(value));

    const anim = Animated.timing(animatedBalance, {
      toValue: balance,
      duration: 1200,
      useNativeDriver: false,
    });
    anim.start();

    return () => {
      // remove listener and stop animation (defensive)
      animatedBalance.removeListener(listenerId);
      anim.stop && anim.stop();
    };
  }, [animatedBalance, balance]);

  // Use theme tokens from C safely (provide useful fallbacks)
  const gradientColors = [C.primary || '#FF7A00', C.accentOrange || C.accent || (C.primary || '#FF7A00')];
  const textPrimary = C.textPrimary || '#111';
  const textSecondary = C.textSecondary || '#666';

  const walletMenus = [
    { id: 'deposit', title: 'Deposit Funds', icon: 'wallet', color: C.primary, screen: 'Deposit' },
    { id: 'withdraw', title: 'Withdraw Funds', icon: 'cash-outline', color: C.accentGreen, screen: 'Withdraw' },
    { id: 'transactions', title: 'Transactions', icon: 'list-outline', color: C.accentBlue, screen: 'Transactions' },
    { id: 'settings', title: 'Settings', icon: 'settings-outline', color: C.textSecondary, screen: 'Settings' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: C.background || '#fff' }]}>
      {/* IMPORTANT: avoid setting translucent=true here — it persists globally and breaks other screens */}
      <StatusBar
        translucent={false}
        backgroundColor={C.background || '#fff'}
        barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic" // helps iOS adjust for safe areas
      >
        {/* Header */}
        <LinearGradient colors={gradientColors} style={styles.header}>
          {/* Theme Toggle */}
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Icon
              name={themeName === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color={C.textPrimary || '#fff'}
            />
          </TouchableOpacity>

          <Image
            source={{
              uri: 'https://merry-strudel-581da2.netlify.app/assets/img/doctor-grid/felista.jpg',
            }}
            style={[styles.avatar, { borderColor: C.textPrimary || '#fff' }]}
          />

          <Text style={[styles.username, { color: textPrimary }]}>Gina Wambui</Text>
          <Text style={[styles.userEmail, { color: textPrimary, opacity: 0.9 }]}>
            gina@example.com
          </Text>
        </LinearGradient>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: C.bubbleBg || '#fff' }]}>
          <Text style={[styles.balanceLabel, { color: C.textSecondary || textSecondary }]}>Available Balance</Text>
          <Text style={[styles.balanceValue, { color: C.textSecondary || textSecondary }]}>
            ZWG {displayBalance.toFixed(2)}
          </Text>
        </View>

        {/* Wallet Menu */}
        <View style={styles.menuSection}>
          {walletMenus.map((menu) => (
            <TouchableOpacity
              key={menu.id}
              style={[styles.menuCard, { backgroundColor: C.bubbleBg || '#fff' }]}
              onPress={() => navigation.navigate(menu.screen)}
            >
              <View style={[styles.iconBox, { backgroundColor: menu.color || C.primary }]}>
                <Icon name={menu.icon} size={22} color="#fff" />
              </View>

              <Text style={[styles.menuText, { color: C.textSecondary || textSecondary }]}>
                {menu.title}
              </Text>

              <Icon name="chevron-forward-outline" size={20} color={C.textSecondary || textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: C.accentRed || '#FF4D4F' }]}
          onPress={async () => {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userInfo');
            setIsLoggedIn(false);
            navigation.reset({ index: 0, routes: [{ name: 'UnifiedLogin' }] });
          }}
        >
          <Text style={[styles.logoutText, { color: C.textPrimary || '#fff' }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 30 },

  // Header
  header: {
    alignItems: 'center',
    paddingVertical: 36,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
    paddingTop: Platform.OS === 'android' ? 18 : 28,
  },
  themeToggle: {
    position: 'absolute',
    top: 14,
    right: 16,
    padding: 6,
    borderRadius: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    marginBottom: 10,
  },
  username: { fontSize: 18, fontWeight: '700' },
  userEmail: { fontSize: 14 },

  // Balance Card
  balanceCard: {
    marginHorizontal: 20,
    marginTop: -26,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  balanceLabel: { fontSize: 14, marginBottom: 6 },
  balanceValue: { fontSize: 32, fontWeight: '800' },

  // Menu
  menuSection: { marginTop: 30, paddingHorizontal: 20 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600' },

  // Logout
  logoutBtn: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
  logoutText: { fontSize: 16, fontWeight: '700' },
});
