import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLogin } from '../../context/LoginContext';

export default function WalletScreen({ navigation }) {
  const { setIsLoggedIn, userType } = useLogin();

  const balance = 24.5;

  const recentActivity = [
    {
      id: 1,
      type: 'credit',
      label: 'Deposit via OneMoney',
      date: 'June 15, 2025',
      amount: 15.0,
    },
    {
      id: 2,
      type: 'debit',
      label: 'Shoutout Payment - Chris B',
      date: 'June 14, 2025',
      amount: -8.0,
    },
    {
      id: 3,
      type: 'debit',
      label: 'Platform Fee',
      date: 'June 14, 2025',
      amount: -1.0,
    },
  ];


  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>Your Wallet</Text>
        <Text style={styles.subHeading}>Track your funds and recent activity</Text>

        {/* Balance Circle */}
        <View style={styles.balanceBox}>
          <Text style={styles.label}>Available Balance</Text>
          <Text style={styles.balanceText}>${balance.toFixed(2)}</Text>
        </View>

        {/* Primary Actions */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Deposit')}
        >
          <Icon name="wallet" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.btnText}>Deposit Funds</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Transactions')}
        >
          <Icon name="list-outline" size={18} color="#34a853" style={{ marginRight: 8 }} />
          <Text style={styles.secondaryText}>View Transactions</Text>
        </TouchableOpacity>

        {/* Recent Activity Card */}
        <View style={styles.activityCard}>
          <Text style={styles.cardTitle}>🕒 Recent Activity</Text>
          {recentActivity.map((item) => (
            <View key={item.id} style={styles.activityItem}>
              <View style={styles.activityInfo}>
                <Text style={styles.activityLabel}>
                  {item.type === 'credit' ? '🟢' : '🔴'} {item.label}
                </Text>
                <Text style={styles.activityDate}>{item.date}</Text>
              </View>
              <Text
                style={[
                  styles.activityAmount,
                  { color: item.type === 'credit' ? '#34a853' : '#ff3b30' },
                ]}
              >
                {item.amount > 0 ? `+$${item.amount.toFixed(2)}` : `-$${Math.abs(item.amount).toFixed(2)}`}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.logOutButton,
          ]}
          onPress={async () => {
            // Clear session data
            await AsyncStorage.removeItem('userToken'); // or whatever key you're using
            await AsyncStorage.removeItem('userInfo');
            setIsLoggedIn(false);
            // Navigate to login
            navigation.reset({
              index: 0,
              routes: [{ name: 'UnifiedLogin' }],
            });
          }}
        >
          <Text style={styles.withdrawButtonText}>Logout</Text>
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
    backgroundColor: '#fff9f5',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ff6600',
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 15,
    color: '#666',
    marginBottom: 30,
  },
  balanceBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 4,
    borderColor: '#ff6600',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 35,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  balanceText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#222',
  },
  primaryBtn: {
    flexDirection: 'row',
    backgroundColor: '#34a853',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryBtn: {
    flexDirection: 'row',
    borderColor: '#34a853',
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 30,
  },
  secondaryText: {
    color: '#34a853',
    fontSize: 16,
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444',
    textAlign: 'center',
    marginBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'lightGrey',
    borderStyle: 'dashed',
    paddingBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#777',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  activityInfo: {
    flexShrink: 1,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  activityAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  logOutButton: {
    marginTop: 20,
    backgroundColor: '#FF0000', // a red color to indicate withdrawal
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    alignSelf: 'center',
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});
