/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#18a058',
        // 文字颜色
        regular: {
          light: '#020617',
          dark: '#d1d5db'
        },
        secondary: {
          light: '#6b7280',
          dark: '#9ca3af'
        },
        page: {
          light: '#e9ecef',
          dark: '#141414'
        },
        block: {
          light: '#fff',
          dark: '#303030'
        },
        card: {
          light: '#fff',
          dark: '#1d1e1f'
        },
        content: {
          light: '#F7F8FAB2',
          dark: '#343434'
        },
        border: {
          light: '#e4e7ed',
          dark: '#282828'
        }
      }
    }
  },
  plugins: []
}
