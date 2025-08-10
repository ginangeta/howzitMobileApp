import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SectionList,
} from 'react-native';
import Colors from '../../constants/Colors';
import * as Animatable from 'react-native-animatable';
import { Swipeable } from 'react-native-gesture-handler';

const initialRequests = [
  {
    id: '1',
    celebName: 'DJ Breezy',
    type: 'Video',
    status: 'Completed',
    date: '2025-06-01',
    avatar: 'https://i.pravatar.cc/100?img=5',
    deliveryEstimate: '2 days',
    message: 'Happy Birthday!',
    messageType: 'Birthday',
    recipient: 'John',
    videoUrl: 'https://yourshoutoutlink.com/shout123',
    deliveryTime: new Date().toISOString(),
  },
  {
    id: '2',
    celebName: 'Queen Zee',
    type: 'Text',
    status: 'Pending',
    date: '2025-06-03',
    avatar: 'https://i.pravatar.cc/100?img=6',
    deliveryEstimate: '1 day',
    message: 'Congratulations!',
    messageType: 'Congrats',
    recipient: 'Jane',
    deliveryTime: new Date().toISOString(),
  },
];

export default function RequestList({ navigation }) {
  const [search, setSearch] = useState('');
  const [requests, setRequests] = useState(initialRequests);

  const filtered = requests.filter((req) =>
    `${req.celebName} ${req.type}`.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = [
    { title: 'Pending', data: filtered.filter((r) => r.status === 'Pending') },
    { title: 'Completed', data: filtered.filter((r) => r.status === 'Completed') },
  ];

  const handleDelete = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const renderRightActions = (item) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(item.id)}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }) => {
    const isCompleted = item.status === 'Completed';

    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <Animatable.View animation="fadeInUp" duration={400} delay={index * 100}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('StatusTracker', { ...item, celeb: item })}
          >
            <View style={styles.row}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.cardInfo}>
                <View style={styles.headerRow}>
                  <Text style={styles.celebName}>{item.celebName}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: isCompleted ? Colors.accentGreen : '#FFD580' },
                    ]}
                  >
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>
                <Text style={styles.detail}>📝 Type: <Text style={styles.detailValue}>{item.type}</Text></Text>
                <Text style={styles.detail}>📅 Date: <Text style={styles.detailValue}>{item.date}</Text></Text>
                <Text style={styles.detail}>⏳ Delivery: <Text style={styles.detailValue}>{item.deliveryEstimate}</Text></Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Text style={styles.heading}>Your Shoutout Requests</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search by celeb or type..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />

      <SectionList
        sections={grouped}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: '#fffdfb',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 20,
    color: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 999,
    marginRight: 14,
    backgroundColor: '#eee',
  },
  cardInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  celebName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  detail: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  detailValue: {
    fontWeight: '500',
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#ff5252',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 10,
    borderRadius: 10,
  },
  deleteText: {
    color: 'white',
    fontWeight: '600',
  },
});
