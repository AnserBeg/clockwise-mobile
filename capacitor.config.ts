import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2cecad065646402cb2fa2e312b32840a',
  appName: 'clockwise-mobile',
  webDir: 'dist',
  server: {
    url: 'https://2cecad06-5646-402c-b2fa-2e312b32840a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false,
  plugins: {
    Preferences: {
      configure: {
        group: 'TimeTrackingApp'
      }
    }
  }
};

export default config;