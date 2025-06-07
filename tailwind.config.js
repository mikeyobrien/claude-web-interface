// ABOUTME: Tailwind CSS configuration with 70s-inspired color palette
// ABOUTME: Defines custom colors for light and dark modes

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './client/index.html',
    './client/src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        'cream': '#FAF7F0',
        'olive': '#8B956D',
        'taupe': '#C9B8A8',
        'sienna': '#C65D00',
        'coffee': '#3E2723',
        
        // Dark mode colors
        'charcoal': '#2C2416',
        'deep-olive': '#4A5240',
        'dark-taupe': '#6B5D54',
        'terra-cotta': '#D4754E',
        'off-white': '#FFF8E7'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}