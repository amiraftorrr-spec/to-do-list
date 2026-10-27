import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tedlist.app',
  appName: 'tedlist',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_tedlist',
      iconColor: '#6366f1',
    },
  },
};

export default config;
