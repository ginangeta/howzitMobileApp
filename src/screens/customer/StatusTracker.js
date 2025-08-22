import React, { useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
  Share,
  ToastAndroid,
  Image,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';

import { useAppTheme } from '../../context/ThemeContext';

export default function StatusTracker({ route, navigation }) {
  const { colors } = useAppTheme();

  const { celeb, message, messageType, recipient, deliveryTime, status, videoUrl } = route.params;

  const statusSteps = useMemo(() => ['Pending', 'Accepted', 'Completed'], []);
  const currentStepIndex = statusSteps.indexOf(status);

  // Animated value for progress fill
  const fillAnim = useRef(new Animated.Value(0)).current;

  // Animated values for step circles
  const scaleAnims = useRef(statusSteps.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: (currentStepIndex + 1) / statusSteps.length,
      duration: 600,
      useNativeDriver: false,
    }).start();

    scaleAnims.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: index === currentStepIndex ? 1.4 : 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    });
  }, [currentStepIndex, fillAnim, statusSteps, scaleAnims]);

  const handleViewShoutout = () => videoUrl && Linking.openURL(videoUrl);

  const handleCopyLink = () => {
    if (videoUrl) {
      Clipboard.setString(videoUrl);
      Platform.OS === 'android'
        ? ToastAndroid.show('Link copied to clipboard!', ToastAndroid.SHORT)
        : Alert.alert('Link copied!', 'Shoutout link copied to clipboard.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.secondary }]}>
      <LinearGradient
        colors={[`${colors.primary}22`, `${colors.primary}00`]}
        style={styles.headerGradient}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.primary }]} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Title */}
        <Text style={[styles.title, { color: colors.textSecondary }]}>Request Details</Text>

        {/* Celebrity Card */}
        <View style={[styles.celebCard, { backgroundColor: colors.bubbleBg, shadowColor: colors.textSecondary }]}>
          <Image source={{ uri: celeb.image }} style={styles.celebImage} />
          <View style={styles.celebInfo}>
            <Text style={[styles.celebName, { color: colors.textSecondary }]}>{celeb.name}</Text>
            <Text style={[styles.celebRole, { color: colors.primary }]}>
              Avg Delivery: {celeb.deliveryTime || '24 hrs'}
            </Text>
            <View style={styles.celebTags}>
              {celeb.tags?.slice(0, 3).map(tag => (
                <View key={tag} style={[styles.tagBubble, { backgroundColor: `${colors.primary}22` }]}>
                  <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: fillAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
          {statusSteps.map((step, index) => {
            const isActive = index <= currentStepIndex;
            return (
              <View key={step} style={styles.stepWrapper}>
                <Animated.View
                  style={[
                    styles.stepCircle,
                    isActive && { backgroundColor: colors.primary, transform: [{ scale: scaleAnims[index] }] },
                  ]}
                />
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Message Details */}
        <View style={[styles.card, { backgroundColor: colors.bubbleBg }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Message Type</Text>
          <Text style={[styles.value, { color: colors.textSecondary }]}>{messageType.toUpperCase()}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.bubbleBg }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Recipient</Text>
          <Text style={[styles.value, { color: colors.textSecondary }]}>{recipient}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.bubbleBg }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Message</Text>
          <Text style={[styles.value, { color: colors.textSecondary }]}>{message}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.bubbleBg }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Scheduled Delivery</Text>
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {new Date(deliveryTime).toLocaleString()}
          </Text>
        </View>

        {/* Status Bubble */}
        <View style={[
          styles.statusBubble,
          {
            backgroundColor:
              status === 'Pending'
                ? colors.accentBlue
                : status === 'Accepted'
                ? '#ffc107'
                : status === 'Completed'
                ? colors.accentGreen
                : '#ccc',
          },
        ]}>
          <Text style={[styles.statusText, { color: colors.textPrimary }]}>{status.toUpperCase()}</Text>
        </View>

        {/* Info Text */}
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          {status === 'Pending' &&
            `Your request is being reviewed. Estimated delivery within ${celeb.deliveryTime || '24 hrs'}.`}
          {status === 'Accepted' &&
            'The celebrity has accepted! Sit tight for the shoutout.'}
          {status === 'Completed' &&
            '🎉 Your shoutout is ready! Click below to view it or share.'}
        </Text>

        {/* Shoutout Buttons */}
        {status === 'Completed' && videoUrl && (
          <>
            <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleViewShoutout}>
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>View Shoutout</Text>
            </TouchableOpacity>

            <View style={styles.shareButtonsContainer}>
              <TouchableOpacity onPress={handleCopyLink} style={[styles.button, styles.shareButton, { backgroundColor: colors.primary }]}>
                <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Copy Link</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => Share.share({ message: `Check out my shoutout! 🎉 ${videoUrl}` })}
                style={[styles.button, styles.shareButton, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Share</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: { position: 'absolute', top: 0, left: 0, right: 0, height: 160, opacity: 0.15 },
  contentContainer: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 40 },
  backButton: {
    position: 'absolute',
    top: 44,
    left: 18,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 18 },
  celebCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, padding: 14, borderRadius: 16, shadowOpacity: 0.06, shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 3 },
  celebImage: { width: 70, height: 70, borderRadius: 50, marginRight: 14, backgroundColor: '#ddd' },
  celebInfo: { flex: 1 },
  celebName: { fontSize: 16, fontWeight: '800' },
  celebRole: { fontSize: 13, marginTop: 4 },
  celebTags: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  tagBubble: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, marginRight: 6, marginBottom: 6 },
  tagText: { fontSize: 12, fontWeight: '600' },
  progressContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28, position: 'relative', height: 40 },
  progressFill: { position: 'absolute', top: 7, left: 0, height: 2, borderRadius: 1 },
  stepWrapper: { alignItems: 'center', flex: 1 },
  stepCircle: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#ccc', marginBottom: 6 },
  stepLabel: { fontSize: 12, color: '#aaa', textAlign: 'center' },
  card: { borderRadius: 14, padding: 14, marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  value: { fontSize: 15 },
  statusBubble: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30, marginTop: 24, alignSelf: 'center' },
  statusText: { fontWeight: 'bold', fontSize: 14, textAlign: 'center' },
  helperText: { textAlign: 'center', fontSize: 13, marginTop: 20, lineHeight: 20 },
  button: { paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginBottom: 16, shadowOpacity: 0.18, shadowOffset: { width: 0, height: 6 }, shadowRadius: 14, elevation: 6 },
  buttonText: { fontWeight: '800', fontSize: 16 },
  shareButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 20 },
  shareButton: { flex: 1 },
});
