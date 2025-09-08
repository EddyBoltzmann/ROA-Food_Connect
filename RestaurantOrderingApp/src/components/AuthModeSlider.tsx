import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedSlider } from './AnimatedSlider';
import { Theme } from '@types/index';

interface AuthModeSliderProps {
  isLogin: boolean;
  onModeChange: (isLogin: boolean) => void;
  theme: Theme;
}

export const AuthModeSlider: React.FC<AuthModeSliderProps> = ({
  isLogin,
  onModeChange,
  theme,
}) => {
  const modes = ['Sign In', 'Sign Up'];
  const selectedIndex = isLogin ? 0 : 1;

  const handleModeChange = (index: number) => {
    const mode = index === 0;
    onModeChange(mode);
  };

  return (
    <View style={styles.container}>
      <AnimatedSlider
        options={modes}
        selectedIndex={selectedIndex}
        onSelect={handleModeChange}
        theme={theme}
        icon="🔐"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
});