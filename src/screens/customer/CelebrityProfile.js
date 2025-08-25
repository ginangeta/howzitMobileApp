// src/screens/customer/CelebrityProfile.js
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Platform,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../../context/ThemeContext';

export default function CelebrityProfile({ route, navigation }) {
  const { colors } = useAppTheme();
  const { celeb } = route.params;
  const [activeTab, setActiveTab] = useState('video');

  const previewVideos = useMemo(
    () => [
      {
        label: 'Intro',
        uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      },
      {
        label: 'Birthday',
        uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
      },
      {
        label: 'Pep Talk',
        uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
      },
    ],
    []
  );

  const tabs = [
    { key: 'video', label: 'Personalized Video' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'message', label: 'Message' },
    { key: 'merch', label: 'Merch' },
    { key: 'events', label: 'Events' },
  ];

  const stats = [
    { id: 'price', title: 'Price', subtitle: `${celeb.price || 'ZWG 600'}+` },
    { id: 'delivery', title: 'Delivery', subtitle: `${celeb.deliveryTime || '24hr'} delivery` },
    {
      id: 'rating',
      title: 'Rating',
      subtitle: `${typeof celeb.rating === 'number' ? celeb.rating.toFixed(2) : '4.98'} (${celeb.reviewsCount || 745})`,
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.secondary }]}> 
      {/* Back button (keeps original navigation style) */}
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.goBack()}
        style={[styles.backButton, { backgroundColor: colors.background }]}
      >
        <Ionicons name="arrow-back" size={20} color={colors.primary} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={{ paddingTop: 16 }}>
          {/* Top Full-Width Image */}
          <Image source={{ uri: celeb.image }} style={styles.heroImage} resizeMode="cover" />

          {/* Title + Follow */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
                {celeb.name}
              </Text>
              <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={1}>
                {celeb.role || 'Public Figure'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.followBtn, { backgroundColor: colors.primary }]}
              activeOpacity={0.9}
            >
              <Text style={{ color: colors.buttonText, fontWeight: '600' }}>Follow</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs (horizontal scroll, pill style but less rounded) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContainer}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: activeTab === tab.key ? colors.primary : colors.card,
                    borderColor: activeTab === tab.key ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: activeTab === tab.key ? colors.buttonText : colors.textSecondary },
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Content */}
          <View style={styles.content}>
            {activeTab === 'video' && (
              <>
                <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
                  {/* Section Title + Subtitle */}
                  <View style={{ marginBottom: 12 }}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                      Personalized Videos
                    </Text>
                    <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                      Watch some of my past shoutouts and see what to expect
                    </Text>
                  </View>

                  {/* FlatList */}
                  <FlatList
                    data={previewVideos}
                    horizontal
                    keyExtractor={(item, index) => String(index)}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingRight: 16 }}
                    renderItem={({ item }) => (
                      <View
                        style={[
                          styles.videoCard,
                          {
                            shadowColor: colors.textSecondary,
                            backgroundColor: colors.card,
                          },
                        ]}
                      >
                        <Image
                          source={{ uri: item.uri }}
                          style={[styles.videoThumb, { backgroundColor: colors.bubbleBg }]}
                        />
                        <TouchableOpacity style={styles.playIcon} activeOpacity={0.85}>
                          <Ionicons name="play-circle" size={44} color={colors.primary} />
                        </TouchableOpacity>
                        <Text style={[styles.videoLabel, { color: colors.text }]}>
                          {item.label}
                        </Text>
                      </View>
                    )}
                  />

                  {/* Stats (vertical list - title then subtitle, no emojis) */}
                  <View style={styles.statsColumn}>
                    {stats.map((s) => (
                      <View key={s.id} style={styles.statRow}>
                        <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{s.title}</Text>
                        <Text style={[styles.statSubtitle, { color: colors.textPrimary }]}>{s.subtitle}</Text>
                      </View>
                    ))}
                  </View>
                </View>

              </>
            )}

            {activeTab === 'reviews' && <Text style={{ color: colors.text }}>⭐ User reviews will go here</Text>}
            {activeTab === 'message' && <Text style={{ color: colors.text }}>💬 Message feature coming soon</Text>}
            {activeTab === 'merch' && <Text style={{ color: colors.text }}>🛍 Merch store coming soon</Text>}
            {activeTab === 'events' && <Text style={{ color: colors.text }}>📅 Events list coming soon</Text>}
          </View>
        </View>
      </ScrollView>

      {/* CTA (less rounded) */}
      <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: colors.primary }]} activeOpacity={0.9}
        onPress={() => navigation.navigate('ShoutoutRequest', { celeb })}>
        <Text style={styles.ctaText}>Book Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 12,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 8, // less rounded = more boxy
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: { shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 4 },
    }),
  },
  heroImage: { width: '100%', height: 280 },
  scroll: { paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
    paddingHorizontal: 16,
  },
  name: { fontSize: 24, fontWeight: '800' },
  description: { marginTop: 4, fontSize: 15, fontWeight: '500' },
  followBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8, // less rounded
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8, // less rounded
    borderWidth: 1,
    marginRight: 10,
    minWidth: 110,
    alignItems: 'center',
  },
  tabText: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
  content: { marginTop: 12 },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 12,
  },
  videoCard: {
    width: 200,
    height: 140,
    marginRight: 16,
    borderRadius: 12, // more boxy than 20+
    overflow: 'hidden',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  videoThumb: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  playOverlay: {
    position: 'absolute',
    top: '40%',
    left: '40%',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  videoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  videoMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  statRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#00000006',
  },
  statTitle: { fontSize: 13, fontWeight: '700', opacity: 0.85 },
  statSubtitle: { fontSize: 15, fontWeight: '800', marginTop: 4 },
  ctaBtn: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    paddingVertical: 14,
    borderRadius: 8, // less rounded CTA
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
