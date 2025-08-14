import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import Swiper from 'react-native-swiper';
import Colors from '../constants/Colors'; // optional

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to Howzit!',
    text: 'Buy shoutouts from your favorite celebs, fast and easy.',
    image: require('../../assets/images/onboard1.jpg'),
  },
  {
    key: '2',
    title: 'Pick Your Star',
    text: 'Browse through profiles, prices, ratings & more.',
    image: require('../../assets/images/onboard2.jpg'),
  },
  {
    key: '3',
    title: 'Make It Personal',
    text: 'Send your message, choose your type — video, audio or text.',
    image: require('../../assets/images/onboard3.jpg'),
  },
];

export default function OnboardingScreen({ onDone }) {
  return (
    <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <Swiper
        loop={false}
        showsButtons={false}
        dotColor="#ffd5b5"
        activeDotColor={Colors.primary || '#E67E22'}
        >
        {slides.map((slide, index) => (
            <View key={slide.key} style={styles.slide}>
            <Image source={slide.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.text}>{slide.text}</Text>

            {index === slides.length - 1 && (
                <TouchableOpacity
                style={styles.button}
                onPress={onDone}  // ✅ use the prop
                >
                <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            )}
            </View>
        ))}
        </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: width * 0.4,
    height: 60,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    padding: 24,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: Colors.secondary,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ff6600',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ff6600',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
