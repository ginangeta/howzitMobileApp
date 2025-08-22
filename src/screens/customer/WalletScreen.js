import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import { useLogin } from '../../context/LoginContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function WalletScreen({ navigation }) {
  const { setIsLoggedIn } = useLogin();
  const [animatedBalance] = useState(new Animated.Value(0));
  const { themeName, toggleTheme, colors } = useAppTheme();
  const [displayBalance, setDisplayBalance] = useState(0);
  const balance = 5924.5;


  // Animated balance
  useEffect(() => {
    const listener = animatedBalance.addListener(({ value }) =>
      setDisplayBalance(value)
    );
    Animated.timing(animatedBalance, {
      toValue: balance,
      duration: 1200,
      useNativeDriver: false,
    }).start();
    return () => animatedBalance.removeListener(listener);
  }, [animatedBalance, balance]);

  const currentColors = Colors[themeName];

  const walletMenus = [
    {
      id: 'deposit',
      title: 'Deposit Funds',
      icon: 'wallet',
      color: currentColors.primary,
      screen: 'Deposit',
    },
    {
      id: 'withdraw',
      title: 'Withdraw Funds',
      icon: 'cash-outline',
      color: currentColors.accentGreen,
      screen: 'Withdraw',
    },
    {
      id: 'transactions',
      title: 'Transactions',
      icon: 'list-outline',
      color: currentColors.accentBlue,
      screen: 'Transactions',
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
      color: currentColors.textSecondary,
      screen: 'Settings',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: currentColors.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[currentColors.primary, currentColors.accentOrange]}
          style={styles.header}
        >
          {/* Theme Toggle */}
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Icon
              name={themeName === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={22}
              color={currentColors.textPrimary}
            />
          </TouchableOpacity>

          <Image
            source={{
              uri: 'https://merry-strudel-581da2.netlify.app/assets/img/doctor-grid/felista.jpg',
            }}
            style={[styles.avatar, { borderColor: currentColors.textPrimary }]}
          />
          <Text style={[styles.username, { color: currentColors.textPrimary }]}>
            Gina Wambui
          </Text>
          <Text style={[styles.userEmail, { color: currentColors.textPrimary }]}>
            gina@example.com
          </Text>
        </LinearGradient>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: currentColors.bubbleBg }]}>
          <Text style={[styles.balanceLabel, { color: currentColors.textSecondary }]}>
            Available Balance
          </Text>
          <Text style={[styles.balanceValue, { color: currentColors.textSecondary }]}>
            ZWG {displayBalance.toFixed(2)}
          </Text>
        </View>

        {/* Wallet Menu */}
        <View style={styles.menuSection}>
          {walletMenus.map((menu) => (
            <TouchableOpacity
              key={menu.id}
              style={[styles.menuCard, { backgroundColor: currentColors.bubbleBg }]}
              onPress={() => navigation.navigate(menu.screen)}
            >
              <View style={[styles.iconBox, { backgroundColor: menu.color }]}>
                <Icon name={menu.icon} size={22} color="#fff" />
              </View>
              <Text style={[styles.menuText, { color: currentColors.textSecondary }]}>
                {menu.title}
              </Text>
              <Icon name="chevron-forward-outline" size={20} color={currentColors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: currentColors.accentRed }]}
          onPress={async () => {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userInfo');
            setIsLoggedIn(false);
            navigation.reset({ index: 0, routes: [{ name: 'UnifiedLogin' }] });
          }}
        >
          <Text style={[styles.logoutText, { color: currentColors.textPrimary }]}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 30 },

  // Header
  header: {
    alignItems: 'center',
    paddingVertical: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    position: 'relative',
  },
  themeToggle: {
    position: 'absolute',
    top: 40,
    right: 20,
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
  userEmail: { fontSize: 14, opacity: 0.9 },

  // Balance Card
  balanceCard: {
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
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
