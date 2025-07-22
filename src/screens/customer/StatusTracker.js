import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Clipboard, Alert, Platform, Share, ToastAndroid
} from 'react-native';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

export default function StatusTracker({ route, navigation }) {
  const {
    celeb,
    message,
    messageType,
    recipient,
    deliveryTime,
    status,
    videoUrl, // 👈 expect this if completed
  } = route.params;

  const statusSteps = ['Pending', 'Accepted', 'Completed'];
  const currentStepIndex = statusSteps.indexOf(status);

  const handleViewShoutout = () => {
    if (videoUrl) Linking.openURL(videoUrl);
  };

  const handleCopyLink = () => {
    if (videoUrl) {
      Clipboard.setString(videoUrl);
      if (Platform.OS === 'android') {
        ToastAndroid.show('Link copied to clipboard!', ToastAndroid.SHORT);
      } else {
        Alert.alert('Link copied!', 'Shoutout link copied to clipboard.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>


        <Text style={styles.title}>Request Details</Text>
        <Text style={styles.summary}>Something here</Text>
        {/* Celeb Card */}
        <View style={styles.celebCard}>
          <Image source={{ uri: celeb.avatar }} style={styles.avatar} />
          <View style={styles.celebDetails}>
            <Text style={styles.celebName}>{celeb.celebName}</Text>
            <Text style={styles.deliveryText}>
              Avg Delivery: {celeb.deliveryTime || '24 hrs'}
            </Text>
          </View>
        </View>

        {/* Progress Steps */}
        <View style={styles.progressContainer}>
          {statusSteps.map((step, index) => (
            <View key={step} style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  index <= currentStepIndex && styles.stepActive,
                ]}
              />
              <Text
                style={[
                  styles.stepLabel,
                  index <= currentStepIndex && styles.stepLabelActive,
                ]}
              >
                {step}
              </Text>
              {index < statusSteps.length - 1 && (
                <View style={styles.stepLine} />
              )}
            </View>
          ))}
        </View>

        {/* Message Details */}
        <View style={styles.card}>
          <Text style={styles.label}>Message Type</Text>
          <Text style={styles.value}>{messageType.toUpperCase()}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Recipient</Text>
          <Text style={styles.value}>{recipient}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Message</Text>
          <Text style={styles.value}>{message}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Scheduled Delivery</Text>
          <Text style={styles.value}>
            {new Date(deliveryTime).toLocaleString()}
          </Text>
        </View>

        {/* Status Bubble */}
        <View style={styles.statusBubble(status)}>
          <Text style={styles.statusText}>{status.toUpperCase()}</Text>
        </View>

        {/* Info Text */}
        <Text style={styles.info}>
          {status === 'Pending' &&
            `Your request is being reviewed. Estimated delivery within ${celeb.deliveryTime || '24 hrs'}.`}
          {status === 'Accepted' &&
            'The celebrity has accepted! Sit tight for the shoutout.'}
          {status === 'Completed' &&
            '🎉 Your shoutout is ready! Click below to view it or share.'}
        </Text>

        {/* View Shoutout CTA */}
        {status === 'Completed' && videoUrl && (
          <>
            <TouchableOpacity
              style={styles.shoutoutButton}
              onPress={handleViewShoutout}
              activeOpacity={0.85}
            >
              <Icon name="play-circle-outline" size={22} color="#fff" />
              <Text style={styles.shoutoutText}>View Shoutout</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 12, alignItems: 'center' }}>
              <Text style={{ color: Colors.textDark, marginBottom: 8 }}>Share your shoutout</Text>
              <View style={{ flexDirection: 'row', gap: 20 }}>
                <TouchableOpacity onPress={handleCopyLink} style={styles.shareButton}>
                  <Icon name="copy-outline" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Share.share({
                      message: `Check out my shoutout! 🎉 ${videoUrl}`,
                    })
                  }
                  style={styles.shareButton}
                >
                  <Icon name="share-social-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
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
    backgroundColor: Colors.secondary,
    position: 'relative',
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  summary: {
    textAlign: 'center',
    color: Colors.textDark,
    marginBottom: 26,
    fontSize: 14,
  },
  content: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  celebCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ddd',
  },
  celebDetails: {
    marginLeft: 16,
  },
  celebName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  deliveryText: {
    fontSize: 13,
    color: Colors.textDark,
    marginTop: 4,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ccc',
    marginBottom: 4,
  },
  stepActive: {
    backgroundColor: Colors.primary,
  },
  stepLabel: {
    fontSize: 12,
    color: '#aaa',
  },
  stepLabelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  stepLine: {
    position: 'absolute',
    top: 7,
    left: '50%',
    width: '100%',
    height: 2,
    backgroundColor: '#ccc',
    zIndex: -1,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: Colors.textDark,
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    fontSize: 15,
    color: Colors.textDark,
  },
  statusBubble: (status) => ({
    backgroundColor:
      status === 'Pending'
        ? Colors.accentBlue
        : status === 'Accepted'
          ? '#ffc107'
          : status === 'Completed'
            ? Colors.accentGreen
            : '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 24,
    alignSelf: 'center',
  }),
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  info: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.textDark,
    paddingHorizontal: 10,
    lineHeight: 20,
  },
  shoutoutButton: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignSelf: 'center',
  },
  shoutoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  shareButton: {
    backgroundColor: Colors.accentBlue,
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
});
