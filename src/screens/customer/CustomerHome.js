import React, { useState, useMemo } from 'react';
import {
  Share,
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../../context/ThemeContext'; // hook for theme
import topCelebs from '../data/topCelebs';
import * as Animatable from 'react-native-animatable';

const categories = [
  { id: '1', name: 'Actor', icon: 'film-outline' },
  { id: '2', name: 'Musician', icon: 'musical-notes-outline' },
  { id: '3', name: 'Athlete', icon: 'football-outline' },
  { id: '4', name: 'Comedian', icon: 'happy-outline' },
  { id: '5', name: 'Influencer', icon: 'people-outline' },
  { id: '6', name: 'Creator', icon: 'camera-outline' },
];

// dynamic popular category banners (now include icon background colors)
const popularCategories = [
  { id: 'p1', title: 'Birthday', subtitle: 'Personalized videos', bg: '#6fc4ff', icon: 'gift', iconBg: '#ff7ab6' },
  { id: 'p2', title: 'Weddings', subtitle: 'The perfect gift', bg: '#ffb3c0', icon: 'heart', iconBg: '#ff6f61' },
  { id: 'p3', title: 'Corporate', subtitle: 'Team messages', bg: '#ffd36f', icon: 'briefcase', iconBg: '#ff9f43' },
  { id: 'p4', title: 'Anniversary', subtitle: 'Make it special', bg: '#9b7cff', icon: 'calendar', iconBg: '#6f74ff' },
  { id: 'p5', title: 'Graduation', subtitle: 'Celebrate wins', bg: '#7be39a', icon: 'school', iconBg: '#2dd4bf' },
];

// Helper to extract numeric price where possible (best-effort)
const parsePriceNumber = (priceStr = '') => {
  try {
    const match = priceStr.replace(/,/g, '').match(/\d+/);
    return match ? Number(match[0]) : null;
  } catch (e) {
    return null;
  }
};

const PriceWithBadge = ({ price, colors }) => (
  <View style={styles.priceRow}>
    <Text style={[styles.celebrityPrice, { color: colors.primary }]}>{price}</Text>
    <View style={[styles.rateBadge, { backgroundColor: colors.card }]}> 
      <Ionicons name="flash-outline" size={14} color={colors.primary} />
      <Text style={[styles.rateText, { color: colors.textSecondary }]}> 24hr</Text>
    </View>
  </View>
);

const CelebrityCardLarge = ({ item, onPress, colors }) => (
  <Animatable.View animation="fadeInUp" duration={400}>
    <TouchableOpacity style={[styles.celebrityCardLarge, { backgroundColor: colors.card }]} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.celebrityImageLarge} />
      <View style={styles.celebrityInfoLarge}>
        <Text style={[styles.celebrityName, { color: colors.textSecondary }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.celebrityRole, { color: colors.textMuted }]} numberOfLines={1}>{item.role}</Text>
        <PriceWithBadge price={item.price} colors={colors} />
      </View>
    </TouchableOpacity>
  </Animatable.View>
);

const CelebrityCard = ({ item, onPress, colors }) => (
  <Animatable.View animation="fadeInUp" duration={350}>
    <TouchableOpacity style={[styles.celebrityCard, { backgroundColor: colors.card }]} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.celebrityImage} />
      <View style={styles.celebrityInfo}>
        <Text style={[styles.celebrityName, { color: colors.textSecondary }]} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.celebrityRole, { color: colors.textMuted }]} numberOfLines={1}>{item.role}</Text>
        <PriceWithBadge price={item.price} colors={colors} />
      </View>
    </TouchableOpacity>
  </Animatable.View>
);

const CircularStar = ({ item, label, onPress, colors }) => (
  <TouchableOpacity style={styles.starItem} onPress={onPress}>
    <View style={[styles.starAvatarWrap, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.starAvatar} />
    </View>
    <Text style={[styles.starLabel, { color: colors.textSecondary }]} numberOfLines={1}>{label}</Text>
  </TouchableOpacity>
);

export default function CustomerHome({ navigation }) {
  const { colors } = useAppTheme();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const q = (searchQuery || '').trim().toLowerCase();

  // Memoize filtered list for performance
  const filteredCelebs = useMemo(() => {
    return topCelebs.filter((celeb) => {
      const matchesCategory = selectedCategory
        ? celeb.role.toLowerCase() === selectedCategory.toLowerCase()
        : true;
      const matchesSearch = q
        ? celeb.name.toLowerCase().includes(q) || celeb.role.toLowerCase().includes(q)
        : true;
      return matchesCategory && matchesSearch;
    });
  }, [q, selectedCategory]);

  const searchActive = q.length > 0;

  // group filtered results by role when searching
  const resultsByRole = useMemo(() => {
    if (!searchActive) return {};
    const groups = {};
    filteredCelebs.forEach((c) => {
      const role = c.role || 'Other';
      if (!groups[role]) groups[role] = [];
      groups[role].push(c);
    });
    return groups;
  }, [filteredCelebs, searchActive]);

  const onShare = async () => {
    try {
      await Share.share({
        message: 'Check out Howzit! Book your favorite celeb for a shoutout 🚀',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() =>
        setSelectedCategory(
          selectedCategory?.toLowerCase() === item.name.toLowerCase()
            ? null
            : item.name
        )
      }
    >
      <View
        style={[
          styles.categoryIcon,
          {
            backgroundColor:
              selectedCategory === item.name ? colors.primary : colors.card,
            borderColor: colors.primary,
          },
        ]}
      >
        <Ionicons
          name={item.icon}
          size={20}
          color={selectedCategory === item.name ? colors.textPrimary : colors.primary}
        />
      </View>
      <Text style={[styles.categoryText, { color: colors.textSecondary }]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const celebPress = (item) => navigation.navigate('CelebrityProfile', { celeb: item });

  const renderBanner = ({ item }) => (
    <TouchableOpacity style={[styles.bannerCard, { backgroundColor: item.bg }]} onPress={() => setSelectedCategory(null)}>
      <View style={styles.bannerInnerRowAlt}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
        </View>

        {/* Right aligned colorful icon (matches figma) */}
        <View style={[styles.bannerIconWrapRight, { backgroundColor: item.bg }]}> 
          <Ionicons name={item.icon} size={22} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.secondary }]}> 
      <ScrollView style={[styles.container, { backgroundColor: colors.secondary }]} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.heroTitle, { color: colors.primary }]}>Browse</Text>
            <Text style={[styles.subHeader, { color: colors.textMuted }]}>Find your favorite celeb and book a shoutout!</Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => console.log('notifications')} style={[styles.iconBtn, { backgroundColor: colors.card }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare} style={[styles.iconBtn, { backgroundColor: colors.card, marginLeft: 8 }]}>
              <Ionicons name="share-social-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.bubbleBg }]}> 
          <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Try 'Tiwa Savage'"
            placeholderTextColor={colors.textMuted}
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 6 }}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* When searching: show only category-like sections with matching results (grouped by role). Hide other hero sections. */}
        {searchActive ? (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Results</Text>
              <Text style={[styles.seeAll, { color: colors.primary }]}>{filteredCelebs.length} found</Text>
            </View>

            {Object.keys(resultsByRole).length === 0 ? (
              <Text style={{ color: colors.textMuted, paddingHorizontal: 16, marginTop: 8 }}>No results found.</Text>
            ) : (
              Object.entries(resultsByRole).map(([role, list]) => (
                <View key={role}>
                  <Text style={[styles.sectionTitle, { color: colors.textSecondary, fontSize: 16, marginLeft: 0 }]}>{role}</Text>
                  <FlatList
                    data={list}
                    renderItem={({ item }) => (
                      <CelebrityCard item={item} onPress={() => celebPress(item)} colors={colors} />
                    )}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.celebsList}
                  />
                </View>
              ))
            )}

          </View>
        ) : (
          // full layout when search is empty
          <>
            {/* Popular picks */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Popular pick's</Text>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </View>
            <FlatList
              data={topCelebs.slice(0, 8)}
              renderItem={({ item }) => (
                <CelebrityCardLarge item={item} onPress={() => celebPress(item)} colors={colors} />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.topCelebsList}
            />

            {/* Today's top 5 */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Today's top 5</Text>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </View>
            <FlatList
              data={filteredCelebs.slice(0, 5)}
              renderItem={({ item }) => (
                <CelebrityCard item={item} onPress={() => celebPress(item)} colors={colors} />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.celebsList}
            />

            {/* Popular categories (banners) - dynamic horizontally scrollable with right icons */}
            <View style={[styles.sectionHeaderRow, { marginTop: 6 }]}> 
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Popular categories</Text>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </View>
            <FlatList
              data={popularCategories}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 12 }}
              renderItem={renderBanner}
            />

            {/* New and Trending */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>New and Trending</Text>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </View>
            <FlatList
              data={filteredCelebs.slice(2, 8)}
              renderItem={({ item }) => (
                <CelebrityCard item={item} onPress={() => celebPress(item)} colors={colors} />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.celebsList}
            />

            {/* Popular stars - circular */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Popular stars</Text>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </View>
            <FlatList
              data={topCelebs.slice(0, 8)}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularStarsList}
              renderItem={({ item, index }) => {
                // simple price tag heuristic
                const num = parsePriceNumber(item.price);
                const label = num ? (num < 100 ? `Under ZWG ${Math.ceil(num / 10) * 10}` : `ZWG ${num}+`) : 'Under ZWG100';
                return <CircularStar item={item} label={label} onPress={() => celebPress(item)} colors={colors} />;
              }}
            />

            {/* Other categories (actors, musicians...) - keep as original but show 24hr) */}
            {!selectedCategory && (
              <>
                {topCelebs.filter((c) => c.role === 'Actor').length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Actors</Text>
                    <FlatList
                      data={topCelebs.filter((c) => c.role === 'Actor')}
                      renderItem={({ item }) => (
                        <CelebrityCard item={item} onPress={() => celebPress(item)} colors={colors} />
                      )}
                      keyExtractor={(item) => item.id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.celebsList}
                    />
                  </>
                )}

                {topCelebs.filter((c) => c.role === 'Musician').length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Musicians</Text>
                    <FlatList
                      data={topCelebs.filter((c) => c.role === 'Musician')}
                      renderItem={({ item }) => (
                        <CelebrityCard item={item} onPress={() => celebPress(item)} colors={colors} />
                      )}
                      keyExtractor={(item) => item.id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.celebsList}
                    />
                  </>
                )}

                {topCelebs.filter((c) => c.role === 'Athlete').length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Athletes</Text>
                    <FlatList
                      data={topCelebs.filter((c) => c.role === 'Athlete')}
                      renderItem={({ item }) => (
                        <CelebrityCard item={item} onPress={() => celebPress(item)} colors={colors} />
                      )}
                      keyExtractor={(item) => item.id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.celebsList}
                    />
                  </>
                )}

                {topCelebs.filter((c) => c.role === 'Creator').length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Creators</Text>
                    <FlatList
                      data={topCelebs.filter((c) => c.role === 'Creator')}
                      renderItem={({ item }) => (
                        <CelebrityCard item={item} onPress={() => celebPress(item)} colors={colors} />
                      )}
                      keyExtractor={(item) => item.id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.celebsList}
                    />
                  </>
                )}

                {topCelebs.filter((c) => c.role === 'Religious Leader').length > 0 && (
                  <>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Religious Leaders</Text>
                    <FlatList
                      data={topCelebs.filter((c) => c.role === 'Religious Leader')}
                      renderItem={({ item }) => (
                        <CelebrityCard item={item} onPress={() => celebPress(item)} colors={colors} />
                      )}
                      keyExtractor={(item) => item.id}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.celebsList}
                    />
                  </>
                )}
              </>
            )}

          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'left',
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    borderRadius: 12,
    padding: 8,
    shadowOpacity: 0.03,
    elevation: 1,
  },
  subHeader: {
    fontSize: 13,
    marginBottom: 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 18,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingBottom: 12,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoriesList: {
    paddingBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 18,
  },
  categoryIcon: {
    padding: 10,
    borderRadius: 40,
    marginBottom: 6,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 13,
  },
  topCelebsList: {
    paddingBottom: 18,
  },
  celebsList: {
    paddingBottom: 18,
  },
  celebrityCardLarge: {
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    width: 170,
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  celebrityImageLarge: {
    width: '100%',
    height: 150,
  },
  celebrityInfoLarge: {
    padding: 10,
  },
  celebrityCard: {
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    width: 150,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  celebrityImage: {
    width: '100%',
    height: 120,
  },
  celebrityInfo: {
    padding: 10,
  },
  celebrityName: {
    fontSize: 16,
    fontWeight: '700',
  },
  celebrityRole: {
    fontSize: 13,
    marginVertical: 4,
  },
  celebrityPrice: {
    fontSize: 14,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  rateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  rateText: {
    fontSize: 12,
    fontWeight: '600',
  },
  popularCategoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  bannerCard: {
    width: 220,
    marginRight: 12,
    borderRadius: 12,
    padding: 14,
    height: 100,
    justifyContent: 'center',
  },
  bannerInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerInnerRowAlt: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)'
  },
  bannerIconWrapRight: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#fff',
  },
  popularStarsList: {
    paddingVertical: 10,
    paddingBottom: 18,
  },
  starItem: {
    alignItems: 'center',
    marginRight: 14,
    width: 72,
  },
  starAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 36,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starAvatar: {
    width: 64,
    height: 64,
  },
  starLabel: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
  },
});
