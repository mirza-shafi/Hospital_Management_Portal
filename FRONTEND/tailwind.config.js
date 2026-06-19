module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  // Dark mode is intentionally disabled for the medical/clinical UI.
  // Kept as 'class' so any leftover `dark:` utilities stay inert (the
  // `dark` class is never added to <html> by the theme contexts).
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Professional medical blue palette (Mayo / Cleveland Clinic inspired)
        brand: {
          50: '#eef5fc',
          100: '#d6e7f7',
          200: '#aecfee',
          300: '#7db1e3',
          400: '#4a8fd4',
          500: '#1f6fc0',
          600: '#0a558c', // primary
          700: '#08456f',
          800: '#073858',
          900: '#062c46',
        },
        teal: {
          500: '#0a9396',
          600: '#087f82',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(16, 42, 67, 0.06), 0 1px 2px rgba(16, 42, 67, 0.04)',
        'card-hover': '0 10px 30px rgba(10, 85, 140, 0.12)',
      },
    },
  },
  plugins: [],
};
