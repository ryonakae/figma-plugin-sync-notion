/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        icon: 'Material Symbols Outlined',
      },
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
        primary: 'var(--figma-color-bg)',
        secondary: 'var(--figma-color-bg-secondary)',
        tertiary: 'var(--figma-color-bg-tertiary)',
        selected: 'var(--figma-color-bg-selected)',
        selectedSecondary: 'var(--figma-color-bg-selected-secondary)',
        selectedTertiary: 'var(--figma-color-bg-selected-tertiary)',
        hover: 'var(--figma-color-bg-hover)',
      },
      borderColor: {
        primary: 'var(--figma-color-border)',
      },
      borderRadius: {
        2: 'var(--border-radius-2)',
        6: 'var(--border-radius-6)',
      },
      height: {
        500: '500px',
      },
      spacing: {
        '0_5': '2px',
        '1_5': '6px',
      },
    },
  },
  plugins: [],
  darkMode: ['class', '.figma-dark'],
}
