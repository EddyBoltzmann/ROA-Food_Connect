import { Theme } from '@types/index';

export const lightTheme: Theme = {
  colors: {
    primary: '#2ECC71', // Fresh green
    secondary: '#FF8C42', // Warm orange
    accent: '#3498DB', // Blue accent
    background: '#FFFFFF',
    surface: '#F8F9FA',
    text: '#2C3E50',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#E74C3C',
    success: '#2ECC71',
    warning: '#F39C12',
    info: '#3498DB',
  },
  typography: {
    fontFamily: {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semiBold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#404040',
  },
};

export const getTheme = (isDark: boolean): Theme => {
  return isDark ? darkTheme : lightTheme;
};