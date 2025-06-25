
import { themeConfig } from './theme';

export const brandingConfig = {
  ...themeConfig.branding,
  description: 'Portal Management System',
  version: '1.0.0',
  // You can easily change the logo by updating this URL
  // Recommended: Upload your logo to your assets folder and reference it here
  logoUrl: themeConfig.branding.logoUrl,
} as const;
