import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
        },
        secondary: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#F59E0B',
          pink: '#EC4899',
          blue: '#3B82F6',
        },
        background: {
          DEFAULT: '#0A0A0F',
          secondary: '#12121A',
          tertiary: '#1A1A24',
        },
        surface: {
          DEFAULT: '#16161F',
          light: '#1F1F2A',
        },
        card: {
          DEFAULT: '#1E1E2A',
          hover: '#252532',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          tertiary: '#71717A',
          muted: '#52525B',
        },
        border: {
          DEFAULT: '#27272A',
          light: '#3F3F46',
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      }
    },
  },
  plugins: [],
};
export default config;
