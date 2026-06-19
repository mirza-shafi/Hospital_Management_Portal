module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  // Dark mode is intentionally disabled for the medical/clinical UI.
  // Kept as 'class' so any leftover `dark:` utilities stay inert (the
  // `dark` class is never added to <html> by the theme contexts).
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Neutral charcoal palette (clean white/modern, no blue)
        brand: {
          50: '#f6f7f8',
          100: '#eceef0',
          200: '#dcdfe3',
          300: '#bcc1c8',
          400: '#8b929b',
          500: '#5c636c',
          600: '#3b424b', // secondary
          700: '#272c33',
          800: '#1b1f24', // primary
          900: '#0c0e11',
        },
        teal: {
          500: '#2f6f6b',
          600: '#275c58',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16, 42, 67, 0.06), 0 1px 2px rgba(16, 42, 67, 0.04)',
        'card-hover': '0 10px 30px rgba(16, 19, 23, 0.12)',
      },
    },
  },
  plugins: [],
};
