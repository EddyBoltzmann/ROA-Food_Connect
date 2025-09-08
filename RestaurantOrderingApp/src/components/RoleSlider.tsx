import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AnimatedSlider } from './AnimatedSlider';
import { Theme } from '@types/index';

interface RoleSliderProps {
  selectedRole: 'customer' | 'restaurant_owner';
  onRoleChange: (role: 'customer' | 'restaurant_owner') => void;
  theme: Theme;
}

export const RoleSlider: React.FC<RoleSliderProps> = ({
  selectedRole,
  onRoleChange,
  theme,
}) => {
  const roles = ['Customer', 'Restaurant Owner'];
  const selectedIndex = selectedRole === 'customer' ? 0 : 1;

  const handleRoleChange = (index: number) => {
    const role = index === 0 ? 'customer' : 'restaurant_owner';
    onRoleChange(role);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: '#FFFFFF' }]}>I am a</Text>
      <AnimatedSlider
        options={roles}
        selectedIndex={selectedIndex}
        onSelect={handleRoleChange}
        theme={theme}
        icon="👤"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    marginBottom: 16,
    textAlign: 'center',
  },
});