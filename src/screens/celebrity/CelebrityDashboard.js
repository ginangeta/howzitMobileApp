import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Colors from '../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CelebrityDashboard({ navigation, route }) {
  const { celebProfile } = route.params;

  const initialRequests = [
    {
      id: '1',
      customerName: 'Gina',
      messageType: 'video',
      deliveryTime: '2025-08-20T10:00:00',
      status: 'Pending',
      message: 'Happy birthday shoutout!',
      recipient: 'James',
    },
    {
      id: '2',
      customerName: 'Alex',
      messageType: 'audio',
      deliveryTime: '2025-08-19T15:00:00',
      status: 'Accepted',
      message: 'Encouragement message',
      recipient: 'Nina',
    },
  ];

  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const emojiMap = {
    video: '🎥',
    audio: '🎙️',
    text: '💬',
  };

  const groupedRequests = ['Pending', 'Accepted'].flatMap((status) => {
    const group = requests
      .filter((r) => r.status === status)
      .filter(
        (r) =>
          r.customerName.toLowerCase().includes(search.toLowerCase()) ||
          r.recipient.toLowerCase().includes(search.toLowerCase())
      );
    return group.length ? [{ header: status }, ...group] : [];
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRequests([...initialRequests]);
      setRefreshing(false);
    }, 1000);
  };

  const handleDelete = (id) => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
  };

  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'Pending').length;
  const accepted = requests.filter((r) => r.status === 'Accepted').length;

  const renderItem = (data) => {
    if (data.item.header) {
      return <Text style={styles.groupHeader}>{data.item.header}</Text>;
    }

    const item = data.item;
    const deliveryDate = new Date(item.deliveryTime);
    const now = new Date();
    const timeLeft = Math.max(deliveryDate - now, 0);
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesLeft = Math.floor(
      (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={36} color={Colors.primary} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>{item.customerName}</Text>
            <Text style={styles.info}>To: {item.recipient}</Text>
          </View>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{emojiMap[item.messageType]}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View>
            <Text style={styles.info}>
              Delivery Date: {new Date(item.deliveryTime).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
            <Text style={styles.info}>
              Delivery: ({daysLeft}d {hoursLeft}h {minutesLeft}m left)
            </Text>
          </View>
          <View style={styles.statusBubble(item.status)}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('RequestDetails', {
              request: item,
              celebProfile,
              updateStatus: (id, newStatus) => {
                setRequests((prev) =>
                  prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
                );
              },
            })
          }
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHiddenItem = (data) => {
    if (data.item.header) return null;
    return (
      <TouchableOpacity
        style={styles.hiddenButton}
        onPress={() => handleDelete(data.item.id)}
      >
        <Ionicons name="trash" size={22} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 12, marginTop: 2 }}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <Text style={styles.header}>Hey, {celebProfile.name}</Text>
      <Text style={styles.subHeader}>Ready to make someone smile today?</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total</Text>
          <Text style={styles.summaryCount}>{total}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Pending</Text>
          <Text style={styles.summaryCount}>{pending}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Accepted</Text>
          <Text style={styles.summaryCount}>{accepted}</Text>
        </View>
      </View>

      <TextInput
        placeholder="Search requests..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#999"
      />

      {groupedRequests.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 16, color: '#888' }}>No requests found 😕</Text>
        </View>
      ) : (
        <SwipeListView
          data={groupedRequests}
          keyExtractor={(item, index) => item.id || `header-${index}`}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-80}
          disableRightSwipe
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#F7F7F7',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
  },
  header: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 15,
    color: Colors.textSecondary + 'CC',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.textPrimary,
    paddingVertical: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  summaryTitle: {
    fontSize: 12,
    color: Colors.textSecondary + '88',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 18,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textSecondary,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  groupHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginVertical: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
    color: Colors.primary,
  },
  info: {
    fontSize: 13,
    color: Colors.textSecondary + 'CC',
    marginTop: 2,
  },
  detailRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeBadge: {
    marginLeft: 'auto',
    backgroundColor: Colors.primary + '22',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeText: {
    fontSize: 16,
  },
  statusBubble: (status) => ({
    backgroundColor:
      status === 'Pending'
        ? '#FFB700'
        : status === 'Accepted'
          ? Colors.accentGreen
          : '#28A745',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
  }),
  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  button: {
    marginTop: 14,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  hiddenButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '80%',
    backgroundColor: '#FF4D4F',
    borderRadius: 18,
  },
});
