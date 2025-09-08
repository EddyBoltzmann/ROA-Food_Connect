import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Theme } from '@types/index';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  theme: Theme;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
  theme,
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.surface, theme.colors.border],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
        style,
      ]}
    />
  );
};

// Predefined skeleton components for common use cases
export const RestaurantCardSkeleton: React.FC<{ theme: Theme }> = ({ theme }) => (
  <View style={styles.cardSkeleton}>
    <SkeletonLoader
      width="100%"
      height={120}
      borderRadius={theme.borderRadius.lg}
      theme={theme}
    />
    <View style={styles.cardContent}>
      <SkeletonLoader
        width="70%"
        height={16}
        borderRadius={theme.borderRadius.sm}
        theme={theme}
      />
      <SkeletonLoader
        width="50%"
        height={14}
        borderRadius={theme.borderRadius.sm}
        theme={theme}
        style={{ marginTop: 8 }}
      />
      <SkeletonLoader
        width="30%"
        height={14}
        borderRadius={theme.borderRadius.sm}
        theme={theme}
        style={{ marginTop: 8 }}
      />
    </View>
  </View>
);

export const MenuItemSkeleton: React.FC<{ theme: Theme }> = ({ theme }) => (
  <View style={styles.menuItemSkeleton}>
    <SkeletonLoader
      width={80}
      height={80}
      borderRadius={theme.borderRadius.md}
      theme={theme}
    />
    <View style={styles.menuItemContent}>
      <SkeletonLoader
        width="80%"
        height={16}
        borderRadius={theme.borderRadius.sm}
        theme={theme}
      />
      <SkeletonLoader
        width="60%"
        height={14}
        borderRadius={theme.borderRadius.sm}
        theme={theme}
        style={{ marginTop: 8 }}
      />
      <SkeletonLoader
        width="40%"
        height={14}
        borderRadius={theme.borderRadius.sm}
        theme={theme}
        style={{ marginTop: 8 }}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E5E7EB',
  },
  cardSkeleton: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 12,
  },
  menuItemSkeleton: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 12,
  },
});