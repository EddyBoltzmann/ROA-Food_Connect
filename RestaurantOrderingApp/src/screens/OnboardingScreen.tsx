import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { setOnboardingCompleted } from '@store/slices/authSlice';
import { Button } from '@components';
import { lightTheme } from '@utils/theme';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Order Anywhere',
    description: 'Browse thousands of restaurants and order your favorite food from anywhere, anytime.',
    icon: '📍',
    color: lightTheme.colors.primary,
  },
  {
    id: 2,
    title: 'Personalized Filters',
    description: 'Find exactly what you\'re craving with smart filters for cuisine, dietary preferences, and more.',
    icon: '🎯',
    color: lightTheme.colors.secondary,
  },
  {
    id: 3,
    title: 'Earn Rewards',
    description: 'Get loyalty points with every order and redeem them for discounts and free items.',
    icon: '🎁',
    color: lightTheme.colors.accent,
  },
];

const OnboardingScreen: React.FC = () => {
  const dispatch = useDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentSlide, fadeAnim, slideAnim]);

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * width,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      setCurrentSlide(prevSlide);
      scrollViewRef.current?.scrollTo({
        x: prevSlide * width,
        animated: true,
      });
    }
  };

  const handleGetStarted = () => {
    dispatch(setOnboardingCompleted(true));
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={styles.slide}>
      <Animated.View
        style={[
          styles.slideContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: slide.color }]}>
          <Text style={styles.icon}>{slide.icon}</Text>
        </View>
        
        {/* Title */}
        <Text style={styles.title}>{slide.title}</Text>
        
        {/* Description */}
        <Text style={styles.description}>{slide.description}</Text>
      </Animated.View>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {onboardingSlides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            {
              backgroundColor: index === currentSlide
                ? lightTheme.colors.primary
                : lightTheme.colors.border,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {onboardingSlides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      <View style={styles.footer}>
        {renderPagination()}
        
        <View style={styles.buttonContainer}>
          {currentSlide > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={handlePrevious}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <Button
            title={currentSlide === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="large"
            style={styles.nextButton}
            theme={lightTheme}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    ...lightTheme.shadows.lg,
  },
  icon: {
    fontSize: 60,
  },
  title: {
    fontSize: lightTheme.typography.fontSize.xxl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    height: height * 0.3,
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 30,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  backButtonText: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.textSecondary,
  },
  nextButton: {
    flex: 1,
    marginLeft: 20,
  },
});

export default OnboardingScreen;