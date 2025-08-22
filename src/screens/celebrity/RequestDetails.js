import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ToastAndroid,
  Platform,
  FlatList,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import * as Progress from 'react-native-progress';
import Colors from '../../constants/Colors';

export default function RequestDetails({ navigation }) {
  const [accepted, setAccepted] = useState(false);
  const [media, setMedia] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [countdown, setCountdown] = useState('');

  const request = {
    id: 'REQ-1293',
    celeb: 'DJ Breezy',
    user: 'Alex T.',
    message: 'Happy Birthday Alex! 🎉🎂',
    dateRequested: '2025-08-06T12:00:00',
    deadline: '2025-08-10T12:00:00',
    type: 'Video',
    status: 'Pending',
    length: '30 seconds',
    userNote: 'Please say it with excitement and mention his name clearly.',
  };

  const recentShoutouts = [
    { id: '1', type: 'video', name: 'Nina', message: 'Happy Birthday Nina! 🎉', thumbnail: require('../../../assets/images/sample_video_thumb.png') },
    { id: '2', type: 'audio', name: 'James', message: 'Encouragement message', thumbnail: require('../../../assets/images/sample_audio_thumb.png') },
    { id: '3', type: 'video', name: 'Emma', message: 'Congrats Emma!', thumbnail: require('../../../assets/images/sample_video_thumb.png') },
  ];

  useEffect(() => {
    const deadline = new Date(request.deadline);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = deadline - now;
      if (diff <= 0) {
        setCountdown('Expired');
        clearInterval(interval);
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [request.deadline]);

  const pickMedia = () => {
    launchImageLibrary(
      { mediaType: 'video', quality: 1 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Media selection failed');
        } else {
          const video = response.assets[0];
          const sizeMB = video.fileSize / (1024 * 1024);
          if (sizeMB > 50) {
            Alert.alert('File Too Large', 'Video must be under 50MB.');
            return;
          }
          setMedia(video);
        }
      }
    );
  };

  const simulateUpload = () => {
    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      setUploadProgress(progress);
      if (progress >= 1) {
        clearInterval(interval);
        setUploading(false);
        setSubmitted(true);
        if (Platform.OS === 'android') {
          ToastAndroid.show('✅ Shoutout submitted successfully!', ToastAndroid.LONG);
        } else {
          Alert.alert('✅ Shoutout submitted successfully!');
        }
      }
    }, 300);
  };

  const handleSubmit = () => {
    if (!media) {
      Alert.alert('No Media Selected', 'Please upload a video before submitting.');
      return;
    }
    simulateUpload();
  };

  const DetailRow = ({ label, value }) => (
    <View style={styles.detailRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  const renderStatus = () => {
    if (submitted) return '✅ Completed';
    if (accepted) return '🟡 Accepted';
    return '🕐 Pending';
  };

  const renderShoutoutItem = ({ item }) => (
    <View style={styles.shoutoutCard}>
      <Image source={item.thumbnail} style={styles.shoutoutThumb} />
      <Text style={styles.shoutoutName}>{item.name}</Text>
      <Text style={styles.shoutoutMsg} numberOfLines={2}>{item.message}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-outline" size={24} color={Colors.secondary} />
      </TouchableOpacity>

      <Text style={styles.heading}>Shoutout Request</Text>
      <Text style={styles.subHeading}>
        Personalize your video for <Text style={{ fontWeight: '700' }}>{request.user}</Text>
      </Text>

      {/* Modern Details Section */}
      <View style={styles.detailsCard}>
        <View style={styles.detailsHeader}>
          <Icon name="information-circle-outline" size={22} color={Colors.primary} />
          <Text style={styles.detailsTitle}>Request Details</Text>
        </View>
        <DetailRow label="Request ID" value={request.id} />
        <DetailRow label="From" value={request.celeb} />
        <DetailRow label="To" value={request.user} />
        <DetailRow label="Message" value={`"${request.message}"`} />
        <DetailRow label="Requested On" value={new Date(request.dateRequested).toLocaleString()} />
        <DetailRow label="Deadline" value={new Date(request.deadline).toLocaleString()} />
        <DetailRow label="Countdown" value={countdown} />
        <DetailRow label="Type" value={request.type} />
        <DetailRow label="Length" value={request.length} />
        <DetailRow label="Status" value={renderStatus()} />
        <DetailRow label="Note" value={request.userNote} />
      </View>

      {!accepted && !submitted && (
        <TouchableOpacity style={styles.acceptBtn} onPress={() => setAccepted(true)}>
          <Text style={styles.btnText}>Accept Request</Text>
        </TouchableOpacity>
      )}

      {accepted && !submitted && (
        <View style={styles.uploadSection}>
          <Text style={styles.uploadLabel}>Upload Your Shoutout Video</Text>
          <TouchableOpacity style={styles.uploadBtn} onPress={pickMedia}>
            <Icon name="cloud-upload-outline" size={20} color="#fff" />
            <Text style={[styles.btnText, { marginLeft: 8 }]}>{media ? 'Change File' : 'Choose File'}</Text>
          </TouchableOpacity>

          {media && (
            <View style={styles.preview}>
              <Video source={{ uri: media.uri }} style={styles.video} resizeMode="cover" paused />
              <Text style={styles.previewText}>{media.fileName || 'Video selected'}</Text>
            </View>
          )}

          {uploading ? (
            <Progress.Bar
              progress={uploadProgress}
              width={220}
              color={Colors.primary}
              animated
              style={{ marginTop: 20 }}
            />
          ) : (
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Icon name="send-outline" size={18} color="#fff" />
              <Text style={[styles.btnText, { marginLeft: 6 }]}>Submit Shoutout</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {submitted && <Text style={styles.confirmationText}>✅ Your shoutout has been submitted. Thanks!</Text>}

      <Text style={styles.recentHeading}>Recent Shoutouts</Text>
      <FlatList
        data={recentShoutouts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={renderShoutoutItem}
        contentContainerStyle={{ paddingVertical: 12 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#F7F7F7',
  },
  backBtn: {
    position: 'absolute',
    top: 44,
    left: 18,
    zIndex: 20,
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.textSecondary,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
    marginTop: 50,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 4,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 8,
  },
  detailRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    marginTop: 2,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginBottom: 24,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  uploadSection: {
    alignItems: 'center',
    width: '100%',
  },
  uploadLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentGreen,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginBottom: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 12,
  },
  video: {
    width: 260,
    height: 260,
    borderRadius: 16,
    marginTop: 12,
    backgroundColor: '#000',
  },
  preview: {
    alignItems: 'center',
    marginTop: 10,
  },
  previewText: {
    marginTop: 6,
    color: '#555',
  },
  confirmationText: {
    marginTop: 30,
    color: Colors.accentGreen,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  recentHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 30,
    marginBottom: 12,
  },
  shoutoutCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 2,
  },
  shoutoutThumb: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#ccc',
  },
  shoutoutName: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  shoutoutMsg: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
