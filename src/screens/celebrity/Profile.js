import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import Colors from '../../constants/Colors';
import { useLogin } from '../../context/LoginContext';

export default function Profile({ route, navigation }) {
  const { setIsLoggedIn } = useLogin();
  const celebProfile = route?.params?.celebProfile || {
    name: 'Gina Wambui',
    bio: 'Award-winning entertainer passionate about bringing joy to fans through personalized shoutouts.',
    avatar: 'https://i.pravatar.cc/100?img=4',
    acceptedTypes: ['video', 'text'],
    deliveryTime: '2 days',
    price: 50.0,
    shoutoutsDone: 124,
    rating: 4.8,
    balance: 200.0,
  };

  const [recentShoutouts, setRecentShoutouts] = useState([
    { id: '1', recipient: 'James', message: 'Happy Birthday 🎉' },
    { id: '2', recipient: 'Nina', message: 'You got this 💪' },
    { id: '3', recipient: 'Max', message: 'Congratulations! 🏆' },
  ]);

  const feedback = [
    { stars: 5, count: 82 },
    { stars: 4, count: 30 },
    { stars: 3, count: 8 },
    { stars: 2, count: 3 },
    { stars: 1, count: 1 },
  ];

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <Text style={{ fontSize: 16, color: '#f6b100', marginTop: 2 }}>
        {'★'.repeat(fullStars)}
        {halfStar ? '½' : ''}
        {'☆'.repeat(emptyStars)}
      </Text>
    );
  };

  const renderShoutoutItem = ({ item, index }) => {
    const fadeAnim = new Animated.Value(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 150,
      useNativeDriver: true,
    }).start();

    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={styles.shoutoutCard}>
          <Text style={styles.shoutoutText}>To: {item.recipient}</Text>
          <Text style={styles.shoutoutMessage}>{item.message}</Text>
        </View>
      </Animated.View>
    );
  };

  const renderHiddenItem = (data) => (
    <TouchableOpacity
      style={styles.shoutoutDelete}
      onPress={() => {
        const updated = recentShoutouts.filter((s) => s.id !== data.item.id);
        setRecentShoutouts(updated);
      }}
    >
      <Icon name="trash" size={20} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={{ uri: celebProfile.avatar }} style={styles.avatar} />
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfile', { celebProfile })}
          style={styles.editIcon}
        >
          <Icon name="create-outline" size={20} color="#555" />
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{celebProfile.name}</Text>
      {renderStars(celebProfile.rating)}
      <Text style={styles.bio}>{celebProfile.bio}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Icon name="star" size={20} color="#f6b100" />
          <Text style={styles.statText}>{celebProfile.rating} Rating</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialIcon name="play-circle-filled" size={20} color="#00b894" />
          <Text style={styles.statText}>{celebProfile.shoutoutsDone} Shoutouts</Text>
        </View>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.label}>Available Balance</Text>
        <Text style={styles.value}>${celebProfile.balance.toFixed(2)}</Text>
      </View>
      <View style={styles.detailBox}>
        <Text style={styles.label}>Delivery Time</Text>
        <Text style={styles.value}>{celebProfile.deliveryTime}</Text>
      </View>
      <View style={styles.detailBox}>
        <Text style={styles.label}>Accepted Types</Text>
        <Text style={styles.value}>{celebProfile.acceptedTypes.join(', ')}</Text>
      </View>
      <View style={styles.detailBox}>
        <Text style={styles.label}>Price per Shoutout</Text>
        <Text style={styles.value}>${celebProfile.price.toFixed(2)}</Text>
      </View>

      {/* Recent Shoutouts */}
      <Text style={styles.sectionTitle}>Recent Shoutouts</Text>
      <SwipeListView
        horizontal
        data={recentShoutouts}
        keyExtractor={(item) => item.id}
        renderItem={renderShoutoutItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-60}
        disableRightSwipe
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      />

      {/* Feedback Summary */}
      <Text style={styles.sectionTitle}>Feedback Summary</Text>
      <View style={styles.feedbackContainer}>
        {feedback.map((item) => (
          <View key={item.stars} style={styles.feedbackRow}>
            <Text style={{ width: 32 }}>{item.stars}★</Text>
            <View style={styles.bar}>
              <View style={[styles.fillBar, { width: `${item.count}%` }]} />
            </View>
            <Text style={{ marginLeft: 6 }}>{item.count}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <TouchableOpacity
        style={[
          styles.withdrawButton,
          celebProfile.balance <= 0 && { backgroundColor: '#ccc' },
        ]}
        disabled={celebProfile.balance <= 0}
        onPress={() =>
          navigation.navigate('Withdraw', {
            balance: celebProfile.balance,
            celebProfile,
          })
        }
      >
        <Text style={styles.withdrawButtonText}>Withdraw Funds</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logOutButton}
        onPress={async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userInfo');
          setIsLoggedIn(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'UnifiedLogin' }],
          });
        }}
      >
        <Text style={styles.withdrawButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
  },
  container: {
    padding: 24,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#fff9f5',
  },
  header: {
    position: 'relative',
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: Colors.primary,
    marginBottom: 16,
  },
  editIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#eee',
    borderRadius: 20,
    padding: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primary,
  },
  bio: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  detailBox: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    alignSelf: 'flex-start',
    marginTop: 24,
    marginBottom: 8,
  },
  shoutoutCard: {
    backgroundColor: '#fff',
    padding: 14,
    marginRight: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    width: 160,
  },
  shoutoutText: {
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 4,
  },
  shoutoutMessage: {
    color: '#333',
    fontSize: 14,
  },
  shoutoutDelete: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    marginRight: 10,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  feedbackContainer: {
    width: '100%',
    marginTop: 10,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bar: {
    flex: 1,
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginHorizontal: 8,
  },
  fillBar: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  withdrawButton: {
    marginTop: 24,
    backgroundColor: '#e67e22',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    alignSelf: 'center',
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  logOutButton: {
    marginTop: 16,
    backgroundColor: '#c0392b',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    elevation: 3,
    alignSelf: 'center',
  },
});
