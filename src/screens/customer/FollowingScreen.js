import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Colors from '../../constants/Colors';

// Dummy followed celebrities
const followedCelebs = [
  {
    id: '1',
    name: 'DJ Zinhle',
    avatar: 'https://randomuser.me/api/portraits/men/70.jpg',
    specialization: 'Birthday shoutouts, Motivational messages',
    previewVideos: [
      { id: 'v1', uri: 'https://placekitten.com/200/200' },
      { id: 'v2', uri: 'https://placekitten.com/201/200' },
      { id: 'v3', uri: 'https://placekitten.com/202/200' },
    ],
  },
  {
    id: '2',
    name: 'Cassper Nyovest',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    specialization: 'Music shoutouts, Promotions',
    previewVideos: [
      { id: 'v1', uri: 'https://placekitten.com/210/200' },
      { id: 'v2', uri: 'https://placekitten.com/211/200' },
    ],
  },
];

export default function FollowingScreen({ navigation }) {
  const renderCelebCard = ({ item }) => (
    <View style={styles.celebCard}>
      <View style={styles.headerRow}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.specialization} numberOfLines={1}>
            {item.specialization}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.previewScroll}
      >
        {item.previewVideos.map((video) => (
          <Image
            key={video.id}
            source={{ uri: video.uri }}
            style={styles.previewThumb}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Text style={styles.pageTitle}>Following</Text>

      {followedCelebs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>You’re not following anyone yet.</Text>
        </View>
      ) : (
        <FlatList
          data={followedCelebs}
          keyExtractor={(item) => item.id}
          renderItem={renderCelebCard}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
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
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#fff9f5',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  celebCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textDark,
  },
  specialization: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  bookButtonText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
  previewScroll: {
    marginTop: 4,
  },
  previewThumb: {
    width: 100,
    height: 130,
    borderRadius: 10,
    backgroundColor: '#ddd',
    marginRight: 8,
  },
  emptyState: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
  },
});
