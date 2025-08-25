// src/screens/customer/RequestList.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  SectionList,
  SafeAreaView,
} from "react-native";
import { useAppTheme } from "../../context/ThemeContext";
import * as Animatable from "react-native-animatable";
import { Swipeable } from "react-native-gesture-handler";

const initialRequests = [
  {
    id: "1",
    name: "Jane Smith",
    type: "Video",
    status: "Completed",
    date: "2025-06-01",
    image:
      "https://merry-strudel-581da2.netlify.app/assets/img/doctor-grid/winkygd.jpeg",
    deliveryEstimate: "2 days",
    message: "Happy Birthday!",
    messageType: "Birthday",
    recipient: "John",
    videoUrl: "https://yourshoutoutlink.com/shout123",
    deliveryTime: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Chris Brown",
    type: "Text",
    status: "Pending",
    date: "2025-06-03",
    image:
      "https://merry-strudel-581da2.netlify.app/assets/img/specialities/misred.jpg",
    deliveryEstimate: "1 day",
    message: "Congratulations!",
    messageType: "Congrats",
    recipient: "Jane",
    deliveryTime: new Date().toISOString(),
  },
];

export default function RequestList({ navigation }) {
  const { colors } = useAppTheme();
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState(initialRequests);

  const filtered = requests.filter((req) =>
    `${req.name} ${req.type}`.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = [
    { title: "Pending", data: filtered.filter((r) => r.status === "Pending") },
    {
      title: "Completed",
      data: filtered.filter((r) => r.status === "Completed"),
    },
  ];

  const handleDelete = (id) =>
    setRequests((prev) => prev.filter((r) => r.id !== id));

  const renderRightActions = (item) => (
    <TouchableOpacity
      style={[styles.deleteButton, { backgroundColor: colors.danger }]}
      onPress={() => handleDelete(item.id)}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item, index }) => {
    const isCompleted = item.status === "Completed";
    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <Animatable.View animation="fadeInUp" duration={400} delay={index * 100}>
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate("StatusTracker", { ...item, celeb: item })
            }
          >
            <View style={styles.row}>
              <Image source={{ uri: item.image }} style={styles.avatar} />
              <View style={styles.cardInfo}>
                <View style={styles.headerRow}>
                  <Text style={[styles.name, { color: colors.textPrimary }]}>
                    {item.name}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isCompleted
                          ? colors.success
                          : colors.info,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.statusText, { color: colors.textOnPrimary }]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={[styles.detail, { color: colors.textSecondary }]}>
                    Type:{" "}
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {item.type}
                    </Text>
                  </Text>
                  <Text style={[styles.detail, { color: colors.textSecondary }]}>
                    Date:{" "}
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {item.date}
                    </Text>
                  </Text>
                  <Text style={[styles.detail, { color: colors.textSecondary }]}>
                    Delivery:{" "}
                    <Text style={[styles.detailValue, { color: colors.textPrimary }]}>
                      {item.deliveryEstimate}
                    </Text>
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      </Swipeable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.primary }]}>
        Your Shoutout Requests
      </Text>

      <TextInput
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.card,
            color: colors.textPrimary,
            shadowColor: colors.textSecondary,
          },
        ]}
        placeholder="Search by celeb or type..."
        placeholderTextColor={colors.textSecondary + "99"}
        value={search}
        onChangeText={setSearch}
      />

      <SectionList
        sections={grouped}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={[styles.sectionHeader, { color: colors.primary }]}>
            {title}
          </Text>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
  },
  searchBar: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 20,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: "#ddd",
  },
  cardInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  detailsRow: {
    marginTop: 2,
  },
  detail: {
    fontSize: 13,
    marginTop: 2,
  },
  detailValue: {
    fontWeight: "600",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    marginVertical: 10,
    borderRadius: 12,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "700",
  },
});
