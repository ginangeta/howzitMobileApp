import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import * as Progress from 'react-native-progress';

export default function RequestDetails() {
  const [accepted, setAccepted] = useState(false);
  const [media, setMedia] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const request = {
    id: 'REQ-1293',
    celeb: 'DJ Breezy',
    user: 'Alex T.',
    message: 'Happy Birthday Alex! 🎉🎂',
    dateRequested: '2025-06-01',
    type: 'Video',
    status: 'Pending',
    length: '30 seconds',
    userNote: 'Please say it with excitement and mention his name clearly.',
  };

  const handleAccept = () => {
    setAccepted(true);
    Alert.alert('Request Accepted', 'You can now upload your shoutout.');
  };

  const pickMedia = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Media selection failed');
        } else {
          setMedia(response.assets[0]);
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
        Alert.alert('Shoutout Submitted', 'Your video has been successfully submitted!');
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <Text style={styles.heading}>Shoutout Request</Text>
      <Text style={styles.subHeading}>
        Personalize your video for <Text style={{ fontWeight: 'bold' }}>{request.user}</Text>
      </Text>

      <View style={styles.card}>
        <DetailRow label="Request ID" value={request.id} />
        <DetailRow label="From" value={request.celeb} />
        <DetailRow label="To" value={request.user} />
        <DetailRow label="Message" value={`"${request.message}"`} />
        <DetailRow label="Requested On" value={request.dateRequested} />
        <DetailRow label="Type" value={request.type} />
        <DetailRow label="Length" value={request.length} />
        <DetailRow label="Status" value={renderStatus()} />
        <DetailRow label="Note" value={request.userNote} />
      </View>

      {!accepted && !submitted && (
        <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept}>
          <Text style={styles.btnText}>Accept Request</Text>
        </TouchableOpacity>
      )}

      {accepted && !submitted && (
        <View style={styles.uploadSection}>
          <Text style={styles.uploadLabel}>Upload Your Shoutout Video</Text>

          <TouchableOpacity style={styles.uploadBtn} onPress={pickMedia}>
            <Icon name="cloud-upload-outline" size={20} color="#fff" />
            <Text style={[styles.btnText, { marginLeft: 8 }]}>
              {media ? 'Change File' : 'Choose File'}
            </Text>
          </TouchableOpacity>

          {media && (
            <View style={styles.preview}>
              <Video
                source={{ uri: media.uri }}
                style={styles.video}
                resizeMode="cover"
                paused={true}
              />
              <Text style={styles.previewText}>
                {media.fileName || 'Video selected'}
              </Text>
            </View>
          )}

          {uploading ? (
            <Progress.Bar
              progress={uploadProgress}
              width={200}
              color="#4CAF50"
              animated={true}
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

      {submitted && (
        <Text style={styles.confirmationText}>
          ✅ Your shoutout has been submitted. Thanks!
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
  },
  scroll: {
    flex: 1,
    backgroundColor: '#fff9f5',
  },
  container: {
    padding: 24,
    paddingBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ff6600',
    marginBottom: 10,
    marginTop: 50,
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  detailRow: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  value: {
    fontSize: 15,
    fontWeight: '400',
    color: '#222',
    marginTop: 2,
  },
  acceptBtn: {
    backgroundColor: '#ff6600',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
    alignSelf: 'center',
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
    backgroundColor: '#3399ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
  },
  video: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginTop: 10,
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
    color: '#28a745',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
