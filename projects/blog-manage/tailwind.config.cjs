/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false // 禁止预设样式
  },
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
