import React from 'react';
import {
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Theme } from '@types/index';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  style?: ViewStyle;
  theme: Theme;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  text,
  style,
  theme,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator
        size={size}
        color={color || theme.colors.primary}
      />
      {text && (
        <Text
          style={[
            styles.text,
            {
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily.regular,
              marginTop: theme.spacing.md,
            },
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});