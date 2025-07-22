import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors from '../../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CelebrityProfile({ route, navigation }) {
  const { celeb } = route.params;

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/abstract_bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Icon name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Image source={{ uri: celeb.avatar }} style={styles.avatar} />

        <Text style={styles.name}>{celeb.name}</Text>
        <Text style={styles.handle}>{celeb.specialization || 'Public Figure'}</Text>

        <Text style={styles.bio}>
          {celeb.bio || 'This celeb hasn’t added a bio yet, but you can still request a shoutout!'}
        </Text>

        <View style={styles.infoBox}>
          <Info icon="💰" label={`$${celeb.price} / shoutout`} />
          <Info icon="⏱" label={`${celeb.deliveryTime || '24h'} delivery`} />
          <Info icon="⭐" label={`${celeb.rating?.toFixed(1) || 'N/A'} rating`} />
          <Info icon="🎉" label={`${celeb.shoutoutsCount || 0} shoutouts done`} />
          <Info icon="📍" label={celeb.location || 'Unknown location'} />
          <Info icon="🗣️" label={(celeb.languages || ['English']).join(', ')} />
        </View>

        <Text style={styles.typesTitle}>Accepted Shoutout Types</Text>
        <View style={styles.types}>
          {celeb.acceptedTypes?.length > 0 ? (
            celeb.acceptedTypes.map((type) => (
              <View key={type} style={styles.typeBubble}>
                <Text style={styles.typeText}>{type.toUpperCase()}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noTypes}>No types specified</Text>
          )}
        </View>

        {celeb.tags?.length > 0 && (
          <View style={styles.tagsSection}>
            <View style={styles.tagsHeader}>
              <Text style={styles.typesTitle}>✨ Highlights</Text>
            </View>
            <View style={styles.tagsContainer}>
              {celeb.tags.map((tag) => (
                <View key={tag} style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('ShoutoutRequest', { celeb })}
        >
          <Text style={styles.buttonText}>Request Shoutout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const Info = ({ icon, label }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoEmoji}>{icon}</Text>
    <Text style={styles.infoText}>{label}</Text>
  </View>
);


const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.secondary,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 28,
    paddingBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: Colors.accentGreen,
    marginBottom: 16,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
  },
  handle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.accentBlue,
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  infoBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.bubbleBg,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 25,
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    width: '45%',
  },
  infoEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textDark,
    fontWeight: '600',
  },
  typesTitle: {
    alignSelf: 'center',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
    color: Colors.primary,
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 40,
  },
  typeBubble: {
    backgroundColor: Colors.accentBlue,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    margin: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  typeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  noTypes: {
    color: Colors.textDark,
    fontStyle: 'italic',
    fontSize: 14,
  },
  highlightBubble: {
    backgroundColor: Colors.bubbleBg,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 30,
    margin: 4,
    alignItems: 'center',
  },
  highlightText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  tagsSection: {
    width: '100%',
    marginBottom: 40,
  },

  tagsHeader: {
    marginBottom: 10,
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tagPill: {
    backgroundColor: Colors.bubbleBg, // keep it soft, like #FFF5E5 or similar
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },

  tagText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  button: {
    backgroundColor: Colors.accentGreen,
    paddingVertical: 18,
    borderRadius: 50,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#1b5e20',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  buttonText: {
    color: Colors.textLight,
    fontWeight: '800',
    fontSize: 18,
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
});
