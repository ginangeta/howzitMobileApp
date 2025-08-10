import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';

export default function CelebrityProfile({ route, navigation }) {
  const { celeb } = route.params;
  const [isFollowing, setIsFollowing] = useState(false);

  const reasons = [
    { emoji: '🎂', label: 'Say happy birthday' },
    { emoji: '💪', label: 'Send a pep talk' },
    { emoji: '🔥', label: 'Roast someone' },
    { emoji: '💜', label: 'Get advice' },
    { emoji: '🧠', label: 'Ask a question' },
  ];

  const previewVideos = celeb.previewVideos || [
    { label: 'Intro video', uri: celeb.avatar },
    { label: 'Birthday', uri: celeb.avatar },
    { label: 'PepTalk', uri: celeb.avatar },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
      >
        <Icon name="arrow-back" size={24} color={Colors.primary} />
      </TouchableOpacity>

      <View style={styles.centeredContent}>
        <View style={styles.centeredHeader}>
          <Image source={{ uri: celeb.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{celeb.name}</Text>
          <Text style={styles.specialization}>{celeb.specialization || 'Public Figure'}</Text>

          <TouchableOpacity
            style={[styles.followButton, isFollowing && styles.following]}
            onPress={() => setIsFollowing(!isFollowing)}
          >
            <Text style={styles.followText}>{isFollowing ? 'Following' : 'Follow'}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={previewVideos}
          horizontal
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
          style={styles.videoList}
          contentContainerStyle={{ paddingRight: 20 }}
          renderItem={({ item }) => (
            <View style={styles.videoCard}>
              <Image source={{ uri: item.uri }} style={styles.videoThumb} />
              <Text style={styles.videoLabel}>{item.label}</Text>
            </View>
          )}
        />

        <View style={styles.statsRow}>
          <Text style={styles.statItem}>💰 ${celeb.price || 600}+</Text>
          <Text style={styles.statItem}>⚡ {celeb.deliveryTime || '24hr'} delivery</Text>
          <Text style={styles.statItem}>
            ⭐ {celeb.rating?.toFixed(2) || '4.98'} ({celeb.reviewsCount || 745})
          </Text>
        </View>

        <Text style={styles.sectionTitle}>REASONS TO GET A VIDEO</Text>
        <View style={styles.reasonsContainer}>
          {reasons.map((r, index) => (
            <View key={index} style={styles.reasonPill}>
              <Text style={styles.reasonText}>
                {r.emoji} {r.label}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('ShoutoutRequest', { celeb })}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Book a personal video ${celeb.price || 600}+</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.learnMore}>Learn more</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: Colors.secondary,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center', // center vertically
    alignItems: 'center',     // center horizontally
    padding: 24,
    backgroundColor: Colors.secondary,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  centeredContent: {
    width: '100%',
    alignItems: 'center',
  },
  centeredHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  specialization: {
    fontSize: 14,
    color: Colors.accentBlue,
    marginTop: 4,
  },
  followButton: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: Colors.primary,
  },
  following: {
    backgroundColor: Colors.accentGreen,
  },
  followText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  videoList: {
    marginBottom: 20,
  },
  videoCard: {
    marginRight: 12,
    alignItems: 'center',
    width: 120,
  },
  videoThumb: {
    width: 120,
    height: 160,
    borderRadius: 16,
    backgroundColor: '#ddd',
  },
  videoLabel: {
    marginTop: 6,
    fontSize: 13,
    color: '#444',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    marginBottom: 24,
    elevation: 2,
  },
  statItem: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    marginBottom: 10,
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  reasonPill: {
    backgroundColor: '#fff',
    borderRadius: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  reasonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  learnMore: {
    fontSize: 14,
    color: Colors.accentBlue,
    textAlign: 'center',
    marginTop: 4,
    textDecorationLine: 'underline',
  },
});