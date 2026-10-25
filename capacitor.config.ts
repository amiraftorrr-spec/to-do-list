import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tedlist.app',
  appName: 'tedlist',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
