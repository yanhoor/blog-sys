// import '@/assets/styles/index.css'

console.log('--------import-style-plugin-------')

export default defineNuxtPlugin({
  name: 'import-style-plugin',
  enforce: 'pre', // 或 'post'
  async setup(nuxtApp) {
    console.log('============import-style-plugin setup============')
    // 这相当于一个普通的功能性插件
  },
  hooks: {
    // 'app:created'() {
    //   const nuxtApp = useNuxtApp()
    //   console.log('============import-style-plugin app:app:created============')
    //   import('@/assets/styles/index.css')
    //   //
    // },
    // 这里可以直接注册Nuxt应用运行时钩子
    'app:beforeMount'() {
      const nuxtApp = useNuxtApp()
      console.log('============import-style-plugin app:beforeMount============')
      import('@/assets/styles/index.css')
      //
    }
  }
})
