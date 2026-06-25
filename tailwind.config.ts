import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        secondary: '#00D4AA',
        accent: '#FF6B6B',
        background: '#0A0A14',
        surface: '#12121E',
        surfaceElevated: '#1A1A2E',
        textPrimary: '#F0F0FF',
        textSecondary: '#8B8BA8',
      },
    },
  },
  plugins: [],
};

export default config;
