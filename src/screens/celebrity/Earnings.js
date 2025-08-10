import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Colors from '../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Earnings() {
  const earnings = {
    total: 1240.5,
    pending: 320,
    completed: 18,
    balance: 450.75,
  };

  const earningsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [200, 320, 450, 700, 800, 1240.5],
        strokeWidth: 2,
        color: () => Colors.primary,
      },
    ],
  };

  const StatCard = ({ icon, label, value, prefix = '$', isCurrency = true }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <Ionicons name={icon} size={28} color={Colors.primary} style={styles.cardIcon} />
        <View style={styles.textGroup}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.amount}>
            {isCurrency
              ? `${prefix}${Number(value).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`
              : `${value.toLocaleString()}`}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Text style={styles.heading}>💸 Earnings Overview</Text>

      <View style={styles.chartCard}>
        <Text style={styles.sectionLabel}>This Year’s Progress</Text>
        <LineChart
          data={earningsData}
          width={Dimensions.get('window').width - 70}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#fff9f5',
            backgroundGradientTo: '#fff9f5',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 140, 0, ${opacity})`,
            labelColor: () => '#666',
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: Colors.primary,
            },
            propsForBackgroundLines: {
              strokeDasharray: '',
              stroke: '#eee',
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <Text style={styles.sectionLabel}>Quick Stats</Text>

      <StatCard icon="file-tray-full-outline" label="Total Earned" value={earnings.total} />
      <StatCard icon="bag-add-outline" label="Pending Requests" value={earnings.pending} />
      <StatCard
        icon="checkmark-done-circle-outline"
        label="Completed Shoutouts"
        value={earnings.completed}
        isCurrency={false}
      />
      <StatCard icon="wallet-outline" label="Available Balance" value={earnings.balance} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#fff9f5',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 24,
    textAlign: 'center',
    marginTop: 60,
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  chart: {
    marginTop: 12,
    borderRadius: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    marginLeft: 6,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 14,
  },
  textGroup: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
});
