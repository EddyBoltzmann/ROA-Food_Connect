import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  GlassmorphismCard, 
  GlassmorphismButton, 
  GlassmorphismInput,
  Card,
  Button,
  Input,
  Rating
} from '@components';
import { lightTheme } from '@utils/theme';

const { width } = Dimensions.get('window');

const GlassmorphismDemoScreen: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [email, setEmail] = useState('');

  return (
    <LinearGradient
      colors={['#2ECC71', '#27AE60', '#229954']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Food Connect</Text>
          <Text style={styles.subtitle}>Glassmorphism Demo - Modern UI with glass effects</Text>
        </View>

        {/* Glassmorphism Cards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Glassmorphism Cards</Text>
          
          <GlassmorphismCard theme={lightTheme} style={styles.demoCard}>
            <Text style={styles.cardTitle}>Restaurant Card</Text>
            <Text style={styles.cardDescription}>
              Beautiful glassmorphism effect with subtle transparency and blur
            </Text>
            <Rating rating={4.5} showText showCount reviewCount={128} theme={lightTheme} />
          </GlassmorphismCard>

          <GlassmorphismCard theme={lightTheme} style={styles.demoCard}>
            <Text style={styles.cardTitle}>Menu Item</Text>
            <Text style={styles.cardDescription}>
              Perfect for displaying menu items with elegant glass effect
            </Text>
            <Text style={styles.price}>$12.99</Text>
          </GlassmorphismCard>
        </View>

        {/* Glassmorphism Buttons Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Glassmorphism Buttons</Text>
          
          <View style={styles.buttonRow}>
            <GlassmorphismButton
              title="Primary"
              onPress={() => {}}
              variant="primary"
              theme={lightTheme}
              style={styles.button}
            />
            <GlassmorphismButton
              title="Secondary"
              onPress={() => {}}
              variant="secondary"
              theme={lightTheme}
              style={styles.button}
            />
          </View>

          <GlassmorphismButton
            title="Glass Effect"
            onPress={() => {}}
            variant="glass"
            theme={lightTheme}
            style={styles.fullWidthButton}
          />
        </View>

        {/* Glassmorphism Inputs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Glassmorphism Inputs</Text>
          
          <GlassmorphismInput
            label="Search"
            placeholder="Search restaurants..."
            value={inputValue}
            onChangeText={setInputValue}
            theme={lightTheme}
          />

          <GlassmorphismInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            theme={lightTheme}
          />
        </View>

        {/* Comparison Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regular vs Glassmorphism</Text>
          
          <View style={styles.comparisonRow}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Regular Card</Text>
              <Card theme={lightTheme} style={styles.comparisonCard}>
                <Text style={styles.comparisonText}>Standard card design</Text>
              </Card>
            </View>

            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Glassmorphism</Text>
              <GlassmorphismCard theme={lightTheme} style={styles.comparisonCard}>
                <Text style={styles.comparisonText}>Glass effect card</Text>
              </GlassmorphismCard>
            </View>
          </View>

          <View style={styles.comparisonRow}>
            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Regular Button</Text>
              <Button
                title="Standard"
                onPress={() => {}}
                theme={lightTheme}
                style={styles.comparisonButton}
              />
            </View>

            <View style={styles.comparisonItem}>
              <Text style={styles.comparisonLabel}>Glassmorphism</Text>
              <GlassmorphismButton
                title="Glass"
                onPress={() => {}}
                variant="glass"
                theme={lightTheme}
                style={styles.comparisonButton}
              />
            </View>
          </View>
        </View>

        {/* Features List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Glassmorphism Features</Text>
          
          <GlassmorphismCard theme={lightTheme} style={styles.featuresCard}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✨</Text>
              <Text style={styles.featureText}>Subtle transparency effects</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎨</Text>
              <Text style={styles.featureText}>Beautiful gradient overlays</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💎</Text>
              <Text style={styles.featureText}>Elegant border highlights</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🌟</Text>
              <Text style={styles.featureText}>Modern glass-like appearance</Text>
            </View>
          </GlassmorphismCard>
        </View>

        {/* Usage Examples */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage Examples</Text>
          
          <GlassmorphismCard theme={lightTheme} style={styles.usageCard}>
            <Text style={styles.usageTitle}>Perfect for:</Text>
            <Text style={styles.usageText}>• Restaurant cards</Text>
            <Text style={styles.usageText}>• Menu items</Text>
            <Text style={styles.usageText}>• Search overlays</Text>
            <Text style={styles.usageText}>• Modal dialogs</Text>
            <Text style={styles.usageText}>• Navigation elements</Text>
            <Text style={styles.usageText}>• Form inputs</Text>
          </GlassmorphismCard>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: lightTheme.typography.fontSize.xxxl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  demoCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
    lineHeight: 20,
  },
  price: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFD700',
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  fullWidthButton: {
    marginTop: 8,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  comparisonItem: {
    flex: 1,
    marginHorizontal: 8,
  },
  comparisonLabel: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    textAlign: 'center',
  },
  comparisonCard: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comparisonText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.text,
    textAlign: 'center',
  },
  comparisonButton: {
    height: 40,
  },
  featuresCard: {
    padding: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: '#FFFFFF',
    flex: 1,
  },
  usageCard: {
    padding: 20,
  },
  usageTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  usageText: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 6,
  },
  bottomSpacer: {
    height: 50,
  },
});

export default GlassmorphismDemoScreen;