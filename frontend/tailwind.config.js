/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        journal: {
          primary: '#2D3748',
          secondary: '#F7FAFC',
          accent: '#4A5568',
          highlight: '#3182CE',
          muted: '#718096',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        serif: ['Times New Roman', 'Georgia', 'serif'],
        sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
