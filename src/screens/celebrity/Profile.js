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
  const [displayBalance, setDisplayBalance] = useState(0);
  const balance = 5924.5;

  const celebProfile = {
    name: 'Gina Wambui',
    bio: 'Award-winning entertainer passionate about bringing joy to fans through personalized shoutouts.',
    avatar: 'https://i.pravatar.cc/100?img=4',
    acceptedTypes: ['video', 'text'],
    deliveryTime: '2 days',
    price: 50.0,
    shoutoutsDone: 124,
    rating: 4.8,
    balance: 5924.0,
  };

  useEffect(() => {
    const listener = animatedBalance.addListener(({ value }) => setDisplayBalance(value));
    Animated.timing(animatedBalance, {
      toValue: balance,
      duration: 1200,
      useNativeDriver: false,
    }).start();
    return () => animatedBalance.removeListener(listener);
  }, [animatedBalance, balance]);

  const walletMenus = [
    { id: 'withdraw', title: 'Withdraw Funds', icon: 'cash-outline', color: Colors.accentGreen, screen: 'Withdraw' },
    { id: 'transactions', title: 'Transactions', icon: 'list-outline', color: Colors.accentBlue, screen: 'Transactions' },
    { id: 'settings', title: 'Settings', icon: 'settings-outline', color: Colors.textSecondary, screen: 'Settings' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-outline" size={28} color={Colors.textPrimary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primary || '#ff6600', Colors.accentOrange || '#ff914d']}
          style={styles.header}
        >
          <Image
            source={{ uri: 'https://merry-strudel-581da2.netlify.app/assets/img/doctor-grid/felista.jpg' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>Gina Wambui</Text>
          <Text style={styles.userEmail}>gina@example.com</Text>
        </LinearGradient>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>
            ZWG {displayBalance.toFixed(2)}
          </Text>
        </View>

        {/* Wallet Menu */}
        <View style={styles.menuSection}>
          {walletMenus.map((menu) => (
            <TouchableOpacity
              key={menu.id}
              style={styles.menuCard}
              onPress={() => navigation.navigate(menu.screen, { balance: displayBalance, celebProfile })}
            >
              <View style={[styles.iconBox, { backgroundColor: menu.color }]}>
                <Icon name={menu.icon} size={22} color="#fff" />
              </View>
              <Text style={styles.menuText}>{menu.title}</Text>
              <Icon name="chevron-forward-outline" size={20} color={Colors.textPrimary} />
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
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  scrollContent: { paddingBottom: 30 },

  backBtn: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.textPrimary,
    marginBottom: 12,
  },
  username: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  userEmail: { fontSize: 14, color: Colors.textPrimary, opacity: 0.9 },

  // Balance Card
  balanceCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: -30,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 4,
  },
  balanceLabel: { fontSize: 14, color: Colors.textSecondary, opacity: 0.7, marginBottom: 6 },
  balanceValue: { fontSize: 36, fontWeight: '800', color: Colors.textSecondary },

  // Menu
  menuSection: { marginTop: 30, paddingHorizontal: 20 },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 22,          // smoother rounded corners
    paddingVertical: 12,        // slightly less padding for sleekness
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,       // lighter shadow for modern feel
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,              // less elevation
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,           // slightly tighter spacing
  },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textSecondary },

  // Logout
  logoutBtn: {
    backgroundColor: Colors.accentRed,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
});
