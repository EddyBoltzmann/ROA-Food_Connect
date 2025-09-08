import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@types/index';

interface AnimatedSliderProps {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  theme: Theme;
  style?: any;
  icon?: string;
}

const { width } = Dimensions.get('window');

export const AnimatedSlider: React.FC<AnimatedSliderProps> = ({
  options,
  selectedIndex,
  onSelect,
  theme,
  style,
  icon,
}) => {
  const slideAnim = useRef(new Animated.Value(selectedIndex)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: selectedIndex,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [selectedIndex]);

  const handlePress = (index: number) => {
    onSelect(index);
  };

  const sliderWidth = (width - 60) / options.length; // Account for padding and margins

  return (
    <View style={[styles.container, style]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <View style={styles.sliderContainer}>
        <Animated.View
          style={[
            styles.sliderBackground,
            {
              width: sliderWidth,
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, sliderWidth],
                  }),
                },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.primary, '#27AE60']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.sliderGradient}
          />
        </Animated.View>
        
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.option, { width: sliderWidth }]}
            onPress={() => handlePress(index)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.optionText,
                {
                  color: selectedIndex === index ? '#FFFFFF' : theme.colors.textSecondary,
                  fontFamily: selectedIndex === index 
                    ? theme.typography.fontFamily.semiBold 
                    : theme.typography.fontFamily.medium,
                },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  icon: {
    fontSize: 24,
    marginBottom: 12,
  },
  sliderContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    padding: 4,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  sliderBackground: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 21,
    overflow: 'hidden',
  },
  sliderGradient: {
    flex: 1,
    borderRadius: 21,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  optionText: {
    fontSize: 14,
    textAlign: 'center',
  },
});