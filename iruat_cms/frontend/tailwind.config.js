/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: '#F5F0E8',
        cream: '#FAFAF5',
        accent: '#E53935',
        'accent-dark': '#C62828',
        ink: '#000000',
      },
      fontFamily: {
        display: ['"Space Mono"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000',
        'brutal-sm': '3px 3px 0px 0px #000',
        'brutal-lg': '6px 6px 0px 0px #000',
        'brutal-accent': '4px 4px 0px 0px #E53935',
      },
    },
  },
  plugins: [],
}
