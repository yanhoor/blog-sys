module.exports = {
  content: ['./src/**/*.{html,js,vue}'],
  corePlugins: {
    preflight: false // 禁止预设样式
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
  ],
  theme: {
    extend: {
      colors: {
        primary: '#18a058',
        page: {
          light: '#e9ecef',
          dark: '#1c1b22'
        },
        block: {
          light: '#fff',
          dark: '#303030'
        },
        card: {
          light: '#fff',
          dark: '#18181c'
        },
        content: {
          light: '#F7F8FAB2',
          dark: '#343434'
        },
        border: {
          light: '#e4e7ed',
          dark: '#282828'
        },
        // 文字颜色
        regular: {
          light: '#020617',
          dark: '#d1d5db'
        },
        secondary: {
          light: '#6b7280',
          dark: '#9ca3af'
        },
        placeholder: {
          light: '#A8ABB2',
          dark: '#8D9095'
        }
      }
    }
  }
}
