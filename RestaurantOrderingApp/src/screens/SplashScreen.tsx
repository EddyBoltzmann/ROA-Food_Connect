import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { setOnboardingCompleted } from '@store/slices/authSlice';
import { lightTheme } from '@utils/theme';

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { hasCompletedOnboarding } = useSelector((state: RootState) => state.auth);
  
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Simulate loading time and check onboarding status
    const timer = setTimeout(() => {
      if (!hasCompletedOnboarding) {
        dispatch(setOnboardingCompleted(false));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch, hasCompletedOnboarding, fadeAnim, scaleAnim, slideAnim]);

  return (
    <LinearGradient
      colors={['#2ECC71', '#27AE60', '#229954']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.background}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOverlay}
        />
      </View>
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim },
            ],
          },
        ]}
      >
        {/* Logo/Icon with Glassmorphism */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <Text style={styles.logoText}>🍽️</Text>
            </LinearGradient>
          </View>
        </View>
        
        {/* App Name */}
        <Text style={styles.appName}>FoodieHub</Text>
        <Text style={styles.tagline}>Order. Eat. Enjoy.</Text>
        
        {/* Loading indicator with Glassmorphism */}
        <View style={styles.loadingContainer}>
          <View style={[styles.loadingDot, styles.glassmorphismDot]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay1, styles.glassmorphismDot]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay2, styles.glassmorphismDot]} />
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    ...lightTheme.shadows.lg,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 60,
  },
  logoText: {
    fontSize: 60,
  },
  appName: {
    fontSize: lightTheme.typography.fontSize.xxxl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 60,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 4,
  },
  glassmorphismDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  loadingDotDelay1: {
    animationDelay: '0.2s',
  },
  loadingDotDelay2: {
    animationDelay: '0.4s',
  },
});

export default SplashScreen;