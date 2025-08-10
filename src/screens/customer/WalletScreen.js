// src/screens/wallet/WalletScreen.js
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

export default function WalletScreen({ navigation }) {
  const { setIsLoggedIn } = useLogin();
  const [animatedBalance] = useState(new Animated.Value(0));
  const balance = 24.5;

  useEffect(() => {
    Animated.timing(animatedBalance, {
      toValue: balance,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [animatedBalance, balance]);

  const displayedBalance = animatedBalance.interpolate({
    inputRange: [0, balance],
    outputRange: [0, balance],
  });

  const walletMenus = [
    { id: 'deposit', title: 'Deposit Funds', icon: 'wallet', color: Colors.primary, screen: 'Deposit' },
    { id: 'withdraw', title: 'Withdraw Funds', icon: 'cash-outline', color: '#34a853', screen: 'Withdraw' },
    { id: 'transactions', title: 'Transactions', icon: 'list-outline', color: '#ff914d', screen: 'Transactions' },
    { id: 'settings', title: 'Settings', icon: 'settings-outline', color: '#777', screen: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={['#ff914d', '#ff6600']} style={styles.header}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/68.jpg' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>Gina Wambui</Text>
          <Text style={styles.userEmail}>gina@example.com</Text>
        </LinearGradient>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Animated.Text style={styles.balanceValue}>
            ${displayedBalance.__getValue().toFixed(2)}
          </Animated.Text>
        </View>

        {/* Wallet Menu */}
        <View style={styles.menuSection}>
          {walletMenus.map((menu) => (
            <TouchableOpacity
              key={menu.id}
              style={styles.menuCard}
              onPress={() => navigation.navigate(menu.screen)}
            >
              <View style={[styles.iconBox, { backgroundColor: menu.color }]}>
                <Icon name={menu.icon} size={22} color="#fff" />
              </View>
              <Text style={styles.menuText}>{menu.title}</Text>
              <Icon name="chevron-forward-outline" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={async () => {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userInfo');
            setIsLoggedIn(false);
            navigation.reset({ index: 0, routes: [{ name: 'UnifiedLogin' }] });
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff9f5' },
  backgroundImage: { ...StyleSheet.absoluteFillObject, opacity: 0.08 },
  scrollContent: { paddingBottom: 30 },

  // Header
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 10,
  },
  username: { fontSize: 18, fontWeight: '700', color: '#fff' },
  userEmail: { fontSize: 14, color: '#fff', opacity: 0.9 },

  // Balance
  balanceCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -10,
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
  balanceLabel: { fontSize: 14, color: '#666', marginBottom: 6 },
  balanceValue: { fontSize: 32, fontWeight: '800', color: Colors.textDark },

  // Menu
  menuSection: { marginTop: 30, paddingHorizontal: 20 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#333' },

  // Logout
  logoutBtn: {
    backgroundColor: '#ff3b30',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
