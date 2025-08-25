import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import Colors from '../../constants/Colors';
import Video from 'react-native-video';

export default function UnifiedAuthScreen({ navigation }) {
  const { colors } = useAppTheme();
  const C = colors ?? Colors;

  const navigateToForm = (isRegistering) => {
    navigation.navigate('AuthForm', { isRegistering });
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* Background Video */}
      <Video
        source={require('../../../assets/videos/intro_bg.mp4')} // Ensure this path is correct
        style={styles.backgroundVideo}
        muted
        repeat
        resizeMode="cover"
        rate={1.0}
        ignoreSilentSwitch="obey"
      />
      {/* Dark Overlay */}
      <View style={styles.overlay} />

      {/* Main Content */}
      <View style={styles.contentWrapper}>
        <View style={styles.logoContainer}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logoImage} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.signUpButton, { backgroundColor: C.primary }]}
            onPress={() => navigateToForm(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonText}>Sign up for free</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: C.border }]}
            onPress={() => navigateToForm(false)}
            activeOpacity={0.8}
          >
            <Text style={[styles.loginButtonText, { color: C.textPrimary }]}>Log in</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.versionText, { color: C.textSecondary + 'AA' }]}>
          Version 1.0.1
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(6, 6, 8, 0.56)',
  },
  contentWrapper: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoImage: {
    width: 200,
    height: 80,
    marginBottom: 18,
  },
  logoText: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FF7A00',
    letterSpacing: 2,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  signUpButton: {
    paddingVertical: 18, // Adjusted height
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  loginButton: {
    paddingVertical: 18, // Adjusted height
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
  },
});
