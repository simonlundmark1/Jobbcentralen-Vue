export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app/**/*.{js,vue,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette for Swedish job site
        primary: {
          50: '#eef6f4',
          100: '#d7ebe6',
          200: '#b5d9cf',
          300: '#89c1af',
          400: '#59a48d',
          500: '#1D6453', // Main brand color
          600: '#1a5a4b',
          700: '#164e42',
          800: '#124138',
          900: '#0e342d',
          950: '#0a2621'
        }
      }
    }
  }
}
