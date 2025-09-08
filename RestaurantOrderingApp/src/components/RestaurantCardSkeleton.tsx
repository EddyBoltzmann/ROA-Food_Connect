import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import { Theme } from '@types/index';

interface RestaurantCardSkeletonProps {
  style?: ViewStyle;
  theme: Theme;
}

export const RestaurantCardSkeleton: React.FC<RestaurantCardSkeletonProps> = ({
  style,
  theme,
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const shimmerStyle = {
    opacity: shimmerAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  };

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.image, shimmerStyle]} />
      <View style={styles.content}>
        <Animated.View style={[styles.title, shimmerStyle]} />
        <Animated.View style={[styles.subtitle, shimmerStyle]} />
        <View style={styles.footer}>
          <Animated.View style={[styles.rating, shimmerStyle]} />
          <Animated.View style={[styles.deliveryTime, shimmerStyle]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    height: 120,
    backgroundColor: '#E0E0E0',
  },
  content: {
    padding: 16,
  },
  title: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  subtitle: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 12,
    width: '90%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: 60,
  },
  deliveryTime: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: 80,
  },
});