import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store/index';
import { logout } from '@store/slices/authSlice';
import { 
  Card, 
  Button, 
  Input,
  GlassmorphismCard,
  LoadingSpinner 
} from '@components';
import { lightTheme } from '@utils/theme';

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    language: user?.language || 'en',
    isDarkMode: user?.isDarkMode || false,
    notifications: user?.preferences?.notifications || true,
    promotions: user?.preferences?.promotions || true,
    loyalty: user?.preferences?.loyalty || true,
  });

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => dispatch(logout()),
        },
      ]
    );
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
      } else {
        Alert.alert('Error', result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileItem = (title: string, value: string, onPress?: () => void) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <Text style={styles.profileItemTitle}>{title}</Text>
      <View style={styles.profileItemRight}>
        <Text style={styles.profileItemValue}>{value}</Text>
        {onPress && <Text style={styles.profileItemArrow}>›</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderSwitchItem = (title: string, value: boolean, onValueChange: (value: boolean) => void) => (
    <View style={styles.profileItem}>
      <Text style={styles.profileItemTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: lightTheme.colors.border, true: lightTheme.colors.primary }}
        thumbColor={value ? '#FFFFFF' : lightTheme.colors.textSecondary}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#2ECC71', '#27AE60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Information */}
        <Card theme={lightTheme} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editButton}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <Input
                label="Full Name"
                value={profileData.name}
                onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                theme={lightTheme}
              />
              <Input
                label="Email"
                value={profileData.email}
                onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                theme={lightTheme}
              />
              <Input
                label="Phone"
                value={profileData.phone}
                onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                keyboardType="phone-pad"
                theme={lightTheme}
              />
              <Button
                title="Save Changes"
                onPress={handleSaveProfile}
                loading={isLoading}
                theme={lightTheme}
                style={styles.saveButton}
              />
            </View>
          ) : (
            <View style={styles.profileInfo}>
              {renderProfileItem('Full Name', user?.name || 'Not provided')}
              {renderProfileItem('Email', user?.email || 'Not provided')}
              {renderProfileItem('Phone', user?.phone || 'Not provided')}
              {renderProfileItem('Language', user?.language === 'en' ? 'English' : 'Twi')}
            </View>
          )}
        </Card>

        {/* Preferences */}
        <Card theme={lightTheme} style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.preferences}>
            {renderSwitchItem(
              'Push Notifications',
              profileData.notifications,
              (value) => setProfileData({ ...profileData, notifications: value })
            )}
            {renderSwitchItem(
              'Promotional Offers',
              profileData.promotions,
              (value) => setProfileData({ ...profileData, promotions: value })
            )}
            {renderSwitchItem(
              'Loyalty Program',
              profileData.loyalty,
              (value) => setProfileData({ ...profileData, loyalty: value })
            )}
            {renderSwitchItem(
              'Dark Mode',
              profileData.isDarkMode,
              (value) => setProfileData({ ...profileData, isDarkMode: value })
            )}
          </View>
        </Card>

        {/* Account Actions */}
        <Card theme={lightTheme} style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.accountActions}>
            {renderProfileItem('Order History', '', () => {
              // Navigate to order history
            })}
            {renderProfileItem('Payment Methods', '', () => {
              // Navigate to payment methods
            })}
            {renderProfileItem('Addresses', '', () => {
              // Navigate to addresses
            })}
            {renderProfileItem('Help & Support', '', () => {
              // Navigate to help
            })}
          </View>
        </Card>

        {/* Loyalty Points */}
        <GlassmorphismCard theme={lightTheme} style={styles.loyaltyCard}>
          <View style={styles.loyaltyHeader}>
            <Text style={styles.loyaltyTitle}>Loyalty Points</Text>
            <Text style={styles.loyaltyPoints}>{user?.loyaltyPoints || 0}</Text>
          </View>
          <Text style={styles.loyaltySubtitle}>
            Keep ordering to earn more points and unlock rewards!
          </Text>
        </GlassmorphismCard>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            theme={lightTheme}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightTheme.colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  userName: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 20,
    marginBottom: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
  },
  editButton: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.primary,
  },
  editForm: {
    marginTop: 8,
  },
  saveButton: {
    marginTop: 16,
  },
  profileInfo: {
    marginTop: 8,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: lightTheme.colors.border,
  },
  profileItemTitle: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.text,
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileItemValue: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    marginRight: 8,
  },
  profileItemArrow: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.textSecondary,
  },
  preferences: {
    marginTop: 8,
  },
  accountActions: {
    marginTop: 8,
  },
  loyaltyCard: {
    margin: 20,
    padding: 20,
    alignItems: 'center',
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  loyaltyTitle: {
    fontSize: lightTheme.typography.fontSize.lg,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
    marginRight: 12,
  },
  loyaltyPoints: {
    fontSize: lightTheme.typography.fontSize.xl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  loyaltySubtitle: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 18,
  },
  logoutSection: {
    padding: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    paddingVertical: 16,
  },
});

export default ProfileScreen;