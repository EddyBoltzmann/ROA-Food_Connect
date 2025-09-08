import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Theme } from '@types/index';

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  showCount?: boolean;
  reviewCount?: number;
  style?: ViewStyle;
  theme: Theme;
}

export const Rating: React.FC<RatingProps> = ({
  rating,
  maxRating = 5,
  size = 'medium',
  showText = false,
  showCount = false,
  reviewCount,
  style,
  theme,
}) => {
  const getStarSize = (): number => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 20;
      default:
        return 16;
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'small':
        return theme.typography.fontSize.xs;
      case 'large':
        return theme.typography.fontSize.lg;
      default:
        return theme.typography.fontSize.sm;
    }
  };

  const renderStars = () => {
    const stars = [];
    const starSize = getStarSize();

    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= rating;
      const isHalfFilled = i - 0.5 <= rating && i > rating;

      stars.push(
        <View key={i} style={styles.starContainer}>
          <Text
            style={[
              styles.star,
              {
                fontSize: starSize,
                color: isFilled || isHalfFilled ? theme.colors.warning : theme.colors.border,
              },
            ]}
          >
            {isHalfFilled ? '☆' : '★'}
          </Text>
        </View>
      );
    }

    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.ratingContainer}>
        {renderStars()}
        {showText && (
          <Text
            style={[
              styles.ratingText,
              {
                fontSize: getTextSize(),
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily.medium,
                marginLeft: theme.spacing.xs,
              },
            ]}
          >
            {rating.toFixed(1)}
          </Text>
        )}
      </View>
      {showCount && reviewCount !== undefined && (
        <Text
          style={[
            styles.countText,
            {
              fontSize: getTextSize(),
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.regular,
              marginLeft: theme.spacing.xs,
            },
          ]}
        >
          ({reviewCount})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starContainer: {
    marginRight: 2,
  },
  star: {
    lineHeight: 16,
  },
  ratingText: {
    marginLeft: 4,
  },
  countText: {
    marginLeft: 4,
  },
});