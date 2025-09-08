import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { lightTheme } from '@utils/theme';

const ChatScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Screen</Text>
      <Text style={styles.subtitle}>Coming Soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.background,
  },
  title: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
  },
});

export default ChatScreen;