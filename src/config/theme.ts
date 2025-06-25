
export const themeConfig = {
  colors: {
    primary: '#403E99',     // Deep purple
    secondary: '#CB1E1E',   // Red
    accent: '#D9C663',      // Gold/yellow
    neutral: '#E4E4E4',     // Light gray
  },
  branding: {
    appName: 'Vista Explorer',
    logoUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100&h=100&fit=crop&crop=center',
    logoAlt: 'Vista Explorer Logo',
  },
  layout: {
    sidebarWidth: '16rem', // 64 in Tailwind (w-64)
  }
} as const;

export type ThemeConfig = typeof themeConfig;
