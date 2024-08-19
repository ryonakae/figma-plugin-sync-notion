/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      textColor: {
        primary: 'var(--figma-color-text)',
        secondary: 'var(--figma-color-text-secondary)',
      },
      backgroundColor: {
        secondary: 'var(--figma-color-bg-secondary)',
        selected: 'var(--figma-color-bg-selected)',
        hover: 'var(--figma-color-bg-hover)',
      },
      borderColor: {
        primary: 'var(--figma-color-border)',
        onselected: 'var(--figma-color-border-onselected)',
      },
      borderRadius: {
        2: 'var(--border-radius-2)',
        6: 'var(--border-radius-6)',
      },
      maxHeight: {
        500: '500px',
      },
    },
  },
  plugins: [],
  darkMode: ['class', '.figma-dark'],
}
