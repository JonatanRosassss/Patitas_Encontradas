import { Colors as AppColors } from '../constants/theme';

export const Colors = {
  primary: AppColors?.primary || '#FF8A00',
  secondary: '#5A3A1F',
  background: AppColors?.backgroundLight || '#FAF8F5',
  surface: '#FFFFFF',
  text: AppColors?.text || '#5A3A1F',
  textMuted: AppColors?.textSecondary || '#8D735C',
  border: AppColors?.border || '#E8DFD8',
  danger: '#EF4444',
  success: '#16A34A',
  warning: '#F59E0B',
};

export const Typography = {
  heading1: { fontSize: 28, fontWeight: '700' as const },
  heading2: { fontSize: 22, fontWeight: '600' as const },
  heading3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  full: 9999,
};
