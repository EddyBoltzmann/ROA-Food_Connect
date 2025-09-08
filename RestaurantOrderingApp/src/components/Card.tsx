import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@types/index';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  glassmorphism?: boolean;
  theme: Theme;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  shadow = 'sm',
  glassmorphism = false,
  theme,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      overflow: 'hidden',
    };

    if (glassmorphism) {
      baseStyle.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = 'rgba(255, 255, 255, 0.2)';
    } else {
      baseStyle.backgroundColor = theme.colors.surface;
    }

    if (shadow !== 'none') {
      Object.assign(baseStyle, theme.shadows[shadow]);
    }

    return baseStyle;
  };

  const renderContent = () => {
    if (glassmorphism) {
      return (
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      );
    }
    return children;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 16,
  },
});