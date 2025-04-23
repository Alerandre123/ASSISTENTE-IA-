import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aiassistant.app',
  appName: 'AI Assistant',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'release.keystore',
      keystoreAlias: 'key0',
      keystorePassword: 'password',
      keyPassword: 'password',
    }
  }
};

export default config;