// src/screens/celebrity/CelebrityDashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  RefreshControl,
  Platform,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAppTheme } from '../../context/ThemeContext';

export default function CelebrityDashboard({ navigation, route }) {
  const { themeName, colors } = useAppTheme();

  const celebProfile = route?.params?.celebProfile || {
    name: 'Creator',
    avatar: 'https://i.pravatar.cc/100?img=4',
  };

  const initialRequests = useMemo(
    () => [
      {
        id: '1',
        customerName: 'Gina',
        messageType: 'video',
        deliveryTime: '2025-08-20T10:00:00',
        status: 'Pending',
        message: 'Happy birthday shoutout!',
        recipient: 'James',
      },
      {
        id: '2',
        customerName: 'Alex',
        messageType: 'audio',
        deliveryTime: '2025-08-19T15:00:00',
        status: 'Accepted',
        message: 'Encouragement message',
        recipient: 'Nina',
      },
    ],
    []
  );

  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [now, setNow] = useState(Date.now()); // live countdown tick

  // live countdown update (every 60s)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const emojiMap = {
    video: '🎥',
    audio: '🎙️',
    text: '💬',
  };

  // Theming helpers
  const bgOverlayOpacity = themeName === 'dark' ? 0.08 : 0.03;
  const surface = colors.background || '#fff';
  const textPrimary = colors.textSecondary || '#222';
  const textEmphasis = colors.primary || '#FF7A00';
  const borderMuted = colors.border || '#E2E2E2';
  const success = colors.accentGreen || '#28A745';
  const warning = colors.accentOrange || '#FFB700';
  const danger = colors.accentRed || '#FF4D4F';
  const bubble = colors.bubbleBg || (themeName === 'dark' ? '#121212' : '#fff');
  const cardShadow = themeName === 'dark' ? 0.04 : 0.06;

  // Derived / filtered data
  const groupedRequests = ['Pending', 'Accepted'].flatMap((status) => {
    const group = requests
      .filter((r) => r.status === status)
      .filter((r) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          r.customerName.toLowerCase().includes(q) ||
          r.recipient.toLowerCase().includes(q)
        );
      });
    return group.length ? [{ header: status }, ...group] : [];
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRequests([...initialRequests]); // refresh from source
      setRefreshing(false);
    }, 900);
  };

  const handleDelete = (id) => {
    setRequests((prev) => prev.filter((item) => item.id !== id));
  };

  const total = requests.length;
  const pending = requests.filter((r) => r.status === 'Pending').length;
  const accepted = requests.filter((r) => r.status === 'Accepted').length;

  const styles = getStyles({
    colors,
    themeName,
    surface,
    textPrimary,
    textEmphasis,
    borderMuted,
    success,
    warning,
    danger,
    bubble,
    bgOverlayOpacity,
    cardShadow,
  });

  const renderItem = (data) => {
    if (data.item.header) {
      return <Text style={[styles.groupHeader, { color: textEmphasis }]}>{data.item.header}</Text>;
    }

    const item = data.item;
    const deliveryDate = new Date(item.deliveryTime);
    const timeLeft = Math.max(deliveryDate.getTime() - now, 0);

    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <View style={[styles.card, { backgroundColor: bubble }]}>
        <View style={styles.cardHeader}>
          <Ionicons name="person-circle-outline" size={36} color={textEmphasis} />
          <View style={{ marginLeft: 12 }}>
            <Text style={[styles.name, { color: textEmphasis }]}>{item.customerName}</Text>
            <Text style={[styles.info, { color: textPrimary + 'CC' }]}>To: {item.recipient}</Text>
          </View>
          <View style={[styles.typeBadge, { backgroundColor: (colors.primary || '#FF7A00') + '22' }]}>
            <Text style={[styles.typeText, { color: textEmphasis }]}>{emojiMap[item.messageType]}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View>
            <Text style={[styles.info, { color: textPrimary + 'CC' }]}>
              Delivery Date:{' '}
              {deliveryDate.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
            <Text style={[styles.info, { color: textPrimary + 'CC' }]}>
              Delivery: ({daysLeft}d {hoursLeft}h {minutesLeft}m left)
            </Text>
          </View>

          <View
            style={[
              styles.statusBubble,
              {
                backgroundColor:
                  item.status === 'Pending' ? warning : item.status === 'Accepted' ? success : success,
              },
            ]}
          >
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: textEmphasis }]}
          onPress={() =>
            navigation.navigate('RequestDetails', {
              request: item,
              celebProfile,
              updateStatus: (id, newStatus) => {
                setRequests((prev) =>
                  prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
                );
              },
            })
          }
          activeOpacity={0.88}
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHiddenItem = (data) => {
    if (data.item.header) return null;
    return (
      <TouchableOpacity
        style={[styles.hiddenButton, { backgroundColor: danger }]}
        onPress={() => handleDelete(data.item.id)}
        activeOpacity={0.9}
      >
        <Ionicons name="trash" size={20} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 12, marginTop: 2 }}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background || '#F7F7F7' }]}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={[styles.backgroundImage, { opacity: bgOverlayOpacity }]}
        resizeMode="cover"
      />

      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'}
      />

      <Text style={[styles.header, { color: textEmphasis }]}>Hey, {celebProfile.name}</Text>
      <Text style={[styles.subHeader, { color: textPrimary + 'CC' }]}>
        Ready to make someone smile today?
      </Text>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: surface }]}>
          <Text style={[styles.summaryTitle, { color: textPrimary + '99' }]}>Total</Text>
          <Text style={[styles.summaryCount, { color: textEmphasis }]}>{total}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: surface }]}>
          <Text style={[styles.summaryTitle, { color: textPrimary + '99' }]}>Pending</Text>
          <Text style={[styles.summaryCount, { color: warning }]}>{pending}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: surface }]}>
          <Text style={[styles.summaryTitle, { color: textPrimary + '99' }]}>Accepted</Text>
          <Text style={[styles.summaryCount, { color: success }]}>{accepted}</Text>
        </View>
      </View>

      <TextInput
        placeholder="Search requests..."
        style={[
          styles.searchInput,
          {
            backgroundColor: surface,
            borderColor: borderMuted,
            color: textPrimary,
          },
        ]}
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={textPrimary + '66'}
      />

      {groupedRequests.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 15, color: textPrimary + 'AA' }}>No requests found 😕</Text>
        </View>
      ) : (
        <SwipeListView
          data={groupedRequests}
          keyExtractor={(item, index) => item.id || `header-${index}`}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-80}
          disableRightSwipe
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={textEmphasis}
              colors={[textEmphasis]}
            />
          }
        />
      )}
    </View>
  );
}

/** Build styles with theme variables */
function getStyles({
  C,
  themeName,
  surface,
  textPrimary,
  textEmphasis,
  borderMuted,
  success,
  warning,
  danger,
  bubble,
  bgOverlayOpacity,
  cardShadow,
}) {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? 56 : 60,
      paddingHorizontal: 20,
    },
    backgroundImage: {
      ...StyleSheet.absoluteFillObject,
    },
    header: {
      fontSize: 26,
      fontWeight: '800',
      marginBottom: 4,
      textAlign: 'center',
      letterSpacing: 0.3,
    },
    subHeader: {
      fontSize: 14,
      marginBottom: 18,
      textAlign: 'center',
    },

    summaryContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    summaryCard: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 18,
      marginHorizontal: 5,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: cardShadow,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 4,
    },
    summaryTitle: {
      fontSize: 11,
      marginBottom: 4,
      textTransform: 'uppercase',
      fontWeight: '700',
      letterSpacing: 0.6,
    },
    summaryCount: {
      fontSize: 20,
      fontWeight: '800',
    },

    searchInput: {
      borderRadius: 30,
      paddingHorizontal: 16,
      paddingVertical: 11,
      fontSize: 14,
      borderWidth: 1,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOpacity: 0.03,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 6,
      elevation: 2,
    },

    groupHeader: {
      fontSize: 15,
      fontWeight: '800',
      marginVertical: 10,
      marginLeft: 4,
      letterSpacing: 0.3,
    },

    card: {
      borderRadius: 18,
      padding: 16,
      marginBottom: 14,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 10,
      elevation: 3,
    },

    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    name: {
      fontWeight: '800',
      fontSize: 16,
    },
    info: {
      fontSize: 13,
      marginTop: 2,
    },

    detailRow: {
      marginTop: 6,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },

    typeBadge: {
      marginLeft: 'auto',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
    },
    typeText: {
      fontSize: 16,
      fontWeight: '700',
    },

    statusBubble: {
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 30,
    },
    statusText: {
      color: '#fff',
      fontWeight: '800',
      fontSize: 11,
      letterSpacing: 0.5,
    },

    button: {
      marginTop: 12,
      paddingVertical: 13,
      borderRadius: 24,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: '800',
      fontSize: 14,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },

    hiddenButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: 75,
      height: '80%',
      borderRadius: 18,
      alignSelf: 'center',
    },
  });
}
