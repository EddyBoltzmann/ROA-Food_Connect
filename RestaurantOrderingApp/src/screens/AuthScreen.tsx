import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@store/index';
import { loginUser, registerUser, clearError } from '@store/slices/authSlice';
import { Button, Input } from '@components';
import { lightTheme } from '@utils/theme';

const AuthScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setErrors({});
    dispatch(clearError());
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.logo}>🍽️</Text>
        <Text style={styles.title}>FoodieHub</Text>
        <Text style={styles.subtitle}>
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </Text>
      </View>

      <View style={styles.form}>
        {!isLogin && (
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            error={errors.name}
            theme={lightTheme}
          />
        )}

        <Input
          label="Email"
          placeholder="Enter your email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
          theme={lightTheme}
        />

        <Input
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          error={errors.password}
          theme={lightTheme}
        />

        {!isLogin && (
          <Input
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

        <Button
          title={isLogin ? 'Sign In' : 'Sign Up'}
          onPress={handleSubmit}
          loading={isLoading}
          theme={lightTheme}
          style={styles.submitButton}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton]}
            onPress={() => handleSocialLogin('google')}
          >
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, styles.facebookButton]}
            onPress={() => handleSocialLogin('facebook')}
          >
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
          <Text style={styles.toggleButtonText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  logo: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: lightTheme.typography.fontSize.xxxl,
    fontFamily: lightTheme.typography.fontFamily.bold,
    color: lightTheme.colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  errorText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.error,
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
    backgroundColor: lightTheme.colors.border,
  },
  dividerText: {
    fontSize: lightTheme.typography.fontSize.sm,
    fontFamily: lightTheme.typography.fontFamily.regular,
    color: lightTheme.colors.textSecondary,
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: lightTheme.borderRadius.md,
    marginHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: lightTheme.colors.border,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  facebookButton: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  socialButtonText: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.text,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  toggleButtonText: {
    fontSize: lightTheme.typography.fontSize.md,
    fontFamily: lightTheme.typography.fontFamily.medium,
    color: lightTheme.colors.primary,
  },
});

export default AuthScreen;