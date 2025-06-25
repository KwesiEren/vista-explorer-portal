
export { themeConfig } from './theme';
export { brandingConfig } from './branding';

// Main configuration object that combines all configs
export const appConfig = {
  theme: {
    colors: {
      primary: '#403E99',     // Deep purple - used for main UI elements
      secondary: '#CB1E1E',   // Red - used for destructive actions and highlights  
      accent: '#D9C663',      // Gold/yellow - used for accents and highlights
      neutral: '#E4E4E4',     // Light gray - used for backgrounds and borders
    }
  },
  branding: {
    appName: 'Vista Explorer',
    description: 'Portal Management System',
    logoUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop&crop=center',
    logoAlt: 'Vista Explorer Logo',
    version: '1.0.0',
  },
  api: {
    // This will be updated during backend integration
    baseUrl: process.env.NODE_ENV === 'production' ? '/api' : 'https://e51f-197-255-102-7.ngrok-free.app/api',
  }
} as const;

export type AppConfig = typeof appConfig;
