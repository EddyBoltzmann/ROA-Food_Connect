import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
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
    <View style={styles.container}>
      <View style={styles.background}>
        <View style={styles.gradientOverlay} />
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
        {/* Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🍽️</Text>
          </View>
        </View>
        
        {/* App Name */}
        <Text style={styles.appName}>FoodieHub</Text>
        <Text style={styles.tagline}>Order. Eat. Enjoy.</Text>
        
        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.primary,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: lightTheme.colors.primary,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    ...lightTheme.shadows.lg,
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
  loadingDotDelay1: {
    animationDelay: '0.2s',
  },
  loadingDotDelay2: {
    animationDelay: '0.4s',
  },
});

export default SplashScreen;