/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        11: 'var(--font-size-11)',
        12: 'var(--font-size-12)',
      },
      textColor: {
        primary: 'var(--figma-color-text)',
        secondary: 'var(--figma-color-text-secondary)',
        link: 'var(--figma-color-text-brand)',
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
      inset: {
        '0_5': '2px',
        '1_5': '6px',
      },
    },
  },
  plugins: [],
  darkMode: ['class', '.figma-dark'],
}
