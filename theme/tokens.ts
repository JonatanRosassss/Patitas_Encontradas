import { Colors as AppColors, Spacing as AppSpacing, Radius as AppRadius } from '../constants/theme';

export const Colors = {
  primary: AppColors.primary,
  secondary: AppColors.secondary,
  background: AppColors.backgroundLight,
  surface: AppColors.card,
  text: AppColors.text,
  textMuted: AppColors.textSecondary,
  border: AppColors.border,
  danger: AppColors.error,
  success: AppColors.success,
  warning: AppColors.warning,
};

export const Typography = {
  heading1: { fontSize: 28, fontWeight: '700' as const },
  heading2: { fontSize: 22, fontWeight: '600' as const },
  heading3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
};

export const Spacing = AppSpacing;
export const Radius = AppRadius;
