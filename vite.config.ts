import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/PorkFolio/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'PigTrack Pro',
        short_name: 'PigTrack',
        description: 'Piggery farm management system',
        theme_color: '#0f172a',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: process.env.GITHUB_PAGES === 'true' ? '/PorkFolio/dashboard' : '/dashboard',
        scope: process.env.GITHUB_PAGES === 'true' ? '/PorkFolio/' : '/',
        icons: [
          { src: process.env.GITHUB_PAGES === 'true' ? '/PorkFolio/pwa-192.svg' : '/pwa-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: process.env.GITHUB_PAGES === 'true' ? '/PorkFolio/pwa-512.svg' : '/pwa-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
    }),
  ],
});
