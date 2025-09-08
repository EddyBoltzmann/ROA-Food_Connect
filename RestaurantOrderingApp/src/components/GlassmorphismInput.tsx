import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@types/index';

interface GlassmorphismInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  theme: Theme;
}

export const GlassmorphismInput: React.FC<GlassmorphismInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  inputStyle,
  theme,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getContainerStyle = (): ViewStyle => {
    return {
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: error
        ? theme.colors.error
        : isFocused
        ? 'rgba(255, 255, 255, 0.4)'
        : 'rgba(255, 255, 255, 0.2)',
      minHeight: multiline ? 80 : 48,
    };
  };

  const getInputStyle = (): TextStyle => {
    return {
      flex: 1,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      textAlignVertical: multiline ? 'top' : 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
    };
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}>
          {label}
        </Text>
      )}
      <View style={getContainerStyle()}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.inputContainer}>
            {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
            <TextInput
              style={[getInputStyle(), inputStyle]}
              placeholder={placeholder}
              placeholderTextColor={theme.colors.textSecondary}
              value={value}
              onChangeText={onChangeText}
              secureTextEntry={secureTextEntry}
              keyboardType={keyboardType}
              autoCapitalize={autoCapitalize}
              multiline={multiline}
              numberOfLines={numberOfLines}
              editable={!disabled}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {rightIcon && (
              <TouchableOpacity
                style={styles.rightIcon}
                onPress={onRightIconPress}
                disabled={!onRightIconPress}
              >
                {rightIcon}
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
      {error && (
        <Text style={[styles.error, { color: theme.colors.error, fontFamily: theme.typography.fontFamily.regular }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  gradient: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  leftIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  rightIcon: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});