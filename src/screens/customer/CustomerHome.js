import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  ScrollView,
} from 'react-native';
import Colors from '../../constants/Colors';
import api from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sampleCelebs = [
  {
    id: '1',
    displayName: 'DJ Zinhle',
    category: 'Musician',
    price: 25,
    deliveryTime: '2 days',
    rating: 4.8,
    shoutoutsCount: 142,
    picture: 'https://randomuser.me/api/portraits/men/70.jpg',
    bio: 'Top DJ and businesswoman ready to hype you up!',
  },
  {
    id: '2',
    displayName: 'Cassper Nyovest',
    category: 'Musician',
    price: 40,
    deliveryTime: '1 day',
    rating: 4.6,
    shoutoutsCount: 220,
    picture: 'https://randomuser.me/api/portraits/men/54.jpg',
    bio: 'South African rap legend. Bringing the hype to your screen!',
  },
  {
    id: '3',
    displayName: 'Sho Madjozi',
    category: 'Actor',
    price: 30,
    deliveryTime: '3 days',
    rating: 4.9,
    shoutoutsCount: 190,
    picture: 'https://randomuser.me/api/portraits/women/30.jpg',
    bio: 'Colorful, creative, and full of joy! Let’s celebrate together!',
  },
  {
    id: '4',
    displayName: 'Black Coffee',
    category: 'Musician',
    price: 50,
    deliveryTime: '2 days',
    rating: 4.7,
    shoutoutsCount: 165,
    picture: 'https://randomuser.me/api/portraits/men/63.jpg',
    bio: 'Global DJ with a touch of class. Shoutouts with style.',
  },
];

export default function CustomerHome({ navigation }) {
  const [search, setSearch] = useState('');
  const [celebs, setCelebs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCelebs = async () => {
      try {
        const res = await api.get('celebs/list-celebs');
        if (res.data.success) {
          setCelebs(res.data.data || []);
        } else {
          console.warn('⚠️ Failed to fetch celebs:', res.data.message);
        }
      } catch (err) {
        console.error('❌ Error fetching celebs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCelebs();
  }, []);

  const filteredCelebs = sampleCelebs.filter((celeb) =>
    celeb.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const renderCard = (item) => (
    <TouchableOpacity
      key={item._id}
      style={styles.card}
      onPress={() => navigation.navigate('CelebrityProfile', { celeb: item })}
    >
      <Image
        source={{
          uri: item.picture
            ? item.picture
            : 'https://via.placeholder.com/150?text=No+Image',
        }}
        style={styles.avatar}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.name}>{item.displayName}</Text>
        <Text style={styles.price}>
          ${item.shoutout?.[0]?.price || '0'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title, data) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CelebrityList', { category: title })}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderCard(item, true)}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.insideContainer}>
        <Text style={styles.heroTitle}>Browse</Text>
        <Text style={styles.subHeader}>Find your favorite celeb and book a shoutout!</Text>

        <TextInput
          style={styles.searchBar}
          placeholder="Search Stars..."
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />

        {filteredCelebs.slice(0, 4).length > 0 &&
          renderSection('Trending', filteredCelebs.slice(0, 4))}

        {filteredCelebs.filter((c) => c.category === 'Actor').length > 0 &&
          renderSection('Actors', filteredCelebs.filter((c) => c.category === 'Actor'))}

        {filteredCelebs.filter((c) => c.category === 'Musician').length > 0 &&
          renderSection('Musicians', filteredCelebs.filter((c) => c.category === 'Musician'))}

        {filteredCelebs.filter((c) => c.category === 'Athlete').length > 0 &&
          renderSection('Athletes', filteredCelebs.filter((c) => c.category === 'Athlete'))}

        {filteredCelebs.filter((c) => c.category === 'Creator').length > 0 &&
          renderSection('Creators', filteredCelebs.filter((c) => c.category === 'Creator'))}

        {filteredCelebs.filter((c) => c.category === 'Religious Leader').length > 0 &&
          renderSection('Religious Leaders', filteredCelebs.filter((c) => c.category === 'Religious Leader'))}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  insideContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
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
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.accentBlue,
  },
  card: {
    backgroundColor: Colors.bubbleBg,
    borderRadius: 16,
    overflow: 'hidden',
    width: 160,
    marginRight: 12,
  },
  smallCard: {
    width: 140,
  },
  avatar: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  cardInfo: {
    padding: 8,
    alignItems: 'center',
    backgroundColor: Colors.secondary,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textDark,
    marginBottom: 2,
  },
  bio: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  rating: {
    fontSize: 12,
    color: Colors.accentGreen,
    marginTop: 4,
  },
});
