import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Animated,
  TextInput,
  RefreshControl,
} from 'react-native';
import Colors from '../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CelebrityDashboard({ navigation, route }) {
  const { celebProfile } = route.params;

  const initialRequests = [
    {
      id: '1',
      customerName: 'Gina',
      messageType: 'video',
      deliveryTime: '2025-06-05T10:00:00',
      status: 'Pending',
      message: 'Happy birthday shoutout!',
      recipient: 'James',
    },
    {
      id: '2',
      customerName: 'Alex',
      messageType: 'audio',
      deliveryTime: '2025-06-06T15:00:00',
      status: 'Accepted',
      message: 'Encouragement message',
      recipient: 'Nina',
    },
  ];

  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredRequests = requests.filter((req) =>
    req.customerName.toLowerCase().includes(search.toLowerCase()) ||
    req.recipient.toLowerCase().includes(search.toLowerCase())
  );

  const emojiMap = {
    video: '🎥',
    audio: '🎙️',
    text: '💬',
  };

  const animations = useRef({}).current;

  const renderItem = ({ item, index }) => {
    if (!animations[item.id]) {
      animations[item.id] = new Animated.Value(0);
      Animated.timing(animations[item.id], {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }

    return (
      <Animated.View
        style={[
          styles.card,
          {
            opacity: animations[item.id],
            transform: [
              {
                translateY: animations[item.id].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={28} color={Colors.primary} />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.name}>From: {item.customerName}</Text>
            <Text style={styles.info}>To: {item.recipient}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.info}>
            Type: {emojiMap[item.messageType] || ''} {item.messageType.toUpperCase()}
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
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      // Replace with real fetch logic later
      setRequests([...initialRequests]);
      setRefreshing(false);
    }, 1000);
  };

  const total = requests.length;
  const pending = requests.filter(r => r.status === 'Pending').length;
  const accepted = requests.filter(r => r.status === 'Accepted').length;

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

      {/* Summary Cards */}
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

      {/* Search Bar */}
      <TextInput
        placeholder="Search by name or recipient..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#aaa"
      />

      {/* List */}
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
    marginBottom: 12,
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
        ? Colors.accentBlue
        : status === 'Accepted'
          ? '#ffc107'
          : Colors.accentGreen,
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
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  navText: {
    fontSize: 10,
    color: Colors.primary,
    marginTop: 2,
    textAlign: 'center',
  },
});
