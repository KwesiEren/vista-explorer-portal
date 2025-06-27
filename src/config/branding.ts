
import { themeConfig } from './theme';

export const brandingConfig = {
  ...themeConfig.branding,
  description: 'Portal Management System',
  version: '1.0.0',
  // Company/Organization details
  company: {
    name: 'Vista Explorer Solutions',
    email: 'contact@vistaexplorer.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street, Innovation City, IC 12345',
    website: 'www.vistaexplorer.com'
  },
  // You can easily change the logo by updating this URL
  // Recommended: Upload your logo to your assets folder and reference it here
  logoUrl: themeConfig.branding.logoUrl,
} as const;
