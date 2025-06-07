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
        'cream-dark': '#F0EAD6',
        'olive': '#8B956D',
        'taupe': '#C9B8A8',
        'sienna': '#C65D00',
        'coffee': '#3E2723',
        'primary': '#C65D00',
        
        // Dark mode colors
        'charcoal': '#2C2416',
        'charcoal-light': '#3D3426',
        'deep-olive': '#4A5240',
        'dark-taupe': '#6B5D54',
        'terra-cotta': '#D4754E',
        'off-white': '#FFF8E7',
        
        // Error colors
        'error': '#DC2626',
        'error-light': '#FEE2E2',
        'error-dark': '#991B1B'
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