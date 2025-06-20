/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // Blue
          dark: '#1E40AF',
          light: '#93C5FD',
        },
        secondary: {
          DEFAULT: '#10B981', // Green
          dark: '#047857',
          light: '#6EE7B7',
        },
        accent: {
          DEFAULT: '#F59E0B', // Amber
          dark: '#B45309',
          light: '#FCD34D',
        },
        background: {
          DEFAULT: '#F9FAFB',
          dark: '#1F2937',
        },
        text: {
          DEFAULT: '#1F2937',
          light: '#F9FAFB',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'custom': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
} 