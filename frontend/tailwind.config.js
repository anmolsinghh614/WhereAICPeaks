/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cp: {
          navy: {
            950: '#060B18',
            900: '#0A1128',
            800: '#111D42',
            700: '#1C2C5E',
          },
          blue: {
            DEFAULT: '#2563EB',
            light: '#3B82F6',
            subtle: '#EFF6FF',
          },
          purple: {
            DEFAULT: '#7C3AED',
            light: '#8B5CF6',
            subtle: '#F5F3FF',
          },
          success: {
            DEFAULT: '#10B981',
            dark: '#059669',
            subtle: '#ECFDF5',
          },
          warning: {
            DEFAULT: '#F59E0B',
            dark: '#D97706',
            subtle: '#FFFBEB',
          },
          danger: {
            DEFAULT: '#EF4444',
            dark: '#DC2626',
            subtle: '#FEF2F2',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'elevated': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
