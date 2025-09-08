import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { loginUser, registerUser, clearError } from '@store/slices/authSlice';
import { Button, Input, GlassmorphismButton, GlassmorphismInput, RoleSlider, AuthModeSlider } from '@components';
import { lightTheme } from '@utils/theme';

const AuthScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'restaurant_owner'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
    restaurantAddress: '',
    phone: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }

      if (selectedRole === 'restaurant_owner') {
        if (!formData.restaurantName) {
          newErrors.restaurantName = 'Restaurant name is required';
        }
        if (!formData.restaurantAddress) {
          newErrors.restaurantAddress = 'Restaurant address is required';
        }
        if (!formData.phone) {
          newErrors.phone = 'Phone number is required';
        }
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    dispatch(clearError());

    try {
      if (isLogin) {
        await dispatch(loginUser({
          email: formData.email,
          password: formData.password,
        })).unwrap();
      } else {
        await dispatch(registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole,
          ...(selectedRole === 'restaurant_owner' && {
            restaurantName: formData.restaurantName,
            restaurantAddress: formData.restaurantAddress,
            phone: formData.phone,
          }),
        })).unwrap();
      }
    } catch (error) {
      Alert.alert('Error', error as string);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook' | 'apple') => {
    // TODO: Implement social login
    Alert.alert('Coming Soon', `${provider} login will be available soon!`);
  };

  const toggleMode = (mode: boolean) => {
    setIsLogin(mode);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      restaurantName: '',
      restaurantAddress: '',
      phone: '',
    });
    setErrors({});
    dispatch(clearError());
  };

  const handleRoleChange = (role: 'customer' | 'restaurant_owner') => {
    setSelectedRole(role);
    setErrors({});
  };

  return (
    <LinearGradient
      colors={['#2ECC71', '#27AE60', '#229954']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <Text style={styles.logo}>🍽️</Text>
            </LinearGradient>
          </View>
          <Text style={styles.title}>Food Connect</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </Text>
        </View>

        {/* Auth Mode Slider */}
        <AuthModeSlider
          isLogin={isLogin}
          onModeChange={toggleMode}
          theme={lightTheme}
        />

        {/* Role Slider - Only show for signup */}
        {!isLogin && (
          <RoleSlider
            selectedRole={selectedRole}
            onRoleChange={handleRoleChange}
            theme={lightTheme}
          />
        )}

        <View style={styles.form}>
          {!isLogin && (
            <GlassmorphismInput
              label="Full Name"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              error={errors.name}
              theme={lightTheme}
            />
          )}

          {!isLogin && selectedRole === 'restaurant_owner' && (
            <>
              <GlassmorphismInput
                label="Restaurant Name"
                placeholder="Enter your restaurant name"
                value={formData.restaurantName}
                onChangeText={(text) => setFormData({ ...formData, restaurantName: text })}
                error={errors.restaurantName}
                theme={lightTheme}
              />

              <GlassmorphismInput
                label="Restaurant Address"
                placeholder="Enter your restaurant address"
                value={formData.restaurantAddress}
                onChangeText={(text) => setFormData({ ...formData, restaurantAddress: text })}
                error={errors.restaurantAddress}
                theme={lightTheme}
                multiline
                numberOfLines={2}
              />

              <GlassmorphismInput
                label="Phone Number"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                error={errors.phone}
                theme={lightTheme}
                keyboardType="phone-pad"
              />
            </>
          )}

          <GlassmorphismInput
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            theme={lightTheme}
          />

          <GlassmorphismInput
            label="Password"
            placeholder="Enter your password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            error={errors.password}
            theme={lightTheme}
          />

          {!isLogin && (
            <GlassmorphismInput
              label="Confirm Password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry
              error={errors.confirmPassword}
              theme={lightTheme}
            />
          )}

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <GlassmorphismButton
            title={isLogin ? 'Sign In' : 'Sign Up'}
            onPress={handleSubmit}
            loading={isLoading}
            variant="primary"
            theme={lightTheme}
            style={styles.submitButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <GlassmorphismButton
              title="Google"
              onPress={() => handleSocialLogin('google')}
              variant="glass"
              theme={lightTheme}
              style={styles.socialButton}
            />

            <GlassmorphismButton
              title="Facebook"
              onPress={() => handleSocialLogin('facebook')}
              variant="glass"
              theme={lightTheme}
              style={styles.socialButton}
            />
          </View>

        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    overflow: 'hidden',
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 50,
  },
  logo: {
    fontSize: 60,
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
  form: {
    flex: 1,
  },
  errorText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 16,
  },
  submitButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: 'rgba(255, 255, 255, 0.7)',
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default AuthScreen;