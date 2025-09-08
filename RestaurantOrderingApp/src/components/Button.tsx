import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@types/index';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  theme: Theme;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
  theme,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      ...theme.shadows.sm,
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.paddingHorizontal = theme.spacing.md;
        baseStyle.paddingVertical = theme.spacing.sm;
        baseStyle.minHeight = 36;
        break;
      case 'large':
        baseStyle.paddingHorizontal = theme.spacing.xl;
        baseStyle.paddingVertical = theme.spacing.lg;
        baseStyle.minHeight = 56;
        break;
      default:
        baseStyle.paddingHorizontal = theme.spacing.lg;
        baseStyle.paddingVertical = theme.spacing.md;
        baseStyle.minHeight = 48;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
        baseStyle.backgroundColor = theme.colors.primary;
        break;
      case 'secondary':
        baseStyle.backgroundColor = theme.colors.secondary;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = theme.colors.primary;
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
    }

    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    return baseStyle;
  };

  const getGradientColors = (): string[] => {
    switch (variant) {
      case 'primary':
        return [theme.colors.primary, '#27AE60'];
      case 'secondary':
        return [theme.colors.secondary, '#E67E22'];
      default:
        return [theme.colors.primary, '#27AE60'];
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: theme.typography.fontFamily.semiBold,
      textAlign: 'center',
    };

    // Size styles
    switch (size) {
      case 'small':
        baseStyle.fontSize = theme.typography.fontSize.sm;
        break;
      case 'large':
        baseStyle.fontSize = theme.typography.fontSize.lg;
        break;
      default:
        baseStyle.fontSize = theme.typography.fontSize.md;
    }

    // Variant styles
    switch (variant) {
      case 'primary':
      case 'secondary':
        baseStyle.color = '#FFFFFF';
        break;
      case 'outline':
      case 'ghost':
        baseStyle.color = theme.colors.primary;
        break;
    }

    return baseStyle;
  };

  const renderButtonContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : '#FFFFFF'}
        />
      );
    }

    return (
      <>
        {icon && <>{icon}</>}
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      </>
    );
  };

  if (variant === 'primary' || variant === 'secondary') {
    return (
      <TouchableOpacity
        style={[getButtonStyle(), style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {renderButtonContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});