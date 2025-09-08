import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { Theme } from '@types/index';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  theme: Theme;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  shadow = 'sm',
  theme,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
    };

    if (shadow !== 'none') {
      Object.assign(baseStyle, theme.shadows[shadow]);
    }

    return baseStyle;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};