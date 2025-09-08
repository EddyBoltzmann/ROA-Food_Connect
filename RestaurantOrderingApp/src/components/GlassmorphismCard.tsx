import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  BlurView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@types/index';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  intensity?: number;
  tint?: 'light' | 'dark';
  theme: Theme;
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  style,
  onPress,
  intensity = 20,
  tint = 'light',
  theme,
}) => {
  const getGlassmorphismStyle = (): ViewStyle => {
    return {
      backgroundColor: tint === 'light' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.1)',
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: tint === 'light' 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      ...theme.shadows.lg,
    };
  };

  const content = (
    <View style={[getGlassmorphismStyle(), style]}>
      <LinearGradient
        colors={
          tint === 'light'
            ? ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
            : ['rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.05)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.touchable}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 16,
  },
  touchable: {
    borderRadius: 12,
  },
});