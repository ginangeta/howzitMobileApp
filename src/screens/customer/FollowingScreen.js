// src/screens/customer/FollowingScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useAppTheme } from "../../context/ThemeContext";

const followedCelebs = [
  {
    id: "1",
    name: "DJ Zinhle",
    role: "Musician",
    price: 25,
    deliveryTime: "2 days",
    rating: 4.8,
    shoutoutsCount: 142,
    image:
      "https://merry-strudel-581da2.netlify.app/assets/img/specialities/misred.jpg",
    bio: "Top DJ and businesswoman ready to hype you up!",
  },
  {
    id: "2",
    name: "Cassper Nyovest",
    role: "Musician",
    price: 40,
    deliveryTime: "1 day",
    rating: 4.6,
    shoutoutsCount: 220,
    image:
      "https://merry-strudel-581da2.netlify.app/assets/img/doctor-grid/madamboss.jpg",
    bio: "South African rap legend. Bringing the hype to your screen!",
  },
];

export default function FollowingScreen({ navigation }) {
  const { colors } = useAppTheme();

  const renderCelebCard = ({ item }) => (
    <View style={[styles.celebCard, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={styles.headerRow}
        onPress={() =>
          navigation.navigate("CelebrityProfile", { celeb: item })
        }
      >
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {item.name}
          </Text>
          <Text
            style={[styles.specialization, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {item.bio}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.bookButton, { backgroundColor: colors.primary }]}
        onPress={() =>
          navigation.navigate("CelebrityProfile", { celeb: item })
        }
      >
        <Text style={[styles.bookButtonText, { color: colors.textOnPrimary }]}>
          Book Shoutout
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.pageTitle, { color: colors.primary }]}>
        Following
      </Text>

      {followedCelebs.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            You’re not following anyone yet.
          </Text>
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
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
  },
  celebCard: {
    flexDirection: "column",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  specialization: {
    fontSize: 13,
    marginTop: 2,
  },
  bookButton: {
    marginTop: 6,
    paddingVertical: 10,
    borderRadius: 16,
    alignItems: "center",
  },
  bookButtonText: {
    fontWeight: "700",
    fontSize: 14,
  },
  emptyState: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
  },
});
