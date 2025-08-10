import React, { useState, useRef } from 'react';
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
      deliveryTime: '2025-08-10T10:00:00',
      status: 'Pending',
      message: 'Happy birthday shoutout!',
      recipient: 'James',
    },
    {
      id: '2',
      customerName: 'Alex',
      messageType: 'audio',
      deliveryTime: '2025-08-09T15:00:00',
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
      .filter((r) =>
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
  const pending = requests.filter(r => r.status === 'Pending').length;
  const accepted = requests.filter(r => r.status === 'Accepted').length;

  const renderItem = (data) => {
    if (data.item.header) {
      return <Text style={styles.groupHeader}>{data.item.header}</Text>;
    }

    const item = data.item;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={28} color={Colors.primary} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>From: {item.customerName}</Text>
            <Text style={styles.info}>To: {item.recipient}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.info}>
            Type: {emojiMap[item.messageType]} {item.messageType.toUpperCase()}
          </Text>
          <Text style={styles.info}>
            Delivery: {new Date(item.deliveryTime).toLocaleString()}
          </Text>
        </View>

        <View style={styles.statusBubble(item.status)}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('RequestDetails', {
              request: item,
              celebProfile,
              updateStatus: (id, newStatus) => {
                setRequests(prev =>
                  prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
                );
              },
            })
          }
          activeOpacity={0.8}
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
        <Text style={{ color: '#fff', fontSize: 12 }}>Delete</Text>
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

      <Text style={styles.header}>Hey {celebProfile.name} 👋</Text>
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
        placeholder="Search by name or recipient..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#aaa"
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
          rightOpenValue={-75}
          disableRightSwipe
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff9f5',
  },
  header: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 12,
    color: '#888',
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderColor: '#eee',
    borderWidth: 1,
    marginBottom: 16,
    fontSize: 14,
    color: '#333',
  },
  groupHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginVertical: 10,
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
    color: Colors.primary,
  },
  info: {
    fontSize: 13,
    color: '#444',
    marginTop: 2,
  },
  detailRow: {
    marginTop: 4,
  },
  statusBubble: (status) => ({
    backgroundColor:
      status === 'Pending'
        ? '#007bff'
        : status === 'Accepted'
        ? '#ffc107'
        : '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 30,
    alignSelf: 'flex-start',
    marginTop: 12,
  }),
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  button: {
    marginTop: 14,
    backgroundColor: Colors.accentGreen,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  hiddenButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
    height: '100%',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
});
