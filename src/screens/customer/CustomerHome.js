import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

const sampleCelebs = [
  {
    id: '1',
    name: 'DJ Zinhle',
    price: 25,
    deliveryTime: '2 days',
    rating: 4.8,
    shoutoutsCount: 142,
    avatar: 'https://randomuser.me/api/portraits/men/70.jpg',
    acceptedTypes: ['Video', 'Text'],
    specialization: 'Birthday shoutouts, Motivational messages',
    bio: 'Top DJ and businesswoman ready to hype you up!',
    location: 'CapeTown, South Africa',
    languages: ['English', 'Zulu'],
    tags: ['Award-winning DJ', 'Entrepreneur', 'Fashion Icon'],
  },
  {
    id: '2',
    name: 'Cassper Nyovest',
    price: 40,
    deliveryTime: '1 day',
    rating: 4.6,
    shoutoutsCount: 220,
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    acceptedTypes: ['Video'],
    specialization: 'Music shoutouts, Promotions',
    bio: 'South African rap legend. Bringing the hype to your screen!',
    location: 'Potchefstroom, South Africa',
    languages: ['English', 'Setswana'],
    tags: ['Rapper', 'Brand Ambassador', 'MMA Fighter'],
  },
  {
    id: '3',
    name: 'Sho Madjozi',
    price: 30,
    deliveryTime: '3 days',
    rating: 4.9,
    shoutoutsCount: 190,
    avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
    acceptedTypes: ['Text', 'Video'],
    specialization: 'Kids parties, Cultural events',
    bio: 'Colorful, creative, and full of joy! Let’s celebrate together!',
    location: 'Limpopo, South Africa',
    languages: ['English', 'Tsonga'],
    tags: ['Performer', 'Children’s Favorite', 'UNICEF Ambassador'],
  },
  {
    id: '4',
    name: 'Black Coffee',
    price: 50,
    deliveryTime: '2 days',
    rating: 4.7,
    shoutoutsCount: 165,
    avatar: 'https://randomuser.me/api/portraits/men/63.jpg',
    acceptedTypes: ['Video'],
    specialization: 'Classy greetings, Brand endorsements',
    bio: 'Global DJ with a touch of class. Shoutouts with style.',
    location: 'Durban, South Africa',
    languages: ['English', 'Zulu'],
    tags: ['Grammy Winner', 'Philanthropist', 'Luxury Events'],
  },
];

export default function CustomerHome({ navigation }) {
  const [search, setSearch] = useState('');

  const filteredCelebs = sampleCelebs.filter((celeb) =>
    celeb.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CelebrityProfile', { celeb: item })}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.price}>💰 ${item.price}</Text>
          <Text style={styles.info}>⏱ {item.deliveryTime}</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <View style={styles.typesContainer}>
          {item.acceptedTypes?.map((type, index) => (
            <View key={index} style={styles.typeBadge}>
              <Text style={styles.typeText}>{type}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <Text style={styles.heroTitle}>Hey there 👋</Text>
      <Text style={styles.subHeader}>Find your favorite celeb and book a shoutout!</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search Celebs..."
        placeholderTextColor="#aaa"
        value={search}
        onChangeText={setSearch}
      />

      {filteredCelebs.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="sad-outline" size={40} color="#ccc" />
          <Text style={styles.emptyText}>No celebrities found.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCelebs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
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
  card: {
    backgroundColor: Colors.bubbleBg,
    borderRadius: 20,
    overflow: 'hidden',
    flex: 0.48,
    marginBottom: 16,
    height: 260,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  cardInfo: {
    padding: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 2,
  },
  price: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
  },
  info: {
    fontSize: 12,
    color: '#666',
  },
  rating: {
    fontSize: 12,
    color: Colors.accentGreen,
    marginTop: 4,
  },
  typesContainer: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  typeBadge: {
    backgroundColor: '#eee',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginRight: 4,
  },
  typeText: {
    fontSize: 11,
    color: '#555',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    marginTop: 8,
    color: '#999',
    fontSize: 16,
  },
  specialization: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.primary,
    marginBottom: 2,
    textAlign: 'center',
  },
  bio: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 4,
  },
});
