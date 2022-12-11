import { createApp, App } from 'vue'
import AppVue from './App.vue'
import ElementPlus from 'element-plus'
import router from './routes'
import $http from '@/http'
import { createPinia } from 'pinia'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/message/style/css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './style.css'

const app = createApp(AppVue)

app.config.globalProperties.$http = $http
app.use(ElementPlus, {
  zIndex: 3000 ,
  locale: zhCn
})
app.use(router)
app.use(createPinia())

app.mount('#app')
